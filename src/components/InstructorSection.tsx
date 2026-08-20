import React from 'react';
import { Award, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { InstructorPhoto } from './InstructorPhoto';

interface InstructorSectionProps {
  instructorName?: string;
  instructorNameEn?: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorPhoto?: string;
  onScrollToRegister?: () => void;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({
  instructorName = 'श्री. पंकज वाघमारे',
  instructorNameEn = 'Mr. Pankaj Waghmare',
  instructorTitle = 'Founder & CEO, AI Marathi Guru',
  instructorBio,
  instructorPhoto = '',
}) => {
  return (
    <section id="instructor" className="py-14 sm:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-300/80 text-amber-950 text-xs font-black uppercase tracking-wider font-poppins shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>TRAINER & FOUNDER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 font-marathi-title">
            तुमचे <span className="text-[#DC2626]">मार्गदर्शक</span>
          </h2>
        </div>

        {/* Single Premium 3D Instructor Card */}
        <div className="relative bg-gradient-to-b from-[#FAF8F5] to-white rounded-3xl p-6 sm:p-8 border border-amber-300/60 shadow-xl shadow-stone-200/50 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          
          {/* Professional Portrait of Mr. Pankaj Waghmare */}
          <InstructorPhoto
            photoUrl={instructorPhoto}
            variant="card"
          />

          {/* Instructor Content */}
          <div className="text-center sm:text-left space-y-3.5 flex-1">
            
            {/* Master Trainer Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-300 text-amber-950 text-[11px] font-black uppercase font-poppins tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>MASTER TRAINER</span>
            </div>

            {/* Names (Marathi Calligraphy + Clean English) */}
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-bold text-stone-950 font-marathi-calligraphy tracking-wide leading-tight">
                {instructorName}
              </h3>
              <p className="text-base sm:text-lg font-bold text-stone-700 font-poppins">
                {instructorNameEn}
              </p>
              <p className="text-sm font-bold text-[#DC2626] font-poppins">
                {instructorTitle}
              </p>
            </div>

            {/* Exactly 3 Clean Trust Points */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-xs text-xs sm:text-sm font-bold text-stone-800 font-poppins">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-marathi-sub font-bold">Practical AI Learning</span>
              </div>
              
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-xs text-xs sm:text-sm font-bold text-stone-800 font-poppins">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-marathi-sub font-bold">Live Training</span>
              </div>
              
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-xs text-xs sm:text-sm font-bold text-stone-800 font-poppins">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-marathi-sub font-bold">Business Guidance</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-marathi-sub leading-relaxed pt-1 font-medium">
              {instructorBio ||
                '८,०००+ मराठी विद्यार्थी, व्यावसायिक, शेतकरी व उद्योजकांना AI तंत्रज्ञानाचे सोप्या भाषेत थेट प्रात्यक्षिकासह प्रशिक्षण दिलेले तज्ज्ञ मार्गदर्शक.'}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
