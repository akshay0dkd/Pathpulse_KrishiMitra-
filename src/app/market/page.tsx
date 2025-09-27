'use client'

import { BottomNav } from "@/components/bottom-nav";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketPage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <header className="bg-background border-b p-4 flex items-center justify-between md:justify-start md:gap-4 h-16 shrink-0">
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/home">
                            <Home />
                        </Link>
                    </Button>
                </div>
                 <div className="hidden md:flex">
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/home">
                            <ArrowLeft />
                        </Link>
                    </Button>
                </div>
                <h1 className="text-xl font-semibold">Market Prices</h1>
                <div className="w-10 md:hidden"></div>
            </header>
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Market Prices</h2>
                    <p className="text-muted-foreground">This feature is coming soon.</p>
                </div>
            </main>
            <BottomNav />
        </div>
    )
}
