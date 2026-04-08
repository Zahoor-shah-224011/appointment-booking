// src/pages/DoctorProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/adimContext';
import { assets } from '../assets/assets';
import {
  FaStar,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaClipboardList,
  FaCalendarAlt,
  FaVideo,
  FaAmbulance,
  FaStethoscope,
  FaBuilding,
  FaBriefcase,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAdmin();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consultType, setConsultType] = useState('inperson');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(`/api/doctor/${id}`);
        if (data.success) {
          setDoctor(data.doctor);
        } else {
          toast.error('Doctor not found');
          navigate('/doctors');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load doctor profile');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, axios, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading doctor profile...</div>
      </div>
    );
  }

  if (!doctor) return null;

  const cleanName = doctor.name?.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`;
  // Remove duplicate "Dr." in about heading
  const displayNameForAbout = doctor.name?.startsWith('Dr.') ? doctor.name.slice(3) : doctor.name;

  // Static reviews (replace with backend later)
  const reviews = [
    {
      id: 1,
      name: 'Ali Khan',
      date: '2 weeks ago',
      rating: 5,
      comment:
        'Dr. Aamir Khan was very professional and took time to listen to all my concerns. Explained everything clearly and provided excellent treatment.',
    },
    {
      id: 2,
      name: 'Sara Ahmed',
      date: '1 month ago',
      rating: 4,
      comment:
        'Excellent doctor with great bedside manner. Made me feel comfortable throughout the consultation and provided a thorough explanation.',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "What are Dr. Aamir Khan's consultation fees?",
      answer:
        "Dr. Aamir Khan's consultation fees are $50 for in-person appointments and $40 for video consultations. Duty doctor consultations are Rs. 1499/-.",
    },
    {
      id: 2,
      question: 'What are the available timings?',
      answer:
        'Monday to Friday: 9:00 AM – 6:00 PM. Saturday: 10:00 AM – 2:00 PM. Sunday closed.',
    },
    {
      id: 3,
      question: 'How can I prepare for my consultation?',
      answer:
        'Please bring any previous medical records, a list of current medications, and your insurance card (if applicable). For online consultations, ensure you have a stable internet connection and a quiet space.',
    },
    {
      id: 4,
      question: 'What is the average wait time?',
      answer:
        'In-person wait times are typically 15–20 minutes. For online consultations, the doctor joins within 5 minutes of the scheduled time.',
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors group"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Hero Section - Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10 transition hover:shadow-xl">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={doctor.image || assets.doctor_placeholder}
                  alt={doctor.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%' }}
                  onError={(e) => (e.target.src = assets.doctor_placeholder)}
                />
                <img
                  src={assets.verified_icon}
                  alt="Verified"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full p-0.5 shadow-sm"
                />
              </div>
            </div>
            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{cleanName}</h1>
                <img src={assets.verified_icon} alt="Verified" className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${i < (doctor.rating || 4) ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({doctor.rating || 4.5}/5.0)
                </span>
              </div>
              <div className="space-y-2 text-gray-600 text-sm">
                <div className="flex items-start gap-2">
                  <FaGraduationCap className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                  <span>MBBS, Completed FCPS Residency in Nephrology</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaClipboardList className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                  <span>Preparing for FCPS2 exam</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{doctor.city || 'Lahore, Pakistan'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Dr. {displayNameForAbout}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <FaStethoscope className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Specialization:</span> {doctor.specialty || doctor.speciality}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaGraduationCap className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Qualifications:</span> MBBS, Completed FCPS Residency in Nephrology
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaBuilding className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Practice At:</span> {doctor.address || 'Lahore General Hospital'}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaBriefcase className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Experience:</span> {doctor.experience || 5} years
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <FaMapMarkerAlt className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <span className="font-medium">Location:</span> {doctor.city || 'Lahore'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Fee</p>
                <p className="text-3xl font-bold text-primary">${doctor.fees || 50}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/appointment/${doctor._id}`}
                  className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition shadow-sm"
                >
                  Book Now
                </Link>
                <button
                  onClick={() => toast.info('Instant consultation coming soon')}
                  className="px-6 py-2.5 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition"
                >
                  Instant Doctor
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Consultation</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setConsultType('inperson')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                    consultType === 'inperson'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaCalendarAlt className="w-3.5 h-3.5" /> In-Person
                </button>
                <button
                  onClick={() => setConsultType('online')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                    consultType === 'online'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaVideo className="w-3.5 h-3.5" /> Online
                </button>
                <button
                  onClick={() => setConsultType('dutydoctor')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                    consultType === 'dutydoctor'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaAmbulance className="w-3.5 h-3.5" /> Duty Doctor
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                {consultType === 'inperson' && (
                  <p>🏥 Monday - Friday: Available for in-person appointment at clinic.</p>
                )}
                {consultType === 'online' && (
                  <p>💻 Available Today – Video consultation from home. Secure and convenient.</p>
                )}
                {consultType === 'dutydoctor' && (
                  <p>🔄 24/7 Availability – Instant connection with duty doctor for urgent advice.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Reviews */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient Reviews</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{doctor.rating || 4.5}</div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">out of 5</div>
              </div>
              <div className="text-sm text-gray-600">Based on patient reviews</div>
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-400">{review.date}</div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => toast.info('All reviews will be shown soon')}
                className="text-sm text-primary hover:underline font-medium"
              >
                View All Reviews
              </button>
              <button
                onClick={() => toast.info('Write a review feature coming soon')}
                className="text-sm text-primary hover:underline font-medium"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition"
                  >
                    {faq.question}
                    {openFaq === faq.id ? (
                      <FaChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100 bg-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instant Consult Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 flex justify-between items-center border border-indigo-100 shadow-sm">
          <div>
            <p className="font-semibold text-primary">Consult Duty Doctor Instantly 24/7</p>
            <p className="text-sm text-primary mt-0.5">Immediate medical advice from certified doctors</p>
          </div>
          <p className="text-2xl font-bold text-primary">1499/PKR</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;