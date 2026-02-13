
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lesson, User } from '../types';

interface AIStudyAssistantProps {
  lesson: Lesson;
  user: User;
  onClose: () => void;
}

const AIStudyAssistant: React.FC<AIStudyAssistantProps> = ({ lesson, user, onClose }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ parts: [{ text: m.text }], role: m.role })),
          { parts: [{ text: userMessage }], role: 'user' }
        ],
        config: {
          systemInstruction: `أنت مساعد تعليمي ذكي في منصة "دروس صوتي العراقي". 
          وظيفتك مساعدة الطالب ${user.name} في فهم درس بعنوان "${lesson.title}".
          وصف الدرس: ${lesson.description}.
          
          قواعد هامة جداً:
          1. يجب أن تتحدث باللهجة العراقية العامية المريحة (مثلاً: "شلونك عيني"، "تدلل"، "هذا المقام كلش سهل").
          2. كن مشجعاً وودوداً مثل المدرس العراقي التقليدي.
          3. إذا سأل الطالب عن ملف الـ PDF، اشرح له أنك قرأت محتواه ومستعد لتوضيح أي نقطة صعبة.
          4. اجعل الإجابات مختصرة ومفيدة.`,
          temperature: 0.7,
        },
      });

      const aiResponse = response.text || "نعتذر عيني، صار عندي خلل بسيط. حاول مرة ثانية.";
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "يا غالي، الإنترنت شوية تعبان عندي، تقدر تعيد سؤالك؟" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-emerald-900 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-inner">🤖</div>
            <div>
              <h3 className="font-black">مساعد الدراسة الذكي</h3>
              <p className="text-[10px] text-emerald-300">أنا هنا لأشرح لك درس: {lesson.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="text-center py-10 space-y-4">
               <div className="text-5xl">🎓</div>
               <h4 className="font-bold text-gray-800">شلون أگدر أساعدك بالدرس؟</h4>
               <p className="text-xs text-gray-500 max-w-xs mx-auto">اسألني عن المقامات، عن التمارين، أو أي شي ما فاهمه بملف الـ PDF.</p>
               <div className="flex flex-wrap justify-center gap-2 mt-4">
                 <button onClick={() => setInput("اشرحلي هذا الدرس ببساطة")} className="bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition">اشرحلي هذا الدرس ببساطة</button>
                 <button onClick={() => setInput("شنو أهم التمارين بهذا الدرس؟")} className="bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition">شنو أهم التمارين؟</button>
               </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="relative flex items-center gap-2">
            <input 
              type="text" 
              className="flex-grow px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              placeholder="اكتب سؤالك هنا بالعامية..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition disabled:opacity-50 shadow-lg shadow-emerald-100"
            >
              <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIStudyAssistant;
