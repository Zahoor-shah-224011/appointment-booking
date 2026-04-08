// // src/pages/AllDoctors.jsx – corrected navigation
// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { assets, specialityData } from "../assets/assets";
// import { useDoctors } from "../context/DoctorContext";
// import { IoArrowBack } from 'react-icons/io5';
// import { Helmet } from 'react-helmet-async';

// // 👇 CHANGE THIS TO YOUR ACTUAL BOOKING ROUTE
// const BOOKING_ROUTE = "/appointment";  // example: "/appointment", "/book", "/doctor-detail"

// const DoctorCard = ({ doctor, onBook }) => {
//   return (
//     <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg group flex flex-col h-full">
//       <div className="relative bg-gray-100 aspect-square overflow-hidden">
//         <img
//           src={doctor.image || assets.doctor_placeholder}
//           alt={doctor.name}
//           className="absolute top-0 left-0 w-full h-full object-contain transition duration-300 group-hover:scale-105"
//           onError={(e) => { e.target.src = assets.doctor_placeholder; }}
//         />
//         <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs shadow flex items-center">
//           <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//           <span className="text-green-600 font-medium">Available</span>
//         </div>
//       </div>
//       <div className="p-4 flex flex-col flex-grow">
//         <h3 className="font-semibold text-gray-900">
//   {doctor.name}
// </h3>
//         <p className="text-gray-500 text-sm mb-2">{doctor.specialty}</p>
//         <p className="text-sm text-yellow-500">
//           ⭐ {doctor.rating || 4.8}
//           <span className="text-gray-400 ml-1">({doctor.reviews || 120} reviews)</span>
//         </p>
//         <p className="text-sm text-gray-700 mt-1">
//           Consultation Fee: ${doctor.fee || 50}
//         </p>
//         <div className="mt-auto pt-3">
//           <button
//             onClick={() => onBook(doctor._id)}
//             className="block w-full text-center text-sm font-medium text-primary border border-primary px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition"
//           >
//             Book Appointment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AllDoctors = () => {
//   const { doctors } = useDoctors();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [selectedSpeciality, setSelectedSpeciality] = useState("All");
//   const [search, setSearch] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const speciality = searchParams.get('speciality');
//     if (speciality) {
//       setSelectedSpeciality(speciality);
//     } else {
//       setSelectedSpeciality('All');
//     }
//   }, [searchParams]);

//   const doctorsList = Array.isArray(doctors) ? doctors : [];

//   const filteredDoctors = doctorsList.filter((doc) => {
//     const specialityMatch = selectedSpeciality === "All" || doc.specialty === selectedSpeciality;
//     const searchMatch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
//                         doc.specialty.toLowerCase().includes(search.toLowerCase());
//     return specialityMatch && searchMatch;
//   });

//   const handleSpecialityClick = (speciality) => {
//     setSelectedSpeciality(speciality);
//     setShowFilters(false);
//   };

//   const handleBackToHome = () => {
//     navigate('/');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleBookAppointment = (doctorId) => {
//     // ✅ CORRECTED: uses your actual route (change BOOKING_ROUTE above if needed)
//     navigate(`${BOOKING_ROUTE}/${doctorId}`);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <>
//       <Helmet>
//         <title>All Doctors | Browse Specialists | Prescripto</title>
//         <meta name="description" content="Browse our complete list of trusted doctors. Filter by specialty, view profiles, and book appointments online." />
//       </Helmet>

//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <button
//             onClick={handleBackToHome}
//             className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200 mb-6 group"
//             aria-label="Back to Home"
//           >
//             <IoArrowBack className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
//             <span className="font-medium">Back to Home</span>
//           </button>

//           <div className="text-center mb-10">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Find the Right Doctor</h1>
//             <p className="text-gray-600 text-base max-w-2xl mx-auto">
//               Browse our network of experienced specialists. Book appointments with trusted doctors effortlessly.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mb-8">
//             <div className="relative flex-1 max-w-md">
//               <input
//                 type="text"
//                 placeholder="Search by doctor name or specialty..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
//               />
//               <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="lg:hidden px-4 py-2 border border-gray-200 rounded-lg bg-white"
//             >
//               ☰ Filters
//             </button>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className={`lg:w-64 ${showFilters ? "block" : "hidden"} lg:block`}>
//               <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//                 <h3 className="font-semibold mb-4 text-gray-800">Filter by Specialty</h3>
//                 <ul className="space-y-2">
//                   <li>
//                     <button
//                       onClick={() => handleSpecialityClick("All")}
//                       className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                         selectedSpeciality === "All" ? "bg-blue-50 text-primary" : "hover:bg-gray-50"
//                       }`}
//                     >
//                       All Specialties
//                     </button>
//                   </li>
//                   {specialityData.map((item) => (
//                     <li key={item.speciality}>
//                       <button
//                         onClick={() => handleSpecialityClick(item.speciality)}
//                         className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                           selectedSpeciality === item.speciality ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
//                         }`}
//                       >
//                         {item.speciality}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="flex-1">
//               {filteredDoctors.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500">No doctors found.</div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
//                   {filteredDoctors.map((doc) => (
//                     <DoctorCard key={doc._id} doctor={doc} onBook={handleBookAppointment} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AllDoctors;


// src/pages/AllDoctors.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDoctors } from '../context/DoctorContext';
import { assets } from '../assets/assets';
// import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { specialityData } from '../assets/assets';
import { FaGraduationCap,FaClipboardList,FaMapMarkerAlt, FaStar, FaUser, FaCalendarCheck } from 'react-icons/fa';
// import { FaGraduationCap, FaClipboardList } from 'react-icons/fa';

const AllDoctors = () => {
  const { doctors } = useDoctors();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Read specialty from URL
  useEffect(() => {
    const speciality = searchParams.get('speciality');
    if (speciality) {
      setSelectedSpecialty(speciality);
    }
  }, [searchParams]);

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const doctorSpecialty = doctor.specialty || doctor.speciality || '';
    const specialtyMatch =
      selectedSpecialty === 'All' || doctorSpecialty === selectedSpecialty;
    const searchMatch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase());
    return specialtyMatch && searchMatch;
  });

  // Helper to get a clean name without duplicate "Dr."''''';]
  const cleanName = (name) => {
    return name?.startsWith('Dr.') ? name : `Dr. ${name}`;
  };


    
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => {
            navigate('/');
            window.scrollTo(0, 0);
          }}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition">←</span>
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find the Best Doctors</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Book appointments or online consultations with trusted doctors across Pakistan
          </p>
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by specialty, doctor name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter chips (horizontal scroll on mobile) */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedSpecialty('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedSpecialty === 'All'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Specialties
            </button>
            {specialityData.map((item) => (
              <button
                key={item.speciality}
                onClick={() => setSelectedSpecialty(item.speciality)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedSpecialty === item.speciality
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {item.speciality}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-gray-600">
          {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </div>

        {/* Doctor grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No doctors found. Try adjusting your search or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              // src/pages/AllDoctors.jsx (or update the DoctorCard component)
// For brevity, I'll show the card mapping part inside AllDoctors.jsx.
// You can also extract this into DoctorCard.jsx.
// Inside the map function for filteredDoctors:

// Inside the map function for filteredDoctors:
<div
  key={doctor._id}
  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
>
  {/* Top section: circular image + verified icon */}
  <div className="flex items-start p-4 pb-2">
 <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
  <img
    src={doctor.image || assets.doctor_placeholder}
    alt={doctor.name}
    className="absolute inset-0 w-full h-full object-cover"
    style={{ objectPosition: 'center 15%' }}
    onError={(e) => (e.target.src = assets.doctor_placeholder)}
  />
  {/* Verified icon */}
  <img
    src={assets.verified_icon}
    alt="Verified"
    className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full p-0.5"
  />
</div>
    <div className="ml-3 flex-1">
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition">
        {cleanName(doctor.name)}
      </h3>
      <p className="text-xs text-gray-500">{doctor.specialty || doctor.speciality}</p>
      {/* Location (from backend later) */}
      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
        <FaMapMarkerAlt className="w-3 h-3" />
        <span>{doctor.city || 'Lahore, Pakistan'}</span>
      </div>
    </div>
  </div>

  {/* Rest of the card */}
{/* After the circular image + verified icon section */}
<div className="px-4 pb-4">
  {/* Available badge */}
 <div className="flex items-center gap-1.5 mb-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span className="text-xs text-green-700 font-medium">Available</span>
  </div>

  {/* Two-line qualifications */}
  <div className="flex flex-col gap-1 mt-2">
    <div className="flex items-start gap-1.5 text-gray-700 text-xs">
      <FaGraduationCap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
      <span>MBBS, Completed FCPS Residency in Nephrology</span>
    </div>
    <div className="flex items-start gap-1.5 text-gray-700 text-xs">
      <FaClipboardList className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
      <span>Preparing for FCPS2 exam</span>
    </div>
  </div>

  {/* Location */}
  {/* <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2">
    <FaMapMarkerAlt className="w-3 h-3" />
    <span>{doctor.city || 'Lahore, Pakistan'}</span>
  </div> */}

  {/* Rating & reviews inline + Trusted by patients */}
  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
    <div className="flex items-center gap-1">
      <FaStar className="w-3.5 h-3.5 text-yellow-500" />
      <span className="text-xs font-medium text-gray-700">{doctor.rating || 4.8}</span>
      <span className="text-xs text-gray-400">({doctor.reviews || 120} reviews)</span>
    </div>
    <span className="text-xs text-gray-500">• Trusted by patients</span>
  </div>

  {/* Fee */}
  <p className="text-sm font-semibold text-primary mt-2">
    Consultation Fee: ${doctor.fees || 50}
  </p>

  {/* Buttons with icons */}
  <div className="flex gap-3 mt-3">
    <Link
      to={`/doctor-profile/${doctor._id}`}
      className="flex-1 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-gray-700 border border-gray-300 px-2 py-1.5 rounded-full hover:bg-gray-100 transition"
    >
      <FaUser className="w-3.5 h-3.5" />
      Profile
    </Link>
    <Link
      to={`/appointment/${doctor._id}`}
      className="flex-1 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-white bg-primary border border-indigo-600 px-2 py-1.5 rounded-full hover:bg-indigo-700 transition"
    >
      <FaCalendarCheck className="w-3.5 h-3.5" />
      Consult Now
    </Link>
  </div>
</div>
</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctors;