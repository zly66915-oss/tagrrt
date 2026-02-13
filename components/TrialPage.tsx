
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface TrialPageProps {
  setUser: (user: User) => void;
  navigateTo: (page: string) => void;
}

const TrialPage: React.FC<TrialPageProps> = ({ setUser, navigateTo }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate checking phone usage and sending WhatsApp code
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '1234') {
      alert('كود التحقق غير صحيح، يرجى تجربة 1234');
      return;
    }

    const trialUser: User = {
      id: 'trial-' + Math.random().toString(36).substr(2, 5),
      name: formData.name,
      phone: formData.phone,
      role: UserRole.STUDENT,
      joinedAt: new Date().toISOString(),
      isTrial: true,
      trialStartDate: new Date().toISOString()
    };

    setUser(trialUser);
    localStorage.setItem('user', JSON.stringify(trialUser));
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-emerald-900 p-12 text-white flex flex-col justify-center">
          <div className="mb-8">
            <span className="bg-emerald-400 text-emerald-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">عرض خاص</span>
          </div>
          <h1 className="text-4xl font-black mb-6 leading-tight">جرب المدرسة الصوتية مجاناً لمدة 24 ساعة!</h1>
          <ul className="space-y-4 text-emerald-100/80">
            <li className="flex items-center gap-3">
              <span className="text-emerald-400">✅</span> وصول كامل لجميع الدروس الصوتية
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-400">✅</span> استماع غير محدود للمحتوى
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-400">✅</span> تحميل 3 ملفات PDF مجانية
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-400">✅</span> لا حاجة لبطاقة ائتمان أو دفع مسبق
            </li>
          </ul>
          <div className="mt-12 p-6 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-sm italic">"أردنا أن نمنحك الفرصة لتجربة جودة الدروس بيدك قبل أن تلتزم بأي مبلغ."</p>
            <p className="mt-4 font-bold text-emerald-400">- أستاذ محمد العراقي</p>
          </div>
        </div>

        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-gray-50/50">
          {step === 1 ? (
            <form onSubmit={handleStartTrial} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-gray-900">ابدأ تجربتك المجانية</h2>
                <p className="text-gray-400 mt-2">أدخل بياناتك لتصلك رسالة التفعيل على الواتساب</p>
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
                  placeholder="مثال: علي محمد"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">رقم الهاتف العراقي</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-100 transition disabled:opacity-50"
              >
                {loading ? 'جاري التحقق...' : 'ابدأ التعلم مجاناً'}
              </button>
              
              <p className="text-[10px] text-gray-400 text-center px-4">
                بالضغط على الزر، أنت توافق على شروط الاستخدام وسياسة الخصوصية. التجربة متاحة لمرة واحدة لكل رقم هاتف.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">💬</div>
                <h2 className="text-2xl font-black text-gray-900">تأكيد رقم الهاتف</h2>
                <p className="text-gray-400 mt-2">أرسلنا كود التحقق إلى الرقم <span className="text-emerald-600 font-bold">{formData.phone}</span> عبر الواتساب</p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 text-center uppercase tracking-widest">أدخل الكود (للتجربة: 1234)</label>
                <input 
                  type="text" 
                  required
                  maxLength={4}
                  className="w-full px-6 py-6 bg-white border border-gray-200 rounded-2xl text-center text-4xl font-black tracking-[1em] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-100 transition"
              >
                تفعيل التجربة
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full text-sm font-bold text-gray-400 hover:text-emerald-600 transition"
              >
                تغيير رقم الهاتف
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialPage;
