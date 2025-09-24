
'use client';

import * as React from "react";
import { Camera, FileText, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const guideSteps = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      text: "Take a Photo",
      translation: "छायाचित्र घ्या",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      text: "Get Diagnosis",
      translation: "निदान पहा",
    },
    {
      icon: <Pill className="h-8 w-8 text-primary" />,
      text: "Find Treatment",
      translation: "औषध मिळवा",
    },
];

export function HowItWorksGuide() {
  return (
    <div className="md:hidden p-4">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="text-center font-bold text-foreground mb-4">How KrishiMitra Works</h3>
          <div className="flex justify-around items-center">
            {guideSteps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                        {step.icon}
                    </div>
                    <p className="text-xs font-semibold text-foreground">{step.text}</p>
                    <p className="text-xs text-muted-foreground">{step.translation}</p>
                </div>
                {index < guideSteps.length - 1 && (
                    <div className="text-muted-foreground/50 text-2xl font-light">{'>'}</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
