// src/components/DoctorCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const DoctorCard = ({ doctor }) => {
  const { _id, name, image, specialty, speciality, rating, reviews, fees } = doctor;
  const displaySpecialty = specialty || speciality;
  const cleanName = name?.startsWith('Dr.') ? name : `Dr. ${name}`;

  return (
    <Link
      to={`/appointment/${_id}`}
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Image section – square 1:1 */}
      <div className="relative bg-gray-100 pt-[100%] overflow-hidden">
        <img
          src={image || assets.doctor_placeholder}
          alt={cleanName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => (e.target.src = assets.doctor_placeholder)}
        />
      </div>

      {/* Content section – badge below image */}
      <div className="p-3">
        {/* ✅ "Available" badge moved here, below image, above name */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-green-700 font-medium">Available</span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">
          {cleanName}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{displaySpecialty}</p>

        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-yellow-500 text-xs">⭐</span>
          <span className="text-xs text-gray-700">{rating || 4.8}</span>
          <span className="text-xs text-gray-400">({reviews || 120})</span>
        </div>

        {/* <p className="text-sm font-semibold text-indigo-600 mt-1.5">
          ${fees || 50}
        </p> */}

        <div className="mt-3">
          <span className="block w-full text-center text-xs font-medium text-indigo-600 border border-indigo-200 px-2 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition">
            Consult Now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;