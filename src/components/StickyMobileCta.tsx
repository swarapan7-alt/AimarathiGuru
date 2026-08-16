import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface StickyMobileCtaProps {
  onScrollToRegister: () => void;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({ onScrollToRegister }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-red-500 p-3 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-wide">
            LIMITED SEATS LEFT
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-slate-400 line-through text-xs font-bold">₹999</span>
            <span className="text-xl font-black text-red-600 font-poppins">₹199</span>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 rounded">80% OFF</span>
          </div>
        </div>

        <button
          onClick={onScrollToRegister}
          className="flex-1 bg-[#E53935] active:bg-[#D32F2F] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-full shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 font-poppins uppercase tracking-wider cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>REGISTER NOW</span>
        </button>
      </div>
    </div>
  );
};
