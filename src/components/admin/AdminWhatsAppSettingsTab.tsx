import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Save,
  CheckCircle2,
  ExternalLink,
  Phone,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Code,
} from 'lucide-react';
import { WhatsAppSettings } from '../../types';

interface AdminWhatsAppSettingsTabProps {
  onRefresh?: () => void;
}

const DEFAULT_WHATSAPP_TEMPLATE = `🎉 नमस्कार {student_name}!

तुमचे AI Marathi Guru Live Training साठी Registration आणि Payment यशस्वी झाले आहे. ✅

📋 Registration ID: {registration_id}

📅 Course Date: {course_date}

⏰ Slot: {course_slot}

💰 Payment Status: {payment_status}

महत्त्वाच्या Course Updates आणि Live Session ची माहिती मिळवण्यासाठी खालील AI Marathi Guru WhatsApp Community मध्ये Join करा 👇

{whatsapp_link}

धन्यवाद! 🙏
AI Marathi Guru`;

export const AdminWhatsAppSettingsTab: React.FC<AdminWhatsAppSettingsTabProps> = ({ onRefresh }) => {
  const [communityLink, setCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [groupLink, setGroupLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [adminNumber, setAdminNumber] = useState('9801555171');
  const [customMessage, setCustomMessage] = useState(
    'तुमचे Registration आणि Payment यशस्वी झाले आहे. आता खालील बटणावर क्लिक करून AI Marathi Guru WhatsApp Community Join करा.'
  );
  const [prefilledMessageTemplate, setPrefilledMessageTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE);
  const [buttonText, setButtonText] = useState('JOIN WHATSAPP COMMUNITY');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const [waRes, msgRes] = await Promise.all([
        fetch('/api/admin/whatsapp-settings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [waData, msgData] = await Promise.all([waRes.json(), msgRes.json()]);

      if (waRes.ok && waData.whatsappSettings) {
        setCommunityLink(waData.whatsappSettings.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
        setGroupLink(waData.whatsappSettings.groupLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
        setAdminNumber(waData.whatsappSettings.adminWhatsAppNumber || '9801555171');
        setCustomMessage(
          waData.whatsappSettings.customSuccessMessage ||
            'तुमचे Registration आणि Payment यशस्वी झाले आहे. आता खालील बटणावर क्लिक करून AI Marathi Guru WhatsApp Community Join करा.'
        );
        setButtonText(waData.whatsappSettings.buttonText || 'JOIN WHATSAPP COMMUNITY');
      }

      if (msgRes.ok && msgData.templates?.paymentSuccess) {
        setPrefilledMessageTemplate(msgData.templates.paymentSuccess);
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
      const [waSaveRes, msgSaveRes] = await Promise.all([
        fetch('/api/admin/whatsapp-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            communityLink: communityLink.trim(),
            groupLink: groupLink.trim(),
            adminWhatsAppNumber: adminNumber.trim(),
            customSuccessMessage: customMessage.trim(),
            buttonText: buttonText.trim(),
          }),
        }),
        fetch('/api/admin/messages', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            templates: {
              paymentSuccess: prefilledMessageTemplate.trim(),
              whatsappJoin: customMessage.trim(),
            },
          }),
        }),
      ]);

      if (waSaveRes.ok && msgSaveRes.ok) {
        setSaveSuccess(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('WhatsApp सेटिंग्ज सेव्ह करता आल्या नाहीत.');
      }
    } catch (e) {
      console.error(e);
      alert('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    setCommunityLink('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
    setGroupLink('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
    setAdminNumber('9801555171');
    setCustomMessage('तुमचे Registration आणि Payment यशस्वी झाले आहे. आता खालील बटणावर क्लिक करून AI Marathi Guru WhatsApp Community Join करा.');
    setPrefilledMessageTemplate(DEFAULT_WHATSAPP_TEMPLATE);
    setButtonText('JOIN WHATSAPP COMMUNITY');
  };

  // Replace dummy variables for live preview
  const getRenderedPreview = () => {
    return prefilledMessageTemplate
      .replace(/{student_name}/gi, 'राहुल प्रकाश पाटील')
      .replace(/{registration_id}/gi, 'AMG-2026-00108')
      .replace(/{course_date}/gi, 'रविवार, २३ ऑगस्ट २०२६')
      .replace(/{course_slot}/gi, '11:00 AM – 1:00 PM')
      .replace(/{payment_status}/gi, 'PAID (₹199)')
      .replace(/{whatsapp_link}/gi, communityLink);
  };

  const copyPreview = () => {
    navigator.clipboard.writeText(getRenderedPreview());
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2500);
  };

  const availableVariables = [
    { code: '{student_name}', desc: 'विद्यार्थ्याचे नाव' },
    { code: '{registration_id}', desc: 'नोंदणी क्रमांक (ID)' },
    { code: '{course_date}', desc: 'कोर्सची तारीख' },
    { code: '{course_slot}', desc: 'कोर्सची वेळ / स्लॉट' },
    { code: '{payment_status}', desc: 'पेमेंट स्थिती (PAID)' },
    { code: '{whatsapp_link}', desc: 'WhatsApp Community लिंक' },
  ];

  const insertVariable = (variableCode: string) => {
    setPrefilledMessageTemplate((prev) => prev + ' ' + variableCode);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2 font-poppins">
            <MessageCircle className="w-3.5 h-3.5" /> Official WhatsApp Integration
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-poppins">
            WhatsApp Settings & Pre-filled Messages
          </h1>
          <p className="text-xs text-emerald-100 font-marathi-sub mt-1">
            अधिकृत WhatsApp Community लिंक, ॲडमिन नंबर आणि 'SEND VIA WHATSAPP APP' मेसेज टेम्पलेट
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.open(communityLink, '_blank')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Test Community Link</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>WhatsApp सेटिंग्ज व मेसेज टेम्पलेट यशस्वीरित्या सेव्ह झाले आहेत!</span>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">SAVED</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Community Link */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-800 block uppercase tracking-wider">
              WhatsApp Community Link (अधिकृत कम्युनिटी लिंक) *
            </label>
            <input
              type="url"
              required
              value={communityLink}
              onChange={(e) => setCommunityLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO"
              className="w-full px-4 py-3 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 focus:bg-white font-mono"
            />
            <p className="text-[11px] text-slate-500">
              विद्यार्थी 'JOIN WHATSAPP COMMUNITY' बटणावर क्लिक केल्यावर या लिंकवर रीडायरेक्ट होतात.
            </p>
          </div>

          {/* Group Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block uppercase tracking-wider">
              WhatsApp Group Link (बॅकअप ग्रुप लिंक)
            </label>
            <input
              type="url"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-4 py-3 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 focus:bg-white font-mono"
            />
          </div>

          {/* Admin WhatsApp Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block uppercase tracking-wider">
              Admin WhatsApp Number (सपोर्ट नंबर) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
              <input
                type="text"
                required
                value={adminNumber}
                onChange={(e) => setAdminNumber(e.target.value)}
                placeholder="9801555171"
                className="w-full pl-12 pr-4 py-3 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 focus:bg-white font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* WhatsApp Pre-filled Message Template (SEND VIA WHATSAPP APP) */}
          <div className="space-y-2 md:col-span-2 pt-2 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>'SEND VIA WHATSAPP APP' Pre-filled Message Template *</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyPreview}
                  className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPreview ? 'Copied Preview!' : 'Copy Preview'}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Variable Chips */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                <span>उपलब्ध व्हेरिएबल्स (क्लिक करून मेसेजमध्ये जोडा):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableVariables.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertVariable(v.code)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[11px] font-bold transition cursor-pointer"
                    title={v.desc}
                  >
                    + {v.code}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={8}
              required
              value={prefilledMessageTemplate}
              onChange={(e) => setPrefilledMessageTemplate(e.target.value)}
              className="w-full p-4 text-xs font-mono bg-stone-50 border border-stone-300 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white leading-relaxed text-slate-900"
            />
          </div>

          {/* Success Message Text for Web UI */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-800 block uppercase tracking-wider">
              Registration Success Text (वेबसाईटवर दिसणारा मेसेज)
            </label>
            <textarea
              rows={2}
              required
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 leading-relaxed"
            />
          </div>
        </div>

        {/* Live Message Preview */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Message Preview (विद्यार्थ्याला जाणारा संदेश)
            </span>
            <span className="text-emerald-400 font-mono">AUTOMATED WHATSAPP</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {getRenderedPreview()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={handleResetDefault}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-slate-600 hover:bg-stone-100 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-900/20 cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save WhatsApp Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
