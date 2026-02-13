
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  setUser: (user: User) => void;
  navigateTo: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUser, navigateTo }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded logic for Admin
    if (phone === '07704382836' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin',
        phone: '07704382836',
        name: 'الأستاذ محمد العراقي',
        role: UserRole.ADMIN,
        joinedAt: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      navigateTo('dashboard');
      return;
    }

    // Simple check for simulation
    if (phone.length >= 10 && password.length >= 4) {
      const studentUser: User = {
        id: 'user-demo',
        phone: phone,
        name: 'طالب عراقي',
        role: UserRole.STUDENT,
        // Mocking an active subscription for some users, ended for others
        subscriptionEndDate: phone.includes('111') ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        joinedAt: new Date().toISOString()
      };
      setUser(studentUser);
      localStorage.setItem('user', JSON.stringify(studentUser));
      navigateTo('dashboard');
    } else {
      setError('بيانات الدخول غير صحيحة، يرجى التأكد من رقم الهاتف وكلمة المرور.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full"></div>
        
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-xl shadow-emerald-100 transform -rotate-3 hover:rotate-0 transition">ع</div>
          <h2 className="text-3xl font-black text-emerald-900">أهلاً بك مجدداً</h2>
          <p className="text-gray-400 mt-2 font-medium">سجل دخولك لمتابعة دروسك الصوتية</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-center font-bold border border-red-100 text-sm leading-relaxed">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">رقم الهاتف</label>
            <input 
              type="tel" 
              required
              placeholder="07XXXXXXXX"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">كلمة المرور</label>
              <button type="button" className="text-xs font-bold text-emerald-600 hover:underline">نسيت كلمة المرور؟</button>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="text-sm font-bold text-gray-500 cursor-pointer">تذكرني على هذا الجهاز</label>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-emerald-200 transition transform active:scale-95"
          >
            دخول للمنصة
          </button>
        </form>

        <div className="mt-10 text-center text-gray-500 font-medium">
          ليس لديك حساب؟ 
          <button 
            onClick={() => navigateTo('register')}
            className="text-emerald-600 font-black mr-2 hover:underline"
          >
            سجل الآن مجاناً
          </button>
        </div>
        
        <div className="mt-10 p-5 bg-amber-50 rounded-2xl text-[11px] text-amber-800 border border-amber-100/50 leading-relaxed">
          <strong className="block mb-1 text-xs">🔐 بيانات التجربة (أدمن):</strong>
          رقم الهاتف: <code className="bg-white px-1 rounded">07704382836</code> | كلمة المرور: <code className="bg-white px-1 rounded">admin123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
