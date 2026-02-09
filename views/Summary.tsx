import React from 'react';
import { RotateCw, Home, Download, FileText } from 'lucide-react';
import { Button } from '../components/Button';
import { AppView } from '../types';

interface SummaryProps {
  onChangeView: (view: AppView) => void;
}

export const Summary: React.FC<SummaryProps> = ({ onChangeView }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface rounded-3xl shadow-xl border border-gray-200 dark:border-dark-border p-8 text-center animate-enter">
        
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
           <span className="text-4xl">👋</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">جلسه پایان یافت</h2>
        <p className="text-gray-500 mb-8">مدت زمان: ۴۵ دقیقه • ۵ شرکت کننده</p>

        <div className="space-y-3 mb-8">
           <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border hover:border-primary-500 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Download className="w-5 h-5" />
                 </div>
                 <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">دانلود فایل ضبط شده</div>
                    <div className="text-xs text-gray-500">۱۲۵ مگابایت • MP4</div>
                 </div>
              </div>
           </button>

           <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border hover:border-primary-500 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">متن گفتگوها (Chat)</div>
                    <div className="text-xs text-gray-500">TXT Format</div>
                 </div>
              </div>
           </button>
        </div>

        <div className="flex gap-3">
           <Button variant="secondary" className="flex-1" onClick={() => onChangeView(AppView.HOME)}>
              <Home className="w-4 h-4 ml-2" />
              صفحه اصلی
           </Button>
           <Button className="flex-1" onClick={() => onChangeView(AppView.LOBBY)}>
              <RotateCw className="w-4 h-4 ml-2" />
              پیوستن مجدد
           </Button>
        </div>
      </div>
    </div>
  );
};
