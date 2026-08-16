import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Users,
} from 'lucide-react';
import { OccupationType, CourseDateRecord, RegistrationFormData } from '../types';

interface RegistrationFormProps {
  onSubmitRegistration: (data: RegistrationFormData) => void;
  isLoading: boolean;
  courseDates?: CourseDateRecord[];
  fee?: number;
}

const DISTRICTS = [
  'अहमदनगर (Ahmednagar)',
  'अकोला (Akola)',
  'अमरावती (Amravati)',
  'छत्रपती संभाजीनगर (Aurangabad)',
  'बीड (Beed)',
  'भंडारा (Bhandara)',
  'बुलढाणा (Buldhana)',
  'चंद्रपूर (Chandrapur)',
  'धुळे (Dhule)',
  'गडचिरोली (Gadchiroli)',
  'गोंदिया (Gondia)',
  'हिंगोली (Hingoli)',
  'जळगाव (Jalgaon)',
  'जालना (Jalna)',
  'कोल्हापूर (Kolhapur)',
  'लातूर (Latur)',
  'मुंबई शहर (Mumbai City)',
  'मुंबई उपनगर (Mumbai Suburban)',
  'नागपूर (Nagpur)',
  'नांदेड (Nanded)',
  'नंदुरबार (Nandurbar)',
  'नाशिक (Nashik)',
  'धाराशिव (Osmanabad)',
  'पालघर (Palghar)',
  'परभणी (Parbhani)',
  'पुणे (Pune)',
  'रायगड (Raigad)',
  'रत्नागिरी (Ratnagiri)',
  'सांगली (Sangli)',
  'सातारा (Satara)',
  'सिंधुदुर्ग (Sindhudurg)',
  'सोलापूर (Solapur)',
  'ठाणे (Thane)',
  'वर्धा (Wardha)',
  'वाशीम (Washim)',
  'यवतमाळ (Yavatmal)',
  'इतर राज्य / जिल्हा (Other)',
];

const OCCUPATIONS: { value: OccupationType; label: string }[] = [
  { value: 'Student', label: 'विद्यार्थी (Student)' },
  { value: 'Business Owner', label: 'व्यवसाय मालक (Business Owner)' },
  { value: 'CSC Operator', label: 'CSC केंद्र चालक (CSC Operator)' },
  { value: 'Maha e-Seva', label: 'महा ई-सेवा केंद्र (Maha e-Seva)' },
  { value: 'Digital Service Center', label: 'डिजिटल सर्व्हिस सेंटर (Digital Center)' },
  { value: 'Teacher', label: 'शिक्षक / प्राध्यापक (Teacher)' },
  { value: 'Freelancer', label: 'फ्रीलान्सर (Freelancer)' },
  { value: 'Job', label: 'नोकरी (Job / Employee)' },
  { value: 'Other', label: 'इतर (Other)' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmitRegistration,
  isLoading,
  courseDates = [],
  fee = 199,
}) => {
  const activeDates = courseDates.filter((cd) => cd.enabled);
  const defaultDate = activeDates[0] || null;

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    district: '',
    occupation: '',
    courseDateId: defaultDate?.id || '',
    courseDateDisplay: defaultDate?.displayDate || '',
    selectedSlot: '' as any, // Reset to empty by default so user explicitly chooses
    slotTimeDisplay: '',
    agreedToFee: true,
  });

  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync course date defaults when courseDates load dynamically
  useEffect(() => {
    if (activeDates.length > 0) {
      // If no courseDateId set or current ID is no longer active, select first active date
      const exists = activeDates.find((d) => d.id === formData.courseDateId);
      if (!formData.courseDateId || !exists) {
        const first = activeDates[0];
        setFormData((prev) => ({
          ...prev,
          courseDateId: first.id,
          courseDateDisplay: first.displayDate,
          selectedSlot: '' as any,
          slotTimeDisplay: '',
        }));
      }
    }
  }, [courseDates]);

  const selectedCourseDateRecord = activeDates.find((d) => d.id === formData.courseDateId) || activeDates[0];

  // Handle explicit Date selection
  const handleDateSelect = (targetId: string) => {
    const targetRecord = activeDates.find((d) => d.id === targetId);
    if (targetRecord) {
      setErrorMsg('');
      setFormData((prev) => ({
        ...prev,
        courseDateId: targetRecord.id,
        courseDateDisplay: targetRecord.displayDate,
        selectedSlot: '' as any, // Clear slot selection when date changes as per guidelines
        slotTimeDisplay: '',
      }));
    }
  };

  const handleDateDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleDateSelect(e.target.value);
  };

  // Handle explicit Slot selection
  const handleSlotSelect = (slotKey: 'slot1' | 'slot2') => {
    if (!selectedCourseDateRecord) return;
    const slotInfo = selectedCourseDateRecord[slotKey];
    if (!slotInfo || !slotInfo.enabled) return;

    const available = (slotInfo as any).availableSeats ?? Math.max(0, slotInfo.capacity - slotInfo.booked);
    if (available <= 0 || (slotInfo as any).isFull) {
      setErrorMsg('निवडलेला स्लॉट पूर्ण भरला आहे (Slot Full). कृपया दुसरा स्लॉट किंवा तारीख निवडा.');
      return;
    }

    setErrorMsg('');
    setFormData((prev) => ({
      ...prev,
      selectedSlot: slotKey,
      slotTimeDisplay: `${slotInfo.startTime} – ${slotInfo.endTime}`,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'mobileNumber' && sameAsMobile) {
        updated.whatsappNumber = value;
      }
      return updated;
    });
  };

  const handleSameAsMobileToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsMobile(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, whatsappNumber: prev.mobileNumber }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('कृपया तुमचे पूर्ण नाव प्रविष्ट करा.');
      return;
    }

    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      setErrorMsg('कृपया १० अंकी वैध मोबाईल नंबर टाका.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('कृपया अचूक ईमेल आयडी प्रविष्ट करा.');
      return;
    }

    if (!formData.courseDateId) {
      setErrorMsg('कृपया Course Date निवडा.');
      return;
    }

    if (!formData.selectedSlot) {
      setErrorMsg('कृपया तुमचा Slot (वेळेचा स्लॉट) निवडा.');
      return;
    }

    // Check capacity for selected slot
    if (selectedCourseDateRecord) {
      const slotInfo = selectedCourseDateRecord[formData.selectedSlot];
      if (!slotInfo || !slotInfo.enabled) {
        setErrorMsg('निवडलेला स्लॉट सध्या उपलब्ध नाही.');
        return;
      }
      const available = (slotInfo as any).availableSeats ?? Math.max(0, slotInfo.capacity - slotInfo.booked);
      if (available <= 0 || (slotInfo as any).isFull) {
        setErrorMsg('निवडलेला स्लॉट पूर्ण भरला आहे (Slot Full). कृपया दुसरा स्लॉट किंवा तारीख निवडा.');
        return;
      }
    }

    if (!formData.agreedToFee) {
      setErrorMsg('कृपया फी भरायला तयार असलेल्या बॉक्सवर टिक करा.');
      return;
    }

    onSubmitRegistration(formData);
  };

  return (
    <section id="register" className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Container Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#E53935] text-xs font-black uppercase tracking-wider font-poppins">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Online Training</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-marathi-title">
            आजच तुमची जागा <span className="text-[#E53935]">Reserve करा!</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-stone-600 font-marathi-sub pt-1">
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 shadow-xs">
              ⏱ Duration: <strong>2 Hours</strong>
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 shadow-xs">
              💰 Fee: <strong className="text-[#E53935]">₹{fee}</strong>
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-stone-200 shadow-xs text-emerald-700">
              ✓ 100% Live Google Meet
            </span>
          </div>
        </div>

        {/* Card Frame */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 bg-[#E53935] text-white text-[11px] font-extrabold px-4 py-1.5 rounded-bl-2xl shadow-xs tracking-wider uppercase">
            ₹{fee} SPECIAL OFFER
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-[#E53935] text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Select Course Date & Slot */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <Calendar className="w-4 h-4 text-[#E53935]" />
                  <span>१. कोर्सची तारीख व वेळ निवडा (Select Date & Slot) *</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  LIVE BATCHES AVAILABLE
                </span>
              </div>

              {/* Date Selection Cards */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  १. तारीख निवडा (Select Course Date) *
                </label>

                {activeDates.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
                    सध्या कोणत्या ही ॲक्टिव्ह बॅच उपलब्ध नाहीत. नवीन बॅच लवकरच जाहीर केली जाईल.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeDates.map((d) => {
                      const isSelected = formData.courseDateId === d.id;
                      const s1Avail = d.slot1?.enabled ? ((d.slot1 as any).availableSeats ?? Math.max(0, d.slot1.capacity - d.slot1.booked)) : 0;
                      const s2Avail = d.slot2?.enabled ? ((d.slot2 as any).availableSeats ?? Math.max(0, d.slot2.capacity - d.slot2.booked)) : 0;
                      const totalAvail = s1Avail + s2Avail;

                      return (
                        <div
                          key={d.id}
                          onClick={() => handleDateSelect(d.id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[#E53935] bg-red-50/80 shadow-md ring-2 ring-[#E53935]/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-[#E53935] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 text-sm">{d.displayDate}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Batch ID: {d.id}</p>
                              </div>
                            </div>

                            {isSelected ? (
                              <span className="text-[10px] bg-[#E53935] text-white font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                                ✓ SELECTED
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md shrink-0">
                                {totalAvail > 0 ? `${totalAvail} Seats` : 'Full'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Dropdown fallback for accessibility */}
                {activeDates.length > 1 && (
                  <div className="pt-1">
                    <select
                      value={formData.courseDateId}
                      onChange={handleDateDropdownChange}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#E53935]"
                    >
                      {activeDates.map((d) => (
                        <option key={d.id} value={d.id}>
                          📅 {d.displayDate}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Slot Cards */}
              {selectedCourseDateRecord && (
                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      २. वेळेचा स्लॉट निवडा (Select Your Time Slot) *
                    </label>
                    {!formData.selectedSlot && (
                      <span className="text-[11px] font-extrabold text-[#E53935] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 animate-pulse">
                        👉 स्लॉट निवडा
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Slot 1 Card */}
                    {selectedCourseDateRecord.slot1 && selectedCourseDateRecord.slot1.enabled && (() => {
                      const s1 = selectedCourseDateRecord.slot1;
                      const avail1 = (s1 as any).availableSeats ?? Math.max(0, s1.capacity - s1.booked);
                      const isFull1 = avail1 <= 0 || (s1 as any).isFull;
                      const isSelected1 = formData.selectedSlot === 'slot1';

                      return (
                        <div
                          onClick={() => {
                            if (!isFull1) handleSlotSelect('slot1');
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                            isSelected1
                              ? 'border-[#E53935] bg-red-50/90 shadow-md ring-2 ring-[#E53935]/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          } ${isFull1 ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <input
                                type="radio"
                                name="selectedSlotRadio"
                                checked={isSelected1}
                                onChange={() => {
                                  if (!isFull1) handleSlotSelect('slot1');
                                }}
                                disabled={isFull1}
                                className="w-4 h-4 mt-1 accent-[#E53935] shrink-0"
                              />
                              <div>
                                <p className="font-extrabold text-slate-900 text-sm">
                                  {s1.name || 'Slot 1 (सकाळ)'}
                                </p>
                                <p className="text-xs text-slate-700 font-bold mt-0.5 flex items-center gap-1">
                                  <span>🕚</span> {s1.startTime} – {s1.endTime}
                                </p>
                              </div>
                            </div>
                            
                            {isFull1 ? (
                              <span className="text-[10px] bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-md shrink-0">
                                SLOT FULL
                              </span>
                            ) : (
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 ${
                                isSelected1 ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                <Users className="w-3 h-3" />
                                {avail1} Seats
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Slot 2 Card */}
                    {selectedCourseDateRecord.slot2 && selectedCourseDateRecord.slot2.enabled && (() => {
                      const s2 = selectedCourseDateRecord.slot2;
                      const avail2 = (s2 as any).availableSeats ?? Math.max(0, s2.capacity - s2.booked);
                      const isFull2 = avail2 <= 0 || (s2 as any).isFull;
                      const isSelected2 = formData.selectedSlot === 'slot2';

                      return (
                        <div
                          onClick={() => {
                            if (!isFull2) handleSlotSelect('slot2');
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                            isSelected2
                              ? 'border-[#E53935] bg-red-50/90 shadow-md ring-2 ring-[#E53935]/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          } ${isFull2 ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <input
                                type="radio"
                                name="selectedSlotRadio"
                                checked={isSelected2}
                                onChange={() => {
                                  if (!isFull2) handleSlotSelect('slot2');
                                }}
                                disabled={isFull2}
                                className="w-4 h-4 mt-1 accent-[#E53935] shrink-0"
                              />
                              <div>
                                <p className="font-extrabold text-slate-900 text-sm">
                                  {s2.name || 'Slot 2 (संध्याकाळ)'}
                                </p>
                                <p className="text-xs text-slate-700 font-bold mt-0.5 flex items-center gap-1">
                                  <span>🕖</span> {s2.startTime} – {s2.endTime}
                                </p>
                              </div>
                            </div>
                            
                            {isFull2 ? (
                              <span className="text-[10px] bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-md shrink-0">
                                SLOT FULL
                              </span>
                            ) : (
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 ${
                                isSelected2 ? 'bg-red-600 text-white' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                <Users className="w-3 h-3" />
                                {avail2} Seats
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Student Personal Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-[#E53935]" />
                <span>२. तुमची वैयक्तिक माहिती (Student Information) *</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    FULL NAME (पूर्ण नाव) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="उदा. राहुल प्रकाश पाटील"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E53935] text-sm text-slate-900 font-medium transition"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    EMAIL ADDRESS (ईमेल) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="उदा. rahul@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E53935] text-sm text-slate-900 font-medium transition"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    MOBILE NUMBER (मोबाईल नंबर) *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10 अंकी मोबाईल नंबर"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E53935] text-sm text-slate-900 font-medium transition"
                    required
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      WHATSAPP NUMBER *
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={handleSameAsMobileToggle}
                        className="rounded accent-[#E53935] w-3.5 h-3.5"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    disabled={sameAsMobile}
                    maxLength={10}
                    placeholder="WhatsApp नंबर"
                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium transition ${
                      sameAsMobile
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 focus:outline-none focus:border-[#E53935] text-slate-900'
                    }`}
                    required
                  />
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    DISTRICT (जिल्हा) *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="आपला District लिहा"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E53935] text-sm text-slate-900 font-medium transition"
                    required
                  />
                  <span className="text-[10px] text-slate-400 ml-1">उदा. Sangli, Pune, Solapur</span>
                </div>

                {/* Occupation Text Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    OCCUPATION (व्यवसाय/व्यवसाय प्रकार) *
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="आपला व्यवसाय / Occupation लिहा"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E53935] text-sm text-slate-900 font-medium transition"
                    required
                  />
                  <span className="text-[10px] text-slate-400 ml-1">उदा. Business Owner, Student, CSC Operator, Teacher, Freelancer</span>
                </div>

              </div>
            </div>

            {/* Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-50 transition">
                <input
                  type="checkbox"
                  checked={formData.agreedToFee}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, agreedToFee: e.target.checked }))
                  }
                  className="w-5 h-5 rounded accent-emerald-600"
                />
                <span className="text-xs sm:text-sm font-bold text-emerald-900 leading-snug">
                  मी ₹{fee} फी भरायला तयार आहे. (I agree to pay ₹{fee} registration fee)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4.5 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-full font-extrabold text-base sm:text-lg shadow-xl shadow-[#E53935]/25 flex items-center justify-center gap-3 hover:scale-[1.01] transition-all active:scale-95 cursor-pointer font-poppins uppercase tracking-wider"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Razorpay पेमेंट लोड होत आहे...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span>PROCEED TO PAYMENT ₹{fee}</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Razorpay 256-bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Instant Access & Registration ID
              </span>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
};
