// src/components/BottomBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const BottomBanner = () => {
  return (
    <section className="relative bg-primary overflow-hidden rounded-2xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left - Text + Button */}
          <div className="text-center lg:text-left">
            <h2 className="text-white text-3xl sm:text-3.5xl lg:text-4xl xl:text-4.5xl font-bold leading-snug">
              Book Appointment
              <br />
              With 100+ Trusted Doctors
            </h2>

            <div className="mt-5 lg:mt-6">
              <Link
                to="/Login"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block px-8 py-2.5 lg:px-9 lg:py-3 bg-white text-primary font-medium text-base lg:text-lg rounded-full hover:bg-blue-50 transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Create account
              </Link>
            </div>
          </div>

          {/* Right - Doctor Image */}
          <div className="relative mt-6 lg:mt-0 flex justify-center lg:justify-end">
            <img
              src={assets.appointment_img}
              alt="Trusted doctor"
              className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[360px] xl:max-w-[400px] object-contain drop-shadow-xl rounded-2xl lg:rounded-br-3xl"
              style={{
                transform: 'translateX(8%) translateY(4%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Optional subtle accent - kept but reduced height */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-700 opacity-25 transform -skew-y-6 origin-bottom-right hidden lg:block"></div>
    </section>
  );
};

export default BottomBanner;