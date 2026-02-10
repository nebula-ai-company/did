import React from 'react';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
  return (
    <div className="animate-fade-up space-y-3 pt-2">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
        {isAuthenticated ? (
          <>سلام، <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">مدیر سیستم</span> 👋</>
        ) : (
          'پلتفرم ویدیو کنفرانس دید'
        )}
      </h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
        ارتباط امن و پایدار در بستر شبکه داخلی، بهینه‌شده برای بالاترین کیفیت.
      </p>
    </div>
  );
};