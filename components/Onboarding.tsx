import React from 'react';
import { Wallet, Briefcase, CalendarDays, ArrowRight, Check } from 'lucide-react';
import { formatNumber } from '../utils';
import { Currency } from '../types';

interface OnboardingProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onFinish: () => void;
  onSkip: () => void;
  salary: string;
  setSalary: (val: string) => void;
  workHours: number;
  setWorkHours: (val: any) => void;
  salaryDay: number;
  setSalaryDay: (val: any) => void;
  t: any;
  darkMode: boolean;
  currency: Currency;
}

const Onboarding: React.FC<OnboardingProps> = ({ 
  step, 
  setStep, 
  onFinish, 
  onSkip, 
  salary, 
  setSalary, 
  workHours, 
  setWorkHours,
  salaryDay,
  setSalaryDay,
  t,
  darkMode,
  currency
}) => {
  const isLastStep = step === 4;

  const handleNext = () => {
    if (isLastStep) {
      onFinish();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 animate-in fade-in duration-500 ${bgClass}`}>
      <div className="w-full flex justify-end">
        <button onClick={onSkip} className="text-sm font-bold opacity-50 px-4 py-2 hover:opacity-100">{t.skip}</button>
      </div>

      <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="text-center animate-in slide-in-from-bottom-10 duration-700">
            <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-black text-white'}`}>
               <Wallet size={48} />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tight">{t.welcomeTitle}</h1>
            <p className="text-lg opacity-60 font-medium">{t.welcomeSubtitle}</p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            <h2 className="text-3xl font-black mb-4">{t.salaryQuestion}</h2>
            <p className="text-sm opacity-60 mb-8">{t.salaryDesc}</p>
            <div className={`rounded-[2rem] p-6 border-2 focus-within:border-indigo-500 transition-all ${cardBgClass} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold opacity-40">{currency.symbol}</span>
                <input 
                  type="text" 
                  value={salary} 
                  onChange={(e) => setSalary(formatNumber(e.target.value))}
                  placeholder="0" 
                  className="w-full bg-transparent border-none text-4xl font-black focus:ring-0 outline-none p-0" 
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            <h2 className="text-3xl font-black mb-4">{t.workHoursTitle}</h2>
            <p className="text-sm opacity-60 mb-8">{t.workHoursDesc}</p>
            <div className={`rounded-[2rem] p-6 border-2 focus-within:border-indigo-500 transition-all ${cardBgClass} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
               <div className="flex items-center gap-3">
                 <Briefcase className="opacity-40" />
                 <input 
                   type="number" 
                   value={workHours} 
                   onChange={(e) => setWorkHours(e.target.value)}
                   className="w-full bg-transparent border-none text-4xl font-black focus:ring-0 outline-none p-0" 
                   autoFocus
                 />
                 <span className="text-sm font-bold opacity-40">{t.hour}</span>
               </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            <h2 className="text-3xl font-black mb-4">{t.salaryDayTitle}</h2>
            <p className="text-sm opacity-60 mb-8">{t.salaryDayDesc}</p>
            <div className={`rounded-[2rem] p-6 border-2 focus-within:border-indigo-500 transition-all ${cardBgClass} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
               <div className="flex items-center gap-3">
                 <CalendarDays className="opacity-40" />
                 <input 
                   type="number" 
                   min="1"
                   max="31"
                   value={salaryDay} 
                   onChange={(e) => setSalaryDay(e.target.value)}
                   className="w-full bg-transparent border-none text-4xl font-black focus:ring-0 outline-none p-0" 
                   autoFocus
                 />
                 <span className="text-sm font-bold opacity-40">{t.day}</span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm mt-8">
        <button 
          onClick={handleNext}
          className={`w-full py-5 rounded-[1.5rem] font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-gray-200'}`}
        >
          {isLastStep ? t.finish : t.next}
          {!isLastStep && <ArrowRight size={20} />}
          {isLastStep && <Check size={20} />}
        </button>
        <div className="flex justify-center gap-2 mt-6">
          {[1,2,3,4].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? (darkMode ? 'w-8 bg-white' : 'w-8 bg-black') : (darkMode ? 'w-2 bg-gray-700' : 'w-2 bg-gray-200')}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;