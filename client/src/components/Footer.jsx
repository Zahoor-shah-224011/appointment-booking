// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top section: Logo + columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Left: Logo + Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <img src={assets.logo} alt="Prescripto" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>

          {/* Middle: COMPANY */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-5">COMPANY</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">About us</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-blue-600 transition-colors">Delivery</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy policy</Link>
              </li>
            </ul>
          </div>

          {/* Right: GET IN TOUCH */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-5">GET IN TOUCH</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li>+0-000-000-000</li>
              <li>greatstackdev@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-5 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Copyright 2024 © Greatstack.dev - All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;