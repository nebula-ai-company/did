import React from 'react';
import { Plus, Keyboard, ArrowLeft } from 'lucide-react';

interface ActionCardsProps {
  isAuthenticated: boolean;
  onNewMeeting: () => void;
  onJoinMeeting: () => void;
  inputCode: string;
  setInputCode: (code: string) => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ 
  isAuthenticated, 
  onNewMeeting, 
  onJoinMeeting, 
  inputCode, 
  setInputCode 
}) => {
  return (
    <div className="grid md:grid-cols-5 gap-6 animate-fade-up delay-2">
      {/* New Meeting - Takes up 3 cols */}
      <button
        onClick={onNewMeeting}
        className="md:col-span-3 group relative overflow-hidden rounded-[2.5rem] bg-gray-900/60 backdrop-blur-3xl border border-white/10 p-10 text-right min-h-[260px] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-1 transform-gpu isolate"
      >
        {/* Premium Mesh Gradient Background - Reduced opacity for transparency */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 opacity-80 transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

        {/* Floating Shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-110 group-hover:bg-white/20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2 transition-transform duration-700 group-hover:scale-110"></div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <Plus className="w-8 h-8" />
          </div>
          {isAuthenticated && (
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-blue-50">
              شروع فوری
            </span>
          )}
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight drop-shadow-md">جلسه جدید</h2>
          <p className="text-blue-100/90 text-lg font-medium drop-shadow-sm">ایجاد اتاق امن با کد ۴ رقمی اختصاصی</p>
        </div>
      </button>

      {/* Join Meeting - Takes up 2 cols */}
      <div className="md:col-span-2 relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm dark:shadow-2xl rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[260px] group hover:border-primary-500/30 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/5 pointer-events-none rounded-[2.5rem]"></div>

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary-500/20 backdrop-blur-sm">
            <Keyboard className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">ورود با کد</h3>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-1">کد جلسه را دارید؟</p>
        </div>

        <div className="relative z-10 mt-4 group-focus-within:translate-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="۱۲۳۴"
              value={inputCode}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 4) setInputCode(val);
              }}
              onKeyDown={(e) => e.key === 'Enter' && onJoinMeeting()}
              className="w-full bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl py-5 pl-4 pr-4 text-center text-3xl font-mono tracking-[0.5em] font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              dir="ltr"
              maxLength={4}
            />
            <button
              onClick={onJoinMeeting}
              disabled={inputCode.length < 4}
              className={`absolute left-3 top-3 bottom-3 aspect-square flex items-center justify-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-all duration-300 ${inputCode.length === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};