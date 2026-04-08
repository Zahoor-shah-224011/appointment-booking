// src/main.jsx  or  src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';
import { AdminProvider } from './context/adimContext.jsx';
import { DoctorProvider } from './context/DoctorContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <HelmetProvider>
 <BrowserRouter>
  <AdminProvider>
    <DoctorProvider>
      <App />
    </DoctorProvider>
  </AdminProvider>
</BrowserRouter>
 </HelmetProvider>
);