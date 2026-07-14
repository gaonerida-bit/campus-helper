'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useSyncStatus, SyncStatus } from '@/context/DataContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

function SyncStatusIndicator() {
  const syncStatus = useSyncStatus();

  if (syncStatus === 'idle') return null;

  const configs: Record<Exclude<SyncStatus, 'idle'>, { dot: string; text: string }> = {
    saving: { dot: 'bg-blue-400', text: '已保存到本地' },
    syncing: { dot: 'bg-yellow-400 animate-pulse', text: '同步中...' },
    synced: { dot: 'bg-[var(--success)]', text: '已同步' },
    error: { dot: 'bg-red-400', text: '同步失败' },
  };

  const config = configs[syncStatus as Exclude<SyncStatus, 'idle'>];
  if (!config) return null;

  return (
    <div className="fixed top-3 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm text-xs text-[var(--foreground-muted)] pointer-events-none select-none">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      <span>{config.text}</span>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className={`flex-1 flex flex-col overflow-hidden ${isMobile ? 'pt-0' : ''}`}>
        {children}
      </main>
      <SyncStatusIndicator />
    </div>
  );
}
