import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Sparkles, 
  ArrowRight, Calendar as CalendarIcon, Clock, Copy, Check, 
  ChevronDown, Link as LinkIcon, AlertCircle, 
  Loader2, Zap, ShieldCheck, CheckCircle2, MoreHorizontal,
  Plus, X, AlignLeft, ChevronLeft, ChevronRight,
  Search
} from 'lucide-react';
import { Button } from '../components/Button';
import { AppView, UserSettings } from '../types';
import { Grainient } from '../components/Grainient';
import { TimePickerModal } from '../components/TimePickerModal';

// --- Mock Data ---
const MOCK_CONTACTS = [
  { id: '1', name: 'سارا احمدی', email: 'sara.ahmadi@did.ir', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'علی رضایی', email: 'ali.rezaei@did.ir', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'مریم کمالی', email: 'maryam.k@did.ir', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'حسین محمدی', email: 'hossein.m@did.ir', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'نازنین ایزدی', email: 'nazanin@did.ir', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'رضا تهرانی', email: 'reza.t@did.ir', avatar: 'https://i.pravatar.cc/150?u=6' },
];

// --- Custom Components ---

// Helper to convert English digits to Persian
const toPersianDigits = (num: number | string) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

// Helper to convert Persian digits to English
const toEnglishDigits = (str: string) => {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
}

interface DeviceSelectorProps {
  icon: React.ElementType;
  value: string;
  options: MediaDeviceInfo[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ 
  icon: Icon, 
  value, 
  options, 
  onChange, 
  placeholder,
  disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.deviceId === value);
  const label = selectedOption ? (selectedOption.label || `Device ${value.slice(0, 5)}...`) : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none group
          ${isOpen 
            ? 'bg-[#1F1F1F] border-primary-500 ring-1 ring-primary-500/50 text-white' 
            : 'bg-[#121212]/80 border-white/5 text-gray-300 hover:bg-[#1A1A1A] hover:border-white/10'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2 rounded-xl shrink-0 transition-colors ${isOpen ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="truncate text-sm font-medium text-right" dir="auto">{label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 z-[100] bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden animate-enter">
          <div className="max-h-[240px] overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
            {options.length > 0 ? (
              options.map((opt) => (
                <button
                  key={opt.deviceId}
                  onClick={() => {
                    onChange(opt.deviceId);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-all group
                    ${value === opt.deviceId 
                      ? 'bg-primary-600/10 text-primary-400' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <span className="truncate text-right w-full" dir="auto">{opt.label || `Device ${opt.deviceId.slice(0, 5)}...`}</span>
                  {value === opt.deviceId && <CheckCircle2 className="w-4 h-4 ml-2 shrink-0 text-primary-500" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-500 text-xs">هیچ دستگاهی یافت نشد</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Mini Calendar Component ---

interface DatePickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(new Date());

  // Dynamic Persian Date Calculation
  const { monthLabel, daysInMonth, startDayOfWeek, currentYearName, currentMonthName } = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' });
    const parts = formatter.formatToParts(viewDate);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
    
    // Parse Persian digits to integer
    const parsePersianInt = (str: string) => parseInt(str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()));
    
    const pDay = parsePersianInt(getPart('day'));
    const pMonth = getPart('month');
    const pYear = parsePersianInt(getPart('year'));

    // Find the Gregorian date of the 1st of this Persian month
    const firstOfMonth = new Date(viewDate);
    firstOfMonth.setDate(viewDate.getDate() - (pDay - 1));

    // Calculate start day of week (Persian: Sat=0 ... Fri=6)
    // Gregorian: Sun=0 ... Sat=6
    // Mapping: Greg(6)->0, Greg(0)->1, ... Formula: (GregorianDay + 1) % 7
    const startDayOfWeek = (firstOfMonth.getDay() + 1) % 7;

    // Calculate days in month by iterating until month changes
    let d = new Date(firstOfMonth);
    let count = 0;
    while (count < 32) {
      const m = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(d);
      if (m !== pMonth) break;
      count++;
      d.setDate(d.getDate() + 1);
    }
    const days = count > 0 ? count : 30; // Fallback

    return {
      monthLabel: `${pMonth} ${toPersianDigits(pYear)}`,
      currentMonthName: pMonth,
      currentYearName: toPersianDigits(pYear),
      daysInMonth: days,
      startDayOfWeek
    };
  }, [viewDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFirstOfPersianMonth = (date: Date) => {
    const formatter = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
    const pDay = parseInt(formatter.format(date).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()));
    const d = new Date(date);
    d.setDate(d.getDate() - (pDay - 1));
    return d;
  };

  const handlePrevMonth = () => {
    const first = getFirstOfPersianMonth(viewDate);
    const prev = new Date(first);
    prev.setDate(prev.getDate() - 5); // Go back safely into previous month
    setViewDate(prev);
  };

  const handleNextMonth = () => {
    const first = getFirstOfPersianMonth(viewDate);
    const next = new Date(first);
    next.setDate(next.getDate() + 35); // Go forward safely into next month
    setViewDate(next);
  };

  const handleSelectDay = (day: number) => {
    const fullDateStr = `${toPersianDigits(day)} ${currentMonthName} ${currentYearName}`;
    onSelect(fullDateStr);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={`w-full bg-[#121212] border rounded-xl px-4 py-3.5 text-white flex items-center gap-3 transition-colors text-right
            ${isOpen ? 'border-primary-500/50 ring-1 ring-primary-500/50' : 'border-white/10 hover:border-white/20'}
         `}
       >
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm flex-1 font-medium">{selectedDate || 'انتخاب تاریخ'}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
       </button>

       {isOpen && (
         <div className="absolute top-full mt-2 left-0 right-0 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 z-[100] shadow-2xl animate-enter">
            <div className="flex items-center justify-between mb-4">
               <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><ChevronRight className="w-4 h-4" /></button>
               <span className="text-sm font-bold text-white">{monthLabel}</span>
               <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
               {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => (
                 <div key={d} className="text-center text-xs text-gray-500 py-1 font-bold">{d}</div>
               ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
               {[...Array(startDayOfWeek)].map((_, i) => <div key={`empty-${i}`} />)}
               {[...Array(daysInMonth)].map((_, i) => {
                 const day = i + 1;
                 const fullDateStr = `${toPersianDigits(day)} ${currentMonthName} ${currentYearName}`;
                 const isSelected = selectedDate === fullDateStr;
                 
                 return (
                   <button 
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-sm transition-all font-medium
                        ${isSelected ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10'}
                      `}
                   >
                     {toPersianDigits(day)}
                   </button>
                 );
               })}
            </div>
         </div>
       )}
    </div>
  );
};

// --- Contact Picker Component ---

interface ContactPickerProps {
    participants: string[];
    onAdd: (contact: any) => void;
    onRemove: (id: string) => void;
}

const ContactPicker: React.FC<ContactPickerProps> = ({ participants, onAdd, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredContacts = MOCK_CONTACTS.filter(c => 
        !participants.includes(c.id) && 
        (c.name.includes(search) || c.email.includes(search))
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (contact: any) => {
        onAdd(contact);
        setSearch('');
        setIsOpen(false);
    };

    const addedContacts = MOCK_CONTACTS.filter(c => participants.includes(c.id));

    return (
        <div className="space-y-3" ref={containerRef}>
            <div className="relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="جستجوی نام یا ایمیل..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="w-full bg-[#121212] border border-white/10 hover:border-white/20 rounded-xl pr-10 pl-4 py-3.5 text-white text-sm outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-gray-600"
                />
                
                {isOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar animate-enter">
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map(contact => (
                                <button 
                                    key={contact.id}
                                    onClick={() => handleSelect(contact)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-right"
                                >
                                    <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full bg-gray-700" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white">{contact.name}</span>
                                        <span className="text-xs text-gray-500">{contact.email}</span>
                                    </div>
                                    <Plus className="w-4 h-4 text-gray-500 mr-auto" />
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">مخاطبی یافت نشد</div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Chips */}
            {addedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {addedContacts.map(contact => (
                        <div key={contact.id} className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-lg pl-1.5 pr-2 py-1 text-xs text-primary-200">
                            <img src={contact.avatar} alt="" className="w-5 h-5 rounded-full" />
                            <span>{contact.name}</span>
                            <button onClick={() => onRemove(contact.id)} className="hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

interface LobbyProps {
  onChangeView: (view: AppView) => void;
  userSettings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  meetingId: string;
}

export const Lobby: React.FC<LobbyProps> = ({ onChangeView, userSettings, updateSettings, meetingId }) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'schedule'>('instant');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [loadingStream, setLoadingStream] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Instant Form
  const [instantTitle, setInstantTitle] = useState('جلسه فوری');

  // Schedule Form State
  const [scheduleDate, setScheduleDate] = useState(() => {
     return new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  });
  const [scheduleTime, setScheduleTime] = useState('۱۰:۰۰');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDesc, setScheduleDesc] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number>();

  // Mouse effect state for Right Panel
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

  // Hardware Access
  useEffect(() => {
    getDevices();
    startStream();
    return () => {
      stopStream();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!loadingStream) startStream();
  }, [userSettings.videoDeviceId, userSettings.audioDeviceId]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = userSettings.videoEnabled);
      stream.getAudioTracks().forEach(track => track.enabled = userSettings.audioEnabled);
    }
  }, [userSettings.videoEnabled, userSettings.audioEnabled, stream]);

  const getDevices = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      setDevices(devs);
      setCameras(devs.filter(d => d.kind === 'videoinput'));
      setMics(devs.filter(d => d.kind === 'audioinput'));
    } catch (err) {
      console.error("Error listing devices", err);
    }
  };

  const startStream = async () => {
    setLoadingStream(true);
    setPermissionError(false);
    stopStream();

    const constraints = {
      video: userSettings.videoDeviceId && userSettings.videoDeviceId !== 'default' 
        ? { deviceId: { exact: userSettings.videoDeviceId } } 
        : true,
      audio: userSettings.audioDeviceId && userSettings.audioDeviceId !== 'default' 
        ? { deviceId: { exact: userSettings.audioDeviceId } } 
        : true
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
      
      newStream.getVideoTracks().forEach(track => track.enabled = userSettings.videoEnabled);
      newStream.getAudioTracks().forEach(track => track.enabled = userSettings.audioEnabled);

      // --- FIX: Update 'default' to actual device ID to show correct label in dropdown ---
      const videoTrack = newStream.getVideoTracks()[0];
      const audioTrack = newStream.getAudioTracks()[0];
      const updates: Partial<UserSettings> = {};
      
      if (userSettings.videoDeviceId === 'default' && videoTrack) {
          const settings = videoTrack.getSettings();
          if (settings.deviceId) updates.videoDeviceId = settings.deviceId;
      }
      
      if (userSettings.audioDeviceId === 'default' && audioTrack) {
          const settings = audioTrack.getSettings();
          if (settings.deviceId) updates.audioDeviceId = settings.deviceId;
      }

      if (Object.keys(updates).length > 0) {
         updateSettings(updates);
      }
      // ---------------------------------------------------------------------------------

      setupAudioVisualizer(newStream);
      setLoadingStream(false);
      
      // Refresh devices to ensure labels are populated after permission grant
      getDevices();
    } catch (err) {
      console.error("Error starting stream", err);
      setLoadingStream(false);
      setPermissionError(true);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const setupAudioVisualizer = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateLevel = () => {
      if (!userSettings.audioEnabled) {
          setAudioLevel(0);
          requestRef.current = requestAnimationFrame(updateLevel);
          return;
      }
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length / 2; i++) sum += dataArray[i];
      const average = sum / (dataArray.length / 2);
      setAudioLevel(prev => prev + (Math.min(100, average * 1.5) - prev) * 0.2);
      requestRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://did.ir/meet/${meetingId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 font-sans overflow-x-hidden relative flex items-center justify-center p-4 lg:p-6">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 2px; }
        .animate-enter-up { animation: enter-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes enter-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Grainient color1="#0A0F1C" color2="#000000" color3="#111827" timeSpeed={0.15} opacity={0.6} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
      </div>

      {/* Time Picker Modal */}
      <TimePickerModal 
         isOpen={isTimePickerOpen} 
         onClose={() => setIsTimePickerOpen(false)} 
         onConfirm={setScheduleTime}
         initialTime={scheduleTime}
      />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative z-10 items-start">
        
        {/* --- Header & Back Button (Mobile only) --- */}
        <div className="lg:col-span-12 flex justify-between items-center mb-2 animate-enter-up lg:hidden">
           <Button variant="ghost" className="text-gray-400 hover:text-white gap-2 pl-0 hover:bg-transparent" onClick={() => onChangeView(AppView.HOME)}>
              <ArrowRight className="w-5 h-5" />
              <span className="font-medium">بازگشت</span>
           </Button>
        </div>

        {/* --- LEFT: Preview & Configuration --- */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-enter-up h-full" style={{ animationDelay: '100ms' }}>
            
            <div className="hidden lg:flex justify-between items-center mb-1">
                <Button variant="ghost" className="text-gray-400 hover:text-white gap-2 pl-0 hover:bg-transparent group" onClick={() => onChangeView(AppView.HOME)}>
                    <div className="bg-white/5 p-2 rounded-xl group-hover:bg-white/10 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-lg">بازگشت به خانه</span>
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-gray-400 backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>اتصال ایمن برقرار است</span>
                </div>
            </div>

            {/* Video Card */}
            <div className="relative aspect-video bg-[#0A0A0A] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                
                {permissionError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4 bg-[#0A0A0A]">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/10">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">دسترسی مسدود شد</h3>
                            <p className="text-gray-500 text-sm">لطفاً دسترسی به دوربین و میکروفون را فعال کنید.</p>
                        </div>
                        <Button onClick={getDevices} variant="secondary" size="sm" className="bg-white/5 hover:bg-white/10 border-white/5 text-white">
                            تلاش مجدد
                        </Button>
                    </div>
                ) : (
                    <>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            playsInline 
                            className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-700 ${userSettings.videoEnabled && !loadingStream ? 'opacity-100' : 'opacity-0'}`}
                        />
                        
                        {(!userSettings.videoEnabled || loadingStream) && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0F11]">
                                {loadingStream ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                        <span className="text-gray-500 text-xs font-medium tracking-widest uppercase">Initializing</span>
                                    </div>
                                ) : (
                                    <div className="relative group/avatar">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center shadow-2xl ring-4 ring-[#1A1A1A]">
                                            <span className="text-5xl font-bold text-gray-500 select-none">
                                                {userSettings.displayName.charAt(0)}
                                            </span>
                                        </div>
                                        {/* Audio Rings */}
                                        {userSettings.audioEnabled && (
                                            <>
                                              <div className="absolute inset-0 rounded-full border border-primary-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                              <div className="absolute inset-0 rounded-full border border-primary-500/10 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
                                            </>
                                        )}
                                    </div>
                                )}
                             </div>
                        )}

                        <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                             <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-white/90 flex items-center gap-3 shadow-lg">
                                    <div className={`w-2 h-2 rounded-full ${userSettings.audioEnabled ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                    {userSettings.displayName} (شما)
                                </div>
                                <div className="bg-black/60 backdrop-blur-xl p-2 rounded-xl border border-white/10 text-white/80 shadow-lg pointer-events-auto cursor-pointer hover:bg-black/80 transition-colors">
                                     <MoreHorizontal className="w-5 h-5" />
                                </div>
                             </div>

                             <div className="flex items-center justify-center gap-4 pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  <button 
                                      onClick={() => updateSettings({ audioEnabled: !userSettings.audioEnabled })}
                                      className={`
                                        h-14 rounded-2xl flex items-center gap-4 px-6 transition-all duration-200 border shadow-xl backdrop-blur-xl
                                        ${userSettings.audioEnabled 
                                            ? 'bg-black/60 border-white/10 hover:bg-white/10 text-white' 
                                            : 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-500'}
                                      `}
                                  >
                                      {userSettings.audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                      {userSettings.audioEnabled && (
                                        <div className="flex items-end gap-1 h-4">
                                            {[...Array(4)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-1 bg-white rounded-full transition-all duration-75"
                                                    style={{ height: `${Math.max(20, audioLevel * (0.8 + Math.random()))}%` }}
                                                ></div>
                                            ))}
                                        </div>
                                      )}
                                  </button>

                                  <button 
                                      onClick={() => updateSettings({ videoEnabled: !userSettings.videoEnabled })}
                                      className={`
                                        h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-200 border shadow-xl backdrop-blur-xl
                                        ${userSettings.videoEnabled 
                                            ? 'bg-black/60 border-white/10 hover:bg-white/10 text-white' 
                                            : 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-500'}
                                      `}
                                  >
                                      {userSettings.videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                  </button>
                             </div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DeviceSelector 
                    icon={Video}
                    value={userSettings.videoDeviceId}
                    options={cameras}
                    onChange={(val) => updateSettings({ videoDeviceId: val })}
                    placeholder="انتخاب دوربین..."
                    disabled={cameras.length === 0}
                />
                <DeviceSelector 
                    icon={Mic}
                    value={userSettings.audioDeviceId}
                    options={mics}
                    onChange={(val) => updateSettings({ audioDeviceId: val })}
                    placeholder="انتخاب میکروفون..."
                    disabled={mics.length === 0}
                />
            </div>
        </div>

        {/* --- RIGHT: Join Actions --- */}
        <div className="lg:col-span-5 flex flex-col animate-enter-up" style={{ animationDelay: '200ms' }}>
            <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-[#121212]/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-visible group h-full"
            >
                {/* 1. Static Border */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none"></div>

                {/* 2. Dynamic Border Glow */}
                <div 
                    className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-200"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, #2563eb, transparent 40%)`,
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
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-[2rem]"
                    style={{
                        opacity,
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.1), transparent 40%)`
                    }}
                ></div>
                
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 p-8 flex flex-col h-full">
                    <div className="mb-6 text-center lg:text-right">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">آماده ورود هستید؟</h1>
                        <p className="text-gray-400 text-sm">تنظیمات نهایی را انجام دهید و به جلسه بپیوندید.</p>
                    </div>

                    <div className="bg-[#0A0A0A] p-1.5 rounded-2xl mb-6 border border-white/5 flex relative shrink-0">
                        <div 
                            className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#262626] shadow-sm transition-all duration-300 ease-out border border-white/10"
                            style={{ 
                                left: activeTab === 'instant' ? '50%' : '6px', 
                                right: activeTab === 'instant' ? '6px' : '50%' 
                            }}
                        ></div>

                        <button 
                            onClick={() => setActiveTab('instant')}
                            className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'instant' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Zap className="w-4 h-4" />
                            جلسه فوری
                        </button>
                        <button 
                            onClick={() => setActiveTab('schedule')}
                            className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'schedule' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <CalendarIcon className="w-4 h-4" />
                            برنامه‌ریزی
                        </button>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1">
                        {activeTab === 'instant' ? (
                            <div className="space-y-6 animate-enter-up pt-2">
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 block text-right">عنوان جلسه (اختیاری)</label>
                                    <input 
                                        type="text" 
                                        value={instantTitle}
                                        onChange={(e) => setInstantTitle(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all outline-none placeholder:text-gray-700 font-medium"
                                        placeholder="نامی برای جلسه بنویسید..."
                                    />
                                </div>

                                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">کد جلسه</span>
                                        <button 
                                            onClick={handleCopyLink}
                                            className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                                            title="کپی لینک"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20">
                                            <LinkIcon className="w-6 h-6" />
                                        </div>
                                        <span className="text-3xl font-mono font-bold text-white tracking-widest">{meetingId}</span>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl flex gap-3 items-start">
                                    <Sparkles className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-primary-200/80 leading-relaxed">
                                        شما در حال ایجاد یک جلسه فوری هستید. پس از ورود می‌توانید لینک را با دیگران به اشتراک بگذارید.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-enter-up pt-1 pb-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 block text-right">عنوان جلسه</label>
                                    <input 
                                        type="text" 
                                        value={scheduleTitle}
                                        onChange={(e) => setScheduleTitle(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all outline-none placeholder:text-gray-700"
                                        placeholder="مثلاً: جلسه هفتگی تیم فنی"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 block text-right">توضیحات</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute top-3.5 right-3.5 w-4 h-4 text-gray-500" />
                                        <textarea
                                            value={scheduleDesc}
                                            onChange={(e) => setScheduleDesc(e.target.value)}
                                            className="w-full bg-[#121212] border border-white/10 hover:border-white/20 rounded-xl pr-10 pl-4 py-3.5 text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all outline-none placeholder:text-gray-700 resize-none h-20 text-sm"
                                            placeholder="دستور جلسه را بنویسید..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 block text-right">تاریخ</label>
                                        <DatePicker selectedDate={scheduleDate} onSelect={setScheduleDate} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 block text-right">ساعت</label>
                                        <button 
                                            onClick={() => setIsTimePickerOpen(true)}
                                            className="w-full bg-[#121212] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white flex items-center gap-3 transition-colors text-right"
                                        >
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm flex-1 font-medium truncate">{scheduleTime || 'انتخاب ساعت'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 block text-right">دعوت از شرکت‌کنندگان</label>
                                    <ContactPicker 
                                        participants={participants}
                                        onAdd={(c) => setParticipants([...participants, c.id])}
                                        onRemove={(id) => setParticipants(participants.filter(p => p !== id))}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-3 shrink-0">
                        <Button 
                            size="lg" 
                            className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 text-lg font-bold border border-primary-500/50" 
                            onClick={() => onChangeView(AppView.MEETING)}
                        >
                            {activeTab === 'instant' ? (
                                <>
                                    پیوستن به جلسه
                                    <ArrowRight className="w-5 h-5 mr-2" />
                                </>
                            ) : (
                                'ثبت و ارسال دعوت‌نامه'
                            )}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="lg" 
                            className="w-full h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5" 
                            onClick={() => onChangeView(AppView.HOME)}
                        >
                            انصراف
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};