import React from 'react';
import {
  GraduationCap,
  Store,
  Monitor,
  Building,
  Briefcase,
  BookOpen,
  Laptop,
  Heart,
  Sparkles,
  Users,
} from 'lucide-react';

const AUDIENCES = [
  {
    title: 'विद्यार्थी (Students)',
    desc: 'प्रोजेक्ट्स, अभ्यासाचे नोट्स आणि करिअर वाढवण्यासाठी AI चा उत्तम वापर करा.',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'दुकानदार व व्यावसायिक (Shop Owners)',
    desc: 'आपल्या दुकानाची मोफत डिजिटल जाहिरात, ऑफर्स आणि AI पोस्टर्स बनवा.',
    icon: Store,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'CSC केंद्र चालक (CSC Operators)',
    desc: 'ग्राहकांचे अर्ज, ई-मेल, ड्राफ्टिंग आणि माहिती जलद भरण्यासाठी AI चा वापर करा.',
    icon: Monitor,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'महा ई-सेवा केंद्र (Maha e-Seva)',
    desc: 'सेवा केंद्राचे कामकाज ऑटोमेट करून अधिक कमाई व वेळ वाचवा.',
    icon: Building,
    gradient: 'from-rose-500 to-red-600',
  },
  {
    title: 'बिजनेस ओनर (Business Owners)',
    desc: 'मार्केटिंग, कस्टमर सपोर्ट आणि सोशल मीडिया हँडल करण्यासाठी AI ऑटोमेशन.',
    icon: Briefcase,
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'शिक्षक व प्राध्यापक (Teachers)',
    desc: 'शिकवण्यासाठी पीपीटी, प्रश्नपत्रिका, व व्हिडिओ सहजरित्या तयार करा.',
    icon: BookOpen,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'फ्रीलान्सर्स (Freelancers)',
    desc: 'क्लायंट्ससाठी ग्राफिक डिझाईन्स, व्हिडिओ एडिटिंग व कंटेंट रायटिंग करा.',
    icon: Laptop,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'गृहिणी (Housewives)',
    desc: 'घरी बसून वर्क फ्रॉम होम किंवा सोशल मीडिया पेज सुरू करून कमाई करा.',
    icon: Heart,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'AI शिकण्याची आवड असणारी कोणतीही व्यक्ती',
    desc: 'कुठलेही तांत्रिक ज्ञान नसले तरीही अगदी सोप्या मराठीत शिकता येते.',
    icon: Sparkles,
    gradient: 'from-red-600 to-amber-500',
  },
];

export const WhoShouldJoin: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" /> Target Audience
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-marathi-title">
            हा कोर्स <span className="text-red-600">कोणासाठी उपयुक्त आहे?</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-marathi-sub max-w-xl mx-auto">
            तुम्ही कोणत्याही क्षेत्रातील असा, हा कोर्स तुमच्यासाठी गेमचेंजर ठरेल!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUDIENCES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition duration-200 flex items-start gap-4"
            >
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shrink-0 shadow-md`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base font-marathi-title">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 font-marathi-sub leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
