import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAEZpgSTI7F-MFdkkZhinsiP5BSdWczUog",
  authDomain: "full-stack-react-testblog.firebaseapp.com",
  projectId: "full-stack-react-testblog",
  storageBucket: "full-stack-react-testblog.firebasestorage.app",
  messagingSenderId: "995006679633",
  appId: "1:995006679633:web:c187754bae522cfb024670",
  measurementId: "G-Z6B395WF2Y"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
