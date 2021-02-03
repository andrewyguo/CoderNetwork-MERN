import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios'; 

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Set to 3000 so axios will not go to App.js base URL to make API Requests 
axios.defaults.baseURL = 'http://localhost:3000'; 

reportWebVitals();
