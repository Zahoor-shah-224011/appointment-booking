// src/pages/Contact.jsx
import React from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';



import { IoArrowBack } from 'react-icons/io5';




const Contact = () => {
   const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
         <button
                          onClick={() => {
                            navigate('/');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                            className="inline-flex items-center justify-center gap-2 text-primary font-medium hover:text-primary-dull transition-all duration-300 self-start md:self-auto transition group-hover:translate-x-1"
                        >
                         <div className="group inline-flex items-center mb-4 cursor-pointer">
                        <IoArrowBack className="w-7 h-7 transition-transform duration-200  group-hover:-translate-x-1" />
                        <span className="ml-1"> </span>
                      </div>
                         
                        </button>
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">CONTACT US</h1>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={assets.contact_image} // Use the contact_image.png from your assets
              alt="Doctor with patient"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-12">
            
            {/* Our Office */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">OUR OFFICE</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  000000 Wills Station<br />
                  Suite 000, Washington, USA
                </p>
                <p>
                  Tel: (000) 000-0000<br />
                  Email: greatstackdev@gmail.com
                </p>
              </div>
            </div>

            {/* Careers */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">CAREERS AT PRESCRIPTO</h2>
              <p className="text-lg text-gray-700 mb-6">
                Learn more about our teams and job openings.
              </p>
              <Link
                to="/careers" // or external link if you have one
                className="inline-block px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-blue-700 transition shadow-md"
              >
                Explore Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;