import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, DollarSign, Heart, Share2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { campaigns } from '../data/campaigns.js';
import AnimatedWrapper from '../components/AnimatedWrapper.jsx';
import FounderImage from './Images/founder.jpg'; // Adjust the path as necessary

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rateToNGN: 1500 },
    { code: 'EUR', name: 'Euro', symbol: '€', rateToNGN: 1600 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rateToNGN: 1900 },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateToNGN: 1 },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rateToNGN: 12 },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rateToNGN: 120 },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToNGN: 80 }
];

export default function CampaignDetailPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(campaigns.find(c => c.id === Number(id)));
    const [amount, setAmount] = useState(50);
    const [currency, setCurrency] = useState(CURRENCIES[3]); // Default to NGN
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        setCampaign(campaigns.find(c => c.id === Number(id)));
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

        try {
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;

            if (!firstName || !lastName || !email) {
                throw new Error('All fields are required');
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
                    email: email
                },
                callback: (response) => {
                    if (response.status === 'successful') {
                        // Convert amount to NGN for campaign tracking
                        const amountInNGN = amount * currency.rateToNGN;
                        setCampaign(prev => ({
                            ...prev,
                            raised: prev.raised + amountInNGN,
                            backers: prev.backers + 1
                        }));
                        alert('Payment successful! Thank you for your investment.');
                    } else {
                        setPaymentError('Payment failed or was cancelled');
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
                                    className="w-full h-96 object-center object-cover"
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
                                    <img className="h-20 w-12  rounded-lg" src={FounderImage} alt={FounderImage} />
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
                                className="bg-gray-50 rounded-lg p-6 border border-orange-600 sticky top-8"
                            >
                                <h2 className="text-lg font-medium text-gray-900">Invest in this project</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Your investment will help bring Ridan Express to life.
                                </p>

                                <form onSubmit={handlePayment}>
                                    <div className="mt-6">
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                            Payment Currency
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="currency"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
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
                                        <p className="mt-2 text-sm text-gray-500">
                                            Campaign goal is in NGN. Payment will be processed in your selected currency.
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                            Investment Amount ({currency.symbol})
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                {currency.symbol}
                                            </span>
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                className="focus:ring-orange-500 focus:border-orange-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                min="1"
                                                value={customAmount || amount}
                                                onChange={handleCustomAmountChange}
                                                placeholder={amount.toString()}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Equivalent to ₦{(amount * currency.rateToNGN).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:bg-gray-400 mt-6"
                                    >
                                        {loading ? 'Processing...' : `Invest ${currency.symbol}${amount}`}
                                    </button>

                                    {paymentError && (
                                        <p className="text-red-500 mt-2 text-center">{paymentError}</p>
                                    )}

                                    <p className="mt-4 text-xs text-gray-500 text-center">
                                        By proceeding with your investment, you agree to our investor terms and conditions.
                                        All payments are securely processed via Flutterwave.
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
        </AnimatedWrapper>
    );
}