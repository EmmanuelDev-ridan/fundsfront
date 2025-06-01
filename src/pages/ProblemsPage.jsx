import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, DollarSign, Search, ShieldCheck, Zap } from 'lucide-react';
import AnimatedWrapper, { AnimateOnScroll } from '../components/AnimatedWrapper.jsx';

export default function ProblemsPage() {
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedWrapper animation="fade">
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-orange-700">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=2574&auto=format&fit=crop"
              alt="E-commerce problems"
            />
            <div className="absolute inset-0 bg-orange-700 mix-blend-multiply" aria-hidden="true"></div>
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Problems We're Solving</h1>
            <p className="mt-6 max-w-2xl text-xl text-orange-100">
              E-commerce is booming, but significant challenges remain. Ridan Express is tackling these problems head-on with innovative solutions.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-left lg:text-center">
            <p className="text-base font-semibold text-orange-600 tracking-wide uppercase">Our Mission</p>
            <h2 className="mt-1 text-3xl lg:text-4xl font-extrabold text-gray-900 sm:text-2xl sm:tracking-tight">Revolutionizing E-commerce</h2>
            <div className=' w-[20%] lg:mx-auto rounder-full py-0.5 bg-orange-600 mt-1 block lg:hidden '></div>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Despite the growth of online shopping, merchants and consumers still face significant challenges.
              Ridan Express is building solutions to transform the e-commerce landscape.
            </p>
          </div>
        </div>

        {/* Problems and Solutions */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Core Problems We're Addressing</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Ridan Express is focused on solving these critical e-commerce challenges
            </p>
          </div>

          <motion.div
            className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Problem 1 */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="relative p-6 py-5 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 -mt-6 mr-6">
                  <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                    <Search className="h-6 w-6 mt-10 text-white" />
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mt-8">Poor Search & Discovery</h3>
                <p className="mt-4 text-base text-gray-500">
                  Most e-commerce platforms have inefficient search algorithms that make it difficult for shoppers to find what they're looking for. Studies show that 72% of users abandon purchases when they can't find products easily.
                </p>
                <div className="mt-6 bg-orange-50 p-4 rounded-md">
                  <h4 className="flex items-center text-sm font-medium text-orange-800">
                    <Check className="h-5 w-5 mr-2 text-orange-600" />
                    Our Solution
                  </h4>
                  <p className="mt-2 text-sm text-orange-700">
                    Ridan Express uses AI-powered search with natural language processing to understand shopper intent, providing context-aware results that match what customers are actually looking for.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Problem 2 */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="relative p-6 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 -mt-6 mr-6">
                  <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                    <Clock className="h-6 w-6 mt-10 text-white" />
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mt-8">UI/UX Complexity in E-commerce Platforms</h3>
                <p className="mt-4 text-base text-gray-500">
                  Most e-commerce platforms have complex, cluttered UIs that confuse users,
                  slow down navigation, and mix up buyer and seller experiences.
                  This leads to poor usability and trust issues.</p>
                <div className="mt-6 bg-orange-50 p-4 rounded-md">
                  <h4 className="flex items-center text-sm font-medium text-orange-800">
                    <Check className="h-5 w-5 mr-2 text-orange-600" />
                    Our Solution
                  </h4>
                  <p className="mt-2 text-sm text-orange-700">
                    Ridan Express uses a clean, role-based UI, separating buyer
                    and seller dashboards. It focuses on a mobile-first, task-driven design,
                    making shopping, selling, and order tracking simple, fast, and transparent.</p>
                </div>
              </div>
            </motion.div>

            {/* Problem 3 */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="relative p-6 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 -mt-6 mr-6">
                  <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                    <ShieldCheck className="h-6 w-6 mt-10 text-white" />
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mt-8">Trust & Security Concerns</h3>
                <p className="mt-4 text-base text-gray-500">
                  49% of consumers cite security concerns as a major barrier to online shopping. Fake reviews, counterfeit products, and data breaches have eroded consumer trust in e-commerce platforms.
                </p>
                <div className="mt-6 bg-orange-50 p-4 rounded-md">
                  <h4 className="flex items-center text-sm font-medium text-orange-800">
                    <Check className="h-5 w-5 mr-2 text-orange-600" />
                    Our Solution
                  </h4>
                  <p className="mt-2 text-sm text-orange-700">
                    Ridan Express implements blockchain-verified product authenticity, AI-powered review verification, and bank-level encryption for all transactions and personal data.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Problem 4 */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="relative p-6 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 -mt-6 mr-6">
                  <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                    <DollarSign className="h-6 w-6 mt-10 text-white" />
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mt-8">Hidden Costs & Pricing</h3>
                <p className="mt-4 text-base text-gray-500">
                  64% of shoppers abandon carts due to unexpected shipping costs and fees revealed only at checkout. This lack of transparency damages customer trust and increases returns.
                </p>
                <div className="mt-6 bg-orange-50 p-4 rounded-md">
                  <h4 className="flex items-center text-sm font-medium text-orange-800">
                    <Check className="h-5 w-5 mr-2 text-orange-600" />
                    Our Solution
                  </h4>
                  <p className="mt-2 text-sm text-orange-700">
                    Our platform shows all-inclusive pricing from the start, with transparent fee structures and real-time shipping calculations based on location, eliminating surprise costs at checkout.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Competitive Advantage */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Our Competitive Advantage
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  While other platforms address individual issues, Ridan Express takes a holistic approach to transform the entire e-commerce experience.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">AI-Powered Personalization</span> - Tailors the shopping experience to each user's preferences and behavior
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Seamless Omnichannel Experience</span> - Consistent shopping experience across web, mobile, and in-store
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Seller-Friendly Tools</span> - Empowers merchants with analytics, inventory management, and marketing automation
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Community-Driven Shopping</span> - Social elements that foster connection between buyers and sellers
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <Zap className="h-12 w-12 text-orange-500" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <DollarSign className="h-12 w-12 text-orange-500" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <ShieldCheck className="h-12 w-12 text-orange-500" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <Search className="h-12 w-12 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-orange-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to invest in the future?</span>
              <span className="block text-orange-600">Join us in transforming e-commerce today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/become-investor"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  Become an Investor
                  <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  to="/about-founder"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50"
                >
                  Learn About the Founder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}
