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
  const recentStudents = students.slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-black uppercase tracking-wider mb-2 border border-blue-400/30 font-poppins">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Real-time Analytics & Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-poppins">
            Admin Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-marathi-sub">
            विद्यार्थी नोंदणी, पेमेंट स्थिती आणि लाईव्ह बॅच व्यवस्थापन
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-900/30 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigateTab('courses')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition shadow-md shadow-amber-900/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Batch</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* 1. Total Registrations */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider font-poppins">
              Total Registrations
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-poppins">
              {stats?.totalRegistrations || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              एकूण नोंदणीकृत
            </div>
          </div>
        </div>

        {/* 2. Paid Students */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider font-poppins">
              Paid Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 font-poppins">
              {stats?.paidStudents || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              यशस्वी पेमेंट केलेले
            </div>
          </div>
        </div>

        {/* 3. Pending Payments */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider font-poppins">
              Pending Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600 font-poppins">
              {stats?.pendingPayments || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              पेमेंट बाकी असलेले
            </div>
          </div>
        </div>

        {/* 4. Today's Registrations */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider font-poppins">
              Today's Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-600 font-poppins">
              {stats?.todayStudents || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              आजची नवीन नोंदणी
            </div>
          </div>
        </div>

        {/* 5. Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider font-poppins">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-poppins">
              ₹{stats?.totalRevenue || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              एकूण गोळा झालेली फी
            </div>
          </div>
        </div>

        {/* 6. Upcoming Course Date */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider font-poppins">
              Upcoming Date
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 line-clamp-1">
              {stats?.upcomingCourseDate || 'Sunday, 23 Aug'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              पुढील लाईव्ह बॅच
            </div>
          </div>
        </div>

      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Payment Link */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between hover:border-blue-300 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Razorpay Payment Settings</div>
              <div className="text-[11px] text-slate-500">फी आणि पेमेंट लिंक बदला</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('payment')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: WhatsApp Community */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">WhatsApp Community Link</div>
              <div className="text-[11px] text-slate-500">ग्रुप लिंक आणि मेसेज कस्टमाईज करा</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('whatsapp')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Batch Management */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between hover:border-amber-300 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Course Dates & Slots</div>
              <div className="text-[11px] text-slate-500">तारीख व जागा क्षमता व्यवस्थापन</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('courses')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Recent Registrations Table Preview */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-poppins">
              Recent Registrations (ताजी नोंदणी)
            </h2>
            <p className="text-xs text-slate-500">नुकतीच नोंदणी केलेले विद्यार्थी</p>
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
            <thead className="bg-stone-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="px-5 py-3 font-poppins">ID</th>
                <th className="px-5 py-3">विद्यार्थी नाव</th>
                <th className="px-5 py-3">मोबाईल</th>
                <th className="px-5 py-3">तारीख व स्लॉट</th>
                <th className="px-5 py-3">पेमेंट स्थिती</th>
                <th className="px-5 py-3 text-right">रक्कम</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    कोणतीही नोंदणी आढळली नाही.
                  </td>
                </tr>
              ) : (
                recentStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-bold font-poppins text-slate-700">
                      {s.id}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {s.fullName}
                      <div className="text-[10px] text-slate-400 font-normal">{s.occupation} • {s.district}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">
                      {s.mobileNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      <div className="font-bold">{s.courseDateDisplay}</div>
                      <div className="text-[10px] text-slate-500">{s.slotTimeDisplay}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          s.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-black font-poppins text-slate-900">
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
