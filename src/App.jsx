import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import CampaignDetailPage from './pages/CampaignDetailPage.jsx';
import AboutFounderPage from './pages/AboutFounderPage.jsx';
// import InvestorPage from './pages/InvestorPage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';

// AnimatePresence wrapper component with scroll to top functionality
function AnimatedRoutes() {
  const location = useLocation();
  
  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign/:id" element={<CampaignDetailPage />} />
        <Route path="/about-founder" element={<AboutFounderPage />} />
        {/* <Route path="/become-investor" element={<InvestorPage />} /> */}
        <Route path="/problems-we-solve" element={<ProblemsPage />} />
        <Route path="*" element={
          <div className="max-w-7xl mx-auto py-16 px-4 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Page not found</h2>
            <p className="mt-4 text-lg text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
          </div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  // Load fonts
  useEffect(() => {
    // Debug log for component mounting
    console.log('App component mounted successfully');

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    console.log('Custom fonts loaded');
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }

    // Apply default font-family to body as a fallback
    document.body.style.fontFamily = "'Poppins', sans-serif";
    
    // Make debug message visible if ?showDebug=true is in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showDebug') === 'true') {
      const debugElement = document.querySelector('.debug-message');
      if (debugElement) {
        debugElement.classList.remove('hidden');
      }
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <Header />
        <main className="flex-grow">
          {/* Debug message to confirm routing is attempted */}
          <div className="text-center py-4 bg-orange-100 text-orange-800 hidden debug-message">
            Debug: Router loaded. If you see this, routing may be misconfigured.
          </div>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
