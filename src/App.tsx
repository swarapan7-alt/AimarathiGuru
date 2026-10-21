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
import { loadRazorpayScript, launchRazorpayStandardCheckout } from './utils/razorpay';

export default function App() {
  const [pendingFormData, setPendingFormData] = useState<RegistrationFormData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState<RegistrationRecord | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [communityLink, setCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string>('');

  // Dynamic Content loaded from backend with persistent instant local storage cache
  const [courseDates, setCourseDates] = useState<CourseDateRecord[]>([]);
  const [courseFee, setCourseFee] = useState<number>(() => {
    try {
      const cached = localStorage.getItem('amg_cached_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.courseFee && !isNaN(Number(parsed.courseFee))) return Number(parsed.courseFee);
      }
    } catch (_) {}
    return 99;
  });
  const [originalFee, setOriginalFee] = useState<number>(() => {
    try {
      const cached = localStorage.getItem('amg_cached_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.oldPrice && !isNaN(Number(parsed.oldPrice))) return Number(parsed.oldPrice);
        if (parsed.originalFee && !isNaN(Number(parsed.originalFee))) return Number(parsed.originalFee);
      }
    } catch (_) {}
    return 999;
  });
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

  // Fetch Site Content from API and preload Razorpay Checkout script
  useEffect(() => {
    fetchContent();
    loadRazorpayScript();

    const handleSettingsUpdated = () => {
      fetchContent();
    };

    window.addEventListener('websiteSettingsUpdated', handleSettingsUpdated);
    window.addEventListener('website-settings-updated', handleSettingsUpdated);
    window.addEventListener('paymentSettingsUpdated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('websiteSettingsUpdated', handleSettingsUpdated);
      window.removeEventListener('website-settings-updated', handleSettingsUpdated);
      window.removeEventListener('paymentSettingsUpdated', handleSettingsUpdated);
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
          if (data.siteSettings.courseFee !== undefined && !isNaN(Number(data.siteSettings.courseFee))) {
            setCourseFee(Number(data.siteSettings.courseFee));
          }
          if (data.siteSettings.oldPrice !== undefined && !isNaN(Number(data.siteSettings.oldPrice))) {
            setOriginalFee(Number(data.siteSettings.oldPrice));
          }
        }
        if (data.paymentSettings) {
          setPaymentSettings(data.paymentSettings);
          if (data.paymentSettings.courseFee !== undefined && !isNaN(Number(data.paymentSettings.courseFee))) {
            setCourseFee(Number(data.paymentSettings.courseFee));
          }
          if (data.paymentSettings.originalFee !== undefined && !isNaN(Number(data.paymentSettings.originalFee))) {
            setOriginalFee(Number(data.paymentSettings.originalFee));
          }
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

  const [pendingSession, setPendingSession] = useState<{
    tempId?: string;
    registration?: RegistrationRecord;
    razorpayKeyId?: string;
    razorpayOrderId?: string;
  } | null>(null);

  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check for returning payment redirect or pending session on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payId =
      urlParams.get('razorpay_payment_id') ||
      urlParams.get('payment_id') ||
      '';
    const plinkId =
      urlParams.get('razorpay_payment_link_id') ||
      urlParams.get('plink_id') ||
      '';

    const storedSession = localStorage.getItem('amg_pending_session');
    let parsedSession: any = null;
    if (storedSession) {
      try {
        parsedSession = JSON.parse(storedSession);
      } catch (_) {}
    }

    if (payId || plinkId || parsedSession) {
      const tempId = parsedSession?.tempId || '';
      const mobileNumber = parsedSession?.mobileNumber || '';

      fetch('/api/payment/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempId,
          mobileNumber,
          razorpay_payment_id: payId,
          razorpay_payment_link_id: plinkId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (
            data.success &&
            data.paymentStatus === 'PAID' &&
            data.registrationStatus === 'CONFIRMED' &&
            data.registration
          ) {
            // Securely confirmed!
            localStorage.removeItem('amg_pending_session');
            window.history.replaceState({}, document.title, window.location.pathname);
            setCurrentRegistration(data.registration);
            setWhatsappMessage(data.whatsappMessage || '');
            setShowConfirmationModal(true);
          } else if (parsedSession) {
            setPendingSession({
              tempId,
              registration: parsedSession,
            });
            setShowPaymentModal(true);
          }
        })
        .catch((err) => console.warn('Payment check on return error:', err));
    }
  }, []);

  // Called when user submits registration form
  const handleFormSubmit = async (data: RegistrationFormData) => {
    console.log('PAY_BUTTON_CLICKED');
    setIsLoading(true);
    setRegistrationError('');
    setPendingFormData(data);

    try {
      // 1. Save temporary PENDING registration on server
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        if (resData.communityLink) setCommunityLink(resData.communityLink);

        if (
          resData.alreadyRegistered &&
          resData.registration &&
          resData.paymentStatus === 'PAID'
        ) {
          // If already paid and confirmed, show confirmation directly
          setCurrentRegistration(resData.registration);
          setWhatsappMessage(resData.whatsappMessage || '');
          setShowConfirmationModal(true);
          setIsLoading(false);
          return;
        }

        // Store pending session for tracking and return reconciliation
        const sessionPayload = {
          tempId: resData.tempId,
          mobileNumber: data.mobileNumber,
          fullName: data.fullName,
          courseDateDisplay:
            resData.pendingRegistration?.courseDateDisplay || data.courseDateDisplay,
          slotTimeDisplay:
            resData.pendingRegistration?.slotTimeDisplay || data.slotTimeDisplay,
          amount: resData.amount || 99,
        };
        localStorage.setItem('amg_pending_session', JSON.stringify(sessionPayload));

        // Open Razorpay Standard Checkout in PaymentModal
        setPendingSession({
          tempId: resData.tempId,
          registration: resData.pendingRegistration,
          razorpayKeyId: resData.keyId || paymentSettings?.razorpayKeyId,
          razorpayOrderId: resData.orderId || resData.order_id,
        });
        setShowPaymentModal(true);
      } else {
        setIsLoading(false);
        setRegistrationError(
          resData.error ||
            'नोंदणी प्रक्रियेत अडचण आली. कृपया सर्व आवश्यक माहिती तपासा आणि पुन्हा प्रयत्न करा.',
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Registration submit error:', err);
      setRegistrationError('तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Called when payment is successfully verified by server
  const handlePaymentSuccess = (confirmedRegistration: RegistrationRecord, verifiedWhatsappMessage?: string) => {
    setShowPaymentModal(false);
    setPendingSession(null);
    setCurrentRegistration(confirmedRegistration);
    setWhatsappMessage(verifiedWhatsappMessage || '');
    setShowConfirmationModal(true);
    // Refresh available seat counts immediately
    fetchContent();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#E53935] selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP HEADER */}
      <Navbar
        onOpenLookup={() => setShowLookupModal(true)}
        onOpenAdmin={openAdmin}
        onScrollToRegister={scrollToRegister}
        fee={courseFee}
        oldPrice={originalFee}
      />

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <HeroSection
          onScrollToRegister={scrollToRegister}
          instructorPhoto={siteSettings.instructor_photo_url || siteSettings.instructorPhoto || siteSettings.instructorPhotoUrl || ''}
          communityLink={communityLink}
          fee={courseFee}
          oldPrice={originalFee}
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
          oldPrice={originalFee}
          submissionError={registrationError}
        />

        {/* 7. FAQ SECTION (4 exact questions) */}
        <FAQSection />

        {/* 8. FINAL CTA (Clean & compact) */}
        <FinalCtaSection
          onScrollToRegister={scrollToRegister}
          fee={courseFee}
          oldPrice={originalFee}
        />
      </main>

      {/* FOOTER */}
      <Footer
        onOpenLookup={() => setShowLookupModal(true)}
        onOpenAdmin={openAdmin}
        onOpenPolicyModal={(type) => setPolicyType(type)}
      />

      {/* Sticky Mobile Bar & Sticky WhatsApp */}
      <StickyMobileCta
        onScrollToRegister={scrollToRegister}
        fee={courseFee}
        oldPrice={originalFee}
      />
      <StickyWhatsApp />

      {/* MODALS */}
      {showPaymentModal && (pendingSession || pendingFormData) && (
        <PaymentModal
          formData={pendingFormData || undefined}
          registration={pendingSession?.registration}
          tempId={pendingSession?.tempId}
          razorpayKeyId={pendingSession?.razorpayKeyId}
          razorpayOrderId={pendingSession?.razorpayOrderId}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingSession(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          fee={courseFee}
          oldPrice={originalFee}
          paymentLink={paymentSettings?.paymentLink || 'https://rzp.io/rzp/Wvuh93a'}
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
