'use client';

import { ChatLoader } from '@/components/chat-loader';
import { Logo } from '@/components/icons';
import { Bug, CloudSun, Landmark, ShieldQuestion, Globe, Menu, ArrowLeft } from 'lucide-react';
import type { Message } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WeatherForecast } from '@/components/weather-forecast';
import type { GiveWeatherBasedAdviceOutput } from '@/ai/types/give-weather-based-advice';
import { getWeatherForecast } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/bottom-nav';

const GREETINGS: Record<string, string> = {
  'ml-IN': `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്. രോഗങ്ങൾ, കീടങ്ങൾ, എരുക്കൾ, കാലാവസ്ഥ എന്നിവയെപ്പറ്റി എന്ത് പ്രശ്നമാണോ അത് ചോദിക്കാം.\n\n(English): Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop problems, pests, fertilizers, or weather.`,
  'en-IN': `Hello! I am KrishiMitra, your digital farming assistant. You can ask me about crop diseases, pests, fertilizers, or weather.`,
  'hi-IN': `नमस्ते! मैं कृषि मित्र, आपका डिजिटल खेती सहायक हूँ। आप मुझसे फसल के रोग, कीट, उर्वरक, या मौसम के बारे में पूछ सकते हैं।`,
  'mr-IN': `नमस्कार! मी कृषी मित्र, तुमचा डिजिटल शेती सहाय्यक आहे. तुम्ही मला पिकांचे आजार, कीटक, खते किंवा हवामानाबद्दल विचारू शकता.`,
};

const getLanguageName = (langCode: string) => {
  try {
    const language = langCode.split('-')[0];
    if (language === 'ml') return 'മലയാളം';
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(language) || 'Language';
  } catch (e) {
    return 'Language';
  }
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [language, setLanguage] = useState('en-IN');
  const [isWeatherDialogOpen, setWeatherDialogOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<GiveWeatherBasedAdviceOutput | null>(null);
  const [isWeatherLoading, setWeatherLoading] = useState(false);

  const chatLoaderRef = useRef<{
    triggerAction: (action: 'schemes' | 'pests' | 'weather', lang: string, query?: string) => void;
    resetChat: (newMessage: Message) => void;
    toggleVoiceMode: () => void;
    openCameraDialog: () => void;
  } | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('krishimitra-lang') || 'en-IN';
    setLanguage(savedLang);

     const quickQuery = searchParams.get('q');
     const action = searchParams.get('action');

     if (chatLoaderRef.current) {
        // Use a timeout to ensure the component is fully ready
        setTimeout(() => {
            if (quickQuery) {
                chatLoaderRef.current?.triggerAction('pests', language, quickQuery);
            }
            if (action === 'voice') {
                chatLoaderRef.current?.toggleVoiceMode();
            }
            if (action === 'camera') {
                chatLoaderRef.current?.openCameraDialog();
            }
            // Optional: remove query param from URL without reloading
            router.replace('/chat', undefined);
        }, 100);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const initialMessage = useMemo<Message>(() => {
    return {
      id: 'init',
      role: 'assistant' as const,
      content: GREETINGS[language] || GREETINGS['en-IN'],
    };
  }, [language]);
  
  const handleSchemesClick = () => {
    chatLoaderRef.current?.triggerAction('schemes', language);
  };
  
    const handlePestsClick = () => {
    chatLoaderRef.current?.triggerAction('pests', language);
  };

  const handleWeatherClick = () => {
    setWeatherDialogOpen(true);
    setWeatherLoading(true);

    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: 'Geolocation is not supported by your browser.',
      });
      setWeatherLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const data = await getWeatherForecast(language, latitude, longitude);
        setWeatherData(data);
        setWeatherLoading(false);
      },
      () => {
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Unable to retrieve your location. Please enable location permissions.',
        });
        setWeatherLoading(false);
         setWeatherData({
            location: 'Permission Denied',
            temperature: '-',
            condition: 'Please enable location permissions in your browser to see the weather forecast.',
            conditionIcon: 'Cloudy',
            advice: [],
            sprayingAdvice: '',
            daily: [],
        });
      }
    );
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('krishimitra-lang', lang);
    const newInitialMessage: Message = {
      id: 'init-lang-change',
      role: 'assistant',
      content: GREETINGS[lang] || GREETINGS['en-IN'],
    }
    chatLoaderRef.current?.resetChat(newInitialMessage);
    // If weather dialog is open, refresh the data with the new language
    if (isWeatherDialogOpen) {
      handleWeatherClick();
    }
  };

  const QuickActions = () => {
    const actionPrompts = {
      pests: {
        'en-IN': 'My leaves have yellow spots. What could it be?',
        'ml-IN': 'എന്റെ ഇലകളിൽ മഞ്ഞ പാടുകൾ ഉണ്ട്. അതെന്തായിരിക്കും?',
        'hi-IN': 'मेरी पत्तियों पर पीले धब्बे हैं। यह क्या हो सकता है?',
        'mr-IN': 'माझ्या पानांवर पिवळे डाग आहेत. ते काय असू शकते?',
      },
      schemes: {
        'en-IN': 'What government schemes can I apply for?',
        'ml-IN': 'എനിക്ക് അപേക്ഷിക്കാൻ കഴിയുന്ന സർക്കാർ പദ്ധതികൾ ഏതൊക്കെയാണ്?',
        'hi-IN': 'मैं किन सरकारी योजनाओं के लिए आवेदन कर सकता हूँ?',
        'mr-IN': 'मी कोणत्या सरकारी योजनांसाठी अर्ज करू शकतो?',
      },
    };
    
    const onPestClick = () => {
        chatLoaderRef.current?.triggerAction('pests', language, actionPrompts.pests[language as keyof typeof actionPrompts.pests]);
    }
    const onSchemeClick = () => {
        chatLoaderRef.current?.triggerAction('schemes', language, actionPrompts.schemes[language as keyof typeof actionPrompts.schemes]);
    }

    const buttonClass = "text-muted-foreground";

    return (
        <>
            <Button variant={'ghost'} size={'sm'} onClick={onPestClick} className={buttonClass}>
              <Bug className="h-5 w-5 text-primary/80" />
              <span className="text-sm">{language === 'ml-IN' ? 'കീടങ്ങളും രോഗങ്ങളും' : 'Pests & Diseases'}</span>
            </Button>
            <Button variant={'ghost'} size={'sm'} onClick={handleWeatherClick} className={buttonClass}>
              <CloudSun className="h-5 w-5 text-primary/80" />
              <span className="text-sm">{language === 'ml-IN' ? 'കാലാവസ്ഥ' : 'Weather'}</span>
            </Button>
            <Button variant={'ghost'} size={'sm'} onClick={onSchemeClick} className={buttonClass}>
              <Landmark className="h-5 w-5 text-primary/80" />
              <span className="text-sm">{language === 'ml-IN' ? 'സർക്കാർ പദ്ധതികൾ' : 'Govt. Schemes'}</span>
            </Button>
        </>
    )
  }

  return (
    <>
      <Dialog open={isWeatherDialogOpen} onOpenChange={setWeatherDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Weather & Farming Advice</DialogTitle>
            <DialogDescription>
              Live weather data for your current location.
            </DialogDescription>
          </DialogHeader>
          <WeatherForecast data={weatherData} isLoading={isWeatherLoading} />
        </DialogContent>
      </Dialog>

      <div className="flex h-full flex-col bg-muted/20 pb-16 md:pb-0">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" asChild className="md:hidden">
               <Link href="/home">
                 <ArrowLeft className="h-6 w-6 text-muted-foreground" />
               </Link>
             </Button>
             <Button variant="outline" size="sm" asChild className="hidden md:flex">
                <Link href="/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
             </Button>
            <h1 className="text-lg font-headline font-semibold text-foreground">
               KrishiMitra AI Chat
            </h1>
          </div>

          <div className="flex items-center gap-4">
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
                  <DropdownMenuItem onClick={() => handleLanguageChange('hi-IN')}>हिंदी (Hindi)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('mr-IN')}>मराठी (Marathi)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <ShieldQuestion className="h-4 w-4 mr-2" />
                  Officer View
                </Link>
              </Button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatLoader 
            initialMessage={initialMessage} 
            ref={chatLoaderRef} 
            language={language}
            onWeatherClick={handleWeatherClick}
            quickActions={<QuickActions />}
            />
        </main>
        <div className="hidden md:block">
            {/* No bottom nav on desktop */}
        </div>
        <BottomNav />

      </div>
    </>
  );
}
