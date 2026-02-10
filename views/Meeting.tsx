import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  MessageSquare, Users, MoreVertical, LayoutGrid, ChevronRight, Send, Paperclip
} from 'lucide-react';
import { AppView, Participant, MeetingState, ChatMessage } from '../types';
import { Button } from '../components/Button';
import { VideoTile } from '../components/VideoTile';
import { MOCK_PARTICIPANTS, INITIAL_CHAT_MESSAGES } from '../constants';

interface MeetingProps {
  onChangeView: (view: AppView) => void;
  meetingId: string;
}

export const Meeting: React.FC<MeetingProps> = ({ onChangeView, meetingId }) => {
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarMode, setSidebarMode] = useState<'none' | 'chat' | 'participants'>('none');
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [time, setTime] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'شما',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  // Dynamic grid calculation
  const getGridClasses = () => {
    if (screenShare) return 'grid-cols-1 md:grid-cols-[1fr_250px]';
    const count = participants.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-3 md:grid-cols-4';
  };

  return (
    <div className="h-screen bg-dark-bg text-white flex flex-col overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-14 bg-dark-surface border-b border-dark-border flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-sm">جلسه هفتگی تیم فنی</span>
            <span className="text-xs text-gray-400 font-mono">{formatTime(time)}</span>
          </div>
          <div className="bg-primary-500/10 text-primary-500 text-xs px-2 py-0.5 rounded flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
             پایدار
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Grid Container */}
        <div className={`flex-1 p-4 overflow-y-auto transition-all duration-300 ${sidebarMode !== 'none' ? 'mr-0 lg:ml-80' : ''}`}>
          
          {screenShare ? (
            <div className="h-full flex flex-col md:flex-row gap-4">
               {/* Screen Share View */}
               <div className="flex-1 bg-gray-900 rounded-2xl flex items-center justify-center border border-dark-border relative group">
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full z-10">شما در حال اشتراک‌گذاری هستید</div>
                  <MonitorUp className="w-24 h-24 text-gray-700" />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none"></div>
                  <Button onClick={() => setScreenShare(false)} className="absolute bottom-8 bg-blue-600 hover:bg-blue-700">توقف اشتراک‌گذاری</Button>
               </div>
               {/* Vertical Filmstrip */}
               <div className="h-48 md:h-full md:w-64 flex flex-row md:flex-col gap-4 overflow-auto p-1">
                  {participants.filter(p => !p.isMe).map(p => (
                    <div key={p.id} className="w-48 md:w-full shrink-0 aspect-video">
                      <VideoTile participant={p} />
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className={`grid gap-4 h-full content-center ${getGridClasses()}`}>
              {participants.map(p => (
                <div key={p.id} className={`aspect-video w-full ${participants.length === 1 ? 'max-w-4xl mx-auto h-[80vh]' : ''}`}>
                  <VideoTile participant={{...p, videoOn: p.isMe ? cameraOn : p.videoOn, audioOn: p.isMe ? micOn : p.audioOn}} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {sidebarMode !== 'none' && (
           <div className="absolute left-0 top-0 bottom-0 w-full sm:w-80 bg-dark-surface border-r border-dark-border flex flex-col z-20 shadow-2xl animate-enter">
              {/* Sidebar Header */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-dark-border">
                <h3 className="font-bold">
                  {sidebarMode === 'chat' ? 'پیام‌های متنی' : 'لیست حاضران'}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setSidebarMode('none')}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                 {sidebarMode === 'chat' ? (
                   <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-start' : 'items-end'}`}>
                           <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-400">{msg.senderName}</span>
                              <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                           </div>
                           <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${msg.senderId === 'me' ? 'bg-primary-700 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}`}>
                              {msg.text}
                           </div>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="space-y-2">
                      {participants.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-xs font-bold">
                                {p.name.substring(0,1)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{p.name} {p.isMe && '(شما)'}</span>
                                <span className="text-xs text-gray-500">{p.isHost ? 'میزبان' : 'مهمان'}</span>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              {!p.audioOn && <MicOff className="w-4 h-4 text-red-500" />}
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Sidebar Footer (Chat Input) */}
              {sidebarMode === 'chat' && (
                <div className="p-4 border-t border-dark-border bg-dark-surface">
                   <div className="relative">
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="پیام خود را بنویسید..."
                        className="w-full bg-gray-900 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none"
                      />
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white">
                        <Paperclip className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="flex justify-end mt-2">
                     <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()} className="rounded-lg">
                        <Send className="w-4 h-4 ml-2" />
                        ارسال
                     </Button>
                   </div>
                </div>
              )}
           </div>
        )}

      </div>

      {/* Control Bar (Sticky Bottom) */}
      <div className="h-20 bg-dark-surface border-t border-dark-border flex items-center justify-center px-4 gap-4 shrink-0 z-30">
         
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Button 
                 variant={micOn ? 'secondary' : 'danger'} 
                 size="icon" 
                 className={`w-12 h-12 rounded-2xl ${micOn ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}`}
                 onClick={() => setMicOn(!micOn)}
               >
                 {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
               </Button>
               <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                 {micOn ? 'قطع صدا' : 'وصل صدا'}
               </span>
            </div>

            <Button 
              variant={cameraOn ? 'secondary' : 'danger'} 
              size="icon" 
              className={`w-12 h-12 rounded-2xl ${cameraOn ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}`}
              onClick={() => setCameraOn(!cameraOn)}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
         </div>

         <div className="w-px h-8 bg-gray-700 mx-2 hidden sm:block"></div>

         <div className="flex items-center gap-3">
            <Button 
               variant={screenShare ? 'primary' : 'secondary'}
               size="icon"
               className={`w-12 h-12 rounded-2xl ${!screenShare ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}`}
               onClick={() => setScreenShare(!screenShare)}
            >
               <MonitorUp className="w-5 h-5" />
            </Button>

            <Button 
               variant={sidebarMode === 'chat' ? 'primary' : 'secondary'}
               size="icon"
               className={`w-12 h-12 rounded-2xl relative ${sidebarMode !== 'chat' ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}`}
               onClick={() => setSidebarMode(sidebarMode === 'chat' ? 'none' : 'chat')}
            >
               <MessageSquare className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-surface"></span>
            </Button>

            <Button 
               variant={sidebarMode === 'participants' ? 'primary' : 'secondary'}
               size="icon"
               className={`w-12 h-12 rounded-2xl ${sidebarMode !== 'participants' ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}`}
               onClick={() => setSidebarMode(sidebarMode === 'participants' ? 'none' : 'participants')}
            >
               <Users className="w-5 h-5" />
            </Button>
         </div>

         <div className="w-px h-8 bg-gray-700 mx-2 hidden sm:block"></div>

         <Button 
           variant="danger" 
           className="px-6 rounded-2xl h-12"
           onClick={() => onChangeView(AppView.SUMMARY)}
         >
           <PhoneOff className="w-5 h-5 ml-2" />
           <span className="hidden sm:inline">ترک جلسه</span>
         </Button>

      </div>

    </div>
  );
};