import React from 'react';
import {
  Video,
  Award,
  MessageCircle,
  FileText,
  RotateCw,
  PlaySquare,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

const INCLUDES = [
  {
    title: 'Live Training',
    titleMr: '२ तासांचे लाईव्ह ट्रेनिंग',
    desc: 'Google Meet वर थेट संवाद साधून प्रात्यक्षिक शिकवणी.',
    icon: Video,
    color: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    title: 'E-Certificate',
    titleMr: 'ई-प्रमाणपत्र (Certificate)',
    desc: 'कोर्स पूर्ण केल्यानंतर अधिकृत कोर्स कम्प्लीशन सर्टिफिकेट.',
    icon: Award,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    title: 'WhatsApp Support',
    titleMr: 'VIP WhatsApp ग्रूप सपोर्ट',
    desc: 'शंकांचे निरसन करण्यासाठी स्पेशल व्हॉट्सॲप ग्रुप प्रवेश.',
    icon: MessageCircle,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    title: 'PDF Notes',
    titleMr: 'PDF नोट्स व स्टेप्स गाईड',
    desc: 'सर्व Prompts आणि टूल्सच्या लिंक्सची डाऊनलोडयोग्य PDF.',
    icon: FileText,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    title: 'Lifetime Updates',
    titleMr: 'लाईफटाईम अपडेट्स',
    desc: 'भविष्यात येणाऱ्या नवनवीन AI टूल्सचे मोफत अपडेट्स.',
    icon: RotateCw,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    title: 'Practical Demo',
    titleMr: '१००% प्रात्यक्षिक डेमो',
    desc: 'थेट मोबाईल आणि लॅपटॉपवर करून दाखवणारे प्रॅक्टिकल प्रात्यक्षिक.',
    icon: PlaySquare,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    title: 'Business Ideas',
    titleMr: 'नवीन व्यवसाय आयडिया',
    desc: 'AI च्या मदतीने नवीन इन्कम सोर्स सुरु करण्याच्या आयडिया.',
    icon: Lightbulb,
    color: 'bg-teal-50 text-teal-600 border-teal-200',
  },
];

export const CourseIncludes: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
            ALL-INCLUSIVE PACKAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-marathi-title">
            या कोर्समध्ये तुम्हाला <span className="text-red-600">काय काय मिळेल?</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-marathi-sub max-w-xl mx-auto">
            फक्त ₹199 मध्ये मिळवा 7 मोठे फायदे जे तुमच्या करिअरला गती देतील!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INCLUDES.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${item.color} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-xs mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg font-marathi-title mb-1">
                  {item.titleMr}
                </h3>
                <p className="text-xs text-slate-600 font-marathi-sub font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Included
                </span>
                <span className="text-slate-400">{item.title}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
