import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar as CalendarIcon, LayoutGrid, List } from 'lucide-react';

interface CalendarWidgetProps {
  className?: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ className = '' }) => {
  const [view, setView] = useState<'month' | 'week'>('month');
  const [now, setNow] = useState(new Date());
  
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
  
  // Update time every minute to keep date accurate if app stays open long
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- Dynamic Persian Date Logic ---
  const { currentDay, currentMonth, daysInMonth, startDayOfWeek, currentYear } = useMemo(() => {
    // 1. Get current Persian day/month/year parts
    const formatter = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' });
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
    
    // Helper to parse Persian digits to integer
    const parsePersianInt = (str: string) => parseInt(str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()));
    
    const pDay = parsePersianInt(getPart('day'));
    const pMonth = getPart('month');
    const pYear = parsePersianInt(getPart('year'));

    // 2. Find the Gregorian date of the 1st of this Persian month
    // We go back (currentDay - 1) days. 
    // Note: This assumes 24h consistency, usually safe for day calc.
    const firstOfMonthDate = new Date(now);
    firstOfMonthDate.setDate(now.getDate() - (pDay - 1));

    // 3. Determine padding (weekday of the 1st)
    // Gregorian: 0=Sun ... 6=Sat
    // Persian: 0=Sat, 1=Sun ... 6=Fri
    // Formula: (GregorianDay + 1) % 7 => PersianDayIndex
    const startDayOfWeek = (firstOfMonthDate.getDay() + 1) % 7;

    // 4. Calculate total days in this Persian month
    // Iterate forward until the Persian month name changes
    let d = new Date(firstOfMonthDate);
    let count = 0;
    while (count < 32) {
      const m = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d);
      if (m !== pMonth) break;
      count++;
      d.setDate(d.getDate() + 1);
    }

    return {
      currentDay: pDay,
      currentMonth: pMonth,
      currentYear: pYear,
      daysInMonth: count,
      startDayOfWeek // 0 = Sat, 6 = Fri
    };
  }, [now]);

  // Derived State for Week View
  const weekDates = useMemo(() => {
    // Find the Saturday of the current week
    // Persian Week: Sat=0 ... Fri=6
    // Today's Persian Weekday: (now.getDay() + 1) % 7
    const currentWeekdayIndex = (now.getDay() + 1) % 7;
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentWeekdayIndex);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      
      const f = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', weekday: 'long' });
      const parts = f.formatToParts(d);
      const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
      
      week.push({
        dateObj: d,
        dayNum: parseInt(getPart('day').replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())), // Store as int for logic
        dayNumPersian: getPart('day'), // Store as string for display
        dayName: getPart('weekday')
      });
    }
    return week;
  }, [now]);

  const [selectedDate, setSelectedDate] = useState<number>(currentDay);

  // Sync selected date when real day changes
  useEffect(() => {
    setSelectedDate(currentDay);
  }, [currentDay]);

  const weekDaysHeader = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  
  // Helper to convert English digits to Persian (for display only)
  const toPersianDigits = (num: number | string) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
  };

  // Mock meetings - ensure current day always has meetings for the demo
  const meetingDays = useMemo(() => {
    const base = [2, 5, 12, 15, 28];
    if (!base.includes(currentDay)) base.push(currentDay);
    return base;
  }, [currentDay]);

  const renderGrid = () => {
    if (view === 'month') {
      return (
        <div className="grid grid-cols-7 gap-1.5 mt-2 px-1 pb-2">
          {/* Weekday Headers */}
          {weekDaysHeader.map(d => (
            <div key={d} className="text-center text-sm text-gray-400 dark:text-gray-500 font-medium pb-2">{d}</div>
          ))}
          
          {/* Empty cells for start of month */}
          {[...Array(startDayOfWeek)].map((_, i) => <div key={`empty-${i}`} />)}
          
          {/* Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday = day === currentDay;
            const isSelected = day === selectedDate;
            const hasMeeting = meetingDays.includes(day);

            return (
              <div 
                key={day} 
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative text-lg font-medium cursor-pointer transition-all duration-300 group
                  ${isSelected 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105 z-10' 
                    : isToday 
                        ? 'bg-white/10 text-primary-600 dark:text-primary-400 border border-primary-500/30'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:scale-110'}
                `}
              >
                {toPersianDigits(day)}
                {hasMeeting && (
                  <div className={`absolute bottom-2 w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${isSelected ? 'bg-white' : 'bg-primary-500'}`}></div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Weekly View
    return (
      <div className="grid grid-cols-2 grid-rows-4 gap-3 mt-2 h-full">
        {weekDates.map((item, i) => {
           const isSelected = item.dayNum === selectedDate;
           const isFriday = i === 6; 
           const isToday = item.dayNum === currentDay;
           
           // Simple mock check for meetings in week view based on day number match
           const hasMeeting = meetingDays.includes(item.dayNum);

           return (
             <div 
               key={item.dayNum} 
               onClick={() => setSelectedDate(item.dayNum)}
               className={`
                 relative flex items-center justify-between px-4 rounded-2xl border transition-all cursor-pointer group overflow-hidden
                 ${isFriday ? 'col-span-2' : ''}
                 ${isSelected 
                   ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white border-primary-500 shadow-xl shadow-primary-600/30 z-10' 
                   : 'bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border-white/40 dark:border-white/5 text-gray-700 dark:text-gray-300'}
               `}
             >
                {isSelected && <div className="absolute -left-4 -bottom-10 w-24 h-24 bg-white/10 blur-2xl rounded-full pointer-events-none"></div>}

                <div className="flex flex-row items-center gap-3 relative z-10">
                  <span className={`text-2xl font-black tracking-tight leading-none ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {item.dayNumPersian}
                  </span>
                  
                  <div className={`h-5 w-px ${isSelected ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                  
                  <span className={`text-sm font-bold ${isSelected ? 'text-blue-50' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.dayName}
                  </span>
                </div>
                
                {/* Meeting Indicator */}
                {hasMeeting && (
                   <div className="relative z-10">
                      {isSelected ? (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-sm ml-0.5">
                            <div className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </div>
                            <span className="text-xs font-bold whitespace-nowrap text-white pt-0.5 leading-none">۲</span>
                        </div>
                      ) : (
                         <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      )}
                   </div>
                )}
             </div>
           )
        })}
      </div>
    );
  };

  return (
    <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`bg-white/40 dark:bg-black/40 backdrop-blur-3xl shadow-sm dark:shadow-2xl rounded-[2.5rem] p-8 flex flex-col animate-fade-up delay-1 overflow-hidden relative group ${className}`}
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

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
           <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-500/20 backdrop-blur-sm">
             <CalendarIcon className="w-6 h-6" />
           </div>
           <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{currentMonth}</span>
        </div>
        
        <div className="flex bg-gray-100/50 dark:bg-white/5 rounded-xl p-1 border border-white/10 backdrop-blur-sm">
          <button 
            onClick={() => setView('month')}
            className={`p-2 rounded-lg transition-all ${view === 'month' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('week')}
            className={`p-2 rounded-lg transition-all ${view === 'week' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 min-h-0 relative z-10">
         {renderGrid()}
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 shrink-0 relative z-10">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            <span>جلسه دارید</span>
         </div>
         <button className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium transition-all" onClick={() => setSelectedDate(currentDay)}>برو به امروز</button>
      </div>
    </div>
  );
};