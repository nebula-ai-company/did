
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Signal, SignalHigh, SignalLow, Pin, User, MoreHorizontal, Hand } from 'lucide-react';
import { Participant } from '../types';

interface VideoTileProps {
  participant: Participant;
  onPin?: () => void;
  mediaStream?: MediaStream | null;
  className?: string;
}

export const VideoTile: React.FC<VideoTileProps> = ({ participant, onPin, mediaStream, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State for local audio visualization (smooth scaling)
  const [localAudioLevel, setLocalAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>();

  // --- Audio Analysis for Local User ("Me") ---
  useEffect(() => {
    // Only run for "Me" when audio is on and stream exists
    if (!participant.isMe || !mediaStream || !participant.audioOn) {
       setLocalAudioLevel(0);
       return;
    }

    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        // Create analyzer for this component
        const source = ctx.createMediaStreamSource(mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.5; // Smooths out the jitter
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const update = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            // Focus on vocal frequencies (usually lower bins in small FFT)
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const avg = sum / dataArray.length; 
            
            // Normalize volume (empirically tuned for visibility)
            const target = Math.min(1, avg / 50); 
            
            // Linear interpolation (Lerp) for smooth transition between frames
            setLocalAudioLevel(prev => {
                const diff = target - prev;
                return prev + diff * 0.15; 
            });
            
            rafRef.current = requestAnimationFrame(update);
        };
        update();

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            source.disconnect();
            analyser.disconnect();
        };
    } catch (e) {
        console.error("Audio Analysis Error in VideoTile", e);
    }
  }, [participant.isMe, mediaStream, participant.audioOn]);


  // --- Video Stream Attachment ---
  useEffect(() => {
    if (videoRef.current && mediaStream && participant.isMe) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, participant.isMe, participant.videoOn]);

  const getConnectionIcon = () => {
    switch (participant.connectionQuality) {
      case 'poor': return <SignalLow className="w-4 h-4 text-red-500" />;
      case 'fair': return <Signal className="w-4 h-4 text-yellow-500" />;
      default: return <SignalHigh className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-3xl bg-[#18181b] border border-white/5 shadow-2xl group transition-all duration-300 ${participant.isSpeaking ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-[#09090b]' : ''} ${className}`}>
      
      {/* --- 1. Background Layer (Video or Blurred Image) --- */}
      <div className="absolute inset-0 bg-gray-900">
        {participant.videoOn ? (
           participant.isMe && mediaStream ? (
              <video 
                 ref={videoRef}
                 autoPlay
                 muted
                 playsInline
                 className="w-full h-full object-cover transform scale-x-[-1]"
              />
           ) : (
              // Mock Remote Video (Image)
              <img 
                 src={participant.avatarUrl} 
                 alt={participant.name}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
           )
        ) : (
           // Video OFF: Blurred Background of the Person
           <>
              {participant.avatarUrl ? (
                <img 
                    src={participant.avatarUrl} 
                    className="w-full h-full object-cover blur-2xl opacity-50 scale-125 transform" 
                    alt="Background Blur"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black"></div>
              )}
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
           </>
        )}
      </div>

      {/* --- 2. Avatar & Speaking Animation Layer (Only if Video Off) --- */}
      {!participant.videoOn && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative flex items-center justify-center">
                
                {/* Speaking Animations */}
                {participant.isMe ? (
                    // "Me": React to real volume
                    <>
                        {/* Outer Ripple */}
                        <div 
                            className="absolute inset-0 rounded-full bg-primary-500/30 transition-all duration-75 ease-out will-change-transform"
                            style={{ 
                                transform: `scale(${1 + localAudioLevel * 1.8})`,
                                opacity: Math.max(0, (localAudioLevel - 0.1) * 0.8) 
                            }}
                        ></div>
                        {/* Inner Ripple */}
                        <div 
                            className="absolute inset-0 rounded-full bg-primary-400/20 transition-all duration-150 ease-out will-change-transform"
                            style={{ 
                                transform: `scale(${1 + localAudioLevel * 2.8})`,
                                opacity: Math.max(0, (localAudioLevel - 0.2) * 0.5) 
                            }}
                        ></div>
                    </>
                ) : (
                   // Remote User: Smooth CSS Animation based on boolean state
                   participant.isSpeaking && (
                       <>
                           <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-[ping-slow_2s_infinite]"></div>
                           <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-[ping-slow_2s_infinite_0.6s]"></div>
                       </>
                   )
                )}
                
                {/* Central Avatar */}
                <div 
                    className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-gray-800 to-gray-700 shadow-2xl ring-4 ring-black/20 transition-transform duration-100 ease-out"
                    style={participant.isMe ? { transform: `scale(${1 + localAudioLevel * 0.1})` } : {}}
                >
                  {participant.avatarUrl ? (
                     <img src={participant.avatarUrl} className="w-full h-full rounded-full object-cover" />
                  ) : (
                     <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-700">
                         <User className="w-10 h-10 sm:w-14 sm:h-14 text-white/50" />
                     </div>
                  )}
                </div>
            </div>
        </div>
      )}

      {/* --- 3. UI Overlay Layer --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Hand Raised Indicator (Top Left) */}
      {participant.isHandRaised && (
         <div className="absolute top-4 left-4 z-20 bg-primary-600 text-white p-2 rounded-xl shadow-lg shadow-primary-600/30 animate-bounce border border-primary-500/20">
            <Hand className="w-5 h-5" />
         </div>
      )}

      {/* Top Right: Status Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
         {/* Mute Indicator */}
         {!participant.audioOn && (
            <div className="w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg animate-enter">
                <MicOff className="w-4 h-4" />
            </div>
         )}
         
         {/* Hover Controls */}
         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300 pointer-events-auto">
             <div className="h-8 px-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center text-white/80">
                {getConnectionIcon()}
             </div>
             <button className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
             </button>
             {onPin && (
                <button onClick={onPin} className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors">
                    <Pin className="w-3.5 h-3.5" />
                </button>
             )}
         </div>
      </div>

      {/* Bottom Left: Name Tag */}
      <div className="absolute bottom-4 left-4 z-20 max-w-[80%]">
        <div className="flex flex-col items-start gap-1">
             {/* Name Pill */}
             <div className="bg-black/40 hover:bg-black/60 backdrop-blur-xl pl-3 pr-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-lg transition-colors cursor-default">
                {participant.isSpeaking && (
                    <div className="flex gap-0.5 h-3 items-end">
                        <div className="w-1 bg-green-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite]"></div>
                        <div className="w-1 bg-green-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_0.1s]"></div>
                        <div className="w-1 bg-green-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]"></div>
                    </div>
                )}
                <span className="text-white text-sm font-bold truncate leading-none pt-0.5">
                    {participant.name} {participant.isMe && <span className="text-white/50 font-medium">(شما)</span>}
                </span>
             </div>
        </div>
      </div>
      
      <style>{`
        @keyframes music-bar {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
        }
        @keyframes ping-slow {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.4); opacity: 0.3; }
            100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
