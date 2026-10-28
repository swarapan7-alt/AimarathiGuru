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
  Send,
  RefreshCw,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  Key,
  Database,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { WhatsAppDeliveryLog } from '../../types';

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
  // 1. Automation Status
  const [automationStatus, setAutomationStatus] = useState<'CONNECTED' | 'NOT_CONFIGURED' | 'ERROR'>('NOT_CONFIGURED');
  const [businessApiConfigured, setBusinessApiConfigured] = useState(false);
  const [templateConfigured, setTemplateConfigured] = useState(false);
  const [autoSendOnPayment, setAutoSendOnPayment] = useState(true);
  const [statusDetails, setStatusDetails] = useState<any>(null);
  const [failedCount, setFailedCount] = useState(0);

  // 2. WhatsApp Community Link state
  const [communityLink, setCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [savedCommunityLink, setSavedCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [communityLinkError, setCommunityLinkError] = useState('');
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [linkSaveSuccess, setLinkSaveSuccess] = useState(false);

  // 3. API Credentials state
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [templateName, setTemplateName] = useState('payment_success_confirmation');
  const [templateLanguage, setTemplateLanguage] = useState('mr');
  const [isSavingApi, setIsSavingApi] = useState(false);
  const [apiSaveSuccess, setApiSaveSuccess] = useState(false);
  const [apiSaveError, setApiSaveError] = useState('');

  // 4. Message Template state
  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_PAYMENT_SUCCESS_TEMPLATE);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // 5. Test message and Retry state
  const [testNumber, setTestNumber] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isRetryingFailed, setIsRetryingFailed] = useState(false);
  const [retrySummary, setRetrySummary] = useState<any>(null);

  // 6. Delivery Logs state
  const [logs, setLogs] = useState<WhatsAppDeliveryLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [retryingLogId, setRetryingLogId] = useState<string | null>(null);

  // 7. Additional optional settings
  const [groupLink, setGroupLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [adminNumber, setAdminNumber] = useState('9801555171');
  const [showExtraSettings, setShowExtraSettings] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    fetchStatus();
    fetchSettings();
    fetchLogs();
  }, []);

  const fetchStatus = async () => {
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/whatsapp-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAutomationStatus(data.status);
        setBusinessApiConfigured(!!data.businessApiConfigured);
        setTemplateConfigured(!!data.templateConfigured);
        setAutoSendOnPayment(data.autoSendOnPayment !== false);
        setStatusDetails(data.details || null);
        setFailedCount(data.failedCount || 0);
      }
    } catch (e) {
      console.warn('Status fetch warning:', e);
    }
  };

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
        const ws = waData.whatsappSettings;
        const activeLink = ws.communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
        setCommunityLink(activeLink);
        setSavedCommunityLink(activeLink);
        setGroupLink(ws.groupLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
        setAdminNumber(ws.adminWhatsAppNumber || '9801555171');
        if (ws.phoneNumberId) setPhoneNumberId(ws.phoneNumberId);
        if (ws.businessAccountId) setBusinessAccountId(ws.businessAccountId);
        if (ws.templateName) setTemplateName(ws.templateName);
        if (ws.templateLanguage) setTemplateLanguage(ws.templateLanguage);
        if (ws.autoSendOnPayment !== undefined) setAutoSendOnPayment(ws.autoSendOnPayment);
      }

      if (msgRes.ok && msgData.templates?.paymentSuccess) {
        setMessageTemplate(msgData.templates.paymentSuccess);
      }
    } catch (e) {
      console.error('Failed to fetch WhatsApp settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/whatsapp/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.warn('Logs fetch warning:', e);
    } finally {
      setIsLoadingLogs(false);
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

  // Save WhatsApp Community Link
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
          autoSendOnPayment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedCommunityLink(communityLink.trim());
        setLinkSaveSuccess(true);
        fetchStatus();
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

  // Save WhatsApp Business API credentials
  const handleSaveApiSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingApi(true);
    setApiSaveSuccess(false);
    setApiSaveError('');

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
          phoneNumberId: phoneNumberId.trim(),
          accessToken: accessToken.trim(),
          businessAccountId: businessAccountId.trim(),
          templateName: templateName.trim(),
          templateLanguage: templateLanguage.trim(),
          autoSendOnPayment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApiSaveSuccess(true);
        fetchStatus();
        if (onRefresh) onRefresh();
        setTimeout(() => setApiSaveSuccess(false), 4000);
      } else {
        setApiSaveError(data.error || 'WhatsApp API सेटिंग्ज सेव्ह करता आल्या नाहीत.');
      }
    } catch (err) {
      console.error(err);
      setApiSaveError('सर्व्हर एरर.');
    } finally {
      setIsSavingApi(false);
    }
  };

  // Send Test Message
  const handleSendTestMessage = async () => {
    if (!testNumber || testNumber.trim().length < 10) {
      alert('कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.');
      return;
    }
    setIsSendingTest(true);
    setTestResponse(null);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/whatsapp/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testNumber: testNumber.trim(),
          studentName: 'Test Student',
          templateName: templateName.trim(),
          templateLanguage: templateLanguage.trim(),
        }),
      });

      const data = await res.json();
      setTestResponse(data);
      fetchStatus();
      fetchLogs();
    } catch (e: any) {
      setTestResponse({ success: false, error: e.message || 'सर्व्हरशी संपर्क होऊ शकला नाही' });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Retry Failed Messages
  const handleRetryFailedMessages = async () => {
    setIsRetryingFailed(true);
    setRetrySummary(null);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/whatsapp/retry-failed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRetrySummary(data);
      fetchStatus();
      fetchLogs();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      alert('पुन्हा प्रयत्न करताना त्रुटी आली: ' + (e.message || ''));
    } finally {
      setIsRetryingFailed(false);
    }
  };

  // Retry Single Student Message
  const handleRetrySingle = async (studentId: string) => {
    setRetryingLogId(studentId);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch(`/api/admin/whatsapp/retry/${encodeURIComponent(studentId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('मेसेज पाठवला गेला! ID: ' + (data.messageId || 'Success'));
      } else {
        alert('त्रुटी: ' + (data.error || 'मेसेज पाठवता आला नाही.'));
      }
      fetchStatus();
      fetchLogs();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      alert('सर्व्हर एरर: ' + e.message);
    } finally {
      setRetryingLogId(null);
    }
  };

  // Save Message Template
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

  // Reset Template
  const handleResetDefaultTemplate = () => {
    if (window.confirm('तुम्हाला मेसेज टेम्पलेट मूळ डिफॉल्ट स्वरूपात रिसेट करायचे आहे का?')) {
      setMessageTemplate(DEFAULT_PAYMENT_SUCCESS_TEMPLATE);
    }
  };

  // Insert Variable
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

  // Preview Data
  const getRenderedPreview = () => {
    const activeCommunityUrl = savedCommunityLink || communityLink || 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
    return messageTemplate
      .replace(/{Student Name}/gi, 'Nikita')
      .replace(/{student_name}/gi, 'Nikita')
      .replace(/{Registration ID}/gi, 'AMG-2026-00004')
      .replace(/{registration_id}/gi, 'AMG-2026-00004')
      .replace(/{Course Date}/gi, 'Thursday, 29 October 2026')
      .replace(/{course_date}/gi, 'Thursday, 29 October 2026')
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
    { code: '{Registration ID}', label: 'Registration ID', desc: 'युनिक नोंदणी क्रमांक' },
    { code: '{Course Date}', label: 'Course Date', desc: 'निवडलेली क्लास तारीख' },
    { code: '{Selected Slot}', label: 'Selected Slot', desc: 'निवडलेला वेळेचा स्लॉट' },
    { code: '{WhatsApp Community Link}', label: 'WhatsApp Community Link', desc: 'सेव्ह केलेली अधिकृत WhatsApp लिंक' },
  ];

  return (
    <div id="admin-whatsapp-settings-container" className="space-y-6 max-w-4xl pb-8">
      
      {/* 1. Header Banner with Real Automation Status */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 font-poppins border border-emerald-400/20">
            <MessageCircle className="w-3.5 h-3.5" /> Official WhatsApp Automation
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-poppins text-white">
            WhatsApp Automation & Settings
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-marathi-sub mt-1">
            अधिकृत WhatsApp Business API, ऑटोमेशन स्थिती आणि डिलिव्हरी लॉग्ज व्यवस्थापन
          </p>
        </div>

        {/* Dynamic Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {automationStatus === 'CONNECTED' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase font-poppins shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
              <span>Status: CONNECTED</span>
            </div>
          ) : automationStatus === 'ERROR' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-black uppercase font-poppins shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Status: ERROR</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase font-poppins shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Status: NOT CONFIGURED</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => window.open(savedCommunityLink || communityLink, '_blank')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Community Link</span>
          </button>
        </div>
      </div>

      {/* Warning Box when Not Configured */}
      {automationStatus === 'NOT_CONFIGURED' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-poppins text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>WhatsApp Business API Configuration Required</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900">
            स्वयंचलित (Automatic) WhatsApp मेसेज पाठवण्यासाठी Meta WhatsApp Cloud API चे <strong>Phone Number ID</strong> आणि <strong>Access Token</strong> खाली प्रविष्ट करा. क्रेडेंशियल्स नसताना सिस्टम विद्यार्थ्याला WhatsApp ॲपद्वारे मेसेज उघडण्याचा व कम्युनिटी जॉइन करण्याचा थेट पर्याय देते.
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* CARD 1: WhatsApp Community Link Management              */}
      {/* ======================================================== */}
      <div id="card-whatsapp-community-link" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
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
                पेमेंट पूर्ण केलेल्या विद्यार्थ्यांना दिली जाणारी अधिकृत कम्युनिटी लिंक
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Link
            </span>
          </div>
        </div>

        {linkSaveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ WhatsApp Community Link यशस्वीरित्या सेव्ह झाली आहे.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveCommunityLink} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              WhatsApp Community URL *
            </label>
            <input
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
                  ? 'border-red-500 bg-red-50/30'
                  : 'border-stone-300 focus:border-emerald-600 focus:bg-white'
              }`}
            />
            {communityLinkError && (
              <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{communityLinkError}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-500">
              विद्यार्थी पेमेंट कन्फर्मेशन स्क्रीनवरून थेट या ग्रुपमध्ये जॉइन होतात.
            </div>

            <button
              type="submit"
              disabled={isSavingLink}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-xs cursor-pointer disabled:opacity-50 font-poppins"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingLink ? 'Saving...' : 'Save Community Link'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ======================================================== */}
      {/* CARD 2: WhatsApp Business API & Automation Controls     */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
                WhatsApp Business API Configuration
              </h2>
              <p className="text-xs text-slate-500 font-marathi-sub mt-0.5">
                Meta Cloud API क्रेडेंशियल्स आणि स्वयंचलित मेसेज पाठवण्याचे पर्याय
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={autoSendOnPayment}
                onChange={(e) => setAutoSendOnPayment(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-black text-slate-800 font-poppins">
                Auto-Send on Payment
              </span>
            </label>
          </div>
        </div>

        {apiSaveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✓ WhatsApp API क्रेडेंशियल्स यशस्वीरित्या सेव्ह झाली आहेत.</span>
          </div>
        )}

        {apiSaveError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{apiSaveError}</span>
          </div>
        )}

        <form onSubmit={handleSaveApiSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Meta Phone Number ID
              </label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="उदा. 1048291029102"
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="text-[10px] text-slate-500">Meta WhatsApp App Dashboard मधून मिळालेला Phone Number ID</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                WhatsApp Business Account ID (WABA ID)
              </label>
              <input
                type="text"
                value={businessAccountId}
                onChange={(e) => setBusinessAccountId(e.target.value)}
                placeholder="उदा. 928374829102"
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="text-[10px] text-slate-500">तुमचा अधिकृत WABA Account ID</p>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800 block flex items-center justify-between">
                <span>System User Access Token (Permanent / Long-lived)</span>
                <span className="text-[10px] text-emerald-700 font-mono">Kept secure on server</span>
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="EAA..."
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="text-[10px] text-slate-500">
                सुरक्षिततेसाठी Access Token कधीही frontend मध्ये उघड केला जात नाही व फक्त सर्व्हरवर सुरक्षित साठवला जातो.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Approved Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="payment_success_confirmation"
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                Template Language Code
              </label>
              <input
                type="text"
                value={templateLanguage}
                onChange={(e) => setTemplateLanguage(e.target.value)}
                placeholder="mr (किंवा en_US)"
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingApi}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-xs cursor-pointer disabled:opacity-50 font-poppins"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingApi ? 'Saving...' : 'Save API Settings'}</span>
            </button>
          </div>
        </form>

        {/* Live Test Message Card & Retry Button */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider font-poppins">
                Send Real Test Message
              </h3>
              <p className="text-[11px] text-slate-500">
                प्रत्यक्ष Meta API द्वारे टेस्ट मेसेज पाठवा आणि खरा सर्व्हर रिस्पॉन्स पहा
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRetryFailedMessages}
                disabled={isRetryingFailed}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRetryingFailed ? 'animate-spin' : ''}`} />
                <span>Retry Failed Messages {failedCount > 0 ? `(${failedCount})` : ''}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="tel"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="10-digit WhatsApp Number (उदा. 9801555171)"
              className="flex-1 px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={handleSendTestMessage}
              disabled={isSendingTest}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
              <span>{isSendingTest ? 'Sending...' : 'Send Test Message'}</span>
            </button>
          </div>

          {/* Real API Response Display */}
          {testResponse && (
            <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs space-y-1 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                <span>Real API Response:</span>
                <span>{testResponse.success ? 'HTTP 200 SUCCESS' : 'FAILED'}</span>
              </div>
              <pre className="text-[11px] whitespace-pre-wrap">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}

          {retrySummary && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
              <strong>Retry Summary:</strong> {retrySummary.message || `Retried ${retrySummary.retriedCount || 0} messages. Success: ${retrySummary.successCount || 0}, Failed: ${retrySummary.failureCount || 0}`}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 3: Payment Success Message Template                 */}
      {/* ======================================================== */}
      <div id="card-payment-success-message-template" className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
                Payment Success Message Content
              </h2>
              <p className="text-xs text-slate-500 font-marathi-sub mt-0.5">
                पेमेंट यशस्वी झाल्यानंतर विद्यार्थ्याला जाणारा संदेश मजकूर
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

        {templateSaveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✓ Payment Success Message Template यशस्वीरित्या सेव्ह झाला आहे.</span>
          </div>
        )}

        <textarea
          ref={textareaRef}
          rows={9}
          required
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          className="w-full p-3.5 text-xs sm:text-sm font-mono bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-600 focus:bg-white leading-relaxed text-slate-900 shadow-inner"
        />

        {/* Available Variables */}
        <div className="p-4 bg-slate-50 rounded-xl border border-stone-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-600" />
              <span>Available Variables:</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableVariables.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertVariable(v.code)}
                title={v.desc}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300 font-mono text-xs font-bold transition cursor-pointer active:scale-95"
              >
                <span className="text-emerald-600 font-black">+</span>
                <span>{v.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buttons for Template Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {showPreview ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-blue-600" />}
            <span>{showPreview ? 'Hide Preview' : 'Preview Message'}</span>
          </button>

          <button
            type="button"
            disabled={isSavingTemplate}
            onClick={handleSaveTemplate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-xs cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingTemplate ? 'Saving...' : 'Save Template'}</span>
          </button>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white space-y-3 shadow-md border border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Preview (Sample: Nikita • AMG-2026-00004)</span>
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
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CARD 4: Message Delivery Log Table                      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
                WhatsApp Delivery Logs
              </h2>
              <p className="text-xs text-slate-500 font-marathi-sub mt-0.5">
                प्रत्येक विद्यार्थ्याला पाठवलेल्या मेसेजची अचूक स्थिती आणि त्रुटी तपशील
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchLogs}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-500 uppercase font-black tracking-wider text-[9px] border-b border-stone-200">
              <tr>
                <th className="px-3 py-2 font-poppins">Student Name</th>
                <th className="px-3 py-2">Reg ID</th>
                <th className="px-3 py-2">Payment</th>
                <th className="px-3 py-2">WhatsApp Delivery</th>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Details / Error</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400 text-xs">
                    कोणतेही डिलिव्हरी लॉग्ज उपलब्ध नाहीत.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      {log.studentName}
                      <div className="text-[10px] text-slate-400 font-mono">{log.mobileNumber}</div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-700 font-bold">
                      {log.registrationId}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase font-poppins">
                        {log.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {log.deliveryStatus === 'SENT' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-poppins">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> SENT
                        </span>
                      ) : log.deliveryStatus === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold font-poppins">
                          <XCircle className="w-3 h-3 text-red-600" /> FAILED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-poppins">
                          <Clock className="w-3 h-3 text-amber-600" /> {log.deliveryStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleString('mr-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-slate-600 max-w-[200px] truncate" title={log.errorDetails || log.messageId}>
                      {log.errorDetails ? (
                        <span className="text-red-600">⚠️ {log.errorDetails}</span>
                      ) : log.messageId ? (
                        <span className="font-mono text-emerald-700">ID: {log.messageId}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRetrySingle(log.studentId || log.registrationId)}
                        disabled={retryingLogId === (log.studentId || log.registrationId)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition cursor-pointer"
                      >
                        {retryingLogId === (log.studentId || log.registrationId) ? 'Retrying...' : 'Retry'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
