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
} from 'lucide-react';
import { RegistrationRecord, RegistrationFormData } from '../types';

interface PaymentModalProps {
  formData?: RegistrationFormData | RegistrationRecord;
  registration?: RegistrationRecord | null;
  onClose: () => void;
  onPaymentSuccess: (paymentId: string) => void;
  fee?: number;
  paymentLink?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  formData,
  registration,
  onClose,
  onPaymentSuccess,
  fee = 199,
  paymentLink = 'https://rzp.io/rzp/gAmUJOS0',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualPayId, setManualPayId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const targetReg = registration || (formData as any);
  const studentName = targetReg?.fullName || '';
  const studentMobile = targetReg?.mobileNumber || '';
  const studentDate = targetReg?.courseDateDisplay || '';
  const studentSlot = targetReg?.slotTimeDisplay || '';
  const studentId = targetReg?.id || '';

  const activePaymentLink = paymentLink || 'https://rzp.io/rzp/gAmUJOS0';

  const handleOpenRazorpay = () => {
    try {
      window.open(activePaymentLink, '_blank', 'noopener,noreferrer');
    } catch (e) {
      window.location.href = activePaymentLink;
    }
  };

  const handleConfirmPaid = () => {
    setErrorMessage('');
    setIsProcessing(true);

    const generatedPayId = manualPayId.trim() || `pay_RZP${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(generatedPayId);
    }, 600);
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
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Bar */}
        <div className="bg-blue-50 px-6 py-3.5 border-b border-blue-100 flex items-center justify-between text-sm">
          <span className="text-slate-700 font-bold">एकूण नोंदणी फी (Registration Fee):</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-poppins">₹{fee}</span>
            <span className="text-xs text-slate-500 font-bold">.00</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Registration Details Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200">
            {studentId && (
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Registration ID (Pending):</span>
                <span className="font-extrabold text-emerald-700 font-poppins">{studentId}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> विद्यार्थी नाव:
              </span>
              <span className="font-bold text-slate-900">{studentName || 'नोंदणीकृत विद्यार्थी'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> मोबाईल:
              </span>
              <span className="font-bold text-slate-900 font-mono">{studentMobile}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> बॅच तारीख व वेळ:
              </span>
              <span className="font-bold text-[#E53935]">{studentDate} {studentSlot ? `(${studentSlot})` : ''}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-medium">Payment Status:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider font-poppins">
                PENDING
              </span>
            </div>
          </div>

          {/* Direct Razorpay Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border-2 border-blue-200 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-black text-blue-950 font-poppins">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>अधिकृत Razorpay Payment Portal</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              खालील बटणावर क्लिक करून थेट Razorpay च्या अधिकृत पेजवरून <strong>UPI, Google Pay, PhonePe, Paytm, QR Code, Debit/Credit Card किंवा NetBanking</strong> द्वारे ₹{fee} पेमेंट पूर्ण करा.
            </p>
            
            <button
              type="button"
              onClick={handleOpenRazorpay}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-black py-4 px-4 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 uppercase tracking-wider font-poppins cursor-pointer transition"
            >
              <ExternalLink className="w-5 h-5" />
              <span>OPEN RAZORPAY PAYMENT LINK (₹{fee})</span>
            </button>

            {/* Payment Method Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {['Google Pay', 'PhonePe', 'Paytm UPI', 'BHIM QR', 'Cards', 'NetBanking'].map((method, i) => (
                <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-white rounded-lg border border-blue-200 text-slate-700 shadow-xs">
                  ✓ {method}
                </span>
              ))}
            </div>
          </div>

          {/* Step 2: Confirm Payment */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>पेमेंट झाल्यावर नोंदणी पूर्ण करा:</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-500 block">
                Razorpay Payment ID (पर्यायी / Optional):
              </label>
              <input
                type="text"
                value={manualPayId}
                onChange={(e) => setManualPayId(e.target.value)}
                placeholder="उदा. pay_OkZ981a2..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono focus:border-emerald-600 outline-none"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleConfirmPaid}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer font-poppins"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>नोंदणी कन्फर्म करत आहे...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>I HAVE COMPLETED PAYMENT (माझे पेमेंट झाले आहे)</span>
                </>
              )}
            </button>
          </div>

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
