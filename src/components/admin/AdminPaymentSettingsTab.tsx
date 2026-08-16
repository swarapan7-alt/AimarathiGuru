import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';
import { PaymentSettings } from '../../types';

interface AdminPaymentSettingsTabProps {
  onRefresh?: () => void;
}

export const AdminPaymentSettingsTab: React.FC<AdminPaymentSettingsTabProps> = ({ onRefresh }) => {
  const [courseFee, setCourseFee] = useState(199);
  const [originalFee, setOriginalFee] = useState(999);
  const [razorpayLink, setRazorpayLink] = useState('https://rzp.io/l/ai-marathi-guru');
  const [paymentMode, setPaymentMode] = useState<'payment_link' | 'razorpay_modal' | 'both'>('both');
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_live_defaultKey');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/payment-settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.paymentSettings) {
        setCourseFee(data.paymentSettings.courseFee || 199);
        setOriginalFee(data.paymentSettings.originalFee || 999);
        setRazorpayLink(data.paymentSettings.razorpayPaymentLink || 'https://rzp.io/l/ai-marathi-guru');
        setPaymentMode(data.paymentSettings.paymentMode || 'both');
        setRazorpayKeyId(data.paymentSettings.razorpayKeyId || '');
      }
    } catch (e) {
      console.error('Failed fetching payment settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseFee: Number(courseFee),
          originalFee: Number(originalFee),
          razorpayPaymentLink: razorpayLink.trim(),
          paymentMode,
          razorpayKeyId: razorpayKeyId.trim(),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('पेमेंट सेटिंग्ज सेव्ह करता आल्या नाहीत.');
      }
    } catch (e) {
      console.error(e);
      alert('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestLink = () => {
    if (!razorpayLink) {
      alert('कृपया आधी Razorpay Payment Link टाका.');
      return;
    }
    window.open(razorpayLink, '_blank');
  };

  return (
    <div className="space-y-3.5 max-w-4xl">
      
      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-1 font-poppins">
            <ShieldCheck className="w-3 h-3" /> Razorpay Integration
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
            Payment Settings & Razorpay Link
          </h1>
          <p className="text-[11px] text-slate-500 font-marathi-sub">
            कोर्स फी (₹199), मूळ फी (₹999) आणि Razorpay Payment Link व्यवस्थापन
          </p>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gateway Active</span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-4">
        
        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>पेमेंट सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या आहेत! संपूर्ण वेबसाईटवर नवीन फी आणि लिंक लागू झाली आहे.</span>
          </div>
        )}

        {/* 1. Pricing Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 font-poppins flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Course Fee Structure (कोर्स फी)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Offer Fee */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <label className="text-xs font-extrabold text-slate-700 block font-poppins">
                Offer Fee / Final Course Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  required
                  value={courseFee}
                  onChange={(e) => setCourseFee(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-black text-slate-900 bg-white border border-stone-300 rounded-lg outline-none focus:border-blue-600 font-poppins"
                />
              </div>
              <p className="text-[9px] text-slate-500 font-medium">विद्यार्थ्यांकडून आकारली जाणारी अंतिम फी (उदा. 199)</p>
            </div>

            {/* Original Strike Fee */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <label className="text-xs font-extrabold text-slate-700 block font-poppins">
                Original Strike-Through Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  required
                  value={originalFee}
                  onChange={(e) => setOriginalFee(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-black text-slate-400 bg-white border border-stone-300 rounded-lg outline-none focus:border-blue-600 line-through font-poppins"
                />
              </div>
              <p className="text-[9px] text-slate-500 font-medium">वेबसाईटवर कट करून दाखवली जाणारी मूळ किंमत (उदा. 999)</p>
            </div>

          </div>
        </div>

        {/* 2. Razorpay Payment Link Field */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-black text-blue-950 block font-poppins">
                RAZORPAY_PAYMENT_LINK (पेमेंट लिंक)
              </label>
              <p className="text-[11px] text-blue-800">
                विद्यार्थ्याने नोंदणी फॉर्म भरल्यावर वापरली जाणारी अधिकृत Razorpay पेमेंट लिंक
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-800 hover:bg-blue-100 border border-blue-300 text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Payment Link</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="url"
              required
              value={razorpayLink}
              onChange={(e) => setRazorpayLink(e.target.value)}
              placeholder="https://rzp.io/l/ai-marathi-guru"
              className="w-full px-4 py-3 text-xs bg-white border border-blue-300 rounded-xl outline-none focus:border-blue-700 font-mono text-slate-800 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-blue-900 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>टीप: तुम्ही कधीही ही लिंक बदलू शकता. सर्व नोंदणी बटणे आपोआप या लिंकचा वापर करतील.</span>
          </div>
        </div>

        {/* 3. Payment Mode & Gateway Options */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold text-slate-700 block font-poppins">
            Payment Gateway Execution Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'both', title: 'Hybrid (Link + Modal)', desc: 'Direct Razorpay link + instant verification' },
              { id: 'payment_link', title: 'Direct Payment Link Only', desc: 'Opens official rzp.io checkout page directly' },
              { id: 'razorpay_modal', title: 'In-app Checkout Modal', desc: 'Simulated UPI & card instant checkout' },
            ].map((mode) => (
              <div
                key={mode.id}
                onClick={() => setPaymentMode(mode.id as any)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  paymentMode === mode.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-slate-900">{mode.title}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMode === mode.id ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`} />
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Save Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'Save Payment Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
