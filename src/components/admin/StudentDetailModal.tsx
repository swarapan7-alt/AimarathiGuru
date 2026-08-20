import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Save,
} from 'lucide-react';
import { RegistrationRecord } from '../../types';

interface StudentDetailModalProps {
  student: RegistrationRecord;
  onClose: () => void;
  onUpdate: (updatedStudent: RegistrationRecord) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(student.fullName);
  const [mobileNumber, setMobileNumber] = useState(student.mobileNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(student.whatsappNumber);
  const [email, setEmail] = useState(student.email);
  const [district, setDistrict] = useState(student.district);
  const [occupation, setOccupation] = useState(student.occupation);
  const [paymentStatus, setPaymentStatus] = useState(student.paymentStatus);
  const [paymentId, setPaymentId] = useState(student.paymentId || '');
  const [amountPaid, setAmountPaid] = useState(student.amountPaid || 199);
  const [whatsappJoined, setWhatsappJoined] = useState(student.whatsappJoined || false);

  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('amg_admin_token');

    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          whatsappNumber,
          email,
          district,
          occupation,
          paymentStatus,
          paymentId,
          amountPaid,
          whatsappJoined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.student) {
        onUpdate(data.student);
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
      alert('अपडेट करण्यात अडचण आली.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPersonalizedMessage = () => {
    let communityLink = 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
    try {
      const cached = localStorage.getItem('amg_cached_whatsapp_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.communityLink) communityLink = parsed.communityLink;
      }
    } catch (_) {}

    if (paymentStatus === 'PAID') {
      return `नमस्कार ${fullName} 👋\n\nAI Marathi Guru Live Training साठी तुमची नोंदणी यशस्वी झाली आहे. 🎉\n\nRegistration ID: ${student.id}\nCourse Date: ${student.courseDateDisplay}\nTime Slot: ${student.slotTimeDisplay}\nPayment Status: PAID\n\nमहत्त्वाची माहिती आणि Live Session ची लिंक खालील WhatsApp Community मधून दिली जाईल.\n\nWhatsApp Community मध्ये सहभागी होण्यासाठी खालील लिंकवर क्लिक करा 👇\n\n${communityLink}\n\nधन्यवाद,\nAI Marathi Guru`;
    }
    return `नमस्कार ${fullName} 👋\n\nतुमची AI Marathi Guru रजिस्ट्रेशन प्रक्रिया प्रलंबित आहे. कृपया खालील लिंकवरून ₹${amountPaid} पेमेंट पूर्ण करा:\nhttps://rzp.io/rzp/gAmUJOS0\n\nधन्यवाद!\nAI Marathi Guru`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPersonalizedMessage());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/91${whatsappNumber || mobileNumber}?text=${encodeURIComponent(getPersonalizedMessage())}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0F172A] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white font-black flex items-center justify-center text-lg font-poppins border border-white/20">
              {fullName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-poppins">{fullName}</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    paymentStatus === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">Registration ID: {student.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {isEditing ? (
            /* Edit Form */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">District (जिल्हा)</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-bold"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Payment ID</label>
                  <input
                    type="text"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* View Details */
            <div className="space-y-4">
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">मोबाईल नंबर</span>
                  <span className="font-bold text-slate-900 font-mono">{mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp नंबर</span>
                  <span className="font-bold text-emerald-700 font-mono">{whatsappNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ई-मेल</span>
                  <span className="font-medium text-slate-700 truncate block">{email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">जिल्हा</span>
                  <span className="font-bold text-slate-800">{district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">व्यवसाय</span>
                  <span className="font-bold text-slate-800">{occupation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">नोंदणी तारीख</span>
                  <span className="font-medium text-slate-700">
                    {new Date(student.registrationDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Course & Batch Card */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-blue-900 font-extrabold">कोर्स तारीख:</span>
                  <span className="font-bold text-slate-900">{student.courseDateDisplay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-900 font-extrabold">निवडलेला वेळ (Slot):</span>
                  <span className="font-bold text-slate-900">{student.slotTimeDisplay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-900 font-extrabold">फी व Payment ID:</span>
                  <span className="font-mono text-slate-800 font-bold">₹{amountPaid} • {paymentId || 'N/A'}</span>
                </div>
              </div>

              {/* Instant WhatsApp Communication Box */}
              <div className="p-4 bg-[#EFEAE2] rounded-2xl border border-stone-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-stone-800 uppercase tracking-wider font-poppins flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Personalized Student Message</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMessage ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-slate-950 text-xs font-extrabold transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>WhatsApp वर पाठवा</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed border border-stone-200">
                  {getPersonalizedMessage()}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
