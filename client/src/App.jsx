// // src/App.jsx
// import React from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Admin from './pages/AdminDoctor';
// import AllDoctors from './pages/AllDoctors';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import DoctorDetails from './pages/DoctorsDetails';
// import MyAppointments from './pages/MyAppointments';
// import MyProfile from './pages/MyProfile';
// import AdminDashboard from './admin/AdminDashboard';
// import AdminLayout from './admin/AdminLayout';
// import AllAppointments from './admin/AllAppointments';
// import AddDoctor from './admin/AddDoctor';
// import DoctorsList from './admin/DoctorsList';
// import DoctorLayout from './doctor/DoctorLayout';
// import DoctorDashboard from './doctor/DoctorDashboard';
// import DoctorAppointments from './doctor/DoctorAppointments';
// import AdminLogin from './pages/AdminLogin';
// import { ToastContainer } from 'react-toastify';
// import DoctorProfile from './doctor/DoctorProfile';
// import DoctorRegister from './doctor/DoctorRegister';
// import PaymentSuccess from './pages/PaymentSuccess';
// import PaymentCancel from './pages/PaymentCancel';

// function App() {
//   const location = useLocation();
  
//   // Hide Navbar & Footer on ANY admin route (starts with /admin)
//  const isProtectedRoute =
//     location.pathname.startsWith('/admin') ||
//     location.pathname.startsWith('/doctor-dashboard');

//   return (
//     <div className="min-h-screen flex flex-col">
//        <ToastContainer position="top-right" autoClose={3000} />
//       {!isProtectedRoute && <Navbar />}

//     <main className={isProtectedRoute ? '' : 'flex-grow px-2 md:px-16 lg:px-24 xl:px-32'}>
     
// <Routes>
//   {/* Public routes - show Navbar & Footer */}
//   <Route path="/" element={<Home />} />
//   <Route path="/login" element={<Login />} />
//   <Route path="/doctors" element={<AllDoctors />} />
//   <Route path="/about" element={<About />} />
//   <Route path="/contact" element={<Contact />} />
//   <Route path="/appointment/:id" element={<DoctorDetails />} />
//   <Route path="/my-appointments" element={<MyAppointments />} />
//   <Route path="/profile" element={<MyProfile />} />
//    <Route path="/admin-login" element={<AdminLogin />} /> 
//    <Route path="/payment-success" element={<PaymentSuccess/>} />
// <Route path="/payment-cancel" element={<PaymentCancel />} />
//  <Route path="doctor/register" element={<DoctorRegister/>} />

//   {/* All admin routes wrapped in AdminLayout - NO Navbar/Footer */}
//   <Route path="/admin" element={<AdminLayout />}>
//     <Route index element={<AdminDashboard />} />   
//     <Route path="appointments" element={<AllAppointments />} />  
    
//     <Route path="add-doctor" element={<AddDoctor />} />
//     <Route path="doctors" element={<DoctorsList />} />
//               {/* /admin → dashboard */}
//     {/* Add more sub-pages later */}
//     {/* <Route path="appointments" element={<AdminAppointments />} /> */}
//     {/* <Route path="add-doctor" element={<AddDoctor />} /> */}
//     {/* <Route path="doctors" element={<DoctorsList />} /> */}
//   </Route>

//   <Route path="/doctor-dashboard" element={<DoctorLayout />}>
//   <Route index element={<DoctorDashboard />} /> 
//    <Route path="appointments" element={<DoctorAppointments />} /> 
//     <Route path="profile" element={<DoctorProfile />} /> 
   


//               {/* /doctor-dashboard → main dashboard
//   <Route path="appointments" element={<DoctorAppointments />} /> 
//   // {/* create this page */}
//   {/* <Route path="profile" element={<DoctorProfile />} />          create this page */} 
// </Route>
// </Routes>
//       </main>

//      {!isProtectedRoute && <Footer />}
//     </div>
//   );
// }

// export default App;















// // // src/App.jsx
// // import React from 'react';
// // import { Routes, Route } from 'react-router-dom';
// // import Navbar from './components/Navbar';
// // import Footer from './components/Footer';
// // import Home from './pages/Home';
// //          // ← the combined login/signup page
// // import Login from './pages/Login';
// // import Admin from './pages/AdminDoctor';
// // import AllDoctors from './pages/AllDoctors';
// // import About from './pages/About';
// // import Contact from './pages/Contact';
// // import DoctorDetails from './pages/DoctorsDetails';
// // import MyAppointments from './pages/MyAppointments';
// // import MyProfile from './pages/MyProfile';
// // import AdminDashboard from './admin/AdminDashboard';

// // function App() {
// //   return (
// //     <div className="min-h-screen flex flex-col">
// //       <Navbar />

// //       <main className="flex-grow px-6 md:px-16 lg:px-24 xl:px-32">
// //         <Routes>
// //           <Route path="/" element={<Home />} />
// //           {/* <Route path="/auth" element={<Auth />} />           both login & signup */}
// //           <Route path="/login" element={<Login />} />  
// //            <Route path="/admin" element={<Admin />} />  
// //             <Route path="/doctors" element={<AllDoctors />} />  
// //               <Route path="/about" element={<About />} />  

// //               <Route path="/contact" element={<Contact />} /> 
// //               <Route path="/appointment/:id" element={<DoctorDetails />} />
// //               <Route path="/my-appointments" element={<MyAppointments />} />
// //               <Route path="/profile" element={<MyProfile />} />
// //               <Route path="/admindash" element={<AdminDashboard />} />
             
             
// //                   {/* optional redirect */}
// //           {/* <Route path="/signup" element={<Auth />} /> */}
// //         </Routes>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // }

// // export default App;


// src/App.jsx
// src/App.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Breadcrumbs from './components/Breadcrumbs';

// Lazy load public pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AllDoctors = lazy(() => import('./pages/AllDoctors'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const DoctorDetails = lazy(() => import('./pages/DoctorsDetails'));
const MyAppointments = lazy(() => import('./pages/MyAppointments'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const DoctorRegister = lazy(() => import('./doctor/DoctorRegister'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));

// Admin and doctor routes (direct imports – can also be lazy if desired)
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';
import AllAppointments from './admin/AllAppointments';
import AddDoctor from './admin/AddDoctor';
import DoctorsList from './admin/DoctorsList';
import DoctorLayout from './doctor/DoctorLayout';
import DoctorDashboard from './doctor/DoctorDashboard';
import DoctorAppointments from './doctor/DoctorAppointments';
import DoctorProfile from './doctor/DoctorProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DoctorProfilePage from './pages/DoctorProfilePage';

function App() {
  const location = useLocation();
// Hide Navbar, Breadcrumbs & Footer on admin or doctor dashboard routes
  // Hide Navbar, Breadcrumbs & Footer on admin or doctor dashboard routes
  const isProtectedRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/doctor-dashboard');

  // Google Analytics page view tracking
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-FBNF2CCNYG', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Show Navbar only on public pages */}
      {!isProtectedRoute && <Navbar/>}

      <main className={isProtectedRoute ? '' : 'flex-grow px-2 md:px-16 lg:px-24 xl:px-32'}>
        {/* Show breadcrumbs inside main content area (or move them above main if you prefer) */}
        {!isProtectedRoute && <Breadcrumbs />}

        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctors" element={<AllDoctors />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment/:id" element={<DoctorDetails />} />
             <Route path="/appointment/:id" element={<DoctorProfilePage />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/doctor/register" element={<DoctorRegister />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="appointments" element={<AllAppointments />} />
              <Route path="add-doctor" element={<AddDoctor />} />
              <Route path="doctors" element={<DoctorsList />} />
            </Route>

            {/* Doctor dashboard routes */}
            <Route path="/doctor-dashboard" element={<DoctorLayout />}>
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {!isProtectedRoute && <Footer />}
    </div>
  );
}

export default App;