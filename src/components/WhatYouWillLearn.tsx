import React from 'react';
import {
  MessageSquareText,
  Sparkles,
  Smartphone,
  Palette,
  Video,
  Instagram,
  ArrowRight,
} from 'lucide-react';

interface WhatYouWillLearnProps {
  onScrollToRegister?: () => void;
}

export const WhatYouWillLearn: React.FC<WhatYouWillLearnProps> = ({ onScrollToRegister }) => {
  const cards = [
    {
      id: 1,
      title: 'ChatGPT Basics',
      tag: '01',
      description: 'मराठीत ChatGPT चा उपयोग',
      details: 'योग्य प्रॉम्ट्स लिहून १ मिनिटात व्यावसायिक ई-मेल, अर्ज, संवाद व बिझनेस प्लॅनिंग तयार करा.',
      icon: MessageSquareText,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/70',
      accentColor: 'group-hover:border-emerald-300',
    },
    {
      id: 2,
      title: 'Google Gemini',
      tag: '02',
      description: 'Gemini चा practical वापर',
      details: 'लाईव्ह माहिती, रिसर्च, मोठे डॉक्युमेंट्स समजणे आणि दैनंदिन कामात स्मार्ट AI मदत मिळवणे.',
      icon: Sparkles,
      iconColor: 'text-blue-700 bg-blue-50 border-blue-200/70',
      accentColor: 'group-hover:border-blue-300',
    },
    {
      id: 3,
      title: 'Jio + Google Gemini',
      tag: '03',
      description: 'Jio plans आणि उपलब्ध Google Gemini benefits बद्दल माहिती',
      details: 'Jio ₹349 प्लॅनद्वारे उपलब्ध Google Gemini benefits आणि eligible users साठी offers समजून घ्या.',
      icon: Smartphone,
      iconColor: 'text-indigo-700 bg-indigo-50 border-indigo-200/70',
      accentColor: 'group-hover:border-indigo-300',
    },
    {
      id: 4,
      title: 'AI Poster Design',
      tag: '04',
      description: 'AI वापरून आकर्षक पोस्टर आणि Graphics तयार करणे',
      details: 'मोबाईलवरून सण-उत्सव, दुकान व व्यवसायाची आकर्षक HD जाहिरात पोस्टर्स काही मिनिटांत बनवा.',
      icon: Palette,
      iconColor: 'text-purple-700 bg-purple-50 border-purple-200/70',
      accentColor: 'group-hover:border-purple-300',
    },
    {
      id: 5,
      title: 'AI Video Creation',
      tag: '05',
      description: 'AI Tools वापरून basic video creation',
      details: 'चेहरा न दाखवता AI व्हॉईसओव्हर आणि स्मार्ट टूल्सच्या मदतीने basic रील व व्हिडिओ निर्मिती.',
      icon: Video,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200/70',
      accentColor: 'group-hover:border-amber-300',
    },
    {
      id: 6,
      title: 'Instagram for Business',
      tag: '06',
      description: 'Instagram account आणि business promotion basics',
      details: 'अकाउंट ब्रँडिंग, AI द्वारे व्हायरल रील कल्पना, कॅप्शन निर्मिती आणि सोशल मीडियावरून ग्राहक वाढवणे.',
      icon: Instagram,
      iconColor: 'text-pink-700 bg-pink-50 border-pink-200/70',
      accentColor: 'group-hover:border-pink-300',
    },
  ];

  return (
    <section id="learn" className="py-14 sm:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-extrabold uppercase tracking-wider font-poppins">
            <span>SYLLABUS & MODULES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-tight font-marathi-title">
            या 2 तासांच्या Live Training मध्ये <br className="hidden sm:block" />
            <span className="text-[#E53935]">काय शिकाल?</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg font-marathi-sub">
            सर्वसामान्यांना व व्यावसायिकांना प्रत्यक्ष उपयोगी पडणारे ६ प्रमुख विषय
          </p>
        </div>

        {/* 6 Clean Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${card.accentColor}`}
              >
                <div className="space-y-4">
                  {/* Top Row: Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${card.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-stone-400 font-poppins">
                      {card.tag}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-stone-900 font-marathi-title">
                      {card.title}
                    </h3>
                    <p className="text-sm font-bold text-[#E53935] font-marathi-sub leading-snug">
                      {card.description}
                    </p>
                  </div>

                  {/* Details paragraph */}
                  <p className="text-stone-600 text-xs sm:text-sm font-marathi-sub leading-relaxed">
                    {card.details}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-stone-500 font-marathi-sub">
                  <span>१००% प्रॅक्टिकल डेमो</span>
                  <span className="text-stone-400">Live Hands-on</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Action Prompt */}
        {onScrollToRegister && (
          <div className="mt-10 sm:mt-12 text-center">
            <button
              onClick={onScrollToRegister}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold text-[#E53935] hover:text-[#D32F2F] font-marathi-sub hover:underline cursor-pointer"
            >
              <span>सर्व ६ विषय शिकण्यासाठी आजच सीट बुक करा</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
