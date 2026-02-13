
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  navigateTo: (page: string) => void;
  handleLogout: () => void;
  startInstantTrial: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, navigateTo, handleLogout, startInstantTrial }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigateTo('home')}
              className="flex-shrink-0 flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">ع</div>
              <span className="text-xl font-bold text-emerald-800 hidden md:block">دروس صوتي العراقي</span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-reverse space-x-6">
            <button onClick={() => navigateTo('home')} className="text-gray-700 hover:text-emerald-600 font-medium">الرئيسية</button>
            <button onClick={() => navigateTo('pricing')} className="text-gray-700 hover:text-emerald-600 font-medium">الاشتراكات</button>
            <button onClick={() => navigateTo('about')} className="text-gray-700 hover:text-emerald-600 font-medium">عن الموقع</button>
            
            {user ? (
              <div className="flex items-center gap-4 mr-6 border-r pr-6">
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-200 transition"
                >
                  {user.role === UserRole.ADMIN ? 'لوحة المشرف' : 'لوحتي الخاصة'}
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={startInstantTrial}
                  className="bg-amber-100 text-amber-700 px-5 py-2 rounded-lg font-bold hover:bg-amber-200 transition border border-amber-200"
                >
                  جرب مجاناً 🎁
                </button>
                <button 
                  onClick={() => navigateTo('login')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  دخول
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
                >
                  سجل الآن
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg">
          <button onClick={() => {navigateTo('home'); setIsOpen(false)}} className="block w-full text-right py-2 text-gray-700 font-medium">الرئيسية</button>
          <button onClick={() => {navigateTo('pricing'); setIsOpen(false)}} className="block w-full text-right py-2 text-gray-700 font-medium">الاشتراكات</button>
          <button onClick={() => {startInstantTrial(); setIsOpen(false)}} className="block w-full text-center py-2 bg-amber-100 text-amber-800 rounded-lg font-bold">جرب مجاناً 🎁</button>
          {user ? (
            <>
              <button onClick={() => {navigateTo('dashboard'); setIsOpen(false)}} className="block w-full text-right py-2 text-emerald-600 font-bold border-t pt-4">لوحة التحكم</button>
              <button onClick={() => {handleLogout(); setIsOpen(false)}} className="block w-full text-right py-2 text-red-600 font-medium">خروج</button>
            </>
          ) : (
            <div className="space-y-2 pt-4 border-t">
              <button onClick={() => {navigateTo('login'); setIsOpen(false)}} className="block w-full text-center py-2 text-emerald-600 border border-emerald-600 rounded-lg">دخول</button>
              <button onClick={() => {navigateTo('register'); setIsOpen(false)}} className="block w-full text-center py-2 bg-emerald-600 text-white rounded-lg">سجل الآن</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
