
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://anwivgcqxakbyajfueth.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud2l2Z2NxeGFrYnlhamZ1ZXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMzgxNDAsImV4cCI6MjA4MjkxNDE0MH0.BS_S6f9330G0wcx9X67ZbySxkIKuGBz5gh0tk13Z4eE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// --- ADMIN FUNCTIONS ---

/**
 * Fetches global site settings (rigging, maintenance, etc.)
 */
export const getGlobalSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();
  return { data, error };
};

/**
 * Updates global site settings
 */
export const updateGlobalSettings = async (updates: any) => {
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('id', 1); // Assuming a single row with ID 1 holds global config
  return { data, error };
};

/**
 * Admin: Get all user profiles
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

/**
 * Admin: Update any user (Block, Balance, etc)
 */
export const adminUpdateUser = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  return { data, error };
};

export const saveBetRecord = async (betData: any) => {
  try {
    const { data, error } = await supabase
      .from('bets')
      .insert([betData])
      .select();
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const getBetHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};
