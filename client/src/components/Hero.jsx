// import React from 'react';
// import { Link } from 'react-router-dom';
// import { assets } from '../assets/assets';

// const Hero = () => {
//     return (
//        <div className="bg-primary min-h-[calc(90vh-99px)] flex items-center mt-7 rounded-2xl">

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//                 <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20">
//                     {/* Left Side */}
//                     <div className="lg:w-1/2 text-white">
//                         <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-5xl px-9 font-bold leading-tight">
//                             Book Appointment <br /> With Trusted Doctors 
//                         </h1>
//                         <div className="flex items-center mt-6 py-2">
//                             <img src={assets.group_profiles} alt="Trusted Users" className="w-30 pl-9" />
//       <p className="ml-4 text-sm sm:text-base max-w-lg leading-relaxed">
//   Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
// </p>





//                         </div>
//                       <Link
//   to="/doctors"
//   className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-medium text-lg mt-8 ml-8 hover:bg-gray-100 transition-all duration-300"
// >
//   Book appointment <img src={assets.arrow_icon} alt="arrow" />
// </Link>

//                     </div>

//                     {/* Right Side */}
//                     <div className="lg:w-1/2 relative h-[50vh] sm:h-[60vh] lg:h-auto">
//                         {/* <img className="absolute w-2/3 sm:w-auto h-auto rounded-2xl -right-1/2 top-0 sm:top-[-10%] lg:-top-10 lg:right-0" src={assets.header_img} alt="Doctor 1" /> */}
//                         {/* <img className="absolute w-2/3 sm:w-auto h-auto rounded-2xl bottom-0 -left-1/2 sm:bottom-[10%] sm:-left-[15%] lg:bottom-0 lg:left-0" src={assets.doc2} alt="Doctor 2" /> */}
//                         <img className="absolute w-2/3 sm:w-auto h-auto rounded-2xl left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:left-auto sm:right-[15%] sm:top-auto sm:bottom-0 sm:translate-x-0 sm:translate-y-0 lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:right-auto lg:bottom-auto" src={assets.header_img} alt="Doctor 3" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Hero;





import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="bg-primary  rounded-2xl  mt-3 mx-2   md:mt-6 md:mr-5 min-h-[calc(90vh-99px)] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 w-full">
        {/* ===== MOBILE / SMALL SCREENS ===== */}
        <div className="flex flex-col items-center text-white text-center lg:hidden">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mt-6">
            Book Appointment <br /> With Trusted <br/> Doctors
          </h1>

          <img
            src={assets.group_profiles}
            alt="Trusted Users"
            className="w-28 sm:w-36 md:w-48 mt-4"
          />

          <p className="text-sm sm:text-base max-w-xs sm:max-w-md leading-relaxed mt-3 px-2">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-white text-blue-600 
            px-6 py-3 sm:px-8 sm:py-4 
            rounded-full font-medium 
            text-base sm:text-lg 
            mt-6 hover:bg-gray-100 
            transition-all duration-300 
            shadow-md hover:shadow-lg"
          >
            Book appointment
            <img src={assets.arrow_icon} alt="arrow" className="w-4 sm:w-5" />
          </Link>

   <img
  src={assets.header_img + '?f=auto&q=auto'}
  alt="Doctor Illustration"
  width={1200}
  height={800}
  loading="eager"
  className="w-[85%] xl:w-[75%] h-auto rounded-2xl object-cover shadow-2xl"
/>
        </div>

        {/* ===== DESKTOP / LARGE SCREENS ===== */}
        <div className="hidden lg:flex flex-row items-center justify-between gap-16 text-white">
          {/* LEFT SIDE — Content */}
          <div className="lg:w-1/2 flex flex-col items-start">
            <h1 className="text-5xl lg:text-5xl font-bold leading-tight">
              Book Appointment <br /> With Trusted Doctors
            </h1>

            <div className="flex items-center mt-6">
              <img
                src={assets.group_profiles}
                alt="Trusted Users"
                className="w-40"
              />
            </div>

            <p className="text-base max-w-md leading-relaxed mt-4">
              Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
            </p>

            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-white text-blue-600 
              px-8 py-4 rounded-full font-medium text-lg 
              mt-8 hover:bg-gray-100 transition-all duration-300 
              shadow-md hover:shadow-lg"
            >
              Book appointment
              <img src={assets.arrow_icon} alt="arrow" className="w-5" />
            </Link>
          </div>

          {/* RIGHT SIDE — Header Image */}
          <div className="lg:w-1/2 flex justify-end items-center">
            <img
              src={assets.header_img}
              alt="Doctor Illustration"
              className="w-[85%] xl:w-[75%] h-auto rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;