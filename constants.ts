
import { SubscriptionPlan, Lesson } from './types';

export const TEACHER_WHATSAPP = "9647704382836";
export const TEACHER_NAME = "أستاذ محمد العراقي";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'الباقة الشهرية',
    priceUSD: 10,
    priceIQD: 15000,
    durationMonths: 1,
    description: 'وصول كامل لجميع الدروس والملفات لمدة 30 يوم.'
  },
  {
    id: 'quarterly',
    name: 'الباقة الربع سنوية',
    priceUSD: 25,
    priceIQD: 37500,
    durationMonths: 3,
    description: 'وفر أكثر مع اشتراك 3 أشهر (وفر 5,000 دينار).'
  },
  {
    id: 'yearly',
    name: 'الباقة السنوية',
    priceUSD: 90,
    priceIQD: 135000,
    durationMonths: 12,
    description: 'الخيار الأفضل للطلاب الملتزمين، توفير 30,000 دينار.'
  }
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'أساسيات المقامات العراقية - مقام الرست (مجاني)',
    description: 'شرح مفصل لمقام الرست وكيفية أدائه باللهجة العراقية الأصيلة، مع التطبيق العملي على قصائد تراثية. هذا الدرس متاح للجميع مجاناً.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'المقامات',
    level: 'مبتدئ',
    duration: '15:30',
    uploadDate: '2024-03-01',
    isFree: true
  },
  {
    id: '2',
    title: 'تطوير النفس والتحكم بالصوت',
    description: 'تمارين يومية للمنشدين والقراء لزيادة مساحة النفس والتحكم في طبقات الصوت العالية والمنخفضة.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'تمارين صوتية',
    level: 'متوسط',
    duration: '12:45',
    uploadDate: '2024-03-05'
  },
  {
    id: '3',
    title: 'مقام البيات وكيفية الانتقال منه',
    description: 'درس متقدم حول مقام البيات العراقي والتحويلات المقامية الشائعة التي تستخدم في الأبوذية والمنقبة.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    category: 'المقامات',
    level: 'متقدم',
    duration: '20:10',
    uploadDate: '2024-03-10'
  }
];
