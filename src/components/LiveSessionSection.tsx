import React from 'react';
import {
  Laptop,
  Clock,
  GraduationCap,
  MessageCircle,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface LiveSessionSectionProps {
  onScrollToRegister?: () => void;
}

export const LiveSessionSection: React.FC<LiveSessionSectionProps> = ({ onScrollToRegister }) => {
  const highlights = [
    {
      icon: Laptop,
      title: 'Online Live Session',
      subtitle: 'Google Meet वर थेट ऑनलाईन क्लास',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    },
    {
      icon: Clock,
      title: 'Duration: 2 Hours',
      subtitle: '२ तास थेट प्रात्यक्षिकासह टू-द-पॉइंट माहिती',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    {
      icon: GraduationCap,
      title: 'Beginner Friendly',
      subtitle: 'कोणत्याही कोडिंग किंवा पूर्वज्ञानाची गरज नाही',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    {
      icon: MessageCircle,
      title: 'मराठीत शिकवणी',
      subtitle: '१००% सोप्या, स्पष्ट आणि सहज मराठी भाषेत',
      iconBg: 'bg-red-50 text-[#E53935] border-red-200/80',
    },
    {
      icon: Smartphone,
      title: 'Mobile वरूनही Join करता येईल',
      subtitle: 'लॅपटॉप नसला तरी स्मार्टफोनवरून सहज शिकता येते',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-black uppercase tracking-wider font-poppins shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>WORKSHOP HIGHLIGHTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-marathi-title">
            फक्त २ तासांची <span className="text-[#E53935]">Practical Live Training</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg font-marathi-sub">
            थेट स्क्रीन शेअरिंगसह प्रत्यक्ष वापर आणि सोपे मार्गदर्शन
          </p>
        </div>

        {/* 5 Clean Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-xs ${item.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-marathi-title leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 font-marathi-sub leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
