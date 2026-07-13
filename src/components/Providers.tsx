'use client';

import { AppProvider } from '@/context/DataContext';
import { PipelineProvider } from '@/context/PipelineContext';
import PWAProvider from './PWAProvider';
import NotificationProvider from './NotificationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <PipelineProvider>
        <PWAProvider />
        <NotificationProvider />
        {children}
      </PipelineProvider>
    </AppProvider>
  );
}
