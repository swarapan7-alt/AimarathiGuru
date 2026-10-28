import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
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
  const [courseFee, setCourseFee] = useState<number | string>(99);
  const [originalFee, setOriginalFee] = useState<number | string>(999);
  const [paymentLink, setPaymentLink] = useState('https://rzp.io/rzp/Wvuh93a');
  const [gateway, setGateway] = useState('Razorpay Payment Link');
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [gatewayStatus, setGatewayStatus] = useState('ACTIVE');
  const [liveMode, setLiveMode] = useState('ACTIVE');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    setIsLoading(true);
    setSaveError('');
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/payment-settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const ps = data.paymentSettings || data;
        if (ps.courseFee !== undefined && !isNaN(Number(ps.courseFee))) {
          setCourseFee(Number(ps.courseFee));
        }
        if (ps.originalFee !== undefined && !isNaN(Number(ps.originalFee))) {
          setOriginalFee(Number(ps.originalFee));
        } else if (ps.oldPrice !== undefined && !isNaN(Number(ps.oldPrice))) {
          setOriginalFee(Number(ps.oldPrice));
        }
        if (ps.paymentLink) {
          setPaymentLink(ps.paymentLink);
        }
        if (ps.gateway) {
          setGateway(ps.gateway);
        }
        if (ps.razorpayKeyId) {
          setRazorpayKeyId(ps.razorpayKeyId);
        }
        if (ps.gatewayStatus) {
          setGatewayStatus(ps.gatewayStatus);
        }
        if (ps.liveMode) {
          setLiveMode(ps.liveMode);
        }
      } else {
        setSaveError(data.error || 'पेमेंट सेटिंग्ज लोड करता आल्या नाहीत.');
      }
    } catch (e) {
      console.error('Failed fetching payment settings:', e);
      setSaveError('सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    const token = localStorage.getItem('amg_admin_token');
    const feeNum = Number(courseFee);
    const origNum = Number(originalFee);

    if (isNaN(feeNum) || feeNum <= 0) {
      setSaveError('कृपया वैध Course Fee (रक्कम) प्रविष्ट करा.');
      setIsSaving(false);
      return;
    }

    if (isNaN(origNum) || origNum <= 0) {
      setSaveError('कृपया वैध Original MRP (मूळ फी) प्रविष्ट करा.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gateway,
          courseFee: feeNum,
          originalFee: origNum,
          oldPrice: origNum,
          paymentLink: paymentLink.trim() || 'https://rzp.io/rzp/Wvuh93a',
          razorpayKeyId: razorpayKeyId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccess(true);
        const ps = data.paymentSettings || data;
        if (ps.courseFee !== undefined) setCourseFee(Number(ps.courseFee));
        if (ps.originalFee !== undefined) setOriginalFee(Number(ps.originalFee));
        if (ps.gateway) setGateway(ps.gateway);
        if (ps.gatewayStatus) setGatewayStatus(ps.gatewayStatus);
        if (ps.liveMode) setLiveMode(ps.liveMode);

        // Sync with browser storage for instant persistence across pages/tabs
        try {
          const cached = localStorage.getItem('amg_cached_site_settings');
          const obj = cached ? JSON.parse(cached) : {};
          obj.courseFee = feeNum;
          obj.oldPrice = origNum;
          localStorage.setItem('amg_cached_site_settings', JSON.stringify(obj));
        } catch (_) {}

        // Broadcast to all open tabs and components in real time
        window.dispatchEvent(new CustomEvent('websiteSettingsUpdated', { detail: data }));
        window.dispatchEvent(new CustomEvent('website-settings-updated', { detail: data }));
        window.dispatchEvent(new CustomEvent('paymentSettingsUpdated', { detail: data }));

        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 4500);
      } else {
        setSaveError(data.error || 'पेमेंट सेटिंग्ज सेव्ह करता आल्या नाहीत. कृपया सर्व्हर तपासा.');
      }
    } catch (e) {
      console.error(e);
      setSaveError('सर्व्हर एरर. नेटवर्क किंवा सर्व्हर कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.');
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
            <ShieldCheck className="w-3.5 h-3.5" /> {gateway}
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
            Payment Settings
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub">
            कोर्स फी रचना, अधिकृत Razorpay पेमेंट मोड व सर्व्हर-साईड पडताळणी व्यवस्थापन
          </p>
        </div>

        {/* Live Status Badges from Server */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black font-poppins">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gateway: {gatewayStatus}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black font-poppins">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>Live Mode: {liveMode}</span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>पेमेंट सेटिंग्ज यशस्वीरित्या सेव्ह झाल्या आहेत! वेबसाईटवर नवीन सेटिंग्ज कायमस्वरूपी लागू झाल्या आहेत.</span>
          </div>
        )}

        {saveError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* 1. Payment Gateway Mode Selection */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="text-xs font-black text-slate-800 block font-poppins uppercase tracking-wider">
            Active Payment Gateway Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition ${gateway === 'Razorpay Payment Link' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
              <input
                type="radio"
                name="gateway_mode"
                checked={gateway === 'Razorpay Payment Link'}
                onChange={() => setGateway('Razorpay Payment Link')}
                className="mt-0.5 text-blue-600"
              />
              <div className="text-xs">
                <span className="font-black text-slate-900 block font-poppins">Razorpay Payment Link (Recommended)</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  विद्यार्थी थेट अधिकृत पेमेंट लिंकवर रिडायरेक्ट होतात. कोणत्याही Frontend API Key ची गरज नसते.
                </span>
              </div>
            </label>

            <label className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition ${gateway === 'Razorpay Standard Checkout' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
              <input
                type="radio"
                name="gateway_mode"
                checked={gateway === 'Razorpay Standard Checkout'}
                onChange={() => setGateway('Razorpay Standard Checkout')}
                className="mt-0.5 text-blue-600"
              />
              <div className="text-xs">
                <span className="font-black text-slate-900 block font-poppins">Razorpay Standard Checkout (Popup)</span>
                <span className="text-slate-500 text-[11px] leading-relaxed">
                  वेबसाईटवरच Razorpay पॉप-अप उघडतो. यासाठी वैध Razorpay Key ID आवश्यक असतो.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Course Fee Structure */}
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
                  onChange={(e) => setCourseFee(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-black text-slate-900 bg-white border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-poppins"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">विद्यार्थ्यांकडून आकारली जाणारी अंतिम फी (₹{courseFee || 99})</p>
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
                  onChange={(e) => setOriginalFee(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-black text-slate-400 bg-white border border-stone-300 rounded-xl outline-none focus:border-blue-600 line-through font-poppins"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">वेबसाईटवर कट करून दाखवली जाणारी मूळ किंमत (₹{originalFee || 999})</p>
            </div>

          </div>
        </div>

        {/* 3. Official Razorpay Payment Link Configuration */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-800 font-poppins">
                Official Gateway Configuration
              </div>
              <h4 className="text-sm font-black text-slate-900 font-poppins flex items-center gap-1.5">
                <span>Active Gateway:</span>
                <span className="text-blue-700">{gateway}</span>
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider font-poppins flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5" /> {gatewayStatus}
              </span>
            </div>
          </div>

          {/* Payment Link Input */}
          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 font-poppins flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Active Razorpay Payment Link (अधिकृत पेमेंट लिंक)</span>
              </label>
              <a
                href={paymentLink || 'https://rzp.io/rzp/Wvuh93a'}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline"
              >
                Test Link ↗
              </a>
            </div>

            <div className="relative">
              <input
                type="url"
                required
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="https://rzp.io/rzp/Wvuh93a"
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              विद्यार्थ्यांनी "PAY ₹{courseFee}" वर क्लिक केल्यास ते थेट या Razorpay अधिकृत पेमेंट लिंकवर रिडायरेक्ट होतील.
            </p>
          </div>

          {/* Standard Checkout Key ID Input (Shown when selected or configured) */}
          {gateway === 'Razorpay Standard Checkout' && (
            <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-2">
              <label className="text-xs font-black text-slate-800 font-poppins flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Razorpay Key ID (rzp_live_...)</span>
              </label>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                placeholder="rzp_live_xxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <p className="text-[11px] text-slate-500">
                Razorpay Standard Checkout पॉप-अपसाठी आवश्यक Key ID. (Secret Key सर्व्हरवर सुरक्षित ठेवली जाते).
              </p>
            </div>
          )}

          {/* Webhook Reconciliation Info */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-100 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-black text-slate-800 font-poppins">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay Webhook Verification & Reconciliation</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p>
                <strong>Webhook URL:</strong>{' '}
                <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800">
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/payment/webhook` : '/api/payment/webhook'}
                </code>
              </p>
              <p>
                <strong>Monitored Events:</strong>{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">
                  payment_link.paid
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">
                  payment.captured
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">
                  payment.failed
                </code>
              </p>
              <p className="text-emerald-800 font-medium">
                ✓ HMAC-SHA256 Raw-Body Signature Check • Amount & Currency Verification • Automatic Duplicate Protection
              </p>
            </div>
          </div>
        </div>

        {/* 4. Save Button */}
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

