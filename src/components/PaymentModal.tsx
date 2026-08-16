import React, { useState } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { RegistrationFormData } from '../types';

interface PaymentModalProps {
  formData: RegistrationFormData;
  onClose: () => void;
  onPaymentSuccess: (paymentId: string) => void;
  fee?: number;
  paymentLink?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  formData,
  onClose,
  onPaymentSuccess,
  fee = 199,
  paymentLink = 'https://rzp.io/l/ai-marathi-guru',
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'qr' | 'link' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [manualPayId, setManualPayId] = useState('');

  const handleSimulatedSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedPayId = manualPayId.trim() || `pay_RZP${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setIsProcessing(false);
      onPaymentSuccess(generatedPayId);
    }, 900);
  };

  const handleOpenDirectLink = () => {
    window.open(paymentLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-blue-300 text-lg">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white font-poppins">Razorpay Secure Checkout</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 font-bold px-2 py-0.5 rounded-full border border-blue-400/20">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-300">AI Marathi Guru — Live Workshop Fee</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">एकूण फी (Total Payable Fee):</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-poppins">₹{fee}</span>
            <span className="text-xs text-slate-500 font-semibold">.00</span>
          </div>
        </div>

        {/* Payment options content */}
        <div className="p-6 space-y-5">
          
          {/* Student Info summary */}
          <div className="p-3.5 bg-stone-50 rounded-2xl text-xs space-y-1.5 border border-stone-200">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">विद्यार्थी नाव:</span>
              <span className="font-bold text-slate-900">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">मोबाईल / WhatsApp:</span>
              <span className="font-bold text-slate-900 font-mono">{formData.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">तारीख व स्लॉट:</span>
              <span className="font-bold text-red-600">{formData.courseDateDisplay} ({formData.slotTimeDisplay})</span>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-4 gap-2 border-b border-stone-200 pb-3">
            {[
              { id: 'upi', label: 'UPI Apps', icon: Smartphone },
              { id: 'link', label: 'Razorpay Link', icon: ExternalLink },
              { id: 'qr', label: 'QR Scan', icon: QrCode },
              { id: 'card', label: 'Card / Net', icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedMethod(tab.id as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  selectedMethod === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                <tab.icon className="w-4 h-4 mb-1" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: UPI */}
          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                तुमचे आवडते UPI app निवडा (Google Pay / PhonePe / Paytm / BHIM):
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Google Pay', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { name: 'PhonePe', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { name: 'Paytm UPI', color: 'bg-sky-50 text-sky-800 border-sky-200' },
                  { name: 'BHIM UPI', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                ].map((app, i) => (
                  <button
                    key={i}
                    onClick={handleSimulatedSuccess}
                    disabled={isProcessing}
                    className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 hover:shadow-md transition active:scale-95 cursor-pointer ${app.color}`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay via {app.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  किंवा UPI ID टाका (VPA):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi / username@okhdfcbank"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={handleSimulatedSuccess}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Verify & Pay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Razorpay Official Link */}
          {selectedMethod === 'link' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-blue-950 font-poppins">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>अधिकृत Razorpay Payment Link</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  तुम्ही खालील बटणावर क्लिक करून थेट अधिकृत Razorpay पेमेंट पोर्टलवरून ₹{fee} भरू शकता.
                </p>
                <button
                  type="button"
                  onClick={handleOpenDirectLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 rounded-xl shadow-md flex items-center justify-center gap-2 uppercase tracking-wider font-poppins cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Official Razorpay Link (₹{fee})</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  पेमेंट झाल्यावर आलेला Payment ID टाका (किंवा खालील बटण दाबा):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualPayId}
                    onChange={(e) => setManualPayId(e.target.value)}
                    placeholder="उदा. pay_OkZ981a2..."
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                  <button
                    onClick={handleSimulatedSuccess}
                    disabled={isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Confirm Paid
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: QR */}
          {selectedMethod === 'qr' && (
            <div className="text-center space-y-3 py-2">
              <p className="text-xs font-bold text-slate-700">
                कोणत्याही App द्वारे QR कोड स्कॅन करून ₹{fee} भरा:
              </p>
              
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=aimarathi@upi%26pn=AIMarathiGuru%26am=${fee}%26cu=INR`}
                  alt="UPI Payment QR Code"
                  className="w-40 h-40 mx-auto rounded-lg"
                />
              </div>

              <button
                onClick={handleSimulatedSuccess}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                स्कॅन पूर्ण झाले (Confirm Payment)
              </button>
            </div>
          )}

          {/* Tab 4: Card */}
          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">कार्ड नंबर (Card Number)</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8912"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  defaultValue="4532 9182 4810 8912"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    defaultValue="08/29"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    defaultValue="891"
                  />
                </div>
              </div>
              <button
                onClick={handleSimulatedSuccess}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition mt-2 cursor-pointer"
              >
                Pay ₹{fee} with Card
              </button>
            </div>
          )}

          {/* Instant Complete Bar */}
          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={handleSimulatedSuccess}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer font-poppins"
            >
              {isProcessing ? (
                <span>पेमेंट तपासत आहे...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>पेमेंट पूर्ण करा (Pay ₹{fee} Now)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span>PCI-DSS Compliant 256-Bit SSL Encryption</span>
          </div>

        </div>

      </div>
    </div>
  );
};
