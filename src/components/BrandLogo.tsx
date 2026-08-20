import React from 'react';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'emblem' | 'compact' | 'full';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  onClick,
}) => {
  // Pure 3D AI Emblem Medallion
  const renderEmblem = (sizeClass = 'w-10 h-10 sm:w-11 sm:h-11') => (
    <div className={`relative ${sizeClass} shrink-0 select-none group/emblem`}>
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-red-500/30 to-blue-500/40 blur-sm opacity-80 group-hover/emblem:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* 3D Glassmorphic Outer Shield */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#090D16] p-0.5 shadow-lg shadow-black/40 border border-amber-400/40 overflow-hidden flex items-center justify-center">
        {/* Subtle internal top light highlight */}
        <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm">
          <defs>
            {/* Gold metallic gradient */}
            <linearGradient id="brandGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* AI Ruby Red Gradient */}
            <linearGradient id="brandRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>

            {/* Cyber Sapphire Gradient */}
            <linearGradient id="brandCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* 3D Inner Shadow Filter */}
            <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
              <feFlood floodColor="#F59E0B" floodOpacity="0.3" />
              <feComposite in2="shadowDiff" operator="in" />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal / Shield Geometric Frame */}
          <polygon
            points="50,6 90,26 90,74 50,94 10,74 10,26"
            fill="none"
            stroke="url(#brandGoldGrad)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Accent Ring */}
          <circle cx="50" cy="50" r="32" fill="#0A1120" stroke="url(#brandCyanGrad)" strokeWidth="1" opacity="0.7" />

          {/* AI Neural Nodes / Synapses */}
          <g stroke="url(#brandCyanGrad)" strokeWidth="1.2" opacity="0.8">
            <line x1="50" y1="28" x2="32" y2="44" />
            <line x1="50" y1="28" x2="68" y2="44" />
            <line x1="32" y1="44" x2="38" y2="66" />
            <line x1="68" y1="44" x2="62" y2="66" />
            <line x1="38" y1="66" x2="50" y2="76" />
            <line x1="62" y1="66" x2="50" y2="76" />
            <line x1="32" y1="44" x2="68" y2="44" strokeDasharray="2 2" opacity="0.5" />
          </g>

          {/* Node Glowing Dots */}
          <circle cx="50" cy="28" r="3" fill="#FDE68A" />
          <circle cx="32" cy="44" r="2.8" fill="#38BDF8" />
          <circle cx="68" cy="44" r="2.8" fill="#38BDF8" />
          <circle cx="38" cy="66" r="2.8" fill="#F59E0B" />
          <circle cx="62" cy="66" r="2.8" fill="#F59E0B" />
          <circle cx="50" cy="76" r="3" fill="#EF4444" />

          {/* Center Stylized 'ज्ञा' / Brain / Graduation Motif */}
          {/* Graduation Cap Peak / Learning Crest */}
          <path
            d="M 50 36 L 70 46 L 50 56 L 30 46 Z"
            fill="url(#brandGoldGrad)"
            opacity="0.95"
          />
          {/* Central AI core letter */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#090D16"
            fontSize="10"
            fontWeight="900"
            fontFamily="Poppins, sans-serif"
          >
            AI
          </text>

          {/* Bottom Marathi Calligraphic Accent curve */}
          <path
            d="M 36 62 Q 50 72 64 62"
            fill="none"
            stroke="url(#brandRedGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );

  // Variant: Emblem only (circular/shield icon)
  if (variant === 'emblem') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      >
        {renderEmblem('w-11 h-11')}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span className="font-black text-slate-900 font-poppins text-base tracking-tight">AI</span>
            <span className="font-extrabold text-[#DC2626] font-marathi-accent text-base tracking-tight">मराठी गुरू</span>
          </div>
          <span className="text-[9px] text-amber-700 font-extrabold font-poppins tracking-wider uppercase mt-0.5">
            Learn AI • Earn Smart
          </span>
        </div>
      </div>
    );
  }

  // Variant: Compact (Sidebar, Admin header)
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
      >
        {renderEmblem('w-9 h-9')}
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1">
            <span className="font-black text-white font-poppins text-sm tracking-tight">AI</span>
            <span className="font-black text-[#EF4444] font-marathi-accent text-sm tracking-tight">मराठी गुरू</span>
          </div>
          <span className="text-[8px] font-bold text-amber-400 font-poppins tracking-widest uppercase mt-0.5">
            Learn • Earn • Grow
          </span>
        </div>
      </div>
    );
  }

  // Variant: Footer (High contrast dark theme)
  if (variant === 'footer' || variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      >
        {renderEmblem('w-12 h-12')}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-white font-poppins text-lg tracking-tight">AI</span>
            <span className="font-black text-[#EF4444] font-marathi-accent text-lg tracking-tight">मराठी गुरू</span>
          </div>
          <span className="text-[10px] font-extrabold text-amber-400 font-poppins tracking-widest uppercase mt-1">
            LEARN AI • EARN SMART • GROW FAST
          </span>
        </div>
      </div>
    );
  }

  // Default: Header Brand Badge (Light/Frosted header)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* 3D Emblem */}
      {renderEmblem('w-10 h-10 sm:w-11 sm:h-11')}

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="font-black text-slate-950 font-poppins text-base sm:text-lg tracking-tight">
            AI
          </span>
          <span className="font-black text-[#DC2626] font-marathi-accent text-base sm:text-lg tracking-tight drop-shadow-xs">
            मराठी गुरू
          </span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-amber-100/90 border border-amber-300/80 text-amber-900 text-[9px] font-black font-poppins uppercase tracking-wider shadow-xs">
            Masterclass
          </span>
        </div>
        
        <span className="text-[8.5px] sm:text-[9.5px] font-black text-amber-600 font-poppins tracking-wider sm:tracking-widest uppercase">
          LEARN AI • EARN SMART • GROW FAST
        </span>
      </div>
    </div>
  );
};
