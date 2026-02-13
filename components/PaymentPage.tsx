
import React, { useState } from 'react';
// Corrected imports: SUBSCRIPTION_PLANS and TEACHER_WHATSAPP belong in constants.ts
import { User, PaymentRequest, PaymentStatus } from '../types';
import { SUBSCRIPTION_PLANS as PLANS, TEACHER_WHATSAPP } from '../constants';

interface PaymentPageProps {
  user: User;
  planId: string;
  navigateTo: (page: string) => void;
  setPayments: React.Dispatch<React.SetStateAction<PaymentRequest[]>>;
  payments: PaymentRequest[];
}

const PaymentPage: React.FC<PaymentPageProps> = ({ user, planId, navigateTo, setPayments, payments }) => {
  const plan = PLANS.find(p => p.id === planId) || PLANS[0];
  const [wallet, setWallet] = useState<'ZainCash' | 'AsiaCell' | 'QiCard'>('ZainCash');
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId) return alert('يرجى إدخال رقم العملية');

    setLoading(true);
    
    const newPayment: PaymentRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      amount: plan.priceIQD,
      walletType: wallet,
      transactionId: txId,
      status: PaymentStatus.PENDING,
      date: new Date().toISOString(),
      planName: plan.name
    };

    // Simulate API call
    setTimeout(() => {
      const updated = [...payments, newPayment];
      setPayments(updated);
      localStorage.setItem('payments', JSON.stringify(updated));
      setLoading(false);
      setMessage('تم استلام طلبك! سيتم مراجعة الدفعة وتفعيل الاشتراك خلال ساعة عمل. سيصلك تنبيه عبر واتساب.');
      
      // Notify Teacher via WhatsApp Link (simulated click later)
      const msg = encodeURIComponent(`مرحباً أستاذ، لقد أرسلت حوالة بقيمة ${plan.priceIQD} على محفظة ${wallet}. رقم العملية: ${txId}. يرجى تفعيل اشتراكي.`);
      window.open(`https://wa.me/${TEACHER_WHATSAPP}?text=${msg}`, '_blank');
    }, 1500);
  };

  if (message) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white p-8 rounded-3xl shadow-xl text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">شكراً لك!</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <button 
          onClick={() => navigateTo('dashboard')}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl w-full font-bold"
        >
          الذهاب للوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">تأكيد الاشتراك</h2>
        
        <div className="bg-emerald-50 p-6 rounded-2xl mb-8 border border-emerald-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">الباقة المختارة:</span>
            <span className="font-bold text-emerald-800">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">المبلغ المطلوب:</span>
            <span className="text-2xl font-black text-emerald-700">{plan.priceIQD.toLocaleString()} دينار</span>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-lg mb-4">طريقة التحويل:</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border-2 border-emerald-500 bg-emerald-50/50 rounded-2xl flex items-center gap-4">
              <div className="bg-emerald-600 text-white p-3 rounded-full">💰</div>
              <div>
                <p className="font-bold text-gray-900">حوّل المبلغ إلى هذا الرقم:</p>
                <p className="text-2xl font-black text-emerald-700 tracking-wider">07704382836</p>
                <p className="text-sm text-gray-500">ملاحظة: هذا الرقم يدعم (زين كاش، آسياسيل، كلك)</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع المحفظة المستخدمة</label>
            <div className="grid grid-cols-3 gap-3">
              {(['ZainCash', 'AsiaCell', 'QiCard'] as const).map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWallet(w)}
                  className={`py-3 rounded-xl font-medium border-2 transition ${
                    wallet === w ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-500'
                  }`}
                >
                  {w === 'ZainCash' ? 'زين كاش' : w === 'AsiaCell' ? 'آسياسيل' : 'كلك/Qi'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم العملية (Transaction ID)</label>
            <input 
              type="text" 
              required
              placeholder="أدخل الرقم الموجود في رسالة التأكيد"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'تأكيد الدفع وإرسال الطلب'}
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            بعد الضغط سيتم توجيهك للواتساب لإعلام الأستاذ بالتحويل تلقائياً.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
