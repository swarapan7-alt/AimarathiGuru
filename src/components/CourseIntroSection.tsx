import React from 'react';
import { CheckCircle2, Sparkles, Smartphone, Award, Cpu, ShieldCheck } from 'lucide-react';

interface CourseIntroSectionProps {
  onScrollToRegister?: () => void;
}

export const CourseIntroSection: React.FC<CourseIntroSectionProps> = ({ onScrollToRegister }) => {
  return (
    <section id="course-info" className="py-16 sm:py-24 bg-white border-b border-stone-200 relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Badge & Heading */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-black uppercase tracking-widest border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" /> EASY AI LEARNING
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-marathi-title">
            <span className="font-marathi-accent text-[#E53935]">AI आता अवघड नाही!</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-marathi-sub max-w-2xl mx-auto">
            तंत्रज्ञानाची कोणतीही पूर्व माहिती नसताना सोप्या मराठी भाषेत मोबाईलवर AI वापरणे शिका.
          </p>
        </div>

        {/* Premium Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Professional AI Graphic Card & Workflow Visual */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[32px] p-6 sm:p-8 text-white shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden">
              
              {/* Graphic Decorative Rings */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E53935] flex items-center justify-center text-white font-black text-sm shadow-md">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white font-marathi-title">AI Engine Workflow</h4>
                    <p className="text-[10px] text-slate-400 font-poppins">Live Interactive Masterclass</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  ● LIVE DEMO
                </span>
              </div>

              {/* Graphic Process Visual */}
              <div className="space-y-3 pt-2">
                
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</span>
                    <div>
                      <p className="text-xs font-bold text-white font-marathi-title">मराठीत प्रश्न किंवा कमांड द्या</p>
                      <p className="text-[10px] text-slate-400">ChatGPT / Gemini वर सोप्या मराठी भाषेत बोलून किंवा टाईप करून</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">Prompting</span>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#E53935] text-white font-black text-xs flex items-center justify-center">2</span>
                    <div>
                      <p className="text-xs font-bold text-white font-marathi-title">१ सेकंदात उत्तर व कंटेंट जनरेट करा</p>
                      <p className="text-[10px] text-slate-400">पत्र, अर्ज, जाहिरात मजकूर, बिझनेस आयडिया व रील स्क्रिप्ट</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Instant AI</span>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
                    <div>
                      <p className="text-xs font-bold text-white font-marathi-title">एचडी जाहिरात पोस्टर व रील व्हिडिओ निर्मिती</p>
                      <p className="text-[10px] text-slate-400">मोबाईलवरून १ मिनिटात दुकानाचे पोस्टर व रील तयार करा</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300">Poster/Video</span>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-marathi-sub font-medium">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-4 h-4" /> 100% Practical Mobile Friendly
                </span>
                <span className="text-slate-400">No Coding Needed</span>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative & Key Checkmarks */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-marathi-title leading-snug">
                तंत्रज्ञान आणि AI आता तुमच्या स्वतःच्या <span className="text-[#1E3A8A]">मराठी भाषेत!</span>
              </h3>
              
              <p className="text-base sm:text-lg text-slate-700 font-marathi-sub leading-relaxed">
                AI चा योग्य वापर शिकण्यासाठी तुम्हाला Technical Background ची गरज नाही. या Live Session मध्ये AI Tools प्रत्यक्ष वापरून दाखवले जातील.
              </p>
            </div>

            {/* 5 Checkmark Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-marathi-title">Beginner Friendly</h4>
                  <p className="text-xs text-slate-600 font-marathi-sub mt-0.5">
                    कोणताही पूर्वानुभव किंवा तांत्रिक ज्ञानाची अट नाही.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-marathi-title">Marathi Explanation</h4>
                  <p className="text-xs text-slate-600 font-marathi-sub mt-0.5">
                    अतिशय साध्या व सोप्या मराठी भाषेत परिपूर्ण मार्गदर्शन.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-marathi-title">Practical Demo</h4>
                  <p className="text-xs text-slate-600 font-marathi-sub mt-0.5">
                    थेट स्क्रीन शेअर करून प्रत्येक टूलचा प्रत्यक्ष वापर.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-marathi-title">Mobile Friendly</h4>
                  <p className="text-xs text-slate-600 font-marathi-sub mt-0.5">
                    लॅपटॉप नसला तरी स्मार्टफोनवरून सहज शिकता येईल.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 sm:col-span-2 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-marathi-title">Business Use Cases</h4>
                  <p className="text-xs text-slate-600 font-marathi-sub mt-0.5">
                    व्यवसायात सेल्स, मार्केटिंग, ग्राहक संवाद व सोशल मीडिया वाढवण्यासाठी थेट उपयोग.
                  </p>
                </div>
              </div>

            </div>

            {/* Sub CTA Button */}
            {onScrollToRegister && (
              <div className="pt-2">
                <button
                  onClick={onScrollToRegister}
                  className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition shadow-md shadow-blue-900/20 active:scale-95 cursor-pointer"
                >
                  ₹199 मध्ये Live Batch Join करा →
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
