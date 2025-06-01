import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { DebugApp } from './App.debug.jsx'
import './index.css'

// Add extensive debug logging to help identify rendering issues
console.log('Initializing Ridan Express Fundraising App');
console.log('Using App.jsx component');

// Check if debug mode is requested in URL
const urlParams = new URLSearchParams(window.location.search);
const debugMode = urlParams.get('debug') === 'true';

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found, rendering app');
  
  try {
    // If in debug mode, render the debug version
    if (debugMode) {
      console.log('Debug mode enabled, rendering DebugApp');
      createRoot(rootElement).render(
        <StrictMode>
          <DebugApp />
        </StrictMode>,
      );
    } else {
      // Otherwise render the normal app
      createRoot(rootElement).render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback to debug app if main app fails
    createRoot(rootElement).render(
      <StrictMode>
        <DebugApp />
      </StrictMode>,
    );
  }
} else {
  console.error('Root element not found, cannot mount React app');
}
