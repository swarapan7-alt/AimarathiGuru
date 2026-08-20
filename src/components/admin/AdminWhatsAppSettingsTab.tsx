import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Code,
  Eye,
  EyeOff,
  AlertCircle,
  Link as LinkIcon,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdminWhatsAppSettingsTabProps {
  onRefresh?: () => void;
}

export const DEFAULT_PAYMENT_SUCCESS_TEMPLATE = `नमस्कार {Student Name} 👋

AI Marathi Guru Live Training साठी तुमची नोंदणी यशस्वी झाली आहे. 🎉

Registration ID: {Registration ID}
Course Date: {Course Date}
Time Slot: {Selected Slot}
Payment Status: PAID

महत्त्वाची माहिती आणि Live Session ची लिंक खालील WhatsApp Community मधून दिली जाईल.

WhatsApp Community मध्ये सहभागी होण्यासाठी खालील लिंकवर क्लिक करा 👇

{WhatsApp Community Link}

धन्यवाद,
AI Marathi Guru`;

export const AdminWhatsAppSettingsTab: React.FC<AdminWhatsAppSettingsTabProps> = ({ onRefresh }) => {
  // 1. WhatsApp Community Link state
  const [communityLink, setCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [savedCommunityLink, setSavedCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [communityLinkError, setCommunityLinkError] = useState('');
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [linkSaveSuccess, setLinkSaveSuccess] = useState(false);

  // 2. Message Template state
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_PAYMENT_SUCCESS_TEMPLATE);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // 3. Additional optional settings
  const [groupLink, setGroupLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [adminNumber, setAdminNumber] = useState('9801555171');
  const [showExtraSettings, setShowExtraSettings] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Initial load with local storage fallback for instant response
    try {
      const cached = localStorage.getItem('amg_cached_whatsapp_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.communityLink) {
          setCommunityLink(parsed.communityLink);
          setSavedCommunityLink(parsed.communityLink);
        }
        if (parsed.groupLink) setGroupLink(parsed.groupLink);
        if (parsed.adminWhatsAppNumber) setAdminNumber(parsed.adminWhatsAppNumber);
      }
      const cachedTemplate = localStorage.getItem('amg_cached_payment_template');
      if (cachedTemplate) {
        setMessageTemplate(cachedTemplate);
      }
    } catch (_) {}

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
        const activeLink = waData.whatsappSettings.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
        setCommunityLink(activeLink);
        setSavedCommunityLink(activeLink);
        setGroupLink(waData.whatsappSettings.groupLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
        setAdminNumber(waData.whatsappSettings.adminWhatsAppNumber || '9801555171');

        try {
          localStorage.setItem('amg_cached_whatsapp_settings', JSON.stringify(waData.whatsappSettings));
        } catch (_) {}
      }

      if (msgRes.ok && msgData.templates?.paymentSuccess) {
        setMessageTemplate(msgData.templates.paymentSuccess);
        try {
          localStorage.setItem('amg_cached_payment_template', msgData.templates.paymentSuccess);
        } catch (_) {}
      }
    } catch (e) {
      console.error('Failed to fetch WhatsApp settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate WhatsApp Link
  const validateLink = (url: string) => {
    if (!url || !url.trim()) {
      return 'कृपया WhatsApp Community URL प्रविष्ट करा.';
    }
    const cleanUrl = url.trim().toLowerCase();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return 'URL http:// किंवा https:// ने सुरू होणे आवश्यक आहे.';
    }
    if (!cleanUrl.includes('whatsapp.com') && !cleanUrl.includes('wa.me')) {
      return 'कृपया वैध WhatsApp लिंक प्रविष्ट करा (उदा. https://chat.whatsapp.com/...).';
    }
    return '';
  };

  // Save CARD 1: WhatsApp Community Link
  const handleSaveCommunityLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const error = validateLink(communityLink);
    if (error) {
      setCommunityLinkError(error);
      return;
    }
    setCommunityLinkError('');
    setIsSavingLink(true);
    setLinkSaveSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/whatsapp-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          communityLink: communityLink.trim(),
          groupLink: groupLink.trim(),
          adminWhatsAppNumber: adminNumber.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedCommunityLink(communityLink.trim());
        setLinkSaveSuccess(true);
        try {
          localStorage.setItem('amg_cached_whatsapp_settings', JSON.stringify(data.whatsappSettings || { communityLink }));
        } catch (_) {}
        if (onRefresh) onRefresh();
        setTimeout(() => setLinkSaveSuccess(false), 4000);
      } else {
        alert(data.error || 'WhatsApp Community Link सेव्ह करता आला नाही.');
      }
    } catch (err) {
      console.error(err);
      alert('सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setIsSavingLink(false);
    }
  };

  // Save CARD 2: Payment Success Message Template
  const handleSaveTemplate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageTemplate.trim()) {
      alert('कृपया मेसेज टेम्पलेट रिकामा ठेवू नका.');
      return;
    }

    setIsSavingTemplate(true);
    setTemplateSaveSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templates: {
            paymentSuccess: messageTemplate.trim(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTemplateSaveSuccess(true);
        try {
          localStorage.setItem('amg_cached_payment_template', messageTemplate.trim());
        } catch (_) {}
        if (onRefresh) onRefresh();
        setTimeout(() => setTemplateSaveSuccess(false), 4000);
      } else {
        alert(data.error || 'मेसेज टेम्पलेट सेव्ह करता आला नाही.');
      }
    } catch (err) {
      console.error(err);
      alert('सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Reset Template to Official Default
  const handleResetDefaultTemplate = () => {
    if (window.confirm('तुम्हाला मेसेज टेम्पलेट मूळ डिफॉल्ट स्वरूपात रिसेट करायचे आहे का?')) {
      setMessageTemplate(DEFAULT_PAYMENT_SUCCESS_TEMPLATE);
    }
  };

  // Insert Variable at Cursor Position
  const insertVariable = (varCode: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = messageTemplate;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + varCode + after;
      setMessageTemplate(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start + varCode.length, start + varCode.length);
        }
      }, 50);
    } else {
      setMessageTemplate((prev) => prev + ' ' + varCode);
    }
  };

  // Realistic Sample Preview Data (Nikita, AMG-2026-00004, etc.)
  const getRenderedPreview = () => {
    const activeCommunityUrl = savedCommunityLink || communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
    return messageTemplate
      .replace(/{Student Name}/gi, 'Nikita')
      .replace(/{student_name}/gi, 'Nikita')
      .replace(/{Registration ID}/gi, 'AMG-2026-00004')
      .replace(/{registration_id}/gi, 'AMG-2026-00004')
      .replace(/{Course Date}/gi, 'Sunday, 23 August 2026')
      .replace(/{course_date}/gi, 'Sunday, 23 August 2026')
      .replace(/{Selected Slot}/gi, '11:00 AM – 1:00 PM')
      .replace(/{selected_slot}/gi, '11:00 AM – 1:00 PM')
      .replace(/{Time Slot}/gi, '11:00 AM – 1:00 PM')
      .replace(/{time_slot}/gi, '11:00 AM – 1:00 PM')
      .replace(/{WhatsApp Community Link}/gi, activeCommunityUrl)
      .replace(/{whatsapp_link}/gi, activeCommunityUrl)
      .replace(/{Payment Status}/gi, 'PAID')
      .replace(/{payment_status}/gi, 'PAID');
  };

  const copyPreviewToClipboard = () => {
    navigator.clipboard.writeText(getRenderedPreview());
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2500);
  };

  const availableVariables = [
    { code: '{Student Name}', label: 'Student Name', desc: 'नोंदणीकृत विद्यार्थ्याचे नाव' },
    { code: '{Registration ID}', label: 'Registration ID', desc: 'युनिक नोंदणी क्रमांक (उदा. AMG-2026-00004)' },
    { code: '{Course Date}', label: 'Course Date', desc: 'निवडलेली क्लास तारीख' },
    { code: '{Selected Slot}', label: 'Selected Slot', desc: 'निवडलेला वेळेचा स्लॉट' },
    { code: '{WhatsApp Community Link}', label: 'WhatsApp Community Link', desc: 'सेव्ह केलेली अधिकृत WhatsApp लिंक' },
  ];

  return (
    <div id="admin-whatsapp-settings-container" className="space-y-6 max-w-4xl pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 font-poppins border border-emerald-400/20">
            <MessageCircle className="w-3.5 h-3.5" /> Official WhatsApp Automation
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-poppins text-white">
            WhatsApp Settings
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-marathi-sub mt-1">
            अधिकृत WhatsApp Community लिंक आणि पेमेंट कन्फर्मेशन मेसेज ऑटोमेशन व्यवस्थापन
          </p>
        </div>

        <button
          type="button"
          id="btn-test-live-whatsapp-link"
          onClick={() => window.open(savedCommunityLink || communityLink, '_blank')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-sm cursor-pointer self-start sm:self-auto shrink-0 uppercase tracking-wider"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Live Community</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* CARD 1: WhatsApp Community Link Management              */}
      {/* ======================================================== */}
      <div
        id="card-whatsapp-community-link"
        className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
                WhatsApp Community Link
              </h2>
              <p className="text-xs text-slate-500 font-marathi-sub mt-0.5">
                This link will automatically be included in successful registration messages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Link
            </span>
          </div>
        </div>

        {/* Success Alert for Card 1 */}
        {linkSaveSuccess && (
          <div
            id="alert-community-link-saved"
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center justify-between shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ WhatsApp Community Link saved successfully.</span>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md uppercase font-bold">
              Saved Permanently
            </span>
          </div>
        )}

        {/* Display Currently Saved Link */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Currently Saved Link:
            </span>
            <button
              type="button"
              onClick={() => window.open(savedCommunityLink, '_blank')}
              className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Test Current Link</span>
            </button>
          </div>
          <p className="text-xs font-mono text-emerald-800 font-bold break-all bg-white px-2.5 py-1.5 rounded-lg border border-stone-200">
            {savedCommunityLink || 'None set'}
          </p>
        </div>

        {/* Link Edit Form */}
        <form onSubmit={handleSaveCommunityLink} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="input-whatsapp-community-url"
              className="text-xs font-black text-slate-800 uppercase tracking-wider block"
            >
              WhatsApp Community URL *
            </label>
            <div className="relative">
              <input
                id="input-whatsapp-community-url"
                type="url"
                required
                value={communityLink}
                onChange={(e) => {
                  setCommunityLink(e.target.value);
                  if (communityLinkError) setCommunityLinkError('');
                }}
                placeholder="https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border rounded-xl outline-none font-mono text-slate-900 transition ${
                  communityLinkError
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : 'border-stone-300 focus:border-emerald-600 focus:bg-white'
                }`}
              />
            </div>
            {communityLinkError && (
              <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{communityLinkError}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-relaxed font-marathi-sub">
              विद्यार्थी पेमेंट पूर्ण केल्यानंतर व 'JOIN WHATSAPP COMMUNITY' बटणावर क्लिक केल्यावर या अधिकृत ग्रुपमध्ये ॲड होतात.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
              बदल सेव्ह केल्यावर सर्व नवीन मेसेजेसमध्ये हीच लिंक वापरली जाईल.
            </div>

            <button
              id="btn-save-whatsapp-community-link"
              type="submit"
              disabled={isSavingLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50 font-poppins"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingLink ? 'Saving Link...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* CARD 2: Payment Success Message Template                 */}
      {/* ======================================================== */}
      <div
        id="card-payment-success-message-template"
        className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
                Payment Success Message Template
              </h2>
              <p className="text-xs text-slate-500 font-marathi-sub mt-0.5">
                पेमेंट यशस्वी झाल्यानंतर विद्यार्थ्याला जाणारा स्वयंचलित WhatsApp संदेश संपादित करा
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDefaultTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-100 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Template</span>
          </button>
        </div>

        {/* Success Alert for Card 2 */}
        {templateSaveSuccess && (
          <div
            id="alert-template-saved"
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center justify-between shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ Payment Success Message Template saved successfully.</span>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md uppercase font-bold">
              Template Saved
            </span>
          </div>
        )}

        {/* Editable Message Textarea */}
        <div className="space-y-2">
          <label
            htmlFor="textarea-message-template"
            className="text-xs font-black text-slate-800 uppercase tracking-wider block"
          >
            Message Content (मेसेज मजकूर) *
          </label>

          <textarea
            id="textarea-message-template"
            ref={textareaRef}
            rows={10}
            required
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            className="w-full p-3.5 text-xs sm:text-sm font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 focus:bg-white leading-relaxed text-slate-900 shadow-inner"
            placeholder="येथे मेसेज टेम्पलेट टाईप करा..."
          />
        </div>

        {/* Available Variables Section */}
        <div id="section-available-variables" className="p-4 bg-slate-50 rounded-xl border border-stone-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-600" />
              <span>Available Variables:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              (व्हेरिएबलवर क्लिक करून मेसेजमध्ये जोडा)
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableVariables.map((v, i) => (
              <button
                key={i}
                type="button"
                id={`btn-var-${v.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => insertVariable(v.code)}
                title={v.desc}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300 hover:border-emerald-500 font-mono text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
              >
                <span className="text-emerald-600 font-black">+</span>
                <span>{v.code}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-500 font-marathi-sub border-t border-slate-200">
            <div>• <strong>&#123;Student Name&#125;</strong>: विद्यार्थ्याचे प्रत्यक्ष नाव</div>
            <div>• <strong>&#123;Registration ID&#125;</strong>: युनिक रजिस्ट्रेशन क्रमांक</div>
            <div>• <strong>&#123;Course Date&#125;</strong>: निवडलेली बॅच तारीख</div>
            <div>• <strong>&#123;Selected Slot&#125;</strong>: निवडलेली क्लास वेळ</div>
            <div className="sm:col-span-2">• <strong>&#123;WhatsApp Community Link&#125;</strong>: ॲडमिन सेटिंग्जमधील सेव्ह केलेली अधिकृत लिंक (ऑटोमॅटिक घेतली जाते)</div>
          </div>
        </div>

        {/* Buttons for Card 2 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            id="btn-preview-message"
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {showPreview ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-blue-600" />}
            <span>{showPreview ? 'Hide Preview' : 'Preview Message'}</span>
          </button>

          <button
            id="btn-save-message-template"
            type="button"
            disabled={isSavingTemplate}
            onClick={handleSaveTemplate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingTemplate ? 'Saving Template...' : 'Save Message Template'}</span>
          </button>
        </div>

        {/* Realistic Live Preview Box */}
        {showPreview && (
          <div
            id="box-message-preview"
            className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white space-y-3 shadow-md border border-slate-800 animate-in fade-in"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live WhatsApp Message Preview (Sample: Nikita)</span>
              </div>

              <button
                type="button"
                onClick={copyPreviewToClipboard}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg transition"
              >
                {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPreview ? 'Copied Preview!' : 'Copy Preview'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
              {getRenderedPreview()}
            </div>
            
            <p className="text-[10px] text-slate-400 italic">
              * सर्व नोंदणी डेटा व सेव्ह केलेली WhatsApp Community लिंक वरीलप्रमाणे स्वयंचलितरित्या बदलली जाते.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CARD 3: Additional WhatsApp Support Numbers (Preserved)  */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowExtraSettings(!showExtraSettings)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Additional Settings (Admin Support Number & Backup Group)
            </span>
          </div>
          {showExtraSettings ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showExtraSettings && (
          <div className="p-5 border-t border-stone-100 bg-stone-50/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Admin Support WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="text"
                    value={adminNumber}
                    onChange={(e) => setAdminNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Backup WhatsApp Group Link
                </label>
                <input
                  type="url"
                  value={groupLink}
                  onChange={(e) => setGroupLink(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCommunityLink}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold cursor-pointer"
            >
              Save Additional Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
