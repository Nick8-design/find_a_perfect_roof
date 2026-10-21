import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import './App.css';
import App from './App.jsx';

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'BAAk3YupY2v4yZQRp02DEqBrokdZO1m5Ct-vZsOT3m6ZR4yjn1qzJIbRFbiRLoCXugae4P19LZzKEgdLc8';

const initialPayPalOptions = {
  clientId: paypalClientId,
  currency: 'USD',
  intent: 'capture',
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider options={initialPayPalOptions}>
      <App />
    </PayPalScriptProvider>
  </StrictMode>
);
