import React from 'react';
import { Activity, Wifi, Zap } from 'lucide-react';

interface NetworkStatusWidgetProps {
  className?: string;
}

export const NetworkStatusWidget: React.FC<NetworkStatusWidgetProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm dark:shadow-2xl rounded-[2.5rem] p-8 flex flex-col justify-between h-full min-h-[220px] group ${className}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-500/10 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-500/20 backdrop-blur-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
             <h3 className="font-bold text-gray-900 dark:text-white text-base">وضعیت شبکه</h3>
             <p className="text-[11px] text-primary-600 dark:text-primary-400 font-medium">پایدار</p>
          </div>
        </div>
        
        {/* Animated Bars */}
        <div className="flex gap-1 items-end h-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-1.5 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]" style={{ height: `${Math.random() * 60 + 40}%`, animationDuration: `${Math.random() * 1000 + 500}ms` }}></div>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/5 hover:border-primary-500/30 transition-colors backdrop-blur-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1 text-[11px] text-gray-500 dark:text-gray-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>Ping</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono flex items-baseline gap-1">
            5 <span className="text-xs font-normal text-gray-500">ms</span>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/5 hover:border-primary-500/30 transition-colors backdrop-blur-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1 text-[11px] text-gray-500 dark:text-gray-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Bandwidth</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono flex items-baseline gap-1">
            1 <span className="text-xs font-normal text-gray-500">Gbps</span>
          </div>
        </div>
      </div>
    </div>
  );
};