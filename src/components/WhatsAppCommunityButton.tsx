import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Copy, Check, Globe } from 'lucide-react';

interface WhatsAppCommunityButtonProps {
  communityLink?: string;
  className?: string;
}

export const WhatsAppCommunityButton: React.FC<WhatsAppCommunityButtonProps> = ({
  communityLink = 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  // Normalize link and fallback
  const activeLink = communityLink && communityLink.trim() !== ''
    ? communityLink.trim()
    : 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO';

  // Extract invite code if available for WhatsApp Web fallback URL
  const getWhatsAppWebUrl = () => {
    if (activeLink.includes('chat.whatsapp.com/')) {
      const code = activeLink.split('chat.whatsapp.com/')[1]?.split('?')[0];
      if (code) {
        return `https://web.whatsapp.com/accept?code=${code}`;
      }
    }
    return 'https://web.whatsapp.com/';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Primary Join Button */}
      <a
        href={activeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-sm sm:text-base py-4 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide text-center"
      >
        <MessageCircle className="w-5 h-5 fill-emerald-600 text-white shrink-0" />
        <span>JOIN AI MARATHI GURU WHATSAPP COMMUNITY</span>
        <ExternalLink className="w-4 h-4 shrink-0" />
      </a>

      {/* Desktop Fallback Options */}
      <div className="pt-2 border-t border-emerald-500/40 space-y-2">
        <p className="text-xs text-emerald-100 font-bold text-center">
          Desktop वर Join होत नसेल?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Open WhatsApp Web */}
          <a
            href={getWhatsAppWebUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-800/80 hover:bg-emerald-900/90 text-white font-bold text-xs py-2.5 px-3 rounded-lg border border-emerald-400/40 transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>OPEN WHATSAPP WEB</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>

          {/* Copy Community Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full bg-emerald-800/80 hover:bg-emerald-900/90 text-white font-bold text-xs py-2.5 px-3 rounded-lg border border-emerald-400/40 transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            )}
            <span>{copied ? 'LINK COPIED!' : 'COPY COMMUNITY LINK'}</span>
          </button>
        </div>

        {/* Copy Feedback Message */}
        {copied && (
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-900 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
            <Check className="w-4 h-4 shrink-0 text-slate-900" />
            <span>Community Link Copy झाली आहे. WhatsApp मध्ये Paste करून Join करा.</span>
          </div>
        )}
      </div>
    </div>
  );
};
