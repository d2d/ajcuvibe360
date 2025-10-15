'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AutoRefreshProps {
  intervalSeconds?: number;
}

export function AutoRefresh({ intervalSeconds = 30 }: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [router, intervalSeconds]);

  return null;
}
