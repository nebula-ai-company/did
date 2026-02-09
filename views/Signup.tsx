import React, { useState } from 'react';
import { Mail, User, Phone, HelpCircle, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { AuthSidePanel } from '../components/AuthSidePanel';
import { AppView } from '../types';

interface SignupProps {
  onChangeView: (view: AppView) => void;
}

export const Signup: React.FC<SignupProps> = ({ onChangeView }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    source: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    onChangeView(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-bg transition-colors duration-200">
      
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto animate-enter">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex items-center justify-between">
             <button 
               onClick={() => onChangeView(AppView.LOGIN)}
               className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
             >
               <ArrowRight className="w-4 h-4 ml-1" />
               بازگشت به ورود
             </button>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">درخواست عضویت</h1>
            <p className="text-gray-500 dark:text-gray-400">اطلاعات زیر را تکمیل کنید. تیم پشتیبانی پس از بررسی با شما تماس خواهد گرفت.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">نام</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">نام خانوادگی</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">ایمیل سازمانی</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white text-left"
                  dir="ltr"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">شماره موبایل</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="tel" 
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white text-left tracking-wider"
                  dir="ltr"
                  placeholder="09123456789"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">نحوه آشنایی با ما</label>
              <div className="relative">
                <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select 
                   className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white appearance-none"
                   value={formData.source}
                   onChange={e => setFormData({...formData, source: e.target.value})}
                >
                   <option value="">انتخاب کنید...</option>
                   <option value="search">جستجو در گوگل</option>
                   <option value="social">شبکه‌های اجتماعی</option>
                   <option value="friend">معرفی دوستان</option>
                   <option value="ads">تبلیغات</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">علت درخواست عضویت</label>
              <div className="relative">
                <FileText className="absolute right-3 top-4 w-5 h-5 text-gray-400" />
                <textarea 
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white min-h-[100px] resize-none"
                  placeholder="توضیح دهید که برای چه منظوری قصد استفاده از دید را دارید..."
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg shadow-xl shadow-primary-700/20 mt-4 group">
              ثبت درخواست
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side (Branding Panel with Carousel) */}
      <AuthSidePanel />
    </div>
  );
};
