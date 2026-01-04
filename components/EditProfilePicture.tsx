
import React, { useState, useRef } from 'react';
import { updateUserProfile } from '../services/supabase';

interface EditProfilePictureProps {
  user: any;
  currentAvatar?: string;
  onBack: () => void;
  onUpdate: () => void;
}

const EditProfilePicture: React.FC<EditProfilePictureProps> = ({ user, currentAvatar, onBack, onUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBU6TDlgkdvQV-6aVbFf1D2jLH7cCeowC0lo3vCHLYsEVRb6C99AY7B0EYLDlC_6ATjyo1TDOzYUu3ipqZFxyr53ataGZBh8TL_4aFXG3Pha4s7WBU7zmS8c6s7K6mSdgcFKBMCrgrR1a8XtmbQJhvJ1DuwFHvbWn5sSCo2KvXp7npaMx4eXgWrPv3y6yUO3MsRr9nbldQJ4qsZ1FfZbYMDM_qwSOA0s6Golo40DKa_UiWIp-pOU9nBBNGENWkZpqOH8Bw4xv21");
  const [error, setError] = useState<{title: string, msg: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError({
          title: "File too large",
          msg: "Maximum image size allowed is 5MB."
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    const userId = (user as any)?.id;
    if (!userId) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const { error: updateError } = await updateUserProfile(userId, { 
        avatar_url: previewUrl,
        updated_at: new Date().toISOString()
      });

      if (updateError) {
        const msg = (updateError as any).message || '';
        const code = (updateError as any).code || '';
        
        if (msg.includes('avatar_url') || code === '42703') {
          setError({
            title: "Database Column Missing",
            msg: "The 'avatar_url' column is missing in your Supabase 'profiles' table. Please run the SQL migration in your Supabase SQL Editor."
          });
        } else {
          throw updateError;
        }
        return;
      }
      
      onUpdate();
      onBack();
    } catch (err: any) {
      setError({
        title: "Update Failed",
        msg: err.message || "Something went wrong while saving your profile picture."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark animate-in fade-in duration-500 font-display">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg,image/png" 
        className="hidden" 
      />

      <div className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-white/5 shadow-xl">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors group"
          >
            <span className="material-symbols-outlined text-white group-hover:-translate-x-0.5 transition-transform">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-lg font-black leading-tight tracking-tight flex-1 text-center pr-10 uppercase italic">Edit Profile</h2>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center pt-10 px-6 overflow-y-auto no-scrollbar">
        {error && (
          <div className="w-full mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-[2rem] animate-in zoom-in duration-300">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-xl">error</span>
              <div>
                <p className="text-red-500 text-xs font-black uppercase tracking-widest mb-1">{error.title}</p>
                <p className="text-slate-400 text-[11px] font-bold leading-relaxed">{error.msg}</p>
                {error.title === "Database Column Missing" && (
                   <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/5">
                      <p className="text-[9px] font-mono text-emerald-400/80 break-all select-all">ALTER TABLE profiles ADD COLUMN avatar_url TEXT;</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative group/avatar cursor-pointer mb-10" onClick={triggerFileInput}>
          <div className="relative rounded-full p-1.5 bg-gradient-to-tr from-primary to-orange-500 shadow-[0_0_50px_rgba(234,42,51,0.2)]">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full h-44 w-44 md:h-52 md:w-52 shadow-2xl relative z-10 transition-transform active:scale-95 border-4 border-background-dark" 
              style={{ backgroundImage: `url("${previewUrl}")` }}
            ></div>
          </div>
          <div className="absolute bottom-2 right-2 z-20">
            <div className="bg-primary text-white size-12 rounded-full flex items-center justify-center border-4 border-background-dark shadow-2xl group-hover/avatar:scale-110 transition-transform">
              <span className="material-symbols-outlined">add_a_photo</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-white text-2xl font-black tracking-tight italic">Avatar Settings</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Personalize your gaming profile</p>
        </div>

        <div className="w-full max-w-sm p-6 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined">info</span>
            </div>
            <p className="text-slate-400 text-[11px] font-medium leading-tight">
              আপনার গ্যালারি থেকে একটি পরিষ্কার ছবি নির্বাচন করুন। ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।
            </p>
          </div>
          <button 
            onClick={triggerFileInput}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Change Image
          </button>
        </div>
      </main>

      <div className="p-6 pb-10 bg-[#0d0909] border-t border-white/5 mt-auto shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={handleSave}
          disabled={isSaving || (currentAvatar === previewUrl)}
          className="w-full flex items-center justify-center rounded-2xl h-16 bg-primary hover:bg-red-600 text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined mr-3 filled">check_circle</span>
              <span>Confirm & Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditProfilePicture;
