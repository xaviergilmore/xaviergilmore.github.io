import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Check for the custom ID first, fallback to standard Vite default if needed
const container = document.getElementById('react-editor-root') || document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // If this triggers, your HTML layout is missing the mount element entirely
  console.error("React Core Error: Target mounting container ('react-editor-root' or 'root') was not found in the DOM.");
}

