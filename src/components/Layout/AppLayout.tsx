'use client';

import Navigation from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
