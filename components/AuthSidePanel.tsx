import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, ShieldCheck, Users, 
  MessageSquare
} from 'lucide-react';

export const AuthSidePanel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<any>(null);
  const slideDuration = 6000;

  const slides = [
    {
      id: 1,
      title: "ارتباط تصویری بدون تاخیر",
      desc: "تجربه‌ای روان و با کیفیت در بستر شبکه داخلی سازمان، بدون نگرانی از کندی اینترنت.",
    },
    {
      id: 2,
      title: "امنیت و حریم خصوصی",
      desc: "میزبانی داده‌ها در سرورهای امن سازمانی با رمزنگاری پیشرفته تمامی مکالمات.",
    },
    {
      id: 3,
      title: "ابزارهای تعامل تیمی",
      desc: "اشتراک‌گذاری صفحه نمایش، چت آنی و مدیریت هوشمند جلسات برای بهره‌وری بیشتر.",
    }
  ];

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    resetTimer();
  };

  // --- VISUALIZATION COMPONENTS (High Contrast Glass) ---

  const ConnectionVisual = () => (
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* Background Pulse Rings - More distinct */}
      <div className="absolute inset-0 border border-white/10 rounded-full animate-[ping_3s_ease-out_infinite]"></div>
      <div className="absolute inset-8 border border-white/20 rounded-full animate-[ping_3s_ease-out_infinite_1s]"></div>
      
      {/* Rotating Data Orbit */}
      <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
         <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] -translate-x-1/2"></div>
         <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] -translate-x-1/2"></div>
      </div>

      {/* Central Hub - Frosted Glass Container */}
      <div className="relative z-10 w-36 h-36 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center border border-white/30 transform rotate-3 animate-[float_6s_ease-in-out_infinite]">
         
         {/* Glossy Reflection */}
         <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
         
         {/* Icon - Bold White */}
         <Video className="w-16 h-16 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]" strokeWidth={2} />
         
         {/* Live Indicator - High Contrast */}
         <div className="absolute -top-4 -right-4 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-xl z-30 border-2 border-primary-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-black text-gray-900 tracking-wider">LIVE</span>
         </div>
      </div>

      {/* Speed Lines */}
      <div className="absolute top-12 left-12 w-1 h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-[fall_2.5s_linear_infinite]"></div>
      <div className="absolute bottom-12 right-12 w-1 h-12 bg-gradient-to-t from-transparent via-white/40 to-transparent animate-[rise_3.5s_linear_infinite]"></div>
    </div>
  );

  const SecurityVisual = () => (
    <div className="relative w-72 h-72 flex items-center justify-center">
       {/* Shield Layers */}
       <div className="absolute w-60 h-72 border border-white/10 rounded-[48px] animate-[pulse_4s_ease-in-out_infinite]"></div>
       <div className="absolute w-52 h-64 border border-white/20 rounded-[40px] animate-[pulse_4s_ease-in-out_infinite_1s]"></div>
       
       {/* Scanning Laser */}
       <div className="absolute w-72 h-1 bg-white/30 blur-sm top-0 animate-[scan-vertical_3s_ease-in-out_infinite]"></div>

       {/* Central Fortress - Frosted Glass */}
       <div className="relative z-10 w-36 h-40 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden animate-[float_5s_ease-in-out_infinite]">
          
          {/* Internal Grid Pattern */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
          </div>

          <ShieldCheck className="w-16 h-16 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)] relative z-20" strokeWidth={2} />
          
          {/* Glint Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[sheen_3s_ease-in-out_infinite_2s]"></div>
       </div>

       {/* Floating Lock Segments */}
       <div className="absolute -left-6 top-1/2 w-12 h-24 border-l-4 border-white/20 rounded-l-full animate-[pulse_3s_infinite]"></div>
       <div className="absolute -right-6 top-1/2 w-12 h-24 border-r-4 border-white/20 rounded-r-full animate-[pulse_3s_infinite_1.5s]"></div>
    </div>
  );

  const CollaborationVisual = () => (
    <div className="relative w-72 h-72 flex items-center justify-center perspective-1000">
       
       {/* Orbiting Elements */}
       <div className="absolute inset-0 border border-white/10 rounded-full transform rotate-x-60 animate-[spin_20s_linear_infinite]">
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-white/20 backdrop-blur-md rounded-full border border-white/40 -translate-x-1/2"></div>
       </div>

       {/* Main Card Stack - Frosted Glass */}
       <div className="relative z-10 w-44 h-32 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.25)] flex flex-col animate-[float_6s_ease-in-out_infinite]">
          {/* Header */}
          <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-white/80"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
          </div>
          {/* Body */}
          <div className="flex-1 flex items-center justify-center relative">
             <Users className="w-12 h-12 text-white drop-shadow-md" strokeWidth={2} />
          </div>
          
          {/* Pop-out Chat Bubble */}
          <div className="absolute -right-10 top-10 bg-white text-gray-900 p-2.5 rounded-2xl rounded-tl-none shadow-xl animate-[bounce-slow_4s_ease-in-out_infinite_1s] flex items-center gap-2 z-20">
             <MessageSquare className="w-4 h-4 text-primary-600" />
             <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
          </div>
          
          {/* Pop-out User Badge */}
          <div className="absolute -left-5 -bottom-5 bg-gradient-to-br from-white to-gray-100 w-12 h-12 rounded-full border-4 border-primary-600/30 flex items-center justify-center shadow-lg animate-[float_5s_ease-in-out_infinite_0.5s] z-20">
             <span className="text-sm font-black text-primary-700">JD</span>
          </div>
       </div>
    </div>
  );

  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden bg-primary-700 pointer-events-none">
       {/* Gradient Overlay for subtle depth */}
       <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-100"></div>

       {/* 1. Deep Rotating Nebula (Aurora) */}
       <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-[aurora_60s_linear_infinite] opacity-30">
           <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/20 rounded-full blur-[120px] mix-blend-overlay translate-x-[-20%] translate-y-[-20%]"></div>
           <div className="absolute top-1/2 left-1/2 w-[50%] h-[50%] bg-primary-900/40 rounded-full blur-[100px] mix-blend-multiply translate-x-[20%] translate-y-[20%]"></div>
       </div>

       {/* 2. Cyber Grid Overlay */}
       <div className="absolute inset-0" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
            }}>
       </div>

       {/* 3. Floating Data Particles */}
       <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
             <div 
               key={i}
               className="absolute rounded-full bg-white/70 animate-[float-particle_10s_linear_infinite]"
               style={{
                 width: Math.random() * 3 + 2 + 'px',
                 height: Math.random() * 3 + 2 + 'px',
                 left: Math.random() * 100 + '%',
                 top: Math.random() * 100 + '%',
                 animationDuration: (Math.random() * 10 + 15) + 's',
                 animationDelay: -(Math.random() * 20) + 's',
               }}
             ></div>
          ))}
       </div>

       {/* 4. Vignette */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1565C0_90%)] mix-blend-multiply opacity-50"></div>
    </div>
  );

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 text-center text-white">
      
      {/* Background Component */}
      <BackgroundAnimation />

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        
        {/* Dynamic Visualization Stage */}
        <div className="w-full h-[400px] flex items-center justify-center relative mb-8">
           {/* Stage Light / Glow */}
           <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-32 blur-[90px] bg-white/20 rounded-full pointer-events-none"></div>

           {/* Scene Switcher */}
           <div className="relative w-full h-full flex items-center justify-center">
             {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${
                    index === currentSlide 
                      ? 'opacity-100 scale-100 blur-0' 
                      : 'opacity-0 scale-90 blur-xl pointer-events-none'
                  }`}
                >
                   {index === 0 && <ConnectionVisual />}
                   {index === 1 && <SecurityVisual />}
                   {index === 2 && <CollaborationVisual />}
                </div>
             ))}
           </div>
        </div>

        {/* Typography */}
        <div className="relative min-h-[140px] w-full">
            {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`absolute inset-0 top-0 flex flex-col items-center transition-all duration-700 transform ${
                    index === currentSlide 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8 pointer-events-none'
                  }`}
                >
                  <h2 className="text-4xl font-extrabold tracking-tight mb-5 drop-shadow-lg text-white">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 text-lg leading-8 max-w-sm drop-shadow-md font-medium">
                    {slide.desc}
                  </p>
                </div>
            ))}
        </div>

        {/* Pagination Indicators */}
        <div className="mt-8 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSlideChange(idx)}
              className={`relative h-2 rounded-full transition-all duration-500 ease-out overflow-hidden ${
                currentSlide === idx ? 'w-12 bg-white/20' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {currentSlide === idx && (
                <div 
                  className="absolute inset-y-0 left-0 bg-white rounded-full h-full"
                  style={{ 
                    animation: `progress-fill ${slideDuration}ms linear forwards`
                  }}
                ></div>
              )}
            </button>
          ))}
        </div>

      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes scan-vertical {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: 100%; }
        }
        @keyframes fall {
          0% { transform: translateY(-50px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(50px); opacity: 0; }
        }
        @keyframes rise {
          0% { transform: translateY(50px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
        @keyframes sheen {
          0%, 100% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pan-floor {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes twinkle {
           0%, 100% { opacity: 0.2; transform: scale(0.8); }
           50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes aurora {
           0% { transform: rotate(0deg); }
           100% { transform: rotate(360deg); }
        }
        @keyframes float-particle {
           0% { transform: translateY(0) translateX(0); opacity: 0; }
           20% { opacity: 0.8; }
           80% { opacity: 0.8; }
           100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};