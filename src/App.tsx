import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { WelcomeSection } from "./components/WelcomeSection";
import { Gallery } from "./components/Gallery";
import { Mission } from "./components/Mission";
import { Testimonials } from "./components/Testimonials";
import { SchedulingSection } from "./components/SchedulingSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

// Admin Imports
import { AdminLayout } from "./admin/AdminLayout";
import { Dashboard } from "./admin/Dashboard";
import { Bookings } from "./admin/Bookings";
import { Calendar } from "./admin/Calendar";
import { Login } from "./admin/Login";
import { Testimonials as AdminTestimonials } from "./admin/Testimonials";
import { TestimonialFormPage } from "./pages/TestimonialFormPage";
import { ds } from "./design-system/classes";

function LandingPage() {
  return (
    <div className={ds.page}>
      <Header />
      <main>
        <Hero />
        <WelcomeSection />
        <Gallery />
        <Mission />
        <Testimonials />
        <SchedulingSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Client testimonial capture (shareable link) */}
        <Route path="/share-your-story" element={<TestimonialFormPage />} />

        {/* Admin Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
