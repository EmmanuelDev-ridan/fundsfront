// api/investments.js
const express = require('express');
const Flutterwave = require('flutterwave-node-v3');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Production-ready TLS configuration
    ciphers: 'TLS_AES_256_GCM_SHA384',
    minVersion: 'TLSv1.3',
    rejectUnauthorized: true
  }
});

// MongoDB connection with caching for serverless environments
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferMaxEntries: 0
  });
  
  cachedDb = db;
  return db;
}

// Schema definitions
const InvestorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
  createdAt: { type: Date, default: Date.now }
});

const InvestmentSchema = new mongoose.Schema({
  amount: Number,
  tier: String,
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor' },
  transactionRef: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  flutterwaveId: String,
  createdAt: { type: Date, default: Date.now }
});

const Investor = mongoose.model('Investor', InvestorSchema);
const Investment = mongoose.model('Investment', InvestmentSchema);

// Secure signature comparison (prevents timing attacks)
function secureCompare(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

// Create investment route
router.post('/', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { amount, tier, firstName, lastName, email } = req.body;

    // Validate input
    const errors = [];
    if (!firstName || firstName.trim().length < 2) errors.push('Valid first name is required');
    if (!lastName || lastName.trim().length < 2) errors.push('Valid last name is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
    if (!amount || isNaN(amount) || amount < 50) errors.push('Investment amount must be at least $50');
    if (!['seed', 'growth', 'expansion'].includes(tier)) errors.push('Invalid investment tier');
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }

    // Create or find investor
    let investor = await Investor.findOne({ email: email.toLowerCase() });
    if (!investor) {
      investor = new Investor({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.toLowerCase().trim(),
        investments: []
      });
      await investor.save();
    }

    // Generate secure transaction reference
    const transactionRef = `RIDAN-${crypto.randomBytes(8).toString('hex').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Create investment record
    const investment = new Investment({
      amount: parseFloat(amount).toFixed(2),
      tier,
      investor: investor._id,
      transactionRef,
      status: 'pending',
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    await investment.save();
    investor.investments.push(investment._id);
    await investor.save();

    res.status(201).json({
      message: 'Payment initialized',
      transactionRef,
      amount,
      tier
    });

  } catch (error) {
    console.error('Investment creation error:', error);
    res.status(500).json({
      error: 'Failed to create investment',
      details: process.env.NODE_ENV === 'production' 
        ? 'Please try again later' 
        : error.message
    });
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await connectToDatabase();
    
    // Verify webhook signature
    const signature = req.headers['verif-hash'];
    if (!signature) {
      console.warn('Missing webhook signature');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const computedSignature = crypto
      .createHmac('sha256', process.env.FLUTTERWAVE_WEBHOOK_HASH)
      .update(req.body)
      .digest('hex');
      
    if (!secureCompare(signature, computedSignature)) {
      console.warn('Invalid webhook signature');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = JSON.parse(req.body.toString());
    if (payload.event === 'charge.completed') {
      const transaction = payload.data;

      // Validate transaction data
      if (!transaction.customer || !transaction.customer.email || !transaction.amount) {
        console.warn('Invalid transaction data', transaction);
        return res.status(400).json({ error: 'Invalid transaction data' });
      }

      const { email, name } = transaction.customer;
      const amount = parseFloat(transaction.amount);

      // Find or create investor
      let investor = await Investor.findOne({ email: email.toLowerCase() });
      if (!investor) {
        investor = new Investor({ 
          name: name || 'Investor', 
          email: email.toLowerCase(),
          investments: []
        });
        await investor.save();
      }

      // Determine tier based on amount (USD)
      let tier = 'seed';
      if (amount >= 5000) tier = 'expansion';
      else if (amount >= 1000) tier = 'growth';

      // Create investment record
      const investment = new Investment({
        amount,
        tier,
        investor: investor._id,
        transactionRef: transaction.tx_ref || transaction.id,
        status: 'success',
        flutterwaveId: transaction.id,
        metadata: {
          processedAt: new Date(),
          currency: transaction.currency
        }
      });

      await investment.save();
      investor.investments.push(investment);
      await investor.save();

      // Send confirmation email with retries
      await sendInvestmentEmailWithRetry(email, investor.name, amount, tier, 3);

      console.log(`Processed successful investment: ${transaction.id} for ${email}`);
      return res.status(200).json({ success: true });
    }
    
    res.status(200).end();
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'production'
        ? null
        : error.message
    });
  }
});

// Verification endpoint
router.get('/verify/:transactionRef', async (req, res) => {
  try {
    await connectToDatabase();
    
    // Validate transaction reference format
    if (!/^RIDAN-[A-F0-9]{16}-\d{6}$/.test(req.params.transactionRef)) {
      return res.status(400).json({ error: 'Invalid transaction reference format' });
    }

    const investment = await Investment.findOne({
      transactionRef: req.params.transactionRef
    }).populate('investor', 'name email');

    if (!investment) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Omit sensitive data
    const response = {
      status: investment.status,
      amount: investment.amount,
      tier: investment.tier,
      investor: {
        name: investment.investor.name,
        email: investment.investor.email
      },
      date: investment.createdAt
    };

    res.json(response);

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'production'
        ? null
        : error.message
    });
  }
});

// Email template configuration
const getTierBenefits = (tier) => {
  const tiers = {
    seed: {
      title: 'Seed Investor',
      benefits: [
        'Exclusive early access to product releases',
        'Quarterly investor performance reports',
        'Founder Q&A sessions',
        'Priority customer support',
        'Digital investor certificate'
      ],
      color: '#4CAF50',
      icon: '🌱'
    },
    growth: {
      title: 'Growth Investor',
      benefits: [
        'All Seed Investor benefits',
        'Special edition merchandise package',
        'Annual investor retreat invitation',
        'Early profit-sharing eligibility',
        'Personalized investment portfolio review'
      ],
      color: '#2196F3',
      icon: '🚀'
    },
    expansion: {
      title: 'Expansion Investor',
      benefits: [
        'All Growth Investor benefits',
        'Board meeting observer status',
        '1-on-1 consultations with founders',
        'Equity stake options',
        'VIP launch event invitations',
        'Priority access to new investment opportunities'
      ],
      color: '#9C27B0',
      icon: '💎'
    }
  };

  return tiers[tier] || {
    title: 'Investor',
    benefits: [
      'Thank you for your investment in Ridan Express'
    ],
    color: '#607D8B',
    icon: '🙏'
  };
};

// Email sending with retry logic
const sendInvestmentEmailWithRetry = async (email, name, amount, tier, maxRetries) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const success = await sendInvestmentEmail(email, name, amount, tier);
      if (success) return true;
      
      attempt++;
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = 2000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Email attempt ${attempt + 1} failed for ${email}:`, error);
      attempt++;
    }
  }
  
  console.error(`Failed to send email to ${email} after ${maxRetries} attempts`);
  return false;
};

// Send investment confirmation email
const sendInvestmentEmail = async (email, name, amount, tier) => {
  const tierInfo = getTierBenefits(tier);
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"Ridan Express Investor Relations" <${process.env.EMAIL_FROM || 'investors@ridexpress.com'}>`,
    to: email,
    subject: `${tierInfo.icon} Thank You for Your ${tierInfo.title} Investment in Ridan Express`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Investment Confirmation</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          }
          body {
            background-color: #f7f9fc;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 650px;
            margin: 30px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          }
          .header {
            background: linear-gradient(135deg, #0d3b66 0%, #1a659e 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .logo {
            width: 180px;
            margin-bottom: 20px;
          }
          .tier-badge {
            background: ${tierInfo.color};
            color: white;
            padding: 8px 25px;
            border-radius: 30px;
            display: inline-block;
            font-weight: 700;
            font-size: 18px;
            letter-spacing: 0.5px;
            margin: 15px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .content {
            padding: 40px;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #fff;
          }
          h2 {
            font-size: 22px;
            color: #1a659e;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f4f8;
          }
          h3 {
            font-size: 19px;
            color: ${tierInfo.color};
            margin: 25px 0 15px;
          }
          p {
            margin-bottom: 15px;
            font-size: 16px;
            color: #444;
          }
          .highlight-box {
            background: #f0f8ff;
            border-left: 4px solid ${tierInfo.color};
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
          }
          .amount {
            font-size: 36px;
            font-weight: 800;
            color: #2e7d32;
            margin: 20px 0;
            text-align: center;
          }
          .benefits-list {
            margin: 25px 0;
            padding-left: 25px;
          }
          .benefits-list li {
            margin-bottom: 12px;
            position: relative;
            padding-left: 30px;
          }
          .benefits-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: ${tierInfo.color};
            font-weight: bold;
            font-size: 18px;
          }
          .footer {
            background: #0d3b66;
            color: #e0f7ff;
            padding: 30px;
            text-align: center;
            font-size: 14px;
          }
          .contact-info {
            margin: 20px 0;
            line-height: 1.8;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 12px;
            color: #a3d5ff;
            text-decoration: none;
            transition: color 0.3s;
          }
          .social-links a:hover {
            color: white;
          }
          .button {
            display: inline-block;
            background: ${tierInfo.color};
            color: white !important;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 8px;
            font-weight: 600;
            margin: 25px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.15);
          }
          .disclaimer {
            font-size: 12px;
            color: #a3d5ff;
            margin-top: 25px;
            line-height: 1.6;
          }
          .signature {
            margin-top: 25px;
            font-style: italic;
          }
          .info-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            border: 1px solid #eaeaea;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: 600;
            width: 150px;
            color: #555;
          }
          .info-value {
            flex: 1;
            color: #222;
          }
          @media (max-width: 600px) {
            .content {
              padding: 25px;
            }
            .header {
              padding: 30px 15px;
            }
            h1 {
              font-size: 24px;
            }
            .amount {
              font-size: 28px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ridan Express</h1>
            <div class="tier-badge">${tierInfo.title}</div>
            <p>Investment Confirmation</p>
          </div>
          
          <div class="content">
            <p>Dear ${name},</p>
            
            <div class="highlight-box">
              <p>On behalf of the entire team at Ridan Express, we extend our deepest gratitude for your investment. Your commitment as a <strong>${tierInfo.title}</strong> is pivotal to our shared success and the realization of our vision to transform e-commerce in Africa.</p>
            </div>
            
            <h2>Investment Details</h2>
            
            <div class="info-card">
              <div class="info-row">
                <div class="info-label">Investment Amount:</div>
                <div class="info-value">${formattedAmount} USD</div>
              </div>
              <div class="info-row">
                <div class="info-label">Investment Tier:</div>
                <div class="info-value" style="color:${tierInfo.color}; font-weight:600">${tierInfo.title}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date of Investment:</div>
                <div class="info-value">${currentDate}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Investment ID:</div>
                <div class="info-value">RID-${Date.now().toString().slice(-8)}</div>
              </div>
            </div>
            
            <h3>${tierInfo.icon} Your ${tierInfo.title} Benefits</h3>
            <ul class="benefits-list">
              ${tierInfo.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            
            <h3>What Happens Next</h3>
            <p>Within the next 72 hours, you'll receive:</p>
            <ul class="benefits-list">
              <li>Official investment certificate via email</li>
              <li>Welcome package with detailed investor information</li>
              <li>Personal introduction from our Investor Relations team</li>
            </ul>
            
            <p>As part of our commitment to transparency, you'll receive quarterly performance reports and exclusive updates on our progress.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.BASE_URL || 'https://your-app.vercel.app'}/investor-portal" class="button">Access Your Investor Portal</a>
            </div>
            
            <div class="signature">
              <p>With gratitude,</p>
              <p><strong>Sarah Johnson</strong><br>
              Head of Investor Relations<br>
              Ridan Express</p>
              <p style="margin-top: 10px;">
                <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@ridexpress.com'}" style="color: #1a659e;">${process.env.SUPPORT_EMAIL || 'support@ridexpress.com'}</a><br>
                +1 (234) 567-8900
              </p>
            </div>
          </div>
          
          <div class="footer">
            <div class="contact-info">
              <p>Ridan Express Headquarters<br>
              123 Innovation Drive, Tech District<br>
              Lagos, Nigeria 100001</p>
            </div>
            
            <div class="social-links">
              <a href="https://linkedin.com/company/ridexpress" target="_blank">LinkedIn</a>
              <a href="https://twitter.com/ridexpress" target="_blank">Twitter</a>
              <a href="https://facebook.com/ridexpress" target="_blank">Facebook</a>
              <a href="https://instagram.com/ridexpress" target="_blank">Instagram</a>
            </div>
            
            <p>Need assistance? Contact our investor support team:<br>
            <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@ridexpress.com'}" style="color: #a3d5ff;">${process.env.SUPPORT_EMAIL || 'support@ridexpress.com'}</a></p>
            
            <p class="disclaimer">
              This message contains confidential information and is intended only for the recipient. 
              Any unauthorized review, use, disclosure, or distribution is prohibited.<br><br>
              
              Investment involves risks. Past performance is not indicative of future results. 
              Ridan Express © ${new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    return false;
  }
};

module.exports = router;
