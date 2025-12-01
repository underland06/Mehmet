import React from 'react';
import { Transaction } from '../types';

interface CalendarViewProps {
  currentDate: Date;
  transactions: Transaction[];
  onDateClick: (day: number) => void;
  language: string;
  darkMode: boolean;
  currency?: any;
}

const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, transactions, onDateClick, language, darkMode }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = new Date(year, month, 1).getDay() === 0 ? 6 : new Date(year, month, 1).getDay() - 1; 

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDay }, (_, i) => i);

  const getDayStats = (day: number) => {
    if (!transactions) return { income: 0, expense: 0, hasTx: false };
    
    const dayTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });

    const income = dayTx.filter(t => t.type === 'income').reduce((acc, t) => acc + (t.amount || 0), 0);
    const expense = dayTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + (t.amount || 0), 0);

    return { income, expense, hasTx: dayTx.length > 0 };
  };

  const weekDays = language === 'tr' 
    ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className={`rounded-[2rem] p-4 shadow-sm border animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className={`grid grid-cols-7 gap-1 mb-2 text-center border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
        {weekDays.map(d => (
          <div key={d} className="text-[10px] font-black text-gray-400 uppercase">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`blank-${b}`} className="aspect-square"></div>)}
        
        {days.map(day => {
          const stats = getDayStats(day);
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
          
          return (
            <div 
              key={day} 
              onClick={() => onDateClick(day)}
              className={`aspect-square flex flex-col items-center justify-start pt-1 relative transition-all hover:scale-105 active:scale-95 cursor-pointer rounded-xl
                ${isToday 
                  ? (darkMode ? 'bg-white text-black' : 'bg-black text-white') 
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
                }
              `}
            >
              <span className={`text-sm font-medium`}>
                {day}
              </span>
              
              <div className="flex flex-col items-center justify-start w-full mt-0.5">
                {stats.income > 0 && (
                  <span className="text-[9px] font-bold text-green-500 leading-tight">
                    +{Math.round(stats.income)}
                  </span>
                )}
                {stats.expense > 0 && (
                  <span className="text-[9px] font-bold text-red-500 leading-tight">
                    -{Math.round(stats.expense)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;