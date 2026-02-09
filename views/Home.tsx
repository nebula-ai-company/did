import React, { useState, useEffect } from 'react';
import { Video, Keyboard, Settings, User, LogIn, Plus, Link as LinkIcon, Clock, ArrowLeft, Activity, Wifi, Zap, BarChart3, Timer, ChevronLeft, Signal } from 'lucide-react';
import { Button } from '../components/Button';
import { AppView, UserSettings } from '../types';

interface HomeProps {
  onChangeView: (view: AppView) => void;
  setMeetingId: (id: string) => void;
  isAuthenticated: boolean;
  userSettings: UserSettings;
}

export const Home: React.FC<HomeProps> = ({ onChangeView, setMeetingId, isAuthenticated, userSettings }) => {
  const [inputCode, setInputCode] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = () => {
    if (inputCode.trim()) {
      setMeetingId(inputCode);
      onChangeView(AppView.LOBBY);
    }
  };

  const handleNewMeeting = () => {
    if (!isAuthenticated) {
      onChangeView(AppView.LOGIN);
      return;
    }
    const simpleCode = Math.floor(1000 + Math.random() * 9000).toString();
    setMeetingId(simpleCode);
    onChangeView(AppView.LOBBY);
  };

  // Custom CSS for animations
  const animationStyles = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up {
      opacity: 0;
      animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .delay-1 { animation-delay: 100ms; }
    .delay-2 { animation-delay: 200ms; }
    .delay-3 { animation-delay: 300ms; }
    .delay-4 { animation-delay: 400ms; }
    .delay-5 { animation-delay: 500ms; }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .dark .glass-card {
      background: rgba(30, 35, 50, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }
  `;

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0B0C15] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 selection:bg-primary-500/30 overflow-x-hidden relative">
      <style>{animationStyles}</style>
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Top Right Glow */}
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-600/5 dark:bg-primary-500/5 blur-[120px] animate-pulse-slow"></div>
         {/* Bottom Left Glow */}
         <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/5 dark:bg-indigo-500/5 blur-[120px]"></div>
         {/* Center/Random Glow */}
         <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-400/5 dark:bg-blue-400/5 blur-[150px]"></div>
         
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.3] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      </div>

      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-[#0B0C15]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>شبکه داخلی متصل</span>
            </div>

            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" onClick={() => onChangeView(AppView.SETTINGS)}>
              <Settings className="w-5 h-5" />
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-1 pr-1 py-1 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm hover:border-primary-500/30 transition-all cursor-pointer group">
                <div className="hidden sm:flex flex-col items-end px-3">
                   <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">{userSettings.displayName}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-200 shadow-inner ring-2 ring-white dark:ring-[#0B0C15]">
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

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 py-10 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- Right Column: Sidebar (Time & Stats) --- */}
           <div className="lg:col-span-4 space-y-6 lg:order-2">
              
              {/* Time Widget */}
              <div className={`glass-card rounded-[2.5rem] p-8 text-center relative overflow-hidden group animate-fade-up`}>
                 <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-700"></div>
                 <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100/50 dark:bg-white/10 rounded-full text-xs font-medium text-gray-500 dark:text-gray-300 mb-4 backdrop-blur-md">
                       <Clock className="w-3 h-3" />
                       {currentTime.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div className="flex items-baseline justify-center gap-1 text-gray-900 dark:text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
                       <span className="text-7xl font-[200] tracking-tighter">
                         {currentTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }).split(':')[0]}
                       </span>
                       <span className="text-7xl font-[200] tracking-tighter animate-pulse text-primary-500">:</span>
                       <span className="text-7xl font-[200] tracking-tighter">
                         {currentTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }).split(':')[1]}
                       </span>
                    </div>
                    <div className="mt-4 text-sm font-medium text-gray-400 tracking-widest uppercase">
                       تهران، ایران
                    </div>
                 </div>
              </div>

              {/* Network Status Widget */}
              <div className={`glass-card rounded-[2rem] p-6 animate-fade-up delay-1`}>
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                          <Activity className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm">وضعیت شبکه</h3>
                          <p className="text-xs text-emerald-500 font-medium">پایدار</p>
                       </div>
                    </div>
                    <div className="flex gap-1 items-end h-6">
                       {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-1 bg-emerald-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 1000 + 500}ms` }}></div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary-500/30 transition-colors">
                       <div className="text-xs text-gray-400 mb-1">Ping</div>
                       <div className="text-xl font-bold text-gray-900 dark:text-white font-mono flex items-center gap-1">
                          5 <span className="text-xs font-normal text-gray-500">ms</span>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary-500/30 transition-colors">
                       <div className="text-xs text-gray-400 mb-1">Bandwidth</div>
                       <div className="text-xl font-bold text-gray-900 dark:text-white font-mono flex items-center gap-1">
                          1 <span className="text-xs font-normal text-gray-500">Gbps</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Stats Widget */}
              {isAuthenticated && (
                <div className={`glass-card rounded-[2rem] p-6 animate-fade-up delay-2`}>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                         <BarChart3 className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">خلاصه عملکرد</h3>
                   </div>
                   
                   <div className="relative pt-2">
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-2xl font-bold text-gray-900 dark:text-white">۱۲ <span className="text-sm font-normal text-gray-500">جلسه</span></span>
                         <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+۲ نسبت به هفته قبل</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                         <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="mt-4 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                         <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            جلسات: ۸.۵ ساعت
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>


          {/* --- Left Column: Actions & List (Main) --- */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:order-1">
            
            {/* Header Text */}
            <div className="animate-fade-up space-y-1">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                 {isAuthenticated ? (
                   <>سلام، <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">مدیر سیستم</span> 👋</>
                 ) : (
                   'پلتفرم ویدیو کنفرانس دید'
                 )}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                 ارتباط امن و پایدار در بستر شبکه داخلی، بهینه‌شده برای بالاترین کیفیت.
              </p>
            </div>

            {/* Main Action Cards */}
            <div className="grid md:grid-cols-5 gap-5 animate-fade-up delay-2">
               
               {/* New Meeting - Takes up 3 cols */}
               <button 
                  onClick={handleNewMeeting}
                  className="md:col-span-3 group relative overflow-hidden rounded-[2.5rem] bg-[#1a1a1a] p-8 text-right min-h-[220px] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-1"
               >
                  {/* Premium Mesh Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-primary-700 to-indigo-900 opacity-90 transition-all duration-500 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                  
                  {/* Floating Shapes */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2"></div>

                  <div className="relative z-10 flex justify-between items-start">
                     <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        <Plus className="w-7 h-7" />
                     </div>
                     {isAuthenticated && (
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-blue-50">
                           شروع فوری
                        </span>
                     )}
                  </div>

                  <div className="relative z-10">
                     <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">جلسه جدید</h2>
                     <p className="text-blue-100/80 text-sm font-medium">ایجاد اتاق امن با کد ۴ رقمی اختصاصی</p>
                  </div>
               </button>

               {/* Join Meeting - Takes up 2 cols */}
               <div className="md:col-span-2 relative glass-card rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[220px] group hover:border-primary-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/5 pointer-events-none rounded-[2.5rem]"></div>
                  
                  <div className="relative z-10">
                     <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Keyboard className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">ورود با کد</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">کد جلسه را دارید؟</p>
                  </div>

                  <div className="relative z-10 mt-4 group-focus-within:translate-y-0">
                     <div className="relative">
                        <input 
                           type="text" 
                           placeholder="۱۲۳۴"
                           value={inputCode}
                           onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              if (val.length <= 4) setInputCode(val);
                           }}
                           onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                           className="w-full bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-4 pr-4 text-center text-2xl font-mono tracking-[0.5em] font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                           dir="ltr"
                           maxLength={4}
                        />
                        <button 
                           onClick={handleJoin}
                           disabled={inputCode.length < 4}
                           className={`absolute left-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-all duration-300 ${inputCode.length === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                        >
                           <ArrowLeft className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Recent Meetings List */}
            {isAuthenticated && (
               <div className="animate-fade-up delay-3">
                  <div className="flex items-center justify-between mb-4 px-2">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        جلسات اخیر
                     </h3>
                     <Button variant="ghost" size="sm" className="text-xs text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10">
                        مشاهده همه
                        <ChevronLeft className="w-3 h-3 mr-1" />
                     </Button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     {[
                        { title: 'بررسی اسپرینت ۱۴', time: '۱۰:۰۰', date: 'امروز', duration: '۴۵ دقیقه', code: '1024', members: 8, status: 'completed' },
                        { title: 'جلسه هماهنگی مارکتینگ', time: '۱۴:۳۰', date: 'دیروز', duration: '۶۰ دقیقه', code: '8921', members: 4, status: 'completed' },
                        { title: 'مصاحبه فنی - آقای محمدی', time: '۰۹:۰۰', date: 'دیروز', duration: '۳۰ دقیقه', code: '3321', members: 3, status: 'missed' }
                     ].map((meeting, i) => (
                        <div 
                           key={i} 
                           onClick={() => { setInputCode(meeting.code); handleJoin(); }}
                           className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#121212]/50 border border-gray-100 dark:border-white/5 hover:border-primary-500/30 dark:hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                        >
                           <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105 ${
                                 meeting.status === 'missed' 
                                 ? 'bg-red-50 dark:bg-red-500/10 text-red-500' 
                                 : 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                              }`}>
                                 {meeting.title.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {meeting.title}
                                 </h4>
                                 <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">{meeting.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                    <span>{meeting.time}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                    <span className="flex items-center gap-1">
                                       <Timer className="w-3 h-3" /> {meeting.duration}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4">
                              <div className="hidden sm:flex -space-x-3 space-x-reverse pl-2">
                                 {[...Array(Math.min(meeting.members, 3))].map((_, idx) => (
                                    <div key={idx} className="w-9 h-9 rounded-full border-2 border-white dark:border-[#121212] bg-gray-200 dark:bg-gray-700 shadow-sm"></div>
                                 ))}
                                 {meeting.members > 3 && (
                                    <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#121212] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                                       +{meeting.members - 3}
                                    </div>
                                 )}
                              </div>
                              <Button 
                                 size="sm" 
                                 variant="secondary" 
                                 className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-white/10"
                              >
                                 پیوستن
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
          </div>

        </div>
      </main>
    </div>
  );
};