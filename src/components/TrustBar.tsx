import React from 'react';
import { Video, Languages, Laptop, MessageCircle, DollarSign } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: Video,
      title: 'LIVE TRAINING',
      subtitle: '2 Hours Interactive',
      color: 'bg-red-50 text-[#E53935] border-red-100',
    },
    {
      icon: Languages,
      title: 'MARATHI',
      subtitle: 'Simple Explanation',
      color: 'bg-blue-50 text-[#1E3A8A] border-blue-100',
    },
    {
      icon: Laptop,
      title: 'PRACTICAL',
      subtitle: 'Live Demonstration',
      color: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      icon: DollarSign,
      title: '₹199',
      subtitle: 'Affordable Learning',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      icon: MessageCircle,
      title: 'WHATSAPP',
      subtitle: 'Community Support',
      color: 'bg-teal-50 text-teal-700 border-teal-100',
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-6 sm:py-8 shadow-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {trustItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 border border-stone-200 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 font-poppins">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-600 font-marathi-sub">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
