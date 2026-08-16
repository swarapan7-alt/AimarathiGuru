import React from 'react';
import {
  Sparkles,
  Bot,
  Smartphone,
  Zap,
  CheckCircle2,
  Instagram,
  Palette,
} from 'lucide-react';
import { InstructorPhoto } from './InstructorPhoto';

interface HeroSectionProps {
  onScrollToRegister: () => void;
  instructorPhoto?: string;
  communityLink?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToRegister,
  instructorPhoto = '',
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] text-stone-900 pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-stone-200/80">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Side: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Small Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-black uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>LIVE ONLINE TRAINING</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.2] font-marathi-title">
                AI मराठीत शिका. <br />
                <span className="text-[#E53935]">व्यवसायासाठी वापरा.</span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-stone-700 text-base sm:text-lg font-marathi-sub leading-relaxed max-w-2xl mx-auto lg:mx-0">
              फक्त <strong>२ तासांच्या Live Training</strong> मध्ये{' '}
              <span className="text-stone-900 font-bold">
                ChatGPT, Google Gemini, Jio + Google Gemini Benefits, Instagram
              </span>{' '}
              आणि AI Tools चा प्रत्यक्ष उपयोग समजून घ्या.
            </p>

            {/* Course Fee Highlight Card */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-3 p-3 sm:p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-stone-500 font-semibold font-marathi-sub">Course Fee:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#E53935] font-poppins">₹199</span>
                <span className="text-sm text-stone-400 line-through font-poppins font-medium">₹999</span>
              </div>
              <div className="h-5 w-px bg-stone-200 hidden sm:block" />
              <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#E53935] font-extrabold text-xs font-marathi-sub">
                🔥 मर्यादित जागा
              </span>
            </div>

            {/* Main CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToRegister}
                className="bg-[#E53935] hover:bg-[#D32F2F] text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-full transition-all shadow-lg shadow-red-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer font-poppins uppercase tracking-wider"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>✨ REGISTER NOW</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-bold text-stone-600 font-marathi-sub">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>१००% प्रॅक्टिकल स्क्रीन शेअरिंग</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>सोप्या मराठीत स्पष्टीकरण</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>मोबाईलवरूनही शिकता येईल</span>
              </span>
            </div>

          </div>

          {/* Right Side: Real Photo & Subtle Technology Badges */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Subtle Tech Badge 1: ChatGPT (Top Left) */}
            <div className="absolute -top-3 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200 shadow-lg z-20 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black text-stone-900 font-poppins">ChatGPT</p>
                <p className="text-[9px] text-stone-500 font-marathi-sub">मराठी उपयोग</p>
              </div>
            </div>

            {/* Subtle Tech Badge 2: Google Gemini (Top Right) */}
            <div className="absolute top-6 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200 shadow-lg z-20 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4 text-blue-700" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black text-stone-900 font-poppins">Google Gemini</p>
                <p className="text-[9px] text-stone-500 font-marathi-sub">Practical AI</p>
              </div>
            </div>

            {/* Subtle Tech Badge 3: Jio + Gemini Offer (Bottom Left) */}
            <div className="absolute -bottom-3 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200 shadow-lg z-20 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black text-stone-900 font-poppins">Jio + Gemini</p>
                <p className="text-[9px] text-stone-500 font-marathi-sub">₹349 Benefits</p>
              </div>
            </div>

            {/* Subtle Tech Badge 4: Posters & Instagram (Bottom Right) */}
            <div className="absolute -bottom-2 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-stone-200 shadow-lg z-20 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-black text-stone-900 font-poppins">Instagram AI</p>
                <p className="text-[9px] text-stone-500 font-marathi-sub">Business Growth</p>
              </div>
            </div>

            {/* Single Real Photo Card */}
            <InstructorPhoto photoUrl={instructorPhoto} />

          </div>

        </div>
      </div>
    </section>
  );
};
