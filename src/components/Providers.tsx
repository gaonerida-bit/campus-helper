'use client';

import { AppProvider } from '@/context/DataContext';
import PWAProvider from './PWAProvider';
import NotificationProvider from './NotificationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <PWAProvider />
      <NotificationProvider />
      {children}
    </AppProvider>
  );
}
