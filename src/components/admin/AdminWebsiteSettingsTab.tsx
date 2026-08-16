import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Video,
  Sparkles,
  Link2,
} from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminWebsiteSettingsTabProps {
  onRefresh?: () => void;
}

export const AdminWebsiteSettingsTab: React.FC<AdminWebsiteSettingsTabProps> = ({ onRefresh }) => {
  const [courseName, setCourseName] = useState('AI Marathi Guru');
  const [courseFee, setCourseFee] = useState(199);
  const [oldPrice, setOldPrice] = useState(999);
  const [heroHeading, setHeroHeading] = useState('आता AI मराठीत शिका!');
  const [heroSubtitle, setHeroSubtitle] = useState('AI शिका. व्यवसाय वाढवा. भविष्य घडवा.');
  const [instructorName, setInstructorName] = useState('मा. पंकज वाघमारे (Mr. Pankaj Waghmare)');
  const [instructorTitle, setInstructorTitle] = useState('Founder & CEO, AI Marathi Guru (Under Swara Udyog Samuh)');
  const [instructorBio, setInstructorBio] = useState('८,०००+ मराठी विद्यार्थी, व्यावसायिक, शिक्षक व उद्योजकांना AI चे सोप्या भाषेत लाईव्ह ऑनलाईन प्रशिक्षण.');
  const [instructorPhoto, setInstructorPhoto] = useState('');
  const [whatsappCommunityLink, setWhatsappCommunityLink] = useState('https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO');
  const [razorpayPaymentLink, setRazorpayPaymentLink] = useState('https://rzp.io/l/ai-marathi-guru');
  const [googleMeetLink, setGoogleMeetLink] = useState('https://meet.google.com/amg-live-session');
  const [instagramLink, setInstagramLink] = useState('https://instagram.com/aimarathiguru');
  const [youtubeLink, setYoutubeLink] = useState('https://youtube.com/aimarathiguru');
  const [contactNumber, setContactNumber] = useState('9801555171');
  const [contactEmail, setContactEmail] = useState('contact@swaraudyog.com');

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
        if (s.instructorPhoto) setInstructorPhoto(s.instructorPhoto);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const token = localStorage.getItem('amg_admin_token');
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
          instructorPhoto,
          whatsappCommunityLink,
          razorpayPaymentLink,
          googleMeetLink,
          instagramLink,
          youtubeLink,
          contactNumber,
          contactEmail,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
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
    <div className="space-y-6 max-w-5xl">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider mb-2 font-poppins">
            <Globe className="w-3.5 h-3.5" /> Dynamic Website CMS
          </div>
          <h1 className="text-xl font-black text-slate-900 font-poppins">
            Website Content & CMS Settings
          </h1>
          <p className="text-xs text-slate-500 font-marathi-sub">
            हिरो सेक्शन, मार्गदर्शक प्रोफाइल, संपर्क माहिती आणि मुख्य लिंक्स थेट बदला
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>वेबसाईट मजकूर आणि सेटिंग्ज यशस्वीरित्या अपडेट झाले आहेत!</span>
          </div>
        )}

        {/* 1. Hero Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 font-poppins flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Hero & Branding Content</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Course Brand Name</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hero Main Heading</label>
              <input
                type="text"
                required
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Hero Subtitle / Tagline</label>
              <input
                type="text"
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 2. Instructor Profile */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="text-sm font-extrabold text-slate-900 font-poppins flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Instructor / Founder Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Instructor Full Name</label>
              <input
                type="text"
                required
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Designation / Title</label>
              <input
                type="text"
                required
                value={instructorTitle}
                onChange={(e) => setInstructorTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Instructor Short Bio</label>
              <textarea
                rows={2}
                value={instructorBio}
                onChange={(e) => setInstructorBio(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Core Links */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="text-sm font-extrabold text-slate-900 font-poppins flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-600" />
            <span>Core Integration Links</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Community Link</label>
              <input
                type="url"
                required
                value={whatsappCommunityLink}
                onChange={(e) => setWhatsappCommunityLink(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Razorpay Payment Link</label>
              <input
                type="url"
                required
                value={razorpayPaymentLink}
                onChange={(e) => setRazorpayPaymentLink(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Default Google Meet Link (Live Session)</label>
              <input
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact & Socials */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="text-sm font-extrabold text-slate-900 font-poppins flex items-center gap-2">
            <Phone className="w-4 h-4 text-purple-600" />
            <span>Contact & Social Presence</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Support Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 font-poppins"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'सेव्ह होत आहे...' : 'Save Website Content'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
