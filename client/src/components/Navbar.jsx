// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAdmin } from '../context/adimContext';
import { toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const { axios, user, setUser } = useAdmin();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await axios.post('/api/user/logout', {}, { withCredentials: true });
            setUser(false);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 xlg:mx-14">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <img src={assets.logo} alt="Prescripto" className="h-8 w-auto" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-10">
                        <Link
                            to="/"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`font-medium text-base tracking-wide pb-1 transition-all duration-200 ${
                                isActive('/')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-800 hover:text-blue-600 hover:border-b-2 hover:border-blue-600'
                            }`}
                        >
                            HOME
                        </Link>
                        <Link
                            to="/doctors"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`font-medium text-base tracking-wide pb-1 transition-all duration-200 ${
                                isActive('/doctors')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-800 hover:text-blue-600 hover:border-b-2 hover:border-blue-600'
                            }`}
                        >
                            ALL DOCTORS
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`font-medium text-base tracking-wide pb-1 transition-all duration-200 ${
                                isActive('/about')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-800 hover:text-blue-600 hover:border-b-2 hover:border-blue-600'
                            }`}
                        >
                            ABOUT
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`font-medium text-base tracking-wide pb-1 transition-all duration-200 ${
                                isActive('/contact')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-800 hover:text-blue-600 hover:border-b-2 hover:border-blue-600'
                            }`}
                        >
                            CONTACT
                        </Link>
                        <Link
                            to="/admin"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                                isActive('/admin')
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-primary text-white hover:bg-blue-700'
                            }`}
                        >
                            Admin Panel
                        </Link>
                        <Link
                            to="/doctor/register"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                                isActive('/admin')
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-primary text-white hover:bg-blue-700'
                            }`}
                        >
                            Become a Doctor
                        </Link>
                    </div>

                    {/* Right side – Auth + Mobile menu button */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {user ? (
                            // Logged in: profile icon with dropdown
                            <div
                                className="relative"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={closeDropdown}
                            >
                            <button
  onClick={toggleDropdown}
  className="flex items-center gap-2 text-gray-700 focus:outline-none group"
  aria-expanded={isDropdownOpen}
>
  <img
    src={user.image || assets.profile_pic}
    alt="Profile"
    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-indigo-300 transition-all"
  />
  <FaChevronDown
    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
      isDropdownOpen ? 'rotate-180' : ''
    }`}
  />
</button>

                                {/* Invisible bridge */}
                                {isDropdownOpen && <div className="absolute h-2 w-full bg-transparent" style={{ top: '100%' }} />}

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                                        <Link
                                            to="/my-appointments"
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                closeDropdown();
                                            }}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            My Appointments
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-150"
                                            onClick={closeDropdown}
                                        >
                                            My Profile
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-150"
                                            onClick={async () => {
                                                await handleLogout();
                                                closeDropdown();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Not logged in: Create account button
                            <Link
                                to="/login"
                                className="bg-primary text-white px-5 py-1.5  pt-1.8 mr-8 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none p-2"
                            aria-label="Toggle menu"
                        >
                            <div
                                className={`w-6 h-0.5 bg-current mb-1.5 transition-transform duration-300 ${
                                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                                }`}
                            />
                            <div
                                className={`w-6 h-0.5 bg-current mb-1.5 transition-opacity duration-300 ${
                                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            <div
                                className={`w-6 h-0.5 bg-current transition-transform duration-300 ${
                                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
           {/* Mobile menu panel */}
<div
  className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
    isMenuOpen ? 'max-h-screen' : 'max-h-0'
  }`}
>
  <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
    <Link
      to="/"
      onClick={toggleMenu}
      className={`block px-3 py-4 text-center text-lg font-medium transition-colors duration-200 ${
        isActive('/')
          ? 'text-blue-600 bg-gray-50'
          : 'text-gray-800 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      HOME
    </Link>
    <Link
      to="/doctors"
      onClick={toggleMenu}
      className={`block px-3 py-4 text-center text-lg font-medium transition-colors duration-200 ${
        isActive('/doctors')
          ? 'text-blue-600 bg-gray-50'
          : 'text-gray-800 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      ALL DOCTORS
    </Link>
    <Link
      to="/about"
      onClick={toggleMenu}
      className={`block px-3 py-4 text-center text-lg font-medium transition-colors duration-200 ${
        isActive('/about')
          ? 'text-blue-600 bg-gray-50'
          : 'text-gray-800 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      ABOUT
    </Link>
    <Link
      to="/contact"
      onClick={toggleMenu}
      className={`block px-3 py-4 text-center text-lg font-medium transition-colors duration-200 ${
        isActive('/contact')
          ? 'text-blue-600 bg-gray-50'
          : 'text-gray-800 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      CONTACT
    </Link>
    <Link
      to="/admin"
      onClick={toggleMenu}
      className={`block px-3 py-4 text-center text-lg font-medium transition-colors duration-200 ${
        isActive('/admin')
          ? 'text-blue-600 bg-gray-50'
          : 'text-gray-800 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      Admin Panel
    </Link>

    {/* ✅ Add "Become a Doctor" link here – same style as other links */}
    <Link
      to="/doctor/register"
      onClick={toggleMenu}
      className="block px-3 py-4 text-center text-lg font-medium text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
    >
      Become a Doctor
    </Link>

    {user ? (
      <>
        <div className="border-t border-gray-200 my-2"></div>
        <div className="px-3 py-4 flex items-center justify-center space-x-2">
          <img
            src={user.image || assets.profile_pic}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-800 font-medium">{user.name}</span>
        </div>
        <Link
          to="/my-appointments"
          onClick={toggleMenu}
          className="block px-3 py-4 text-center text-lg font-medium text-gray-800 hover:bg-gray-100"
        >
          My Appointments
        </Link>
        <Link
          to="/profile"
          onClick={toggleMenu}
          className="block px-3 py-4 text-center text-lg font-medium text-gray-800 hover:bg-gray-100"
        >
          My Profile
        </Link>
        <button
          onClick={async () => {
            await handleLogout();
            toggleMenu();
          }}
          className="block w-full px-3 py-4 text-center text-lg font-medium text-gray-800 hover:bg-gray-100"
        >
          Logout
        </button>
      </>
    ) : (
      <Link
        to="/login"
        onClick={toggleMenu}
        className="block px-3 py-4 text-center text-lg font-medium text-blue-600 hover:bg-gray-100"
      >
        Create account
      </Link>
    )}
  </div>
</div>
        </nav>
    );
};

export default Navbar;