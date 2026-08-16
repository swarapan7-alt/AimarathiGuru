import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onScrollToRegister: () => void;
  fee?: number;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onScrollToRegister,
  fee = 199,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-[#E53935] text-xs font-black uppercase tracking-wider font-poppins">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN TODAY</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-marathi-title leading-tight">
          AI शिकण्याची सुरुवात <span className="text-[#E53935]">आजच करा!</span>
        </h2>

        <p className="text-stone-700 text-base sm:text-lg font-marathi-sub max-w-xl mx-auto">
          फक्त <strong className="text-stone-900">₹{fee}</strong> मध्ये २ तासांची <strong>Practical Live Training</strong>.
        </p>

        <div className="pt-2">
          <button
            onClick={onScrollToRegister}
            className="bg-[#E53935] hover:bg-[#D32F2F] text-white font-extrabold text-base sm:text-lg px-9 py-4 rounded-full transition-all shadow-lg shadow-red-500/25 hover:shadow-xl hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2.5 cursor-pointer font-poppins uppercase tracking-wider"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>REGISTER NOW</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
