
import React, { useState, useEffect } from 'react';
import { supabase, getAllUsers, adminUpdateUser, updateGlobalSettings, getPlatformActivity, broadcastNotification, getPendingTransactions, updateTransactionStatus, getPendingWithdrawals, updateWithdrawStatus, getGlobalSettings } from '../services/supabase';

interface AdminPanelProps {
  onBack: () => void;
  settings: any;
  onUpdateSettings: (newSettings: any) => void;
  gameStatus: Record<string, boolean>;
  onUpdateGameStatus: (status: Record<string, boolean>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, settings, onUpdateSettings, gameStatus, onUpdateGameStatus }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [pendingWithdraws, setPendingWithdraws] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStakes: 0, totalPayouts: 0, netProfit: 0, totalBets: 0, activeUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rigging' | 'games' | 'users' | 'activity' | 'broadcast' | 'reports' | 'deposits' | 'withdrawals' | 'payments'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Payment Numbers & Status State
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01700000000',
    nagad: '01700000000',
    rocket: '01700000000'
  });
  const [methodStatus, setMethodStatus] = useState<Record<string, boolean>>({
    bkash: true,
    nagad: true,
    rocket: true
  });
  const [isSavingPayments, setIsSavingPayments] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await getAllUsers();
      if (userData) {
        setUsers(userData);
        setStats(prev => ({ ...prev, activeUsers: userData.length }));
      }

      const { data: deposits } = await getPendingTransactions();
      if (deposits) setPendingDeposits(deposits);

      const { data: withdraws } = await getPendingWithdrawals();
      if (withdraws) setPendingWithdraws(withdraws);

      const { data: globalSets } = await getGlobalSettings();
      if (globalSets) {
        if (globalSets.payment_numbers) setPaymentNumbers(globalSets.payment_numbers);
        if (globalSets.method_status) setMethodStatus(globalSets.method_status);
      }

      const { data: bets } = await supabase.from('bets').select('*');
      if (bets) {
        const totalStakes = bets.reduce((sum, b) => sum + Number(b.stake), 0);
        const totalPayouts = bets.reduce((sum, b) => sum + Number(b.payout), 0);
        setStats(prev => ({ ...prev, totalStakes, totalPayouts, netProfit: totalStakes - totalPayouts, totalBets: bets.length }));
      }

      const { data: activityLogs } = await getPlatformActivity();
      if (activityLogs) setActivity(activityLogs);

    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePayments = async () => {
    setIsSavingPayments(true);
    try {
      // Send both payment_numbers and method_status to be sure they stay in sync
      const { error } = await updateGlobalSettings({ 
        payment_numbers: paymentNumbers,
        method_status: methodStatus 
      });
      if (error) throw error;
      alert("SUCCESS: Database updated successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`ERROR: Could not save. Make sure you ran the SQL script in Supabase! \n\nDetails: ${err.message}`);
    } finally {
      setIsSavingPayments(false);
    }
  };

  const handleDepositAction = async (id: string, status: 'approved' | 'rejected', userId: string, amount: number) => {
    try {
      await updateTransactionStatus(id, status, userId, amount);
      fetchData();
    } catch (err) {
      alert("Failed to update deposit.");
    }
  };

  const handleWithdrawAction = async (id: string, status: 'approved' | 'rejected', userId: string, amount: number) => {
    try {
      await updateWithdrawStatus(id, status, userId, amount);
      fetchData();
    } catch (err) {
      alert("Failed to update withdrawal.");
    }
  };

  const handleBroadcast = async () => {
    if (!notifTitle || !notifMsg) return;
    setIsBroadcasting(true);
    try {
      await broadcastNotification(notifTitle, notifMsg);
      alert("Broadcast successful!");
      setNotifTitle('');
      setNotifMsg('');
    } catch (err) {
      alert("Failed to broadcast.");
    } finally {
      setIsBroadcasting(false);
    }
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

  const handleUpdateBalance = async (userId: string, currentBalance: number) => {
    const amount = prompt("Adjustment (+/-):");
    if (!amount) return;
    const newBalance = currentBalance + parseFloat(amount);
    await adminUpdateUser(userId, { balance: newBalance });
    fetchData();
  };

  const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-[#0d0909] font-display overflow-hidden animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-[#1a0d0e]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="size-10 flex items-center justify-center text-slate-400 active:scale-90 transition-transform"><span className="material-symbols-outlined">arrow_back</span></button>
          <h2 className="text-white text-lg font-black uppercase tracking-tight italic">Admin Console</h2>
        </div>
        <button onClick={fetchData} className="size-9 rounded-full bg-white/5 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-32">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar gap-1">
           {['reports', 'deposits', 'withdrawals', 'payments', 'rigging', 'broadcast', 'activity', 'users', 'games'].map((t) => (
             <button key={t} onClick={() => setActiveTab(t as any)} className={`shrink-0 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>{t}</button>
           ))}
        </div>

        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in slide-in-from-bottom">
            <div className="bg-[#1a0d0e] p-6 rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl">
               <h3 className="text-white font-black text-sm uppercase px-1">Withdrawal Method Control</h3>
               
               <div className="grid grid-cols-1 gap-4">
                  {['bkash', 'nagad', 'rocket'].map(m => (
                    <div key={m} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl flex items-center justify-center ${m === 'bkash' ? 'bg-pink-500/20 text-pink-500' : m === 'nagad' ? 'bg-orange-500/20 text-orange-500' : 'bg-purple-500/20 text-purple-500'}`}>
                             <span className="material-symbols-outlined text-[22px] filled">{m === 'bkash' ? 'account_balance_wallet' : m === 'nagad' ? 'payments' : 'rocket_launch'}</span>
                          </div>
                          <span className="text-white font-black text-xs uppercase tracking-widest">{m}</span>
                       </div>
                       <button 
                        onClick={() => setMethodStatus({...methodStatus, [m]: !methodStatus[m]})}
                        className={`w-14 h-8 rounded-full p-1 transition-all ${methodStatus[m] ? 'bg-emerald-500' : 'bg-red-500'}`}
                       >
                          <div className={`size-6 bg-white rounded-full transition-transform ${methodStatus[m] ? 'translate-x-6' : ''}`} />
                       </button>
                    </div>
                  ))}
               </div>

               <h3 className="text-white font-black text-sm uppercase px-1 pt-4">Merchant Numbers</h3>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">bKash Number</label>
                    <input value={paymentNumbers.bkash} onChange={e => setPaymentNumbers({...paymentNumbers, bkash: e.target.value})} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-pink-500 transition-all" placeholder="01XXXXXXXXX" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Nagad Number</label>
                    <input value={paymentNumbers.nagad} onChange={e => setPaymentNumbers({...paymentNumbers, nagad: e.target.value})} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-orange-500 transition-all" placeholder="01XXXXXXXXX" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Rocket Number</label>
                    <input value={paymentNumbers.rocket} onChange={e => setPaymentNumbers({...paymentNumbers, rocket: e.target.value})} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-purple-500 transition-all" placeholder="01XXXXXXXXX" />
                  </div>
               </div>

               <button onClick={handleSavePayments} disabled={isSavingPayments} className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  {isSavingPayments ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      SAVE ALL SETTINGS
                    </>
                  )}
               </button>
            </div>
          </div>
        )}

        {/* REST OF THE TABS */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4 animate-in slide-in-from-bottom">
            <h3 className="text-white font-black text-sm uppercase px-2">Withdrawals ({pendingWithdraws.length})</h3>
            {pendingWithdraws.length > 0 ? pendingWithdraws.map(wd => (
              <div key={wd.id} className="bg-[#1a0d0e] border border-white/5 rounded-[2.5rem] p-6 space-y-5 shadow-2xl">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-primary font-black text-base italic uppercase tracking-tighter">{wd.method} - ${wd.amount}</p>
                       <p className="text-white text-lg font-black tracking-widest mt-1">{wd.phone_number}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-400 text-[9px] font-black uppercase">{wd.profiles?.email}</p>
                       <p className="text-slate-600 text-[7px] uppercase mt-1">{new Date(wd.created_at).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleWithdrawAction(wd.id, 'approved', wd.user_id, wd.amount)} className="flex-1 h-14 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">Mark as Paid</button>
                    <button onClick={() => handleWithdrawAction(wd.id, 'rejected', wd.user_id, wd.amount)} className="flex-1 h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-all">Reject (Refund)</button>
                 </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-20">
                 <span className="material-symbols-outlined text-5xl">payments</span>
                 <p className="text-xs font-black uppercase mt-2">No pending withdrawals</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="space-y-4 animate-in slide-in-from-bottom">
            <h3 className="text-white font-black text-sm uppercase px-2">Deposits ({pendingDeposits.length})</h3>
            {pendingDeposits.length > 0 ? pendingDeposits.map(dep => (
              <div key={dep.id} className="bg-[#1a0d0e] border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-white font-black text-sm uppercase italic">{dep.method} - ৳{dep.amount}</p>
                       <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">TrxID: {dep.transaction_id}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-400 text-[10px] font-black">{dep.profiles?.email}</p>
                       <p className="text-slate-600 text-[8px] uppercase">{new Date(dep.created_at).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleDepositAction(dep.id, 'approved', dep.user_id, dep.amount)} className="flex-1 h-12 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">Approve</button>
                    <button onClick={() => handleDepositAction(dep.id, 'rejected', dep.user_id, dep.amount)} className="flex-1 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-black text-[10px] uppercase active:scale-95 transition-all">Reject</button>
                 </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-20">
                 <span className="material-symbols-outlined text-5xl">receipt_long</span>
                 <p className="text-xs font-black uppercase mt-2">No pending deposits</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
           <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#1a0d0e] p-5 rounded-3xl border border-emerald-500/20 shadow-xl">
                    <p className="text-emerald-500 text-[8px] font-black uppercase tracking-widest mb-1">Total Stake (In)</p>
                    <h3 className="text-white text-2xl font-black tabular-nums">${stats.totalStakes.toLocaleString()}</h3>
                 </div>
                 <div className="bg-[#1a0d0e] p-5 rounded-3xl border border-red-500/20 shadow-xl">
                    <p className="text-red-500 text-[8px] font-black uppercase tracking-widest mb-1">Total Payout (Out)</p>
                    <h3 className="text-white text-2xl font-black tabular-nums">${stats.totalPayouts.toLocaleString()}</h3>
                 </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#2a1415] to-black p-8 rounded-[2.5rem] border border-primary/20 text-center shadow-2xl relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">Net Platform Profit</p>
                    <h1 className={`text-6xl font-black tracking-tighter italic tabular-nums ${stats.netProfit >= 0 ? 'text-white' : 'text-red-500'}`}>
                      ${stats.netProfit.toLocaleString()}
                    </h1>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'broadcast' && (
           <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
              <div className="bg-[#1a0d0e] p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl">
                 <h3 className="text-white font-black text-sm uppercase px-1">Global Notification</h3>
                 <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Title" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none" />
                 <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Message" className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-medium outline-none resize-none" />
                 <button onClick={handleBroadcast} disabled={isBroadcasting} className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                    {isBroadcasting ? "Sending..." : "BROADCAST NOW"}
                 </button>
              </div>
           </div>
        )}

        {activeTab === 'activity' && (
           <div className="space-y-3">
              {activity.map((log, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${log.status === 'won' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                         <span className="material-symbols-outlined text-xl">{log.status === 'won' ? 'trending_up' : 'trending_down'}</span>
                      </div>
                      <div>
                         <p className="text-white text-xs font-black uppercase tracking-tight">{log.profiles?.first_name || 'User'} played {log.game_name}</p>
                         <p className="text-slate-500 text-[8px] font-bold uppercase">{new Date(log.created_at).toLocaleTimeString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-xs font-black ${log.status === 'won' ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {log.status === 'won' ? `+$${log.payout}` : `-$${log.stake}`}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'rigging' && (
          <div className="bg-[#1a0d0e] border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/5 shadow-xl">
            {Object.keys(settings).map(key => (
              <div key={key} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-[11px] font-black uppercase tracking-widest">{key} House Edge</span>
                  <span className="text-primary font-black text-xs">{(settings[key] * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={settings[key]} onChange={(e) => handleRiggingChange(key, parseFloat(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
           <div className="space-y-4">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by email..." className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white outline-none focus:border-primary transition-all" />
              <div className="space-y-3">
                 {filteredUsers.map(u => (
                    <div key={u.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-white font-black text-sm">{u.email}</h4>
                             <p className="text-slate-500 text-[10px] font-bold uppercase">{u.first_name} {u.last_name}</p>
                          </div>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${u.status === 'blocked' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>{u.status || 'active'}</span>
                       </div>
                       <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <div>
                             <p className="text-slate-500 text-[8px] font-black uppercase">Balance</p>
                             <p className="text-white font-black text-xl">${u.balance?.toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => handleUpdateBalance(u.id, u.balance)} className="bg-white/10 text-white text-[9px] font-black px-4 py-2 rounded-xl border border-white/10">EDIT BAL</button>
                             <button onClick={() => adminUpdateUser(u.id, { status: u.status === 'blocked' ? 'active' : 'blocked' }).then(fetchData)} className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-xl">{u.status === 'blocked' ? 'UNBLOCK' : 'BLOCK'}</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'games' && (
           <div className="bg-[#1a0d0e] border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden">
              {Object.keys(gameStatus).map(id => (
                <div key={id} className="p-6 flex items-center justify-between">
                   <span className="text-white text-[11px] font-black uppercase tracking-widest">{id.replace('-game','')}</span>
                   <button onClick={() => toggleGame(id)} className={`w-14 h-8 rounded-full p-1 transition-all ${gameStatus[id] ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      <div className={`size-6 bg-white rounded-full transition-transform ${gameStatus[id] ? 'translate-x-6' : ''}`} />
                   </button>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
