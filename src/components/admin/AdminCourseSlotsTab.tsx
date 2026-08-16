import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Users,
  Video,
  CheckCircle,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { CourseDateRecord } from '../../types';

interface AdminCourseSlotsTabProps {
  courseDates: CourseDateRecord[];
  onRefresh: () => void;
}

export const AdminCourseSlotsTab: React.FC<AdminCourseSlotsTabProps> = ({
  courseDates,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDate, setEditingDate] = useState<CourseDateRecord | null>(null);

  // New Date Form state
  const [formDate, setFormDate] = useState('');
  const [formDisplayDate, setFormDisplayDate] = useState('');
  
  // Slot 1
  const [s1Name, setS1Name] = useState('Slot 1 (सकाळ)');
  const [s1Start, setS1Start] = useState('11:00 AM');
  const [s1End, setS1End] = useState('1:00 PM');
  const [s1Capacity, setS1Capacity] = useState(50);
  const [s1Meet, setS1Meet] = useState('https://meet.google.com/amg-slot1-live');
  const [s1Enabled, setS1Enabled] = useState(true);

  // Slot 2
  const [s2Name, setS2Name] = useState('Slot 2 (संध्याकाळ)');
  const [s2Start, setS2Start] = useState('7:00 PM');
  const [s2End, setS2End] = useState('9:00 PM');
  const [s2Capacity, setS2Capacity] = useState(50);
  const [s2Meet, setS2Meet] = useState('https://meet.google.com/amg-slot2-live');
  const [s2Enabled, setS2Enabled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingDate(null);
    setFormDate('');
    setFormDisplayDate('');
    setS1Name('Slot 1 (सकाळ)');
    setS1Start('11:00 AM');
    setS1End('1:00 PM');
    setS1Capacity(50);
    setS1Meet('https://meet.google.com/amg-slot1-live');
    setS1Enabled(true);

    setS2Name('Slot 2 (संध्याकाळ)');
    setS2Start('7:00 PM');
    setS2End('9:00 PM');
    setS2Capacity(50);
    setS2Meet('https://meet.google.com/amg-slot2-live');
    setS2Enabled(true);

    setShowAddModal(true);
  };

  const handleOpenEdit = (cd: CourseDateRecord) => {
    setEditingDate(cd);
    setFormDate(cd.date);
    setFormDisplayDate(cd.displayDate);

    setS1Name(cd.slot1.name);
    setS1Start(cd.slot1.startTime);
    setS1End(cd.slot1.endTime);
    setS1Capacity(cd.slot1.capacity);
    setS1Meet(cd.slot1.meetLink || '');
    setS1Enabled(cd.slot1.enabled);

    setS2Name(cd.slot2.name);
    setS2Start(cd.slot2.startTime);
    setS2End(cd.slot2.endTime);
    setS2Capacity(cd.slot2.capacity);
    setS2Meet(cd.slot2.meetLink || '');
    setS2Enabled(cd.slot2.enabled);

    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      date: formDate,
      displayDate: formDisplayDate || formDate,
      enabled: true,
      slot1: {
        id: 'slot1',
        name: s1Name,
        startTime: s1Start,
        endTime: s1End,
        capacity: Number(s1Capacity),
        enabled: s1Enabled,
        meetLink: s1Meet,
      },
      slot2: {
        id: 'slot2',
        name: s2Name,
        startTime: s2Start,
        endTime: s2End,
        capacity: Number(s2Capacity),
        enabled: s2Enabled,
        meetLink: s2Meet,
      },
    };

    const token = localStorage.getItem('amg_admin_token');

    try {
      const url = editingDate
        ? `/api/admin/course-dates/${editingDate.id}`
        : '/api/admin/course-dates';
      const method = editingDate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddModal(false);
        onRefresh();
      } else {
        const err = await res.json();
        alert(err.error || 'तारीख सेव्ह करता आली नाही.');
      }
    } catch (e) {
      console.error(e);
      alert('सर्व्हरशी संपर्क होऊ शकला नाही.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`खरोखर "${name}" ही तारीख डिलीट करायची आहे का?`)) return;

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch(`/api/admin/course-dates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-poppins">
            Course Dates & Slots Management
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub">
            कोर्सच्या तारखा, सकाळ/संध्याकाळ स्लॉट्स, जागा क्षमता (Capacity) व Google Meet लिंक्स
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-900/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन तारीख जोडा (Add Date)</span>
        </button>
      </div>

      {/* Course Dates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courseDates.map((cd) => {
          const s1Cap = cd.slot1?.capacity || 50;
          const s1Booked = cd.slot1?.booked || 0;
          const s1Avail = Math.max(0, s1Cap - s1Booked);
          const isS1Full = s1Avail === 0;

          const s2Cap = cd.slot2?.capacity || 50;
          const s2Booked = cd.slot2?.booked || 0;
          const s2Avail = Math.max(0, s2Cap - s2Booked);
          const isS2Full = s2Avail === 0;

          return (
            <div
              key={cd.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-amber-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white font-poppins">{cd.displayDate}</h3>
                    <p className="text-[11px] text-slate-300">Date Code: {cd.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cd)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                    title="Edit Date"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cd.id, cd.displayDate)}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition cursor-pointer"
                    title="Delete Date"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slots Body */}
              <div className="p-5 space-y-4">
                
                {/* Slot 1 Box */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{cd.slot1.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({cd.slot1.startTime} - {cd.slot1.endTime})
                      </span>
                    </div>
                    {isS1Full ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
                        SLOT FULL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                        {s1Avail} SEATS AVAILABLE
                      </span>
                    )}
                  </div>

                  {/* Seat Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isS1Full ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (s1Booked / s1Cap) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Booked: <b className="text-slate-800">{s1Booked}</b> / {s1Cap}</span>
                    <span className="text-blue-600 truncate max-w-[200px]">
                      Meet: {cd.slot1.meetLink || 'Not set'}
                    </span>
                  </div>
                </div>

                {/* Slot 2 Box */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{cd.slot2.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({cd.slot2.startTime} - {cd.slot2.endTime})
                      </span>
                    </div>
                    {isS2Full ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
                        SLOT FULL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                        {s2Avail} SEATS AVAILABLE
                      </span>
                    )}
                  </div>

                  {/* Seat Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isS2Full ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (s2Booked / s2Cap) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Booked: <b className="text-slate-800">{s2Booked}</b> / {s2Cap}</span>
                    <span className="text-blue-600 truncate max-w-[200px]">
                      Meet: {cd.slot2.meetLink || 'Not set'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Modal to Add / Edit Course Date */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base font-poppins">
                  {editingDate ? 'Edit Course Date' : 'नवीन कोर्स तारीख व स्लॉट्स जोडा'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              {/* Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date Code (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => {
                      setFormDate(e.target.value);
                      if (!formDisplayDate && e.target.value) {
                        const d = new Date(e.target.value);
                        setFormDisplayDate(
                          d.toLocaleDateString('en-US', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        );
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Display Date (मराठी/इंग्रजी नाव)
                  </label>
                  <input
                    type="text"
                    required
                    value={formDisplayDate}
                    onChange={(e) => setFormDisplayDate(e.target.value)}
                    placeholder="उदा. Sunday, 23 August 2026"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Slot 1 Settings */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-blue-900 font-poppins">
                    Slot 1 (सकाळ बॅच)
                  </span>
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s1Enabled}
                      onChange={(e) => setS1Enabled(e.target.checked)}
                      className="rounded"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Start Time</label>
                    <input
                      type="text"
                      value={s1Start}
                      onChange={(e) => setS1Start(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">End Time</label>
                    <input
                      type="text"
                      value={s1End}
                      onChange={(e) => setS1End(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Capacity (जागा)</label>
                    <input
                      type="number"
                      value={s1Capacity}
                      onChange={(e) => setS1Capacity(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Google Meet Link</label>
                  <input
                    type="text"
                    value={s1Meet}
                    onChange={(e) => setS1Meet(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Slot 2 Settings */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-indigo-900 font-poppins">
                    Slot 2 (संध्याकाळ बॅच)
                  </span>
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s2Enabled}
                      onChange={(e) => setS2Enabled(e.target.checked)}
                      className="rounded"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Start Time</label>
                    <input
                      type="text"
                      value={s2Start}
                      onChange={(e) => setS2Start(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">End Time</label>
                    <input
                      type="text"
                      value={s2End}
                      onChange={(e) => setS2End(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Capacity (जागा)</label>
                    <input
                      type="number"
                      value={s2Capacity}
                      onChange={(e) => setS2Capacity(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Google Meet Link</label>
                  <input
                    type="text"
                    value={s2Meet}
                    onChange={(e) => setS2Meet(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'सेव्ह होत आहे...' : 'तारीख सेव्ह करा'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
