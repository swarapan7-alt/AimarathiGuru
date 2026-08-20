import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MessageCircle,
  Mail,
  Clock,
  Video,
  Copy,
  Phone,
  Check,
  Calendar,
} from 'lucide-react';
import { RegistrationRecord } from '../types';
import { WhatsAppCommunityButton } from './WhatsAppCommunityButton';

interface ConfirmationModalProps {
  registration: RegistrationRecord;
  whatsappMessage: string;
  communityLink?: string;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  registration,
  whatsappMessage,
  communityLink = 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.55 },
    });
  }, []);

  const copyRegDetails = () => {
    navigator.clipboard.writeText(
      `AI Marathi Guru Registration Receipt\nRegistration ID: ${registration.id}\nName: ${registration.fullName}\nCourse Date: ${registration.courseDateDisplay}\nSlot: ${registration.slotTimeDisplay}\nFee Paid: ₹${registration.amountPaid || 199}\nPayment ID: ${registration.paymentId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const defaultFormattedMsg = `नमस्कार ${registration.fullName} 👋\n\nAI Marathi Guru Live Training साठी तुमची नोंदणी यशस्वी झाली आहे. 🎉\n\nRegistration ID: ${registration.id}\nCourse Date: ${registration.courseDateDisplay}\nTime Slot: ${registration.slotTimeDisplay}\nPayment Status: PAID\n\nमहत्त्वाची माहिती आणि Live Session ची लिंक खालील WhatsApp Community मधून दिली जाईल.\n\nWhatsApp Community मध्ये सहभागी होण्यासाठी खालील लिंकवर क्लिक करा 👇\n\n${communityLink}\n\nधन्यवाद,\nAI Marathi Guru`;
  const effectiveWhatsAppMsg = whatsappMessage || defaultFormattedMsg;

  const handleWhatsAppRedirect = () => {
    window.open(communityLink, '_blank');
  };

  const handleDirectWhatsAppMsg = () => {
    const encoded = encodeURIComponent(effectiveWhatsAppMsg);
    window.open(`https://wa.me/91${registration.whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100 my-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-emerald-600 font-extrabold text-3xl shadow-lg mb-3">
            ✓
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-marathi-title">
            🎉 Registration Successful!
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base font-bold mt-1 font-marathi-sub">
            AI Marathi Guru मध्ये तुमची नोंदणी यशस्वी झाली आहे.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Registration ID Badge */}
          <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                Official Registration ID
              </span>
              <span className="font-extrabold text-2xl text-emerald-700 font-poppins">
                {registration.id}
              </span>
            </div>

            <button
              onClick={copyRegDetails}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Receipt!' : 'Copy Receipt'}</span>
            </button>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                विद्यार्थी नाव (Student Name)
              </span>
              <p className="font-bold text-slate-900 text-base">{registration.fullName}</p>
              <p className="text-xs text-slate-600">📱 Mobile: {registration.mobileNumber}</p>
              <p className="text-xs text-slate-600">💬 WA: {registration.whatsappNumber}</p>
              <p className="text-xs text-slate-600">📧 Email: {registration.email}</p>
              <p className="text-xs text-slate-600">📍 District: {registration.district}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block">
                कोर्स वेळ व तारीख (Batch Timing)
              </span>
              <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Course Date: {registration.courseDateDisplay}</span>
              </p>
              <div className="flex items-center gap-1.5 text-emerald-900 font-black text-sm">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Slot: {registration.slotTimeDisplay}</span>
              </div>
              <div className="pt-1 text-[11px] font-bold text-emerald-800 bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                Payment: ₹{registration.amountPaid || 199} - PAID
              </div>
            </div>
          </div>

          {/* PRIMARY STEP 1: WhatsApp Group Join Button */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider font-poppins">
                STEP 1: JOIN COMMUNITY
              </span>
              <span className="text-xs text-emerald-100 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Instant Access
              </span>
            </div>
            
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl font-poppins">
                JOIN AI MARATHI GURU WHATSAPP COMMUNITY
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 leading-relaxed">
                तुमच्या Course Updates, Live Session Link आणि महत्त्वाच्या माहितीसाठी AI Marathi Guru WhatsApp Community मध्ये Join करा.
              </p>
            </div>

            <WhatsAppCommunityButton communityLink={communityLink} />

            <p className="text-[11px] text-emerald-200/90 text-center font-medium pt-1">
              टीप: विद्यार्थ्याने स्वतः वरील Join बटणावर क्लिक करून कम्युनिटी जॉइन करावी.
            </p>
          </div>

          {/* STEP 2 / ACTION: Send Confirmation via WhatsApp App */}
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Confirmation Message</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                PRE-FILLED
              </span>
            </div>

            <button
              type="button"
              onClick={handleDirectWhatsAppMsg}
              className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider font-poppins"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600 shrink-0" />
              <span>📱 SEND VIA WHATSAPP APP</span>
            </button>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner max-h-36 overflow-y-auto">
              {effectiveWhatsAppMsg}
            </div>
          </div>

          {/* Automated Email Confirmation Preview Card */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Automated Confirmation Email Sent</span>
            </div>
            <p className="text-xs text-blue-800 font-medium">
              आम्ही तुमच्या <strong>{registration.email}</strong> या ई-मेलवर नोंदणी पावती आणि माहिती पाठवली आहे.
            </p>
          </div>

          {/* Google Meet Info & Support */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Video className="w-4 h-4 text-red-600" />
              <span>Google Meet: {registration.meetLink || 'https://meet.google.com/amg-live-session'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Support: 9801555171</span>
            </div>
          </div>

          {/* Close button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-2xl transition text-sm cursor-pointer"
            >
              मुख्य पानावर जा (Done & Close)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
