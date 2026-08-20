import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhatYouWillLearn } from './components/WhatYouWillLearn';
import { LiveSessionSection } from './components/LiveSessionSection';
import { InstructorSection } from './components/InstructorSection';
import { RegistrationForm } from './components/RegistrationForm';
import { FAQSection } from './components/FAQSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { PaymentModal } from './components/PaymentModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { StudentLookupModal } from './components/StudentLookupModal';
import { AdminPanel } from './components/AdminPanel';
import { PolicyModal } from './components/PolicyModal';
import { StickyMobileCta } from './components/StickyMobileCta';
import { StickyWhatsApp } from './components/StickyWhatsApp';
import { Footer } from './components/Footer';
import {
  RegistrationFormData,
  RegistrationRecord,
  CourseDateRecord,
  SiteSettings,
  PaymentSettings,
  WhatsAppSettings,
} from './types';

export default function App() {
  const [pendingFormData, setPendingFormData] = useState<RegistrationFormData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState<RegistrationRecord | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [communityLink, setCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [paymentLink, setPaymentLink] = useState('https://rzp.io/l/ai-marathi-guru');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Content loaded from backend with persistent instant local storage cache
  const [courseDates, setCourseDates] = useState<CourseDateRecord[]>([]);
  const [courseFee, setCourseFee] = useState(199);
  const [siteSettings, setSiteSettings] = useState<Partial<SiteSettings>>(() => {
    try {
      const cached = localStorage.getItem('amg_cached_site_settings');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return {
      instructorName: 'श्री. पंकज वाघमारे',
      instructorNameEn: 'Mr. Pankaj Waghmare',
      instructorTitle: 'Founder & CEO, AI Marathi Guru',
      instructorPhoto: '/pankaj-photo.png',
      instructor_photo_url: '/pankaj-photo.png',
    };
  });
  const [paymentSettings, setPaymentSettings] = useState<Partial<PaymentSettings>>({});
  const [whatsappSettings, setWhatsappSettings] = useState<Partial<WhatsAppSettings>>({});

  // Modal triggers
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  // Check URL on load for /admin or #admin
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/admin' || hash === '#admin') {
      setShowAdminModal(true);
    }

    const handlePopState = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setShowAdminModal(true);
      } else {
        setShowAdminModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    setShowAdminModal(true);
    if (window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
  };

  const closeAdmin = () => {
    setShowAdminModal(false);
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    // Refresh content when admin closes
    fetchContent();
  };

  // Fetch Site Content from API
  useEffect(() => {
    fetchContent();

    const handleSettingsUpdated = () => {
      fetchContent();
    };

    window.addEventListener('websiteSettingsUpdated', handleSettingsUpdated);
    window.addEventListener('website-settings-updated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('websiteSettingsUpdated', handleSettingsUpdated);
      window.removeEventListener('website-settings-updated', handleSettingsUpdated);
    };
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (res.ok) {
        if (data.courseDates) setCourseDates(data.courseDates);
        if (data.siteSettings) {
          setSiteSettings(data.siteSettings);
          try {
            localStorage.setItem('amg_cached_site_settings', JSON.stringify(data.siteSettings));
          } catch (_) {}
          if (data.siteSettings.courseFee) setCourseFee(data.siteSettings.courseFee);
        }
        if (data.paymentSettings) {
          setPaymentSettings(data.paymentSettings);
          if (data.paymentSettings.courseFee) setCourseFee(data.paymentSettings.courseFee);
          if (data.paymentSettings.razorpayPaymentLink) setPaymentLink(data.paymentSettings.razorpayPaymentLink);
        }
        if (data.whatsappSettings) {
          setWhatsappSettings(data.whatsappSettings);
          if (data.whatsappSettings.communityLink) setCommunityLink(data.whatsappSettings.communityLink);
        }
      }
    } catch (err) {
      console.error('Failed to load content from server:', err);
    }
  };

  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Called when user submits registration form
  const handleFormSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setPendingFormData(data);

    try {
      // 1. Save pending registration record to database
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          paymentStatus: 'PENDING',
          paymentId: 'PENDING_PAYMENT',
          amountPaid: courseFee,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.registration) {
        setCurrentRegistration(resData.registration);
        setWhatsappMessage(resData.whatsappMessage || '');
        if (resData.paymentLink) setPaymentLink(resData.paymentLink);
        if (resData.communityLink) setCommunityLink(resData.communityLink);

        // 2. Open official Razorpay hosted link
        const targetLink = resData.paymentLink || paymentLink || 'https://rzp.io/rzp/gAmUJOS0';
        try {
          window.open(targetLink, '_blank', 'noopener,noreferrer');
        } catch (e) {
          // Fallback handled in modal
        }

        // 3. Open Payment Modal
        setShowPaymentModal(true);
      } else {
        alert(resData.error || 'नोंदणी प्रक्रियेत अडचण आली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (err) {
      console.error('Registration submit error:', err);
      // Still show payment modal as fallback
      setShowPaymentModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Called when payment succeeds / verified
  const handlePaymentSuccess = async (paymentId: string) => {
    setShowPaymentModal(false);
    setIsLoading(true);

    try {
      const regId = currentRegistration?.id;
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: regId,
          registrationId: regId,
          mobileNumber: pendingFormData?.mobileNumber || currentRegistration?.mobileNumber,
          paymentId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.registration) {
        setCurrentRegistration(data.registration);
        setWhatsappMessage(data.whatsappMessage || '');
        if (data.communityLink) setCommunityLink(data.communityLink);
        setShowConfirmationModal(true);
        // Refresh available seats
        fetchContent();
      } else {
        alert(data.error || 'नोंदणी कन्फर्मेशन मध्ये अडचण आली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      alert('सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#E53935] selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP HEADER */}
      <Navbar
        onOpenLookup={() => setShowLookupModal(true)}
        onOpenAdmin={openAdmin}
        onScrollToRegister={scrollToRegister}
      />

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <HeroSection
          onScrollToRegister={scrollToRegister}
          instructorPhoto={siteSettings.instructor_photo_url || siteSettings.instructorPhoto || siteSettings.instructorPhotoUrl || ''}
          communityLink={communityLink}
        />

        {/* 3. WHAT YOU WILL LEARN (6 clean cards) */}
        <WhatYouWillLearn onScrollToRegister={scrollToRegister} />

        {/* 4. LIVE SESSION SECTION (5 clean cards) */}
        <LiveSessionSection onScrollToRegister={scrollToRegister} />

        {/* 5. ABOUT INSTRUCTOR (Single Premium Card) */}
        <InstructorSection
          instructorName={siteSettings.instructorName || 'श्री. पंकज वाघमारे'}
          instructorNameEn={siteSettings.instructorNameEn || 'Mr. Pankaj Waghmare'}
          instructorTitle={siteSettings.instructorTitle || 'Founder & CEO, AI Marathi Guru'}
          instructorBio={siteSettings.instructorBio}
          instructorPhoto={siteSettings.instructor_photo_url || siteSettings.instructorPhoto || siteSettings.instructorPhotoUrl || ''}
          onScrollToRegister={scrollToRegister}
        />

        {/* 6. REGISTRATION SECTION */}
        <RegistrationForm
          onSubmitRegistration={handleFormSubmit}
          isLoading={isLoading}
          courseDates={courseDates}
          fee={courseFee}
        />

        {/* 7. FAQ SECTION (4 exact questions) */}
        <FAQSection />

        {/* 8. FINAL CTA (Clean & compact) */}
        <FinalCtaSection
          onScrollToRegister={scrollToRegister}
          fee={courseFee}
        />
      </main>

      {/* FOOTER */}
      <Footer
        onOpenLookup={() => setShowLookupModal(true)}
        onOpenAdmin={openAdmin}
        onOpenPolicyModal={(type) => setPolicyType(type)}
      />

      {/* Sticky Mobile Bar & Sticky WhatsApp */}
      <StickyMobileCta onScrollToRegister={scrollToRegister} />
      <StickyWhatsApp />

      {/* MODALS */}
      {showPaymentModal && pendingFormData && (
        <PaymentModal
          formData={pendingFormData}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          fee={courseFee}
          paymentLink={paymentLink}
        />
      )}

      {showConfirmationModal && currentRegistration && (
        <ConfirmationModal
          registration={currentRegistration}
          whatsappMessage={whatsappMessage}
          communityLink={communityLink}
          onClose={() => setShowConfirmationModal(false)}
        />
      )}

      {showLookupModal && (
        <StudentLookupModal
          communityLink={communityLink}
          onClose={() => setShowLookupModal(false)}
        />
      )}

      {showAdminModal && (
        <AdminPanel onClose={closeAdmin} />
      )}

      {policyType && (
        <PolicyModal type={policyType} onClose={() => setPolicyType(null)} />
      )}

    </div>
  );
}
