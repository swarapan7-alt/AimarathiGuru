import React, { useState, useEffect } from 'react';
import {
  Mail,
  Save,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Code,
  MessageSquare,
} from 'lucide-react';
import { MessageTemplates } from '../../types';

interface AdminMessagesTabProps {
  onRefresh?: () => void;
}

export const AdminMessagesTab: React.FC<AdminMessagesTabProps> = ({ onRefresh }) => {
  const [templates, setTemplates] = useState<MessageTemplates>({
    registrationSuccess: `नमस्कार {student_name} 👋\n\nAI Marathi Guru मध्ये तुमची नोंदणी प्राप्त झाली आहे. 📝\n\n📅 Date: {course_date}\n⏰ Slot: {course_slot}\n💰 Status: {payment_status}\n\nपुढील सूचनांसाठी WhatsApp Community शी कनेक्ट राहा:\n{whatsapp_link}`,
    paymentPending: `नमस्कार {student_name} 👋\n\nतुमची AI Marathi Guru रजिस्ट्रेशन प्रोसेस सुरू झाली आहे. कृपया खालील लिंकवरून ₹{course_fee} पेमेंट पूर्ण करा:\n{payment_link}\n\nपेमेंट झाल्यावर तात्काळ WhatsApp Community ॲक्सेस मिळेल.`,
    paymentSuccess: `🎉 अभिनंदन {student_name}!\n\nतुमचे AI Marathi Guru Live Training साठी Registration व Payment यशस्वी झाले आहे.\n\n📅 Date: {course_date}\n⏰ Slot: {course_slot}\n💰 Payment: PAID (₹{course_fee})\n\nआता खालील लिंकवर क्लिक करून Official WhatsApp Community Join करा:\n{whatsapp_link}\n\nGoogle Meet: {meet_link}\n\nधन्यवाद!\nAI Marathi Guru`,
    whatsappJoin: `नमस्कार {student_name} 👋\n\nAI Marathi Guru बॅचमध्ये स्वागत आहे! सर्व क्लास अपडेट्स, Google Meet लिंक व स्टडी मटेरियल मिळवण्यासाठी त्वरित खालील Official Community Join करा:\n{whatsapp_link}`,
    courseReminder: `नमस्कार {student_name} 👋\n\nआज तुमचे AI Marathi Guru Live Training आहे.\n\n📅 तारीख: {course_date}\n⏰ वेळ: {course_slot}\n\nकृपया क्लास वेळेच्या १० मिनिटे आधी तयार राहा. भेटूया लाईव्ह सेशन्समध्ये! 🚀`,
    liveSessionMessage: `नमस्कार {student_name} 👋\n\nतुमचा AI Marathi Guru Live Class सुरू होत आहे!\n\n📅 Date: {course_date}\n⏰ Slot: {course_slot}\n🔗 Google Meet Link: {meet_link}\n\nकृपया त्वरित जॉईन व्हा.`,
  });

  const [activeTemplateKey, setActiveTemplateKey] = useState<keyof MessageTemplates>('paymentSuccess');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.templates) {
        setTemplates((prev) => ({ ...prev, ...data.templates }));
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
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templates }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('मेसेज सेव्ह करता आले नाहीत.');
      }
    } catch (e) {
      console.error(e);
      alert('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  const availableVariables = [
    { code: '{student_name}', desc: 'विद्यार्थ्याचे नाव' },
    { code: '{course_date}', desc: 'कोर्सची तारीख' },
    { code: '{course_slot}', desc: 'कोर्सची वेळ/स्लॉट' },
    { code: '{payment_status}', desc: 'पेमेंट स्थिती (PAID/PENDING)' },
    { code: '{course_fee}', desc: 'कोर्स फी (₹199)' },
    { code: '{whatsapp_link}', desc: 'WhatsApp Community लिंक' },
    { code: '{meet_link}', desc: 'Google Meet लिंक' },
    { code: '{registration_id}', desc: 'नोंदणी क्रमांक (ID)' },
  ];

  // Insert variable into active template
  const insertVariable = (variableCode: string) => {
    setTemplates((prev) => ({
      ...prev,
      [activeTemplateKey]: (prev[activeTemplateKey] || '') + variableCode,
    }));
  };

  // Sample Preview Generator
  const previewText = (templates[activeTemplateKey] || '')
    .replace(/{student_name}/gi, 'विकास पाटील')
    .replace(/{course_date}/gi, 'रविवार, २३ ऑगस्ट २०२६')
    .replace(/{course_slot}/gi, 'सकाळी ११:०० ते १:००')
    .replace(/{payment_status}/gi, 'PAID')
    .replace(/{course_fee}/gi, '199')
    .replace(/{whatsapp_link}/gi, 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO')
    .replace(/{meet_link}/gi, 'https://meet.google.com/amg-live-session')
    .replace(/{registration_id}/gi, 'AMG-2026-00042')
    .replace(/{payment_link}/gi, 'https://rzp.io/l/ai-marathi-guru');

  const templateTabs: Array<{ id: keyof MessageTemplates; title: string; desc: string }> = [
    { id: 'paymentSuccess', title: 'Payment Success', desc: 'पेमेंट पूर्ण झाल्यावर पाठवला जाणारा मेसेज' },
    { id: 'registrationSuccess', title: 'Registration Success', desc: 'नोंदणी झाल्यावर मिळणारा पहिला मेसेज' },
    { id: 'paymentPending', title: 'Payment Pending', desc: 'पेमेंट बाकी असलेल्या विद्यार्थ्यांना पाठवायचा मेसेज' },
    { id: 'whatsappJoin', title: 'WhatsApp Join Reminder', desc: 'कम्युनिटी जॉईन करण्याचे स्मरण' },
    { id: 'courseReminder', title: 'Course Reminder', desc: 'क्लासच्या दिवशी पाठवायचा मेसेज' },
    { id: 'liveSessionMessage', title: 'Live Session Google Meet', desc: 'लाईव्ह क्लास लिंकचा संदेश' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider mb-2 font-poppins">
            <Mail className="w-3.5 h-3.5" /> Automated Message Templates
          </div>
          <h1 className="text-xl font-black text-slate-900 font-poppins">
            Automated Messages & WhatsApp Templates
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub">
            विद्यार्थ्यांना पाठवले जाणारे सर्व संदेश कस्टमाईज करा. यात डायनॅमिक व्हेरिएबल्स वापरू शकता.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>सर्व मेसेज टेम्पलेट्स यशस्वीरित्या सेव्ह केले आहेत!</span>
          </div>
        )}

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {templateTabs.map((tab) => {
            const isSelected = activeTemplateKey === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTemplateKey(tab.id)}
                className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-900/20'
                    : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
                }`}
              >
                <div className="text-xs font-extrabold truncate">{tab.title}</div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {tab.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Variables Palette */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 font-poppins">
            <Code className="w-3.5 h-3.5 text-blue-600" />
            <span>Available Variables (क्लिक करून मेसेजमध्ये जोडा):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((v) => (
              <button
                key={v.code}
                type="button"
                onClick={() => insertVariable(v.code)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-800 text-[11px] font-mono font-bold hover:border-blue-300 transition cursor-pointer flex items-center gap-1"
                title={v.desc}
              >
                <span className="text-blue-600">+</span>
                <span>{v.code}</span>
                <span className="text-[10px] text-slate-400 font-sans">({v.desc})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area Editor & Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Template Editor */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block font-poppins flex items-center justify-between">
              <span>Message Editor ({activeTemplateKey})</span>
              <span className="text-[11px] text-slate-400 font-normal">मराठी युनिकोड सपोर्ट</span>
            </label>
            <textarea
              rows={12}
              required
              value={templates[activeTemplateKey] || ''}
              onChange={(e) =>
                setTemplates({
                  ...templates,
                  [activeTemplateKey]: e.target.value,
                })
              }
              className="w-full p-4 text-xs font-mono bg-stone-50 border border-stone-300 rounded-2xl outline-none focus:border-blue-600 leading-relaxed text-slate-800"
            />
          </div>

          {/* Live Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 block font-poppins flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Live WhatsApp Message Preview</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(previewText);
                  setCopiedPreview(true);
                  setTimeout(() => setCopiedPreview(false), 2000);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedPreview ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>Copy Preview</span>
              </button>
            </div>

            <div className="p-4 bg-[#EFEAE2] rounded-2xl border border-stone-300 min-h-[265px] flex flex-col justify-between shadow-inner">
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-xs font-sans text-slate-900 whitespace-pre-wrap leading-relaxed max-w-[95%]">
                {previewText}
              </div>
              <div className="text-[10px] text-stone-500 text-right pt-2 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'Save Message Templates'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
