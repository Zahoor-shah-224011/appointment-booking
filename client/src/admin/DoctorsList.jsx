// src/admin/DoctorsList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDoctors } from '../context/DoctorContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const DoctorsList = () => {
  const location = useLocation();
  const { doctors } = useDoctors(); // ✅ custom hook from context

  // Sidebar menu (optional)
  const menu = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'Appointments', path: '/admin/appointments', icon: '📅' },
    { name: 'Add Doctor', path: '/admin/add-doctor', icon: '+' },
    { name: 'Doctors List', path: '/admin/doctors', icon: '👨‍⚕️' },
  ];

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  // ✅ Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ✅ Memoized filtered doctors – recalculates only when doctors or searchTerm change
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      const nameMatch = doc.name?.toLowerCase().includes(term) || false;
      const specialtyMatch = (doc.specialty?.toLowerCase().includes(term) ||
                              doc.speciality?.toLowerCase().includes(term)) || false;
      return nameMatch || specialtyMatch;
    });
  }, [doctors, searchTerm]);

  // Pagination calculations
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

  // ✅ Memoized current page slice
  const currentDoctors = useMemo(() => {
    return filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  }, [filteredDoctors, currentPage, doctorsPerPage]);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-1 mx-0">
      {/* Optional Sidebar – uncomment if needed */}
      {/* <aside className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <nav className="p-6 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path ||
                (item.path === '/admin' && location.pathname === '/admin')
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1  lg:p-8 overflow-y-auto">
        <div className="max-w-full ">
          {/* Header with search */}
          <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Doctors List</h1>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by name or speciality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Doctors Table */}
          <div className="bg-white rounded-2xl shadow border border-gray-200  overflow-hidden">
            <div className="overflow-x-auto sm:mx-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Speciality</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Degree</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Experience</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fees</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentDoctors.length > 0 ? (
                    currentDoctors.map((doc, idx) => {
                      // ✅ Unique key (fallback if _id missing)
                      const rowKey = doc._id || `doc-${indexOfFirstDoctor + idx}`;
                      return (
                        <tr key={rowKey} className="hover:bg-blue-50 transition duration-150">
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                            {indexOfFirstDoctor + idx + 1}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={doc.image || assets.doctor_placeholder}
                                  alt={doc.name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                                <img
                                  src={assets.verified_icon}
                                  alt="Verified"
                                  className="absolute -bottom-1 -right-1 w-4 h-4"
                                />
                              </div>
                              <span className="font-medium text-gray-900"> {doc.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                            {doc.specialty || doc.speciality || 'N/A'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{doc.degree}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{doc.experience}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${doc.fees}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                onClick={() =>
                                  toast.info("Edit functionality is not available in this demo.", {
                                    toastId: 'edit-not-allowed',
                                    position: "top-center",
                                    autoClose: 3000,
                                  })
                                }
                                className="text-blue-600 hover:text-blue-800 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  toast.warning("Doctor deletion is not available in this demo.", {
                                    toastId: 'delete-not-allowed',
                                    position: "top-center",
                                    autoClose: 3000,
                                  })
                                }
                                className="text-red-600 hover:text-red-800 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-20 text-center text-gray-500 text-xl">
                        No doctors found. Add some using "Add Doctor".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-primary text-white shadow'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorsList;