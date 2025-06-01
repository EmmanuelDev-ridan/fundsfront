import { useState, useEffect } from 'react';
import { createInvestment, verifyPayment } from '../api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, ChevronUp, DollarSign, PieChart, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import AnimatedWrapper from '../components/AnimatedWrapper.jsx';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

export default function InvestorPage() {
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [transactionRef, setTransactionRef] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedTier, setSelectedTier] = useState('growth');
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const investmentTiers = {
    seed: {
      name: "Seed Investor",
      minAmount: 500,
      description: "Get in on the ground floor with our early supporter tier.",
      benefits: [
        "Quarterly investor updates",
        "Recognition on our investor page",
        "Early access to new platform features",
        "5% discount on platform fees for 1 year"
      ]
    },
    growth: {
      name: "Growth Partner",
      minAmount: 1000,
      description: "Help us scale with a mid-level investment option.",
      benefits: [
        "All Seed Investor benefits",
        "Semi-annual strategy call with founders",
        "Beta testing opportunities",
        "10% discount on platform fees for 2 years",
        "Invitation to annual investor meetup"
      ]
    },
    expansion: {
      name: "Expansion Catalyst",
      minAmount: 5000,
      description: "Accelerate our growth with significant backing.",
      benefits: [
        "All Growth Partner benefits",
        "Quarterly one-on-one calls with executive team",
        "Advisory board consideration",
        "15% discount on platform fees for 3 years",
        "VIP invitation to launch event",
        "Personalized onboarding for your business to the platform"
      ]
    }
  };

  const faqs = [
    {
      question: "What is the minimum investment?",
      answer: "Our minimum investment starts at $500 for our Seed Investor tier. We also offer Growth Partner ($1,000) and Expansion Catalyst ($5,000) tiers with additional benefits."
    },
    {
      question: "How will my investment be used?",
      answer: "Your investment will directly fund the development and launch of Ridan Express. Specifically, funds will be allocated to technology development (40%), marketing & customer acquisition (30%), operations & fulfillment infrastructure (20%), and legal & administrative costs (10%)."
    },
    {
      question: "What return can I expect on my investment?",
      answer: "While we cannot guarantee specific returns, investors will receive preferential terms based on their investment tier. This includes platform fee discounts, early access to new features, and priority placement for sellers. For investments above $10,000, we offer revenue share agreements—please contact us directly for details."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, all payments are processed through Flutterwave, a secure and trusted payment gateway with bank-grade encryption and compliance with international security standards."
    },
    {
      question: "Will I receive documentation for my investment?",
      answer: "Yes, upon successful investment, you'll receive a digital investment certificate, receipt, and welcome package with detailed terms of your investment. For investments over $1,000, we also provide a signed agreement outlining all benefits and terms."
    },
    {
      question: "Can I invest from outside the United States?",
      answer: "Yes, we accept international investors. However, certain countries may have restrictions. The Flutterwave payment system supports transactions from most countries. If you encounter any issues, please contact our investor relations team."
    }
  ];

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setAmount(investmentTiers[tier].minAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);

    if (value && !isNaN(value) && Number(value) > 0) {
      setAmount(Number(value));
    }
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    setPaymentError('');

    try {
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('email').value;

      if (!firstName || !lastName || !email) {
        throw new Error('All fields are required');
      }

      const response = await createInvestment({
        amount,
        currency: currency.code,
        tier: selectedTier,
        firstName,
        lastName,
        email
      });

      window.FlutterwaveCheckout({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: response.transactionRef,
        amount: amount,
        currency: currency.code,
        payment_options: 'card,account,ussd,mobilemoney',
        customer: {
          email: email,
          name: `${firstName} ${lastName}`,
        },
        callback: (response) => {
          if (response.status === 'successful') {
            setTransactionRef(response.tx_ref);
            verifyPayment(response.tx_ref);
            setShowThankYou(true);
          } else {
            setPaymentError('Payment failed or was cancelled');
            setLoading(false);
            setShowThankYou(true);
          }
        },
        onclose: () => setLoading(false),
      });

    } catch (error) {
      setPaymentError(error.message);
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <AnimatedWrapper animation="fade">
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-orange-700">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2574&auto=format&fit=crop"
              alt="Business growth"
            />
            <div className="absolute inset-0 bg-orange-700 mix-blend-multiply" aria-hidden="true"></div>
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Become an Investor</h1>
            <p className="mt-6 max-w-2xl text-xl text-orange-100">
              Join us in revolutionizing e-commerce. Your investment today will shape the future of online shopping tomorrow.
            </p>
            <div className="mt-10">
              <a href="#investment-options" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-orange-700 bg-white hover:bg-orange-50">
                View Investment Options <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Investment Benefits */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Why Invest With Us</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Fuel the future of e-commerce</p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Your investment helps build the next generation platform that will transform how people shop online.
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Growth Potential</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Get in early on a platform poised to disrupt the $4.9 trillion global e-commerce market.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other Benefit Cards */}
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                          <Users className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Exclusive Benefits</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Enjoy platform fee discounts, early access to features, and insider opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                          <ShieldCheck className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Investment</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Transparent use of funds with regular updates and secure payment processing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                          <PieChart className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Impact Driven</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Help create a platform that empowers businesses and improves the shopping experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Tiers */}
        <div id="investment-options" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Investment Options</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Choose your investment tier</p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Select the investment level that works for you and get exclusive benefits.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(investmentTiers).map((tier) => (
                <div
                  key={tier}
                  className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 ${selectedTier === tier
                    ? 'ring-2 ring-orange-500 transform scale-105'
                    : 'hover:shadow-lg'
                    }`}
                  onClick={() => handleTierSelect(tier)}
                >
                  <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                    <div>
                      <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-orange-100 text-orange-600">
                        {investmentTiers[tier].name}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                      ${investmentTiers[tier].minAmount.toLocaleString()}
                      <span className="ml-1 text-2xl font-medium text-gray-500">+</span>
                    </div>
                    <p className="mt-5 text-lg text-gray-500">{investmentTiers[tier].description}</p>
                  </div>
                  <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                    <ul role="list" className="space-y-4">
                      {investmentTiers[tier].benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" />
                          </div>
                          <p className="ml-3 text-base text-gray-700">{benefit}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <button
                        type="button"
                        className={`w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${selectedTier === tier
                          ? 'text-white bg-orange-600 hover:bg-orange-700'
                          : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                          }`}
                      >
                        {selectedTier === tier ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Investment Form */}
            <div className="mt-16 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handlePaymentSuccess();
                }}>
                  <h3 className="text-xl font-medium text-gray-900">Complete your investment</h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="currency" className="block text-sm font-medium text-orange-600">
                        Select Payment Currency
                      </label>
                      <div className="mt-1">
                        <select
                          id="currency"
                          className="block w-full rounded-md px-2 py-3 border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          value={currency.code}
                          onChange={(e) => {
                            const selected = CURRENCIES.find(c => c.code === e.target.value);
                            setCurrency(selected);
                          }}
                        >
                          {CURRENCIES.map((curr) => (
                            <option key={curr.code} value={curr.code}>
                              {curr.name} ({curr.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-2 text-xs text-gray-800">
                        investment will be processed in your selected currency {currency.name} ({currency.symbol}).
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Investment Amount <span className='bg-orange-500 text-white rounded-full px-3 mx-1'>{currency.symbol}</span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-orange-500 focus:border-orange-500 sm:text-sm border border-gray-300"
                          min={investmentTiers.seed.minAmount}
                          value={customAmount || amount}
                          onChange={handleCustomAmountChange}
                          placeholder={amount.toString()}
                        />
                      </div>
                      <p className="mt-4 text-sm text-orange-500">
                        Current tier: <span className="font-medium bg-gray-800 px-2 py-1 rounded-full text-xs text-white">{investmentTiers[selectedTier].name}</span>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          placeholder='Investor'
                          required
                          className="block w-full rounded-md px-2 py-3 border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          required
                          placeholder='Mark'
                          className="block w-full px-2 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder='example@gmail.com'
                          className="block w-full px-2 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:bg-gray-400 mt-6"
                  >
                    {loading ? 'Processing...' : 'Invest Now'}
                  </button>

                  {paymentError && (
                    <p className="text-red-500 mt-2 text-center">{paymentError}</p>
                  )}

                  <p className="mt-4 text-xs text-gray-500 text-center">
                    By proceeding with your investment, you agree to our investor terms and conditions.
                    All payments are securely processed via Flutterwave.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Use of Funds */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Transparency</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">How we'll use your investment</p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                We're committed to transparency. Here's exactly how your funds will help us build Ridan Express.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="relative bg-gray-50 p-6 rounded-lg">
                <div className="absolute top-0 right-0 -mt-4 mr-6 bg-orange-500 rounded-full p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-8">Technology Development (40%)</h3>
                <ul className="mt-4 text-base text-gray-500 space-y-2">
                  <li>• Website and mobile app development</li>
                  <li>• Payment processing integration</li>
                  <li>• Cloud infrastructure and security</li>
                  <li>• AI-powered product recommendations</li>
                  <li>• Search and discovery systems</li>
                </ul>
              </div>

              <div className="relative bg-gray-50 p-6 rounded-lg">
                <div className="absolute top-0 right-0 -mt-4 mr-6 bg-orange-500 rounded-full p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-8">Marketing & Customer Acquisition (30%)</h3>
                <ul className="mt-4 text-base text-gray-500 space-y-2">
                  <li>• Brand development and awareness</li>
                  <li>• Digital marketing campaigns</li>
                  <li>• Content creation and social media</li>
                  <li>• PR and launch events</li>
                  <li>• Strategic partnerships</li>
                </ul>
              </div>

              <div className="relative bg-gray-50 p-6 rounded-lg">
                <div className="absolute top-0 right-0 -mt-4 mr-6 bg-orange-500 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-8">Operations & Fulfillment (20%)</h3>
                <ul className="mt-4 text-base text-gray-500 space-y-2">
                  <li>• Inventory management systems</li>
                  <li>• Logistics and shipping integrations</li>
                  <li>• Customer service infrastructure</li>
                  <li>• Quality control processes</li>
                  <li>• Operational staffing</li>
                </ul>
              </div>

              <div className="relative bg-gray-50 p-6 rounded-lg">
                <div className="absolute top-0 right-0 -mt-4 mr-6 bg-orange-500 rounded-full p-3">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-8">Legal & Administrative (10%)</h3>
                <ul className="mt-4 text-base text-gray-500 space-y-2">
                  <li>• Business registration and licensing</li>
                  <li>• Legal compliance and contracts</li>
                  <li>• Intellectual property protection</li>
                  <li>• Financial systems and accounting</li>
                  <li>• Insurance and risk management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Questions Answered</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Frequently Asked Questions</p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Everything you need to know about investing in Ridan Express.
              </p>
            </div>

            <div className="mt-12 space-y-6 divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="pt-6">
                  <div>
                    <button
                      className="text-left w-full flex justify-between items-start text-gray-900"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="text-lg font-medium">{faq.question}</span>
                      <span className="ml-6 h-7 flex items-center">
                        {activeFaq === index ? (
                          <ChevronUp className="h-6 w-6 text-orange-500" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-orange-500" />
                        )}
                      </span>
                    </button>
                  </div>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pr-12 overflow-hidden"
                      >
                        <p className="text-base text-gray-500">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-base text-gray-500">
                Have more questions? Contact our investor relations team.
              </p>
              {/* <Link
                to="emma"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
              >
                Contact Us
              </Link> */}
            </div>
          </div>
        </div>
        
      </div>

      <AnimatePresence>
        {showThankYou && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300
                }
              }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    transition: {
                      duration: 0.5,
                      times: [0, 0.7, 1]
                    }
                  }}
                >
                  <CheckCircle className="h-20 w-20 text-green-500" strokeWidth={1.5} />
                </motion.div>
              </div>

              <motion.h2
                className="text-3xl font-bold text-center text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.2 }
                }}
              >
                Thank You!
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 text-center mb-1"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.3 }
                }}
              >
                Your investment of{" "}
                <span className="font-bold text-orange-600">
                  {currency.symbol}{amount.toLocaleString()}
                </span>{" "}
                as a
              </motion.p>

              <motion.div
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2 px-4 rounded-full text-center text-xl my-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: 0.4,
                    type: "spring",
                    stiffness: 300
                  }
                }}
              >
                {investmentTiers[selectedTier].name}
              </motion.div>

              <motion.p
                className="text-center text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.5 }
                }}
              >
                We'll keep you updated on our progress and next steps. Your support means the world to us!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.6 }
                }}
                className="flex justify-center"
              >
                <button
                  onClick={() => setShowThankYou(false)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedWrapper>
  );
}