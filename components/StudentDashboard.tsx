
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Lesson, AppNotification, UserRole } from '../types';
import { TEACHER_WHATSAPP } from '../constants';
import AIStudyAssistant from './AIStudyAssistant';
import AudioStudySession from './AudioStudySession';

interface StudentDashboardProps {
  user: User;
  lessons: Lesson[];
  navigateTo: (page: string) => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, lessons, navigateTo, notifications, setNotifications }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'lessons' | 'notifications' | 'files'>('lessons');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAudioSession, setShowAudioSession] = useState(false);
  
  // New State for Personal PDF Upload
  const [isExtracting, setIsExtracting] = useState(false);
  const [customPdfText, setCustomPdfText] = useState<string>('');
  const [customFileName, setCustomFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subscriptionStatus = useMemo(() => {
    if (user.isGuest) return { isSubscribed: false, daysLeft: 0, progress: 0, type: 'guest', msLeft: 0 };

    if (user.isTrial && user.trialStartDate) {
      const end = new Date(user.trialStartDate);
      end.setHours(end.getHours() + 24);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      const isSubscribed = diff > 0;
      return { isSubscribed, daysLeft: 1, progress: Math.max(0, (diff / (24 * 60 * 60 * 1000)) * 100), type: 'trial', msLeft: diff };
    }

    if (!user.subscriptionEndDate) return { isSubscribed: false, daysLeft: 0, progress: 0, type: 'none', msLeft: 0 };
    const end = new Date(user.subscriptionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, Math.max(0, (days / 30) * 100));
    return { isSubscribed: days > 0, daysLeft: days, progress, type: 'paid', msLeft: diff };
  }, [user.subscriptionEndDate, user.isTrial, user.trialStartDate, user.isGuest]);

  useEffect(() => {
    if (subscriptionStatus.type === 'trial' && subscriptionStatus.isSubscribed) {
      const interval = setInterval(() => {
        const end = new Date(user.trialStartDate!);
        end.setHours(end.getHours() + 24);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeLeft('انتهت التجربة');
          clearInterval(interval);
        } else {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [subscriptionStatus, user.trialStartDate]);

  const filteredLessons = lessons.filter(l => 
    l.title.includes(searchTerm) || l.category.includes(searchTerm)
  );

  const unreadCount = notifications.filter(n => n.userId === user.id && !n.isRead).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const isPlayable = (lesson: Lesson) => {
    return lesson.isFree || subscriptionStatus.isSubscribed;
  };

  const openAudioForLesson = (lesson: Lesson, isCustom = false) => {
    setActiveLesson(lesson);
    setShowAudioSession(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('يرجى رفع ملف بصيغة PDF فقط عيني');
      return;
    }

    setIsExtracting(true);
    setCustomFileName(file.name);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore (pdfjsLib is loaded in index.html)
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      
      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) { // Limit to 10 pages for speed
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      
      setCustomPdfText(text);
      // Create a dummy lesson for the audio session context
      const dummyLesson: Lesson = {
        id: 'custom-' + Date.now(),
        title: file.name,
        description: 'ملف مرفوع من قبل الطالب للدراسة الخاصة.',
        audioUrl: '',
        category: 'ملف شخصي',
        level: 'خاص',
        duration: '--:--',
        uploadDate: new Date().toISOString()
      };
      
      setActiveLesson(dummyLesson);
      setShowAudioSession(true);
    } catch (err) {
      console.error(err);
      alert('نعتذر، صار خلل أثناء قراءة الملف. حاول مرة ثانية.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* AI Assistant Modal */}
      {showAIAssistant && activeLesson && (
        <AIStudyAssistant 
          lesson={activeLesson} 
          user={user} 
          onClose={() => setShowAIAssistant(false)} 
        />
      )}

      {/* Audio Session Modal */}
      {showAudioSession && activeLesson && (
        <AudioStudySession 
          lesson={activeLesson}
          user={user}
          onClose={() => {
            setShowAudioSession(false);
            setCustomPdfText(''); // Clear context on close
          }}
          customPdfText={customPdfText}
        />
      )}

      {/* Trial Countdown Banner */}
      {user.isTrial && subscriptionStatus.isSubscribed && (
        <div className="fixed top-16 left-0 w-full bg-amber-600 text-white py-2 px-4 z-40 flex justify-center items-center gap-4 shadow-lg border-b border-amber-500 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
          <span className="font-black text-sm relative z-10">🎁 تجربتك المجانية تنتهي خلال:</span>
          <span className="font-mono text-xl font-black bg-white/20 px-3 py-1 rounded-lg relative z-10">{timeLeft}</span>
          <button 
            onClick={() => navigateTo('pricing')}
            className="bg-white text-amber-700 px-4 py-1 rounded-full text-xs font-black shadow-md hover:scale-105 transition relative z-10"
          >
            اشترك الآن واستمر
          </button>
        </div>
      )}

      <header className={`mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 ${user.isTrial && subscriptionStatus.isSubscribed ? 'mt-12' : ''}`}>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">أهلاً بك، {user.name} 👋</h1>
          <p className="text-gray-500 mt-1">رحلتك التعليمية في مقاماتنا العراقية تبدأ من هنا.</p>
        </div>
        
        {!user.isGuest && !user.isAnonymousTrial && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">حالة الاشتراك</span>
                <span className={`text-xs font-black ${subscriptionStatus.isSubscribed ? 'text-emerald-600' : 'text-red-500'}`}>
                   {subscriptionStatus.isSubscribed ? `${subscriptionStatus.daysLeft} يوم متبقي` : 'منتهي'}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${subscriptionStatus.isSubscribed ? 'bg-emerald-500' : 'bg-red-400'}`} 
                  style={{ width: `${subscriptionStatus.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('lessons')}
          className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'lessons' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          الدروس الجاهزة
        </button>
        <button 
          onClick={() => setActiveTab('files')}
          className={`px-6 py-2 rounded-xl font-bold transition ${activeTab === 'files' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${user.isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={user.isGuest}
        >
          المكتبة والرفع الخاص
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-2 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'notifications' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${user.isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={user.isGuest}
        >
          الإشعارات
          {unreadCount > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">{unreadCount}</span>}
        </button>
      </div>

      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lessons list and player as before */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="ابحث عن درس..."
                className="w-full px-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1">
              {filteredLessons.map(lesson => {
                const playable = isPlayable(lesson);
                return (
                  <button 
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-right p-4 rounded-2xl border-2 transition relative group ${
                      activeLesson?.id === lesson.id ? 'border-emerald-600 bg-emerald-50' : 'border-transparent bg-white shadow-sm hover:border-emerald-100'
                    } ${!playable && 'opacity-60 grayscale-[0.5]'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{lesson.category}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">{lesson.duration}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-800 transition">{lesson.title}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeLesson ? (
              <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="h-48 bg-emerald-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img src={`https://picsum.photos/seed/${activeLesson.id}/800/400`} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute bottom-6 right-8 z-20">
                    <span className="text-emerald-400 text-sm font-bold block mb-1 uppercase tracking-widest">{activeLesson.category}</span>
                    <h2 className="text-3xl font-black text-white">{activeLesson.title}</h2>
                  </div>
                </div>
                
                <div className="p-8">
                  {isPlayable(activeLesson) ? (
                    <>
                      <p className="text-gray-600 mb-8 leading-relaxed text-lg border-r-4 border-emerald-500 pr-6">
                        {activeLesson.description}
                      </p>
                      
                      {activeLesson.audioUrl && (
                        <div className="bg-gray-50 p-8 rounded-3xl mb-8 border border-gray-100">
                          <audio controls className="w-full h-14 custom-audio-player" src={activeLesson.audioUrl} controlsList="nodownload" />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => setShowAIAssistant(true)}
                          className="flex items-center justify-center gap-3 bg-white text-emerald-700 py-4 rounded-2xl font-bold border-2 border-emerald-100 hover:bg-emerald-50 transition"
                        >
                          <span>💬</span> دردشة كتابية
                        </button>
                        <button 
                          onClick={() => setShowAudioSession(true)}
                          className="flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition"
                        >
                          <span>🎙️</span> مكالمة دراسية مباشرة
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20 px-10">
                       <h3 className="text-2xl font-black text-gray-900 mb-4">هذا الدرس متاح للمشتركين فقط</h3>
                       <button onClick={() => navigateTo('pricing')} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg">مشاهدة الباقات</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] shadow-sm border-2 border-dashed border-gray-200 h-[600px] flex flex-col items-center justify-center text-center p-10">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">🎧</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر درساً للبدء</h2>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'files' && !user.isGuest && (
        <div className="space-y-10">
          {/* Custom Upload Area */}
          <div className="bg-emerald-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-right">
                <h2 className="text-3xl font-black mb-4">المعلم العراقي الذكي بانتظار ملفك!</h2>
                <p className="text-emerald-100/70 text-lg mb-8 leading-relaxed">
                  ارفع أي ملف PDF (محاضرة، كتاب، ملخص) وسيقوم المدرس الذكي بقراءته ومناقشته معك صوتياً فوراً باللهجة العراقية.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExtracting}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-4 rounded-2xl font-black text-lg transition flex items-center gap-3 disabled:opacity-50"
                  >
                    <span>{isExtracting ? 'جاري التحليل...' : '📁 ارفع ملف PDF الآن'}</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleFileUpload} 
                  />
                </div>
              </div>
              <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-7xl shadow-2xl border border-white/20 animate-pulse">
                🤖
              </div>
            </div>
          </div>

          {/* Library Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 className="col-span-full text-2xl font-black text-gray-900 mb-4 border-r-4 border-emerald-600 pr-4">مكتبة الدروس المرفقة</h2>
            {lessons.filter(l => l.pdfUrl).map(lesson => (
              <div key={lesson.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-[1.2rem] flex items-center justify-center text-2xl mb-4">📄</div>
                <h4 className="font-bold text-gray-900 mb-2 leading-tight">{lesson.title}</h4>
                <p className="text-xs text-gray-400 mb-6 uppercase font-bold tracking-widest">{lesson.category}</p>
                
                <div className="flex flex-col gap-2 mt-auto">
                  <button 
                    onClick={() => openAudioForLesson(lesson)}
                    className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-200 transition"
                  >
                    <span>🎙️</span> دردشة صوتية حول المادة
                  </button>
                  <div className="flex gap-2">
                    <a href={lesson.pdfUrl} target="_blank" className="flex-1 bg-red-50 text-red-700 py-3 rounded-xl text-center text-xs font-bold border border-red-100">فتح</a>
                    <a href={lesson.pdfUrl} download className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl text-center text-xs font-bold border border-gray-100">تحميل</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Tabs as before... */}
    </div>
  );
};

export default StudentDashboard;
