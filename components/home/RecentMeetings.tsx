import React, { useState, useRef } from 'react';
import { Clock, ChevronLeft, Timer } from 'lucide-react';
import { Button } from '../Button';

interface RecentMeetingsProps {
  isAuthenticated: boolean;
  onJoin: (code: string) => void;
}

// Define the shape of the meeting object to be safe
interface MeetingData {
  title: string;
  time: string;
  date: string;
  duration: string;
  code: string;
  members: number;
  status: string;
}

interface MeetingItemProps {
  meeting: MeetingData;
  onJoin: (code: string) => void;
}

// Internal Item Component for Effect
const MeetingItem: React.FC<MeetingItemProps> = ({ meeting, onJoin }) => {
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
            onClick={() => onJoin(meeting.code)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative flex items-center justify-between p-6 rounded-[1.5rem] cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
             {/* 1. Glass Background Layer */}
             <div className="absolute inset-0 rounded-[1.5rem] bg-gray-900/40 dark:bg-[#0A0A0A]/40 backdrop-blur-2xl border-2 border-white/10 dark:border-white/10 shadow-lg group-hover:shadow-xl transition-all"></div>

             {/* 2. Gradient Overlay for Depth (Top-Left Light Source) */}
             <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>

             {/* 3. Mouse Follower Glow */}
             <div 
                className="absolute inset-0 rounded-[1.5rem] pointer-events-none transition-opacity duration-300 z-10"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.15), transparent 40%)`
                }}
            ></div>

            {/* Content (Z-Indexed Above Background) */}
            <div className="flex items-center gap-6 relative z-20">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-transform group-hover:scale-105 backdrop-blur-md shadow-lg ${meeting.status === 'missed'
                  ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'
                  : 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                }`}>
                {meeting.title.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {meeting.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium bg-white/20 dark:bg-white/5 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300 border border-white/10">{meeting.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                  <span>{meeting.time}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" /> {meeting.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 relative z-20">
              <div className="hidden sm:flex -space-x-4 space-x-reverse pl-2">
                {[...Array(Math.min(meeting.members, 3))].map((_, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#121212] bg-gray-200 dark:bg-gray-700 shadow-sm"></div>
                ))}
                {meeting.members > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#121212] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                    +{meeting.members - 3}
                  </div>
                )}
              </div>
              <Button
                size="md"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white/40 dark:bg-white/10 dark:hover:bg-white/20 border-white/40 dark:border-white/20 rounded-xl px-6 backdrop-blur-md shadow-sm text-gray-900 dark:text-white"
              >
                پیوستن
              </Button>
            </div>
        </div>
    );
};

export const RecentMeetings: React.FC<RecentMeetingsProps> = ({ isAuthenticated, onJoin }) => {
  if (!isAuthenticated) return null;

  const meetings: MeetingData[] = [
    { title: 'بررسی اسپرینت ۱۴', time: '۱۰:۰۰', date: 'امروز', duration: '۴۵ دقیقه', code: '1024', members: 8, status: 'completed' },
    { title: 'جلسه هماهنگی مارکتینگ', time: '۱۴:۳۰', date: 'دیروز', duration: '۶۰ دقیقه', code: '8921', members: 4, status: 'completed' },
    { title: 'مصاحبه فنی - آقای محمدی', time: '۰۹:۰۰', date: 'دیروز', duration: '۳۰ دقیقه', code: '3321', members: 3, status: 'missed' }
  ];

  return (
    <div className="animate-fade-up delay-3">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-xl text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5" />
          </div>
          جلسات اخیر
        </h3>
        <Button variant="ghost" size="sm" className="text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-500/10">
          مشاهده همه
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {meetings.map((meeting, i) => (
          <MeetingItem key={i} meeting={meeting} onJoin={onJoin} />
        ))}
      </div>
    </div>
  );
};