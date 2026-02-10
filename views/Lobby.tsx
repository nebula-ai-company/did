import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { AppView, UserSettings } from '../types';

interface LobbyProps {
  onChangeView: (view: AppView) => void;
  userSettings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  meetingId: string;
}

export const Lobby: React.FC<LobbyProps> = ({ onChangeView, userSettings, updateSettings, meetingId }) => {
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level meter
  useEffect(() => {
    if (!userSettings.audioEnabled) {
      setAudioLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 100);
    }, 100);
    return () => clearInterval(interval);
  }, [userSettings.audioEnabled]);

  const animationStyles = `
    @keyframes shimmer {
      0% { transform: translateX(-100%) skewX(-15deg); }
      100% { transform: translateX(200%) skewX(-15deg); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-6 transition-colors duration-500">
      <style>{animationStyles}</style>
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Video Preview */}
        <div className="space-y-4 animate-enter">
          <div className="relative aspect-video bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-dark-border group ring-4 ring-transparent hover:ring-primary-500/20 transition-all duration-500">
             {userSettings.videoEnabled ? (
                <>
                  <img src="https://picsum.photos/800/600" className="w-full h-full object-cover transform scale-x-[-1]" alt="Preview" />
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs border border-white/10">
                     HD 720p
                  </div>
                </>
             ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                  <VideoOff className="w-16 h-16 mb-4 opacity-50 relative z-10" />
                  <p className="relative z-10 font-medium">دوربین خاموش است</p>
                </div>
             )}
             
             {/* Audio Meter Overlay */}
             {userSettings.audioEnabled && (
               <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-2xl flex gap-1 h-8 items-end border border-white/10">
                  {[1,2,3,4,5].map(i => (
                    <div 
                      key={i} 
                      className={`w-1.5 rounded-full transition-all duration-100 ${audioLevel > (i * 20) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}
                      style={{ height: audioLevel > (i * 20) ? '100%' : '30%' }}
                    />
                  ))}
               </div>
             )}
          </div>

          <div className="flex justify-center gap-4">
             <Button 
               variant={userSettings.audioEnabled ? "secondary" : "danger"} 
               size="icon" 
               className="w-14 h-14 rounded-2xl transition-all hover:scale-110 active:scale-95"
               onClick={() => updateSettings({ audioEnabled: !userSettings.audioEnabled })}
             >
                {userSettings.audioEnabled ? <Mic /> : <MicOff />}
             </Button>
             <Button 
               variant={userSettings.videoEnabled ? "secondary" : "danger"} 
               size="icon" 
               className="w-14 h-14 rounded-2xl transition-all hover:scale-110 active:scale-95"
               onClick={() => updateSettings({ videoEnabled: !userSettings.videoEnabled })}
             >
                {userSettings.videoEnabled ? <Video /> : <VideoOff />}
             </Button>
             <Button 
               variant="ghost" 
               size="icon" 
               className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-dark-border hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-500 transition-all hover:scale-110 active:scale-95"
             >
                <Sparkles className="w-5 h-5" />
             </Button>
          </div>
        </div>

        {/* Right: Settings & Join */}
        <div className="space-y-8 animate-enter" style={{animationDelay: '0.1s'}}>
           <div className="text-center md:text-right">
             <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">آماده پیوستن هستید؟</h2>
             <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl">
                <span className="text-gray-500 text-sm">کد جلسه:</span>
                <span className="font-mono text-xl font-bold text-primary-600 dark:text-primary-400 tracking-widest">{meetingId}</span>
             </div>
           </div>

           <div className="space-y-4 bg-white dark:bg-dark-surface p-6 rounded-[2rem] shadow-sm border border-gray-200 dark:border-dark-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mr-1">نام نمایشی</label>
                <input 
                  type="text" 
                  value={userSettings.displayName}
                  onChange={(e) => updateSettings({ displayName: e.target.value })}
                  className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none dark:text-white text-right text-lg transition-all"
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              <div className="relative z-10 flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-black/40 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 dark:bg-white/10 rounded-lg text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <Settings className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تنظیمات صدا و تصویر</span>
                 </div>
                 <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
              </div>
           </div>

           <div className="flex flex-col gap-4">
              {/* Enhanced Join Button */}
              <button
                onClick={() => onChangeView(AppView.MEETING)}
                className="group relative w-full overflow-hidden rounded-2xl bg-primary-600 p-1 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] hover:scale-[1.02] active:scale-[0.98] outline-none focus:ring-4 focus:ring-primary-500/30"
              >
                  <div className="relative w-full h-full bg-primary-600 rounded-xl overflow-hidden px-6 py-4">
                        {/* Background Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700"></div>
                        
                        {/* Animated Sheen */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xl font-bold text-white tracking-tight">پیوستن به جلسه</span>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white text-primary-100 group-hover:text-primary-600 transition-all duration-300">
                                <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
                            </div>
                        </div>
                  </div>
              </button>

              <button 
                onClick={() => onChangeView(AppView.HOME)}
                className="w-full py-4 rounded-2xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group"
              >
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 انصراف و بازگشت
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};