// src/components/Breadcrumbs.jsx
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDoctors } from '../context/DoctorContext';

const BASE_URL = 'https://appointment-booking-frontend-two.vercel.app';

const Breadcrumbs = () => {
  const location = useLocation();
  const { doctors = [] } = useDoctors();

  // ✅ Always defined (no hook break)
  const pathnames = useMemo(
    () => location.pathname.split('/').filter(Boolean),
    [location.pathname]
  );

  // ✅ Optimized lookup (O(1) instead of find every time)
  const doctorMap = useMemo(() => {
    const map = new Map();
    doctors.forEach((doc) => map.set(doc._id, doc));
    return map;
  }, [doctors]);

  // ✅ Display name generator
  const getDisplayName = (segment) => {
    // MongoDB ObjectId check
    if (/^[0-9a-fA-F]{24}$/.test(segment)) {
      const doctor = doctorMap.get(segment);
      return doctor ? doctor.name : 'Doctor';
    }

    const mapNames = {
      appointment: 'Doctors',
      'doctor-dashboard': 'Dashboard',
      profile: 'Profile',
      'my-appointments': 'My Appointments',
    };

    return (
      mapNames[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };

  // ✅ Main logic (memoized)
  const { crumbs, structuredData } = useMemo(() => {
    const items = [];
    let currentPath = '';

    // Home (always first)
    items.push({
      position: 1,
      name: 'Home',
      path: '/',
      isLast: pathnames.length === 0,
    });

    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;

      let linkPath = currentPath;

      // Custom route fix
      if (segment === 'appointment') {
        linkPath = '/doctors';
      }

      items.push({
        position: index + 2,
        name: getDisplayName(segment),
        path: linkPath,
        isLast,
      });
    });

    // ✅ SEO Structured Data (Google BreadcrumbList)
    const structured = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item) => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.name,
        "item": `${BASE_URL}${item.path}`,
      })),
    };

    return {
      crumbs: items,
      structuredData: structured,
    };
  }, [pathnames, doctorMap]);

  // ✅ Safe conditional AFTER hooks
  if (location.pathname === '/') return null;

  return (
    <>
      {/* ✅ SEO JSON-LD */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* ✅ UI */}
      <nav
        className="py-3 px-4 mb-4 bg-gray-50 rounded-lg text-sm"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center">
          {crumbs.map((crumb) => (
            <li key={crumb.position} className="flex items-center">
              {crumb.position > 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}

              {crumb.isLast ? (
                <span
                  className="text-gray-700 font-medium"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;