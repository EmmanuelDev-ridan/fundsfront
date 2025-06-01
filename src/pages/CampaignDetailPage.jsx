import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, DollarSign, Heart, Share2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { campaigns } from '../data/campaigns.js';
import AnimatedWrapper from '../components/AnimatedWrapper.jsx';
import FounderImage from './Images/Founder.jpg'; // Adjust the path as necessary

const CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rateToNGN: 437 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToNGN: 1100 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', rateToNGN: 13.16 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToNGN: 1200 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToNGN: 220 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rateToNGN: 100 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToNGN: 1806.49 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToNGN: 2139.45 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rateToNGN: 150.84 },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', rateToNGN: 30 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', rateToNGN: 448.11 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToNGN: 18.62 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToNGN: 11 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rateToNGN: 12.32 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', rateToNGN: 8 },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', rateToNGN: 1.2 },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', rateToNGN: 25 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateToNGN: 1 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rateToNGN: 10 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rateToNGN: 428 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', rateToNGN: 0.40 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', rateToNGN: 0.42 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToNGN: 1606.33 },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', rateToNGN: 2.5 },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', rateToNGN: 2.5 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToNGN: 88.26 }
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(campaigns.find(c => c.id === Number(id)));
  const [amount, setAmount] = useState(50);
  const [currency, setCurrency] = useState(CURRENCIES[3]); // Default to NGN
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [email, setEmail] = useState('');
  const [flutterwaveLoaded, setFlutterwaveLoaded] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const sendThankYouEmail = async (email, amount, campaignTitle) => {
    try {
      const response = await fetch('/api/send-thank-you-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          currency: currency.symbol,
          campaignTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send thank you email');
      }

      setEmailSent(true);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  };

  const scriptLoaded = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCampaign(campaigns.find(c => c.id === Number(id)));

    // Load Flutterwave script only once
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.onload = () => {
        setFlutterwaveLoaded(true);
        console.log('Flutterwave script loaded');
      };
      script.onerror = () => {
        console.error('Failed to load Flutterwave script');
        setPaymentError('Failed to load payment system. Please refresh the page.');
      };
      document.body.appendChild(script);
      scriptLoaded.current = true;
    }
  }, [id]);

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Investment opportunity not found
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          The investment opportunity you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);

    if (value && !isNaN(value) && Number(value) > 0) {
      setAmount(Number(value));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError('');
    setEmailSent(false);
    setPaymentError('');

    try {
      // Validate form fields
      if (!email) {
        throw new Error('Email are required!');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if Flutterwave is loaded
      if (typeof window.FlutterwaveCheckout !== 'function') {
        throw new Error('Payment system is not ready. Please try again.');
      }

      // Generate a unique transaction reference
      const transactionRef = `campaign_${campaign.id}_${Date.now()}`;

      window.FlutterwaveCheckout({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: transactionRef,
        amount: amount,
        currency: currency.code,
        payment_options: 'card,account,ussd,mobilemoney',
        customer: {
          email: email,
        },
        callback: async (response) => {
          // ALWAYS send email regardless of payment status
          try {
            // Send thank you email via API
            await sendThankYouEmail({
              email,
              amount,
              currency: currency.symbol,
              campaignTitle: campaign.title,
              transactionRef: response.transaction_id || transactionRef
            });

            setEmailSent(true);
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
          }

          // Handle payment status
          if (response.status === 'successful') {
            const amountInNGN = amount * currency.rateToNGN;
            setShowThankYouPopup(true);
            setCampaign(prev => ({
              ...prev,
              raised: prev.raised + amountInNGN,
              backers: prev.backers + 1
            }));
            alert('Payment successful! Thank you for your investment.');
          } else {
            setShowThankYouPopup(true);
            alert('Payment successful! Thank you for your investment.');
          }

          setLoading(false);
        },
        onclose: () => setLoading(false),
      });

    } catch (error) {
      setPaymentError(error.message);
      setLoading(false);
    }
  };

  return (
    <AnimatedWrapper animation="fade">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Campaign Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              &larr; Back to all investment opportunities
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {campaign.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
            {/* Left Column - Campaign Details */}
            <div>
              {/* Campaign Image */}
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-[100%] object-center object-conatin"
                />
              </div>

              {/* Campaign Progress */}
              <div className="mt-8 border-t border-b border-gray-200 py-6">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-100">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-orange-600">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-100">
                    <motion.div
                      style={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-600"
                    ></motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="flex items-center text-sm text-gray-500 mb-1">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      Raised
                    </p>
                    <p className="text-xl font-bold text-gray-900">₦{campaign.raised.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">of ₦{campaign.goal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="flex items-center text-sm text-gray-500 mb-1">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      Investors
                    </p>
                    <p className="text-xl font-bold text-gray-900">{campaign.backers}</p>
                    <p className="text-sm text-gray-500">supporters</p>
                  </div>
                  <div>
                    <p className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      Time Left
                    </p>
                    <p className="text-xl font-bold text-gray-900">{campaign.daysLeft}</p>
                    <p className="text-sm text-gray-500">days to go</p>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div className="mt-8 flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-20 w-12 rounded-lg" src={FounderImage} alt={FounderImage} />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-900">Project built by</h2>
                  <p className="text-sm text-gray-500">Ridan Express Founder</p>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Heart className="h-4 w-4 mr-2 text-gray-400" />
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Share2 className="h-4 w-4 mr-2 text-gray-400" />
                  Share
                </button>
              </div>
            </div>

            {/* Right Column - Donation and Description */}
            <div>
              {/* Investment Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-50 rounded-lg p-6 sticky top-8"
              >
                <h2 className="text-lg font-medium text-gray-900">Invest in this project</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Your investment will help bring Ridan Express to life.
                </p>


                <form onSubmit={handlePayment}>
                  <div className="mt-6">
                    <label htmlFor="currency" className="block text-sm font-medium text-orange-500">
                      Select Payment Currency
                    </label>
                    <div className="mt-1">
                      <select
                        id="currency"
                        className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        value={currency.code}
                        onChange={(e) => {
                          const selected = CURRENCIES.find(c => c.code === e.target.value);
                          setCurrency(selected);
                          setCustomAmount('');
                        }}
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.name} ({curr.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Investment Amount <span className='bg-orange-500 text-white rounded-full px-2 mx-3'>{currency.symbol}</span>
                    </label>
                    <div className="mt-1 flex gap-2 rounded-md shadow-sm">
                      <div className='flex'>
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          {currency.symbol}
                        </span>
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          className="focus:ring-orange-500 focus:border-orange-500 flex-1 p-2 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300"
                          min="1"
                          required
                          value={customAmount || amount}
                          onChange={handleCustomAmountChange}
                          placeholder={amount.toString()}
                        />
                      </div>

                    </div>
                    {/* <p className="mt-2 text-sm text-gray-500">
                      Equivalent to ₦{(amount * currency.rateToNGN).toLocaleString()}
                    </p> */}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAmount(1000)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <span>{currency.symbol}</span>1,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(10000)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <span>{currency.symbol}</span>10,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(50000)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <span>{currency.symbol}</span>50,000
                    </button>
                  </div>
                  <div className='mt-4'>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder='youremail@gmail.com'
                      className="mt-1 block w-full rounded-lg p-3 border border-orange-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !flutterwaveLoaded}
                    className={`w-full text-white py-3 rounded-md mt-6 ${flutterwaveLoaded && !loading
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {!flutterwaveLoaded ? 'Loading payment...' :
                      loading ? 'Processing...' : `Invest ${currency.symbol}${amount}`}
                  </button>

                  {emailSent ? (
                    <p className="text-green-600 mt-2 text-center">
                      Thank you for yout contribution😁
                    </p>
                  ) : paymentError ? (
                    <p className="text-red-500 mt-2 text-center">{paymentError}</p>
                  ) : null}

                  <p className="mt-4 text-xs text-gray-500 text-center">
                    Secure payment processed by Flutterwave. By investing, you agree to our terms and conditions.
                  </p>
                </form>
              </motion.div>

              {/* Campaign Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <h2 className="text-lg font-medium text-gray-900">About this project</h2>
                <div className="mt-4 prose prose-orange prose-lg text-gray-500">
                  <p>{campaign.longDescription}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      {showThankYouPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowThankYouPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-6">
                Your investment of {currency.symbol}{amount} in "{campaign.title}" has been received.
                We've sent a confirmation to {email}.
              </p>

              {/* <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-orange-700">
                  <span className="font-medium">Next steps:</span> Our team will contact you within 24 hours with additional details about your investment.
                </p>
              </div> */}

              <button
                onClick={() => setShowThankYouPopup(false)}
                className="w-full py-3 px-4 rounded-md bg-orange-600 text-white font-medium hover:bg-orange-700 focus:outline-none"
              >
                Continue Exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatedWrapper>
  );
}