import React, { useState, useRef } from 'react';
import { BarChart3, TrendingUp, Clock } from 'lucide-react';

interface StatsWidgetProps {
  isAuthenticated: boolean;
  className?: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ isAuthenticated, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  if (!isAuthenticated) return null;

  return (
    <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-sm dark:shadow-2xl rounded-[2.5rem] p-8 flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden group ${className}`}
    >
      {/* 1. Static Border */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 dark:border-white/10 pointer-events-none"></div>

      {/* 2. Dynamic Border Glow */}
      <div 
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none transition-opacity duration-200"
        style={{
            opacity,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, #2196F3, transparent 50%)`,
            maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
            maskClip: 'content-box, border-box',
            maskComposite: 'exclude',
            WebkitMaskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
            WebkitMaskClip: 'content-box, border-box',
            WebkitMaskComposite: 'xor',
            padding: '1.5px' 
        }}
      ></div>
      
      {/* 3. Inner Spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(33, 150, 243, 0.12), transparent 40%)`
        }}
      ></div>
      
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-500"></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-600 dark:text-primary-500 border border-primary-500/20 backdrop-blur-sm">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">خلاصه عملکرد</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">آمار هفته جاری</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-medium backdrop-blur-sm">
           <TrendingUp className="w-3.5 h-3.5" />
           <span>+۱۵٪ رشد</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 items-end relative z-10 mt-6">
         {/* Main Number */}
         <div>
            <div className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-2">
               ۱۲
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
               جلسه برگزار شده
            </div>
         </div>

         {/* Time Stats */}
         <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
               <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> مجموع زمان</span>
               <span className="text-gray-900 dark:text-white font-bold">۸.۵ ساعت</span>
            </div>
            
            <div className="w-full bg-gray-200/50 dark:bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div className="bg-primary-600 dark:bg-primary-500 h-full rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)] relative overflow-hidden" style={{ width: '75%' }}>
                 <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};