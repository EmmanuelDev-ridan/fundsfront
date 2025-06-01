// This is a minimal debug version of the app to help troubleshoot rendering issues
import { useState, useEffect } from 'react';
import './index.css';

export function DebugApp() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('Debug App mounted');
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Ridan Express - Debug Mode</h1>
      
      <div className="bg-white shadow rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>
        
        <div className="space-y-4">
          <div>
            <p className="font-medium">App Status:</p>
            <p className="text-green-600">✓ React is running</p>
            <p className={isLoaded ? "text-green-600" : "text-red-600"}>
              {isLoaded ? "✓ Component state is working" : "✗ Component state failed"}
            </p>
          </div>
          
          <div>
            <p className="font-medium">Common Issues:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Check browser console for JavaScript errors</li>
              <li>Verify all imports use .jsx extension (not .tsx)</li>
              <li>Ensure root element exists in index.html</li>
              <li>Clear browser cache and reload</li>
              <li>Try a different browser</li>
            </ul>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p>To access the main app, remove "?debug=true" from the URL and refresh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// This can be used as a fallback if the main app fails to render
export default function App() {
  const [useDebugMode, setUseDebugMode] = useState(false);
  
  useEffect(() => {
    // Check if debug mode is requested or if there was a previous render error
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    const hasRenderError = sessionStorage.getItem('renderError') === 'true';
    
    setUseDebugMode(debugMode || hasRenderError);
    
    // Set error handler to catch render errors
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      sessionStorage.setItem('renderError', 'true');
      // Reload in debug mode if not already there
      if (!debugMode) {
        window.location.href = '/?debug=true';
      }
    });
    
    console.log('Main or Debug App initialized');
  }, []);
  
  try {
    // If in debug mode, render the simplified debug interface
    if (useDebugMode) {
      return <DebugApp />;
    }
    
    // Otherwise, try to import and render the real app
    // This dynamic import is just for the fallback mechanism
    // The actual app should be imported normally at the top
    const RealApp = require('./App.jsx').default;
    return <RealApp />;
  } catch (error) {
    console.error('Failed to render app:', error);
    return <DebugApp />;
  }
}
