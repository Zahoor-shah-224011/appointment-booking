// // src/pages/DoctorDetails.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useAdmin } from '../context/adimContext';
// import { useDoctors } from '../context/DoctorContext';
// import { assets } from '../assets/assets';
// import { IoArrowBack } from 'react-icons/io5';

// const DoctorDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { axios, user } = useAdmin();
//   const { doctors: allDoctors } = useDoctors();

//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedDayIndex, setSelectedDayIndex] = useState(0);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [days, setDays] = useState([]);
//   const [paymentMethod, setPaymentMethod] = useState('offline');

//   // Fetch doctor
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const { data } = await axios.get(`/api/doctor/${id}`);
//         if (data.success) setDoctor(data.doctor);
//       } catch (error) {
//         console.error('Error fetching doctor:', error);
//         toast.error('Failed to load doctor details');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctor();
//   }, [id, axios]);

//   // Generate next 7 days
//   useEffect(() => {
//     const today = new Date();
//     const next7 = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       next7.push({
//         date,
//         dayName: date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
//         dayNum: date.getDate(),
//         fullDate: date.toISOString().split('T')[0],
//       });
//     }
//     setDays(next7);
//   }, []);

//   // Related doctors
//   const relatedDoctors = useMemo(() => {
//     if (!doctor || !allDoctors?.length) return [];
//     return allDoctors
//       .filter((d) => d._id !== doctor._id && (d.specialty || d.speciality) === (doctor.specialty || doctor.speciality))
//       .slice(0, 4);
//   }, [doctor, allDoctors]);

//   const timeSlots = [
//     '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
//     '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
//     '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
//     '04:00 PM', '04:30 PM'
//   ];

//   const parseTime = (timeStr) => {
//     const [time, modifier] = timeStr.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);
//     if (modifier === 'PM' && hours !== 12) hours += 12;
//     if (modifier === 'AM' && hours === 12) hours = 0;
//     return { hours, minutes };
//   };

//   const formatTime = ({ hours, minutes }) => {
//     const period = hours >= 12 ? 'PM' : 'AM';
//     const hour12 = hours % 12 || 12;
//     return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
//   };

//   const createAppointment = async (paymentStatus) => {
//     const selectedDate = days[selectedDayIndex]?.fullDate;
//     const start = parseTime(selectedTime);
//     const end = { ...start, minutes: start.minutes + 30 };
//     if (end.minutes >= 60) {
//       end.minutes -= 60;
//       end.hours += 1;
//     }
//     const startTimeStr = selectedTime;
//     const endTimeStr = formatTime(end);

//     try {
//       const res = await axios.post(
//         '/api/appointments/book',
//         {
//           doctorId: doctor._id,
//           date: selectedDate,
//           timeSlot: { start: startTimeStr, end: endTimeStr },
//           paymentMethod,
//           paymentStatus,
//         },
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         toast.success('Appointment booked successfully');
//         navigate('/my-appointments');
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Booking failed');
//     }
//   };

//   const handleBookAppointment = async () => {
//     if (!selectedTime) {
//       toast.error('Please select a time slot');
//       return;
//     }
//     if (!user) {
//       toast.error('Please login to book appointment');
//       navigate('/login', { state: { from: `/appointment/${id}` } });
//       return;
//     }

//     if (paymentMethod === 'online') {
//       try {
//         const { data } = await axios.post(
//           '/api/payments/create-checkout-session',
//           {
//             doctorId: doctor._id,
//             doctorName: doctor.name,
//             amount: doctor.fees,
//             appointmentData: {
//               date: days[selectedDayIndex]?.fullDate,
//               timeSlot: {
//                 start: selectedTime,
//                 end: formatTime({
//                   ...parseTime(selectedTime),
//                   minutes: parseTime(selectedTime).minutes + 30,
//                   hours: parseTime(selectedTime).minutes + 30 >= 60 ? parseTime(selectedTime).hours + 1 : parseTime(selectedTime).hours
//                 }),
//               },
//             },
//           },
//           { withCredentials: true }
//         );
//         if (data.success) {
//           window.location.href = data.url;
//         } else {
//           toast.error('Payment initiation failed');
//         }
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Payment error');
//       }
//     } else {
//       await createAppointment('unpaid');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-600 text-xl">Loading doctor details...</div>
//       </div>
//     );
//   }

//   if (!doctor) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-600 text-xl">Doctor not found.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-2">
//        <button
//           onClick={() => {
//             navigate('/doctors');
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//           }}
//             className="inline-flex items-center ml-0 md:my-2 justify-center gap-2 text-primary font-medium hover:text-primary-dull transition-all duration-300 self-start md:self-auto transition group-hover:translate-x-1"
//         >
//          <div className="group inline-flex items-center mb-4 cursor-pointer">
//         <IoArrowBack className="w-7 h-7 transition-transform duration-200  group-hover:-translate-x-1" />
//         <span className="ml-1"> </span>
//       </div>
         
//         </button>


//       <div className="max-w-6xl mx-auto px-4">
//         {/* Profile Card */}
//         <div className="flex flex-col lg:flex-row gap-6 mb-1">
//           <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 flex items-center justify-center lg:w-[340px]">
//             <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
//               <img
//                 src={doctor.image || assets.doctor_placeholder}
//                 alt={doctor.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//           <div className="flex-1 border border-gray-200 rounded-xl p-6 bg-white">
//             <div className="flex items-center gap-2">
//               <h2 className="text-2xl font-bold text-gray-900"> {doctor.name}</h2>
//               <img src={assets.verified_icon} alt="verified" className="w-5 h-5" />
//             </div>
//             <div className="flex items-center gap-3 mt-2 text-gray-600 flex-wrap">
//               <span>{doctor.degree}</span>
//               <span>-</span>
//               <span>{doctor.specialty || doctor.speciality}</span>
//               <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
//                 {doctor.experience} years
//               </span>
//             </div>
//             <div className="mt-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <p className="font-semibold text-gray-900">About</p>
//                 <img src={assets.info_icon} alt="info" className="w-4 h-4" />
//               </div>
//               <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
//             </div>
//             <div className="mt-6 font-semibold text-gray-900">
//               Appointment fee: ${doctor.fees}
//             </div>
//           </div>
//         </div>

//         {/* Booking Slots */}
//         <div className="mt-8">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking slots</h3>

//           {/* Days - horizontal scroll (scrollbar on hover) */}
//           <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide hover:scrollbar-default">
//             <div className="flex gap-3 min-w-max">
//               {days.map((day, index) => (
//                 <button
//                   key={day.fullDate}
//                   onClick={() => {
//                     setSelectedDayIndex(index);
//                     setSelectedTime(null);
//                   }}
//                   className={`w-13 h-18 flex flex-col items-center justify-center rounded-full border transition flex-shrink-0 ${
//                     selectedDayIndex === index
//                       ? 'bg-indigo-500 text-white border-indigo-500'
//                       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
//                   }`}
//                 >
//                   <span className="text-sm font-semibold">{day.dayName}</span>
//                   <span className="text-lg font-bold">{day.dayNum}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Time slots - horizontal scroll (scrollbar on hover) */}
//           <div className="overflow-x-auto pb-2 scrollbar-hide hover:scrollbar-default">
//             <div className="flex gap-3 min-w-max">
//               {timeSlots.map((time) => (
//                 <button
//                   key={time}
//                   onClick={() => setSelectedTime(time)}
//                   className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
//                     selectedTime === time
//                       ? 'bg-indigo-500 text-white border-indigo-500'
//                       : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500'
//                   }`}
//                 >
//                   {time}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="my-3 flex gap-4 text-sm">
//             <label className="flex items-center cursor-pointer ">
//               <input  className='cursor-pointer'
//                 type="radio"
//                 value="offline"
//                 checked={paymentMethod === 'offline'}
//                 onChange={() => setPaymentMethod('offline')}
//               />
//               Pay at Clinic (Cash)
//             </label>
//             <label className="flex items-center  cursor-pointer">
//               <input className='cursor-pointer'
//                 type="radio"
//                 value="online"
//                 checked={paymentMethod === 'online'}
//                 onChange={() => setPaymentMethod('online')}
//               />
//               Pay Online (Card)
//             </label> 
//           </div>

//           {/* Book button */}
//           <button
//             disabled={!selectedTime}
//             onClick={handleBookAppointment}
//             className={`mt-6 px-8 py-3 rounded-full text-base font-medium ${
//               selectedTime
//                 ? 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             Book an appointment
//           </button>
//         </div>

//         {/* Related Doctors */}
//         {relatedDoctors.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-center text-gray-900">Related Doctors</h2>
//             <p className="text-center text-gray-600 mt-2 mb-10">
//               Simply browse through our extensive list of trusted doctors.
//             </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
//   {relatedDoctors.map((doc) => (
//     <Link
//       key={doc._id}
//       to={`/appointment/${doc._id}`}
//        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}

//       className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition duration-300 group flex flex-col h-full"
//     >
//       {/* Image Section */}
//       <div className="relative bg-gray-50 pt-[100%] overflow-hidden">
//         <img
//           src={doc.image || assets.doctor_placeholder}
//           alt={doc.name}
//           className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition"
//         />
//         <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs shadow flex items-center z-10">
//           <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//           <span className="text-green-600 font-medium">Available</span>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="p-4 flex flex-col flex-1">
//         <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-1">
//            {doc.name}
//         </h3>
//         <p className="text-sm text-gray-500 mt-1 line-clamp-1">
//           {doc.specialty || doc.speciality}
//         </p>

//         {/* Rating & Reviews */}
//         <div className="flex items-center text-yellow-500 text-sm mt-2">
//           <span className="text-base leading-none">⭐</span>
//           <span className="text-gray-700 ml-1">{doc.rating || 4.8}</span>
//           <span className="text-gray-400 ml-1">({doc.reviews || 120} reviews)</span>
//         </div>

//         {/* Consultation Fee */}
//         <p className="text-sm text-gray-700 mt-2">
//           Consultation Fee: <span className="font-semibold text-indigo-600">${doc.fees || 50}</span>
//         </p>
//       </div>
//     </Link>
//   ))}
// </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorDetails;














// src/pages/DoctorDetails.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAdmin } from '../context/adimContext';
import { useDoctors } from '../context/DoctorContext';
import { assets } from '../assets/assets';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, user } = useAdmin();
  const { doctors: allDoctors } = useDoctors();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [days, setDays] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('offline');
  const [isBooking, setIsBooking] = useState(false);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`/api/doctor/${id}`);
        if (data.success) setDoctor(data.doctor);
      } catch (error) {
        console.error('Error fetching doctor:', error);
        toast.error('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, axios]);

  // Generate next 7 days
  useEffect(() => {
    const today = new Date();
    const next7 = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next7.push({
        date,
        dayName: date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
      });
    }
    setDays(next7);
  }, []);

  // Related doctors (same specialty, exclude current)
  const relatedDoctors = useMemo(() => {
    if (!doctor || !allDoctors?.length) return [];
    return allDoctors
      .filter(d => d._id !== doctor._id && (d.specialty || d.speciality) === (doctor.specialty || doctor.speciality))
      .slice(0, 4);
  }, [doctor, allDoctors]);

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const formatTime = ({ hours, minutes }) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // const createAppointment = async (paymentStatus) => {
  //   const selectedDate = days[selectedDayIndex]?.fullDate;
  //   const start = parseTime(selectedTime);
  //   const end = { ...start, minutes: start.minutes + 30 };
  //   if (end.minutes >= 60) {
  //     end.minutes -= 60;
  //     end.hours += 1;
  //   }
  //   const startTimeStr = selectedTime;
  //   const endTimeStr = formatTime(end);

  //   try {
  //     const res = await axios.post(
  //       '/api/appointments/book',
  //       {
  //         doctorId: doctor._id,
  //         date: selectedDate,
  //         timeSlot: { start: startTimeStr, end: endTimeStr },
  //         paymentMethod,
  //         paymentStatus,
  //       },
  //       { withCredentials: true }
  //     );
  //     if (res.data.success) {
  //       toast.success('Appointment booked successfully');
  //       navigate('/my-appointments');
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Booking failed');
  //   }
  // };



// ------------------------------------------------------------
// CREATE APPOINTMENT (offline payment)
// ------------------------------------------------------------
const createAppointment = async (paymentStatus) => {
  const selectedDate = days[selectedDayIndex]?.fullDate;
  const start = parseTime(selectedTime);
  const end = { ...start, minutes: start.minutes + 30 };
  if (end.minutes >= 60) {
    end.minutes -= 60;
    end.hours += 1;
  }
  const startTimeStr = selectedTime;
  const endTimeStr = formatTime(end);

  try {
    const res = await axios.post(
      '/api/appointments/book',
      {
        doctorId: doctor._id,
        date: selectedDate,
        timeSlot: { start: startTimeStr, end: endTimeStr },
        paymentMethod,
        paymentStatus,
      },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success('Appointment booked successfully');
      navigate('/my-appointments');
    } else {
      toast.error(res.data.message || 'Booking failed');
    }
  } catch (error) {
    // Backend returns 400 for duplicate slot
    const errorMsg = error.response?.data?.message || 'Booking failed';
    toast.error(errorMsg);
    console.error('Booking error:', error);
  } finally {
    setIsBooking(false);
  }
};

// ------------------------------------------------------------
// HANDLE BOOK APPOINTMENT (offline or online)
// ------------------------------------------------------------
const handleBookAppointment = async () => {
  // Prevent double submission
  if (!selectedTime || isBooking) return;

  if (!user) {
    toast.error('Please login to book appointment');
    navigate('/login', { state: { from: `/appointment/${doctor._id}` } });
    return;
  }

  setIsBooking(true);

  if (paymentMethod === 'online') {
    try {
      const { data } = await axios.post(
        '/api/payments/create-checkout-session',
        {
          doctorId: doctor._id,
          doctorName: doctor.name,
          amount: doctor.fees,
          appointmentData: {
            date: days[selectedDayIndex]?.fullDate,
            timeSlot: {
              start: selectedTime,
              end: formatTime({
                ...parseTime(selectedTime),
                minutes: parseTime(selectedTime).minutes + 30,
                hours: parseTime(selectedTime).minutes + 30 >= 60 ? parseTime(selectedTime).hours + 1 : parseTime(selectedTime).hours,
              }),
            },
          },
        },
        { withCredentials: true }
      );
      if (data.success) {
        window.location.href = data.url; // Redirect to Stripe – no need to reset isBooking
      } else {
        toast.error('Payment initiation failed');
        setIsBooking(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment error');
      setIsBooking(false);
    }
  } else {
    // Offline booking
    await createAppointment('unpaid');
    // isBooking is reset inside createAppointment
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading doctor details...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">Doctor not found.</div>
      </div>
    );
  }

  // Prepare structured data for Google

const addressData =
  doctor.address || doctor.city || doctor.state || doctor.zipCode || doctor.country
    ? {
        "@type": "PostalAddress",
        ...(doctor.address && { streetAddress: doctor.address }),
        ...(doctor.city && { addressLocality: doctor.city }),
        ...(doctor.state && { addressRegion: doctor.state }),
        ...(doctor.zipCode && { postalCode: doctor.zipCode }),
        ...(doctor.country && { addressCountry: doctor.country }),
      }
    : undefined;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: doctor.name,
  medicalSpecialty: doctor.specialty || doctor.speciality,
  image: doctor.image,
  description: doctor.about,
  ...(addressData && { address: addressData }), // ✅ key fix
  priceRange: `$${doctor.fees}`,
  available: doctor.available ? "Available" : "Not Available",
  ...(doctor.phone && { telephone: doctor.phone })
};

  return (
    <>
     <Helmet>
  <title>{doctor.name} – {doctor.specialty || doctor.speciality} | Book Appointment</title>
  <meta
    name="description"
    content={`Book an appointment with ${doctor.name}, a trusted ${doctor.specialty || doctor.speciality} with ${doctor.experience} years of experience. Consultation fee $${doctor.fees}.`}
  />
  <link rel="canonical" href={`https://appointment-booking-frontend-two.vercel.app/appointment/${doctor._id}`} />

  {/* Physician Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Physician",
      "name": doctor.name,
      "medicalSpecialty": doctor.specialty || doctor.speciality,
      "image": doctor.image,
      "description": doctor.about,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": doctor.address || "",
        "addressLocality": doctor.city || "",
        "addressRegion": doctor.state || "",
        "postalCode": doctor.zipCode || "",
        "addressCountry": doctor.country || ""
      },
      "priceRange": `$${doctor.fees}`,
      "available": doctor.available ? "Available" : "Not Available",
      "telephone": doctor.phone || ""
    })}
  </script>

  {/* FAQPage Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the consultation fee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The consultation fee for ${doctor.name} is $${doctor.fees}.`
          }
        },
        {
          "@type": "Question",
          "name": "How can I book an appointment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can book an appointment online by selecting a date and time slot and clicking 'Book Appointment'."
          }
        },
        {
          "@type": "Question",
          "name": "What are the doctor's qualifications?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": ` ${doctor.name} holds a ${doctor.degree} degree and has ${doctor.experience} years of experience.`
          }
        },
        {
          "@type": "Question",
          "name": "Does the doctor accept insurance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Please contact the clinic directly for insurance information."
          }
        }
      ]
    })}
  </script>

  {/* Review Schema */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Physician",
        "name": ` ${doctor.name}`,
        "medicalSpecialty": doctor.specialty || doctor.speciality
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": doctor.rating || 4.8,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Patient"
      },
      "reviewBody": "Great doctor, highly recommended!"
    })}
  </script>
</Helmet>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Card */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 flex items-center justify-center lg:w-[340px]">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={doctor.image || assets.doctor_placeholder}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 border border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900"> {doctor.name}</h2>
                <img src={assets.verified_icon} alt="verified" className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-3 mt-2 text-gray-600 flex-wrap">
                <span>{doctor.degree}</span>
                <span>-</span>
                <span>{doctor.specialty || doctor.speciality}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {doctor.experience} years
                </span>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-gray-900">About</p>
                  <img src={assets.info_icon} alt="info" className="w-4 h-4" />
                </div>
                <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
              </div>
              <div className="mt-6 font-semibold text-gray-900">
                Appointment fee: ${doctor.fees}
              </div>
            </div>
          </div>

          {/* Booking Slots */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking slots</h3>

            {/* Days - horizontal scroll */}
            <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide hover:scrollbar-default">
              <div className="flex gap-3 min-w-max">
                {days.map((day, index) => (
                  <button
                    key={day.fullDate}
                    onClick={() => {
                      setSelectedDayIndex(index);
                      setSelectedTime(null);
                    }}
                    className={`w-13 h-18 flex flex-col items-center justify-center rounded-full border transition flex-shrink-0 ${
                      selectedDayIndex === index
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-semibold">{day.dayName}</span>
                    <span className="text-lg font-bold">{day.dayNum}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots - horizontal scroll */}
            <div className="overflow-x-auto pb-2 scrollbar-hide hover:scrollbar-default">
              <div className="flex gap-3 min-w-max">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                      selectedTime === time
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="offline"
                  checked={paymentMethod === 'offline'}
                  onChange={() => setPaymentMethod('offline')}
                />
                Pay at Clinic
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                Pay Online
              </label>
            </div>

            {/* Book button */}
          <button
  disabled={!selectedTime || isBooking}
  onClick={handleBookAppointment}
  className={`mt-6 px-8 py-3 rounded-full text-base font-medium ${
    selectedTime && !isBooking
      ? 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  {isBooking ? 'Processing...' : 'Book an appointment'}
</button>
          </div>

          {/* Related Doctors */}
          {relatedDoctors.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-center text-gray-900">Related Doctors</h2>
              <p className="text-center text-gray-600 mt-2 mb-10">
                Simply browse through our extensive list of trusted doctors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
                {relatedDoctors.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/appointment/${doc._id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition duration-300 group"
                  >
                    <div className="relative bg-gray-50 h-60 overflow-hidden">
                      <img
                        src={doc.image || assets.doctor_placeholder}
                        alt={doc.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs shadow flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-green-600 font-medium">Available</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                         {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{doc.specialty || doc.speciality}</p>
                      <div className="flex items-center text-yellow-500 text-sm mt-2">
                        <span>⭐</span>
                        <span className="text-gray-700 ml-1">{doc.rating || 4.8}</span>
                        <span className="text-gray-400 ml-1">({doc.reviews || 120} reviews)</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        Consultation Fee: <span className="font-semibold text-indigo-600">${doc.fees || 50}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDetails;