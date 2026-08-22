import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Copy,
  MessageCircle,
  ExternalLink,
  Check,
  Eye,
  RefreshCw,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { RegistrationRecord, CourseDateRecord, RegistrationStatus, PaymentStatus } from '../../types';

interface AdminStudentsTabProps {
  students: RegistrationRecord[];
  courseDates: CourseDateRecord[];
  onUpdateStatus: (id: string, newStatus: PaymentStatus, newRegStatus?: RegistrationStatus) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: RegistrationRecord) => void;
  onExportCsv: () => void;
  onRefresh: () => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({
  students,
  courseDates,
  onUpdateStatus,
  onDeleteStudent,
  onViewStudent,
  onExportCsv,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('ALL');
  const [selectedSlot, setSelectedSlot] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [selectedRegStatus, setSelectedRegStatus] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter students locally based on all criteria
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.mobileNumber.includes(q) ||
      s.whatsappNumber.includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.tempId && s.tempId.toLowerCase().includes(q)) ||
      (s.paymentId && s.paymentId.toLowerCase().includes(q)) ||
      (s.orderId && s.orderId.toLowerCase().includes(q)) ||
      s.email.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.occupation.toLowerCase().includes(q);

    const matchesDate = selectedDate === 'ALL' || s.courseDateId === selectedDate;
    const matchesSlot = selectedSlot === 'ALL' || s.selectedSlot === selectedSlot;
    const matchesPaymentStatus = selectedPaymentStatus === 'ALL' || s.paymentStatus === selectedPaymentStatus;
    const matchesRegStatus = selectedRegStatus === 'ALL' || (s.registrationStatus || (s.paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING')) === selectedRegStatus;

    return matchesSearch && matchesDate && matchesSlot && matchesPaymentStatus && matchesRegStatus;
  });

  const getEffectiveCommunityLink = () => {
    try {
      const cached = localStorage.getItem('amg_cached_whatsapp_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.communityLink) return parsed.communityLink;
      }
    } catch (_) {}
    return 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';
  };

  const handleCopyMessage = (student: RegistrationRecord) => {
    const isPaid = student.paymentStatus === 'PAID';
    const link = getEffectiveCommunityLink();
    const message = isPaid
      ? `नमस्कार ${student.fullName} 👋\n\nAI Marathi Guru Live Training साठी तुमची नोंदणी यशस्वी झाली आहे. 🎉\n\nRegistration ID: ${student.id}\nCourse Date: ${student.courseDateDisplay}\nTime Slot: ${student.slotTimeDisplay}\nPayment Status: PAID\n\nमहत्त्वाची माहिती आणि Live Session ची लिंक खालील WhatsApp Community मधून दिली जाईल.\n\nWhatsApp Community मध्ये सहभागी होण्यासाठी खालील लिंकवर क्लिक करा 👇\n\n${link}\n\nधन्यवाद,\nAI Marathi Guru`
      : `नमस्कार ${student.fullName} 👋\n\nतुमची AI Marathi Guru नोंदणी प्रक्रिया अपूर्ण आहे. जागा निश्चित करण्यासाठी कृपया खालील अधिकृत लिंकवरून ₹${student.amountPaid || 199} पेमेंट पूर्ण करा:\nhttps://rzp.io/rzp/gAmUJOS0\n\nधन्यवाद!\nAI Marathi Guru`;

    navigator.clipboard.writeText(message);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWhatsApp = (student: RegistrationRecord) => {
    const isPaid = student.paymentStatus === 'PAID';
    const link = getEffectiveCommunityLink();
    const message = isPaid
      ? `नमस्कार ${student.fullName} 👋\n\nAI Marathi Guru Live Training साठी तुमची नोंदणी यशस्वी झाली आहे. 🎉\n\nRegistration ID: ${student.id}\nCourse Date: ${student.courseDateDisplay}\nTime Slot: ${student.slotTimeDisplay}\nPayment Status: PAID\n\nमहत्त्वाची माहिती आणि Live Session ची लिंक खालील WhatsApp Community मधून दिली जाईल.\n\nWhatsApp Community मध्ये सहभागी होण्यासाठी खालील लिंकवर क्लिक करा 👇\n\n${link}\n\nधन्यवाद,\nAI Marathi Guru`
      : `नमस्कार ${student.fullName} 👋\n\nतुमची AI Marathi Guru नोंदणी प्रक्रिया पूर्ण करण्यासाठी कृपया ₹${student.amountPaid || 199} पेमेंट पूर्ण करा:\nhttps://rzp.io/rzp/gAmUJOS0\n\nधन्यवाद!\nAI Marathi Guru`;

    const url = `https://wa.me/91${student.whatsappNumber || student.mobileNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Counts for quick tabs
  const paidCount = students.filter((s) => s.paymentStatus === 'PAID').length;
  const pendingCount = students.filter((s) => s.paymentStatus === 'PENDING').length;
  const failedCount = students.filter((s) => s.paymentStatus === 'FAILED' || s.paymentStatus === 'CANCELLED').length;

  return (
    <div className="space-y-3.5">
      
      {/* Top Controls Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
                Student Registrations
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-poppins">
                {filteredStudents.length} / {students.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-marathi-sub">
              विद्यार्थी डेटाबेस, पेमेंट पडताळणी स्थिती आणि रीअल-टाइम व्यवस्थापन
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Refresh List"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedPaymentStatus('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedPaymentStatus === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setSelectedPaymentStatus('PAID')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedPaymentStatus === 'PAID'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>Confirmed / Paid ({paidCount})</span>
          </button>
          <button
            onClick={() => setSelectedPaymentStatus('PENDING')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedPaymentStatus === 'PENDING'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pending Payment ({pendingCount})</span>
          </button>
          <button
            onClick={() => setSelectedPaymentStatus('FAILED')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedPaymentStatus === 'FAILED'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>Failed / Cancelled ({failedCount})</span>
          </button>
        </div>

        {/* Detailed Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाव, मोबाईल, ID, Pay ID किंवा शहर..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-blue-600 text-slate-700 font-medium"
            >
              <option value="ALL">सर्व तारखा (All Dates)</option>
              {courseDates.map((cd) => (
                <option key={cd.id} value={cd.id}>
                  {cd.displayDate}
                </option>
              ))}
            </select>
          </div>

          {/* Slot Filter */}
          <div>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-blue-600 text-slate-700 font-medium"
            >
              <option value="ALL">सर्व स्लॉट्स (All Slots)</option>
              <option value="slot1">Slot 1 (11:00 AM - 1:00 PM)</option>
              <option value="slot2">Slot 2 (7:00 PM - 9:00 PM)</option>
            </select>
          </div>

          {/* Registration Status Filter */}
          <div>
            <select
              value={selectedRegStatus}
              onChange={(e) => setSelectedRegStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-blue-600 text-slate-700 font-medium"
            >
              <option value="ALL">सर्व नोंदणी स्थिती (All Reg Status)</option>
              <option value="CONFIRMED">CONFIRMED (कन्फर्म)</option>
              <option value="PENDING">PENDING (अपूर्ण)</option>
              <option value="FAILED">FAILED (अयशस्वी)</option>
              <option value="CANCELLED">CANCELLED (रद्द)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-500 uppercase font-black tracking-wider text-[9px] border-b border-stone-200">
              <tr>
                <th className="px-3.5 py-2.5 font-poppins">Reg ID / Session</th>
                <th className="px-3.5 py-2.5">विद्यार्थी तपशील (Student)</th>
                <th className="px-3.5 py-2.5">मोबाईल / WA</th>
                <th className="px-3.5 py-2.5">बॅच तारीख व वेळ</th>
                <th className="px-3.5 py-2.5">नोंदणी स्थिती</th>
                <th className="px-3.5 py-2.5">पेमेंट स्थिती</th>
                <th className="px-3.5 py-2.5">Transaction Info</th>
                <th className="px-3.5 py-2.5 text-center">WhatsApp Message</th>
                <th className="px-3.5 py-2.5 text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">
                    कोणताही विद्यार्थी सापडला नाही.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const regStatus = s.registrationStatus || (s.paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING');
                  const isConfirmed = regStatus === 'CONFIRMED' && s.paymentStatus === 'PAID';

                  return (
                    <tr key={s.id} className={`hover:bg-slate-50/80 transition ${!isConfirmed ? 'bg-amber-50/20' : ''}`}>
                      
                      {/* 1. ID / Temp ID */}
                      <td className="px-3.5 py-2.5 font-bold font-poppins text-xs">
                        <div className={`font-mono ${isConfirmed ? 'text-emerald-800 font-extrabold' : 'text-slate-500'}`}>
                          {s.id}
                        </div>
                        {s.tempId && s.tempId !== s.id && (
                          <div className="text-[9px] text-slate-400 font-mono">
                            Temp: {s.tempId.substring(0, 12)}...
                          </div>
                        )}
                      </td>

                      {/* 2. Full Name & Extra */}
                      <td className="px-3.5 py-2.5">
                        <div className="font-bold text-slate-900 leading-tight">{s.fullName}</div>
                        <div className="text-[9px] text-slate-500 leading-tight">{s.occupation} • {s.district}</div>
                        <div className="text-[9px] text-slate-400 truncate max-w-[140px] leading-tight">{s.email}</div>
                      </td>

                      {/* 3. Mobile & WhatsApp */}
                      <td className="px-3.5 py-2.5 font-mono text-xs">
                        <div className="font-bold text-slate-800 leading-tight">{s.mobileNumber}</div>
                        {s.whatsappNumber && s.whatsappNumber !== s.mobileNumber && (
                          <div className="text-[9px] text-emerald-600 leading-tight">WA: {s.whatsappNumber}</div>
                        )}
                      </td>

                      {/* 4. Date & Slot */}
                      <td className="px-3.5 py-2.5">
                        <div className="font-bold text-slate-800 leading-tight">{s.courseDateDisplay}</div>
                        <div className="text-[9px] text-slate-500 font-medium leading-tight">{s.slotTimeDisplay}</div>
                      </td>

                      {/* 5. Registration Status */}
                      <td className="px-3.5 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider font-poppins ${
                            regStatus === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : regStatus === 'PENDING'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : regStatus === 'FAILED'
                              ? 'bg-red-100 text-red-900 border border-red-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {regStatus}
                        </span>
                      </td>

                      {/* 6. Payment Status with Quick Toggle / Confirm */}
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const nextStatus = s.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
                              const nextRegStatus = nextStatus === 'PAID' ? 'CONFIRMED' : 'PENDING';
                              onUpdateStatus(s.id, nextStatus, nextRegStatus);
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition cursor-pointer ${
                              s.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : s.paymentStatus === 'FAILED'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {s.paymentStatus === 'PAID' ? (
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                            )}
                            <span>{s.paymentStatus}</span>
                          </button>
                        </div>
                        <div className="text-[9px] text-slate-600 mt-0.5 font-bold">
                          ₹{s.amountPaid || 199}
                        </div>
                      </td>

                      {/* 7. Payment ID & Order ID */}
                      <td className="px-3.5 py-2.5 font-mono text-[10px] text-slate-600">
                        {s.paymentId && s.paymentId !== 'PENDING_PAYMENT' ? (
                          <div>
                            <span className="font-bold text-slate-800">{s.paymentId}</span>
                            {s.paymentDate && (
                              <div className="text-[8px] text-slate-400">
                                {new Date(s.paymentDate).toLocaleDateString('mr-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </div>
                        ) : s.failureReason ? (
                          <div className="text-[9px] text-red-600 font-sans max-w-[120px] truncate" title={s.failureReason}>
                            ⚠️ {s.failureReason}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Payment</span>
                        )}
                      </td>

                      {/* 8. Quick Copy & WhatsApp Buttons */}
                      <td className="px-3.5 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleCopyMessage(s)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                            title="Copy Formatted WhatsApp Message"
                          >
                            {copiedId === s.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenWhatsApp(s)}
                            className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                            title="Send WhatsApp Message Directly"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* 9. Actions */}
                      <td className="px-3.5 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewStudent(s)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                            title="View Full Registration Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`खरोखर विद्यार्थी "${s.fullName}" (${s.id}) डिलीट करायचा आहे का?`)) {
                                onDeleteStudent(s.id);
                              }
                            }}
                            className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
