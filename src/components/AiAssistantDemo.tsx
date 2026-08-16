import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Lightbulb } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  'माझ्या किराणा दुकानासाठी AI पोस्टर्स कसे बनवावे?',
  'CSC केंद्रात ChatGPT चा काय उपयोग होऊ शकतो?',
  'इन्स्टाग्रामवर AI रील्स बनवून फॉलोअर्स कसे वाढवावे?',
  'या कोर्समध्ये Jio AI चा काय फायदा मिळेल?',
];

export const AiAssistantDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'नमस्कार! मी **AI Marathi Guru Assistant** आहे. कोर्सबद्दल किंवा AI टूल्सबद्दल तुम्हाला काय विचारायचे आहे? खाली दिलेला प्रश्न निवडा किंवा तुमचा प्रश्न टाईप करा!',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText?: string) => {
    const query = questionText || prompt;
    if (!query.trim() || loading) return;

    const userMsg = query.trim();
    setPrompt('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || 'माफ करा, कृपया पुन्हा प्रयत्न करा.' },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'AI Marathi Guru कोर्समध्ये तुम्हाला ChatGPT, Gemini, Jio AI आणि पोस्टर डिझाईनचे प्रॅक्टिकल ज्ञान मिळतील. अधिक माहितीसाठी WhatsApp करा: 9801555171.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white to-red-50/40 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Interactive AI Demo
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-marathi-title">
            मराठी AI असिस्टंटशी <span className="text-red-600">चॅट करून पहा!</span>
          </h2>
          <p className="text-slate-600 text-sm font-marathi-sub">
            AI मराठीत कसे काम करते हे पाहण्यासाठी खालील प्रश्नांवर क्लिक करा:
          </p>
        </div>

        {/* Chat Box */}
        <div className="bg-white rounded-3xl border-2 border-red-200 shadow-xl overflow-hidden flex flex-col h-[480px]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Marathi Guru Bot</h3>
                <span className="text-[11px] text-red-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online (Powered by Gemini)
                </span>
              </div>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold">
              मराठी AI
            </span>
          </div>

          {/* Messages scroll body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-red-600 text-white' : 'bg-slate-900 text-red-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] text-xs sm:text-sm font-marathi-sub leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white rounded-tr-xs font-semibold'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium p-2">
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>AI विचार करत आहे...</span>
              </div>
            )}
          </div>

          {/* Sample quick questions chips */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>पटकन विचारण्यासाठी क्लिक करा:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="text-[11px] font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full transition truncate max-w-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="मराठीत तुमचा प्रश्न टाइप करा..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-red-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
