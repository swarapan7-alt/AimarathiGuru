import React from 'react';
import { Smartphone, Zap, Languages, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const JioAiSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-stone-900 text-white border-b border-stone-800 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Graphic: Clean Smartphone & Jio AI Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-stone-800 to-stone-950 p-5 rounded-[32px] border border-stone-700/80 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white font-poppins">Jio AI Mobile Interface</h4>
                    <p className="text-[10px] text-slate-400 font-marathi font-bold">भारतीय भाषांसाठी AI</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SMARTPHONE
                </span>
              </div>

              {/* Mock Screen Display */}
              <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Jio Voice AI (मराठी)
                  </span>
                  <span className="text-[10px] text-stone-400">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-300 font-marathi-sub space-y-1.5">
                  <p className="text-[11px] font-bold text-amber-300">🎙️ "माझ्या शेतीसाठी/दुकानासाठी AI वापर सांगा"</p>
                  <p className="text-[11px] text-stone-200">
                    ✨ <strong>उत्तर:</strong> १) हवामान व बाजारभाव अपडेट्स, २) ग्राहकांसाठी व्हॉट्सॲप मेसेज, ३) डिजिटल हिशोब.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 font-marathi-sub font-bold">
                <span>● 100% Free Mobile Usage</span>
                <span>● Easy Marathi Voice</span>
              </div>

            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <Languages className="w-3.5 h-3.5" /> BHARAT AI TOOLS
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black font-marathi-title text-white">
                <span className="font-marathi-accent text-emerald-400">Jio AI बद्दल थोडक्यात माहिती</span>
              </h2>
              <p className="text-stone-300 text-sm sm:text-base font-marathi-sub leading-relaxed">
                भारतीय वापरकर्त्यांसाठी बनवलेल्या Jio AI आणि स्थानिक AI टूल्सचा वापर करून दैनंदिन कामे अधिक जलद आणि सुलभ कशी करायची ते या वर्कशॉपमध्ये सोप्या भाषेत शिकवले जाईल.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-200 font-marathi-sub font-extrabold">
                  मराठी व्हॉईस कमांड्स द्वारे AI चा वापर
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-200 font-marathi-sub font-extrabold">
                  स्मार्टफोनवर सहज चालणारे मोफत टूल्स
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-200 font-marathi-sub font-extrabold">
                  रोजच्या सरकारी/खाजगी कामांत मदत
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-200 font-marathi-sub font-extrabold">
                  सर्वसामान्यांसाठी उपयुक्त प्रॅक्टिकल वापर
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
