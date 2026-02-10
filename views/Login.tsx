import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Video } from 'lucide-react';
import { Button } from '../components/Button';
import { AuthSidePanel } from '../components/AuthSidePanel';
import { AppView } from '../types';

interface LoginProps {
  onChangeView: (view: AppView) => void;
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onChangeView, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-bg transition-colors duration-200">
      {/* Left Side (Form) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative animate-enter">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ورود به حساب کاربری</h1>
            <p className="text-gray-500 dark:text-gray-400">برای دسترسی به پنل کاربری، ایمیل و رمز عبور خود را وارد کنید.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-right">ایمیل سازمانی</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all dark:text-white text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">رمز عبور</label>
                  <button type="button" className="text-xs font-medium text-primary-600 hover:text-primary-700">رمز عبور را فراموش کردید؟</button>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-10 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all dark:text-white text-left tracking-widest placeholder:tracking-normal"
                    dir="ltr"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg shadow-xl shadow-primary-700/20 group">
              ورود به سیستم
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>

            <div className="flex flex-col gap-3 text-center pt-2">
              <div>
                <span className="text-gray-500 dark:text-gray-400">حساب کاربری ندارید؟ </span>
                <button 
                  type="button" 
                  onClick={() => onChangeView(AppView.SIGNUP)}
                  className="font-bold text-primary-600 hover:text-primary-700 hover:underline"
                >
                  درخواست عضویت
                </button>
              </div>
              
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">یا</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              <button 
                type="button"
                onClick={() => onChangeView(AppView.HOME)}
                className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                <Video className="w-5 h-5" />
                پیوستن به جلسه به عنوان مهمان
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-dark-border text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4" />
              <span>اطلاعات شما با استاندارد SSL محافظت می‌شود</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Branding Panel with Carousel) */}
      <AuthSidePanel />
    </div>
  );
};