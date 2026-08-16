import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Video, Award, MessageCircle, HelpCircle } from 'lucide-react';

interface PricingSectionProps {
  fee?: number;
  oldPrice?: number;
  onScrollToRegister: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  fee = 199,
  oldPrice = 999,
  onScrollToRegister,
}) => {
  const inclusions = [
    { title: '2 Hours Live Interactive Training', desc: 'रविवारच्या बॅचमध्ये २ तासांचे प्रत्यक्ष स्क्रीन शेअरिंग' },
    { title: 'Marathi Explanation', desc: 'कोणताही तांत्रिक शब्द न वापरता सोप्या मराठीत सोपेीकरण' },
    { title: 'Practical Demo', desc: 'ChatGPT, Gemini, AI Poster & Video चा थेट वापर' },
    { title: 'Live Q&A Session', desc: 'क्लासच्या शेवटी सर्व शंकांचे थेट निरसन' },
    { title: 'Digital E-Certificate', desc: 'मास्टरक्लास यशस्वीरित्या पूर्ण केल्याचे अधिकृत प्रमाणपत्र' },
    { title: 'Official WhatsApp Community', desc: 'लाइव्ह लिंक, अपडेट्स आणि AI नोट्स मिळवण्यासाठी व्हॉट्सॲप ग्रुप' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-[#E53935] text-xs font-black uppercase tracking-widest border border-red-100">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-marathi-title">
            कोर्स फी आणि <span className="font-marathi-accent text-[#E53935]">विशेष ऑफर</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-marathi-sub max-w-xl mx-auto">
            कोणतीही लपवलेली फी नाही — फक्त ₹199 मध्ये परिपूर्ण प्रॅक्टिकल AI ज्ञान आणि प्रमाणपत्र!
          </p>
        </div>

        {/* Premium Pricing Card */}
        <div className="bg-white rounded-[36px] border-2 border-stone-200/90 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
          
          {/* Top Banner Tag */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs sm:text-sm font-black font-poppins uppercase tracking-wider text-amber-300">
                LIMITED SEATS OFFER (80% DISCOUNT)
              </span>
            </div>
            <span className="text-xs text-slate-300 font-marathi-sub font-bold">
              मर्यादित जागा उपलब्ध • प्रवेश त्वरित बंद होतील
            </span>
          </div>

          {/* Pricing Header Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-stone-100 pb-8 gap-6 text-center sm:text-left">
            <div>
              <p className="text-xs font-extrabold text-slate-500 font-marathi-sub uppercase tracking-wider mb-1">
                AI MARATHI GURU LIVE MASTERCLASS
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-marathi-title">
                २ तासांचे लाईव्ह प्रॅक्टिकल AI ट्रेनिंग
              </h3>
            </div>

            {/* Price Tag */}
            <div className="bg-red-50/80 p-4 sm:p-5 rounded-2xl border border-red-200 text-center shrink-0">
              <div className="text-xs text-slate-500 font-bold line-through mb-0.5">
                मूल्य: ₹{oldPrice}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#E53935] font-poppins">
                ₹{fee}
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                एकदाच भरणा (One Time)
              </span>
            </div>
          </div>

          {/* Inclusions Grid */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider font-poppins text-blue-900">
              कोर्स मध्ये समाविष्ट असलेल्या सुविधा (INCLUDED):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inclusions.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-900 font-marathi-title">{item.title}</h5>
                    <p className="text-xs text-slate-600 font-marathi-sub mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 text-center space-y-3">
            <button
              onClick={onScrollToRegister}
              className="w-full sm:w-auto bg-[#E53935] hover:bg-[#D32F2F] text-white font-black text-lg px-10 py-4.5 rounded-2xl transition shadow-xl shadow-red-600/25 active:scale-95 cursor-pointer font-poppins inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>₹{fee} मध्ये Register करा</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-bold font-marathi-sub pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> सुरक्षित ऑनलाइन भरणा
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-blue-600" /> डिजिटल सर्टिफिकेट समाविष्ट
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
