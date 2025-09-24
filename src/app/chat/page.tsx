'use client';

import { ChatLoader } from '@/components/chat-loader';
import { Logo } from '@/components/icons';
import { Bug, CloudSun, Landmark, ShieldQuestion, LogOut, Globe } from 'lucide-react';
import type { Message } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const GREETINGS: Record<string, string> = {
  'ml-IN': `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്. രോഗങ്ങൾ, കീടങ്ങൾ, എരുക്കൾ, കാലാവസ്ഥ എന്നിവയെപ്പറ്റി എന്ത് പ്രശ്നമാണോ അത് ചോദിക്കാം.\n\n(English): Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop problems, pests, fertilizers, or weather.`,
  'en-IN': `Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop diseases, pests, fertilizers, or weather.`,
  'hi-IN': `नमस्ते! मैं कृषि मित्र, आपका डिजिटल खेती सहायक हूँ। आप मुझसे फसल के रोग, कीट, उर्वरक, या मौसम के बारे में पूछ सकते हैं।`,
  'mr-IN': `नमस्कार! मी कृषी मित्र, तुमचा डिजिटल शेती सहाय्यक आहे. तुम्ही मला पिकांचे आजार, कीटक, खते किंवा हवामानाबद्दल विचारू शकता.`,
};

export default function ChatPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en-IN'); // Default to English
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('krishimitra-auth') === 'true';
    setIsAuthenticated(auth);
    if (!auth) {
      router.replace('/login');
    }
    const savedLang = localStorage.getItem('krishimitra-lang') || 'en-IN';
    setLanguage(savedLang);
  }, [router]);

  const initialMessage = useMemo<Message>(() => {
    return {
      id: 'init',
      role: 'assistant' as const,
      content: GREETINGS[language] || GREETINGS['en-IN'],
    };
  }, [language]);


  const chatLoaderRef = React.useRef<{
    triggerAction: (action: 'weather' | 'schemes', lang: string) => void;
    resetChat: (newMessage: Message) => void;
  } | null>(null);

  const handleWeatherClick = () => {
    chatLoaderRef.current?.triggerAction('weather', language);
  };
  
  const handleSchemesClick = () => {
    chatLoaderRef.current?.triggerAction('schemes', language);
  };

  const handleLogout = () => {
    localStorage.removeItem('krishimitra-auth');
    localStorage.removeItem('krishimitra-lang');
    router.replace('/login');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('krishimitra-lang', lang);
    const newInitialMessage: Message = {
      id: 'init-lang-change',
      role: 'assistant',
      content: GREETINGS[lang] || GREETINGS['en-IN'],
    }
    chatLoaderRef.current?.resetChat(newInitialMessage);
  };
  
  if (!isAuthenticated) {
     return (
       <div className="flex h-full items-center justify-center bg-muted/20">
         <p>Authenticating...</p>
       </div>
     );
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
             <Logo className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-lg font-headline font-semibold text-foreground">
             Digital AI Assistant
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
         <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{new Intl.DisplayNames(['en'], { type: 'language' }).of(language.split('-')[0])}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleLanguageChange('en-IN')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('ml-IN')}>മലയാളം (Malayalam)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('hi-IN')}>हिन्दी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('mr-IN')}>मराठी (Marathi)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <ChatLoader initialMessage={initialMessage} ref={chatLoaderRef} language={language} />
      </main>
    </div>
  );
}
