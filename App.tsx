
import React, { useState, useEffect } from 'react';
import { Language } from './services/translations';
import { supabase, getUserProfile, saveBetRecord, getGlobalSettings } from './services/supabase';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import SportsBetting from './components/SportsBetting';
import LiveCasino from './components/LiveCasino';
import Promotions from './components/Promotions';
import Wallet from './components/Wallet';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import Notifications from './components/Notifications';
import HelpSupport from './components/HelpSupport';
import ProfileSettings from './components/ProfileSettings';
import PersonalDetails from './components/PersonalDetails';
import VerificationCenter from './components/VerificationCenter';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MyBets from './components/MyBets';
import VipRewards from './components/VipRewards';
import BottomNav from './components/BottomNav';
import MiniGamesHub from './components/MiniGamesHub';
import CrashGame from './components/games/CrashGame';
import AviatorGame from './components/games/AviatorGame';
import Crazy777Game from './components/games/Crazy777Game';
import MinesGame from './components/games/MinesGame';
import PenaltyGame from './components/games/PenaltyGame';
import LimboGame from './components/games/LimboGame';
import DiceGame from './components/games/DiceGame';
import PlinkoGame from './components/games/PlinkoGame';
import AdminPanel from './components/AdminPanel';
import DailySpin from './components/DailySpin';
import AboutUs from './components/AboutUs';
import TermsConditions from './components/TermsConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import EditProfilePicture from './components/EditProfilePicture';
import GameDetail from './components/GameDetail';

export type ViewType = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'dashboard' | 'sports' | 'casino' | 'game-detail' | 'promotions' | 'wallet' | 'deposit' | 'withdraw' | 'profile' | 'edit-profile' | 'personal-details' | 'verification-center' | 'change-password' | 'my-bets' | 'vip-rewards' | 'notifications' | 'help-support' | 'mini-games' | 'crash-game' | 'aviator-game' | 'crazy777-game' | 'mines-game' | 'penalty-game' | 'limbo-game' | 'dice-game' | 'plinko-game' | 'admin' | 'about-us' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0); 
  const [isDemo, setIsDemo] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [activeToast, setActiveToast] = useState<{title: string, desc: string} | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [gameStatus, setGameStatus] = useState<Record<string, boolean>>({
    'crash-game': true, 'aviator-game': true, 'crazy777-game': true, 'mines-game': true,
    'penalty-game': true, 'limbo-game': true, 'dice-game': true, 'plinko-game': true
  });

  const [riggingSettings, setRiggingSettings] = useState({
    crash: 0.5, aviator: 0.5, crazy777: 0.5, mines: 0.5, penalty: 0.5, limbo: 0.4, dice: 0.5, plinko: 0.4, global: 0.3
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang') as Language;
    if (savedLang) setLang(savedLang);

    // Listen for PWA installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
        setCurrentView('dashboard');
      }
    });

    const fetchSettings = async () => {
      const { data } = await getGlobalSettings();
      if (data) {
        setRiggingSettings(data.rigging || riggingSettings);
        setGameStatus(data.game_status || gameStatus);
      }
    };
    fetchSettings();

    const settingsChannel = supabase.channel('admin_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, payload => {
        if (payload.new) {
          setRiggingSettings(payload.new.rigging);
          setGameStatus(payload.new.game_status);
        }
      })
      .subscribe();

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        if (session?.user) fetchUserData(session.user.id);
        setCurrentView('dashboard');
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setBalance(0);
        setCurrentView('login');
      }
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentView('reset-password');
      }
    });

    return () => {
      settingsChannel.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    const { data: profileData } = await getUserProfile(userId);
    if (profileData) {
      if (profileData.status === 'blocked') {
        supabase.auth.signOut();
        setActiveToast({ title: "Account Blocked", desc: "Please contact support." });
        return;
      }
      setProfile(profileData);
      setBalance(Number(profileData.balance) || 0);
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      const msg = lang === 'en' 
        ? "To install: Tap the Browser Menu (3 dots) and select 'Install App' or 'Add to Home Screen'."
        : "অ্যাপটি ইন্সটল করতে: আপনার ব্রাউজারের ৩-ডট মেনুতে ক্লিক করে 'Install App' অথবা 'Add to Home Screen' সিলেক্ট করুন।";
      setActiveToast({ title: "App Installation", desc: msg });
      setTimeout(() => setActiveToast(null), 6000);
    }
  };

  const updateBalance = async (newBalance: number) => {
    setBalance(newBalance);
    if (user && !isDemo) {
      await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
    }
  };

  const handleSaveBet = async (data: any) => {
    if (user && !isDemo) {
      await saveBetRecord({
        user_id: user.id,
        ...data
      });
    }
  };

  const navigate = (view: ViewType) => {
    if (view.includes('-game') && gameStatus[view] === false) {
      setActiveToast({ title: "Maintenance", desc: "This game is temporarily unavailable." });
      setTimeout(() => setActiveToast(null), 3000);
      return;
    }
    setCurrentView(view);
  };

  const isAuthView = ['login', 'register', 'forgot-password', 'reset-password'].includes(currentView);
  
  const isFullScreen = [
    'crash-game', 'aviator-game', 'crazy777-game', 'mines-game', 'penalty-game', 'limbo-game', 'dice-game', 'plinko-game',
    'personal-details', 'verification-center', 'change-password', 'edit-profile', 'game-detail',
    'admin', 'about-us', 'terms', 'privacy', 'my-bets', 'help-support', 'vip-rewards',
    'forgot-password', 'reset-password', 'deposit', 'withdraw', 'notifications'
  ].includes(currentView);

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0d0909] overflow-hidden font-display select-none animate-gpu">
      <div className={`w-full ${isAuthView ? 'max-w-md' : 'max-w-6xl'} bg-[#1a0d0e] h-full relative flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]`}>
        
        {activeToast && (
          <div onClick={() => setActiveToast(null)} className="absolute top-6 left-6 right-6 z-[300] animate-in slide-in-from-top duration-500 cursor-pointer">
             <div className="bg-[#24191a]/95 backdrop-blur-xl border border-primary/30 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-white text-xl">info</span>
                </div>
                <div className="flex-1">
                   <p className="text-white text-xs font-black uppercase tracking-tight mb-1">{activeToast.title}</p>
                   <p className="text-slate-400 text-[10px] font-bold leading-tight">{activeToast.desc}</p>
                </div>
             </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto no-scrollbar ${isAuthView ? 'flex flex-col justify-center py-10' : ''}`}>
          {currentView === 'login' && <LoginForm lang={lang} onSignUpClick={() => navigate('register')} onForgotClick={() => navigate('forgot-password')} onSuccess={() => navigate('dashboard')} onDemoLogin={() => { setIsDemo(true); setBalance(5000); navigate('dashboard'); }} />}
          {currentView === 'register' && <RegisterForm lang={lang} onLoginClick={() => navigate('login')} onSuccess={() => navigate('dashboard')} />}
          {currentView === 'forgot-password' && <ForgotPassword lang={lang} onBack={() => navigate('login')} />}
          {currentView === 'reset-password' && <ResetPassword lang={lang} onSuccess={() => navigate('login')} />}
          {currentView === 'dashboard' && <Dashboard lang={lang} balance={balance} userProfile={profile} onWalletClick={() => navigate('wallet')} onDepositClick={() => navigate('deposit')} onNavigate={navigate} onSpinClick={() => setShowSpin(true)} onNotificationClick={() => navigate('notifications')} />}
          {currentView === 'sports' && <SportsBetting lang={lang} balance={balance} globalRigging={riggingSettings.global} onMyBetsClick={() => navigate('my-bets')} />}
          {currentView === 'casino' && <LiveCasino lang={lang} balance={balance} onNavigate={navigate} gameStatus={gameStatus} />}
          {currentView === 'game-detail' && <GameDetail balance={balance} gameId={1} onBack={() => navigate('casino')} onUpdateBalance={updateBalance} />}
          {currentView === 'promotions' && <Promotions onNavigate={navigate} />}
          {currentView === 'wallet' && <Wallet lang={lang} balance={balance} onBack={() => navigate('dashboard')} onDepositClick={() => navigate('deposit')} onWithdrawClick={() => navigate('withdraw')} onHistoryClick={() => navigate('my-bets')} />}
          {currentView === 'deposit' && <Deposit lang={lang} balance={balance} onBack={() => navigate('wallet')} onDepositSuccess={(amt) => { updateBalance(balance + amt); navigate('wallet'); }} />}
          {currentView === 'withdraw' && <Withdraw lang={lang} balance={balance} onBack={() => navigate('wallet')} onWithdrawSuccess={(amt) => { updateBalance(balance - amt); navigate('wallet'); }} />}
          {currentView === 'notifications' && <Notifications lang={lang} onBack={() => navigate('dashboard')} />}
          {currentView === 'my-bets' && <MyBets lang={lang} user={user} onBack={() => navigate('dashboard')} onNavigateHome={() => navigate('dashboard')} />}
          {currentView === 'profile' && <ProfileSettings lang={lang} userProfile={profile} onBack={() => navigate('dashboard')} onLogout={async () => { await supabase.auth.signOut(); navigate('login'); }} onLanguageToggle={() => { setLang(lang === 'en' ? 'bn' : 'en'); }} onEditProfile={() => navigate('edit-profile')} onPersonalDetails={() => navigate('personal-details')} onVerificationCenter={() => navigate('verification-center')} onChangePassword={() => navigate('change-password')} onVipRewards={() => navigate('vip-rewards')} onHelpSupport={() => navigate('help-support')} onAboutUs={() => navigate('about-us')} onTerms={() => navigate('terms')} onPrivacy={() => navigate('privacy')} onAdminPanel={profile?.role === 'admin' ? () => navigate('admin') : undefined} onDownloadApp={handleInstallApp} />}
          {currentView === 'personal-details' && <PersonalDetails onBack={() => navigate('profile')} user={user} />}
          {currentView === 'verification-center' && <VerificationCenter onBack={() => navigate('profile')} />}
          {currentView === 'change-password' && <ChangePassword onBack={() => navigate('profile')} />}
          {currentView === 'edit-profile' && <EditProfilePicture user={user} currentAvatar={profile?.avatar_url} onBack={() => navigate('profile')} onUpdate={() => user && fetchUserData(user.id)} />}
          {currentView === 'vip-rewards' && <VipRewards currentPoints={1200} onBack={() => navigate('profile')} />}
          {currentView === 'help-support' && <HelpSupport onBack={() => navigate('profile')} />}
          {currentView === 'about-us' && <AboutUs onBack={() => navigate('profile')} />}
          {currentView === 'terms' && <TermsConditions onBack={() => navigate('profile')} />}
          {currentView === 'privacy' && <PrivacyPolicy onBack={() => navigate('profile')} />}
          {currentView === 'admin' && <AdminPanel onBack={() => navigate('profile')} settings={riggingSettings} onUpdateSettings={setRiggingSettings} gameStatus={gameStatus} onUpdateGameStatus={setGameStatus} />}
          
          {currentView === 'mini-games' && <MiniGamesHub onNavigate={navigate} gameStatus={gameStatus} />}
          {currentView === 'crash-game' && <CrashGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.crash} onBack={() => navigate('mini-games')} />}
          {currentView === 'aviator-game' && <AviatorGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.aviator} onBack={() => navigate('mini-games')} />}
          {currentView === 'crazy777-game' && <Crazy777Game balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.crazy777} onBack={() => navigate('mini-games')} />}
          {currentView === 'mines-game' && <MinesGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.mines} onBack={() => navigate('mini-games')} />}
          {currentView === 'penalty-game' && <PenaltyGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.penalty} onBack={() => navigate('mini-games')} />}
          {currentView === 'limbo-game' && <LimboGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.limbo} onBack={() => navigate('mini-games')} />}
          {currentView === 'dice-game' && <DiceGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.dice} onBack={() => navigate('mini-games')} />}
          {currentView === 'plinko-game' && <PlinkoGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleSaveBet} riggingIntensity={riggingSettings.plinko} onBack={() => navigate('mini-games')} />}
        </div>

        {showSpin && <DailySpin onWin={(amt) => updateBalance(balance + amt)} onClose={() => setShowSpin(false)} />}

        {!isAuthView && !isFullScreen && <BottomNav lang={lang} currentView={currentView} onNavigate={navigate} />}
      </div>
    </div>
  );
};

export default App;
