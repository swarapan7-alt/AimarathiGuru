import React, { useState } from 'react';
import { Search, X, CheckCircle2, AlertCircle, Copy, Check, Calendar, Clock, Phone } from 'lucide-react';
import { RegistrationRecord } from '../types';
import { WhatsAppCommunityButton } from './WhatsAppCommunityButton';

interface StudentLookupModalProps {
  onClose: () => void;
  communityLink?: string;
}

export const StudentLookupModal: React.FC<StudentLookupModalProps> = ({
  onClose,
  communityLink = 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/lookup/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data.registration);
      } else {
        setError(data.error || 'कोणतीही नोंदणी आढळली नाही.');
      }
    } catch (err) {
      setError('सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyReceipt = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `AI Marathi Guru Registration\nID: ${result.id}\nName: ${result.fullName}\nDate: ${result.courseDateDisplay}\nSlot: ${result.slotTimeDisplay}\nStatus: ${result.paymentStatus}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black font-marathi-title">नोंदणी स्थिती तपासा (Lookup Registration)</h3>
            <p className="text-xs text-slate-400 font-medium">तुमचा मोबाईल नंबर किंवा Registration ID टाका</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="उदा. 9876543210 किंवा AMG-2026-00001"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E53935] text-sm text-slate-900 font-bold transition"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>शोधा (Search Status)</span>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#E53935] text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration ID</span>
                  <span className="text-lg font-black text-emerald-700">{result.id}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {result.paymentStatus}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p><strong className="text-slate-900">विद्यार्थी नाव:</strong> {result.fullName}</p>
                <p><strong className="text-slate-900">मोबाईल:</strong> {result.mobileNumber}</p>
                <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> <strong className="text-slate-900">तारीख:</strong> {result.courseDateDisplay}</p>
                <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> <strong className="text-slate-900">स्लॉट:</strong> {result.slotTimeDisplay}</p>
                {result.meetLink && <p><strong className="text-slate-900">Meet Link:</strong> {result.meetLink}</p>}
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <div className="p-4 bg-emerald-700 rounded-2xl text-white shadow-sm">
                  <WhatsAppCommunityButton communityLink={communityLink} />
                </div>

                <button
                  onClick={copyReceipt}
                  className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Receipt!' : 'Copy Receipt Details'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              समस्या असल्यास WhatsApp सपोर्ट: <strong>9801555171</strong>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
