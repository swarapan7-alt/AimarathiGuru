import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  User,
  Phone,
  Sparkles,
  Link2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

interface AdminWebsiteSettingsTabProps {
  onRefresh?: () => void;
}

export const AdminWebsiteSettingsTab: React.FC<AdminWebsiteSettingsTabProps> = ({ onRefresh }) => {
  const [courseName, setCourseName] = useState('AI Marathi Guru');
  const [courseFee, setCourseFee] = useState(199);
  const [oldPrice, setOldPrice] = useState(999);
  const [heroHeading, setHeroHeading] = useState('आता AI मराठीत शिका!');
  const [heroSubtitle, setHeroSubtitle] = useState('AI शिका. व्यवसाय वाढवा. भविष्य घडवा.');
  const [instructorName, setInstructorName] = useState('श्री. पंकज वाघमारे');
  const [instructorNameEn, setInstructorNameEn] = useState('Mr. Pankaj Waghmare');
  const [instructorTitle, setInstructorTitle] = useState('Founder & CEO, AI Marathi Guru');
  const [instructorBio, setInstructorBio] = useState('८,०००+ मराठी विद्यार्थी, व्यावसायिक, शिक्षक व उद्योजकांना AI चे सोप्या भाषेत लाईव्ह ऑनलाईन प्रशिक्षण.');
  const [instructorPhoto, setInstructorPhoto] = useState('/pankaj-photo.png');
  const [whatsappCommunityLink, setWhatsappCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [razorpayPaymentLink, setRazorpayPaymentLink] = useState('https://rzp.io/l/ai-marathi-guru');
  const [googleMeetLink, setGoogleMeetLink] = useState('https://meet.google.com/amg-live-session');
  const [instagramLink, setInstagramLink] = useState('https://instagram.com/aimarathiguru');
  const [youtubeLink, setYoutubeLink] = useState('https://youtube.com/aimarathiguru');
  const [contactNumber, setContactNumber] = useState('9801555171');
  const [contactEmail, setContactEmail] = useState('contact@swaraudyog.com');

  // Photo upload & persistence states
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoSavedSuccess, setPhotoSavedSuccess] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchWebsiteSettings();
  }, []);

  const fetchWebsiteSettings = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/website-settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const s = data.siteSettings || {};
        if (s.courseName) setCourseName(s.courseName);
        if (s.courseFee) setCourseFee(s.courseFee);
        if (s.oldPrice) setOldPrice(s.oldPrice);
        if (s.heroHeading) setHeroHeading(s.heroHeading);
        if (s.heroSubtitle) setHeroSubtitle(s.heroSubtitle);
        if (s.instructorName) setInstructorName(s.instructorName);
        if (s.instructorNameEn) setInstructorNameEn(s.instructorNameEn);
        if (s.instructorTitle) setInstructorTitle(s.instructorTitle);
        if (s.instructorBio) setInstructorBio(s.instructorBio);
        if (s.instructor_photo_url || s.instructorPhoto || s.instructorPhotoUrl) {
          const resolved = s.instructor_photo_url || s.instructorPhoto || s.instructorPhotoUrl;
          setInstructorPhoto(resolved);
        }
        if (s.instagramLink) setInstagramLink(s.instagramLink);
        if (s.youtubeLink) setYoutubeLink(s.youtubeLink);
        if (s.contactNumber) setContactNumber(s.contactNumber);
        if (s.contactEmail) setContactEmail(s.contactEmail);

        if (data.whatsappSettings?.communityLink) setWhatsappCommunityLink(data.whatsappSettings.communityLink);
        if (data.paymentSettings?.razorpayPaymentLink) setRazorpayPaymentLink(data.paymentSettings.razorpayPaymentLink);
        if (data.liveSessionSettings?.googleMeetLink) setGoogleMeetLink(data.liveSessionSettings.googleMeetLink);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('कृपया केवळ इमेज फाईल (PNG, JPG, WEBP) निवडा.');
      return;
    }

    setPhotoUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedFilePreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Upload and permanently save photo
  const handleUploadAndSavePhoto = async () => {
    const targetImage = selectedFilePreview || instructorPhoto;
    if (!targetImage) {
      setPhotoUploadError('कृपया आधी फोटो निवडा किंवा URL टाका.');
      return;
    }
    setIsUploadingPhoto(true);
    setPhotoUploadError(null);
    setPhotoSavedSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/upload-instructor-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64: selectedFilePreview || (targetImage.startsWith('data:') ? targetImage : undefined),
          instructor_photo_url: targetImage,
          photoUrl: targetImage,
          instructorPhoto: targetImage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const savedUrl = data.instructor_photo_url || data.photoUrl || targetImage;
        setInstructorPhoto(savedUrl);
        setPhotoSavedSuccess(true);
        setSelectedFilePreview(null);
        window.dispatchEvent(new CustomEvent('websiteSettingsUpdated', { detail: data }));
        if (onRefresh) onRefresh();
        setTimeout(() => setPhotoSavedSuccess(false), 5000);
      } else {
        setPhotoUploadError(data.error || 'फोटो सेव्ह करताना त्रुटी आली.');
      }
    } catch (err: any) {
      console.error(err);
      setPhotoUploadError('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Explicitly remove instructor photo
  const handleRemovePhoto = async () => {
    if (!window.confirm('तुम्हाला मार्गदर्शकांचा सध्याचा फोटो काढून टाकायचा आहे का?')) {
      return;
    }
    setIsUploadingPhoto(true);
    setPhotoUploadError(null);
    setPhotoSavedSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
    try {
      const res = await fetch('/api/admin/remove-instructor-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setInstructorPhoto('');
        setSelectedFilePreview(null);
        setPhotoSavedSuccess(true);
        window.dispatchEvent(new CustomEvent('websiteSettingsUpdated', { detail: data }));
        if (onRefresh) onRefresh();
        setTimeout(() => setPhotoSavedSuccess(false), 4000);
      } else {
        setPhotoUploadError(data.error || 'फोटो काढताना त्रुटी आली.');
      }
    } catch (err) {
      console.error(err);
      setPhotoUploadError('सर्व्हर एरर.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
    const photoToSave = selectedFilePreview || instructorPhoto;
    try {
      const res = await fetch('/api/admin/website-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseName,
          courseFee: Number(courseFee),
          oldPrice: Number(oldPrice),
          heroHeading,
          heroSubtitle,
          instructorName,
          instructorNameEn,
          instructorTitle,
          instructorBio,
          instructorPhoto: photoToSave,
          instructor_photo_url: photoToSave,
          imageBase64: selectedFilePreview || (photoToSave.startsWith('data:') ? photoToSave : undefined),
          whatsappCommunityLink,
          razorpayPaymentLink,
          googleMeetLink,
          instagramLink,
          youtubeLink,
          contactNumber,
          contactEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (selectedFilePreview) {
          setInstructorPhoto(selectedFilePreview);
          setSelectedFilePreview(null);
        }
        setSaveSuccess(true);
        window.dispatchEvent(new CustomEvent('websiteSettingsUpdated', { detail: data }));
        if (onRefresh) onRefresh();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert('वेबसाईट सेटिंग्ज सेव्ह करता आल्या नाहीत.');
      }
    } catch (e) {
      console.error(e);
      alert('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl">
      
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-1.5 font-poppins">
            <Globe className="w-3.5 h-3.5" /> Dynamic Website Appearance & CMS
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
            Website Appearance & Instructor Settings
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub font-medium">
            मार्गदर्शक फोटो, हिरो सेक्शन, मजकूर आणि मुख्य लिंक्स थेट व्यवस्थापित करा
          </p>
        </div>

        <button
          onClick={fetchWebsiteSettings}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold font-poppins flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: INSTRUCTOR PROFILE & PHOTO MANAGEMENT                           */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-300/60 shadow-sm space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-stone-200 gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-black text-amber-600 uppercase tracking-widest font-poppins mb-1">
              <Sparkles className="w-3.5 h-3.5" /> SECTION: CENTRAL INSTRUCTOR PROFILE
            </div>
            <h2 className="text-base font-black text-slate-900 font-poppins flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>INSTRUCTOR PROFILE & PHOTO</span>
            </h2>
            <p className="text-xs text-slate-500 font-marathi-sub mt-0.5">
              येथे अपलोड केलेला फोटो <strong>Hero Section</strong> आणि <strong>Instructor Card</strong> या दोन्ही ठिकाणी आपोआप कायमस्वरूपी दिसेल.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-poppins">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Persistent Storage Active</span>
          </div>
        </div>

        {/* Success Status Message (Required format) */}
        {photoSavedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs sm:text-sm font-extrabold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>✓ Current instructor photo saved successfully</span>
          </div>
        )}

        {photoUploadError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{photoUploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* 1. Current Photo Preview Card */}
          <div className="lg:col-span-4 flex flex-col items-center p-4 bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl border border-stone-200/90 text-center space-y-3">
            <span className="text-xs font-black text-slate-800 font-poppins uppercase tracking-wider">
              1. Current Photo Preview
            </span>

            <div className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-300 shadow-lg flex items-center justify-center">
              {selectedFilePreview || instructorPhoto ? (
                <img
                  src={selectedFilePreview || instructorPhoto}
                  alt="Instructor Photo Preview"
                  className="w-full h-full object-cover object-top filter brightness-[1.02]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-stone-400 text-center">
                  <User className="w-10 h-10 mb-2 text-stone-500" />
                  <p className="text-xs font-bold text-white">फोटो उपलब्ध नाही</p>
                  <p className="text-[10px] text-stone-400 font-poppins mt-1">Upload a photo below</p>
                </div>
              )}

              {selectedFilePreview && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                  New Preview
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-black text-slate-900 font-marathi-title">
                श्री. पंकज वाघमारे
              </p>
              <p className="text-[10px] text-slate-500 font-poppins font-semibold">
                Founder & CEO, AI Marathi Guru
              </p>
            </div>
          </div>

          {/* 2. Upload, Replace, Remove, & Save Controls */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            {/* 2. Upload New Photo Drag/Click Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 border-2 border-dashed border-amber-300 hover:border-blue-500 rounded-2xl bg-amber-50/40 hover:bg-blue-50/40 transition-all cursor-pointer text-center space-y-2 group"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-white shadow-sm border border-amber-200 flex items-center justify-center text-amber-600 group-hover:text-blue-600 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 font-poppins">
                  2. Upload New Photo / फोटो निवडा
                </p>
                <p className="text-xs text-slate-600 font-marathi-sub font-medium">
                  येथे क्लिक करून आपल्या कॉम्प्युटर किंवा मोबाईलवरून <strong>पंकज सरांचा फोटो</strong> निवडा
                </p>
                <p className="text-[10px] text-stone-400 font-poppins mt-1">
                  Supports: PNG, JPG, JPEG, WEBP • Max: 5MB
                </p>
              </div>
            </div>

            {/* Action Buttons: Replace Photo, Remove Photo, Save Changes */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              
              {/* 3. Replace Photo */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs font-poppins flex items-center gap-1.5 transition cursor-pointer border border-stone-300 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                <span>3. Replace Photo</span>
              </button>

              {/* 4. Remove Photo */}
              {instructorPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs font-poppins flex items-center gap-1.5 transition cursor-pointer border border-red-200 shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>4. Remove Photo</span>
                </button>
              )}

              {/* 5. Save Changes (Dedicated Photo Save) */}
              <button
                type="button"
                onClick={handleUploadAndSavePhoto}
                disabled={isUploadingPhoto || (!selectedFilePreview && !instructorPhoto)}
                className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-wider font-poppins flex items-center gap-2 transition shadow-md shadow-red-500/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isUploadingPhoto ? 'सेव्ह होत आहे...' : '5. Save Changes'}</span>
              </button>

            </div>

            {/* Direct Image URL input (for hosted or relative paths) */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                किंवा Image URL थेट प्रविष्ट करा (Optional):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={instructorPhoto}
                  onChange={(e) => setInstructorPhoto(e.target.value)}
                  placeholder="/uploads/instructor-photo.png किंवा https://..."
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleUploadAndSavePhoto}
                  disabled={isUploadingPhoto || !instructorPhoto}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold font-poppins flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save URL</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: WEBSITE CONTENT & CMS FORM                                     */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveAll} className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-extrabold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>वेबसाईट मजकूर आणि सेटिंग्ज यशस्वीरित्या अपडेट झाले आहेत!</span>
          </div>
        )}

        {/* 1. Hero Content */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 font-poppins flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Hero & Branding Content</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Course Brand Name</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Hero Main Heading</label>
              <input
                type="text"
                required
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Hero Subtitle / Tagline</label>
              <input
                type="text"
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 2. Instructor Profile Details */}
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h3 className="text-xs font-extrabold text-slate-900 font-poppins flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Instructor / Founder Profile Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instructor Full Name (मराठी)</label>
              <input
                type="text"
                required
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instructor Full Name (English)</label>
              <input
                type="text"
                value={instructorNameEn}
                onChange={(e) => setInstructorNameEn(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Designation / Title</label>
              <input
                type="text"
                required
                value={instructorTitle}
                onChange={(e) => setInstructorTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instructor Short Bio</label>
              <textarea
                rows={2}
                value={instructorBio}
                onChange={(e) => setInstructorBio(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Core Links */}
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h3 className="text-xs font-extrabold text-slate-900 font-poppins flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Core Integration Links</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">WhatsApp Community Link</label>
              <input
                type="url"
                required
                value={whatsappCommunityLink}
                onChange={(e) => setWhatsappCommunityLink(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Razorpay Payment Link</label>
              <input
                type="url"
                required
                value={razorpayPaymentLink}
                onChange={(e) => setRazorpayPaymentLink(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Default Google Meet Link (Live Session)</label>
              <input
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact & Socials */}
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h3 className="text-xs font-extrabold text-slate-900 font-poppins flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-purple-600" />
            <span>Contact & Social Presence</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Support Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instagram Profile URL</label>
              <input
                type="url"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">YouTube Channel URL</label>
              <input
                type="url"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save All Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'Save All Website Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
