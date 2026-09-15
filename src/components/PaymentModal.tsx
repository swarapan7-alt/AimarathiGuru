import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Zap,
  Lock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Phone,
  RotateCcw,
  HelpCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { RegistrationRecord, RegistrationFormData } from '../types';
import { launchRazorpayStandardCheckout, loadRazorpayScript } from '../utils/razorpay';

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
  fee = 99,
  paymentLink = '',
}) => {
  const [paymentState, setPaymentState] = useState<
    'IDLE' | 'CHECKING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  >('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<RegistrationRecord | null>(null);
  const [confirmedWhatsappMsg, setConfirmedWhatsappMsg] = useState('');

  const targetReg = registration || (formData as any);
  const studentName = targetReg?.fullName || '';
  const studentMobile = targetReg?.mobileNumber || '';
  const studentDate = targetReg?.courseDateDisplay || '';
  const studentSlot = targetReg?.slotTimeDisplay || '';
  const activeTempId = tempId || targetReg?.tempId || targetReg?.id || '';

  const [activePaymentLink, setActivePaymentLink] = useState<string>(paymentLink || '');
  const [effectiveKeyId, setEffectiveKeyId] = useState<string>(razorpayKeyId || '');
  const [effectiveOrderId, setEffectiveOrderId] = useState<string>(razorpayOrderId || '');

  // Pre-load Razorpay script and ensure key is available
  useEffect(() => {
    loadRazorpayScript();
    if (razorpayKeyId) {
      setEffectiveKeyId(razorpayKeyId);
    } else {
      fetch('/api/payment-settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.razorpayKeyId) {
            setEffectiveKeyId(data.razorpayKeyId);
          }
        })
        .catch((err) => console.warn('Payment settings fetch warning:', err));
    }
    if (razorpayOrderId) {
      setEffectiveOrderId(razorpayOrderId);
    }
  }, [razorpayKeyId, razorpayOrderId]);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll server for automated verification status
  const checkPaymentStatus = async (isManual = false) => {
    if (!activeTempId && !studentMobile) return;
    if (isManual) setIsManualChecking(true);

    try {
      const queryParams = new URLSearchParams({
        tempId: activeTempId,
        studentId: activeTempId,
        mobileNumber: studentMobile,
        orderId: effectiveOrderId || razorpayOrderId || '',
      });

      const res = await fetch(`/api/payment/status?${queryParams.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.paymentStatus === 'PAID' && data.registrationStatus === 'CONFIRMED') {
          // Automatic Payment Verified by Server!
          if (pollingRef.current) clearInterval(pollingRef.current);
          setConfirmedRecord(data.registration);
          setConfirmedWhatsappMsg(data.whatsappMessage || '');
          setPaymentState('SUCCESS');
          // Automatically transition to confirmed registration receipt
          setTimeout(() => {
            onPaymentSuccess(data.registration, data.whatsappMessage);
          }, 2000);
        } else if (data.paymentStatus === 'FAILED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPaymentState('FAILED');
          setErrorMessage(data.reason || 'तुमचे पेमेंट पूर्ण झाले नाही. कृपया पुन्हा प्रयत्न करा.');
        } else if (data.paymentStatus === 'CANCELLED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPaymentState('CANCELLED');
          setErrorMessage('पेमेंट रद्द करण्यात आले आहे.');
        }
      }
    } catch (err) {
      console.warn('Status polling error:', err);
    } finally {
      if (isManual) setIsManualChecking(false);
    }
  };

  // Start polling when state is CHECKING
  useEffect(() => {
    if (paymentState === 'CHECKING') {
      // Immediate first check
      checkPaymentStatus();
      // Poll every 2.5 seconds
      pollingRef.current = setInterval(() => {
        checkPaymentStatus();
      }, 2500);

      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [paymentState, activeTempId, studentMobile]);

  // Open Razorpay Payment Flow (Mobile and Desktop Standard Checkout)
  const handleOpenRazorpay = async () => {
    console.log('PAYMENT_FUNCTION_STARTED');
    setErrorMessage('');

    let keyToUse = effectiveKeyId || razorpayKeyId || '';
    if (!keyToUse) {
      try {
        const res = await fetch('/api/payment-settings');
        const data = await res.json();
        if (data.success && data.razorpayKeyId) {
          keyToUse = data.razorpayKeyId;
          setEffectiveKeyId(data.razorpayKeyId);
        }
      } catch (e) {
        console.warn('Could not refresh key settings:', e);
      }
    }

    if (!keyToUse) {
      setErrorMessage('Payment सुरू करता आले नाही. कृपया पुन्हा प्रयत्न करा.');
      return;
    }

    let orderIdToUse = effectiveOrderId || razorpayOrderId || '';
    if ((!orderIdToUse || !orderIdToUse.startsWith('order_')) && activeTempId) {
      try {
        console.log('CREATE_ORDER_REQUEST_STARTED');
        const ordRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tempId: activeTempId, amount: fee }),
        });
        const ordData = await ordRes.json();
        const newOrderId = ordData.order_id || ordData.orderId;
        if (ordData.success && newOrderId && newOrderId.startsWith('order_')) {
          orderIdToUse = newOrderId;
          setEffectiveOrderId(orderIdToUse);
          if (ordData.keyId) {
            setEffectiveKeyId(ordData.keyId);
            keyToUse = ordData.keyId;
          }
        } else {
          setErrorMessage('Payment सुरू करता आले नाही. कृपया पुन्हा प्रयत्न करा.');
          return;
        }
      } catch (e) {
        console.error('Order creation error:', e);
        setErrorMessage('Payment सुरू करता आले नाही. कृपया पुन्हा प्रयत्न करा.');
        return;
      }
    }

    if (!orderIdToUse || !orderIdToUse.startsWith('order_')) {
      setErrorMessage('Payment सुरू करता आले नाही. कृपया पुन्हा प्रयत्न करा.');
      return;
    }

    const launched = await launchRazorpayStandardCheckout({
      keyId: keyToUse,
      orderId: orderIdToUse,
      amountInPaise: fee * 100,
      name: 'AI Marathi Guru',
      description: 'Live Online Course Registration Fee',
      prefill: {
        name: studentName,
        contact: studentMobile,
        email: targetReg?.email || '',
      },
      notes: {
        tempId: activeTempId,
        studentId: activeTempId,
        mobileNumber: studentMobile,
      },
      onSuccess: async (response) => {
        setPaymentState('CHECKING');
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tempId: activeTempId,
              studentId: activeTempId,
              mobileNumber: studentMobile,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id || orderIdToUse,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const data = await verifyRes.json();
          if (verifyRes.ok && data.success && data.registration && data.registrationStatus === 'CONFIRMED') {
            setConfirmedRecord(data.registration);
            setConfirmedWhatsappMsg(data.whatsappMessage);
            setPaymentState('SUCCESS');
            setTimeout(() => {
              onPaymentSuccess(data.registration, data.whatsappMessage);
            }, 1800);
          } else {
            setPaymentState('FAILED');
            setErrorMessage(data.error || 'तुमचे पेमेंट पूर्ण झाले नाही. कृपया पुन्हा प्रयत्न करा.');
          }
        } catch (e) {
          setPaymentState('FAILED');
          setErrorMessage('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.');
        }
      },
      onDismiss: () => {
        setPaymentState('CANCELLED');
        fetch('/api/payment/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tempId: activeTempId, mobileNumber: studentMobile }),
        }).catch(() => {});
      },
      onError: (err: any) => {
        setPaymentState('FAILED');
        setErrorMessage(err?.description || err?.message || 'पेमेंट सुरू करता आले नाही. कृपया पुन्हा प्रयत्न करा.');
        fetch('/api/payment/fail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tempId: activeTempId,
            mobileNumber: studentMobile,
            reason: err?.description || 'Payment failed',
          }),
        }).catch(() => {});
      },
    });

    if (!launched) {
      setErrorMessage('Razorpay Checkout उघडता आले नाही. कृपया इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.');
    }
  };

  // Retry payment after failure or cancellation
  const handleRetryPayment = () => {
    console.log('PAY_BUTTON_CLICKED');
    setPaymentState('IDLE');
    setErrorMessage('');
    handleOpenRazorpay();
  };

  // Cancel / Dismiss Modal
  const handleCancelModal = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (activeTempId && paymentState !== 'SUCCESS') {
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

        {/* Pricing Display */}
        <div className="bg-blue-50 px-6 py-3.5 border-b border-blue-100 flex items-center justify-between text-sm">
          <div>
            <span className="text-slate-700 font-bold block">कोर्स फी (Course Fee):</span>
            <span className="text-xs text-slate-400 line-through font-poppins">₹999</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-black text-amber-700 uppercase font-poppins">SPECIAL OFFER:</span>
            <span className="text-2xl font-black text-[#DC2626] font-poppins">🔥 ONLY ₹{fee}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: Registration Details Summary */}
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
              {paymentState === 'SUCCESS' ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider font-poppins flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider font-poppins flex items-center gap-1">
                  <Clock className="w-3 h-3" /> PAYMENT PENDING
                </span>
              )}
            </div>
          </div>

          {/* DYNAMIC WORKFLOW ACCORDING TO PAYMENT STATE */}

          {/* 1. SUCCESS STATE */}
          {paymentState === 'SUCCESS' && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 font-extrabold text-xs uppercase tracking-wider font-poppins">
                  <span>✅ PAYMENT SUCCESSFUL</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-poppins pt-1">
                  ✅ REGISTRATION CONFIRMED
                </h3>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  तुमचे ₹{fee} पेमेंट यशस्वी झाले आहे.
                </p>
                <p className="text-xs text-slate-700 font-medium">
                  तुमची AI Marathi Guru Live Course साठी नोंदणी पूर्ण झाली आहे.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirmedRecord) {
                      onPaymentSuccess(confirmedRecord, confirmedWhatsappMsg);
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition uppercase tracking-wider font-poppins"
                >
                  <span>नोंदणी पावती पहा (VIEW RECEIPT)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 2. CHECKING / PENDING STATE */}
          {paymentState === 'CHECKING' && (
            <div className="p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-blue-950 font-poppins">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>STEP 2: पेमेंट ऑटोमॅटिक तपासले जात आहे</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full font-poppins flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> ⏳ PAYMENT PENDING
                </span>
              </div>

              {/* Animated Radar / Verification Card */}
              <div className="p-4 bg-white rounded-xl border border-blue-100 text-center space-y-2.5 shadow-xs">
                <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800">
                    तुमचे पेमेंट तपासले जात आहे. कृपया काही क्षण प्रतीक्षा करा.
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    Razorpay वरून ₹{fee} पेमेंट पूर्ण होताच तुमची नोंदणी आपोआप कन्फर्म होईल.
                  </p>
                </div>
              </div>

              {/* Automatic Assurance Note */}
              <div className="p-3 bg-white/70 rounded-xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
                <p className="flex items-start gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>कोणताही Payment ID किंवा Transaction ID टाईप करण्याची गरज नाही.</span>
                </p>
                <p className="flex items-start gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>सिस्टम पेमेंट आपोआप तपासून नोंदणी पावती व WhatsApp ग्रुप लिंक दाखवेल.</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => checkPaymentStatus(true)}
                  disabled={isManualChecking}
                  className="w-full bg-white hover:bg-slate-50 border border-blue-300 text-blue-900 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition active:scale-[0.99]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isManualChecking ? 'animate-spin' : ''}`} />
                  <span>{isManualChecking ? 'तपासणी चालू आहे...' : 'पेमेंट स्थिती पुन्हा तपासा (Check Status Now)'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleOpenRazorpay}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>पेमेंट स्क्रीन पुन्हा उघडा</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetryPayment}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition cursor-pointer"
                  >
                    रद्द करा
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. FAILED STATE */}
          {paymentState === 'FAILED' && (
            <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 text-red-800 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>❌ PAYMENT FAILED</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed font-bold">
                तुमचे पेमेंट पूर्ण झाले नाही. कृपया पुन्हा प्रयत्न करा.
              </p>
              {errorMessage && (
                <p className="text-[11px] text-red-600 font-medium bg-white/70 p-2.5 rounded-lg border border-red-200">
                  {errorMessage}
                </p>
              )}
              <p className="text-[11px] text-slate-600">
                पेमेंट पूर्ण झाल्याशिवाय नोंदणी कन्फर्म होत नाही. कृपया पुन्हा प्रयत्न करा किंवा बँक/UPI ॲप तपासा.
              </p>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 uppercase tracking-wider font-poppins cursor-pointer transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RETRY PAYMENT</span>
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
          )}

          {/* 4. CANCELLED STATE */}
          {paymentState === 'CANCELLED' && (
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>पेमेंट पूर्ण झाले नाही.</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-bold">
                कृपया पुन्हा प्रयत्न करा.
              </p>
              <p className="text-[11px] text-slate-600">
                पेमेंट स्क्रीन बंद झाली किंवा रद्द झाली. नोंदणी पूर्ण करण्यासाठी खालील बटणावर क्लिक करा.
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  className="w-full bg-[#E53935] hover:bg-[#D32F2F] active:scale-[0.99] text-white text-xs font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 uppercase tracking-wider font-poppins cursor-pointer transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RETRY PAYMENT</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. IDLE STATE: STEP 1 - PAY VIA RAZORPAY */}
          {paymentState === 'IDLE' && (
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
                खालील बटणावर क्लिक करून Razorpay वर <strong>₹{fee}</strong> पेमेंट करा.
              </p>
              
              <button
                type="button"
                id="modal-pay-razorpay-btn"
                onClick={() => {
                  console.log('PAY_BUTTON_CLICKED');
                  handleOpenRazorpay();
                }}
                className="w-full bg-[#E53935] hover:bg-[#D32F2F] active:scale-[0.99] text-white text-sm font-black py-4 px-4 rounded-2xl shadow-lg shadow-[#E53935]/30 flex items-center justify-center gap-2.5 uppercase tracking-wider font-poppins cursor-pointer transition"
              >
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>PAY ₹{fee}</span>
              </button>

              {/* Payment Method Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {['Google Pay', 'PhonePe', 'Paytm', 'UPI QR', 'Cards', 'NetBanking'].map((method, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-white rounded-md border border-blue-200 text-slate-700 shadow-xs">
                    ✓ {method}
                  </span>
                ))}
              </div>

              <p className="text-[11px] text-center text-slate-500 font-medium pt-1">
                पेमेंट होताच सिस्टम आपोआप पडताळणी करून नोंदणी कन्फर्म करेल.
              </p>
            </div>
          )}

          {/* Security & SSL Guarantee */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-Bit SSL Encrypted • Official Razorpay Payment Gateway</span>
          </div>

        </div>

      </div>
    </div>
  );
};
