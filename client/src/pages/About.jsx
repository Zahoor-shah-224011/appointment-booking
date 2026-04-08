// src/pages/About.jsx
import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
const About = () => {

   const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
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
        {/* About Us Section */}
        <div className="text-center mb-10">
        
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">ABOUT US</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={assets.about_image} // or any suitable doctor/team image from assets (e.g. group_profiles or header_img)
              alt="Prescripto Team"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">WHY CHOOSE US</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 - EFFICIENCY */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:bg-primary hover:text-white hover:shadow-xl transition-all duration-300 group">
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white">EFFICIENCY</h3>
            <p className="text-gray-700 group-hover:text-white/90 leading-relaxed">
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          {/* Card 2 - CONVENIENCE */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:bg-primary hover:text-white hover:shadow-xl transition-all duration-300 group">
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white">CONVENIENCE</h3>
            <p className="text-gray-700 group-hover:text-white/90 leading-relaxed">
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          {/* Card 3 - PERSONALIZATION */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:bg-primary hover:text-white hover:shadow-xl transition-all duration-300 group">
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white">PERSONALIZATION</h3>
            <p className="text-gray-700 group-hover:text-white/90 leading-relaxed">
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;