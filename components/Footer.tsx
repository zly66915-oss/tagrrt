
import React from 'react';

interface FooterProps {
  navigateTo: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-emerald-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">دروس صوتي العراقي</h3>
          <p className="text-emerald-100/70 mb-6 max-w-sm leading-relaxed">
            المنصة التعليمية الأولى في العراق المتخصصة في تدريب الصوت وتعليم المقامات بأسلوب أكاديمي حديث وتراثي أصيل.
          </p>
          <div className="flex gap-4">
            <span className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-800 transition cursor-pointer">FB</span>
            <span className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-800 transition cursor-pointer">IG</span>
            <span className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-800 transition cursor-pointer">YT</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-emerald-400">روابط سريعة</h4>
          <ul className="space-y-2 text-emerald-100/70">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white">الرئيسية</button></li>
            <li><button onClick={() => navigateTo('pricing')} className="hover:text-white">باقات الاشتراك</button></li>
            <li><button onClick={() => navigateTo('about')} className="hover:text-white">عن المنصة</button></li>
            <li><button onClick={() => navigateTo('faq')} className="hover:text-white">الأسئلة الشائعة</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 text-emerald-400">الدعم الفني</h4>
          <ul className="space-y-2 text-emerald-100/70">
            <li>واتساب: 07704382836</li>
            <li>ساعات العمل: 10ص - 10م</li>
            <li><button onClick={() => navigateTo('privacy')} className="hover:text-white">سياسة الخصوصية</button></li>
            <li><button onClick={() => navigateTo('terms')} className="hover:text-white">شروط الاستخدام</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-emerald-900/50 text-center text-emerald-100/50 text-sm">
        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} دروس صوتي العراقي - صنع بكل حب في بغداد 🇮🇶
      </div>
    </footer>
  );
};

export default Footer;
