import React from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] text-stone-900 pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-stone-200/80">
      
      {/* Background 3D Depth Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/40 via-red-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/50 via-indigo-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Side: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Small 3D Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border border-amber-300/80 text-amber-950 text-xs font-black uppercase tracking-wider shadow-sm font-poppins">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>LIVE AI MASTERCLASS</span>
            </div>

            {/* Main Heading: AI मराठीत शिका. व्यवसायासाठी वापरा. */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 leading-[1.2] font-marathi-title tracking-tight">
                AI मराठीत शिका. <br />
                <span className="text-[#DC2626] font-marathi-calligraphy font-bold drop-shadow-xs">
                  व्यवसायासाठी वापरा.
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-stone-700 text-base sm:text-lg font-marathi-sub leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              फक्त <strong>२ तासांच्या Live Training</strong> मध्ये{' '}
              <span className="text-stone-950 font-bold">
                ChatGPT, Google Gemini, Jio + Google Gemini Benefits, Instagram AI
              </span>{' '}
              आणि स्मार्ट टूल्सचा व्यवसाय व नोकरीसाठी प्रत्यक्ष उपयोग शिका.
            </p>

            {/* Course Fee Highlight Card */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-3 p-3.5 sm:p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-300/60 shadow-md shadow-stone-200/50">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-stone-500 font-bold font-marathi-sub">Course Fee:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#DC2626] font-poppins">₹199</span>
                <span className="text-sm text-stone-400 line-through font-poppins font-semibold">₹999</span>
              </div>
              <div className="h-6 w-px bg-stone-200 hidden sm:block" />
              <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#DC2626] font-extrabold text-xs font-marathi-sub flex items-center gap-1">
                🔥 मर्यादित जागा उपलब्ध
              </span>
            </div>

            {/* Main CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToRegister}
                className="bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#DC2626] hover:brightness-110 text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-full transition-all shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer font-poppins uppercase tracking-wider border border-white/20"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>REGISTER NOW</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-bold text-stone-700 font-marathi-sub">
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
                <span>मोबाईलवरूनही सहज शिकता येईल</span>
              </span>
            </div>

          </div>

          {/* Right Side: Professional 3D Instructor Composition */}
          <div className="lg:col-span-5 flex justify-center">
            <InstructorPhoto
              photoUrl={instructorPhoto}
              variant="hero"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
