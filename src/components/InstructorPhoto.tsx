import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

interface InstructorPhotoProps {
  photoUrl?: string;
  className?: string;
}

export const InstructorPhoto: React.FC<InstructorPhotoProps> = ({
  photoUrl,
  className = '',
}) => {
  const hasValidPhoto = photoUrl && photoUrl.trim() !== '' && photoUrl.startsWith('http');

  return (
    <div className={`relative group max-w-sm sm:max-w-md mx-auto ${className}`}>
      {/* Soft Ambient Warm/Indigo Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-amber-200/50 via-blue-100/50 to-red-100/40 rounded-[36px] blur-xl opacity-70 group-hover:opacity-90 transition-opacity pointer-events-none" />

      {/* Main Light Card Container */}
      <div className="relative bg-white rounded-[32px] p-4 sm:p-5 shadow-xl shadow-stone-200/60 border border-stone-200/80 overflow-hidden space-y-3.5">
        
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 font-extrabold uppercase font-poppins text-[10px] tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Master Trainer</span>
          </div>
          <span className="text-[11px] font-bold text-stone-500 font-marathi-sub flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Live Guidance</span>
          </span>
        </div>

        {/* Photo Container */}
        <div className="relative aspect-[4/4.8] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 shadow-inner">
          {hasValidPhoto ? (
            <img
              src={photoUrl.trim()}
              alt="Mr. Pankaj Waghmare - Founder & CEO, AI Marathi Guru"
              loading="eager"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            /* Premium Editorial Graphic Representation of Founder Mr. Pankaj Waghmare */
            <div className="w-full h-full bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#1E3A8A] p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute top-1/4 right-0 w-32 h-32 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />

              {/* Graphic Avatar */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3 pt-3">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 via-stone-800 to-blue-600 p-1 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="50" fill="#0F172A" />
                      <path d="M 25 38 C 25 20, 75 20, 75 38 C 75 30, 25 30, 25 38 Z" fill="#020617" />
                      <ellipse cx="50" cy="50" rx="22" ry="26" fill="#F59E0B" opacity="0.18" />
                      <rect x="30" y="40" width="16" height="12" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                      <rect x="54" y="40" width="16" height="12" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                      <line x1="46" y1="46" x2="54" y2="46" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M 38 60 Q 50 68 62 60" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 34 56 Q 50 78 66 56" fill="none" stroke="#475569" strokeWidth="3" />
                      <path d="M 20 85 L 35 68 L 50 82 L 65 68 L 80 85 Z" fill="#E53935" opacity="0.9" />
                      <path d="M 15 100 L 35 75 L 50 95 L 65 75 L 85 100 Z" fill="#1E3A8A" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md border-2 border-white">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[9px] uppercase font-poppins">
                    Lead Instructor
                  </div>
                  <h3 className="text-lg font-bold text-white font-marathi-calligraphy tracking-wide">
                    श्री. पंकज वाघमारे
                  </h3>
                  <p className="text-[11px] text-stone-300 font-poppins font-semibold">
                    Founder & CEO, AI Marathi Guru
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-stone-300 font-marathi-sub font-semibold px-2">
                <span>८,०००+ समाधानी विद्यार्थी</span>
                <span className="text-amber-400">४.९ ★★★★★</span>
              </div>
            </div>
          )}

          {/* Bottom Overlay Label */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-200/90 shadow-md">
            <div>
              <p className="text-xs font-black text-stone-900 font-marathi-title">श्री. पंकज वाघमारे</p>
              <p className="text-[10px] text-stone-500 font-marathi-sub font-semibold">Founder & CEO, AI Marathi Guru</p>
            </div>
            <div className="bg-[#E53935] text-white text-[9px] font-black px-2 py-1 rounded-md uppercase font-poppins tracking-wider shrink-0">
              LIVE
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-poppins font-bold text-stone-700 pt-0.5">
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
            <p className="text-[#E53935] text-xs font-black">2 HOURS</p>
            <p className="text-stone-500 text-[9px] font-marathi-sub font-semibold">Live Training</p>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
            <p className="text-blue-700 text-xs font-black">100% LIVE</p>
            <p className="text-stone-500 text-[9px] font-marathi-sub font-semibold">स्क्रीन शेअरिंग</p>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
            <p className="text-amber-700 text-xs font-black">मराठीत</p>
            <p className="text-stone-500 text-[9px] font-marathi-sub font-semibold">सोपी शिकवण</p>
          </div>
        </div>

      </div>
    </div>
  );
};
