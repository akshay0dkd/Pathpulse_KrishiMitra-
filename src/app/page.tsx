'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './login/page';
import { Skeleton } from '@/components/ui/skeleton';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('krishimitra-auth') === 'true';
    setIsAuthenticated(authStatus);
    if (authStatus) {
      router.replace('/home');
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-12 w-full max-w-sm" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // This part will only be visible for a fraction of a second during redirection
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-foreground">Loading your experience...</p>
    </div>
  );
}
