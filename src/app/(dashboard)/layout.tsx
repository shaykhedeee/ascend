'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Dashboard Layout (Protected)
// Sidebar + top-bar shell for all authenticated routes
// ═══════════════════════════════════════════════════════════════════════════════

import { useStoreUser } from '@/hooks/useStoreUser';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Sparkles,
  Timer,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Calendar,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Today', icon: LayoutDashboard, color: 'text-ascend-500' },
  { href: '/goals', label: 'Goals', icon: Target, color: 'text-yellow-400' },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare, color: 'text-blue-400' },
  { href: '/habits', label: 'Habits', icon: Sparkles, color: 'text-purple-400' },
  { href: '/focus', label: 'Focus', icon: Timer, color: 'text-orange-400' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, color: 'text-green-400' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, color: 'text-pink-400' },
  { href: '/wellness', label: 'Wellness', icon: Heart, color: 'text-rose-400' },
];

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings, color: 'text-[var(--text-secondary)]' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useStoreUser();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user && !user.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ascend-500 border-t-transparent" />
          <p className="text-sm text-[var(--text-secondary)]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--text-secondary)]">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--background-secondary)] transition-all duration-300',
          collapsed ? 'w-16' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-ascend-500" />
              <span className="text-lg font-bold text-[var(--text-primary)]">Ascendify</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <Flame className="h-6 w-6 text-ascend-500" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--surface)] md:block"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--surface)] md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-ascend-500/10 text-ascend-500'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-ascend-500' : item.color)} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[var(--border)] py-4 px-2 space-y-1">
          {BOTTOM_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ascend-500/10 text-ascend-500'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className={cn('flex items-center gap-3 px-3 py-2', collapsed && 'justify-center')}>
            <UserButton afterSignOutUrl="/" />
            {!collapsed && user && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                <p className="truncate text-xs text-[var(--text-secondary)]">
                  {user.plan === 'free' ? 'Free Plan' : 'Pro'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 transition-all duration-300', collapsed ? 'md:ml-16' : 'md:ml-60')}>
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-sm md:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-1 text-[var(--text-secondary)]">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-ascend-500" />
            <span className="font-bold text-[var(--text-primary)]">Ascendify</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
