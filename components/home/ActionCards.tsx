import React, { useState, useRef } from 'react';
import { Plus, Keyboard, ArrowLeft, Video, Zap } from 'lucide-react';

interface ActionCardsProps {
  isAuthenticated: boolean;
  onNewMeeting: () => void;
  onJoinMeeting: () => void;
  inputCode: string;
  setInputCode: (code: string) => void;
}

// Internal Component: "Glass" New Meeting Card (Matches App Theme)
const NewMeetingCard = ({ onClick, isAuthenticated }: { onClick: () => void, isAuthenticated: boolean }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="md:col-span-3 group relative overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-sm dark:shadow-2xl transition-all duration-500 outline-none select-none text-right"
    >
      {/* 1. Static Border (Base Layer - Subtle) */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 dark:border-white/10 pointer-events-none"></div>

      {/* 2. Dynamic Border Glow (Tracks Mouse) */}
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
      
      {/* 3. Mouse Follower Spotlight (Inner Glow) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(33, 150, 243, 0.12), transparent 40%)`
        }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 p-10 flex flex-col h-full justify-between w-full">
        
        {/* Top Row */}
        <div className="flex justify-between items-start">
          {/* Icon Container */}
          <div className="relative group-hover:-translate-y-2 transition-transform duration-500 ease-out">
            <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-500/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <Plus className="absolute inset-0 w-full h-full transition-all duration-500 group-hover:opacity-0 group-hover:rotate-90 group-hover:scale-50" strokeWidth={2.5} />
                    <Video className="absolute inset-0 w-full h-full transition-all duration-500 opacity-0 -rotate-90 scale-50 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100" strokeWidth={2.5} />
                </div>
            </div>
          </div>

          {/* Badge */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 group-hover:border-primary-500/30 transition-colors backdrop-blur-md shadow-sm">
              <Zap className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 fill-primary-600 dark:fill-primary-400 group-hover:animate-pulse" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">شروع فوری</span>
            </div>
          )}
        </div>

        {/* Bottom Row */}
        <div className="flex items-end justify-between">
            <div className="transform transition-all duration-500 group-hover:translate-x-2">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
                جلسه جدید
                </h2>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                ساخت اتاق امن با یک کلیک
                </p>
            </div>

            {/* The "Go" Button Reveal */}
            <div className="w-14 h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center opacity-0 translate-x-10 scale-50 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-lg">
                <ArrowLeft className="w-6 h-6" strokeWidth={3} />
            </div>
        </div>
      </div>
    </button>
  );
};

// Internal Component: Join Meeting Card with Effect
const JoinMeetingCard = ({ inputCode, setInputCode, onJoinMeeting }: { inputCode: string, setInputCode: (c: string) => void, onJoinMeeting: () => void }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setOpacity(1);
    };
  
    const handleMouseLeave = () => {
      setOpacity(0);
      setIsFocused(false);
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="md:col-span-2 relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-sm dark:shadow-2xl rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[260px] group overflow-hidden"
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

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary-500/20 backdrop-blur-sm">
                    <Keyboard className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">ورود با کد</h3>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-1">کد جلسه را دارید؟</p>
            </div>

            <div className="relative z-10 mt-4">
                <div className={`
                    relative bg-gray-50/50 dark:bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300
                    ${isFocused || inputCode.length > 0 ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/10' : 'ring-1 ring-white/10'}
                `}>
                    <input
                        type="text"
                        placeholder="----"
                        value={inputCode}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 4) setInputCode(val);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && onJoinMeeting()}
                        className="w-full bg-transparent border-none text-center text-4xl font-bold tracking-[0.5em] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-700 focus:outline-none focus:ring-0 py-6 pl-20 pr-4 font-mono h-24"
                        dir="ltr"
                        maxLength={4}
                    />
                    
                    {/* Floating Action Button */}
                    <div className={`
                        absolute left-3 top-3 bottom-3 aspect-square transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) z-20
                        ${inputCode.length > 0 ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 pointer-events-none'}
                    `}>
                        <button
                            onClick={onJoinMeeting}
                            disabled={inputCode.length < 4}
                            className="w-full h-full bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <ArrowLeft className="w-7 h-7" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ActionCards: React.FC<ActionCardsProps> = ({ 
  isAuthenticated, 
  onNewMeeting, 
  onJoinMeeting, 
  inputCode, 
  setInputCode 
}) => {
  return (
    <div className="grid md:grid-cols-5 gap-6 animate-fade-up delay-2">
      <NewMeetingCard onClick={onNewMeeting} isAuthenticated={isAuthenticated} />
      <JoinMeetingCard inputCode={inputCode} setInputCode={setInputCode} onJoinMeeting={onJoinMeeting} />
    </div>
  );
};