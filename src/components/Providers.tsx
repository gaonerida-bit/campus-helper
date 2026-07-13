'use client';

import { AppProvider } from '@/context/DataContext';
import { PipelineProvider } from '@/context/PipelineContext';
import { ToastProvider } from './UI/Toast';
import PWAProvider from './PWAProvider';
import NotificationProvider from './NotificationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <PipelineProvider>
        <ToastProvider>
          <PWAProvider />
          <NotificationProvider />
          {children}
        </ToastProvider>
      </PipelineProvider>
    </AppProvider>
  );
}
