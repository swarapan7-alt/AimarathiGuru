import React from 'react';
import { Phone, Globe, MessageCircle, Heart, Search, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onOpenPolicyModal: (type: 'privacy' | 'terms' | 'refund') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLookup,
  onOpenAdmin,
  onOpenPolicyModal,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 pb-10 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <BrandLogo variant="full" />
            <p className="text-xs text-stone-400 font-marathi-sub leading-relaxed font-medium">
              AI शिका. व्यवसाय वाढवा. <br />
              मराठीतील सर्वात सोपी व १००% प्रॅक्टिकल AI Live Training.
            </p>
            <div className="pt-1 text-[11px] text-stone-500 font-medium">
              Powered by Swara Udyog Group
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-poppins">
              संपर्क (Support)
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E53935]" />
                <span>हेल्पलाईन: <strong>9801555171</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <a
                  href="https://aimarathi.swaraudyog.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  aimarathi.swaraudyog.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/919801555171"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Tools */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-poppins">
              विद्यार्थी सेवा
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-[#E53935] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#E53935]" />
                  <span>नोंदणी व पेमेंट तपासा (Lookup)</span>
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/919801555171"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>प्रवेश मदत / Helpline</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Policies & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-poppins">
              धोरणे (Policies)
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <button
                  onClick={() => onOpenPolicyModal('privacy')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicyModal('terms')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicyModal('refund')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={onOpenAdmin}
                  className="text-stone-500 hover:text-[#E53935] transition text-[11px] underline cursor-pointer"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 AI Marathi Guru. All Rights Reserved. Swara Udyog Group.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Maharashtra
          </p>
        </div>

      </div>
    </footer>
  );
};
