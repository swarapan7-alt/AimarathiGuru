import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { RegistrationRecord, RegistrationFormData } from '../types';

interface PaymentModalProps {
  formData?: RegistrationFormData | RegistrationRecord;
  registration?: RegistrationRecord | null;
  tempId?: string;
  razorpayKeyId?: string;
  razorpayOrderId?: string;
  onClose: () => void;
  onPaymentSuccess: (confirmedRegistration: RegistrationRecord, whatsappMessage?: string) => void;
  fee?: number;
  paymentLink?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  formData,
  registration,
  tempId,
  razorpayKeyId,
  razorpayOrderId,
  onClose,
  onPaymentSuccess,
  fee = 199,
  paymentLink = 'https://rzp.io/rzp/gAmUJOS0',
}) => {
  const [paymentState, setPaymentState] = useState<'PENDING' | 'VERIFYING' | 'FAILED'>('PENDING');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const targetReg = registration || (formData as any);
  const studentName = targetReg?.fullName || '';
  const studentMobile = targetReg?.mobileNumber || '';
  const studentDate = targetReg?.courseDateDisplay || '';
  const studentSlot = targetReg?.slotTimeDisplay || '';
  const activeTempId = tempId || targetReg?.tempId || targetReg?.id || '';

  const activePaymentLink = paymentLink || 'https://rzp.io/rzp/gAmUJOS0';

  // STEP 2: Proceed to Payment (Open Official Hosted Gateway)
  const handleOpenRazorpay = () => {
    try {
      window.open(activePaymentLink, '_blank', 'noopener,noreferrer');
    } catch (e) {
      window.location.href = activePaymentLink;
    }
  };

  // STEP 3 & STEP 9: Strict Server-Side Verification
  const handleVerifyPayment = async () => {
    const cleanPayId = transactionId.trim();
    if (!cleanPayId) {
      setErrorMessage('कृपया Razorpay Payment ID किंवा Transaction ID टाका (उदा. pay_OkZ981a2 किंवा UPI Ref No).');
      return;
    }

    setErrorMessage('');
    setPaymentState('VERIFYING');

    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempId: activeTempId,
          studentId: activeTempId,
          mobileNumber: studentMobile,
          paymentId: cleanPayId,
          razorpay_payment_id: cleanPayId,
          razorpay_order_id: razorpayOrderId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.registration && data.registrationStatus === 'CONFIRMED') {
        // STEP 3: Successful Verification - Notify parent with verified registration and WhatsApp template
        onPaymentSuccess(data.registration, data.whatsappMessage);
      } else {
        // STEP 4: Payment Verification Failed
        setPaymentState('FAILED');
        setErrorMessage(data.error || 'पेमेंट पडताळणी अयशस्वी झाली. कृपया अधिकृत Payment ID तपासा किंवा पुन्हा पेमेंट करा.');
        
        // Notify server of failed attempt
        fetch('/api/payment/fail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tempId: activeTempId,
            studentId: activeTempId,
            mobileNumber: studentMobile,
            reason: data.error || 'Invalid or unverified transaction ID entered by user',
          }),
        }).catch(() => {});
      }
    } catch (err: any) {
      setPaymentState('FAILED');
      setErrorMessage('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया तुमचे इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.');
    }
  };

  // STEP 4: Retry Payment after failure
  const handleRetryPayment = () => {
    setPaymentState('PENDING');
    setErrorMessage('');
    setTransactionId('');
  };

  // STEP 5: Cancel / Dismiss Payment Modal
  const handleCancelModal = () => {
    // Notify server of cancelled session
    if (activeTempId) {
      fetch('/api/payment/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempId: activeTempId,
          studentId: activeTempId,
          mobileNumber: studentMobile,
        }),
      }).catch(() => {});
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-blue-300 text-lg font-poppins">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white font-poppins">Razorpay Secure Checkout</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-400/20 font-poppins">
                  LIVE GATEWAY
                </span>
              </div>
              <p className="text-xs text-slate-300">AI Marathi Guru — Live Online Training</p>
            </div>
          </div>
          
          <button
            onClick={handleCancelModal}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Bar */}
        <div className="bg-blue-50 px-6 py-3.5 border-b border-blue-100 flex items-center justify-between text-sm">
          <span className="text-slate-700 font-bold">कोर्स फी (Course Registration Fee):</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-poppins">₹{fee}</span>
            <span className="text-xs text-slate-500 font-bold">.00</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: Registration Details Summary (Pending Verification) */}
          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> विद्यार्थी नाव:
              </span>
              <span className="font-bold text-slate-900">{studentName || 'नोंदणीकृत विद्यार्थी'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> मोबाईल नंबर:
              </span>
              <span className="font-bold text-slate-900 font-mono">{studentMobile}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> बॅच तारीख व वेळ:
              </span>
              <span className="font-bold text-[#E53935]">{studentDate} {studentSlot ? `(${studentSlot})` : ''}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/80">
              <span className="text-slate-500 font-medium">नोंदणी स्थिती (Status):</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider font-poppins flex items-center gap-1">
                <Clock className="w-3 h-3" /> PAYMENT PENDING
              </span>
            </div>
          </div>

          {/* STEP 4: FAILURE VIEW */}
          {paymentState === 'FAILED' ? (
            <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 text-red-800 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>Payment Verification Failed (पेमेंट अयशस्वी)</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                {errorMessage || 'तुमचे पेमेंट कन्फर्म होऊ शकले नाही. कृपया अचूक Payment ID तपासा किंवा पुन्हा पेमेंट करा.'}
              </p>
              <div className="p-3 bg-white/80 rounded-xl border border-red-100 text-[11px] text-slate-600 space-y-1">
                <p>• पेमेंट पूर्ण झाले नसल्यास नोंदणी कन्फर्म होत नाही.</p>
                <p>• कोणतीही रक्कम खात्यातून कट झाली असल्यास आणि ID सापडत नसल्यास सपोर्टशी संपर्क करा.</p>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 uppercase tracking-wider font-poppins cursor-pointer transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुन्हा प्रयत्न करा (RETRY)</span>
                </button>
                <a
                  href="https://wa.me/919801555171?text=Payment%20Help%20AI%20Marathi%20Guru"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold py-3 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Support</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 2: Direct Razorpay Action Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border-2 border-blue-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-blue-950 font-poppins">
                    <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                    <span>STEP 1: अधिकृत पेमेंट पूर्ण करा</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full font-poppins">
                    SECURE LINK
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  खालील बटणावर क्लिक करून थेट Razorpay वरून <strong>Google Pay, PhonePe, Paytm, QR Code, Cards किंवा NetBanking</strong> द्वारे ₹{fee} पेमेंट करा:
                </p>
                
                <button
                  type="button"
                  onClick={handleOpenRazorpay}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 uppercase tracking-wider font-poppins cursor-pointer transition"
                >
                  <ExternalLink className="w-4.5 h-4.5" />
                  <span>OPEN RAZORPAY PAYMENT LINK (₹{fee})</span>
                </button>

                {/* Payment Method Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  {['Google Pay', 'PhonePe', 'Paytm UPI', 'BHIM QR', 'Cards', 'NetBanking'].map((method, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-white rounded-md border border-blue-200 text-slate-700 shadow-xs">
                      ✓ {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* STEP 3: Verify Payment Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>STEP 2: पेमेंट झाल्यावर पडताळणी करा</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium font-poppins">
                    SERVER VERIFIED
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-600 block">
                    Razorpay Payment ID / Transaction ID टाका:
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="उदा. pay_OkZ981a2 किंवा UPI Ref No"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono focus:border-emerald-600 outline-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    पेमेंट झाल्यावर Razorpay स्क्रीनवर किंवा SMS/Email मध्ये मिळालेला Payment ID येथे टाका.
                  </p>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleVerifyPayment}
                  disabled={paymentState === 'VERIFYING'}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer font-poppins"
                >
                  {paymentState === 'VERIFYING' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>पेमेंट पडताळणी करत आहे...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>VERIFY & CONFIRM PAYMENT (नोंदणी पूर्ण करा)</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Security & SSL Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-Bit SSL Encrypted • Official Razorpay Payment Gateway</span>
          </div>

        </div>

      </div>
    </div>
  );
};
