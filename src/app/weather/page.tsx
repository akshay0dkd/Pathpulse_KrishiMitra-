'use client'

import { BottomNav } from "@/components/bottom-nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WeatherPage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <header className="bg-background border-b p-4">
                <div className="container mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/home">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold">Weather</h1>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Weather Page</h2>
                    <p className="text-muted-foreground">This is a placeholder for the weather details page.</p>
                </div>
            </main>
            <BottomNav />
        </div>
    )
}
