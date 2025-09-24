'use client';

import type { GiveWeatherBasedAdviceOutput } from "@/ai/types/give-weather-based-advice";
import { Skeleton } from "./ui/skeleton";
import { Cloud, CloudLightning, CloudRain, CloudSun, Sun, SprayCan, Wind, Droplets, Thermometer } from "lucide-react";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";


const iconMap: Record<string, React.ElementType> = {
    Sun: Sun,
    Clear: Sun,
    CloudSun: CloudSun,
    Clouds: Cloud,
    Cloudy: Cloud,
    Rain: CloudRain,
    Drizzle: CloudRain,
    CloudRain: CloudRain,
    Thunderstorm: CloudLightning,
    CloudLightning: CloudLightning,
    Haze: Wind,
    Mist: Droplets,
    Smoke: Wind,
    Dust: Wind,
    Fog: Wind,
    Sand: Wind,
    Ash: Wind,
    Squall: Wind,
    Tornado: Wind,
    Snow: Thermometer, // Placeholder
};

type WeatherForecastProps = {
    data: GiveWeatherBasedAdviceOutput | null;
    isLoading: boolean;
};

export function WeatherForecast({ data, isLoading }: WeatherForecastProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-1/4" />
                    <Skeleton className="h-5 w-1/3" />
                </div>
                <div className="flex justify-around text-center">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center space-y-1">
                            <Skeleton className="h-5 w-12" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-5 w-8" />
                        </div>
                    ))}
                </div>
                 <div className="space-y-3 pt-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        );
    }
    
    if (!data || data.location === 'Error' || data.location === 'Permission Denied') {
        return (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{data?.location || 'Error'}</AlertTitle>
                <AlertDescription>
                    {data?.condition || 'An unknown error occurred. Please try again.'}
                </AlertDescription>
             </Alert>
        )
    }
    
    const CurrentWeatherIcon = iconMap[data.conditionIcon] || Cloud;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-lg font-semibold">{data.location}</p>
                <p className="text-4xl font-bold">{data.temperature}</p>
                <p className="text-muted-foreground">{data.condition}</p>
            </div>
            
            <div className="flex justify-around text-center border-y py-4">
                {data.daily.slice(0, 3).map((day, index) => {
                    const DailyIcon = iconMap[day.conditionIcon] || Cloud;
                    return (
                        <div key={index} className="flex flex-col items-center space-y-1">
                            <p className="text-sm font-medium">{day.day}</p>
                            <DailyIcon className="h-8 w-8 text-primary" />
                            <p className="text-sm font-semibold">{day.temp}</p>
                        </div>
                    );
                })}
            </div>
            
            {data.sprayingAdvice && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <SprayCan className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-primary">Spraying Schedule</h4>
                            <p className="text-sm text-foreground">{data.sprayingAdvice}</p>
                        </div>
                    </div>
                </div>
            )}


            {data.advice && data.advice.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2">General Farming Advice</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                        {data.advice.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
            
             <p className="text-xs text-center text-muted-foreground pt-4">
                Weather data powered by OpenWeatherMap.
             </p>
        </div>
    );
}
