import React from 'react';
import { Lightbulb, Bot, FileText, Image as ImageIcon, Video, TrendingUp, Rocket, ArrowRight } from 'lucide-react';

export const BusinessWorkflowSection: React.FC = () => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Idea (कल्पना)',
      description: 'तुमच्या दुकानाची किंवा व्यवसायाची ऑफर कल्पना',
      icon: Lightbulb,
      color: 'bg-amber-500 text-slate-950 border-amber-300',
    },
    {
      step: '02',
      title: 'AI Processing',
      description: 'ChatGPT/Gemini ला मराठीत सांगणे',
      icon: Bot,
      color: 'bg-emerald-600 text-white border-emerald-400',
    },
    {
      step: '03',
      title: 'Content Writeup',
      description: '१ मिनिटात आकर्षक जाहिरात मजकूर',
      icon: FileText,
      color: 'bg-blue-600 text-white border-blue-400',
    },
    {
      step: '04',
      title: 'Poster Design',
      description: 'HD दर्जाचे सण-उत्सव बॅनर व जाहिरात पोस्टर',
      icon: ImageIcon,
      color: 'bg-purple-600 text-white border-purple-400',
    },
    {
      step: '05',
      title: 'AI Video Reel',
      description: 'व्हॉईसओव्हरसह इन्स्टाग्राम रील निर्मिती',
      icon: Video,
      color: 'bg-pink-600 text-white border-pink-400',
    },
    {
      step: '06',
      title: 'Marketing',
      description: 'WhatsApp & Instagram द्वारे लोकांपर्यंत पोहोच',
      icon: TrendingUp,
      color: 'bg-[#E53935] text-white border-red-400',
    },
    {
      step: '07',
      title: 'Business Growth',
      description: 'ग्राहक वाढ आणि वेळेची भरपूर बचत!',
      icon: Rocket,
      color: 'bg-[#1E3A8A] text-white border-blue-400',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-widest border border-blue-500/30">
            <Rocket className="w-3.5 h-3.5 text-amber-400" /> BUSINESS AUTOMATION WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-marathi-title text-white">
            <span className="font-marathi-accent text-amber-400">AI चा वापर Business मध्ये कसा करायचा?</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-marathi-sub max-w-2xl mx-auto">
            कल्पनेपासून ते व्यवसायाच्या वाढीपर्यंत — १ तासाचे काम फक्त ५ मिनिटांत कसे पूर्ण करायचे त्याचा रोडमॅप!
          </p>
        </div>

        {/* Workflow Horizontal & Grid Display */}
        <div className="relative">
          
          {/* Connector Line on Large Screens */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500 rounded-full -translate-y-1/2 opacity-30 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
            {workflowSteps.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">STEP {item.step}</span>
                      <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-extrabold text-white font-marathi-title group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] text-slate-300 font-marathi-sub leading-snug">
                      {item.description}
                    </p>
                  </div>

                  {idx < workflowSteps.length - 1 && (
                    <div className="lg:hidden pt-3 border-t border-slate-800/80 flex items-center justify-end text-slate-500">
                      <ArrowRight className="w-4 h-4 text-amber-400/80" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-5 rounded-2xl bg-blue-900/40 border border-blue-500/30 text-center font-marathi-sub text-sm font-extrabold text-blue-100 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-amber-300 font-black text-lg">💡 महत्त्वाचे:</span>
          <span>हे सर्व शिकण्यासाठी कोणत्याही कोडिंग किंवा महागड्या कॉम्प्युटरची गरज नाही! मोबाईलवरून सहज शक्य आहे.</span>
        </div>

      </div>
    </section>
  );
};
