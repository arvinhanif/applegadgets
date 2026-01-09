import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import StatCard from './components/StatCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Transaction, TransactionType, UserRole } from './types';

const DB_USERS = 'WARRICK_GLOBAL_USERS';
const DB_SESSION = 'WARRICK_ACTIVE_SESSION';
const DB_TX_PREFIX = 'WARRICK_DATA_';

const App = () => {
  const [view, setView] = useState<'signin' | 'signup' | 'admin' | 'dashboard'>('signin');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [authError, setAuthError] = useState('');
  const [formType, setFormType] = useState<TransactionType>(TransactionType.EXPENSE);

  const historyRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    if (!savedUsers.find((u: any) => u.username === 'arvin_hanif')) {
      const admin = { name: 'Arvin Hanif', email: 'admin@warrick.io', mobile: '0000', pass: 'arvin_hanif', role: UserRole.ADMIN, username: 'arvin_hanif' };
      savedUsers.push(admin);
      localStorage.setItem(DB_USERS, JSON.stringify(savedUsers));
    }
    setAllUsers(savedUsers);

    const session = JSON.parse(localStorage.getItem(DB_SESSION) || 'null');
    if (session) {
      setCurrentUser(session);
      setView('dashboard');
      loadUserData(session.username || session.email);
    }
  }, []);

  const loadUserData = (key: string) => {
    const data = JSON.parse(localStorage.getItem(DB_TX_PREFIX + key) || '[]');
    setTransactions(data);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>, type?: TransactionType) => {
    if (type) setFormType(type);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSignup = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email') as string;
    const mobile = fd.get('mobile') as string;
    if (allUsers.find(u => u.email === email || u.mobile === mobile)) {
      alert("Account already exists."); return;
    }
    const newUser = { name: fd.get('name'), email, mobile, pass: fd.get('pass'), role: UserRole.USER, username: email };
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem(DB_USERS, JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem(DB_SESSION, JSON.stringify(newUser));
    setTransactions([]);
    setView('dashboard');
  };

  const handleSignin = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const login = fd.get('login') as string;
    const pass = fd.get('pass') as string;
    const user = allUsers.find(u => (u.email === login || u.mobile === login || u.username === login) && u.pass === pass);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(DB_SESSION, JSON.stringify(user));
      loadUserData(user.username || user.email);
      setView('dashboard');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const handleAdminSignin = (e: any) => {
    e.preventDefault();
    const id = (document.getElementById('adm-id') as HTMLInputElement).value;
    const pass = (document.getElementById('adm-pass') as HTMLInputElement).value;
    if (id === 'arvin_hanif' && pass === 'arvin_hanif') {
      const admin = allUsers.find(u => u.username === 'arvin_hanif');
      setCurrentUser(admin);
      localStorage.setItem(DB_SESSION, JSON.stringify(admin));
      loadUserData(admin.username);
      setView('dashboard');
    } else {
      setAuthError('Admin Access Denied');
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Date.now().toString() };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem(DB_TX_PREFIX + (currentUser.username || currentUser.email), JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(DB_TX_PREFIX + (currentUser.username || currentUser.email), JSON.stringify(updated));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(DB_SESSION);
    setView('signin');
  };

  if (view !== 'dashboard') {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 bg-[#f2f2f7]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900">WARRICK<span className="text-blue-600">.</span></h1>
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] mt-2">Powered by Arvin</p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white">
            {view === 'signin' && (
              <form onSubmit={handleSignin} className="space-y-4 text-left">
                <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">User Login</h2>
                <input required name="login" type="text" placeholder="Email or Mobile" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500/10" />
                <input required name="pass" type="password" placeholder="Password" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500/10" />
                {authError && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">{authError}</p>}
                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl ios-button uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20">Sign In</button>
                <button type="button" onClick={() => setView('admin')} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl ios-button text-[11px] uppercase tracking-widest mt-2">Admin Portal</button>
                <p className="text-center text-sm font-bold text-slate-400 mt-4">New user? <button type="button" onClick={() => setView('signup')} className="text-blue-600">Create Account</button></p>
              </form>
            )}
            {view === 'admin' && (
              <form onSubmit={handleAdminSignin} className="space-y-4 text-left">
                <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Admin Access</h2>
                <input required id="adm-id" type="text" placeholder="Admin ID" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required id="adm-pass" type="password" placeholder="Passkey" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl">Login Console</button>
                <button type="button" onClick={() => setView('signin')} className="w-full py-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Back</button>
              </form>
            )}
            {view === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4 text-left">
                <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Join Warrick</h2>
                <input required name="name" type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required name="mobile" type="tel" placeholder="Mobile Number" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required name="email" type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required name="pass" type="password" placeholder="Password" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm">Register</button>
                <button type="button" onClick={() => setView('signin')} className="w-full py-3 text-center text-sm font-bold text-slate-400">Back</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);

  return (
    <div className="w-full min-h-screen py-8 px-6 md:px-12 lg:px-20 bg-[#f2f2f7]">
      {/* Top Center Navigation Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] ios-glass p-2 rounded-full border border-white shadow-2xl flex items-center gap-1 backdrop-blur-3xl">
        <button 
          onClick={() => scrollTo(historyRef)}
          className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-white transition-all ios-button"
        >
          History
        </button>
        <button 
          onClick={() => scrollTo(formRef, TransactionType.EXPENSE)}
          className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-50 transition-all ios-button"
        >
          Expense
        </button>
        <button 
          onClick={() => scrollTo(formRef, TransactionType.INCOME)}
          className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:bg-emerald-50 transition-all ios-button"
        >
          Income
        </button>
      </nav>

      <header className="max-w-[1400px] mx-auto flex justify-between items-center mb-16 pt-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900">WARRICK<span className="text-blue-600">.</span></h1>
          <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] ml-0.5 opacity-80">POWERED BY ARVIN</p>
        </div>
        <div className="flex items-center gap-4 ios-glass p-2 pl-6 rounded-full border border-white shadow-xl">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{currentUser.role}</p>
            <p className="text-base font-bold text-slate-900">{currentUser.name}</p>
          </div>
          <button onClick={logout} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center ios-button">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Net Balance" amount={income - expense} type="balance" currencySymbol="৳" />
          <StatCard label="Total Income" amount={income} type="income" currencySymbol="৳" />
          <StatCard label="Total Expense" amount={expense} type="expense" currencySymbol="৳" />
        </section>

        {currentUser.role === UserRole.ADMIN && (
          <section className="ios-glass p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/40">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-7 bg-indigo-600 rounded-full"></div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">User Directory</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allUsers.filter(u => u.role !== UserRole.ADMIN).map(u => (
                <div key={u.email} className="p-5 bg-white/60 rounded-[2rem] border border-white shadow-sm">
                  <h4 className="font-bold text-slate-800 text-sm">{u.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                  <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-widest">{u.mobile}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section ref={formRef} className="ios-glass p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-7 bg-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sync New Entry</h3>
          </div>
          <TransactionForm onAdd={addTransaction} initialType={formType} />
        </section>

        <section ref={historyRef} className="ios-glass rounded-[3.5rem] border border-white shadow-2xl shadow-slate-200/40 overflow-hidden">
          <TransactionList transactions={transactions} onDelete={deleteTransaction} currencySymbol="৳" role={currentUser.role} />
        </section>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);