
import React, { useState, useEffect } from 'react';
import { supabase, getUserProfile, saveBetRecord } from './services/supabase';
import { Language } from './services/translations';

// Import components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import SportsBetting from './components/SportsBetting';
import LiveCasino from './components/LiveCasino';
import MiniGamesHub from './components/MiniGamesHub';
import Promotions from './components/Promotions';
import Wallet from './components/Wallet';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import ProfileSettings from './components/ProfileSettings';
import PersonalDetails from './components/PersonalDetails';
import VerificationCenter from './components/VerificationCenter';
import ChangePassword from './components/ChangePassword';
import MyBets from './components/MyBets';
import VipRewards from './components/VipRewards';
import Notifications from './components/Notifications';
import HelpSupport from './components/HelpSupport';
import AboutUs from './components/AboutUs';
import TermsConditions from './components/TermsConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import EditProfilePicture from './components/EditProfilePicture';
import GameDetail from './components/GameDetail';
import DailySpin from './components/DailySpin';
import BottomNav from './components/BottomNav';
import InstallAppModal from './components/InstallAppModal';

// Mini Games
import CrashGame from './components/games/CrashGame';
import AviatorGame from './components/games/AviatorGame';
import Crazy777Game from './components/games/Crazy777Game';
import MinesGame from './components/games/MinesGame';
import PenaltyGame from './components/games/PenaltyGame';
import LimboGame from './components/games/LimboGame';
import DiceGame from './components/games/DiceGame';
import PlinkoGame from './components/games/PlinkoGame';
import AdminPanel from './components/AdminPanel';

export type ViewType = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'dashboard' | 'sports' | 'casino' | 'game-detail' | 'promotions' | 'wallet' | 'deposit' | 'withdraw' | 'profile' | 'edit-profile' | 'personal-details' | 'verification-center' | 'change-password' | 'my-bets' | 'vip-rewards' | 'notifications' | 'help-support' | 'mini-games' | 'crash-game' | 'aviator-game' | 'crazy777-game' | 'mines-game' | 'penalty-game' | 'limbo-game' | 'dice-game' | 'plinko-game' | 'admin' | 'about-us' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [historyType, setHistoryType] = useState<'bets' | 'transactions'>('bets');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [isDemo, setIsDemo] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string, desc: string } | null>(null);
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [gameStatus, setGameStatus] = useState<Record<string, boolean>>({
    'crash-game': true,
    'aviator-game': true,
    'crazy777-game': true,
    'mines-game': true,
    'penalty-game': true,
    'limbo-game': true,
    'dice-game': true,
    'plinko-game': true
  });
  const [settings, setSettings] = useState<any>({
    crash: 0.1,
    aviator: 0.1,
    crazy777: 0.1,
    mines: 0.1,
    penalty: 0.1,
    limbo: 0.1,
    dice: 0.1,
    plinko: 0.1
  });

  // Handle Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        setCurrentView('dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        setCurrentView('dashboard');
        setIsDemo(false);
      } else {
        setUser(null);
        setProfile(null);
        if (!isDemo) setCurrentView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

  const fetchProfile = async (userId: string) => {
    const { data } = await getUserProfile(userId);
    if (data) {
      setProfile(data);
      setBalance(Number(data.balance) || 0);
    }
  };

  const navigate = (view: ViewType) => setCurrentView(view);
  const updateBalance = (newBal: number) => setBalance(newBal);

  const handleInstallClick = () => setShowInstallModal(true);

  const onLoginSuccess = () => navigate('dashboard');

  const handleBetSave = async (betData: any) => {
    if (!user || isDemo) return;
    await saveBetRecord({
      user_id: user.id,
      ...betData,
      created_at: new Date().toISOString()
    });
    fetchProfile(user.id);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black text-white relative overflow-hidden font-display shadow-[0_0_100px_rgba(0,0,0,0.5)]">
      <main className="flex-1 overflow-hidden relative">
        {currentView === 'login' && <LoginForm lang={lang} onSignUpClick={() => navigate('register')} onForgotClick={() => navigate('forgot-password')} onSuccess={onLoginSuccess} onDemoLogin={() => { setIsDemo(true); setBalance(1000); navigate('dashboard'); }} />}
        {currentView === 'register' && <RegisterForm lang={lang} onLoginClick={() => navigate('login')} onSuccess={() => navigate('login')} />}
        {currentView === 'forgot-password' && <ForgotPassword lang={lang} onBack={() => navigate('login')} />}
        {currentView === 'reset-password' && <ResetPassword lang={lang} onSuccess={() => navigate('login')} />}
        
        {currentView === 'dashboard' && <Dashboard lang={lang} balance={balance} userProfile={profile} onWalletClick={() => navigate('wallet')} onDepositClick={() => navigate('deposit')} onNavigate={navigate} onSpinClick={() => setIsSpinOpen(true)} onNotificationClick={() => navigate('notifications')} />}
        {currentView === 'sports' && <SportsBetting lang={lang} balance={balance} onMyBetsClick={() => { setHistoryType('bets'); navigate('my-bets'); }} />}
        {currentView === 'casino' && <LiveCasino lang={lang} balance={balance} onNavigate={navigate} gameStatus={gameStatus} />}
        {currentView === 'promotions' && <Promotions onNavigate={navigate} />}
        {currentView === 'wallet' && <Wallet lang={lang} balance={balance} onBack={() => navigate('dashboard')} onDepositClick={() => navigate('deposit')} onWithdrawClick={() => navigate('withdraw')} onHistoryClick={() => { setHistoryType('transactions'); navigate('my-bets'); }} />}
        {currentView === 'deposit' && <Deposit lang={lang} balance={balance} onBack={() => navigate('wallet')} onDepositSuccess={(amt) => { updateBalance(balance + amt); setActiveToast({ title: "Deposit Successful", desc: `$${amt} has been added to your balance.` }); navigate('wallet'); }} />}
        {currentView === 'withdraw' && <Withdraw lang={lang} balance={balance} onBack={() => navigate('wallet')} isDemo={isDemo} onWithdrawSuccess={(amt) => { updateBalance(balance - amt); navigate('wallet'); }} />}
        {currentView === 'notifications' && <Notifications lang={lang} onBack={() => navigate('dashboard')} />}
        {currentView === 'my-bets' && <MyBets lang={lang} user={user} initialTab={historyType} onBack={() => navigate('dashboard')} onNavigateHome={() => navigate('dashboard')} />}
        {currentView === 'profile' && <ProfileSettings lang={lang} userProfile={profile} onBack={() => navigate('dashboard')} onLogout={async () => { await supabase.auth.signOut(); navigate('login'); }} onLanguageToggle={() => setLang(lang === 'en' ? 'bn' : 'en')} onEditProfile={() => navigate('edit-profile')} onPersonalDetails={() => navigate('personal-details')} onVerificationCenter={() => navigate('verification-center')} onChangePassword={() => navigate('change-password')} onVipRewards={() => navigate('vip-rewards')} onHelpSupport={() => navigate('help-support')} onAboutUs={() => navigate('about-us')} onTerms={() => navigate('terms')} onPrivacy={() => navigate('privacy')} onAdminPanel={profile?.role === 'admin' ? () => navigate('admin') : undefined} onDownloadApp={handleInstallClick} />}
        {currentView === 'edit-profile' && <EditProfilePicture user={user} currentAvatar={profile?.avatar_url} onBack={() => navigate('profile')} onUpdate={() => fetchProfile(user.id)} />}
        {currentView === 'personal-details' && <PersonalDetails user={user} onBack={() => navigate('profile')} />}
        {currentView === 'verification-center' && <VerificationCenter onBack={() => navigate('profile')} />}
        {currentView === 'change-password' && <ChangePassword onBack={() => navigate('profile')} />}
        {currentView === 'vip-rewards' && <VipRewards currentPoints={1200} onBack={() => navigate('profile')} />}
        {currentView === 'help-support' && <HelpSupport onBack={() => navigate('profile')} />}
        {currentView === 'about-us' && <AboutUs onBack={() => navigate('profile')} />}
        {currentView === 'terms' && <TermsConditions onBack={() => navigate('profile')} />}
        {currentView === 'privacy' && <PrivacyPolicy onBack={() => navigate('profile')} />}
        {currentView === 'game-detail' && <GameDetail balance={balance} gameId={1} onBack={() => navigate('casino')} />}
        {currentView === 'mini-games' && <MiniGamesHub onNavigate={navigate} gameStatus={gameStatus} />}
        
        {/* Mini Games */}
        {currentView === 'crash-game' && <CrashGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.crash} onBack={() => navigate('mini-games')} />}
        {currentView === 'aviator-game' && <AviatorGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.aviator} onBack={() => navigate('mini-games')} />}
        {currentView === 'crazy777-game' && <Crazy777Game balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.crazy777} onBack={() => navigate('mini-games')} />}
        {currentView === 'mines-game' && <MinesGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.mines} onBack={() => navigate('mini-games')} />}
        {currentView === 'penalty-game' && <PenaltyGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.penalty} onBack={() => navigate('mini-games')} />}
        {currentView === 'limbo-game' && <LimboGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.limbo} onBack={() => navigate('mini-games')} />}
        {currentView === 'dice-game' && <DiceGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.dice} onBack={() => navigate('mini-games')} />}
        {currentView === 'plinko-game' && <PlinkoGame balance={balance} onUpdateBalance={updateBalance} onSaveBet={handleBetSave} riggingIntensity={settings.plinko} onBack={() => navigate('mini-games')} />}
        
        {currentView === 'admin' && <AdminPanel settings={settings} onUpdateSettings={setSettings} gameStatus={gameStatus} onUpdateGameStatus={setGameStatus} onBack={() => navigate('profile')} />}
      </main>

      {!['login', 'register', 'forgot-password', 'reset-password', 'crash-game', 'aviator-game', 'crazy777-game', 'mines-game', 'penalty-game', 'limbo-game', 'dice-game', 'plinko-game', 'admin', 'game-detail', 'edit-profile'].includes(currentView) && (
        <BottomNav lang={lang} currentView={currentView} onNavigate={navigate} />
      )}

      {isSpinOpen && <DailySpin onWin={(amt) => { updateBalance(balance + amt); setIsSpinOpen(false); }} onClose={() => setIsSpinOpen(false)} />}
      {showInstallModal && <InstallAppModal lang={lang} onClose={() => setShowInstallModal(false)} onInstall={() => setShowInstallModal(false)} isIOS={/iPad|iPhone|iPod/.test(navigator.userAgent)} />}

      {/* Toast Notification */}
      {activeToast && (
        <div className="fixed top-8 left-6 right-6 bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl z-[500] flex items-center gap-4 animate-in slide-in-from-top">
          <span className="material-symbols-outlined">check_circle</span>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest">{activeToast.title}</p>
            <p className="text-xs font-bold">{activeToast.desc}</p>
          </div>
          <button onClick={() => setActiveToast(null)}><span className="material-symbols-outlined">close</span></button>
        </div>
      )}
    </div>
  );
};

export default App;
