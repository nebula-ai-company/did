import React, { useState } from 'react';
import { AppView, UserSettings } from '../types';

// Import new separate components
import { Header } from '../components/home/Header';
import { TimeWidget } from '../components/home/TimeWidget';
import { NetworkStatusWidget } from '../components/home/NetworkStatusWidget';
import { CalendarWidget } from '../components/home/CalendarWidget';
import { StatsWidget } from '../components/home/StatsWidget';
import { HeroSection } from '../components/home/HeroSection';
import { ActionCards } from '../components/home/ActionCards';
import { RecentMeetings } from '../components/home/RecentMeetings';
import { Grainient } from '../components/Grainient';

interface HomeProps {
  onChangeView: (view: AppView) => void;
  setMeetingId: (id: string) => void;
  isAuthenticated: boolean;
  userSettings: UserSettings;
}

export const Home: React.FC<HomeProps> = ({ onChangeView, setMeetingId, isAuthenticated, userSettings }) => {
  const [inputCode, setInputCode] = useState('');

  const handleJoin = (code?: string) => {
    const codeToJoin = code || inputCode;
    if (codeToJoin.trim()) {
      setMeetingId(codeToJoin);
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
  `;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020200] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 selection:bg-primary-500/30 overflow-x-hidden relative">
      <style>{animationStyles}</style>

      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Grainient
            color1="#102138"
            color2="#102138"
            color3="#698BAB"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.03}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
        />
        
        {/* Grid Overlay - Visible only where animation is visible due to blend mode and top gradient masking */}
        <div 
            className="absolute inset-0 mix-blend-overlay opacity-20"
            style={{ 
                backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.8) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
            }}
        ></div>

        {/* Gradient Overlay for Text Readability at Top vs Animation at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-transparent"></div>
      </div>

      <Header 
        isAuthenticated={isAuthenticated} 
        userSettings={userSettings} 
        onChangeView={onChangeView} 
      />

      {/* --- Main Content --- */}
      <main className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 pb-20 relative z-10">
        {/* Removed items-start to allow columns to stretch to equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- Right Column: Sidebar (Time & Calendar) --- */}
          {/* On mobile: Last (Bottom). On Desktop (lg+): First (Right side in RTL) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-8 order-last lg:order-first h-full">
            {/* Moved HeroSection here to be on the right side and push widgets down */}
            <div className="lg:pr-2">
              <HeroSection isAuthenticated={isAuthenticated} />
            </div>
            
            <TimeWidget />
            {/* Passed className to make it grow, min-h-0 ensures it shrinks to fit parent container instead of expanding it */}
            <CalendarWidget className="flex-1 min-h-0" />
          </div>

          {/* --- Left Column: Main Dashboard Content --- */}
          {/* On mobile: First (Top). On Desktop (lg+): Flows naturally after Sidebar (Left side in RTL) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8 h-full">
            {/* Removed HeroSection from here */}
            
            {/* Actions Row */}
            <ActionCards 
              isAuthenticated={isAuthenticated}
              onNewMeeting={handleNewMeeting}
              onJoinMeeting={() => handleJoin()}
              inputCode={inputCode}
              setInputCode={setInputCode}
            />

            {/* Metrics Row: Stats & Network */}
            <div className="grid md:grid-cols-5 gap-6 animate-fade-up delay-2">
              <StatsWidget isAuthenticated={isAuthenticated} className="md:col-span-3" />
              <NetworkStatusWidget className="md:col-span-2" />
            </div>

            {/* Lists Row */}
            <RecentMeetings 
              isAuthenticated={isAuthenticated}
              onJoin={(code) => handleJoin(code)}
            />
          </div>

        </div>
      </main>
    </div>
  );
};