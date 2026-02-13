
import React, { useState, useMemo } from 'react';
import { Lesson, PaymentRequest, PaymentStatus, User, UserRole, AppNotification } from '../types';
import { TEACHER_WHATSAPP } from '../constants';

interface AdminDashboardProps {
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  payments: PaymentRequest[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRequest[]>>;
  navigateTo: (page: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'isRead'>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lessons, setLessons, payments, setPayments, navigateTo, addNotification }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'payments' | 'students' | 'lessons' | 'trials'>('stats');
  const [studentSearch, setStudentSearch] = useState('');
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Mocked Students from Payments + Hardcoded for UI demo
  const students = useMemo(() => {
    const studentList: User[] = [];
    const uniquePhones = new Set<string>();
    
    payments.forEach(p => {
      if (!uniquePhones.has(p.userPhone)) {
        uniquePhones.add(p.userPhone);
        studentList.push({
          id: p.userId,
          name: p.userName,
          phone: p.userPhone,
          role: UserRole.STUDENT,
          joinedAt: p.date,
          subscriptionEndDate: p.status === PaymentStatus.CONFIRMED ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
        });
      }
    });
    return studentList.filter(s => s.name.includes(studentSearch) || s.phone.includes(studentSearch));
  }, [payments, studentSearch]);

  const handleConfirmPayment = (payment: PaymentRequest) => {
    const updated = payments.map(p => {
      if (p.id === payment.id) {
        return { ...p, status: PaymentStatus.CONFIRMED };
      }
      return p;
    });
    setPayments(updated);
    localStorage.setItem('payments', JSON.stringify(updated));
    
    // Notify Student
    addNotification({
      userId: payment.userId,
      title: 'تم تفعيل اشتراكك! 🎉',
      message: `أهلاً بك في باقة ${payment.planName}. تم تأكيد دفعتك بقيمة ${payment.amount.toLocaleString()} د.ع. يمكنك الآن البدء بالتعلم.`,
      type: 'subscription'
    });

    alert('تم تأكيد الدفعة وتفعيل اشتراك الطالب بنجاح.');
  };

  const handleRejectPayment = (payment: PaymentRequest) => {
    const reason = prompt('أدخل سبب الرفض (اختياري):');
    const updated = payments.map(p => {
      if (p.id === payment.id) {
        return { ...p, status: PaymentStatus.REJECTED, rejectReason: reason || 'بيانات غير صحيحة' };
      }
      return p;
    });
    setPayments(updated);
    localStorage.setItem('payments', JSON.stringify(updated));

    addNotification({
      userId: payment.userId,
      title: 'طلب الاشتراك مرفوض ❌',
      message: `نعتذر منك، لم نتمكن من تأكيد حوالتك. السبب: ${reason || 'يرجى مراجعة بيانات العملية'}. يرجى التواصل مع الدعم.`,
      type: 'payment'
    });
  };

  const totalRevenue = payments
    .filter(p => p.status === PaymentStatus.CONFIRMED)
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = {
    active: students.filter(s => s.subscriptionEndDate && new Date(s.subscriptionEndDate) > new Date()).length,
    newThisMonth: students.filter(s => new Date(s.joinedAt).getMonth() === new Date().getMonth()).length,
    pendingPayments: payments.filter(p => p.status === PaymentStatus.PENDING).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">لوحة تحكم الأستاذ محمد</h1>
          <p className="text-gray-500 mt-1">إدارة كاملة للطلاب، الدروس، والمدفوعات العراقية.</p>
        </div>
        
        <div className="flex bg-white rounded-2xl shadow-sm border p-1.5 overflow-x-auto max-w-full">
          {[
            { id: 'stats', label: 'الرئيسية', icon: '📊' },
            { id: 'payments', label: `المدفوعات (${stats.pendingPayments})`, icon: '💰' },
            { id: 'students', label: 'الطلاب', icon: '👥' },
            { id: 'trials', label: 'التجريبي', icon: '🎁' },
            { id: 'lessons', label: 'الدروس', icon: '📚' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-emerald-600'}`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-emerald-50 text-7xl group-hover:scale-110 transition">👥</div>
              <p className="text-gray-400 text-sm font-bold mb-1 relative z-10">المشتركون النشطون</p>
              <p className="text-5xl font-black text-emerald-800 relative z-10">{stats.active}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-emerald-50 text-7xl group-hover:scale-110 transition">💰</div>
              <p className="text-gray-400 text-sm font-bold mb-1 relative z-10">إجمالي الإيرادات</p>
              <p className="text-5xl font-black text-emerald-800 relative z-10">{totalRevenue.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1 relative z-10">دينار عراقي</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 text-emerald-50 text-7xl group-hover:scale-110 transition">💎</div>
              <p className="text-gray-400 text-sm font-bold mb-1 relative z-10">نسبة تحول التجريبي</p>
              <p className="text-5xl font-black text-emerald-800 relative z-10">24%</p>
              <p className="text-[10px] font-bold text-emerald-400 mt-1 relative z-10">معدل تحول جيد جداً</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-amber-50 text-7xl group-hover:scale-110 transition">⌛</div>
              <p className="text-gray-400 text-sm font-bold mb-1 relative z-10">طلبات معلقة</p>
              <p className="text-5xl font-black text-amber-600 relative z-10">{stats.pendingPayments}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>📅</span> آخر المشتركين
                </h3>
                <div className="space-y-4">
                  {students.slice(0, 5).map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">{s.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.phone}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{new Date(s.joinedAt).toLocaleDateString('ar-IQ')}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>💸</span> ملخص التكاليف (Google Cloud)
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 font-bold">الاستضافة الحالية</span>
                      <span className="text-red-600 font-black">$12.50 / شهر</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs leading-relaxed">
                    <strong>تنبيه الأرباح:</strong> أنت تحقق حالياً صافي ربح 7$ لكل طالب، وهو يتجاوز هدف الـ 5$.
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">طلبات الدفع الواردة</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-700">الطالب</th>
                  <th className="px-6 py-4 font-bold text-gray-700">الباقة والمبلغ</th>
                  <th className="px-6 py-4 font-bold text-gray-700">الوسيلة / رقم العملية</th>
                  <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                  <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.length > 0 ? [...payments].reverse().map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{payment.userName}</div>
                      <div className="text-xs text-gray-400">{payment.userPhone}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-800">{payment.planName}</td>
                    <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{payment.transactionId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                        payment.status === PaymentStatus.CONFIRMED ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {payment.status === PaymentStatus.CONFIRMED ? 'تم التأكيد' : 'قيد المراجعة'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === PaymentStatus.PENDING && (
                        <div className="flex gap-2">
                          <button onClick={() => handleConfirmPayment(payment)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold">تأكيد</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-20 text-center text-gray-400">لا توجد دفعات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'trials' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <h3 className="text-xl font-bold mb-4">تحليلات التجربة المجانية (24 ساعة)</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl">
                   <p className="text-gray-500 text-sm font-bold">إجمالي المجربين</p>
                   <p className="text-3xl font-black text-blue-800">452</p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl">
                   <p className="text-gray-500 text-sm font-bold">تحولوا لمشتركين</p>
                   <p className="text-3xl font-black text-emerald-800">108</p>
                </div>
                <div className="p-6 bg-amber-50 rounded-2xl">
                   <p className="text-gray-500 text-sm font-bold">نشطون حالياً</p>
                   <p className="text-3xl font-black text-amber-800">14</p>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-right">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-700">المجرب</th>
                    <th className="px-6 py-4 font-bold text-gray-700">تاريخ البدء</th>
                    <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                    <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                   <tr className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">حسين علي</div>
                        <div className="text-xs text-gray-400">07812345678</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">قبل ساعتين</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">نشط حالياً</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="bg-green-100 p-2 rounded-lg hover:bg-green-200 transition">💬</button>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map(lesson => (
            <div key={lesson.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-xl text-gray-900 mb-2">{lesson.title}</h3>
              <p className="text-sm text-gray-400 mb-6">{lesson.description}</p>
              <div className="mt-auto pt-6 border-t flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                <span>{lesson.category}</span>
                <span>{lesson.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
