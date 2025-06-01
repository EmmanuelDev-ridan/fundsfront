// Backend route (e.g., routes/email.js)
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

router.post('/send-thank-you-email', async (req, res) => {
  const { email, amount, currency, campaignTitle } = req.body;

  const mailOptions = {
    from: '"Ridan Express" <support@ridexpress.com>',
    to: email,
    subject: 'Thank You for Your Investment!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Thank You for Investing in ${campaignTitle}!</h2>
        <p>We're thrilled to confirm your investment of ${currency}${amount}.</p>
        <p>Your support is helping bring this project to life. We'll keep you updated on the project's progress.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p>Warm regards,</p>
          <p><strong>The Ridan Express Team</strong></p>
          <img src="https://ridexpress.com/logo.png" alt="Ridan Express" width="120" />
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email' 
    });
  }
});

module.exports = router;