
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component now simply redirects to the home page.
export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  // Render a simple loading state while redirecting.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-foreground">Loading KrishiMitra...</p>
    </div>
  );
}
