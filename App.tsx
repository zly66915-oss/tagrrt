
import React, { useState, useEffect } from 'react';
import { User, UserRole, Lesson, PaymentRequest, PaymentStatus, AppNotification } from './types';
import { TEACHER_WHATSAPP, MOCK_LESSONS } from './constants';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Pricing from './components/Pricing';
import WhatsAppButton from './components/WhatsAppButton';
import PaymentPage from './components/PaymentPage';
import Footer from './components/Footer';
import TrialPage from './components/TrialPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Persistence (Simulated)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedPayments = localStorage.getItem('payments');
    if (savedPayments) setPayments(JSON.parse(savedPayments));

    const savedLessons = localStorage.getItem('lessons');
    if (savedLessons) setLessons(JSON.parse(savedLessons));
    
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const startInstantTrial = () => {
    const trialUser: User = {
      id: 'anon-trial-' + Math.random().toString(36).substr(2, 5),
      phone: '',
      name: 'مستخدم تجريبي',
      role: UserRole.STUDENT,
      joinedAt: new Date().toISOString(),
      isTrial: true,
      isAnonymousTrial: true,
      trialStartDate: new Date().toISOString()
    };
    setUser(trialUser);
    localStorage.setItem('user', JSON.stringify(trialUser));
    navigateTo('dashboard');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'date' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      isRead: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const renderPage = () => {
    // Guest dummy user for dashboard
    const guestUser: User = {
      id: 'guest',
      phone: '0000000000',
      name: 'زائر المنصة',
      role: UserRole.VISITOR,
      joinedAt: new Date().toISOString(),
      isGuest: true
    };

    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} startInstantTrial={startInstantTrial} />;
      case 'login':
        return <Login setUser={setUser} navigateTo={navigateTo} />;
      case 'register':
        return <Register setUser={setUser} navigateTo={navigateTo} />;
      case 'trial':
        return <TrialPage setUser={setUser} navigateTo={navigateTo} />;
      case 'pricing':
        return <Pricing navigateTo={navigateTo} setSelectedPlanId={setSelectedPlanId} />;
      case 'payment':
        return user ? 
          <PaymentPage user={user} planId={selectedPlanId || 'monthly'} navigateTo={navigateTo} setPayments={setPayments} payments={payments} /> : 
          <Login setUser={setUser} navigateTo={navigateTo} />;
      case 'dashboard':
        // Allow dashboard access for visitors as guests
        if (!user) {
           return <StudentDashboard user={guestUser} lessons={lessons} navigateTo={navigateTo} notifications={[]} setNotifications={() => {}} />;
        }
        return user.role === UserRole.ADMIN ? 
          <AdminDashboard 
            lessons={lessons} 
            setLessons={setLessons} 
            payments={payments} 
            setPayments={setPayments} 
            navigateTo={navigateTo}
            addNotification={addNotification}
          /> : 
          <StudentDashboard user={user} lessons={lessons} navigateTo={navigateTo} notifications={notifications} setNotifications={setNotifications} />;
      case 'about':
        return (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-emerald-800 mb-6">عن المنصة</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              منصة "دروس صوتي العراقي" هي أول منصة متخصصة لتعليم المقامات العراقية وفنون الصوت باللهجة المحلية، نهدف لتمكين الموهوبين في العراق والوطن العربي من إتقان التراث العراقي الأصيل.
            </p>
          </div>
        );
      default:
        return <Home navigateTo={navigateTo} startInstantTrial={startInstantTrial} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} navigateTo={navigateTo} handleLogout={handleLogout} startInstantTrial={startInstantTrial} />
      <main className="flex-grow pt-16">
        {renderPage()}
      </main>
      <Footer navigateTo={navigateTo} />
      <WhatsAppButton phoneNumber={TEACHER_WHATSAPP} />
    </div>
  );
};

export default App;
