
import React from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';

interface PricingProps {
  navigateTo: (page: string) => void;
  setSelectedPlanId: (id: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ navigateTo, setSelectedPlanId }) => {
  const handleSelect = (id: string) => {
    setSelectedPlanId(id);
    navigateTo('payment');
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">باقات الاشتراك</h2>
        <p className="text-xl text-gray-600 mb-12">اختر الباقة المناسبة لك وابدأ رحلتك التعليمية اليوم</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-3xl p-8 shadow-xl border-2 transition-all hover:scale-105 flex flex-col ${
                plan.id === 'quarterly' ? 'border-emerald-500 relative' : 'border-transparent'
              }`}
            >
              {plan.id === 'quarterly' && (
                <span className="absolute -top-4 right-1/2 translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">الأكثر طلباً</span>
              )}
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">{plan.priceIQD.toLocaleString()}</span>
                <span className="text-gray-500 mr-2 font-bold">دينار عراقي</span>
              </div>
              <p className="text-gray-600 mb-8 flex-grow">{plan.description}</p>
              <ul className="text-right mb-8 space-y-3">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-emerald-500 font-bold">✓</span>
                  وصول كامل لجميع المقاطع الصوتية
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-emerald-500 font-bold">✓</span>
                  تحميل ملفات الـ PDF المرفقة
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-emerald-500 font-bold">✓</span>
                  دعم عبر واتساب
                </li>
              </ul>
              <button 
                onClick={() => handleSelect(plan.id)}
                className={`w-full py-4 rounded-xl font-bold transition text-lg ${
                  plan.id === 'quarterly' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                اشترك الآن
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-6 rounded-2xl max-w-2xl mx-auto shadow-sm border">
          <h4 className="font-bold text-gray-800 mb-2">ملاحظة حول الدفع:</h4>
          <p className="text-gray-600">نقبل الدفع عبر زين كاش، آسياسيل كاش، والماستر كارد. يتم تفعيل الاشتراك فور التأكد من رقم الحوالة.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
