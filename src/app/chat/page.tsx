'use client';

import { ChatLoader } from '@/components/chat-loader';
import { Logo } from '@/components/icons';
import { Bug, CloudSun, Landmark, ShieldQuestion, LogOut, Globe, Menu } from 'lucide-react';
import type { Message } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WeatherForecast } from '@/components/weather-forecast';
import type { GiveWeatherBasedAdviceOutput } from '@/ai/types/give-weather-based-advice';
import { getWeatherForecast } from '@/app/actions';

const GREETINGS: Record<string, string> = {
  'ml-IN': `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്. രോഗങ്ങൾ, കീടങ്ങൾ, എരുക്കൾ, കാലാവസ്ഥ എന്നിവയെപ്പറ്റി എന്ത് പ്രശ്നമാണോ അത് ചോദിക്കാം.\n\n(English): Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop problems, pests, fertilizers, or weather.`,
  'en-IN': `Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop diseases, pests, fertilizers, or weather.`,
  'hi-IN': `नमस्ते! मैं कृषि मित्र, आपका डिजिटल खेती सहायक हूँ। आप मुझसे फसल के रोग, कीट, उर्वरक, या मौसम के बारे में पूछ सकते हैं।`,
  'mr-IN': `नमस्कार! मी कृषी मित्र, तुमचा डिजिटल शेती सहाय्यक आहे. तुम्ही मला पिकांचे आजार, कीटक, खते किंवा हवामानाबद्दल विचारू शकता.`,
};

const getLanguageName = (langCode: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode.split('-')[0]) || 'Language';
  } catch (e) {
    return 'Language';
  }
}

export default function ChatPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en-IN');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWeatherDialogOpen, setWeatherDialogOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<GiveWeatherBasedAdviceOutput | null>(null);
  const [isWeatherLoading, setWeatherLoading] = useState(false);

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
    triggerAction: (action: 'schemes', lang: string) => void;
    resetChat: (newMessage: Message) => void;
  } | null>(null);
  
  const handleSchemesClick = () => {
    chatLoaderRef.current?.triggerAction('schemes', language);
    setMobileMenuOpen(false);
  };
  
  const handleWeatherClick = async () => {
    setWeatherDialogOpen(true);
    setWeatherLoading(true);
    const data = await getWeatherForecast(language);
    setWeatherData(data);
    setWeatherLoading(false);
    setMobileMenuOpen(false);
  }

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
    setMobileMenuOpen(false);
  };
  
  if (isAuthenticated === null) {
     return (
       <div className="flex h-full items-center justify-center bg-muted/20">
         <p>Authenticating...</p>
       </div>
     );
  }

  const QuickActions = () => (
    <>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bug className="h-5 w-5 text-primary/80" />
          <span className="text-sm">Pests & Diseases</span>
        </div>
        <button onClick={handleWeatherClick} className="flex items-center gap-2 hover:text-foreground transition-colors text-muted-foreground">
          <CloudSun className="h-5 w-5 text-primary/80" />
          <span className="text-sm">Weather</span>
        </button>
        <button onClick={handleSchemesClick} className="flex items-center gap-2 hover:text-foreground transition-colors text-muted-foreground">
          <Landmark className="h-5 w-5 text-primary/80" />
          <span className="text-sm">Govt. Schemes</span>
        </button>
    </>
  )

  return (
    <>
      <Dialog open={isWeatherDialogOpen} onOpenChange={setWeatherDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Weather Forecast</DialogTitle>
          </DialogHeader>
          <WeatherForecast data={weatherData} isLoading={isWeatherLoading} />
        </DialogContent>
      </Dialog>

      <div className="flex h-full flex-col bg-muted/20">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
               <Logo className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-lg font-headline font-semibold text-foreground">
               KrishiMitra AI
            </h1>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <QuickActions />
          </div>
          <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{getLanguageName(language)}</span>
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
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 py-6">
                  <div className="flex flex-col space-y-4 pl-2">
                      <h3 className="font-semibold text-muted-foreground text-sm">Quick Actions</h3>
                      <QuickActions/>
                  </div>
                  
                  <hr/>

                  <h3 className="font-semibold text-muted-foreground text-sm pl-2">Language</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        <span>{getLanguageName(language)}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => handleLanguageChange('en-IN')}>English</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange('ml-IN')}>മലയാളം (Malayalam)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange('hi-IN')}>हिन्दी (Hindi)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange('mr-IN')}>मराठी (Marathi)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <hr/>

                  <Button asChild variant="outline">
                    <Link href="/dashboard">
                      <ShieldQuestion className="h-4 w-4 mr-2" />
                      Officer View
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatLoader initialMessage={initialMessage} ref={chatLoaderRef} language={language} />
        </main>
      </div>
    </>
  );
}
