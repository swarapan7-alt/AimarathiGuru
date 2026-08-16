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
  Camera,
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

  // Clean and validate photo URL
  const trimmedUrl = photoUrl ? photoUrl.trim() : '';
  const hasValidPhoto = trimmedUrl.length > 0 && !imageError;

  // Add cache buster for relative URLs (not needed for data: base64 URLs)
  const imageSource = hasValidPhoto
    ? trimmedUrl.startsWith('data:') || trimmedUrl.startsWith('blob:')
      ? trimmedUrl
      : `${trimmedUrl}${trimmedUrl.includes('?') ? '&' : '?'}v=${Date.now()}`
    : '';

  // Small compact format for the Instructor Card
  if (variant === 'card') {
    return (
      <div className={`relative shrink-0 ${className}`}>
        {/* Soft Ambient Warm/Gold Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-200/50 via-stone-200/40 to-blue-200/40 rounded-3xl blur-md opacity-70 pointer-events-none" />

        {/* Small Professional Portrait Frame */}
        <div className="relative w-28 h-36 sm:w-32 sm:h-44 rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md p-1">
          <div className="w-full h-full rounded-xl overflow-hidden bg-stone-100 relative flex items-center justify-center">
            {hasValidPhoto ? (
              <img
                src={imageSource}
                alt="श्री. पंकज वाघमारे (Mr. Pankaj Waghmare) - Master Trainer, AI Marathi Guru"
                loading="eager"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-[1.01] contrast-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-100 text-stone-400">
                <User className="w-8 h-8 text-stone-400 mb-1" />
                <span className="text-[10px] font-bold text-stone-500 font-poppins">Trainer Photo</span>
              </div>
            )}
          </div>
          
          {/* Trainer Mini Tag */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-center border border-stone-200/80 shadow-xs">
            <span className="text-[9px] font-black text-stone-900 font-poppins uppercase tracking-wider">
              Trainer
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Hero Variant: Large, prominent, right-side composition with subtle AI technology graphics
  return (
    <div className={`relative group max-w-sm sm:max-w-md mx-auto w-full ${className}`}>
      
      {/* Soft Background Glows (Multi-layer ambient light) */}
      <div className="absolute -top-6 -right-6 w-52 h-52 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-52 h-52 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Connection Lines & Pulse Nodes */}
      <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heroCircuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E53935" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <line x1="15%" y1="12%" x2="85%" y2="12%" stroke="url(#heroCircuitGrad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="85%" y1="12%" x2="85%" y2="88%" stroke="url(#heroCircuitGrad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="15%" y1="88%" x2="85%" y2="88%" stroke="url(#heroCircuitGrad)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="15%" y1="12%" x2="15%" y2="88%" stroke="url(#heroCircuitGrad)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="15%" cy="12%" r="3.5" fill="#E53935" className="animate-pulse" />
        <circle cx="85%" cy="12%" r="3.5" fill="#3B82F6" className="animate-pulse" />
        <circle cx="85%" cy="88%" r="3.5" fill="#10B981" className="animate-pulse" />
        <circle cx="15%" cy="88%" r="3.5" fill="#F59E0B" className="animate-pulse" />
      </svg>

      {/* Minimal Floating Tech Badge 1: ChatGPT (Top Left) */}
      <div className="absolute -top-3 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200/90 shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-300">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-stone-900 font-poppins">ChatGPT</p>
          <p className="text-[9px] text-stone-500 font-marathi-sub font-semibold">मराठी प्रॉम्ट्स</p>
        </div>
      </div>

      {/* Minimal Floating Tech Badge 2: Google Gemini (Top Right) */}
      <div className="absolute top-6 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200/90 shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-300">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-stone-900 font-poppins">Google Gemini</p>
          <p className="text-[9px] text-stone-500 font-marathi-sub font-semibold">Live AI Analysis</p>
        </div>
      </div>

      {/* Minimal Floating Tech Badge 3: Jio + Gemini (Bottom Left) */}
      <div className="absolute -bottom-3 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200/90 shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-300">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/70 flex items-center justify-center shadow-xs">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-stone-900 font-poppins">Jio + Gemini</p>
          <p className="text-[9px] text-stone-500 font-marathi-sub font-semibold">₹349 Benefits</p>
        </div>
      </div>

      {/* Minimal Floating Tech Badge 4: Instagram AI (Bottom Right) */}
      <div className="absolute -bottom-2 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200/90 shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-300">
        <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-700 border border-pink-200/70 flex items-center justify-center shadow-xs">
          <Instagram className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-black text-stone-900 font-poppins">Instagram AI</p>
          <p className="text-[9px] text-stone-500 font-marathi-sub font-semibold">Business Growth</p>
        </div>
      </div>

      {/* Main Rounded Premium Image Frame & Glassmorphism Container */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-[32px] p-4 sm:p-5 shadow-xl shadow-stone-200/70 border border-stone-200/90 overflow-hidden space-y-3.5 z-10">
        
        {/* Top Header Strip inside Card */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 font-extrabold uppercase font-poppins text-[10px] tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Master Trainer</span>
          </div>
          <span className="text-[11px] font-bold text-stone-600 font-marathi-sub flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Training Guidance</span>
          </span>
        </div>

        {/* Real Photo Portrait Container (No stretch, natural face focus, object-cover) */}
        <div className="relative aspect-[4/4.9] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner flex items-center justify-center">
          {hasValidPhoto ? (
            <img
              src={imageSource}
              alt="श्री. पंकज वाघमारे (Mr. Pankaj Waghmare) - Founder & CEO, AI Marathi Guru"
              loading="eager"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter brightness-[1.01] contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-50 text-stone-500 space-y-2">
              <div className="w-14 h-14 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-400">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-700 font-marathi-title">श्री. पंकज वाघमारे</p>
                <p className="text-[11px] text-stone-400 font-poppins mt-0.5">Official Instructor Photo</p>
              </div>
              <p className="text-[10px] text-stone-400 font-marathi-sub max-w-[200px]">
                Admin Panel → Website Appearance मधून फोटो अपलोड करा
              </p>
            </div>
          )}

          {/* Bottom Overlay Label with Calligraphy Name & English Name */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/90 shadow-md">
            <div>
              <p className="text-xs sm:text-sm font-black text-stone-900 font-marathi-calligraphy">
                श्री. पंकज वाघमारे
              </p>
              <p className="text-[10px] text-stone-600 font-poppins font-semibold">
                Mr. Pankaj Waghmare • Founder & CEO
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E53935] text-white text-[9px] font-black uppercase font-poppins tracking-wider shadow-xs shrink-0">
              <Zap className="w-2.5 h-2.5 fill-white" />
              <span>LIVE AI</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges (2 Hours, 100% Live, Marathi) */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-poppins font-bold text-stone-700 pt-0.5">
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/70">
            <p className="text-[#E53935] text-xs font-black">2 HOURS</p>
            <p className="text-stone-500 text-[9px] font-marathi-sub font-semibold">Live Training</p>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/70">
            <p className="text-blue-700 text-xs font-black">100% LIVE</p>
            <p className="text-stone-500 text-[9px] font-marathi-sub font-semibold">स्क्रीन शेअरिंग</p>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/70">
            <p className="text-amber-700 text-xs font-black">मराठीत</p>
            <p className="text-stone-500 text-[9px] font-marathi-sub font-semibold">सोपी शिकवण</p>
          </div>
        </div>

      </div>
    </div>
  );
};
