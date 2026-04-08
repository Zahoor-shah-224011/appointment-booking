// src/pages/AdminDoctorAuth.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const AdminDoctor = () => {
  const [isAdmin, setIsAdmin] = useState(true); // true = Admin, false = Doctor
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: real auth API call here
    console.log(isAdmin ? 'Admin' : 'Doctor', 'login:', { email, password });
    // Demo redirect
    navigate(isAdmin ? '/admin' : '/doctor-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={assets.logo} alt="Prescripto" className="h-10 mx-auto" />
          </Link>
          <h2 className="text-3xl font-bold text-primary">
            {isAdmin ? 'Admin Login' : 'Doctor Login'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isAdmin ? "admin@example.com" : "doctor@example.com"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isAdmin ? 'Doctor Login?' : 'Admin Login?'}{' '}
          <button
            type="button"
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-blue-600 font-medium hover:underline"
          >
            Click here
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctor;