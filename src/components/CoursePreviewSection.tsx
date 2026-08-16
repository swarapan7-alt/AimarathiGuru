import React from 'react';
import { Eye, Sparkles, Image as ImageIcon, Laptop, Smartphone } from 'lucide-react';
import { CourseScreenshot } from '../types';

interface CoursePreviewSectionProps {
  screenshots?: CourseScreenshot[];
}

const DEFAULT_SCREENSHOTS: CourseScreenshot[] = [
  {
    id: 'scr_1',
    title: 'ChatGPT Marathi Prompting',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    description: 'मराठीत प्रॉम्ट लिहून १ मिनिटात व्यावसायिक ई-मेल व अर्ज तयार करणे'
  },
  {
    id: 'scr_2',
    title: 'Google Gemini & AI Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    description: 'भारतीय भाषांमधील AI सहाय्यक व डॉक्युमेंट अ‍ॅनालिसिस'
  },
  {
    id: 'scr_3',
    title: 'AI Poster & Festival Graphics',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    description: 'मोबाईलवरून १ मिनिटात सण-उत्सव व दुकानाचे HD जाहिरात पोस्टर'
  },
  {
    id: 'scr_4',
    title: 'AI Video & Avatar Reels',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    description: 'चेहरा न दाखवता व्हॉईसओव्हरसह रील व व्हिडिओ निर्मिती'
  }
];

export const CoursePreviewSection: React.FC<CoursePreviewSectionProps> = ({
  screenshots = DEFAULT_SCREENSHOTS,
}) => {
  const activeScreenshots = screenshots && screenshots.length > 0 ? screenshots : DEFAULT_SCREENSHOTS;

  return (
    <section id="course-preview" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-black uppercase tracking-widest border border-blue-100">
            <Eye className="w-3.5 h-3.5" /> WORKSHOP SAMPLES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-marathi-title">
            कोर्स मधील <span className="font-marathi-accent text-[#E53935]">प्रॅक्टिकल झलक</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-marathi-sub max-w-2xl mx-auto">
            तुम्ही या २ तासांच्या वर्कशॉपमध्ये नेमके काय शिकून स्वतः तयार करणार आहात याचे प्रात्यक्षिक नमुने.
          </p>
        </div>

        {/* Clean Device Frame Mockups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeScreenshots.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Laptop/Device Frame Mockup Header */}
              <div className="bg-slate-900 px-3 py-2 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-slate-300 font-bold">aimarathi.guru/preview-0{index + 1}</span>
              </div>

              {/* Image Frame */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded border border-white/20 font-poppins">
                  SAMPLE 0{index + 1}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base font-marathi-title group-hover:text-[#1E3A8A] transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-600 font-marathi-sub font-medium mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-emerald-700 font-marathi-sub">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Demo
                  </span>
                  <span className="text-stone-400 font-normal">HD Quality</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
