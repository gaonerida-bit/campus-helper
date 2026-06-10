'use client';

import { AppProvider } from '@/context/DataContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
