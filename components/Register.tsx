
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface RegisterProps {
  setUser: (user: User) => void;
  navigateTo: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setUser, navigateTo }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (phone.length < 10) {
      setError('رقم الهاتف غير صحيح');
      return;
    }

    const newUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 5),
      phone,
      name,
      role: UserRole.STUDENT,
      joinedAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    navigateTo('pricing'); 
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
        
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-black text-emerald-900">إنشاء حساب جديد</h2>
          <p className="text-gray-400 mt-2 font-medium">ابدأ رحلتك في تعلم التراث العراقي الصوتي</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-center font-bold border border-red-100 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">الاسم الكامل</label>
            <input 
              type="text" 
              required
              placeholder="مثال: أحمد علي البغدادي"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">رقم الهاتف العراقي</label>
            <input 
              type="tel" 
              required
              placeholder="07XXXXXXXX"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">كلمة المرور</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">تأكيد كلمة المرور</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-emerald-200 transition transform active:scale-95"
            >
              إنشاء الحساب الآن
            </button>
          </div>
        </form>

        <div className="mt-10 text-center text-gray-500 font-medium">
          لديك حساب بالفعل؟ 
          <button 
            onClick={() => navigateTo('login')}
            className="text-emerald-600 font-black mr-2 hover:underline"
          >
            دخول
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
