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
} from 'lucide-react';
import { RegistrationRecord, CourseDateRecord } from '../../types';

interface AdminStudentsTabProps {
  students: RegistrationRecord[];
  courseDates: CourseDateRecord[];
  onUpdateStatus: (id: string, newStatus: 'PAID' | 'PENDING' | 'FAILED') => void;
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
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter students locally based on criteria
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.mobileNumber.includes(q) ||
      s.whatsappNumber.includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.occupation.toLowerCase().includes(q);

    const matchesDate = selectedDate === 'ALL' || s.courseDateId === selectedDate;
    const matchesSlot = selectedSlot === 'ALL' || s.selectedSlot === selectedSlot;
    const matchesStatus = selectedStatus === 'ALL' || s.paymentStatus === selectedStatus;

    return matchesSearch && matchesDate && matchesSlot && matchesStatus;
  });

  const handleCopyMessage = (student: RegistrationRecord) => {
    const isPaid = student.paymentStatus === 'PAID';
    const message = isPaid
      ? `नमस्कार ${student.fullName} 👋\n\nAI Marathi Guru मध्ये तुमची Registration Successful झाली आहे. 🎉\n\nID: ${student.id}\nतारीख: ${student.courseDateDisplay}\nस्लॉट: ${student.slotTimeDisplay}\nPayment: PAID (₹${student.amountPaid || 199})\n\nOfficial WhatsApp Community Join करा:\nhttps://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO\n\nGoogle Meet: ${student.meetLink || 'https://meet.google.com/amg-live-session'}\n\nधन्यवाद!\nAI Marathi Guru`
      : `नमस्कार ${student.fullName} 👋\n\nतुमची AI Marathi Guru रजिस्ट्रेशन प्रोसेस प्रलंबित आहे. कृपया खालील लिंकवरून ₹${student.amountPaid || 199} पेमेंट पूर्ण करा:\nhttps://rzp.io/l/ai-marathi-guru\n\nधन्यवाद!\nAI Marathi Guru`;

    navigator.clipboard.writeText(message);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWhatsApp = (student: RegistrationRecord) => {
    const isPaid = student.paymentStatus === 'PAID';
    const message = isPaid
      ? `नमस्कार ${student.fullName} 👋\n\nAI Marathi Guru मध्ये तुमची Registration Successful झाली आहे. 🎉\n\nID: ${student.id}\nतारीख: ${student.courseDateDisplay}\nस्लॉट: ${student.slotTimeDisplay}\nPayment: PAID\n\nOfficial WhatsApp Community Join करा:\nhttps://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO`
      : `नमस्कार ${student.fullName} 👋\n\nतुमची AI Marathi Guru रजिस्ट्रेशन प्रक्रिया पूर्ण करण्यासाठी कृपया ₹${student.amountPaid || 199} पेमेंट पूर्ण करा:\nhttps://rzp.io/l/ai-marathi-guru`;

    const url = `https://wa.me/91${student.whatsappNumber || student.mobileNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3.5">
      
      {/* Top Controls Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
              Student Registrations ({filteredStudents.length} / {students.length})
            </h1>
            <p className="text-[11px] text-slate-500 font-marathi-sub">
              नोंदणीकृत विद्यार्थ्यांची माहिती, पेमेंट स्थिती व थेट संवाद
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

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाव, मोबाईल, ID किंवा जिल्हा..."
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

          {/* Payment Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-blue-600 text-slate-700 font-medium"
            >
              <option value="ALL">सर्व स्टेटस (All Status)</option>
              <option value="PAID">PAID (पेमेंट झालेले)</option>
              <option value="PENDING">PENDING (बाकी)</option>
              <option value="FAILED">FAILED</option>
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
                <th className="px-3.5 py-2 font-poppins">ID</th>
                <th className="px-3.5 py-2">विद्यार्थी नाव</th>
                <th className="px-3.5 py-2">मोबाईल / WhatsApp</th>
                <th className="px-3.5 py-2">तारीख व वेळ</th>
                <th className="px-3.5 py-2">पेमेंट स्थिती</th>
                <th className="px-3.5 py-2">Payment ID</th>
                <th className="px-3.5 py-2 text-center">Quick Messages</th>
                <th className="px-3.5 py-2 text-right">कृती (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">
                    कोणताही विद्यार्थी सापडला नाही.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* 1. ID */}
                    <td className="px-3.5 py-2 font-bold font-poppins text-slate-700 text-xs">
                      {s.id}
                    </td>

                    {/* 2. Full Name & Extra */}
                    <td className="px-3.5 py-2">
                      <div className="font-bold text-slate-900 leading-tight">{s.fullName}</div>
                      <div className="text-[9px] text-slate-500 leading-tight">{s.occupation} • {s.district}</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[150px] leading-tight">{s.email}</div>
                    </td>

                    {/* 3. Mobile & WhatsApp */}
                    <td className="px-3.5 py-2 font-mono text-xs">
                      <div className="font-bold text-slate-800 leading-tight">{s.mobileNumber}</div>
                      {s.whatsappNumber !== s.mobileNumber && (
                        <div className="text-[9px] text-emerald-600 leading-tight">WA: {s.whatsappNumber}</div>
                      )}
                    </td>

                    {/* 4. Date & Slot */}
                    <td className="px-3.5 py-2">
                      <div className="font-bold text-slate-800 leading-tight">{s.courseDateDisplay}</div>
                      <div className="text-[9px] text-slate-500 font-medium leading-tight">{s.slotTimeDisplay}</div>
                    </td>

                    {/* 5. Payment Status with Quick Toggle */}
                    <td className="px-3.5 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStatus(s.id, s.paymentStatus === 'PAID' ? 'PENDING' : 'PAID')}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition cursor-pointer ${
                            s.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
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
                      <div className="text-[9px] text-slate-500 mt-0.5 font-bold">
                        ₹{s.amountPaid || 199}
                      </div>
                    </td>

                    {/* 6. Payment ID */}
                    <td className="px-3.5 py-2 font-mono text-[10px] text-slate-600">
                      {s.paymentId || 'N/A'}
                    </td>

                    {/* 7. Quick Copy & WhatsApp Buttons */}
                    <td className="px-3.5 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleCopyMessage(s)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                          title="Copy Personalized Message"
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
                          title="Open in WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* 8. Actions */}
                    <td className="px-3.5 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewStudent(s)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title="View Full Details"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
