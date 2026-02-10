import React from 'react';
import { Clock, ChevronLeft, Timer } from 'lucide-react';
import { Button } from '../Button';

interface RecentMeetingsProps {
  isAuthenticated: boolean;
  onJoin: (code: string) => void;
}

export const RecentMeetings: React.FC<RecentMeetingsProps> = ({ isAuthenticated, onJoin }) => {
  if (!isAuthenticated) return null;

  const meetings = [
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
          <div
            key={i}
            onClick={() => onJoin(meeting.code)}
            className="group flex items-center justify-between p-6 rounded-[1.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/5 hover:border-primary-500/30 dark:hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-transform group-hover:scale-105 backdrop-blur-sm ${meeting.status === 'missed'
                  ? 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  : 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                }`}>
                {meeting.title.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {meeting.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium bg-white/30 dark:bg-white/5 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 backdrop-blur-sm">{meeting.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <span>{meeting.time}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" /> {meeting.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
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
                className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white/50 dark:bg-white/10 dark:hover:bg-white/20 border-white/40 dark:border-white/10 rounded-xl px-6 backdrop-blur-md"
              >
                پیوستن
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};