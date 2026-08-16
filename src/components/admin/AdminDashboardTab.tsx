import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Download,
  PlusCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { AdminDashboardStats, RegistrationRecord } from '../../types';

interface AdminDashboardTabProps {
  stats: AdminDashboardStats | null;
  students: RegistrationRecord[];
  onNavigateTab: (tab: any) => void;
  onRefresh: () => void;
  onExportCsv: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  stats,
  students,
  onNavigateTab,
  onRefresh,
  onExportCsv,
}) => {
  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-3 sm:space-y-3.5">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E293B] to-[#0F172A] text-white px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-black uppercase tracking-wider mb-1 border border-blue-400/30 font-poppins">
            <Sparkles className="w-3 h-3 text-amber-300" /> Real-time Analytics & Control
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white font-poppins leading-tight">
            Admin Overview Dashboard
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-marathi-sub">
            विद्यार्थी नोंदणी, पेमेंट स्थिती आणि लाईव्ह बॅच व्यवस्थापन
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigateTab('courses')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Batch</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        
        {/* 1. Total Registrations */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between h-[84px] sm:h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-poppins">
              Total Students
            </span>
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-poppins leading-none">
              {stats?.totalRegistrations || 0}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              एकूण नोंदणीकृत
            </div>
          </div>
        </div>

        {/* 2. Paid Students */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between h-[84px] sm:h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider font-poppins">
              Paid Students
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600 font-poppins leading-none">
              {stats?.paidStudents || 0}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              यशस्वी पेमेंट
            </div>
          </div>
        </div>

        {/* 3. Pending Payments */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between h-[84px] sm:h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider font-poppins">
              Pending
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-amber-600 font-poppins leading-none">
              {stats?.pendingPayments || 0}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              पेमेंट बाकी
            </div>
          </div>
        </div>

        {/* 4. Today's Registrations */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between h-[84px] sm:h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider font-poppins">
              Today's
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-indigo-600 font-poppins leading-none">
              {stats?.todayStudents || 0}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              आजची नोंदणी
            </div>
          </div>
        </div>

        {/* 5. Total Revenue */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between h-[84px] sm:h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider font-poppins">
              Revenue
            </span>
            <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-poppins leading-none">
              ₹{stats?.totalRevenue || 0}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              एकूण फी जमा
            </div>
          </div>
        </div>

        {/* 6. Upcoming Course Date */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between h-[84px] sm:h-[90px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider font-poppins">
              Next Batch
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 truncate leading-tight">
              {stats?.upcomingCourseDate || 'Sunday, 23 Aug'}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              पुढील लाईव्ह बॅच
            </div>
          </div>
        </div>

      </div>

      {/* Top Action Cards in one responsive row on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
        
        {/* Card 1: Payment Link */}
        <div className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition h-[76px] sm:h-[80px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              ₹
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">Razorpay Payment Settings</div>
              <div className="text-[10px] text-slate-500 truncate">फी आणि पेमेंट लिंक व्यवस्थापन</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('payment')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition cursor-pointer shrink-0 ml-2"
            title="Open Payment Settings"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: WhatsApp Community */}
        <div className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between hover:border-emerald-300 transition h-[76px] sm:h-[80px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">WhatsApp Community Link</div>
              <div className="text-[10px] text-slate-500 truncate">ग्रुप लिंक आणि मेसेज कस्टमाईज करा</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('whatsapp')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition cursor-pointer shrink-0 ml-2"
            title="Open WhatsApp Settings"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Batch Management */}
        <div className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between hover:border-amber-300 transition h-[76px] sm:h-[80px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">Course Dates & Slots</div>
              <div className="text-[10px] text-slate-500 truncate">तारीख व जागा क्षमता व्यवस्थापन</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('courses')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition cursor-pointer shrink-0 ml-2"
            title="Open Course & Slots"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Recent Registrations Table Preview */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 font-poppins">
              Recent Registrations (ताजी नोंदणी)
            </h2>
            <p className="text-[10px] text-slate-500">नुकतीच नोंदणी केलेले ५ विद्यार्थी</p>
          </div>
          <button
            onClick={() => onNavigateTab('students')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
          >
            <span>सर्व विद्यार्थी पहा (View All {students.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-500 uppercase font-black tracking-wider text-[9px] border-b border-stone-200">
              <tr>
                <th className="px-3.5 py-2 font-poppins">ID</th>
                <th className="px-3.5 py-2">विद्यार्थी नाव</th>
                <th className="px-3.5 py-2">मोबाईल</th>
                <th className="px-3.5 py-2">तारीख व स्लॉट</th>
                <th className="px-3.5 py-2">पेमेंट स्थिती</th>
                <th className="px-3.5 py-2 text-right">रक्कम</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400 text-xs">
                    कोणतीही नोंदणी आढळली नाही.
                  </td>
                </tr>
              ) : (
                recentStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-3.5 py-2 font-bold font-poppins text-slate-700 text-xs">
                      {s.id}
                    </td>
                    <td className="px-3.5 py-2 font-bold text-slate-900 text-xs">
                      <div className="leading-tight">{s.fullName}</div>
                      <div className="text-[9px] text-slate-400 font-normal leading-tight">{s.occupation} • {s.district}</div>
                    </td>
                    <td className="px-3.5 py-2 text-slate-600 font-mono text-xs">
                      {s.mobileNumber}
                    </td>
                    <td className="px-3.5 py-2 text-slate-700 text-xs">
                      <div className="font-bold leading-tight">{s.courseDateDisplay}</div>
                      <div className="text-[9px] text-slate-500 leading-tight">{s.slotTimeDisplay}</div>
                    </td>
                    <td className="px-3.5 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          s.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-right font-black font-poppins text-slate-900 text-xs">
                      ₹{s.amountPaid || 199}
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
