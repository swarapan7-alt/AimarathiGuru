import React, { useState } from 'react';
import { Sparkles, Search, Users, Menu, X, BookOpen, User, Eye, HelpCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onScrollToRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLookup,
  onOpenAdmin,
  onScrollToRegister,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0A192F] text-white text-xs py-1.5 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2 border-b border-amber-500/20">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="font-marathi-sub text-xs sm:text-sm">
          🔥 मर्यादित जागा! Live Training ₹९९९ ऐवजी फक्त <strong className="text-amber-300 font-extrabold font-poppins">₹१९९</strong> (८०% OFF)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <BrandLogo
            variant="header"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-bold text-slate-700 font-marathi-sub">
            <button
              onClick={() => scrollToSection('learn')}
              className="hover:text-[#E53935] transition cursor-pointer"
            >
              कोर्समध्ये काय आहे?
            </button>
            <button
              onClick={() => scrollToSection('instructor')}
              className="hover:text-[#E53935] transition cursor-pointer"
            >
              Instructor
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#E53935] transition cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student Registration Lookup */}
            <button
              onClick={onOpenLookup}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition cursor-pointer border border-stone-200"
              title="नोंदणी तपासा"
            >
              <Search className="w-3.5 h-3.5 text-[#E53935]" />
              <span className="font-marathi-sub">नोंदणी तपासा</span>
            </button>

            {/* Admin Access Link */}
            <button
              onClick={onOpenAdmin}
              className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-700 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              title="Admin Portal"
            >
              <Users className="w-3 h-3" />
              <span>Admin</span>
            </button>

            {/* REGISTER NOW Primary Button */}
            <button
              onClick={onScrollToRegister}
              className="bg-[#E53935] hover:bg-[#D32F2F] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all shadow-md shadow-red-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer font-poppins uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>REGISTER NOW</span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-stone-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-sm font-bold text-slate-800 font-marathi-sub">
            <button
              onClick={() => scrollToSection('learn')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-stone-50 text-left"
            >
              <Sparkles className="w-4 h-4 text-[#E53935]" />
              <span>कोर्समध्ये काय आहे?</span>
            </button>

            <button
              onClick={() => scrollToSection('instructor')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-stone-50 text-left"
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>Instructor</span>
            </button>

            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-stone-50 text-left"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>FAQ</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl"
            >
              <Search className="w-3.5 h-3.5 text-[#E53935]" />
              <span>नोंदणी तपासा</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="py-2.5 px-4 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

