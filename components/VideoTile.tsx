import React from 'react';
import { Mic, MicOff, Signal, SignalHigh, SignalLow, Pin } from 'lucide-react';
import { Participant } from '../types';

interface VideoTileProps {
  participant: Participant;
  isGrid?: boolean;
  onPin?: () => void;
}

export const VideoTile: React.FC<VideoTileProps> = ({ participant, isGrid = true, onPin }) => {
  const getConnectionIcon = () => {
    switch (participant.connectionQuality) {
      case 'poor': return <SignalLow className="w-4 h-4 text-red-500" />;
      case 'fair': return <Signal className="w-4 h-4 text-yellow-500" />;
      default: return <SignalHigh className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className={`relative group overflow-hidden rounded-2xl bg-gray-900 shadow-lg border-2 transition-all duration-300 ${participant.isSpeaking ? 'border-green-500 shadow-green-500/20' : 'border-transparent'}`}>
      
      {/* Video Feed Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
        {participant.videoOn ? (
          <img 
            src={participant.avatarUrl} 
            alt={participant.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {participant.name.substring(0, 1)}
          </div>
        )}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
        
        {/* Top Controls */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-lg">
             {getConnectionIcon()}
          </div>
          <button onClick={onPin} className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 text-white transition-colors">
            <Pin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Name Tag (Always Visible) */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg max-w-[80%]">
          <span className="text-white text-sm font-medium truncate">{participant.name} {participant.isMe && '(شما)'}</span>
        </div>
        
        {/* Mic Status */}
        <div className={`p-1.5 rounded-lg backdrop-blur-md ${!participant.audioOn ? 'bg-red-500/80 text-white' : 'bg-black/60 text-white'}`}>
          {!participant.audioOn ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </div>
      </div>

      {/* Speaking Indicator Pulse (if speaking but no border allowed by layout) */}
      {participant.isSpeaking && (
        <div className="absolute inset-0 rounded-2xl border-4 border-green-500 opacity-20 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};
