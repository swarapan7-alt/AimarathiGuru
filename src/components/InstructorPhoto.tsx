import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Bot,
  Instagram,
  Smartphone,
  CheckCircle2,
  Zap,
  User,
  ShieldCheck,
} from 'lucide-react';

interface InstructorPhotoProps {
  photoUrl?: string;
  variant?: 'hero' | 'card';
  className?: string;
}

export const InstructorPhoto: React.FC<InstructorPhotoProps> = ({
  photoUrl,
  variant = 'hero',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Clean & sanitize photo URL
  const rawUrl = photoUrl ? photoUrl.trim() : '';
  
  // Resolve image source: prioritize valid URL/data, fallback gracefully
  const hasValidPhoto = rawUrl.length > 0 && !imageError;
  const imageSource = hasValidPhoto
    ? rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')
      ? rawUrl
      : `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}t=${Date.now()}`
    : '';

  // Compact format for Instructor Section Card
  if (variant === 'card') {
    return (
      <div className={`relative shrink-0 ${className}`}>
        {/* Soft 3D Glow behind portrait */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400/30 via-red-500/20 to-blue-500/30 rounded-3xl blur-md opacity-80 pointer-events-none" />

        {/* 3D Glassmorphic Portrait Frame */}
        <div className="relative w-28 h-36 sm:w-36 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-stone-100 border-2 border-amber-300/60 shadow-xl p-1.5 flex flex-col justify-between">
          <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900/90 relative flex items-center justify-center shadow-inner">
            {hasValidPhoto ? (
              <img
                src={imageSource}
                alt="श्री. पंकज वाघमारे (Mr. Pankaj Waghmare) - Master Trainer & Founder, AI Marathi Guru"
                loading="eager"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-stone-800 to-stone-950 text-amber-400">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-1">
                  <User className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-[11px] font-bold text-white font-marathi-title">श्री. पंकज वाघमारे</span>
                <span className="text-[9px] text-amber-400 font-poppins font-bold">Trainer</span>
              </div>
            )}
          </div>

          {/* Trainer Tag */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-center border border-amber-400/40 shadow-sm">
            <span className="text-[9px] font-black text-amber-300 font-poppins uppercase tracking-wider flex items-center justify-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-amber-400" /> Master Trainer
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Hero Variant: Prominent 3D composition with floating AI tech cards & ambient illumination
  return (
    <div className={`relative group max-w-sm sm:max-w-md mx-auto w-full select-none ${className}`}>
      
      {/* Multi-tier Ambient Glow Backdrop */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-amber-500/20 to-red-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Geometric Cyber-lines & Pulse Nodes */}
      <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heroCircuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <line x1="12%" y1="14%" x2="88%" y2="14%" stroke="url(#heroCircuitGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
        <line x1="88%" y1="14%" x2="88%" y2="86%" stroke="url(#heroCircuitGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
        <line x1="12%" y1="86%" x2="88%" y2="86%" stroke="url(#heroCircuitGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
        <line x1="12%" y1="14%" x2="12%" y2="86%" stroke="url(#heroCircuitGrad)" strokeWidth="1.2" strokeDasharray="4 4" />
        <circle cx="12%" cy="14%" r="3.5" fill="#EF4444" className="animate-pulse" />
        <circle cx="88%" cy="14%" r="3.5" fill="#38BDF8" className="animate-pulse" />
        <circle cx="88%" cy="86%" r="3.5" fill="#10B981" className="animate-pulse" />
        <circle cx="12%" cy="86%" r="3.5" fill="#F59E0B" className="animate-pulse" />
      </svg>

      {/* Floating Tech Badge 1: ChatGPT (Top Left) */}
      <div className="absolute -top-3.5 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-emerald-200/90 shadow-lg shadow-emerald-900/10 flex items-center gap-2 hover:scale-105 transition-all duration-300">
        <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-slate-900 font-poppins">ChatGPT</p>
          <p className="text-[9px] text-emerald-700 font-marathi-sub font-bold">मराठी प्रॉम्ट्स</p>
        </div>
      </div>

      {/* Floating Tech Badge 2: Google Gemini (Top Right) */}
      <div className="absolute top-6 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-blue-200/90 shadow-lg shadow-blue-900/10 flex items-center gap-2 hover:scale-105 transition-all duration-300">
        <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-slate-900 font-poppins">Google Gemini</p>
          <p className="text-[9px] text-blue-700 font-marathi-sub font-bold">Live AI Analysis</p>
        </div>
      </div>

      {/* Floating Tech Badge 3: Jio + Gemini (Bottom Left) */}
      <div className="absolute -bottom-3 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-indigo-200/90 shadow-lg shadow-indigo-900/10 flex items-center gap-2 hover:scale-105 transition-all duration-300">
        <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shadow-xs">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-slate-900 font-poppins">Jio + Gemini</p>
          <p className="text-[9px] text-indigo-700 font-marathi-sub font-bold">₹349 Benefits</p>
        </div>
      </div>

      {/* Floating Tech Badge 4: Instagram AI (Bottom Right) */}
      <div className="absolute -bottom-2.5 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-pink-200/90 shadow-lg shadow-pink-900/10 flex items-center gap-2 hover:scale-105 transition-all duration-300">
        <div className="w-7 h-7 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center shadow-xs">
          <Instagram className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-slate-900 font-poppins">Instagram AI</p>
          <p className="text-[9px] text-pink-700 font-marathi-sub font-bold">Business Growth</p>
        </div>
      </div>

      {/* Main 3D Card Container */}
      <div className="relative bg-gradient-to-b from-white/95 via-white/90 to-stone-50/95 backdrop-blur-md rounded-[32px] p-4 sm:p-5 shadow-2xl shadow-slate-900/15 border border-amber-300/60 overflow-hidden space-y-3.5 z-10">
        
        {/* Top Header Strip inside Card */}
        <div className="flex items-center justify-between border-b border-stone-200/70 pb-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-300/80 text-amber-950 font-extrabold uppercase font-poppins text-[10px] tracking-wider shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Master Trainer</span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 font-marathi-sub flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Training Guidance</span>
          </span>
        </div>

        {/* Real Photo Portrait Frame */}
        <div className="relative aspect-[4/4.9] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-slate-950 border border-stone-300 shadow-inner flex items-center justify-center">
          {hasValidPhoto ? (
            <img
              src={imageSource}
              alt="श्री. पंकज वाघमारे (Mr. Pankaj Waghmare) - Founder & CEO, AI Marathi Guru"
              loading="eager"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-stone-900 to-slate-950 text-amber-400 space-y-2.5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                <User className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-marathi-title">श्री. पंकज वाघमारे</p>
                <p className="text-xs text-amber-400 font-poppins font-bold mt-0.5">Founder & Master Trainer</p>
              </div>
              <p className="text-[10px] text-slate-400 font-marathi-sub max-w-[200px]">
                AI Marathi Guru
              </p>
            </div>
          )}

          {/* Bottom Overlay Label with Calligraphy Name & English Title */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-amber-400/40 shadow-xl">
            <div>
              <p className="text-xs sm:text-sm font-black text-white font-marathi-calligraphy tracking-wide">
                श्री. पंकज वाघमारे
              </p>
              <p className="text-[10px] text-amber-300/90 font-poppins font-bold">
                Mr. Pankaj Waghmare • Founder & CEO
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-[9px] font-black uppercase font-poppins tracking-wider shadow-md shrink-0">
              <Zap className="w-2.5 h-2.5 fill-white" />
              <span>LIVE AI</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-poppins font-bold text-slate-800 pt-0.5">
          <div className="p-2 rounded-xl bg-white border border-stone-200/90 shadow-xs">
            <p className="text-[#DC2626] text-xs font-black">2 HOURS</p>
            <p className="text-slate-500 text-[9px] font-marathi-sub font-bold">Live Training</p>
          </div>
          <div className="p-2 rounded-xl bg-white border border-stone-200/90 shadow-xs">
            <p className="text-blue-700 text-xs font-black">100% LIVE</p>
            <p className="text-slate-500 text-[9px] font-marathi-sub font-bold">स्क्रीन शेअरिंग</p>
          </div>
          <div className="p-2 rounded-xl bg-white border border-stone-200/90 shadow-xs">
            <p className="text-amber-700 text-xs font-black">मराठीत</p>
            <p className="text-slate-500 text-[9px] font-marathi-sub font-bold">सोपी शिकवण</p>
          </div>
        </div>

      </div>
    </div>
  );
};
