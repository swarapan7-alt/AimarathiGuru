import React, { useState, useEffect } from 'react';
import {
  Video,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { LiveSessionSettings } from '../../types';

interface AdminLiveSessionSettingsTabProps {
  onRefresh?: () => void;
}

export const AdminLiveSessionSettingsTab: React.FC<AdminLiveSessionSettingsTabProps> = ({ onRefresh }) => {
  const [googleMeetLink, setGoogleMeetLink] = useState('https://meet.google.com/amg-live-session');
  const [instructions, setInstructions] = useState(
    'कृपया क्लासच्या १० मिनिटे आधी लॅपटॉप किंवा मोबाईलवर Google Meet लिंक ओपन करा. हेडफोन वापरल्यास आवाज अधिक स्पष्ट ऐकू येईल. क्लासमध्ये प्रश्न विचारण्यासाठी माईक किंवा चॅट बॉक्सचा वापर करू शकता.'
  );
  const [sessionAccessMessage, setSessionAccessMessage] = useState(
    'Live session लिंक फक्त नोंदणीकृत विद्यार्थ्यांना उपलब्ध आहे.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/live-session', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.liveSessionSettings) {
        setGoogleMeetLink(data.liveSessionSettings.googleMeetLink || 'https://meet.google.com/amg-live-session');
        setInstructions(
          data.liveSessionSettings.instructions ||
            'कृपया क्लासच्या १० मिनिटे आधी लॅपटॉप किंवा मोबाईलवर Google Meet लिंक ओपन करा. हेडफोन वापरल्यास आवाज अधिक स्पष्ट ऐकू येईल.'
        );
        setSessionAccessMessage(
          data.liveSessionSettings.sessionAccessMessage || 'Live session लिंक फक्त नोंदणीकृत विद्यार्थ्यांना उपलब्ध आहे.'
        );
      }
    } catch (e) {
      console.error(e);
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
      const res = await fetch('/api/admin/live-session', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          googleMeetLink: googleMeetLink.trim(),
          instructions: instructions.trim(),
          sessionAccessMessage: sessionAccessMessage.trim(),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('Live Session सेटिंग्ज सेव्ह करता आल्या नाहीत.');
      }
    } catch (e) {
      console.error(e);
      alert('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    setGoogleMeetLink('https://meet.google.com/amg-live-session');
    setInstructions(
      'कृपया क्लासच्या १० मिनिटे आधी लॅपटॉप किंवा मोबाईलवर Google Meet लिंक ओपन करा. हेडफोन वापरल्यास आवाज अधिक स्पष्ट ऐकू येईल. क्लासमध्ये प्रश्न विचारण्यासाठी माईक किंवा चॅट बॉक्सचा वापर करू शकता.'
    );
    setSessionAccessMessage('Live session लिंक फक्त नोंदणीकृत विद्यार्थ्यांना उपलब्ध आहे.');
  };

  return (
    <div className="space-y-3.5 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-800 to-slate-900 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Video className="w-3 h-3" />
            <span>Google Meet & Live Training</span>
          </div>
          <h1 className="text-base sm:text-lg font-black font-poppins">
            Live Session Settings (थेट लाईव्ह क्लास व्यवस्थापन)
          </h1>
          <p className="text-rose-100 text-[11px] max-w-2xl font-marathi-sub">
            येथून Google Meet लिंक, क्लास सुरू होण्यापूर्वीच्या सूचना व ॲक्सेस मेसेज व्यवस्थापित करा.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-xs">Live Session सेटिंग्ज यशस्वीरित्या अपडेट झाल्या आहेत!</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">SAVED</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-4">
        
        {/* Google Meet Link Field */}
        <div className="space-y-1">
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span>Google Meet Live Class Link *</span>
            </span>
            {googleMeetLink && (
              <a
                href={googleMeetLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-[10px] font-bold normal-case"
              >
                <span>Test Meet Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </label>
          <input
            type="url"
            value={googleMeetLink}
            onChange={(e) => setGoogleMeetLink(e.target.value)}
            placeholder="https://meet.google.com/xxx-yyyy-zzz"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white transition"
            required
          />
          <p className="text-[10px] text-slate-500">
            ही लिंक नोंदणीकृत विद्यार्थ्यांना WhatsApp द्वारे आणि रजिस्ट्रेशन पावतीवर आपोआप दिली जाते.
          </p>
        </div>

        {/* Live Session Instructions */}
        <div className="space-y-1">
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>विद्यार्थ्यांसाठी लाईव्ह क्लासच्या सूचना (Session Instructions) *</span>
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="क्लासच्या वेळेत काय करावे, कसे जॉईन करावे याबद्दलच्या सूचना..."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white transition leading-relaxed"
            required
          />
        </div>

        {/* Session Access Message */}
        <div className="space-y-1">
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Session Access Notice (ॲक्सेस सूचना)</span>
          </label>
          <input
            type="text"
            value={sessionAccessMessage}
            onChange={(e) => setSessionAccessMessage(e.target.value)}
            placeholder="उदा. Live session लिंक फक्त नोंदणीकृत विद्यार्थ्यांना उपलब्ध आहे."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white transition"
          />
        </div>

        {/* Live Session Preview Box */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Student Preview</span>
            <span className="text-emerald-400 font-mono">LIVE TRAINING INFO</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
              <Video className="w-3.5 h-3.5" />
              <span className="truncate">Google Meet: {googleMeetLink}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {instructions}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={handleResetDefault}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg border border-stone-300 text-slate-600 hover:bg-stone-100 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Default</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Live Session Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
