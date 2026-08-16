import React from 'react';
import { MessageCircle } from 'lucide-react';

export const StickyWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/919801555171?text=Hi%20AI%20Marathi%20Guru%2C%20मला%20कोर्सबद्दल%20अधिक%20माहिती%20हवी%20आहे."
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Support"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-600/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ring-4 ring-emerald-500/20 group cursor-pointer"
      title="WhatsApp वर प्रश्न विचारा (9801555171)"
    >
      <MessageCircle className="w-7 h-7 fill-white text-emerald-500 group-hover:rotate-12 transition-transform" />
      <span className="absolute right-16 top-2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        WhatsApp मदत (9801555171)
      </span>
    </a>
  );
};
