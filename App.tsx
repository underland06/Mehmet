import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Settings, Plus, ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, Repeat, DollarSign, PieChart, Home, Trash2, Edit2, X, 
  Briefcase, AlertTriangle, Globe, CalendarDays, Clock, Calculator, Bell, Check, 
  Layers, Moon, Sun, Coffee, ChevronDown, RotateCcw
} from 'lucide-react';

import { Transaction, GroupedTransactions, Recurrence } from './types';
import { CURRENCIES, TRANSLATIONS } from './constants';
import { formatNumber, parseNumber } from './utils';
import { Card, IconButton, NotificationToast, CustomSlider } from './components/UIComponents';
import CalendarView from './components/CalendarView';
import Onboarding from './components/Onboarding';

export default function FinanceApp() {
  // --- STATE ---
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('finance_lang') || 'tr');
  const t = TRANSLATIONS[language] || TRANSLATIONS['tr'];
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // SPLASH SCREEN STATE
  const [showSplash, setShowSplash] = useState(true);

  // ONBOARDING STATE
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_onboarding_complete');
    return !saved; 
  });
  const [onboardingStep, setOnboardingStep] = useState(1);

  const [reminderDays, setReminderDays] = useState<number>(() => {
    const saved = localStorage.getItem('finance_reminderDays');
    return saved ? parseInt(saved) : 3;
  });

  const [holidayDays, setHolidayDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('finance_holidayDays');
    return saved ? JSON.parse(saved) : [0]; // Default Pazar (0)
  });

  const [salaryDay, setSalaryDay] = useState<number>(() => {
    const saved = localStorage.getItem('finance_salaryDay');
    return saved ? parseInt(saved) : 1; 
  });
  
  const [monthlyWorkHours, setMonthlyWorkHours] = useState<number>(() => {
    const saved = localStorage.getItem('finance_workHours');
    return saved ? parseInt(saved) : 225; 
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : []; 
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('finance_currency');
    return saved ? JSON.parse(saved) : CURRENCIES[0];
  });

  const [userGroups, setUserGroups] = useState<string[]>(() => {
    const saved = localStorage.getItem('finance_groups');
    return saved ? JSON.parse(saved) : ['Krediler', 'Faturalar'];
  });
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_notifications');
    return saved ? JSON.parse(saved) : true;
  });

  const [monthlyNetSalary, setMonthlyNetSalary] = useState<string>(() => {
    const saved = localStorage.getItem('finance_salary');
    return saved ? JSON.parse(saved) : ''; 
  });

  const [activeTab, setActiveTab] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false); // Reset Modal State
  const [showGroupModal, setShowGroupModal] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formAmount, setFormAmount] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formDate, setFormDate] = useState(''); 
  const [formGroup, setFormGroup] = useState(''); 
  const [formAlert, setFormAlert] = useState(false);
  const [formRecurring, setFormRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [recurrenceDuration, setRecurrenceDuration] = useState(1);
  const [weekdaysOnly, setWeekdaysOnly] = useState(false);

  // Overtime State
  const [overtimeDate, setOvertimeDate] = useState(new Date());
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [overtimeHours, setOvertimeHours] = useState(1);
  const [overtimeMinutes, setOvertimeMinutes] = useState(0);

  // Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [workDaysMode, setWorkDaysMode] = useState(5);

  // --- EFFECT ---
  
  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // 1.5 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => { localStorage.setItem('finance_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('finance_currency', JSON.stringify(currency)); localStorage.setItem('finance_lang', language); }, [currency, language]);
  useEffect(() => { localStorage.setItem('finance_groups', JSON.stringify(userGroups)); }, [userGroups]);
  useEffect(() => { localStorage.setItem('finance_notifications', JSON.stringify(notificationsEnabled)); }, [notificationsEnabled]);
  useEffect(() => { localStorage.setItem('finance_salary', JSON.stringify(monthlyNetSalary)); }, [monthlyNetSalary]);
  
  useEffect(() => { localStorage.setItem('finance_darkMode', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem('finance_reminderDays', JSON.stringify(reminderDays)); }, [reminderDays]);
  useEffect(() => { localStorage.setItem('finance_holidayDays', JSON.stringify(holidayDays)); }, [holidayDays]);
  useEffect(() => { localStorage.setItem('finance_salaryDay', JSON.stringify(salaryDay)); }, [salaryDay]);
  useEffect(() => { localStorage.setItem('finance_workHours', JSON.stringify(monthlyWorkHours)); }, [monthlyWorkHours]);

  const updateSalaryTransaction = (newSalary: string) => {
    const salaryAmount = parseNumber(newSalary);
    if (!salaryAmount || salaryAmount <= 0) return;

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    setTransactions(prev => {
      const existingIndex = prev.findIndex(t => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && 
               d.getMonth() === currentMonth && 
               t.type === 'income' && 
               (t.category === 'Maaş' || t.group === 'Maaş');
      });

      let targetDate = new Date(currentYear, currentMonth, salaryDay);
       if (targetDate.getMonth() !== currentMonth) {
          targetDate = new Date(currentYear, currentMonth + 1, 0);
        }

      if (existingIndex !== -1) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount: salaryAmount,
          date: targetDate.toISOString() 
        };
        return updated;
      } else {
        // Create new
        const newTx: Transaction = {
          id: Date.now(),
          title: t.salaryTxTitle,
          amount: salaryAmount,
          type: 'income',
          date: targetDate.toISOString(),
          category: 'Maaş',
          group: 'Maaş',
          recurring: true,
          recurrence: { type: 'monthly', duration: 12, weekdaysOnly: false },
          alert: true
        };
        return [newTx, ...prev];
      }
    });
  };

  // Automatically update salary transaction when settings change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (monthlyNetSalary && parseNumber(monthlyNetSalary) > 0) {
        updateSalaryTransaction(monthlyNetSalary);
      }
    }, 800); // Debounce update
    return () => clearTimeout(timer);
  }, [monthlyNetSalary, salaryDay]);
  
  const handleFinishOnboarding = () => {
    localStorage.setItem('finance_onboarding_complete', 'true');
    setShowOnboarding(false);
    if (monthlyNetSalary && parseNumber(monthlyNetSalary) > 0) {
        updateSalaryTransaction(monthlyNetSalary);
    }
  };

  const handleSkipOnboarding = () => {
      localStorage.setItem('finance_onboarding_complete', 'true');
      setShowOnboarding(false);
  };

  const performAppReset = () => {
    // Clear all local storage for the app
    localStorage.clear();
    // Reload to reset state
    window.location.reload();
  };

  useEffect(() => {
    if (!notificationsEnabled) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + reminderDays); 

    const upcoming = transactions.find(t => {
      if (!t.alert) return false; 
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      const isToday = tDate.getTime() === today.getTime();
      const isReminderDay = tDate.getTime() === reminderDate.getTime();
      return t.type === 'expense' && (isToday || isReminderDay);
    });

    if (upcoming) {
      const tDate = new Date(upcoming.date);
      tDate.setHours(0, 0, 0, 0);
      const isToday = tDate.getTime() === today.getTime();
      const timingMsg = isToday ? t.paymentToday : `${reminderDays} ${t.daysBefore}`;
      const msg = `${upcoming.title}: ${timingMsg} (${formatMoney(upcoming.amount)})`;
      setToastMessage(msg);
      setToastVisible(true);
      const timer = setTimeout(() => setToastVisible(false), 6000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, notificationsEnabled, language, reminderDays]);

  useEffect(() => {
    if (showModal) {
      if (editingTransaction) {
        setFormAmount(formatNumber(editingTransaction.amount.toString())); 
        setFormTitle(editingTransaction.title);
        setFormType(editingTransaction.type);
        setFormDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
        setFormGroup(editingTransaction.group || ''); 
        setFormRecurring(editingTransaction.recurring || false);
        setFormAlert(editingTransaction.alert || false);
        if (editingTransaction.recurrence) {
          setRecurrenceType(editingTransaction.recurrence.type || 'monthly');
          setRecurrenceDuration(editingTransaction.recurrence.duration || 1);
          setWeekdaysOnly(editingTransaction.recurrence.weekdaysOnly || false);
        }
        setIsCalculatorOpen(false);
      } else {
        setFormAmount('');
        setFormTitle('');
        setFormType('expense');
        setFormDate(new Date().toISOString().split('T')[0]); 
        setFormGroup(''); 
        setFormRecurring(false);
        setFormAlert(false);
        setRecurrenceType('monthly');
        setRecurrenceDuration(1);
        setWeekdaysOnly(false);
        setIsCalculatorOpen(false);
      }
    }
  }, [showModal, editingTransaction]);

  // --- CALCULATIONS ---
  
  const calculatedOvertimeAmount = useMemo(() => {
    const salary = parseNumber(monthlyNetSalary);
    if (!salary) return 0;
    const hourlyRate = salary / (monthlyWorkHours || 225);
    const totalHours = overtimeHours + (overtimeMinutes / 60);
    return hourlyRate * overtimeMultiplier * totalHours;
  }, [monthlyNetSalary, overtimeMultiplier, overtimeHours, overtimeMinutes, monthlyWorkHours]);

  const calculatedMonthlyAmount = useMemo(() => {
    const rawAmount = parseNumber(formAmount);
    if (!isCalculatorOpen || !formDate || !rawAmount) return null;
    const d = new Date(formDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const day = currentDate.getDay(); 
      if (!holidayDays.includes(day)) {
        workDays++;
      }
    }
    return { count: workDays, total: rawAmount * workDays };
  }, [isCalculatorOpen, formDate, formAmount, holidayDays]); 

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    if (!transactions || transactions.length === 0) return { income: 0, expense: 0, balance: 0 };
    const currentMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
    currentMonthTx.forEach(t => {
      if (t.type === 'income') income += (t.amount || 0);
      else expense += (t.amount || 0);
    });
    return { income, expense, balance: income - expense };
  }, [transactions, currentDate]);

  const upcomingTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + reminderDays); 
    targetDate.setHours(23, 59, 59, 999);

    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d >= today && d <= targetDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions, reminderDays]);

  const groupedTransactions: GroupedTransactions = useMemo(() => {
    const currentMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Properly typed accumulator to avoid 'any' issues in arithmetic operations
    interface GroupData {
      name: string;
      total: number;
      items: Transaction[];
    }

    const groups: Record<string, GroupData> = {};
    const singles: Transaction[] = [];

    currentMonthTx.forEach(tx => {
      if (tx.group) {
        let group = groups[tx.group];
        if (!group) {
          group = {
            name: tx.group,
            total: 0,
            items: []
          };
          groups[tx.group] = group;
        }
        group.items.push(tx);
        group.total += (tx.type === 'income' ? (tx.amount || 0) : -(tx.amount || 0));
      } else {
        singles.push(tx);
      }
    });

    return { groups: Object.values(groups), singles };
  }, [transactions, currentDate]);

  // --- FUNCTIONS ---
  
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', { 
      style: 'currency', 
      currency: currency.code,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      setUserGroups(prev => [...prev, newGroupName.trim()]);
      setFormGroup(newGroupName.trim());
      setNewGroupName('');
      setShowGroupModal(false);
    }
  };

  const handleSave = () => {
    let finalAmount = parseNumber(formAmount);
    if (isCalculatorOpen && calculatedMonthlyAmount) {
      finalAmount = calculatedMonthlyAmount.total;
    }
    if (!finalAmount || !formTitle || !formDate) return;

    const newTxData: Omit<Transaction, "id"> = {
      title: formTitle,
      amount: finalAmount,
      type: formType,
      date: new Date(formDate).toISOString(),
      group: formGroup || null, 
      alert: formAlert, 
      category: 'Genel',
      recurring: formRecurring,
      recurrence: formRecurring ? {
        type: recurrenceType,
        duration: recurrenceDuration,
        weekdaysOnly: weekdaysOnly
      } : null
    };

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...newTxData } : t));
    } else {
      setTransactions(prev => [{ ...newTxData, id: Date.now() }, ...prev]);
    }
    setShowModal(false);
  };

  const handleSaveOvertime = () => {
    if (calculatedOvertimeAmount <= 0) return;
    const newTxData: Transaction = {
      id: Date.now(),
      title: `Mesai (${overtimeHours}s ${overtimeMinutes > 0 ? overtimeMinutes + 'dk' : ''})`,
      amount: calculatedOvertimeAmount,
      type: 'income',
      date: overtimeDate.toISOString(),
      category: 'Mesai',
      group: 'Mesai',
      recurring: false,
      alert: false
    };
    setTransactions(prev => [newTxData, ...prev]);
    setShowOvertimeModal(false);
  };

  const confirmDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const performDelete = () => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setOvertimeDate(selected);
    setShowOvertimeModal(true);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleHoliday = (dayIndex: number) => {
    if (holidayDays.includes(dayIndex)) {
      setHolidayDays(prev => prev.filter(d => d !== dayIndex));
    } else {
      setHolidayDays(prev => [...prev, dayIndex]);
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setMonthlyNetSalary(formatted);
  };
  
  const toggleSettingAccordion = (settingId: string) => {
    setExpandedSetting(expandedSetting === settingId ? null : settingId);
  };

  // --- STYLING ---
  const themeClass = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F8F9FA] text-gray-900';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-100 text-gray-900';

  // --- RENDER ---

  const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => (
    <div className={`group p-5 rounded-[1.5rem] border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-colors ${item.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {item.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
        </div>
        <div>
          <h3 className={`font-bold text-base mb-1 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {item.title}
            {item.alert && <Bell size={12} className="text-amber-500 fill-amber-500" />} 
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
              {new Date(item.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long' })}
            </span>
            {item.group && <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${darkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-500 border-indigo-100'}`}>{item.group}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className={`font-black text-lg tracking-tight ${item.type === 'income' ? 'text-green-500' : (darkMode ? 'text-gray-100' : 'text-gray-900')}`}>
            {item.type === 'expense' && '-'}{formatMoney(item.amount)}
          </span>
          {item.recurring && (<div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${darkMode ? 'text-blue-400 bg-blue-400/10' : 'text-blue-500 bg-blue-50'}`}><Repeat size={10} /><span>{item.recurrence?.type}</span></div>)}
        </div>
        <div className={`flex flex-col gap-1 border-l pl-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button onClick={() => { setEditingTransaction(item); setShowModal(true); }} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}><Edit2 size={16} /></button>
          <button onClick={() => confirmDelete(item)} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className={`space-y-6 pb-32 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      <Card className={cardClass}>
        <div className={`flex items-center justify-between mb-6 p-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <button onClick={() => changeMonth(-1)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:scale-105 transition-transform ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-600'}`}><ChevronLeft size={20} /></button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">{t.balanceTitle}</span>
            <span className="text-sm font-black uppercase tracking-wide">
              {new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
            </span>
          </div>
          <button onClick={() => changeMonth(1)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:scale-105 transition-transform ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-600'}`}><ChevronRight size={20} /></button>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">{t.monthEndBalance}</p>
          <h1 className="text-4xl font-black mb-8 tracking-tighter">{formatMoney(stats.balance)}</h1>
          <div className="flex gap-4">
            <div className={`flex-1 p-4 rounded-3xl border ${darkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-wider">{t.income}</span>
              </div>
              <p className="text-lg font-bold text-green-500">{formatMoney(stats.income)}</p>
            </div>
            <div className={`flex-1 p-4 rounded-3xl border ${darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-wider">{t.expense}</span>
              </div>
              <p className="text-lg font-bold text-red-500">{formatMoney(stats.expense)}</p>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex items-center justify-between px-2"><h2 className={`text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t.transactionsTitle}</h2></div>
      
      <div className="space-y-4">
        {transactions.filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        }).length === 0 ? (
          <div className="text-center py-10 opacity-40 font-medium">{t.emptyTransactions}</div>
        ) : (
          <>
            {groupedTransactions.groups.map(group => (
              <div key={group.name} className={`border rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div onClick={() => toggleGroup(group.name)} className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Layers size={24} /></div>
                    <div><h3 className="font-bold text-lg">{group.name}</h3><p className="text-xs opacity-60 font-medium">{group.items.length} {t.itemsCount}</p></div>
                  </div>
                  <div className="flex items-center gap-3"><span className={`font-black text-lg ${group.total >= 0 ? 'text-green-500' : 'text-red-500'}`}>{group.total >= 0 ? '+' : ''}{formatMoney(group.total)}</span><div className={`p-1 rounded-full transition-transform duration-300 ${expandedGroups[group.name] ? 'rotate-180 bg-gray-500/20' : 'bg-transparent'}`}><ChevronDown size={20} className="opacity-60" /></div></div>
                </div>
                <div className={`border-t transition-all duration-300 ease-in-out overflow-hidden ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/50 border-gray-100'} ${expandedGroups[group.name] ? 'max-h-[1000px] opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                  <div className="px-3 space-y-2">{group.items.map((item: Transaction) => (<TransactionItem key={item.id} item={item} />))}</div>
                </div>
              </div>
            ))}
            {groupedTransactions.singles.map(item => (<TransactionItem key={item.id} item={item} />))}
          </>
        )}
      </div>
    </div>
  );

  const AnalysisScreen = () => (
    <div className={`space-y-6 pb-32 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      <header className="px-2"><h1 className="text-2xl font-black">{t.analysisTitle}</h1><p className="text-sm opacity-60">{t.analysisSubtitle}</p></header>
      <Card className={cardClass}>
        <div className="flex justify-between items-end mb-8">
           <div><span className="text-xs font-bold text-green-500 uppercase block mb-1">{t.income}</span><span className="text-lg font-bold text-green-500">{formatMoney(stats.income)}</span></div>
           <div className="text-right"><span className="text-xs font-bold text-red-500 uppercase block mb-1">{t.expense}</span><span className="text-lg font-bold text-red-500">{formatMoney(stats.expense)}</span></div>
        </div>
        <div className={`relative h-48 w-full rounded-3xl flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="absolute w-full h-px bg-gray-400/20 top-1/2"></div>
          <div className="flex flex-col items-center gap-2 absolute left-[20%] bottom-[10%] w-[25%] h-[80%] justify-end"><div className="w-full bg-green-500 rounded-t-xl transition-all duration-700" style={{ height: `${(stats.income / (Math.max(stats.income, stats.expense) || 1)) * 80}%` }}></div><span className="text-xs font-bold text-green-500">{t.income}</span></div>
          <div className="flex flex-col items-center gap-2 absolute right-[20%] bottom-[10%] w-[25%] h-[80%] justify-end"><div className="w-full bg-red-500 rounded-t-xl transition-all duration-700" style={{ height: `${(stats.expense / (Math.max(stats.income, stats.expense) || 1)) * 80}%` }}></div><span className="text-xs font-bold text-red-500">{t.expense}</span></div>
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-100'}`}><span className="text-[10px] font-bold opacity-60 block">{t.netStatus}</span><span className={`text-sm font-black ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{stats.balance >= 0 ? '+' : ''}{formatMoney(stats.balance)}</span></div>
        </div>
      </Card>
      <div>
        <h2 className="text-lg font-bold mb-4 px-2">{t.upcomingPayments}</h2>
        {upcomingTransactions.length > 0 ? (
          <div className="space-y-3">{upcomingTransactions.map((item, i) => (<div key={i} className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center"><TrendingDown size={20} /></span><div><p className="font-bold">{item.title}</p><p className="text-xs opacity-60">{new Date(item.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long' })}</p></div></div><span className="font-bold text-red-500">-{formatMoney(item.amount)}</span></div>))}</div>
        ) : (<div className={`p-8 rounded-3xl border text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}><div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-400'}`}><Bell size={32} /></div><p className="font-medium opacity-60">{t.noUpcoming}</p></div>)}
      </div>
    </div>
  );

  const CalendarScreen = () => {
    // Calculate total overtime for the current month
    const currentMonthOvertime = useMemo(() => {
        if (!transactions) return 0;
        return transactions
            .filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === currentDate.getMonth() && 
                       d.getFullYear() === currentDate.getFullYear() &&
                       (t.category === 'Mesai' || t.group === 'Mesai');
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);
    }, [transactions, currentDate]);

    return (
      <div className={`space-y-6 pb-32 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <header className="px-2">
            <h1 className="text-2xl font-black">{t.calendarTitle}</h1>
            <p className="text-sm opacity-60">{t.calendarSubtitle}</p>
        </header>

        {/* Calendar Card */}
        <div className={`rounded-[2.5rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`p-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                 <button onClick={() => changeMonth(-1)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}><ChevronLeft size={24} /></button>
                 <div className="text-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">{currentDate.getFullYear()}</span>
                    <span className="font-black text-xl uppercase tracking-tight">{new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long' }).format(currentDate)}</span>
                </div>
                <button onClick={() => changeMonth(1)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}><ChevronRight size={24} /></button>
            </div>
            <div className="p-6">
                <CalendarView currentDate={currentDate} transactions={transactions} currency={currency} language={language} onDateClick={handleDateClick} darkMode={darkMode} />
            </div>
        </div>

        {/* Overtime Widget */}
         <div className={`relative overflow-hidden rounded-[2.5rem] p-6 border shadow-sm group cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
             onClick={() => { setOvertimeDate(new Date()); setShowOvertimeModal(true); }}>
            
            <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/20`}></div>
            
            <div className="relative flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                             <Clock size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{t.monthlyOvertime}</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tight mb-1">{formatMoney(currentMonthOvertime)}</h3>
                    <p className="text-xs opacity-60 font-medium">{t.overtimeEarned}</p>
                </div>
                
                <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-lg transition-transform group-hover:rotate-90 ${darkMode ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-black text-white shadow-indigo-200'}`}>
                    <Plus size={28} />
                </div>
            </div>
            
             <div className="mt-5 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-between">
                 <span className="text-xs font-bold opacity-60">{t.addToToday}</span>
                 <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{t.quickAdd}</span>
             </div>
        </div>
        
        <p className="text-center text-xs opacity-40 px-6 leading-relaxed">
            {t.calendarHint}
        </p>
      </div>
    );
  };

  const SettingsScreen = () => (
    <div className={`space-y-6 pb-32 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      <header className="px-2"><h1 className="text-2xl font-black">{t.settingsTitle}</h1><p className="text-sm opacity-60">{t.settingsSubtitle}</p></header>
      
      {/* GÖRÜNÜM (KARANLIK MOD) */}
      <Card className={cardClass}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
              {darkMode ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <h3 className="font-bold">{t.themeTitle}</h3>
              <p className="text-xs opacity-60">{darkMode ? t.darkMode : 'Aydınlık Mod'}</p>
            </div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`w-14 h-8 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${darkMode ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </Card>

      {/* MAAŞ HESAPLAMA (AYRI SEÇENEK - ACCORDION) */}
      <div className={`rounded-[2rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div 
          onClick={() => toggleSettingAccordion('salary')}
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}><Briefcase size={24} /></div>
             <div><h3 className="font-bold">{t.salarySettings}</h3></div>
           </div>
           <ChevronDown size={20} className={`transition-transform duration-300 ${expandedSetting === 'salary' ? 'rotate-180' : ''} opacity-60`} />
        </div>
        <div className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${expandedSetting === 'salary' ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
           
           {/* Maaş Input */}
           <div className={`rounded-xl p-4 border focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all flex items-center gap-2 mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
             <span className="text-lg font-bold opacity-60">{currency.symbol}</span>
             <input 
               type="text" 
               value={monthlyNetSalary} 
               onChange={handleSalaryChange} 
               placeholder="0" 
               className={`w-full bg-transparent border-none text-xl font-bold focus:ring-0 outline-none p-0 ${darkMode ? 'text-white' : 'text-gray-900'}`} 
             />
           </div>
           <div className="text-xs opacity-60 text-right mt-2 mb-4">{t.hourlyRateLabel}: {monthlyNetSalary ? formatMoney(parseNumber(monthlyNetSalary) / (monthlyWorkHours || 225)) : formatMoney(0)} / {t.hour}</div>
           
           {/* Tatil Günleri */}
           <div className="mt-6 pt-4 border-t border-gray-500/20">
             <div className="flex items-center gap-2 mb-3">
               <Coffee size={16} className="opacity-60"/>
               <span className="text-xs font-bold uppercase tracking-wider opacity-60">{t.holidayTitle}</span>
             </div>
             <div className="flex justify-between gap-1">
               {['mon','tue','wed','thu','fri','sat','sun'].map((dayKey, idx) => {
                 const dayIndex = idx + 1 === 7 ? 0 : idx + 1; 
                 const isSelected = holidayDays.includes(dayIndex);
                 return (
                   <button
                     key={dayKey}
                     onClick={() => toggleHoliday(dayIndex)}
                     className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all border ${
                       isSelected 
                         ? (darkMode ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-red-50 text-red-600 border-red-200')
                         : (darkMode ? 'bg-gray-700 text-gray-400 border-transparent' : 'bg-gray-50 text-gray-400 border-transparent')
                     }`}
                   >
                     {t[dayKey]}
                   </button>
                 )
               })}
             </div>
           </div>
        </div>
      </div>

      <div className={`h-2`}></div> {/* Aralarına boşluk */}

      {/* ÖDEME BİLDİRİMLERİ (AYRI SEÇENEK - ACCORDION) */}
      <div className={`rounded-[2rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div 
          onClick={() => toggleSettingAccordion('notifications')}
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}><Bell size={24} /></div>
             <div><h3 className="font-bold">{t.notificationSettings}</h3></div>
           </div>
           <ChevronDown size={20} className={`transition-transform duration-300 ${expandedSetting === 'notifications' ? 'rotate-180' : ''} opacity-60`} />
        </div>
        <div className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${expandedSetting === 'notifications' ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
           
           <div className="flex items-center justify-between mb-4">
             <p className="text-xs opacity-60">{t.notificationDesc}</p>
             <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${notificationsEnabled ? 'left-6' : 'left-1'}`}></div></button>
           </div>
           
           {notificationsEnabled && (
             <div className="mt-4 pt-4 border-t border-gray-500/20 animate-in fade-in slide-in-from-top-2">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold opacity-60">{t.reminderDays}</span>
                 <span className="text-sm font-bold">{reminderDays} {t.daysBefore}</span>
               </div>
               <CustomSlider 
                 value={reminderDays} 
                 min={1} 
                 max={7} 
                 onChange={(e) => setReminderDays(parseInt(e.target.value))}
                 darkMode={darkMode}
               />
               <div className="flex justify-between text-[10px] opacity-40 mt-1">
                 <span>1 Gün</span>
                 <span>1 Hafta</span>
               </div>
             </div>
           )}
        </div>
      </div>
      
      {/* Dil ve Para Birimi Accordion Yapısı */}
      <div className={`rounded-[2rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div 
          onClick={() => toggleSettingAccordion('language')}
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Globe size={24} /></div>
             <div><h3 className="font-bold">{t.language}</h3></div>
           </div>
           <ChevronDown size={20} className={`transition-transform duration-300 ${expandedSetting === 'language' ? 'rotate-180' : ''} opacity-60`} />
        </div>
        <div className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${expandedSetting === 'language' ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="flex gap-2">
             <button onClick={() => setLanguage('tr')} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${language === 'tr' ? (darkMode ? 'bg-white text-black' : 'bg-black text-white') : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white text-gray-500 border-gray-200')}`}>Türkçe</button>
             <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${language === 'en' ? (darkMode ? 'bg-white text-black' : 'bg-black text-white') : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white text-gray-500 border-gray-200')}`}>English</button>
           </div>
        </div>
      </div>

      <div className={`rounded-[2rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div 
          onClick={() => toggleSettingAccordion('currency')}
          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}><DollarSign size={24} /></div>
             <div><h3 className="font-bold">{t.currency}</h3></div>
           </div>
           <ChevronDown size={20} className={`transition-transform duration-300 ${expandedSetting === 'currency' ? 'rotate-180' : ''} opacity-60`} />
        </div>
        <div className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${expandedSetting === 'currency' ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
             {CURRENCIES.map(c => (
               <button key={c.code} onClick={() => setCurrency(c)} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${currency.code === c.code ? (darkMode ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200') : (darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50')}`}>
                 <div className="flex items-center gap-3">
                   <span className={`w-8 h-8 flex items-center justify-center rounded-full shadow-sm text-sm font-bold ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-700'}`}>{c.symbol}</span>
                   <span className="text-sm font-medium">{c.name}</span>
                 </div>
                 {currency.code === c.code && <Check size={16} className="text-blue-500" />}
               </button>
             ))}
           </div>
        </div>
      </div>
      
      {/* RESET APP BUTTON */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <button 
          onClick={() => setShowResetModal(true)}
          className={`w-full flex items-center justify-between p-4 rounded-[2rem] border transition-all hover:scale-[1.02] active:scale-[0.98] ${darkMode ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <RotateCcw size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold">{t.resetAppTitle}</h3>
            </div>
          </div>
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  );

  // --- SPLASH SCREEN RENDER ---
  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F8F9FA] text-gray-900'}`}>
        <div className="flex flex-col items-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-700 fade-in">
          <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 ${darkMode ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-xl shadow-gray-300'}`}>
            <Wallet size={56} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-3">{t.appTitle}</h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">{t.appSubtitle}</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <Onboarding 
        step={onboardingStep}
        setStep={setOnboardingStep}
        onFinish={handleFinishOnboarding}
        onSkip={handleSkipOnboarding}
        salary={monthlyNetSalary}
        setSalary={setMonthlyNetSalary}
        workHours={monthlyWorkHours}
        setWorkHours={setMonthlyWorkHours}
        salaryDay={salaryDay}
        setSalaryDay={setSalaryDay}
        t={t}
        darkMode={darkMode}
        currency={currency}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans flex justify-center ${themeClass}`}>
      <NotificationToast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} darkMode={darkMode} />
      <div className={`w-full max-w-md min-h-screen relative flex flex-col shadow-2xl ${themeClass}`}>
        
        <div className={`sticky top-0 backdrop-blur-xl z-20 px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-4 flex justify-between items-center ${darkMode ? 'bg-gray-900/90' : 'bg-[#F8F9FA]/90'}`}>
          <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}><Wallet size={20} /></div><div><span className="font-black text-xl tracking-tight block leading-none">{t.appTitle}</span><span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{t.appSubtitle}</span></div></div>
          <button onClick={() => setActiveTab('settings')} className={`p-2.5 border rounded-xl transition-colors shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-100 hover:bg-gray-50'}`}><Settings size={20} className="opacity-70" /></button>
        </div>
        
        <main className="flex-1 px-5 overflow-y-auto no-scrollbar">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'analysis' && <AnalysisScreen />}
          {activeTab === 'calendar' && <CalendarScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </main>

        <div className={`fixed bottom-0 w-full max-w-md backdrop-blur-lg border-t px-6 py-4 flex items-center justify-between z-30 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] ${darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-100'}`}>
           <IconButton icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} darkMode={darkMode} />
           <IconButton icon={PieChart} active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} darkMode={darkMode} />
           <button onClick={() => { setEditingTransaction(null); setShowModal(true); }} className={`mb-10 w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all rotate-0 hover:rotate-90 ${darkMode ? 'bg-white text-black shadow-white/20' : 'bg-black text-white shadow-gray-400'}`}><Plus size={32} strokeWidth={2.5} /></button>
           <IconButton icon={CalendarIcon} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} darkMode={darkMode} />
           <IconButton icon={Settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={darkMode} />
        </div>

        {/* GRUP OLUŞTURMA MODALI */}
        {showGroupModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-xs rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h3 className="text-lg font-bold mb-4">{t.createGroupTitle}</h3>
              <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder={t.groupNamePlaceholder} className={`w-full border rounded-xl p-3 mb-4 text-sm focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} autoFocus />
              <div className="flex gap-3">
                <button onClick={() => setShowGroupModal(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>{t.cancel}</button>
                <button onClick={handleCreateGroup} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>{t.create}</button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className={`w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 overflow-y-auto max-h-[90vh] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
               <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black">{editingTransaction ? t.edit : t.addNew}</h2><button onClick={() => setShowModal(false)} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}><X size={24} className="opacity-60" /></button></div>
               <div className="space-y-6">
                 <div className={`p-1 rounded-2xl flex relative ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${darkMode ? 'bg-gray-700' : 'bg-white'}`} style={{ left: formType === 'income' ? '4px' : 'calc(50%)' }}></div>
                    <button onClick={() => setFormType('income')} className={`flex-1 relative z-10 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${formType === 'income' ? 'text-green-500' : 'opacity-40'}`}><TrendingUp size={18} /> {t.incomeLabel}</button>
                    <button onClick={() => setFormType('expense')} className={`flex-1 relative z-10 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${formType === 'expense' ? 'text-red-500' : 'opacity-40'}`}><TrendingDown size={18} /> {t.expenseLabel}</button>
                 </div>
                 <div>
                    <div className="flex items-center justify-between mb-2"><label className="text-[10px] font-bold uppercase tracking-wider ml-1 opacity-60">{isCalculatorOpen ? t.dailyAmountLabel : t.amountLabel}</label><button onClick={() => setIsCalculatorOpen(!isCalculatorOpen)} className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Calculator size={12} />{isCalculatorOpen ? 'Hesaplayıcı Açık' : 'Günlük Hesapla'}</button></div>
                    <div className={`rounded-3xl p-6 border transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100 focus-within:border-black'}`}>
                      <span className="text-2xl font-bold opacity-40">{currency.symbol}</span>
                      <input type="text" value={formAmount} onChange={(e) => setFormAmount(formatNumber(e.target.value))} placeholder="0" className="w-full text-5xl font-black bg-transparent border-none focus:ring-0 outline-none p-0 leading-none" />
                    </div>
                    {isCalculatorOpen && (
                      <div className={`mt-3 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 ${darkMode ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50 border-indigo-100'}`}>
                        <div className="flex items-center justify-between mb-3"><span className="text-xs font-bold text-indigo-500">{t.calculatorMode}</span><div className={`flex rounded-lg p-0.5 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}><button onClick={() => setWorkDaysMode(5)} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${workDaysMode === 5 ? 'bg-indigo-600 text-white' : 'opacity-60'}`}>{t.fiveDays}</button><button onClick={() => setWorkDaysMode(6)} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${workDaysMode === 6 ? 'bg-indigo-600 text-white' : 'opacity-60'}`}>{t.sixDays}</button></div></div>
                        <div className="flex justify-between items-end border-t border-indigo-500/20 pt-3"><div><p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t.workDaysCount}</p><p className="text-xl font-black text-indigo-500">{calculatedMonthlyAmount?.count || 0} <span className="text-sm font-medium opacity-60">{t.day}</span></p></div><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t.totalMonthly}</p><p className="text-xl font-black text-indigo-500">{formatMoney(calculatedMonthlyAmount?.total || 0)}</p></div></div>
                      </div>
                    )}
                 </div>
                 <div className="space-y-4">
                   <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider ml-1 mb-2 block opacity-60">{t.groupLabel}</label>
                     <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                       <button onClick={() => setFormGroup('')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formGroup === '' ? (darkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white text-gray-500 border-gray-200')}`}>{t.noGroup}</button>
                       {userGroups.map(g => (<button key={g} onClick={() => setFormGroup(g)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formGroup === g ? (darkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white text-gray-500 border-gray-200')}`}>{g}</button>))}
                       <button onClick={() => setShowGroupModal(true)} className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border border-dashed flex items-center gap-1 transition-all ${darkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}><Plus size={14} /> {t.newGroup}</button>
                     </div>
                   </div>
                   <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={t.titlePlaceholder} className={`w-full border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-gray-900 text-white placeholder-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-400'}`} />
                   <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"><CalendarDays size={20} /></div><input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className={`w-full border-none rounded-2xl p-4 pl-12 font-bold focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`} /></div>
                 </div>
                 
                 {/* Düzenli Tekrar */}
                 <div className={`p-5 rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${formRecurring ? (darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50/50 border-blue-200 shadow-sm') : (darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100')}`}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setFormRecurring(!formRecurring)}>
                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formRecurring ? 'bg-blue-500 text-white' : (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400')}`}><Repeat size={20} /></div><div><span className="font-bold block text-sm">{t.recurring}</span><span className="text-[10px] opacity-60">{t.recurringSubtitle}</span></div></div><div className={`w-12 h-7 rounded-full transition-colors relative ${formRecurring ? 'bg-blue-500' : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${formRecurring ? 'left-6' : 'left-1'}`}></div></div>
                  </div>
                  <div className={`grid gap-4 transition-all duration-300 ease-in-out ${formRecurring ? 'mt-6 opacity-100 max-h-96' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <div><label className="text-[10px] font-bold uppercase tracking-wider mb-2 block opacity-60">{t.frequency}</label><div className="flex gap-2">{['daily', 'weekly', 'monthly'].map(type => (<button key={type} onClick={() => setRecurrenceType(type as any)} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${recurrenceType === type ? 'bg-blue-500 text-white border-blue-500 shadow-md' : (darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white text-gray-500 border-gray-200')}`}>{t[type]}</button>))}</div></div>
                      <div className="flex gap-3">
                        <div className="flex-1"><label className="text-[10px] font-bold uppercase tracking-wider mb-2 block opacity-60">{t.duration} ({recurrenceType === 'daily' ? t.day : t.month})</label><div className="relative"><div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"><Clock size={16} /></div><input type="number" min="1" value={recurrenceDuration} onChange={(e) => setRecurrenceDuration(parseInt(e.target.value))} className={`w-full border rounded-xl pl-9 pr-3 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`} /></div></div>
                        {recurrenceType === 'daily' && (<div className="flex-1"><label className="text-[10px] font-bold uppercase tracking-wider mb-2 block opacity-60">{t.restriction}</label><button onClick={() => setWeekdaysOnly(!weekdaysOnly)} className={`w-full py-3 px-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${weekdaysOnly ? 'bg-blue-600 border-blue-600 text-white shadow-md' : (darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-400')}`}><Briefcase size={16} /><span className="text-xs font-bold">{t.weekdays}</span></button></div>)}
                      </div>
                  </div>
                </div>

                {/* Bildirim Toggle */}
                <div className={`p-5 rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${formAlert ? (darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50/50 border-amber-200 shadow-sm') : (darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100')}`}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setFormAlert(!formAlert)}>
                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formAlert ? 'bg-amber-500 text-white' : (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400')}`}><Bell size={20} /></div><div><span className="font-bold block text-sm">{t.enableAlert}</span><span className="text-[10px] opacity-60">{t.alertSubtitle}</span></div></div><div className={`w-12 h-7 rounded-full transition-colors relative ${formAlert ? 'bg-amber-500' : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${formAlert ? 'left-6' : 'left-1'}`}></div></div>
                  </div>
                </div>

                <button onClick={handleSave} className={`w-full py-4 rounded-[1.2rem] font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl ${darkMode ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-gray-200'}`}>{editingTransaction ? t.update : t.save}</button>
               </div>
            </div>
          </div>
        )}

        {/* Overtime Modal */}
        {showOvertimeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className={`w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 overflow-y-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-black">{t.overtimeTitle}</h2><p className="text-xs opacity-60">{new Date(overtimeDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div><button onClick={() => setShowOvertimeModal(false)} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}><X size={24} className="opacity-60" /></button></div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider ml-1 mb-2 block opacity-60">{t.multiplierLabel}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setOvertimeMultiplier(1.5)} className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 flex flex-col items-center justify-center gap-1 ${overtimeMultiplier === 1.5 ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-100 text-gray-400')}`}><span className="text-lg font-black">1.5x</span><span className="text-[10px] font-medium opacity-70">Hafta İçi / Cmt</span></button>
                    <button onClick={() => setOvertimeMultiplier(2.0)} className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 flex flex-col items-center justify-center gap-1 ${overtimeMultiplier === 2.0 ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : (darkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-100 text-gray-400')}`}><span className="text-lg font-black">2.0x</span><span className="text-[10px] font-medium opacity-70">Pazar / Bayram</span></button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider ml-1 mb-2 block opacity-60">{t.durationLabel}</label>
                  <div className="flex gap-3">
                    <div className={`flex-1 rounded-2xl p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}><div className="flex justify-between items-center mb-1 px-1"><span className="text-[10px] font-bold opacity-60">{t.hour}</span></div><select value={overtimeHours} onChange={(e) => setOvertimeHours(parseInt(e.target.value))} className={`w-full bg-transparent border-none text-2xl font-black focus:ring-0 p-0 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{[...Array(24).keys()].map(h => (<option key={h} value={h} className={darkMode ? 'bg-gray-800' : ''}>{h}</option>))}</select></div>
                    <div className={`flex-1 rounded-2xl p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}><div className="flex justify-between items-center mb-1 px-1"><span className="text-[10px] font-bold opacity-60">{t.minute}</span></div><select value={overtimeMinutes} onChange={(e) => setOvertimeMinutes(parseInt(e.target.value))} className={`w-full bg-transparent border-none text-2xl font-black focus:ring-0 p-0 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{[0, 15, 30, 45].map(m => (<option key={m} value={m} className={darkMode ? 'bg-gray-800' : ''}>{m}</option>))}</select></div>
                  </div>
                </div>
                <div className={`rounded-3xl p-5 border flex items-center justify-between ${darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-100'}`}><div><span className="text-xs font-bold text-emerald-500 block">{t.calculatedOvertime}</span><span className="text-[10px] opacity-60">{monthlyNetSalary ? `${formatMoney((parseNumber(monthlyNetSalary) / (monthlyWorkHours || 225)))} / saat` : 'Maaş girilmedi'}</span></div><span className="text-3xl font-black text-emerald-500 tracking-tight">{formatMoney(calculatedOvertimeAmount)}</span></div>
                <button onClick={handleSaveOvertime} className={`w-full py-4 rounded-[1.2rem] font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 ${darkMode ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-gray-200'}`}><Plus size={20} />{t.addOvertime}</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-xs rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-black mb-2">{t.deleteTitle}</h3><p className="text-sm opacity-60 font-medium mb-6 leading-relaxed"><span className="font-bold">"{transactionToDelete?.title}"</span> {t.deleteDesc}</p>
              <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>{t.cancel}</button><button onClick={performDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-200 transition-colors">{t.delete}</button></div>
            </div>
          </div>
        )}

        {/* Reset App Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-xs rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><RotateCcw size={32} /></div>
              <h3 className="text-xl font-black mb-2">{t.resetConfirmTitle}</h3>
              <p className="text-sm opacity-60 font-medium mb-6 leading-relaxed">{t.resetConfirmDesc}</p>
              <div className="flex flex-col gap-2">
                <button onClick={performAppReset} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-200 transition-colors">{t.resetConfirmBtn}</button>
                <button onClick={() => setShowResetModal(false)} className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>{t.cancel}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}