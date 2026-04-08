// src/components/SpecialitySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { specialityData } from '../assets/assets';

const SpecialitySection = () => {
  return (

    <div className="border-t border-gray-200 pt-3 mt-4">
    <div className="bg-white py-4 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading (unchanged) */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find by Speciality
          </h2>
          <p className="text-base lg:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Browse through the list of specialized doctors and book your appointment.
          </p>
        </div>

        {/* --- SMALL SCREENS (mobile/tablet) --- */}
        <div className="lg:hidden overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 px-2 min-w-max">
            {specialityData.map((item) => (
              <Link
                key={item.speciality}
                to={`/doctors?speciality=${encodeURIComponent(item.speciality)}`}
                className="flex flex-col items-center group"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.speciality}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 mt-3 text-center group-hover:text-indigo-600 transition">
                  {item.speciality}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* --- LARGE SCREENS (desktop – exactly as you had it) --- */}
        <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-6 gap-8 justify-items-center">
          {specialityData.map((item) => (
            <Link
              key={item.speciality}
              to={`/doctors?speciality=${encodeURIComponent(item.speciality)}`}
              className="flex flex-col items-center group"
              onClick={() => window.scrollTo(0, 0)}
            >
              {/* Use your original classes here – if different, replace with them */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <img
                  src={item.image}
                  alt={item.speciality}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <span className="text-base font-medium text-gray-700 mt-4 text-center group-hover:text-indigo-600 transition">
                {item.speciality}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default SpecialitySection;