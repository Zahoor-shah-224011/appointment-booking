// src/layouts/DoctorLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDoctors } from '../context/DoctorContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, axios, setDoctor, authLoading } = useDoctors();

  console.log('Doctor in layout:', doctor);

  // Redirect only after auth check completes and no doctor is found
  useEffect(() => {
    if (!authLoading && doctor === null) {
      navigate('/doctor/register', { replace: true });
    }
  }, [authLoading, doctor, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return <div className="text-center py-20">Checking session...</div>;
  }

  // If not authenticated and auth check is done, render nothing (redirect happens in useEffect)
  if (!authLoading && doctor === null) {
    return null;
  }

  const menu = [
    { name: 'Dashboard', path: '/doctor-dashboard', icon: '📊' },
    { name: 'Appointments', path: '/doctor-dashboard/appointments', icon: '📅' },
    { name: 'Profile', path: '/doctor-dashboard/profile', icon: '👤' },
  ];

  const handleLogout = async () => {
    try {
      await axios.post('/api/doctor/logout', {}, { withCredentials: true });
      setDoctor(null);
      toast.success('Logged out');
      navigate('/doctor/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
            <div className="flex items-center gap-4">
              {doctor && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    {doctor.name}
                  </span>
                  <img
                    src={doctor.image || assets.doctor_placeholder}
                    alt="Doctor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              )}
              <button
                onClick={handleLogout}
                className="border rounded-full text-sm px-4 py-1 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            h-full lg:h-auto
          `}
          style={{ height: '100vh' }}
        >
          <nav className="flex flex-col p-4 space-y-1 h-full overflow-y-auto">
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
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
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

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;