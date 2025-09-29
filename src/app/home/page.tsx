'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Camera, Tag, Cloud, AlertTriangle, CloudDrizzle, TrendingUp, User, Globe, Landmark, ShieldQuestion } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { BottomNav } from '@/components/bottom-nav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { WeatherForecast } from '@/components/weather-forecast';
import type { GiveWeatherBasedAdviceOutput } from '@/ai/types/give-weather-based-advice';
import { getWeatherForecast } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


const content = {
  'en-IN': {
    greeting: 'Hello',
    welcome: 'Welcome!',
    checkIn: 'Thrissur',
    weatherCondition: 'Cloudy',
    voiceQueryTitle: 'Ask with Voice',
    voiceQuerySubtitle: 'Press & speak your problem',
    photoDiagnosisTitle: 'Diagnose by Photo',
    photoDiagnosisSubtitle: 'Click picture of crop issue',
    marketPricesTitle: 'Check Prices',
    marketPricesSubtitle: 'Check current crop prices',
    weatherAlertTitle: 'Weather & Advice',
    weatherAlertSubtitle: 'Live forecast & warnings',
    govtSchemesTitle: 'Govt. Schemes',
    govtSchemesSubtitle: 'View available subsidies',
    activeAlerts: 'Active Alerts',
    pestAlertTitle: 'High Pest Infestation Risk',
    pestAlertSubtitle: 'Urgent: Pest Outbreak Alert for your region.',
    rainAlertTitle: 'Intermittent Rain Likely',
    rainAlertSubtitle: 'Warning: Intermittent rain expected today.',
    priceAlertTitle: 'Nendran Banana Prices are Up',
    priceAlertSubtitle: 'Price Alert: Nendran banana prices are up.',
    quickChat: 'Quick Chat',
    continueChat: 'Continue recent conversation: Brown spots on banana leaves...',
    continueChatLink: 'Continue recent conversation →',
    quickQuestion1: 'What medicine for my field?',
    quickQuestion2: 'What is today\'s price?',
    quickQuestion3: 'Will it rain?',
    profile: 'Profile',
    officerView: 'Officer View',
    languages: {
      'en-IN': 'English',
      'ml-IN': 'മലയാളം (Malayalam)',
      'hi-IN': 'हिंदी (Hindi)',
      'mr-IN': 'मराठी (Marathi)',
    }
  },
  'ml-IN': {
    greeting: 'നമസ്കാരം',
    welcome: 'കൃഷിമിത്രം',
    checkIn: 'തൃശൂർ',
    weatherCondition: 'മേഘാവൃതം',
    voiceQueryTitle: 'ശബ്ദത്തിൽ ചോദിക്കുക',
    voiceQuerySubtitle: 'Press & speak your problem',
    photoDiagnosisTitle: 'ഫോട്ടോ എടുത്ത് രോഗം നിർണയിക്കുക',
    photoDiagnosisSubtitle: 'Click picture of crop issue',
    marketPricesTitle: 'വിലകൾ പരിശോധിക്കുക',
    marketPricesSubtitle: 'Check current crop prices',
    weatherAlertTitle: 'കാലാവസ്ഥ & ഉപദേശം',
    weatherAlertSubtitle: 'Live forecast & warnings',
    govtSchemesTitle: 'സർക്കാർ പദ്ധതികൾ',
    govtSchemesSubtitle: 'View available subsidies',
    activeAlerts: 'Active Alerts',
    pestAlertTitle: 'കനത്ത കീടബാധ സാധ്യത',
    pestAlertSubtitle: 'Urgent: Pest Outbreak Alert for your region.',
    rainAlertTitle: 'ഇടവിട്ടുള്ള മഴയ്ക്ക് സാധ്യത',
    rainAlertSubtitle: 'Warning: Intermittent rain expected today.',
    priceAlertTitle: 'നേന്ത്രക്കായ വില ഉയരുന്നു',
    priceAlertSubtitle: 'Price Alert: Nendran banana prices are up.',
    quickChat: 'Quick Chat',
    continueChat: 'തുടരുക: വാഴയിലെ തവിട്ടുപുള്ളികൾക്ക്...',
    continueChatLink: 'സംഭാഷണം തുടരുക →',
    quickQuestion1: 'എന്റെ പാടത്തിന് എന്ത് മരുന്ന്?',
    quickQuestion2: 'ഇന്നത്തെ വില എന്താണ്?',
    quickQuestion3: 'മഴയുണ്ടാകുമോ?',
    profile: 'പ്രൊഫൈൽ',
    officerView: 'ഓഫീസർ വ്യൂ',
    languages: {
      'en-IN': 'English',
      'ml-IN': 'മലയാളം',
      'hi-IN': 'हिंदी',
      'mr-IN': 'मराठी',
    }
  },
  'hi-IN': {
    greeting: 'नमस्ते',
    welcome: 'कृषि मित्र',
    checkIn: 'त्रिशूर',
    weatherCondition: 'बादल छाए रहेंगे',
    voiceQueryTitle: 'आवाज से पूछें',
    voiceQuerySubtitle: 'समस्या बोलें',
    photoDiagnosisTitle: 'फोटो से निदान करें',
    photoDiagnosisSubtitle: 'फसल की तस्वीर क्लिक करें',
    marketPricesTitle: 'कीमतें जांचें',
    marketPricesSubtitle: 'फसल की कीमतें देखें',
    weatherAlertTitle: 'मौसम और सलाह',
    weatherAlertSubtitle: 'लाइव पूर्वानुमान और चेतावनी',
    govtSchemesTitle: 'सरकारी योजनाएं',
    govtSchemesSubtitle: 'उपलब्ध सब्सिडी देखें',
    activeAlerts: 'सक्रिय अलर्ट',
    pestAlertTitle: 'कीट संक्रमण का खतरा',
    pestAlertSubtitle: 'तत्काल: आपके क्षेत्र के लिए कीट प्रकोप अलर्ट।',
    rainAlertTitle: 'रुक-रुक कर बारिश की संभावना',
    rainAlertSubtitle: 'चेतावनी: आज रुक-रुक कर बारिश की उम्मीद है।',
    priceAlertTitle: 'नेंद्रन केले की कीमतें बढ़ीं',
    priceAlertSubtitle: 'मूल्य चेतावनी: नेंद्रन केले की कीमतें बढ़ गई हैं।',
    quickChat: 'त्वरित चैट',
    continueChat: 'जारी रखें: केले के पत्तों पर भूरे धब्बे...',
    continueChatLink: 'बातचीत जारी रखें →',
    quickQuestion1: 'मेरे खेत के लिए क्या दवा है?',
    quickQuestion2: 'आज का भाव क्या है?',
    quickQuestion3: 'क्या बारिश होगी?',
    profile: 'प्रोफ़ाइल',
    officerView: 'ऑफिसर व्यू',
    languages: {
      'en-IN': 'English',
      'ml-IN': 'मलयालम',
      'hi-IN': 'हिंदी',
      'mr-IN': 'मराठी',
    }
  },
  'mr-IN': {
    greeting: 'नमस्कार',
    welcome: 'कृषी मित्र',
    checkIn: 'त्रिशूर',
    weatherCondition: 'ढगाळ',
    voiceQueryTitle: 'आवाजात विचारा',
    voiceQuerySubtitle: 'समस्या बोला',
    photoDiagnosisTitle: 'फोटोद्वारे निदान करा',
    photoDiagnosisSubtitle: 'पिकाच्या समस्येचे चित्र घ्या',
    marketPricesTitle: 'भाव तपासा',
    marketPricesSubtitle: 'सध्याचे पिकांचे भाव तपासा',
    weatherAlertTitle: 'हवामान आणि सल्ला',
    weatherAlertSubtitle: 'थेट अंदाज आणि इशारे',
    govtSchemesTitle: 'सरकारी योजना',
    govtSchemesSubtitle: 'उपलब्ध अनुदान पहा',
    activeAlerts: 'सक्रिय सूचना',
    pestAlertTitle: 'तीव्र कीड प्रादुर्भावाची शक्यता',
    pestAlertSubtitle: 'तातडीचे: तुमच्या क्षेत्रासाठी कीड प्रादुर्भावाची सूचना.',
    rainAlertTitle: 'अधूनमधून पावसाची शक्यता',
    rainAlertSubtitle: 'चेतावणी: आज अधूनमधून पावसाची शक्यता आहे.',
    priceAlertTitle: 'नेंद्रन केळीचे भाव वाढले',
    priceAlertSubtitle: 'भाव सूचना: नेंद्रन केळीचे भाव वाढले आहेत.',
    quickChat: 'त्वरित गप्पा',
    continueChat: 'सुरू ठेवा: केळीच्या पानांवरील तपकिरी ठिपके...',
    continueChatLink: 'संभाषण सुरू ठेवा →',
    quickQuestion1: 'माझ्या शेतासाठी कोणते औषध?',
    quickQuestion2: 'आजचा भाव काय आहे?',
    quickQuestion3: 'पाऊस पडेल का?',
    profile: 'प्रोफाइल',
    officerView: 'ऑफिसर व्यू',
    languages: {
      'en-IN': 'English',
      'ml-IN': 'मल्याळम',
      'hi-IN': 'हिंदी',
      'mr-IN': 'मराठी',
    }
  }
};

const farmer = {
  name: 'അക്ഷയ്',
  village: 'ചാലക്കുടി',
};


export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [language, setLanguage] = useState('ml-IN');

  const [isWeatherDialogOpen, setWeatherDialogOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<GiveWeatherBasedAdviceOutput | null>(null);
  const [isWeatherLoading, setWeatherLoading] = useState(false);
  
  const currentContent = content[language as keyof typeof content] || content['en-IN'];

  useEffect(() => {
    const savedLang = localStorage.getItem('krishimitra-lang') || 'ml-IN';
    setLanguage(savedLang);
  }, [router]);

    useEffect(() => {
    // Fetch weather on initial load silently
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherForecast(language, latitude, longitude);
          setWeatherData(data);
        },
        () => {
          // Fail silently on initial load
          console.error("Could not get location for initial weather fetch.");
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('krishimitra-lang', lang);
  };

  const getLanguageName = (langCode: string) => {
    try {
      if (langCode === 'ml-IN') return 'മലയാളം';
      if (langCode === 'hi-IN') return 'हिंदी';
      if (langCode === 'mr-IN') return 'मराठी';
      const languageName = new Intl.DisplayNames([langCode.split('-')[0]], { type: 'language' }).of(langCode.split('-')[0]);
      return languageName || 'Language';
    } catch (e) {
      return 'Language';
    }
  }

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
    <div className="flex flex-col min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <h1 className="text-xl font-bold">KrishiMitra <span className="font-normal text-lg">{language === 'ml-IN' && 'കൃഷിമിത്രം'}</span></h1>
            </div>
            <div className="flex items-center gap-1">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <Globe className="h-5 w-5 mr-2" />
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
              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard" title={currentContent.officerView}>
                  <ShieldQuestion className="h-6 w-6" />
                </Link>
              </Button>
               <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link href="/profile">
                  <User className="h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-lg">{currentContent.greeting}, {farmer.name}!</p>
              <p className="text-sm opacity-90">{farmer.village}, {currentContent.checkIn}</p>
            </div>
            { weatherData && !isWeatherLoading ? (
                 <div className="text-right">
                    <p className="font-semibold text-lg">{weatherData.temperature}</p>
                    <p className="text-sm opacity-90">{weatherData.condition}</p>
                </div>
            ) : (
                 <div className="text-right">
                    <p className="font-semibold text-lg">--°C</p>
                    <p className="text-sm opacity-90">Loading...</p>
                </div>
            )
            }
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-1">
        {/* Quick Action Cards */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/chat?action=voice">
                    <Mic className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">{currentContent.voiceQueryTitle}</h3>
              <p className="text-xs text-muted-foreground">{currentContent.voiceQuerySubtitle}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/chat?action=camera">
                    <Camera className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">{currentContent.photoDiagnosisTitle}</h3>
              <p className="text-xs text-muted-foreground">{currentContent.photoDiagnosisSubtitle}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/market">
                    <Tag className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">{currentContent.marketPricesTitle}</h3>
              <p className="text-xs text-muted-foreground">{currentContent.marketPricesSubtitle}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20" onClick={handleWeatherClick}>
                    <Cloud className="h-8 w-8 text-primary" />
               </Button>
              <h3 className="font-semibold text-sm">{currentContent.weatherAlertTitle}</h3>
              <p className="text-xs text-muted-foreground">{currentContent.weatherAlertSubtitle}</p>
            </CardContent>
          </Card>
           <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href={`/chat?q=${encodeURIComponent(currentContent.languages['en-IN'] === 'English' ? 'What government schemes are available?' : 'ഏതൊക്കെ സർക്കാർ പദ്ധതികൾ ലഭ്യമാണ്?')}`}>
                    <Landmark className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">{currentContent.govtSchemesTitle}</h3>
              <p className="text-xs text-muted-foreground">{currentContent.govtSchemesSubtitle}</p>
            </CardContent>
          </Card>
        </section>

        {/* Active Alerts */}
        <section className="space-y-3 mb-6">
            <h2 className="font-bold text-lg text-foreground">{currentContent.activeAlerts}</h2>
            <Card className="bg-destructive/10 border-destructive/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
                    <div>
                        <h4 className="font-bold text-destructive">{currentContent.pestAlertTitle}</h4>
                        <p className="text-sm text-destructive/80">{currentContent.pestAlertSubtitle}</p>
                    </div>
                </CardContent>
            </Card>
             <Card className="bg-accent/10 border-accent/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <CloudDrizzle className="h-6 w-6 text-accent shrink-0" />
                    <div>
                        <h4 className="font-bold text-accent">{currentContent.rainAlertTitle}</h4>
                        <p className="text-sm text-accent/80">{currentContent.rainAlertSubtitle}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary shrink-0" />
                    <div>
                        <h4 className="font-bold text-primary">{currentContent.priceAlertTitle}</h4>
                        <p className="text-sm text-primary/80">{currentContent.priceAlertSubtitle}</p>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Quick Chat Section */}
        <section>
          <h2 className="font-bold text-lg text-foreground mb-3">{currentContent.quickChat}</h2>
          <Link href="/chat">
            <Card className="mb-3 bg-white hover:bg-gray-50 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{currentContent.continueChat}</p>
                <p className="text-sm font-semibold text-primary mt-1">{currentContent.continueChatLink}</p>
              </CardContent>
            </Card>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="bg-white shadow-sm" asChild><Link href={`/chat?q=${encodeURIComponent(currentContent.quickQuestion1)}`}>{currentContent.quickQuestion1}</Link></Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm" asChild><Link href={`/chat?q=${encodeURIComponent(currentContent.quickQuestion2)}`}>{currentContent.quickQuestion2}</Link></Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm" asChild><Link href={`/chat?q=${encodeURIComponent(currentContent.quickQuestion3)}`}>{currentContent.quickQuestion3}</Link></Button>
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
    </>
  );
}
