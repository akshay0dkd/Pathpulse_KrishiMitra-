'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Camera, Tag, Cloud, AlertTriangle, CloudDrizzle, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { BottomNav } from '@/components/bottom-nav';

const farmer = {
  name: 'അക്ഷയ്',
  village: 'ചാലക്കുടി',
  district: 'തൃശൂർ',
};

const weather = {
  temp: '28°C',
  condition: 'മേഘാവൃതം',
  conditionEn: 'Cloudy',
};

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('krishimitra-auth') === 'true';
    setIsAuthenticated(auth);
    if (!auth) {
      router.replace('/login');
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <h1 className="text-xl font-bold">KrishiMitra <span className="font-normal text-lg">കൃഷിമിത്രം</span></h1>
            </div>
             <Link href="/profile" className="p-2 rounded-full hover:bg-primary/80">
              <User className="h-6 w-6" />
            </Link>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-lg">നമസ്കാരം, {farmer.name}!</p>
              <p className="text-sm opacity-90">{farmer.village}, {farmer.district}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">{weather.temp}</p>
              <p className="text-sm opacity-90">{weather.condition} ({weather.conditionEn})</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-1">
        {/* Quick Action Cards */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/chat">
                    <Mic className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">ശബ്ദത്തിൽ ചോദിക്കുക</h3>
              <p className="text-xs text-muted-foreground">Press & speak your problem</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/chat">
                    <Camera className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">ഫോട്ടോ എടുത്ത് രോഗം നിർണയിക്കുക</h3>
              <p className="text-xs text-muted-foreground">Click picture of crop issue</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/market">
                    <Tag className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">വിലകൾ പരിശോധിക്കുക</h3>
              <p className="text-xs text-muted-foreground">Check current crop prices</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
             <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
               <Button asChild size="icon" variant="outline" className="h-16 w-16 rounded-full bg-primary/10 mb-2 border-primary/20 hover:bg-primary/20">
                 <Link href="/weather">
                    <Cloud className="h-8 w-8 text-primary" />
                 </Link>
               </Button>
              <h3 className="font-semibold text-sm">കാലാവസ്ഥ അലേർട്ട്</h3>
              <p className="text-xs text-muted-foreground">Weather warnings & advice</p>
            </CardContent>
          </Card>
        </section>

        {/* Active Alerts */}
        <section className="space-y-3 mb-6">
            <h2 className="font-bold text-lg text-foreground">Active Alerts</h2>
            <Card className="bg-destructive/10 border-destructive/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
                    <div>
                        <h4 className="font-bold text-destructive">കനത്ത കീടബാധ സാധ്യത</h4>
                        <p className="text-sm text-destructive/80">Urgent: Pest Outbreak Alert for your region.</p>
                    </div>
                </CardContent>
            </Card>
             <Card className="bg-accent/10 border-accent/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <CloudDrizzle className="h-6 w-6 text-accent shrink-0" />
                    <div>
                        <h4 className="font-bold text-accent">ഇടവിട്ടുള്ള മഴയ്ക്ക് സാധ്യത</h4>
                        <p className="text-sm text-accent/80">Warning: Intermittent rain expected today.</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary shrink-0" />
                    <div>
                        <h4 className="font-bold text-primary">നേന്ത്രക്കായ വില ഉയരുന്നു</h4>
                        <p className="text-sm text-primary/80">Price Alert: Nendran banana prices are up.</p>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Quick Chat Section */}
        <section>
          <h2 className="font-bold text-lg text-foreground mb-3">Quick Chat</h2>
          <Link href="/chat">
            <Card className="mb-3 bg-white hover:bg-gray-50 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">തുടരുക: വാഴയിലെ തവിട്ടുപുള്ളികൾക്ക്...</p>
                <p className="text-sm font-semibold text-primary mt-1">Continue recent conversation &rarr;</p>
              </CardContent>
            </Card>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="bg-white shadow-sm" asChild><Link href="/chat?q=എന്റെ പാടത്തിന് എന്ത് മരുന്ന്?">എന്റെ പാടത്തിന് എന്ത് മരുന്ന്?</Link></Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm" asChild><Link href="/chat?q=ഇന്നത്തെ വില എന്താണ്?">ഇന്നത്തെ വില എന്താണ്?</Link></Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm" asChild><Link href="/chat?q=മഴയുണ്ടാകുമോ?">മഴയുണ്ടാകുമോ?</Link></Button>
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
}
