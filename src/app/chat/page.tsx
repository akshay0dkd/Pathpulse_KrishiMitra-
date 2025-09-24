'use client';

import { ChatLoader } from '@/components/chat-loader';
import { Logo } from '@/components/icons';
import { Bug, CloudSun, Landmark, ShieldQuestion, LogOut } from 'lucide-react';
import type { Message } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('krishimitra-auth') === 'true';
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  const initialGreeting = `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്. രോഗങ്ങൾ, കീടങ്ങൾ, എരുക്കൾ, കാലാവസ്ഥ എന്നിവയെപ്പറ്റി എന്ത് പ്രശ്നമാണോ അത് ചോദിക്കാം. ഒരു ഫോട്ടോയുടെ വിവരം നൽകാനും കഴിയും.\n\n(English): Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop problems, pests, fertilizers, or weather. You can also describe a problem with your plant.`;

  const initialMessage: Message = {
    id: 'init',
    role: 'assistant' as const,
    content: initialGreeting,
  };

  const chatLoaderRef = React.useRef<{
    triggerAction: (action: 'weather' | 'schemes') => void;
  } | null>(null);

  const handleWeatherClick = () => {
    chatLoaderRef.current?.triggerAction('weather');
  };
  
  const handleSchemesClick = () => {
    chatLoaderRef.current?.triggerAction('schemes');
  };

  const handleLogout = () => {
    localStorage.removeItem('krishimitra-auth');
    router.replace('/login');
  };

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
             <Logo className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-lg font-headline font-semibold text-foreground">
            KrishiMitra Digital Assistant
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary/80" />
            <span>Pests &amp; Diseases | കീടങ്ങളും രോഗങ്ങളും</span>
          </div>
          <button onClick={handleWeatherClick} className="flex items-center gap-2 hover:text-foreground transition-colors">
            <CloudSun className="h-5 w-5 text-primary/80" />
            <span>Weather | കാലാവസ്ഥ</span>
          </button>
          <button onClick={handleSchemesClick} className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Landmark className="h-5 w-5 text-primary/80" />
            <span>Govt. Schemes | പദ്ധതികൾ</span>
          </button>
        </div>
         <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <ShieldQuestion className="h-4 w-4 mr-2" />
                Officer View
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatLoader initialMessage={initialMessage} ref={chatLoaderRef} />
      </main>
    </div>
  );
}
