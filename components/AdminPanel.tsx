
import React, { useState, useEffect } from 'react';
import { supabase, getAllUsers, adminUpdateUser, updateGlobalSettings } from '../services/supabase';

interface AdminPanelProps {
  onBack: () => void;
  settings: any;
  onUpdateSettings: (newSettings: any) => void;
  gameStatus: Record<string, boolean>;
  onUpdateGameStatus: (status: Record<string, boolean>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, settings, onUpdateSettings, gameStatus, onUpdateGameStatus }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStakes: 0, totalPayouts: 0, netProfit: 0, totalBets: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rigging' | 'games' | 'users' | 'payments'>('rigging');
  const [searchQuery, setSearchQuery] = useState('');

  // Mocking payment requests for UI demo
  const [paymentRequests, setPaymentRequests] = useState([
    { id: '1', user: 'player123@mail.com', amount: 50, type: 'deposit', method: 'Paddle/Manual', status: 'pending', date: '10:30 AM' },
    { id: '2', user: 'top_gamer@mail.com', amount: 200, type: 'withdraw', method: 'Bkash', status: 'pending', date: '09:45 AM' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await getAllUsers();
      if (userData) setUsers(userData);

      const { data: bets } = await supabase.from('bets').select('*');
      if (bets) {
        const totalStakes = bets.reduce((sum, b) => sum + Number(b.stake), 0);
        const totalPayouts = bets.reduce((sum, b) => sum + Number(b.payout), 0);
        setStats({ totalStakes, totalPayouts, netProfit: totalStakes - totalPayouts, totalBets: bets.length });
      }
    } catch (err) {
      console.error("Admin fetch error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePayment = (id: string) => {
    setPaymentRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    alert("Payment Approved! User balance will be updated.");
  };

  const handleRiggingChange = async (game: string, value: number) => {
    const newSettings = { ...settings, [game]: value };
    onUpdateSettings(newSettings);
    await updateGlobalSettings({ rigging: newSettings });
  };

  const toggleGame = async (gameId: string) => {
    const newStatus = { ...gameStatus, [gameId]: !gameStatus[gameId] };
    onUpdateGameStatus(newStatus);
    await updateGlobalSettings({ game_status: newStatus });
  };

  const handleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    await adminUpdateUser(userId, { status: newStatus });
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleUpdateBalance = async (userId: string, currentBalance: number) => {
    const amount = prompt("Enter adjustment amount (e.g., 500 or -500):");
    if (amount === null) return;
    const newBalance = currentBalance + parseFloat(amount);
    await adminUpdateUser(userId, { balance: newBalance });
    setUsers(users.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display overflow-hidden animate-in slide-in-from-right duration-500">
      <header className="sticky top-0 z-50 bg-[#1a0d0e]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 active:scale-90 transition-transform"><span className="material-symbols-outlined">arrow_back</span></button>
          <h2 className="text-white text-lg font-black uppercase tracking-tight">Admin Console</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-32">
        {/* Real Stats */}
        <section className="bg-gradient-to-br from-[#2a1415] to-[#0d0909] border border-primary/20 p-6 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
           <div className="flex justify-between items-start relative z-10">
              <div>
                 <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-80">Platform Profit</p>
                 <h1 className="text-white font-black text-5xl tracking-tighter italic tabular-nums">${stats.netProfit.toLocaleString()}</h1>
              </div>
           </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
           <button onClick={() => setActiveTab('rigging')} className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'rigging' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Rigging</button>
           <button onClick={() => setActiveTab('payments')} className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'payments' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Payments</button>
           <button onClick={() => setActiveTab('games')} className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'games' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Games</button>
           <button onClick={() => setActiveTab('users')} className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Users</button>
        </div>

        {activeTab === 'payments' && (
           <div className="space-y-4">
              <h3 className="text-white text-sm font-black uppercase pl-2">Pending Requests</h3>
              <div className="space-y-3">
                 {paymentRequests.map(req => (
                   <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-white font-bold text-sm">{req.user}</p>
                            <p className="text-slate-500 text-[10px] uppercase font-black">{req.method} • {req.date}</p>
                         </div>
                         <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${req.type === 'deposit' ? 'text-emerald-400 bg-emerald-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
                            {req.type}
                         </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <h4 className="text-white text-2xl font-black">${req.amount}</h4>
                         {req.status === 'pending' ? (
                            <div className="flex gap-2">
                               <button onClick={() => setPaymentRequests(prev => prev.filter(r => r.id !== req.id))} className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase">Reject</button>
                               <button onClick={() => handleApprovePayment(req.id)} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg">Approve</button>
                            </div>
                         ) : (
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Completed ✅</span>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'rigging' && (
          <div className="bg-[#1a0d0e] border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
            {Object.keys(settings).map(key => (
              <div key={key} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-[13px] font-black uppercase tracking-tight">{key} Odds Control</span>
                  <span className="text-primary font-black">{(settings[key] * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={settings[key]} onChange={(e) => handleRiggingChange(key, parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'games' && (
          <div className="bg-[#1a0d0e] border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
            {Object.keys(gameStatus).map(id => (
              <div key={id} className="p-6 flex items-center justify-between">
                <span className="text-white text-[13px] font-black uppercase">{id.replace('-game', '')}</span>
                <button onClick={() => toggleGame(id)} className={`w-14 h-8 rounded-full transition-all p-1 flex items-center ${gameStatus[id] ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  <div className={`size-6 bg-white rounded-full shadow-lg transform transition-transform ${gameStatus[id] ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by email or name..." className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none" />
            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm">{u.email}</span>
                        <span className="text-slate-500 text-[10px]">{u.first_name} {u.last_name}</span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${u.status === 'blocked' ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>{u.status || 'active'}</span>
                   </div>
                   <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[8px] uppercase">Balance</span>
                        <span className="text-white font-black tabular-nums">${u.balance?.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateBalance(u.id, u.balance)} className="bg-white/5 border border-white/10 text-[9px] font-black px-3 py-2 rounded-lg text-slate-300">EDIT BALANCE</button>
                        <button onClick={() => handleUserStatus(u.id, u.status)} className={`text-[9px] font-black px-3 py-2 rounded-lg ${u.status === 'blocked' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {u.status === 'blocked' ? 'UNBLOCK' : 'BLOCK'}
                        </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
