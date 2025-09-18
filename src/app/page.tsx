'use client';

import { ChatLoader } from '@/components/chat-loader';
import { Logo } from '@/components/icons';
import { Bug, CloudSun, Landmark, ShieldQuestion } from 'lucide-react';
import type { Message } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const initialGreeting = `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്. രോഗങ്ങൾ, കീടങ്ങൾ, എരുക്കൾ, കാലാവസ്ഥ എന്നിവയെപ്പറ്റി എന്ത് പ്രശ്നമാണോ അത് ചോദിക്കാം. ഒരു ഫോട്ടോയുടെ വിവരം നൽകാനും കഴിയും.\n\nHello! I am KrishiMitra, your digital farming assistant. You can ask me about crop problems, pests, fertilizers, or weather. You can also describe a problem with your plant.\n\nWhat is your question today?`;

  const initialMessage: Message = {
    id: 'init',
    role: 'assistant' as const,
    content: initialGreeting,
  };

  return (
    <div className="flex h-full flex-col">
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
            <Bug className="h-5 w-5" />
            <span>Pests & Diseases</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            <span>Weather</span>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <span>Govt. Schemes</span>
          </div>
        </div>
         <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <ShieldQuestion className="h-4 w-4 mr-2" />
            Officer Dashboard
          </Link>
        </Button>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatLoader initialMessage={initialMessage} />
      </main>
    </div>
  );
}