import React from 'react';
import { MessageCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { WhatsAppCommunityButton } from './WhatsAppCommunityButton';

interface WhatsAppCommunitySectionProps {
  communityLink?: string;
}

export const WhatsAppCommunitySection: React.FC<WhatsAppCommunitySectionProps> = ({
  communityLink = 'https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO',
}) => {
  return (
    <section className="py-16 sm:py-20 bg-emerald-900 text-white relative overflow-hidden">
      
      {/* Background Subtle Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 opacity-95" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
          <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-950" />
          <span>OFFICIAL WHATSAPP COMMUNITY</span>
        </div>

        {/* Heading & Text */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black font-marathi-title text-white leading-tight">
            AI Marathi Guru <span className="font-marathi-accent text-emerald-300">WhatsApp Community</span>
          </h2>
          <p className="text-sm sm:text-lg font-marathi-sub text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Course Updates, Live Session Link आणि Important Information साठी Community मध्ये Join व्हा.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-emerald-800/50 border border-emerald-500/20 backdrop-blur-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-emerald-50 font-marathi-sub">
              क्लास लिंक्स वेळेवर मिळतील
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-800/50 border border-emerald-500/20 backdrop-blur-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-emerald-50 font-marathi-sub">
              मोफत AI प्रॉम्ट्स & PDF गाइड
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-800/50 border border-emerald-500/20 backdrop-blur-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-emerald-50 font-marathi-sub">
              थेट शंका निरसन सपोर्ट
            </span>
          </div>
        </div>

        {/* Community Button */}
        <div className="max-w-md mx-auto pt-2">
          <WhatsAppCommunityButton communityLink={communityLink} />
        </div>

        {/* Footer Note */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-200/80 font-bold font-marathi-sub">
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>१००% सुरक्षित कम्युनिटी • केवळ अधिकृत माहिती पाठवली जाते</span>
        </div>

      </div>
    </section>
  );
};
