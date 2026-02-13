
import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Volume1, X } from 'lucide-react';

interface MusicPlayerProps {
  stream: MediaStream;
  onClose: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ stream, onClose }) => {
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const requestRef = useRef<number>();
  
  // Get track title from the video track label (usually contains Tab name)
  const trackTitle = stream.getVideoTracks()[0]?.label || "صدای سیستم";
  // Strip " - Google Chrome" etc if possible for cleaner UI
  const displayTitle = trackTitle.replace(/ - \w+ \w+$/, '');

  useEffect(() => {
    if (!stream) return;

    // 1. Setup Audio Context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Create source from the shared stream
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    const gainNode = ctx.createGain();

    // Configuration for smoother animation
    analyser.fftSize = 64; // Low FFT for simple visualizer in small space
    analyser.smoothingTimeConstant = 0.8; 
    
    gainNode.gain.value = volume;

    // Routing: Source -> Analyser (Visuals) -> Gain (Volume) -> Destination (Speakers)
    source.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNodeRef.current = gainNode;

    // 2. Visualizer Loop
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    
    const draw = () => {
      if (!canvas) return;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const width = canvas.width;
      const height = canvas.height;

      requestRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, width, height);

      // Create App Theme Gradient (Primary Blue range)
      const gradient = canvasCtx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#2196F3'); // Primary 500
      gradient.addColorStop(1, '#0d47a1'); // Primary 900

      canvasCtx.fillStyle = gradient;

      // Draw Bars
      const barWidth = (width / bufferLength) * 2;
      let barHeight;
      let x = 0;
      
      // Only show lower frequencies which are more active
      const usefulBuffer = Math.floor(bufferLength * 0.8);

      for (let i = 0; i < usefulBuffer; i++) {
        const percent = dataArray[i] / 255;
        barHeight = Math.max(2, percent * height); // Ensure min height

        // Draw rounded bars
        const radius = 2;
        canvasCtx.beginPath();
        canvasCtx.roundRect(x, height - barHeight, barWidth - 2, barHeight, radius);
        canvasCtx.fill();

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (ctx.state !== 'closed') ctx.close();
    };
  }, [stream]);

  // Handle Volume Changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-6 py-4 shadow-2xl flex items-center gap-4 ring-1 ring-white/5 relative overflow-hidden group select-none h-20 transition-all hover:bg-black/70">
        
        {/* Animated Glow Background - STRICTLY BLUE */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-blue-400/10 to-primary-600/10 opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>

        {/* Icon (Height 12 = 3rem = 48px) */}
        <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800/80 to-black/80 border border-white/10 flex items-center justify-center shrink-0 shadow-lg overflow-hidden group/icon backdrop-blur-md">
           <div className="absolute inset-0 bg-primary-500/20 animate-pulse"></div>
           <Music className="w-5 h-5 text-white relative z-10 group-hover/icon:scale-110 transition-transform duration-300" />
           
           {/* Mini EQ overlay in icon */}
           <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-end justify-center gap-0.5 pb-1 opacity-50">
               {[1,2,3,2,1].map((n, i) => (
                   <div key={i} className="w-0.5 bg-white rounded-t-sm animate-[music-bar_1s_ease-in-out_infinite]" style={{ height: `${n * 25}%`, animationDelay: `${i * 0.1}s` }}></div>
               ))}
           </div>
        </div>

        {/* Info & Visualizer */}
        <div className="flex flex-col justify-center gap-1 min-w-[140px] max-w-[180px] relative z-10 h-full">
            <span className="text-xs font-bold text-white truncate text-right leading-tight pt-1" dir="auto" title={displayTitle}>
                {displayTitle}
            </span>
            <div className="flex items-center gap-1.5 opacity-60">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] text-gray-300">در حال پخش</span>
            </div>
            
            {/* Canvas Container */}
            <div className="h-5 w-full relative opacity-80 mt-auto">
                <canvas 
                    ref={canvasRef} 
                    width={180} 
                    height={20} 
                    className="w-full h-full object-contain"
                />
            </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/10 mx-1"></div>

        {/* Controls */}
        <div className="flex items-center gap-3 relative z-10 pl-1" dir="ltr">
            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : (volume < 0.5 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />)}
                </button>
                
                <div className="w-20 h-1.5 bg-gray-700/50 rounded-full overflow-hidden relative cursor-pointer group/slider backdrop-blur-sm">
                    {/* Fill */}
                    <div 
                        className="absolute top-0 bottom-0 left-0 bg-primary-500 transition-all duration-100 ease-out" 
                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    ></div>
                    {/* Input */}
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Stop Button */}
            <button 
                onClick={onClose}
                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 shadow-sm backdrop-blur-md"
                title="توقف پخش"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    </div>
  );
};
