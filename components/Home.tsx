
import React from 'react';

interface HomeProps {
  navigateTo: (page: string) => void;
  startInstantTrial: () => void;
}

const Home: React.FC<HomeProps> = ({ navigateTo, startInstantTrial }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 opacity-40">
           <img src="https://picsum.photos/seed/iraq-voice/1600/900" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-emerald-900/90"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-block bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-6 py-2 rounded-full font-bold mb-8 animate-bounce">
            🎉 متاح الآن: تجربة كاملة لمدة 24 ساعة - بضغطة واحدة!
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            تعلم أصول الصوت والمقامات <br/> <span className="text-emerald-400 italic">باللهجة العراقية</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-medium">
            موقع تعليمي عراقي متكامل يقدم دروساً صوتية مسجلة احترافية وملفات PDF تعليمية لمساعدتك في رحلتك الصوتية.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5">
            <button 
              onClick={startInstantTrial}
              className="bg-white hover:bg-gray-100 text-emerald-900 px-10 py-5 rounded-[2rem] text-xl font-black transition transform hover:scale-105 shadow-2xl w-full md:w-auto flex items-center gap-3 justify-center border-b-4 border-gray-300"
            >
              <span>▶️</span> ابدأ التجربة المجانية (بدون تسجيل)
            </button>
            <button 
              onClick={() => navigateTo('pricing')}
              className="bg-amber-500 hover:bg-amber-600 text-emerald-950 px-10 py-5 rounded-[2rem] text-xl font-black transition transform hover:scale-105 shadow-2xl w-full md:w-auto flex items-center gap-3 justify-center"
            >
              <span>💰</span> عرض باقات الاشتراك
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-white/60">
             <div className="text-center">
               <p className="text-2xl font-black text-white">450+</p>
               <p className="text-xs uppercase tracking-widest font-bold">طالب مشترك</p>
             </div>
             <div className="w-px h-8 bg-white/20"></div>
             <div className="text-center">
               <p className="text-2xl font-black text-white">1200+</p>
               <p className="text-xs uppercase tracking-widest font-bold">درس صوتي</p>
             </div>
             <div className="w-px h-8 bg-white/20"></div>
             <div className="text-center">
               <p className="text-2xl font-black text-white">24h</p>
               <p className="text-xs uppercase tracking-widest font-bold">دعم فني</p>
             </div>
          </div>
        </div>
      </section>

      {/* Trial Promo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
           <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
              <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
                 <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-snug">لماذا نقدم لك يوماً كاملاً مجاناً؟</h2>
                 <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                   نحن نثق في جودة المحتوى التعليمي الذي نقدمه. نريد أن نمنحك الفرصة لاكتشاف الدروس، الاستماع للمقامات، والاطلاع على ملفات الـ PDF بنفسك قبل أن تقرر الاشتراك.
                 </p>
                 <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-emerald-800 font-bold">
                       <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs">✓</div>
                       وصول كامل لجميع المكتبة الصوتية
                    </li>
                    <li className="flex items-center gap-3 text-emerald-800 font-bold">
                       <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs">✓</div>
                       لا يتطلب إدخال أي بيانات بنكية
                    </li>
                    <li className="flex items-center gap-3 text-emerald-800 font-bold">
                       <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs">✓</div>
                       إلغاء تلقائي بعد 24 ساعة
                    </li>
                 </ul>
                 <button 
                   onClick={startInstantTrial}
                   className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-emerald-700 transition"
                 >
                   ابدأ تجربة الـ 24 ساعة الآن
                 </button>
              </div>
              <div className="md:w-1/2 relative min-h-[400px]">
                 <img src="https://picsum.photos/seed/iraq-study/800/1000" className="absolute inset-0 w-full h-full object-cover" alt="Student studying" />
                 <div className="absolute inset-0 bg-emerald-900/20"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">مميزات المنصة التعليمية</h2>
            <div className="w-24 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "دروس صوتية حصرية", desc: "تسجيلات عالية الجودة تشرح أدق تفاصيل المقامات العراقية وفن التجويد والإنشاد.", icon: "🎵" },
              { title: "ملفات PDF ملخصة", desc: "لكل درس ملف PDF يحتوي على النوتات والكلمات والشرح المكتوب لسهولة المراجعة.", icon: "📄" },
              { title: "متابعة مستمرة", desc: "دعم فني وتواصل مباشر مع المدرس عبر الواتساب للإجابة على تساؤلاتك وتصحيح أدائك.", icon: "📱" }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-gray-50 rounded-[2.5rem] text-center hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-emerald-100 group">
                <div className="text-6xl mb-8 group-hover:scale-110 transition duration-500">{f.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-emerald-900">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-emerald-900 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-black mb-12">ماذا يقول طلابنا؟</h2>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-[3rem] relative">
               <span className="absolute -top-10 left-10 text-9xl text-emerald-500 opacity-30 font-serif">“</span>
               <p className="text-2xl font-medium leading-relaxed italic mb-8">
                 "كنت أبحث طويلاً عن مدرس يفهم خصوصية المقامات العراقية، والحمد لله وجدت ضالتي في هذا الموقع. الدروس واضحة جداً والمتابعة عبر الواتساب جعلتني أشعر أن الأستاذ معي في البيت."
               </p>
               <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-2xl">ع</div>
                  <div className="text-right">
                     <p className="font-black text-xl">علي حسين البغدادي</p>
                     <p className="text-emerald-400 font-bold">طالب في السنة الأولى</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
