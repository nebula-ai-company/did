import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, Volume2, Sparkles } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Video Preview */}
        <div className="space-y-4 animate-enter">
          <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-dark-border group">
             {userSettings.videoEnabled ? (
                <>
                  <img src="https://picsum.photos/800/600" className="w-full h-full object-cover transform scale-x-[-1]" alt="Preview" />
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
                     HD 720p
                  </div>
                </>
             ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <VideoOff className="w-16 h-16 mb-4 opacity-50" />
                  <p>دوربین خاموش است</p>
                </div>
             )}
             
             {/* Audio Meter Overlay */}
             {userSettings.audioEnabled && (
               <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-xl flex gap-1 h-8 items-end">
                  {[1,2,3,4,5].map(i => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-green-500 rounded-full transition-all duration-75"
                      style={{ height: audioLevel > (i * 20) ? '100%' : '20%' }}
                    />
                  ))}
               </div>
             )}
          </div>

          <div className="flex justify-center gap-4">
             <Button 
               variant={userSettings.audioEnabled ? "secondary" : "danger"} 
               size="icon" 
               className="w-14 h-14 rounded-2xl"
               onClick={() => updateSettings({ audioEnabled: !userSettings.audioEnabled })}
             >
                {userSettings.audioEnabled ? <Mic /> : <MicOff />}
             </Button>
             <Button 
               variant={userSettings.videoEnabled ? "secondary" : "danger"} 
               size="icon" 
               className="w-14 h-14 rounded-2xl"
               onClick={() => updateSettings({ videoEnabled: !userSettings.videoEnabled })}
             >
                {userSettings.videoEnabled ? <Video /> : <VideoOff />}
             </Button>
             <Button 
               variant="ghost" 
               size="icon" 
               className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-dark-border"
             >
                <Sparkles className="w-5 h-5 text-purple-500" />
             </Button>
          </div>
        </div>

        {/* Right: Settings & Join */}
        <div className="space-y-8 animate-enter" style={{animationDelay: '0.1s'}}>
           <div className="text-center md:text-right">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">آماده پیوستن هستید؟</h2>
             <p className="text-gray-500">کد جلسه: <span className="font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">{meetingId}</span></p>
           </div>

           <div className="space-y-4 bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام نمایشی</label>
                <input 
                  type="text" 
                  value={userSettings.displayName}
                  onChange={(e) => updateSettings({ displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border focus:ring-2 focus:ring-primary-500 outline-none dark:text-white text-right"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                 <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">تنظیمات صدا و تصویر</span>
                 </div>
                 <div className="text-xs text-primary-600 font-medium">پیشرفته</div>
              </div>
           </div>

           <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full text-lg shadow-primary-500/25" onClick={() => onChangeView(AppView.MEETING)}>
                 پیوستن به جلسه
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => onChangeView(AppView.HOME)}>
                 انصراف
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};
