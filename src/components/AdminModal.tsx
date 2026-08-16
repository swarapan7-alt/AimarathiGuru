import React, { useState, useEffect } from 'react';
import { X, Download, Users, DollarSign, Filter, RefreshCw, CheckCircle2, Search } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface AdminModalProps {
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ onClose }) => {
  const [list, setList] = useState<RegistrationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterSlot, setFilterSlot] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setList(data.registrations || []);
      setTotal(data.total || 0);
      setRevenue(data.revenue || 0);
    } catch (err) {
      console.error('Admin fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/export-csv', '_blank');
  };

  const filteredList = list.filter((item) => {
    const matchesSlot = filterSlot === 'ALL' || item.selectedSlot === filterSlot;
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobileNumber.includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSlot && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-black">
              AI
            </div>
            <div>
              <h3 className="font-bold text-lg font-marathi-title">
                AI Marathi Guru — Admin Registration Portal
              </h3>
              <p className="text-xs text-slate-400">Live Database Sync & Google Sheets Export</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRegistrations}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">एकूण विद्यार्थी (Total Registrations)</span>
              <span className="text-2xl font-black text-slate-900 font-poppins">{total}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">एकूण जमा फी (Total Collected)</span>
              <span className="text-2xl font-black text-emerald-600 font-poppins">₹{revenue}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-500 font-bold block">Google Sheets Sync</span>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Export
              </span>
            </div>
            <button
              onClick={handleExportCsv}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

        </div>

        {/* Controls: Search & Slot Filter */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="नाव, मोबाईल किंवा ID द्वारे शोधा..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-red-500"
            />
          </div>

          {/* Slot filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600">Filter Slot:</span>
            <select
              value={filterSlot}
              onChange={(e) => setFilterSlot(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none bg-white font-medium"
            >
              <option value="ALL">सर्व स्लॉट (All Slots)</option>
              <option value="11 AM">11:00 AM Slot</option>
              <option value="7 PM">7:00 PM Slot</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">
              माहिती लोड होत आहे...
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-medium">
              कोणतीही नोंदणी आढळली नाही.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Registration ID</th>
                  <th className="p-3">पूर्ण नाव</th>
                  <th className="p-3">मोबाईल / WA</th>
                  <th className="p-3">ईमेल</th>
                  <th className="p-3">जिल्हा</th>
                  <th className="p-3">व्यवसाय</th>
                  <th className="p-3">स्लॉट</th>
                  <th className="p-3">फी Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {filteredList.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold font-poppins text-red-600">{row.id}</td>
                    <td className="p-3 font-bold">{row.fullName}</td>
                    <td className="p-3">
                      <div>{row.mobileNumber}</div>
                      <div className="text-[10px] text-emerald-700">WA: {row.whatsappNumber}</div>
                    </td>
                    <td className="p-3 text-slate-600">{row.email}</td>
                    <td className="p-3">{row.district}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {row.occupation}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          row.selectedSlot === '11 AM'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {row.selectedSlot}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                        ✓ PAID ₹199
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>AI Marathi Guru Server Storage (Active Sync)</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl transition"
          >
            बंद करा (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
