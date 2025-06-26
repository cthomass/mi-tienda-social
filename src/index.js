import React from 'react'; // Imports React library
import ReactDOM from 'react-dom/client'; // Imports ReactDOM for rendering to the DOM
import './index.css'; // Imports global CSS styles (optional)
import App from './App'; // Imports your main application component

// Gets the root HTML element where the React app will be mounted
const rootElement = document.getElementById('root'); 

// Creates a React root for concurrent mode rendering
const root = ReactDOM.createRoot(rootElement);

// Renders the main App component within a StrictMode wrapper for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
