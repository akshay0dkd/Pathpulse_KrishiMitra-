import { getInitialGreeting } from '@/app/actions';
import { Logo } from '@/components/icons';
import { Bug, CloudSun, Landmark } from 'lucide-react';
import { ChatLoader } from '@/components/chat-loader';

export default async function Home() {
  const initialGreeting = await getInitialGreeting();

  const initialMessage = {
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
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatLoader initialMessage={initialMessage} />
      </main>
    </div>
  );
}
