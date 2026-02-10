import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export const TimeWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mouse effect state
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

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Manual formatting to ensure correct HH:MM display and proper Persian digits
  const toPersianDigits = (num: number) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .padStart(2, '0')
      .replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
  };

  const hours = toPersianDigits(currentTime.getHours());
  const minutes = toPersianDigits(currentTime.getMinutes());

  // Date formatting
  const dateStr = new Intl.DateTimeFormat('fa-IR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(currentTime);

  return (
    <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-sm dark:shadow-2xl rounded-[2.5rem] p-10 text-center relative overflow-hidden group animate-fade-up"
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

      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-700"></div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 dark:bg-white/5 rounded-full text-xs font-medium text-gray-500 dark:text-gray-300 mb-6 backdrop-blur-md border border-white/20 dark:border-white/5">
          <Clock className="w-3 h-3" />
          {dateStr}
        </div>
        
        {/* Added dir="ltr" to strictly enforce HH:MM visual order regardless of app's RTL setting */}
        <div className="flex items-baseline justify-center gap-1 text-gray-900 dark:text-white" style={{ fontVariantNumeric: 'tabular-nums' }} dir="ltr">
          <span className="text-7xl xl:text-8xl font-thin tracking-tighter drop-shadow-sm">
            {hours}
          </span>
          <span className="text-7xl xl:text-8xl font-thin tracking-tighter animate-pulse text-primary-600 dark:text-primary-500 drop-shadow-sm mb-2">:</span>
          <span className="text-7xl xl:text-8xl font-thin tracking-tighter drop-shadow-sm">
            {minutes}
          </span>
        </div>
        
        <div className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
          تهران، ایران
        </div>
      </div>
    </div>
  );
};