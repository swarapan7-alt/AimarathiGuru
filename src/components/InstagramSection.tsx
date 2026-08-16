import React from 'react';
import { Instagram, Video, Sparkles, TrendingUp, CheckCircle2, UserCheck, Flame } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  const instagramModules = [
    {
      title: 'Instagram Account Setup',
      subtitle: 'प्रोफेशनल बिझनेस / क्रिएटर अकाउंट तयार करणे',
      icon: UserCheck,
    },
    {
      title: 'Profile Basics & Bio',
      subtitle: 'AI ने लिहिलेली आकर्षक बायो आणि हायलाईट्स',
      icon: Sparkles,
    },
    {
      title: 'AI Content Ideas',
      subtitle: '१ मिनिटात महिन्याभराच्या पोस्ट व रील कल्पना',
      icon: Flame,
    },
    {
      title: 'AI Content Creation',
      subtitle: 'चेहरा न दाखवता व्हॉईसओव्हरसह रील व्हिडिओ',
      icon: Video,
    },
    {
      title: 'Reels Viral Strategy',
      subtitle: 'व्हायरल ट्रेंड्स, म्युझिक आणि हॅशटॅग ट्रिक्स',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-16 sm:py-22 bg-gradient-to-b from-stone-50 via-white to-pink-50/40 border-b border-stone-200 relative overflow-hidden">
      
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-50 text-pink-700 text-xs font-black uppercase tracking-widest border border-pink-200">
            <Instagram className="w-3.5 h-3.5 text-pink-600" /> INSTAGRAM REELS & GROWTH
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-marathi-title">
            <span className="font-marathi-accent text-pink-600">Instagram & AI रील निर्मिती</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-marathi-sub max-w-2xl mx-auto">
            कॅमेरा समोर न येता AI चा वापर करून इन्स्टाग्रामवर फॉलोअर्स व व्यवसाय कसा वाढवायचा ते शिका!
          </p>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {instagramModules.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 font-marathi-title group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-marathi-sub leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-extrabold text-emerald-700 font-marathi-sub">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Practical
                  </span>
                  <span className="text-stone-400 font-mono">0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
