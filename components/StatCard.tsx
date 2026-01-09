import React from 'react';

interface StatCardProps {
  label: string;
  amount: number;
  type?: 'balance' | 'income' | 'expense';
  currencySymbol?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, amount, type = 'balance', currencySymbol = '$' }) => {
  const getStyle = () => {
    switch (type) {
      case 'income': return 'bg-white text-emerald-600 shadow-emerald-500/5';
      case 'expense': return 'bg-white text-rose-600 shadow-rose-500/5';
      default: return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-500/20';
    }
  };

  const labelColor = type === 'balance' ? 'text-blue-100' : 'text-slate-400';

  return (
    <div className={`ios-widget p-7 ios-glass ${getStyle()} flex flex-col justify-between h-40 shadow-2xl`}>
      <div className="flex justify-between items-start">
        <p className={`text-[11px] font-black uppercase tracking-widest ${labelColor}`}>{label}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'balance' ? 'bg-white/20' : 'bg-slate-50'}`}>
           {type === 'income' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
           {type === 'expense' && <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
           {type === 'balance' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m4 0h1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>}
        </div>
      </div>
      <h2 className="text-3xl font-extrabold tabular-nums tracking-tighter">
        <span className="text-xl mr-1 font-medium opacity-70">{currencySymbol}</span>
        {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h2>
    </div>
  );
};

export default StatCard;