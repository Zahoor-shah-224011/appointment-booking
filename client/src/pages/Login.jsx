// src/pages/Auth.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { toast } from "react-toastify";
import { useAdmin } from '../context/adimContext';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
 const { axios, user, setUser } = useAdmin();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
const toggleMode = () => {
  setIsLogin(!isLogin);
  setFormData({ fullName: '', email: '', password: '' });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let res;

    if (isLogin) {
      // LOGIN
      res = await axios.post(
        "/api/user/login",
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { withCredentials: true }
      );
    } else {
      // REGISTER
      res = await axios.post(
        "/api/user/register",
        {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { withCredentials: true }
      );
    }

    if (res.data.success) {
      toast.success(res.data.message);

      // ✅ Set user as logged in (only after successful login)
     setUser(true); 
      // If you want to auto-login after registration, add setUser(true) here too.

      navigate("/");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Authentication failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <Link to="/" className="inline-block mb-6">
            <img src={assets.logo} alt="Prescripto" className="h-10 mx-auto" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            {isLogin
              ? 'Please sign in to continue'
              : 'Please sign up to book appointment'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
          {/* Full Name - only shown in Signup */}
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md"
            >
              {isLogin ? 'Login' : 'Create account'}
            </button>
          </div>
        </form>

        {/* Toggle link */}
        <div className="px-8 pb-10 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline focus:outline-none"
              >
                Create account here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline focus:outline-none"
              >
                Login here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;