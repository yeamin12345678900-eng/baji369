
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL || 'https://anwivgcqxakbyajfueth.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud2l2Z2NxeGFrYnlhamZ1ZXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMzgxNDAsImV4cCI6MjA4MjkxNDE0MH0.BS_S6f9330G0wcx9X67ZbySxkIKuGBz5gh0tk13Z4eE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
  } catch (err) { return { data: null, error: err }; }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select();
    return { data, error };
  } catch (err) { return { data: null, error: err }; }
};

// --- TRANSACTION FUNCTIONS ---

export const submitDepositRequest = async (depositData: { 
  user_id: string, 
  amount: number, 
  method: string, 
  transaction_id: string 
}) => {
  return await supabase.from('transactions').insert([{
    ...depositData,
    status: 'pending',
    type: 'deposit',
    created_at: new Date().toISOString()
  }]);
};

export const getPendingTransactions = async () => {
  return await supabase
    .from('transactions')
    .select('*, profiles(first_name, last_name, email, balance)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
};

export const updateTransactionStatus = async (transactionId: string, status: 'approved' | 'rejected', userId: string, amount: number) => {
  // 1. Update the transaction status
  const { error: transError } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', transactionId);

  if (transError) throw transError;

  // 2. If approved, update user balance
  if (status === 'approved') {
    const { data: profile } = await getUserProfile(userId);
    if (profile) {
      const newBalance = (profile.balance || 0) + amount;
      await updateUserProfile(userId, { balance: newBalance });
      
      // 3. Send notification
      await supabase.from('notifications').insert([{
        user_id: userId,
        title: 'Deposit Approved',
        desc: `Your deposit of $${amount} has been approved and added to your balance.`,
        type: 'win',
        unread: true
      }]);
    }
  }
  return { success: true };
};

// --- ADMIN CONTROL FUNCTIONS ---

export const getGlobalSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').single();
  return { data, error };
};

export const updateGlobalSettings = async (updates: any) => {
  const { data, error } = await supabase.from('settings').update(updates).eq('id', 1);
  return { data, error };
};

export const getAllUsers = async () => {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return { data, error };
};

export const adminUpdateUser = async (userId: string, updates: any) => {
  return await supabase.from('profiles').update(updates).eq('id', userId).select();
};

export const saveBetRecord = async (betData: any) => {
  return await supabase.from('bets').insert([betData]).select();
};

export const getBetHistory = async (userId: string) => {
  return await supabase.from('bets').select('*').eq('user_id', userId).order('created_at', { ascending: false });
};

export const broadcastNotification = async (title: string, desc: string, type: string = 'promo') => {
  const { data: users } = await getAllUsers();
  if (!users) return;
  
  const notifications = users.map(user => ({
    user_id: user.id,
    title,
    desc,
    type,
    unread: true,
    created_at: new Date().toISOString()
  }));

  return await supabase.from('notifications').insert(notifications);
};

export const getUserNotifications = async (userId: string) => {
  return await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
};

export const getPlatformActivity = async () => {
  return await supabase.from('bets').select('*, profiles(first_name, last_name, email)').order('created_at', { ascending: false }).limit(50);
};
