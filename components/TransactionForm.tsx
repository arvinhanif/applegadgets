import React, { useState, useEffect } from 'react';
import { TransactionType, Transaction, UserRole } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  initialType?: TransactionType;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, initialType }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(initialType || TransactionType.EXPENSE);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    onAdd({ 
      description, 
      amount: parseFloat(amount), 
      type, 
      date: new Date().toLocaleString() 
    });
    setDescription('');
    setAmount('');
  };

  const inputClass = "w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-slate-800 placeholder:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        required
        type="text"
        placeholder="Memo / Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <input
        required
        type="number"
        step="0.01"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={inputClass}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
        className={inputClass}
      >
        <option value={TransactionType.EXPENSE}>Expense Out</option>
        <option value={TransactionType.INCOME}>Income In</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all text-sm ios-button shadow-lg shadow-blue-500/20 uppercase tracking-widest">
        Sync Entry
      </button>
    </form>
  );
};

export default TransactionForm;