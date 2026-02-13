
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import React, { useEffect, useRef, useState } from 'react';
import { Lesson, User } from '../types';

interface AudioStudySessionProps {
  lesson: Lesson;
  user: User;
  onClose: () => void;
  customPdfText?: string; // نص مستخرج من ملف PDF رفعه المستخدم
}

const AudioStudySession: React.FC<AudioStudySessionProps> = ({ lesson, user, onClose, customPdfText }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('جاري الاتصال بالمدرس الذكي...');
  const [isMuted, setIsMuted] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Helper functions for audio encoding/decoding
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  useEffect(() => {
    let stream: MediaStream;
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputAudioContext;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const startSession = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const contextInfo = customPdfText 
          ? `لقد قام الطالب برفع ملف PDF خاص به يحتوي على النص التالي: "${customPdfText.substring(0, 5000)}".`
          : `أنت تدرس مادة بعنوان "${lesson.title}" ووصفها: "${lesson.description}".`;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setIsActive(true);
              setStatus('أنا أسمعك الآن.. تفضل اسألني');
              
              const source = inputAudioContext.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                for (const src of sourcesRef.current) {
                  src.stop();
                }
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('AI Error:', e);
              setStatus('عذراً، صار خلل بالاتصال');
            },
            onclose: () => {
              setIsActive(false);
              setStatus('انتهت الدردشة الصوتية');
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
            },
            systemInstruction: `أنت مساعد تعليمي صوتي عراقي خبير جداً بمقامات العراق وفنون الإنشاد والتجويد، وأيضاً خبير في تحليل النصوص الدراسية.
            الآن أنت في مكالمة مباشرة مع الطالب ${user.name}.
            
            سياق الدراسة:
            ${contextInfo}
            
            قواعد ذهبية:
            1. تحدث حصراً باللهجة العراقية الدافئة (مثلاً: "يا هلا بيك عيني"، "تدلل غالي"، "هذا الملف كلش واضح").
            2. إذا كان الطالب قد رفع ملفاً، أخبره في بداية المكالمة أنك تصفحت ملفه ومستعد لشرح محتوياته (بالعراقي: "شفت الملف اللي دزيته عيني، خوش مادة بي").
            3. بسط المفاهيم المعقدة واستخدم أمثلة من حياتنا اليومية بالعراق.
            4. إذا سكت الطالب، شجعه (مثلاً: "ها عيني، اكو شي ما واضح بالملف؟").
            5. كن صبوراً ومعلماً محفزاً.`
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error(err);
        setStatus('يرجى السماح بالوصول للميكروفون');
      }
    };

    startSession();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (inputAudioContext) inputAudioContext.close();
      if (outputAudioContext) outputAudioContext.close();
      if (sessionRef.current) sessionRef.current.close();
    };
  }, [lesson, user, customPdfText]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-emerald-950/95 backdrop-blur-xl">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col items-center p-12 text-center border-t-[12px] border-emerald-500 relative">
        <button onClick={onClose} className="absolute top-8 left-8 text-gray-400 hover:text-red-500 transition">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>

        <div className="mb-10 relative">
          <div className="flex items-center justify-center gap-1.5 h-20 mb-6">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 bg-emerald-500 rounded-full transition-all duration-300 ${isActive && !isMuted ? 'animate-waveform' : 'h-2 opacity-30'}`}
                style={{ animationDelay: `${i * 0.1}s`, height: isActive && !isMuted ? 'auto' : '8px' }}
              ></div>
            ))}
          </div>

          <div className={`w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-5xl shadow-inner transition-all duration-500 ${isActive && !isMuted ? 'scale-110 shadow-emerald-200' : ''}`}>
            {isMuted ? '🔇' : '🎙️'}
          </div>
          {isActive && !isMuted && (
            <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping opacity-20"></div>
          )}
        </div>

        <h2 className="text-2xl font-black text-emerald-900 mb-2">دردشة صوتية مباشرة</h2>
        <p className="text-gray-500 mb-8 font-medium">أنت الآن تدرس: <span className="text-emerald-700">{customPdfText ? 'ملفك الشخصي' : lesson.title}</span></p>

        <div className={`px-8 py-3 rounded-2xl text-sm font-bold mb-12 transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-gray-100 text-gray-500'}`}>
          {status}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 ${isMuted ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {isMuted ? '🔈 تشغيل الميكروفون' : '🔇 كتم الصوت'}
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition transform active:scale-95"
          >
            إنهاء المحادثة
          </button>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-2">
           <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">تحدث معي عيني، أنا أسمعك</p>
           <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes waveform {
          0%, 100% { height: 10px; }
          50% { height: 50px; }
        }
        .animate-waveform {
          animation: waveform 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AudioStudySession;
