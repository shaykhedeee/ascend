// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Main Dashboard Page
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useAscendStore } from '@/lib/store';
import { useTheme } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { HabitGrid } from '@/components/HabitGrid';
import { DailyConsistencyChart, MonthlyCompletionDonut, WeeklyBreakdownChart, TopHabitsRanking, StatsCards } from '@/components/Analytics';
import { Onboarding } from '@/components/Onboarding';
import { Toast, LevelUpModal, StreakCelebration } from '@/components/Toast';
import useNotifications, { NOTIFICATION_MESSAGES } from '@/hooks/useNotifications';
import { UnifiedTodayView } from '@/components/UnifiedTodayView';
import { CalendarView } from '@/components/CalendarView';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MobileNav } from '@/components/MobileNav';
import { LandingPageV2 as LandingPage } from '@/components/LandingPageV2';
import { TimedTasks } from '@/components/TimedTasks';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { HabitStacking } from '@/components/HabitStacking';
import { TaskList } from '@/components/TaskList';
import { AllTasksView } from '@/components/AllTasksView';
import { AICoach } from '@/components/AICoach';
import { AIHabitSuggestions } from '@/components/AIHabitSuggestions';
import { AIInsights } from '@/components/AIInsights';
import QuickAdd from '@/components/QuickAdd';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { IdentitySystem } from '@/components/IdentitySystem';
import { DataBackupReminder } from '@/components/DataBackupReminder';
import { StreakFreeze } from '@/components/StreakFreeze';
import { GoalCard } from '@/components/GoalCard';
import { Sidebar } from '@/components/Sidebar';
import { Tutorial, useTutorial } from '@/components/Tutorial';
import { GoalProgressWidget, StreakCalendar } from '@/components/GoalCountdown';
import { cn, getRandomQuote } from '@/lib/utils';
import { exportAllData } from '@/lib/export';
import { LEVELS } from '@/types';
import { QuickWellnessWidget, FloatingBreatheButton } from '@/components/QuickWellnessWidget';
import { SkipLink, AnnouncerProvider } from '@/components/Accessibility';
import { MinimalGrid } from '@/components/ui/MinimalGrid';
import { ContributionHeatmap } from '@/components/ContributionHeatmap';
import { DemoPlanGenerator } from '@/components/DemoPlanGenerator';

// ─── Dynamic imports for heavy components (code-split for performance) ───
const GoalWizard = dynamic(() => import('@/components/GoalWizard').then(m => ({ default: m.GoalWizard })), { ssr: false });
const AddHabitModal = dynamic(() => import('@/components/AddHabitModal').then(m => ({ default: m.AddHabitModal })), { ssr: false });
const SettingsModal = dynamic(() => import('@/components/SettingsModal').then(m => ({ default: m.SettingsModal })), { ssr: false });
const ProfileModal = dynamic(() => import('@/components/ProfileModal').then(m => ({ default: m.ProfileModal })), { ssr: false });
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })), { ssr: false });
const TemplateLibrary = dynamic(() => import('@/components/TemplateLibraryV2').then(m => ({ default: m.TemplateLibrary })), { ssr: false });
const PaymentCheckout = dynamic(() => import('@/components/PaymentCheckout'), { ssr: false });
const WeeklyReview = dynamic(() => import('@/components/WeeklyReview').then(m => ({ default: m.WeeklyReview })), { ssr: false });
const WellnessCenter = dynamic(() => import('@/components/WellnessCenter'), { ssr: false });
import { 
  Plus, 
  Target, 
  Brain, 
  Sparkles, 
  Zap,
  Award,
  CheckCircle2,
  Timer,
  Crown,
  Command,
  Heart,
} from 'lucide-react';

type Tab = 'today' | 'progress' | 'profile' | 'habits' | 'goals' | 'calendar' | 'focus' | 'tasks' | 'wellness';
type AppView = 'landing' | 'onboarding' | 'app';

export default function Home() {
  const { 
    user, 
    habits, 
    goals, 
    calendar,
    hasCompletedOnboarding,
    streakCelebrationPending,
    clearStreakCelebration,
  } = useAscendStore();
  
  const router = useRouter();
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  
  const { mounted } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo] = useState<{ level: number; name: string } | null>(null);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  
  // Auto-trigger streak celebration from store
  useEffect(() => {
    if (streakCelebrationPending) {
      setShowStreakCelebration(true);
      clearStreakCelebration();
    }
  }, [streakCelebrationPending, clearStreakCelebration]);
  
  // Daily notification scheduling
  const { requestPermission, scheduleReminder, scheduledReminders } = useNotifications();
  
  useEffect(() => {
    if (!hasCompletedOnboarding || !user?.preferences?.notifications?.enabled) return;
    // Only schedule once
    if (scheduledReminders.length > 0) return;
    
    const scheduleNotifications = async () => {
      const granted = await requestPermission();
      if (!granted) return;
      
      const { morningReminder, eveningReminder } = user.preferences.notifications;
      
      if (morningReminder) {
        scheduleReminder(
          morningReminder,
          NOTIFICATION_MESSAGES.morningReminder.title,
          NOTIFICATION_MESSAGES.morningReminder.body
        );
      }
      
      if (eveningReminder) {
        scheduleReminder(
          eveningReminder,
          NOTIFICATION_MESSAGES.eveningReview.title,
          NOTIFICATION_MESSAGES.eveningReview.body
        );
      }
    };
    
    scheduleNotifications();
  }, [hasCompletedOnboarding, user?.preferences?.notifications?.enabled]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [appView, setAppView] = useState<AppView>('landing');
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showBackupReminder, setShowBackupReminder] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);
  const [showDemoPlan, setShowDemoPlan] = useState(false);
  
  // Tutorial state
  const { shouldShowTutorial, completeTutorial } = useTutorial();
  
  const quote = getRandomQuote();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Allow Ctrl+K in inputs for search
        if (!((e.ctrlKey || e.metaKey) && e.key === 'k')) {
          return;
        }
      }

      // Ctrl/Cmd + K - Global Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(prev => !prev);
      }
      
      // Ctrl/Cmd + N - New Task (Quick Add)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowQuickAdd(true);
      }
      
      // Ctrl/Cmd + G - New Goal
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setShowGoalWizard(true);
      }
      
      // Ctrl/Cmd + H - New Habit
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowAddHabit(true);
      }

      // Ctrl/Cmd + , - Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }

      // Ctrl/Cmd + T - Template Library
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setShowTemplateLibrary(true);
      }
      
      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowQuickAdd(false);
        setShowPaymentCheckout(false);
        setShowGlobalSearch(false);
        setShowTemplateLibrary(false);
      }

      // Number keys for quick navigation (when not in input)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key) {
          case '1': setActiveTab('today'); break;
          case '2': setActiveTab('habits'); break;
          case '3': setActiveTab('tasks'); break;
          case '4': setActiveTab('goals'); break;
          case '5': setActiveTab('focus'); break;
          case '6': setActiveTab('calendar'); break;
          case '7': setActiveTab('progress'); break;
          case '8': setActiveTab('wellness'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine initial app view based on Clerk auth state and onboarding
  useEffect(() => {
    if (mounted && isClerkLoaded) {
      if (isSignedIn && hasCompletedOnboarding) {
        setAppView('app');
      } else if (isSignedIn && !hasCompletedOnboarding) {
        setAppView('onboarding');
      } else {
        setAppView('landing');
      }
    }
  }, [mounted, isClerkLoaded, isSignedIn, hasCompletedOnboarding]);

  // Handle initial loading
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => setIsLoading(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Show loading screen on first load (or while Clerk is loading)
  if (isLoading || !mounted || !isClerkLoaded) {
    return <LoadingScreen />;
  }

  // Show landing page for unauthenticated visitors
  if (appView === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={() => router.push('/sign-up')}
          onLogin={() => router.push('/sign-in')}
        />
      </>
    );
  }

  // Show onboarding for new users
  if (appView === 'onboarding' || !hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // Show demo plan for newly onboarded users (first visit)
  const isFirstVisit = goals.length > 0 && !localStorage.getItem('ascend-demo-plan-seen');

  const currentLevel = LEVELS.find(l => l.level === user.gamification.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === user.gamification.level + 1);
  const xpProgress = nextLevel 
    ? ((user.gamification.totalXP - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;

  const activeGoals = goals.filter(g => g.status === 'in_progress');
  const activeHabits = habits.filter(h => h.isActive);
  const todayProgress = Math.round(
    (activeHabits.filter(h => h.completedToday).length / Math.max(activeHabits.length, 1)) * 100
  );

  return (
    <AnnouncerProvider>
    <div className="min-h-screen bg-[var(--background)]">
      {/* Skip Link for Accessibility */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      
      {/* Tutorial Overlay for First-time Users */}
      {shouldShowTutorial && (
        <Tutorial 
          onComplete={completeTutorial} 
          onSkip={completeTutorial} 
        />
      )}
      
      {/* Background Effects - Responsive sizes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <MinimalGrid className="opacity-40" />
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-ascend-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gold-400/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar - Desktop Only */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenUpgrade={() => setShowPaymentCheckout(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenWeeklyReview={() => setShowWeeklyReview(true)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Header - Mobile Only (hidden on desktop where sidebar is visible) */}
      <div className="md:hidden">
        <Header 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab as Tab)} 
          onOpenSettings={() => setShowSettings(true)}
          onOpenUpgrade={() => setShowPaymentCheckout(true)}
        />
      </div>

      {/* Main Content - Add left margin for sidebar on desktop, bottom padding for mobile nav */}
      <main 
        id="main-content"
        tabIndex={-1}
        role="tabpanel"
        aria-label={`${activeTab} view`}
        className={cn(
        "relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-6 outline-none",
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        
        {/* Today Tab - Unified Task View */}
        {activeTab === 'today' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">
                  Welcome back, <span className="text-ascend-500">{user.name}</span>
                </h1>
                <p className="mt-1 text-sm sm:text-base text-[var(--text-secondary)]">
                  {todayProgress === 100 
                    ? "Excellent work. You completed everything for today."
                    : "Here's your personalized action plan for today"}
                </p>
              </div>
              
              {/* Quick Actions - Desktop */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Habit
                </button>
                <button
                  onClick={() => setShowGoalWizard(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  New Goal
                </button>
              </div>
            </div>

            {/* Unified Today View - Main Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Task Stream - Takes 2/3 on large screens */}
              <div className="lg:col-span-2 space-y-4" data-tutorial="tasks">
                {/* Quick Add - Inline */}
                <QuickAdd placeholder="Quick add task... (Ctrl+K)" />
                
                {/* AI Coach - Inline version */}
                <AICoach variant="inline" />
                
                <UnifiedTodayView 
                  onOpenGoalWizard={() => setShowGoalWizard(true)} 
                  onAddTask={() => setActiveTab('tasks')}
                />
              </div>

              {/* Side Panel - Level & Quick Stats */}
              <div className="space-y-4">
                {/* Level Progress Card */}
                <div className="glass-card p-6" data-tutorial="xp-level">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-themed flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Your Level
                    </h3>
                  </div>
                  
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="6" />
                        <circle
                          cx="40" cy="40" r="36" fill="none"
                          stroke="url(#levelGrad)" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${xpProgress * 2.26} 226`}
                        />
                        <defs>
                          <linearGradient id="levelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#FBBF24" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-themed">{user.gamification.level}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-semibold text-themed">{currentLevel.name}</p>
                    <div className="flex items-center justify-center gap-1 text-xs text-themed-muted mt-1">
                      <Zap className="w-3 h-3 text-gold-400" />
                      <span>{user.gamification.totalXP.toLocaleString()} XP</span>
                    </div>
                    
                    {nextLevel && (
                      <p className="text-xs text-themed-muted mt-2">
                        {(nextLevel.xpRequired - user.gamification.totalXP).toLocaleString()} XP to next level
                      </p>
                    )}
                  </div>
                </div>

                {/* Streak Freeze */}
                <StreakFreeze variant="inline" />

                {/* Active Goals Mini */}
                <div className="glass-card p-4" data-tutorial="goal-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-themed text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-gold-400" />
                      Active Goals
                    </h3>
                    <span className="text-xs text-themed-muted">{activeGoals.length}</span>
                  </div>
                  
                  {activeGoals.length > 0 ? (
                    <div className="space-y-2">
                      {activeGoals.slice(0, 2).map((goal) => (
                        <div key={goal.id} className="p-2 rounded-lg bg-[var(--surface)]">
                          <p className="font-medium text-themed text-xs truncate">{goal.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 rounded-full bg-[var(--border)] overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-ascend-500"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-ascend-500">{goal.progress}%</span>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActiveTab('goals')}
                        className="text-xs text-ascend-500 hover:text-ascend-400 w-full text-center"
                      >
                        View all →
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowGoalWizard(true)}
                      className="w-full text-xs text-ascend-500 hover:text-ascend-400"
                    >
                      Create your first goal →
                    </button>
                  )}
                </div>

                {/* Streak Calendar - Shows last 30 days */}
                <div data-tutorial="progress">
                  <StreakCalendar 
                    currentStreak={user.stats.currentStreak}
                    longestStreak={user.stats.longestStreak}
                  />
                </div>

                {/* Motivational Quote */}
                <div className="glass-card p-4 text-center">
                  <Sparkles className="w-4 h-4 text-gold-400 mx-auto mb-2" />
                  <p className="text-sm text-themed italic">&quot;{quote.quote}&quot;</p>
                  <p className="text-xs text-themed-muted mt-1">— {quote.author}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab - Analytics & Charts */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-themed">Your Progress</h1>
              <p className="text-themed-secondary mt-1">Track your transformation journey</p>
            </div>
            
            <StatsCards />
            
            {/* Contribution Heatmap — GitHub-style activity grid */}
            <ContributionHeatmap />
            
            {/* AI Insights Panel */}
            <AIInsights />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <DailyConsistencyChart />
              <MonthlyCompletionDonut />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <WeeklyBreakdownChart />
              <TopHabitsRanking />
            </div>
          </div>
        )}

        {/* Profile Tab - Settings & Account */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-themed">Profile</h1>
              <p className="text-themed-secondary mt-1">Manage your account and preferences</p>
            </div>
            
            {/* Profile Card */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 
                              flex items-center justify-center text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-themed">{user.name}</h2>
                  <p className="text-themed-muted text-sm">{currentLevel.name} • Level {user.gamification.level}</p>
                  {user.plan !== 'free' && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full 
                                   bg-gradient-to-r from-gold-500 to-yellow-400 text-white text-xs font-medium">
                      <Crown className="w-3 h-3" />
                      {user.plan === 'lifetime' ? 'Lifetime' : 'Pro'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[var(--surface)] text-center">
                  <p className="text-2xl font-bold text-gold-400">{user.gamification.totalXP}</p>
                  <p className="text-xs text-themed-muted">Total XP</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] text-center">
                  <p className="text-2xl font-bold text-ascend-500">{user.stats.currentStreak}</p>
                  <p className="text-xs text-themed-muted">Day Streak</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] text-center">
                  <p className="text-2xl font-bold text-green-400">{habits.length}</p>
                  <p className="text-xs text-themed-muted">Habits</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] text-center">
                  <p className="text-2xl font-bold text-purple-400">{goals.length}</p>
                  <p className="text-xs text-themed-muted">Goals</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 btn-secondary"
                >
                  Settings
                </button>
                {user.plan === 'free' && (
                  <button
                    onClick={() => setShowPaymentCheckout(true)}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>

            {/* Identity System Section */}
            <div className="glass-card p-6">
              <IdentitySystem isOnboarding={false} />
            </div>

            {/* Achievements Preview */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-themed mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {user.gamification.achievements.slice(0, 4).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="p-3 rounded-xl bg-[var(--surface)] text-center"
                    title={achievement.name}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <p className="text-xs text-themed-muted mt-1 truncate">{achievement.name}</p>
                  </div>
                ))}
                {user.gamification.achievements.length === 0 && (
                  <div className="col-span-4 text-center py-6 text-themed-muted">
                    <p>Complete habits to unlock achievements!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Habits Tab */}
        {activeTab === 'habits' && (
          <div className="space-y-6" data-tutorial="habits">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-themed">Habit Tracker</h1>
                <p className="text-themed-secondary mt-1">
                  {new Date(calendar.year, calendar.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setShowAddHabit(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </button>
            </div>
            
            {/* AI Habit Suggestions */}
            <AIHabitSuggestions />
            
            <HabitGrid />
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-themed">Your Goals</h1>
                <p className="text-themed-secondary mt-1">AI-powered goal decomposition</p>
              </div>
              <button
                onClick={() => setShowGoalWizard(true)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Create AI Goal
              </button>
            </div>

            {goals.length > 0 ? (
              <div className="grid gap-6">
                {goals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal}
                    onEditGoal={() => setShowGoalWizard(true)}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ascend-500/20 to-gold-400/20 
                              flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-ascend-500" />
                </div>
                <h3 className="text-xl font-bold text-themed mb-2">No Goals Yet</h3>
                <p className="text-themed-secondary mb-6 max-w-md mx-auto">
                  Let our AI help you break down your ultimate goal into achievable milestones, 
                  weekly objectives, and daily tasks.
                </p>
                <button
                  onClick={() => setShowGoalWizard(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Your First Goal
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6" data-tutorial="calendar">
            {/* Goal Countdown Widget - if there are active goals */}
            {activeGoals.length > 0 && (
              <GoalProgressWidget 
                goal={activeGoals[0]} 
                currentStreak={user.stats.currentStreak}
                longestStreak={user.stats.longestStreak}
                variant="full"
              />
            )}
            <CalendarView />
          </div>
        )}

        {/* Focus Tab - Pomodoro & Timed Tasks */}
        {activeTab === 'focus' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-themed flex items-center gap-2">
                <Timer className="w-6 h-6 text-ascend-500" />
                Focus Mode
              </h1>
              <p className="text-themed-secondary mt-1">Deep work sessions & time-based tasks</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PomodoroTimer />
              <TimedTasks />
            </div>
            
            <div className="glass-card p-6">
              <HabitStacking />
            </div>
          </div>
        )}

        {/* Tasks Tab - TickTick-style checklist */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-themed flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-ascend-500" />
                Tasks
              </h1>
              <p className="text-themed-secondary mt-1">Manage all your tasks with filtering and sorting</p>
            </div>
            
            {/* All Tasks View with Filtering */}
            <div className="glass-card p-4 sm:p-6">
              <AllTasksView />
            </div>
            
            {/* Quick Add Tasks Section */}
            <div className="glass-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-themed mb-4">Quick Add Tasks</h2>
              <TaskList />
            </div>
          </div>
        )}

        {/* Wellness Tab - Mental Health Support */}
        {activeTab === 'wellness' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-themed flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-400" />
                Wellness Center
              </h1>
              <p className="text-themed-secondary mt-1">Track your mood, practice mindfulness, and prioritize your mental health</p>
            </div>
            
            {/* Quick Wellness Widget */}
            <QuickWellnessWidget variant="expanded" />
            
            {/* Full Wellness Center */}
            <WellnessCenter 
              isOpen={true} 
              onClose={() => setActiveTab('today')} 
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onAddClick={() => activeTab === 'habits' ? setShowAddHabit(true) : setShowGoalWizard(true)}
      />

      {/* Modals */}
      <GoalWizard isOpen={showGoalWizard} onClose={() => setShowGoalWizard(false)} />
      <AddHabitModal isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <WeeklyReview isOpen={showWeeklyReview} onClose={() => setShowWeeklyReview(false)} />
      
      {/* Global Search */}
      <GlobalSearch 
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onNavigate={(tab) => setActiveTab(tab as Tab)}
      />
      
      {/* Template Library */}
      <TemplateLibrary 
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
      />
      <PaymentCheckout 
        isOpen={showPaymentCheckout} 
        onClose={() => setShowPaymentCheckout(false)} 
      />
      
      {showLevelUp && levelUpInfo && (
        <LevelUpModal 
          level={levelUpInfo.level} 
          levelName={levelUpInfo.name} 
          onClose={() => setShowLevelUp(false)} 
        />
      )}
      
      {showStreakCelebration && user.stats.currentStreak > 0 && (
        <StreakCelebration 
          streak={user.stats.currentStreak} 
          onClose={() => setShowStreakCelebration(false)} 
        />
      )}

      {/* Quick Add Overlay */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickAdd(false)}
          />
          <div className="relative w-full max-w-xl mx-4">
            <QuickAdd 
              autoFocus 
              placeholder="Quick add task... (e.g., 'call mom tomorrow at 3pm')"
              onTaskAdded={() => setShowQuickAdd(false)}
            />
            <p className="text-center text-xs text-themed-muted mt-3">
              Press <kbd className="px-1.5 py-0.5 bg-[var(--card)] rounded text-themed-secondary">Esc</kbd> to close
              {' • '}
              <kbd className="px-1.5 py-0.5 bg-[var(--card)] rounded text-themed-secondary">Ctrl+K</kbd> to toggle
            </p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast />

      {/* Floating Breathe Button - Quick Wellness Access */}
      {activeTab !== 'wellness' && <FloatingBreatheButton />}

      {/* Floating Action Button - Upgrade (for free users) */}
      {user.plan === 'free' && (
        <button
          onClick={() => setShowPaymentCheckout(true)}
          className="fixed bottom-24 md:bottom-6 right-4 z-40 p-3 bg-gradient-to-r from-gold-400 to-gold-500 
                   text-white rounded-full shadow-glow-lg hover:shadow-glow-xl transition-all
                   flex items-center gap-2 group"
          title="Upgrade to Pro"
          aria-label="Upgrade to Pro"
        >
          <Crown className="w-5 h-5" />
          <span className="hidden group-hover:inline text-sm font-semibold pr-1">Upgrade</span>
        </button>
      )}

      {/* Keyboard shortcuts hint - desktop only */}
      <div className="hidden md:block fixed bottom-4 left-4 text-xs text-themed-muted opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <Command className="w-3 h-3" />
          <span>+K Quick Add</span>
          <span className="mx-1">•</span>
          <span>+G Goal</span>
          <span className="mx-1">•</span>
          <span>+H Habit</span>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Screen reader live region for tab changes */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {`Now viewing ${activeTab} tab`}
      </div>

      {/* Demo Plan Generator - shows after onboarding */}
      {(showDemoPlan || isFirstVisit) && (
        <DemoPlanGenerator
          onStartDay1={() => {
            setShowDemoPlan(false);
            localStorage.setItem('ascend-demo-plan-seen', 'true');
            setActiveTab('today');
          }}
          onViewFullPlan={() => {
            setShowDemoPlan(false);
            localStorage.setItem('ascend-demo-plan-seen', 'true');
            setActiveTab('goals');
          }}
          onClose={() => {
            setShowDemoPlan(false);
            localStorage.setItem('ascend-demo-plan-seen', 'true');
          }}
        />
      )}

      {/* Data Backup Reminder */}
      {showBackupReminder && (
        <DataBackupReminder
          onExport={() => {
            exportAllData();
            setShowBackupReminder(false);
          }}
          totalHabits={habits.length}
          totalGoals={goals.length}
          daysActive={user.stats.totalDaysActive}
        />
      )}
    </div>
    </AnnouncerProvider>
  );
}
