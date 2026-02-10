import React from 'react';
import { Video, Settings, User, LogIn } from 'lucide-react';
import { Button } from '../Button';
import { AppView, UserSettings } from '../../types';

interface HeaderProps {
  isAuthenticated: boolean;
  userSettings: UserSettings;
  onChangeView: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, userSettings, onChangeView }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/50 dark:bg-black/50 backdrop-blur-3xl border-b border-gray-200/20 dark:border-white/5 transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onChangeView(AppView.HOME)}>
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-primary-600 to-primary-500 rounded-xl shadow-lg shadow-primary-500/20 text-white transform group-hover:scale-105 transition-transform duration-300">
            <Video className="w-5 h-5" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">دید</span>
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 tracking-widest uppercase opacity-80">Video Conference</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/5 backdrop-blur-md text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>شبکه داخلی متصل</span>
          </div>

          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" onClick={() => onChangeView(AppView.SETTINGS)}>
            <Settings className="w-5 h-5" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-1 pr-1 py-1 bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-sm hover:border-primary-500/30 transition-all cursor-pointer group">
              <div className="hidden sm:flex flex-col items-end px-3">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">{userSettings.displayName}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 shadow-inner ring-2 ring-white/50 dark:ring-[#0B0C15]/50">
                <User className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="primary"
              className="gap-2 px-6 rounded-full shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40"
              onClick={() => onChangeView(AppView.LOGIN)}
            >
              <LogIn className="w-4 h-4" />
              ورود
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};