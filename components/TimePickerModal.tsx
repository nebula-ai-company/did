import React, { useState, useEffect } from 'react';
import { X, Check, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { Button } from './Button';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
  initialTime: string;
}

// Helper to convert English digits to Persian
const toPersianDigits = (num: number | string) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

// Helper to convert Persian digits to English
const toEnglishDigits = (str: string) => {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
};

export const TimePickerModal: React.FC<TimePickerModalProps> = ({ isOpen, onClose, onConfirm, initialTime }) => {
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(0);

  useEffect(() => {
    if (isOpen && initialTime) {
      const parts = initialTime.split(':');
      if (parts.length === 2) {
        // Convert from potential Persian digits to English for parsing
        const hStr = toEnglishDigits(parts[0]);
        const mStr = toEnglishDigits(parts[1]);
        setSelectedHour(parseInt(hStr) || 0);
        setSelectedMinute(parseInt(mStr) || 0);
      }
    }
  }, [isOpen, initialTime]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const formattedHour = selectedHour.toString().padStart(2, '0');
    const formattedMinute = selectedMinute.toString().padStart(2, '0');
    
    // Return formatted string "HH:MM" using Persian digits for display consistency
    const timeStr = `${toPersianDigits(formattedHour)}:${toPersianDigits(formattedMinute)}`;
    onConfirm(timeStr);
    onClose();
  };

  const adjustHour = (delta: number) => {
    setSelectedHour(prev => {
      const newHour = (prev + delta + 24) % 24;
      return newHour;
    });
  };

  const adjustMinute = (delta: number) => {
    setSelectedMinute(prev => {
      const newMinute = (prev + delta + 60) % 60;
      return newMinute;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-enter">
      <div className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-primary-500/10 rounded-xl text-primary-500">
               <Clock className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">انتخاب زمان</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex items-center justify-center gap-4">
          
          {/* Hour Column */}
          <div className="flex flex-col items-center gap-4">
            <button onClick={() => adjustHour(1)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-white font-mono">{toPersianDigits(selectedHour.toString().padStart(2, '0'))}</span>
            </div>
            <span className="text-xs font-bold text-gray-500">ساعت</span>
            <button onClick={() => adjustHour(-1)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <div className="text-4xl font-bold text-gray-600 pb-6">:</div>

          {/* Minute Column */}
          <div className="flex flex-col items-center gap-4">
            <button onClick={() => adjustMinute(1)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-white font-mono">{toPersianDigits(selectedMinute.toString().padStart(2, '0'))}</span>
            </div>
             <span className="text-xs font-bold text-gray-500">دقیقه</span>
            <button onClick={() => adjustMinute(-1)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            انصراف
          </Button>
          <Button className="flex-1 gap-2" onClick={handleConfirm}>
            <Check className="w-4 h-4" />
            تایید زمان
          </Button>
        </div>

      </div>
    </div>
  );
};