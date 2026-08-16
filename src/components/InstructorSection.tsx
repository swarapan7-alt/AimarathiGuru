import React from 'react';
import { Award, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InstructorSectionProps {
  instructorName?: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorPhoto?: string;
  onScrollToRegister?: () => void;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({
  instructorPhoto = '',
}) => {
  const hasPhoto = instructorPhoto && instructorPhoto.trim().startsWith('http');

  return (
    <section id="instructor" className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Clean Instructor Card */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Small Circular Avatar / Thumbnail */}
          <div className="shrink-0 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 shadow-md bg-stone-900 flex items-center justify-center">
              {hasPhoto ? (
                <img
                  src={instructorPhoto.trim()}
                  alt="श्री. पंकज वाघमारे"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0F172A] to-[#1E3A8A] flex items-center justify-center text-white">
                  <span className="text-xl sm:text-2xl font-bold font-marathi-title">PW</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-1 rounded-full border-2 border-white shadow-xs">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center sm:text-left space-y-2.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase font-poppins">
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              <span>Instructor Profile</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl text-stone-900 font-marathi-calligraphy tracking-wide">
                श्री. पंकज वाघमारे
              </h3>
              <p className="text-sm font-bold text-[#E53935] font-poppins">
                Founder & CEO, AI Marathi Guru
              </p>
            </div>

            {/* 2 Short Lines About Experience & Practical Training */}
            <div className="space-y-1.5 text-xs sm:text-sm text-stone-600 font-marathi-sub leading-relaxed pt-1">
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>८,०००+ मराठी विद्यार्थ्यांना व व्यावसायिकांना सोप्या मराठी भाषेत AI चे थेट प्रशिक्षण.</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>कोणतेही अवघड तांत्रिक शब्द न वापरता प्रत्यक्ष कामात उपयोगी पडणाऱ्या साधनांचे मार्गदर्शन.</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
