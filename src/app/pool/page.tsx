'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PoolRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/applications');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[var(--foreground-muted)]">跳转到投递管理...</p>
    </div>
  );
}
