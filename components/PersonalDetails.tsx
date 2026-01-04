
import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/supabase';

interface PersonalDetailsProps {
  onBack: () => void;
  user?: any;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ onBack, user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [dob, setDob] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await getUserProfile(user.id);
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setDob(data.date_of_birth || '');
          setAddress(data.address || '');
          setCity(data.city || '');
          setState(data.state || '');
          setZip(data.zip_code || '');
        } else if (fetchError) {
          console.error("Profile Fetch Error:", fetchError);
          setError(fetchError?.message || "Could not fetch profile.");
        }
      } catch (e: any) {
        console.error("Fetch Exception:", e);
        setError(e?.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setShowSuccess(false);

    const updates = {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dob,
      address: address,
      city: city,
      state: state,
      zip_code: zip,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error: updateError } = await updateUserProfile(user.id, updates);
      
      if (updateError) {
        console.error("Update Error:", updateError);
        setError(`Update Failed: ${updateError.message}. Make sure RLS policies are set in Supabase.`);
      } else if (!data || data.length === 0) {
        setError("Update failed: No rows affected. Check your database permissions (RLS).");
      } else {
        setShowSuccess(true);
        // Sync local storage or state if needed, but let's just go back
        setTimeout(() => onBack(), 1500);
      }
    } catch (e: any) {
      console.error("Exception during update:", e);
      setError(`Unexpected Error: ${e?.message || "Please check your internet connection."}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0d0909] text-white p-10">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-widest opacity-50">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0909] animate-in slide-in-from-right duration-500 overflow-hidden font-display relative">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-[#0d0909]/95 backdrop-blur-md p-4 border-b border-white/5 shadow-lg">
        <button onClick={onBack} className="text-white size-10 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-black uppercase tracking-tight flex-1 text-center pr-10">Personal Details</h2>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40 no-scrollbar">
        {showSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest text-center rounded-2xl animate-in zoom-in">
            Information Saved Successfully!
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-normal text-center rounded-2xl animate-in shake">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">First Name</span>
            <input 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-700" 
              placeholder="First Name"
            />
          </label>
          <label className="space-y-2">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Last Name</span>
            <input 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-700" 
              placeholder="Last Name"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Date of Birth</span>
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all [color-scheme:dark]" 
          />
        </label>

        <label className="block space-y-2">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Full Address</span>
          <input 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-700" 
            placeholder="House, Street, Area..."
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">City</span>
            <input 
              placeholder="City" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">State / Region</span>
            <input 
              placeholder="State" 
              value={state} 
              onChange={(e) => setState(e.target.value)} 
              className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
            />
          </div>
        </div>

        <label className="block space-y-2">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">Zip Code</span>
          <input 
            placeholder="1234" 
            value={zip} 
            onChange={(e) => setZip(e.target.value)} 
            className="w-full rounded-2xl text-white bg-white/5 border border-white/10 h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
          />
        </label>

        {/* Info Box */}
        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex gap-3">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
            Please make sure the details provided match your government-issued ID for smooth account verification and withdrawals.
          </p>
        </div>
      </div>

      {/* Floating Save Button Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0d0909] via-[#0d0909] to-transparent border-t border-white/5 z-50">
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full bg-primary text-white font-black h-16 rounded-2xl shadow-[0_10px_30px_rgba(234,42,51,0.3)] active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined !text-[20px]">save</span>
              Save Profile Details
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
