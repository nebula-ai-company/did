import React, { useState, useRef } from 'react';
import { Activity, Wifi, Zap } from 'lucide-react';

interface NetworkStatusWidgetProps {
  className?: string;
}

export const NetworkStatusWidget: React.FC<NetworkStatusWidgetProps> = ({ className = '' }) => {
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

  return (
    <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-sm dark:shadow-2xl rounded-[2.5rem] p-8 flex flex-col justify-between h-full min-h-[220px] group relative overflow-hidden ${className}`}
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

      {/* Header Section */}
      <div className="flex items-center justify-start gap-4 mb-8 relative z-10">
         <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#0F1218] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-inner relative group/icon">
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
            <Activity className="w-7 h-7 text-blue-600 dark:text-blue-500 relative z-10" />
         </div>
         <div className="text-right">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">وضعیت شبکه</h3>
            <p className="text-sm text-blue-500 font-bold tracking-wide mt-0.5">پایدار</p>
         </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
        
        {/* Bandwidth Card */}
        <div className="p-5 rounded-3xl bg-gray-100 dark:bg-[#11141C] border border-transparent dark:border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden hover:border-blue-500/30 transition-all duration-300 group/item">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span>Bandwidth</span>
            <Zap className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover/item:text-blue-500 transition-colors" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tighter flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-500 relative -top-0.5">Gbps</span>
            1
          </div>
        </div>
        
        {/* Ping Card */}
        <div className="p-5 rounded-3xl bg-gray-100 dark:bg-[#11141C] border border-transparent dark:border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden hover:border-blue-500/30 transition-all duration-300 group/item">
           <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span>Ping</span>
            <Wifi className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover/item:text-blue-500 transition-colors" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tighter flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-500 relative -top-0.5">ms</span>
            5
          </div>
        </div>

      </div>
    </div>
  );
};