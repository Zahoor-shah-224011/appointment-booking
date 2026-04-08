// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useAdmin } from '../context/adimContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'doctor'
  const { axios } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  console.log("FORM SUBMITTED");
    setError('');

    try {
      const endpoint = loginType === 'admin' ? '/api/admin/login' : '/api/doctor/login';
      console.log("Sending login request...");
      const { data } = await axios.post(
        endpoint,
        {
          email: email.trim(),
          password: password.trim(),
        },
        { withCredentials: true }
      );

      if (data.success) {
        console.log(`${loginType} login success`);
        // Redirect to appropriate dashboard
        if (loginType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/doctor-dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
        {/* Toggle Buttons */}
        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-300">
          <button
            type="button"
            className={`flex-1 py-2 text-center font-medium transition ${
              loginType === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setLoginType('admin')}
          >
            Admin Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center font-medium transition ${
              loginType === 'doctor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setLoginType('doctor')}
          >
            Doctor Login
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">
          {loginType === 'admin' ? 'Admin Login' : 'Doctor Login'}
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loginType === 'admin' ? 'Login as Admin' : 'Login as Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;