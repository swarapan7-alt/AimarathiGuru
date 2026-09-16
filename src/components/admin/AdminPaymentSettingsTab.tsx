import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Save,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Check,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { PaymentSettings } from '../../types';

interface AdminPaymentSettingsTabProps {
  onRefresh?: () => void;
}

export const AdminPaymentSettingsTab: React.FC<AdminPaymentSettingsTabProps> = ({ onRefresh }) => {
  const [courseFee, setCourseFee] = useState(99);
  const [originalFee, setOriginalFee] = useState(999);
  
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
        setCourseFee(data.paymentSettings.courseFee || 99);
        setOriginalFee(data.paymentSettings.originalFee || 999);
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
      // Partial update only: persists courseFee and originalFee without touching any other configuration
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseFee: Number(courseFee),
          originalFee: Number(originalFee),
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

  return (
    <div className="space-y-4 max-w-4xl">
      
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-1.5 font-poppins">
            <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Standard Checkout
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
            Payment Settings
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub">
            कोर्स फी रचना आणि अधिकृत Razorpay Standard Checkout व्यवस्थापन
          </p>
        </div>

        {/* Live Status Badges */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black font-poppins">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gateway: ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black font-poppins">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>Live Mode: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>पेमेंट सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या आहेत! वेबसाईटवर नवीन फी लागू झाली आहे.</span>
          </div>
        )}

        {/* 1. Course Fee Structure */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-poppins">
                Course Fee Structure (कोर्स फी रचना)
              </h3>
              <p className="text-[11px] text-slate-500">
                विद्यार्थ्यांसाठी अंतिम फी आणि मूळ फी सेट करा
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Offer Fee */}
            <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-1.5">
              <label className="text-xs font-black text-slate-800 block font-poppins flex items-center justify-between">
                <span>Offer Fee / Final Course Fee</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active Fee</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-base">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={courseFee}
                  onChange={(e) => setCourseFee(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-black text-slate-900 bg-white border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-poppins"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">विद्यार्थ्यांकडून आकारली जाणारी अंतिम फी (₹99)</p>
            </div>

            {/* Original Strike Fee */}
            <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-1.5">
              <label className="text-xs font-black text-slate-800 block font-poppins flex items-center justify-between">
                <span>Original Strike-Through Price</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-slate-600 font-bold line-through">MRP</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-base">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={originalFee}
                  onChange={(e) => setOriginalFee(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-black text-slate-400 bg-white border border-stone-300 rounded-xl outline-none focus:border-blue-600 line-through font-poppins"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">वेबसाईटवर कट करून दाखवली जाणारी मूळ किंमत (₹999)</p>
            </div>

          </div>
        </div>

        {/* 2. Payment Gateway Architecture */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 font-poppins">
                Official Gateway Configuration
              </div>
              <h4 className="text-sm font-black text-slate-900 font-poppins flex items-center gap-1.5">
                <span>Payment Gateway:</span>
                <span className="text-emerald-700">Razorpay Standard Checkout</span>
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider font-poppins flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5" /> Active Gateway
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-slate-900 font-poppins">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Mobile Experience</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Native UPI Intent Checkout. Opens directly into PhonePe, Google Pay, Paytm, or BHIM, returning back to the site upon payment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-slate-900 font-poppins">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span>Desktop Experience</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Razorpay Dynamic UPI QR Code, Debit/Credit Cards, and Netbanking on the active page via official checkout.js.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-100/50 border border-emerald-200 text-[11px] text-emerald-900 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>100% Automated:</strong> Orders API &rarr; Standard Web Checkout &rarr; HMAC Signature Verification &rarr; Instant Webhook &rarr; Automated Confirmation.
            </span>
          </div>
        </div>

        {/* 3. Save Button */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-end">
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

