import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Linkedin, Mail, Twitter, User } from 'lucide-react';
import AnimatedWrapper, { AnimateOnScroll } from '../components/AnimatedWrapper.jsx';
import FounderImage from './Images/Founder.jpg'; // Replace with actual image path

export default function AboutFounderPage() {
  return (
    <AnimatedWrapper animation="fade">
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-orange-700">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-30"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2574&auto=format&fit=crop"
              alt="Team collaborating"
            />
            <div className="absolute inset-0 bg-orange-700 mix-blend-multiply" aria-hidden="true"></div>
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Meet Our Founder</h1>
            <p className="mt-6 max-w-2xl text-xl text-orange-100 mx-auto">
              The visionary behind Ridan Express who's revolutionizing e-commerce
            </p>
          </div>
        </div>

        {/* Founder Profile */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="lg:max-w-lg">
              <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
                <img
                  src={FounderImage}
                  alt="Founder - Akabudu Emmanuel"
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="mt-6 flex space-x-4">
                <a href="https://www.linkedin.com/in/emmanuel-onyedikachukwu-399825356?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600">
                  <Linkedin className="h-6 w-6 text-orange-500" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <h2 className="text-3xl font-extrabold text-gray-900">Akabudu Emmanuel</h2>
              <p className="mt-2 text-lg text-orange-600 font-medium">Founder & CEO</p>

              <div className="mt-6 prose prose-orange prose-lg text-gray-500">
                <p>
                  Akabudu Emmanuel is a 19yr old visionary entrepreneur with over 4 years of experience in e-commerce, software development and digital retail.
                  After identifying critical inefficiencies in traditional online shopping platforms, Emmanuel founded Ridan Express
                  with a mission to create a more intuitive, efficient, and customer-centric e-commerce experience.
                </p>
                <br />
                <p>
                  Emmanuel's journey into e-commerce began when He participated in a hackerton program at Gomycode and launched their first online store for a bakery (Ridan backery) from a small apartment in 2023.
                  Despite limited resources, the store quickly gained traction due to Emmanuel's innovative approach to customer experience
                  and social media marketing.
                </p>
                <br />
                <blockquote>
                  "The future of e-commerce isn't just about selling products online—it's about creating seamless, personalized
                  experiences that bring joy back to shopping. At Ridan Express, we're building technology that understands
                  people, not just transactions."
                </blockquote>
                <br />

                <h3>The Ridan Express Vision</h3>

                <p>
                  Under Emmanuel's leadership, Ridan Express aims to become not just an e-commerce platform but a system that will be inegrated with Web3 Technologies to make it easy for our customers to make payments Globaly.
                  The company is built on three core principles:
                </p>
                <br />
                <ul>
                  <li><strong>Simplicity:</strong> Making online shopping intuitive and frictionless</li>
                  <br />
                  <li><strong>Transparency:</strong> Clear pricing, honest reviews, and straightforward policies</li>
                  <br />
                  <li><strong>Innovation:</strong> Constantly improving through technology and customer feedback</li>
                </ul>
                <br />
                <p>
                  But Ridan Express is more than just another online marketplace. Emmanuel's vision extends to creating an ecosystem
                  where businesses of all sizes both local and international vendors can thrive. The platform's proprietary "Smart Retail" technology uses machine learning
                  to optimize product visibility, pricing, and inventory management, giving sellers an unprecedented advantage in the
                  digital marketplace.
                </p>
              </div>

              <div className="mt-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Support Our Vision
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AnimatedWrapper>
  );
}
