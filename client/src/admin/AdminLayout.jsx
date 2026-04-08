// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/adimContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { axios, user, setUser } = useAdmin();

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Appointments', path: '/admin/appointments', icon: '📅' },
    { name: 'Add Doctor', path: '/admin/add-doctor', icon: '➕' },
    { name: 'Doctors List', path: '/admin/doctors', icon: '👨‍⚕️' },
  ];

  // const handleLogout = async () => {
  //   try {
  //     await axios.post('/api/admin/logout', {}, { withCredentials: true });
  //     setUser(null);
  //     toast.success('Logged out');
  //     navigate('/admin-login');
  //   } catch (error) {
  //     toast.error('Logout failed');
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-30 h-16">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left side – Logo and menu toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
            <Link to="/" className="flex items-center">
              <img src={assets.logo} alt="Prescripto" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Right side – Admin profile */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user.name || 'Admin'}
                </span>
                <img
                  src={user.image || assets.profile_pic}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            )}
           <button
  onClick={() => navigate('/')}
  className="border rounded-full text-sm px-4 py-1 hover:bg-gray-100 transition-colors"
>
  Logout
</button>
          </div>
        </div>
      </header>

      {/* Main content area – fixed height to ensure sidebar always fills the screen */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-20 sm:mt-1 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 h-full
          `}
        >
          <nav className="p-4 space-y-1 sm:mt-1 mt-18 overflow-y-auto h-full">
            {menu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-primary border-l-4 border-primary'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content – scrollable horizontally if needed, full height */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;