// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useDoctors } from '../context/DoctorContext';
// // import { doctors } from '../assets/assets';


// const TopDoctors = () => {
//     // const topDoctorsList = doctors.slice(0, 10);
//   const { doctors } = useDoctors();
//     return (
//         <div className="bg-white py-12 lg:py-16">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="text-center">
//                     <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">Top Doctors to Book</h1>
//                     <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mt-4 font-light">Simply browse through our extensive list of trusted doctors.</p>
//                 </div>

//                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 mt-12">
//  {doctors.slice(0,10).map((doctor) => (
//   <Link key={doctor._id} to={`/appointment/${doctor._id}`} className="block">
//     <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
      
//       <img
//         src={doctor.image}
//         alt={`${doctor.name} - ${doctor.specialty}`}
//         className="w-full aspect-[4/5] object-cover"
//         onError={(e) => { e.target.src = '/fallback-doctor.jpg' }}
//       />
//         <div className="p-5">
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//             <p className="text-green-600 text-sm font-medium">Available</p>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mt-2">{doctor.name}</h3>
//           <p className="text-base text-gray-600">{doctor.specialty}</p> {/* ← fixed */}
//         </div>
//       </div>
//     </Link>
//   ))}
// </div>
//                 <div className="text-center mt-10">
//   <Link to="/doctors" className="inline-block px-8 py-4 bg-primary text-white rounded-full hover:bg-blue-700">
//     See All Doctors →
//   </Link>
// </div>
//             </div>
//         </div>
//     );
// };

// export default TopDoctors;















// src/components/TopDoctors.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDoctors } from '../context/DoctorContext';
import DoctorCard from './DoctorCard'; // adjust path if needed

const TopDoctors = () => {
  const { doctors } = useDoctors();
  const topDoctors = doctors.slice(3, 13);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Top Doctors to Book</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors.
          </p>
        </div>

        {/* Doctor Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {topDoctors.map((doctor) => (
    <div
      key={doctor._id}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cursor-pointer"
    >
      <DoctorCard doctor={doctor} />
    </div>
  ))}
</div>

        {/* See All Button */}
        <div className="text-center mt-12">
          <Link
            to="/doctors"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition"
          >
            See All Doctors →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;