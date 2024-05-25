import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Alchemy, Network } from 'alchemy-sdk';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configure the Alchemy object
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY, // Ensure this is set in your .env file
  network: Network.ETH_MAINNET, // Replace with the desired network
};

const alchemy = new Alchemy(settings);

// Create a QueryClient instance for react-query
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App alchemy={alchemy} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
