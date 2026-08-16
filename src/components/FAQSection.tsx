import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQSectionProps {
  faqs?: FAQItem[];
}

const EXACT_4_FAQS: FAQItem[] = [
  {
    question: '१. ही Training कोणासाठी आहे?',
    answer: 'विद्यार्थी, व्यावसायिक, नोकरदार आणि ज्यांना मराठीत AI शिकायचे आहे अशा प्रत्येकासाठी.',
  },
  {
    question: '२. मोबाईलवरून Join करता येईल का?',
    answer: 'होय, तुम्ही लॅपटॉप किंवा स्मार्टफोनवरून Google Meet द्वारे सहज जॉइन करू शकता.',
  },
  {
    question: '३. Training किती वेळाची आहे?',
    answer: 'फक्त २ तासांची Practical Live Training.',
  },
  {
    question: '४. Payment नंतर काय मिळेल?',
    answer: 'Payment पूर्ण झाल्यावर तुम्हाला लगेच WhatsApp Group व Live Session ची लिंक मिळेल.',
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  // If faqs provided by admin, use up to 4 or fallback to EXACT_4_FAQS
  const displayFaqs = faqs && faqs.length > 0 ? faqs.slice(0, 4) : EXACT_4_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-black uppercase tracking-wider font-poppins">
            <HelpCircle className="w-3.5 h-3.5 text-[#E53935]" />
            <span>QUESTIONS & ANSWERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-marathi-title">
            सतत विचारले जाणारे <span className="text-[#E53935]">प्रश्न (FAQ)</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg font-marathi-sub">
            थोडक्यात आणि स्पष्ट उत्तरे
          </p>
        </div>

        {/* 4 Clean FAQ Items */}
        <div className="space-y-3.5">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#FAF8F5] border-stone-300 shadow-xs'
                    : 'bg-white border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-bold text-stone-900 text-base sm:text-lg font-marathi-title leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full transition-transform duration-300 shrink-0 ${
                      isOpen
                        ? 'rotate-180 bg-[#E53935] text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-stone-700 text-sm font-marathi-sub leading-relaxed border-t border-stone-200/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
