import React from 'react';
import { BellRing, X } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-[2rem] shadow-sm border p-4 ${className}`}>
    {children}
  </div>
);

export const IconButton = ({ icon: Icon, onClick, className = "", active = false, darkMode = false }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all duration-300 active:scale-95 ${
      active 
        ? (darkMode ? 'bg-white text-black shadow-lg shadow-white/10 scale-110' : 'bg-black text-white shadow-lg shadow-gray-200 scale-110')
        : (darkMode ? 'bg-transparent text-gray-500 hover:bg-white/10' : 'bg-transparent text-gray-400 hover:bg-gray-100')
    } ${className}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
  </button>
);

export const NotificationToast = ({ message, onClose, visible, darkMode }: { message: string, onClose: () => void, visible: boolean, darkMode: boolean }) => {
  if (!visible) return null;
  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm p-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 animate-in slide-in-from-top-5 duration-500 ${darkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
        <BellRing size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm">Hatırlatıcı</h4>
        <p className="text-xs opacity-80">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 bg-white/10 rounded-full hover:bg-white/20">
        <X size={16} />
      </button>
    </div>
  );
};

export const CustomSlider = ({ value, min, max, onChange, darkMode }: { value: number, min: number, max: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, darkMode: boolean }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative w-full h-6 flex items-center group">
      <div className={`absolute w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div 
        className="absolute h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
      <div 
        className="absolute w-6 h-6 bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-500 ease-out flex items-center justify-center cursor-grab active:cursor-grabbing active:scale-110"
        style={{ left: `calc(${percentage}% - 12px)` }}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={onChange}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
    </div>
  );
};