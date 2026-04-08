import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import SpecialitySection from '../components/SpecialitySection';
import TopDoctors from '../components/TopDoctors';
import BottomBanner from '../components/BottomBanner';

const Home = () => {
  return (
    <>
     <Helmet>
  <title>Book Appointment with Trusted Doctors | Prescripto</title>
  <meta name="description" content="Find and book appointments with top doctors. Browse by specialty, read reviews, and schedule online." />
  <link rel="canonical" href="https://appointment-booking-frontend-two.vercel.app/" />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": "Prescripto",
      "url": "https://appointment-booking-frontend-two.vercel.app",
      "logo": "https://appointment-booking-frontend-two.vercel.app/logo.svg",
      "description": "Online doctor appointment booking platform connecting patients with trusted specialists.",
      "sameAs": [
        "https://twitter.com/prescripto",
        "https://facebook.com/prescripto"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-234-567-890",
        "contactType": "customer service",
        "email": "support@prescripto.com"
      }
    })}
  </script>
</Helmet>
      <Hero />
      <SpecialitySection />
      <TopDoctors />
      <BottomBanner />
    </>
  );
};

export default Home;