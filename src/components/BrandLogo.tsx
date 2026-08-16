import React from 'react';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'emblem' | 'full';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  onClick,
}) => {
  if (variant === 'emblem') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`}
      >
        <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#0F172A] via-[#1E3A8A] to-[#0A192F] p-0.5 shadow-md group-hover:scale-105 transition-transform border border-amber-400/40 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer Decorative Gold Ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="42" fill="#0A192F" stroke="#D97706" strokeWidth="1.5" />
            
            {/* Brain/Circuit AI Motif */}
            <path d="M 30 50 Q 50 30 70 50 Q 50 70 30 50" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.6" />
            <circle cx="35" cy="45" r="2.5" fill="#3B82F6" />
            <circle cx="65" cy="45" r="2.5" fill="#3B82F6" />
            <circle cx="50" cy="62" r="3" fill="#F59E0B" />
            
            {/* AI Text inside */}
            <text x="50" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="Poppins, sans-serif">AI</text>
            <text x="50" y="58" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="800" fontFamily="'Noto Sans Devanagari', sans-serif">मराठी गुरू</text>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 font-marathi-title text-base leading-tight">
            AI <span className="text-[#E53935]">मराठी गुरू</span>
          </span>
          <span className="text-[10px] text-amber-600 font-extrabold font-poppins tracking-wider uppercase">
            Learn AI • Earn Smart
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
    >
      {/* Official Ribbon Brand Badge */}
      <div className="relative flex items-center justify-center">
        {/* Ribbon Shield Shape */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0A192F] text-white px-3 py-1.5 rounded-2xl border border-amber-400/50 shadow-md group-hover:shadow-lg transition-all flex items-center gap-2">
          
          {/* Graduation Cap & AI Chip Icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-inner font-bold text-xs shrink-0">
            <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              {/* Graduation Cap */}
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.8" />
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
              <span className="font-black text-white font-poppins text-base tracking-tight">AI</span>
              <span className="font-black text-[#E53935] font-marathi-accent text-base tracking-normal">मराठी गुरू</span>
            </div>
            <span className="text-[9px] font-bold text-amber-300/90 font-poppins tracking-widest uppercase mt-0.5">
              Learn AI • Earn Smart • Grow Fast
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
