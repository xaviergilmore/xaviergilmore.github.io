import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const container = document.getElementById('react-editor-root');
if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
