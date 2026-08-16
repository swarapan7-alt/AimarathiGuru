import React from 'react';
import { BookOpen, Sparkles, Palette, Zap, TrendingUp, ArrowRight } from 'lucide-react';

export const VisualJourneySection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'LEARN',
      marathi: 'AI ची बेसिक माहिती',
      desc: 'ChatGPT, Gemini व Jio AI मोबाईलवर शिकणे.',
      icon: BookOpen,
      color: 'bg-blue-600 text-white',
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'CREATE',
      marathi: 'मराठी कंटेंट निर्मिती',
      desc: 'मराठीत प्रॉम्ट देऊन पोस्ट, मेसेज व रील स्क्रिप्ट तयार करा.',
      icon: Sparkles,
      color: 'bg-emerald-600 text-white',
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'DESIGN',
      marathi: 'AI पोस्टर व व्हिडिओ',
      desc: '१ मिनिटात दुकानाचे पोस्टर व AI रील बनवा.',
      icon: Palette,
      color: 'bg-purple-600 text-white',
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'AUTOMATE',
      marathi: 'कामकाज सोपे करा',
      desc: 'व्हॉट्सॲप व सोशल मीडियावरील कामकाज ऑटोमेट करा.',
      icon: Zap,
      color: 'bg-amber-500 text-slate-950',
      badge: 'Step 4',
    },
    {
      step: '05',
      title: 'GROW',
      marathi: 'बिझनेस ग्रोथ',
      desc: 'ग्राहक, सेल्स आणि उत्पन्न जलद गतीने वाढवा.',
      icon: TrendingUp,
      color: 'bg-[#E53935] text-white',
      badge: 'Step 5',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0F172A] via-[#0A192F] to-[#0F172A] text-white border-b border-stone-800 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-widest">
            VISUAL LEARNING PATHWAY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-marathi-title">
            तुमचा <span className="font-marathi-accent text-[#E53935]">AI शिकण्याचा प्रवास</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-marathi-sub max-w-2xl mx-auto">
            ५ सोप्या पायऱ्यांमध्ये शिका, अंमलबजावणी करा आणि व्यवसायात यश मिळवा.
          </p>
        </div>

        {/* 5 Step Connected Visual Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl p-5 border border-stone-800 shadow-xl relative group hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-poppins text-slate-500 uppercase">
                      {item.badge}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white font-poppins tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-xs font-extrabold text-amber-300 font-marathi-sub mt-0.5">
                      {item.marathi}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 font-marathi-sub leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-poppins font-bold">
                  <span>STEP {item.step}</span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 hidden lg:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
