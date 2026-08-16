import React from 'react';
import { Clock, TrendingUp, Sparkles, Megaphone, Cpu, Award } from 'lucide-react';

const BENEFITS = [
  {
    title: 'वेळेची बचत (Save Time)',
    desc: '३ तासांचे काम फक्त ५ मिनिटात AI च्या मदतीने पूर्ण करा.',
    icon: Clock,
    metric: '90% Fast Work',
  },
  {
    title: 'उत्पन्नात वाढ (Increase Income)',
    desc: 'ग्राहकांना नवीन AI सेवा देऊन व्यवसायाची कमाई दुप्पट करा.',
    icon: TrendingUp,
    metric: '2x Revenue Potential',
  },
  {
    title: 'प्रोफेशनल कंटेंट (Professional Content)',
    desc: 'बिना कोणत्याही डिझाईनरशिवाय आकर्षक व्हिडिओ व पोस्टर्स तयार करा.',
    icon: Sparkles,
    metric: 'HD Quality Graphics',
  },
  {
    title: 'AI मार्केटिंग (AI Marketing)',
    desc: 'सोशल मीडियावर आपोआप जाहिराती व ऑटोमॅटिक रील्स पोस्ट करा.',
    icon: Megaphone,
    metric: 'Smart Social Reach',
  },
  {
    title: 'बिजनेस ऑटोमेशन (Business Automation)',
    desc: 'कस्टमर रिप्लाय, ई-मेल्स व व्हॉट्सॲप मेसेजिंग ऑटोमेट करा.',
    icon: Cpu,
    metric: 'Auto-Pilot Mode',
  },
  {
    title: 'डिजिटल स्किल्स (Digital Skills)',
    desc: '२६व्या शतकातील सर्वात मागणी असणारे AI कौशल्य मराठीत आत्मसात करा.',
    icon: Award,
    metric: 'Future-Proof Skill',
  },
];

export const StudentBenefits: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-red-950/80 px-3.5 py-1.5 rounded-full border border-red-800/50">
            PROVEN IMPACT
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-marathi-title">
            या कोर्सचे <span className="text-red-500">मुख्य फायदे (Student Benefits)</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-marathi-sub max-w-xl mx-auto">
            हा कोर्स पूर्ण केल्यानंतर तुमच्या कामात आणि व्यवसायात होणारे ६ मोठे बदल:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md hover:border-red-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-1 rounded-full">
                    {item.metric}
                  </span>
                </div>

                <h3 className="font-bold text-xl text-white font-marathi-title">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-marathi-sub leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 font-medium">
                ✓ १०००+ विद्यार्थ्यांद्वारे सत्यापित
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
