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

  // Photo upload states
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);
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
        if (s.instructorTitle) setInstructorTitle(s.instructorTitle);
        if (s.instructorBio) setInstructorBio(s.instructorBio);
        if (s.instructor_photo_url || s.instructorPhoto) {
          setInstructorPhoto(s.instructor_photo_url || s.instructorPhoto);
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

  const handleUploadAndSavePhoto = async () => {
    const targetImage = selectedFilePreview || instructorPhoto;
    if (!targetImage) {
      setPhotoUploadError('कृपया आधी फोटो निवडा किंवा URL टाका.');
      return;
    }
    setIsUploadingPhoto(true);
    setPhotoUploadError(null);
    setPhotoUploadSuccess(false);

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
        setPhotoUploadSuccess(true);
        setSelectedFilePreview(null);
        window.dispatchEvent(new CustomEvent('websiteSettingsUpdated', { detail: data }));
        if (onRefresh) onRefresh();
        setTimeout(() => setPhotoUploadSuccess(false), 4000);
      } else {
        setPhotoUploadError(data.error || 'फोटो अपलोड करताना त्रुटी आली.');
      }
    } catch (err: any) {
      console.error(err);
      setPhotoUploadError('सर्व्हर एरर. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
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
        setTimeout(() => setSaveSuccess(false), 3500);
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
    <div className="space-y-3.5 max-w-5xl">
      
      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-1 font-poppins">
            <Globe className="w-3 h-3" /> Dynamic Website CMS & Appearance
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 font-poppins">
            Website Appearance & Content Settings
          </h1>
          <p className="text-[11px] text-slate-500 font-marathi-sub">
            हिरो सेक्शन फोटो, मार्गदर्शक प्रोफाइल, मजकूर आणि मुख्य लिंक्स थेट व्यवस्थापित करा
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: INSTRUCTOR PHOTO UPLOAD (Hero Section & Instructor Card)        */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 font-poppins flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>Official Instructor Photo Management</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-marathi-sub">
              ही इमेज <strong>Hero Section</strong> आणि <strong>Instructor Card</strong> या दोन्ही ठिकाणी थेट दिसणार आहे
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold font-poppins">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Active on Website</span>
          </div>
        </div>

        {photoUploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>नवीन फोटो यशस्वीरित्या सेव्ह झाला असून वेबसाईटवर लाइव्ह झाला आहे!</span>
          </div>
        )}

        {photoUploadError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-extrabold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{photoUploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Current Live Preview */}
          <div className="lg:col-span-4 flex flex-col items-center p-3 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-2">
            <div className="relative w-32 h-36 sm:w-36 sm:h-44 rounded-xl overflow-hidden bg-stone-200 border-2 border-white shadow-xs">
              <img
                src={selectedFilePreview || instructorPhoto || '/pankaj-photo.png'}
                alt="Instructor Live Preview"
                className="w-full h-full object-cover object-top filter brightness-[1.01]"
              />
              {selectedFilePreview && (
                <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-xs">
                  New Preview
                </div>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 font-poppins">
                {selectedFilePreview ? 'नवीन निवडलेला फोटो' : 'सध्याचा लाइव्ह फोटो'}
              </p>
              <p className="text-[10px] text-slate-500 font-poppins">
                Fit: Cover • Position: Center Top
              </p>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            {/* Click to Select File Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-stone-300 hover:border-blue-500 rounded-xl bg-stone-50/70 hover:bg-blue-50/40 transition-all cursor-pointer text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 mx-auto rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-600 group-hover:text-blue-600 group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 font-poppins">
                  Upload Image / फोटो निवडा
                </p>
                <p className="text-[11px] text-slate-500 font-marathi-sub">
                  येथे क्लिक करून आपल्या कॉम्प्युटर किंवा मोबाईलवरून <strong>Pankajphoto.png</strong> निवडा
                </p>
                <p className="text-[9px] text-stone-400 font-poppins">
                  Supports: PNG, JPG, JPEG, WEBP
                </p>
              </div>
            </div>

            {/* Save Photo Button if a file is selected */}
            {selectedFilePreview && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                  <Eye className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>फोटो निवडला आहे. लागू करण्यासाठी "SAVE INSTRUCTOR PHOTO" दाबा.</span>
                </div>
                <button
                  type="button"
                  onClick={handleUploadAndSavePhoto}
                  disabled={isUploadingPhoto}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-[#E53935] hover:bg-[#D32F2F] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer disabled:opacity-50 font-poppins flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? 'सेव्ह होत आहे...' : 'SAVE INSTRUCTOR PHOTO'}</span>
                </button>
              </div>
            )}

            {/* Direct Image URL input */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-end gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                  किंवा थेट Image URL टाका (Optional):
                </label>
                <input
                  type="text"
                  value={instructorPhoto}
                  onChange={(e) => setInstructorPhoto(e.target.value)}
                  placeholder="/uploads/instructor-photo.png किंवा https://..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-slate-800"
                />
              </div>
              <button
                type="button"
                onClick={handleUploadAndSavePhoto}
                disabled={isUploadingPhoto || !instructorPhoto}
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold font-poppins flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save URL</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: WEBSITE CONTENT & CMS FORM                                     */}
      {/* ========================================================================= */}
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-4">
        
        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>वेबसाईट मजकूर आणि सेटिंग्ज यशस्वीरित्या अपडेट झाले आहेत!</span>
          </div>
        )}

        {/* 1. Hero Content */}
        <div className="space-y-2.5">
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
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Hero Main Heading</label>
              <input
                type="text"
                required
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Hero Subtitle / Tagline</label>
              <input
                type="text"
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 2. Instructor Profile */}
        <div className="space-y-2.5 pt-3 border-t border-stone-200">
          <h3 className="text-xs font-extrabold text-slate-900 font-poppins flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Instructor / Founder Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instructor Full Name</label>
              <input
                type="text"
                required
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Designation / Title</label>
              <input
                type="text"
                required
                value={instructorTitle}
                onChange={(e) => setInstructorTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instructor Short Bio</label>
              <textarea
                rows={2}
                value={instructorBio}
                onChange={(e) => setInstructorBio(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Core Links */}
        <div className="space-y-2.5 pt-3 border-t border-stone-200">
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
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Razorpay Payment Link</label>
              <input
                type="url"
                required
                value={razorpayPaymentLink}
                onChange={(e) => setRazorpayPaymentLink(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Default Google Meet Link (Live Session)</label>
              <input
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact & Socials */}
        <div className="space-y-2.5 pt-3 border-t border-stone-200">
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
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Instagram Profile URL</label>
              <input
                type="url"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">YouTube Channel URL</label>
              <input
                type="url"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-xs cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'Save Website Content'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
