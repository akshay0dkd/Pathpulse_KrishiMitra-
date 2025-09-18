'use server';

import { diagnoseWithPhoto } from '@/ai/flows/diagnose-with-photo';
import { giveWeatherBasedAdvice } from '@/ai/flows/give-weather-based-advice';
import { identifyPestDisease } from '@/ai/flows/identify-pest-disease-from-symptoms';
import { provideGovernmentSchemeInformation } from '@/ai/flows/provide-government-scheme-information';
import { processVoiceQuery } from '@/ai/flows/voice-mode-flow';
import { escalateQuery } from '@/ai/flows/escalate-query';
import { recommendTreatmentOptions } from '@/ai/flows/recommend-treatment-options';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

// This is the new, streamlined workflow.
export async function processUserMessage(
  history: Message[],
  message: string,
  imageDataUri?: string
): Promise<string> {
  try {
    // Keywords to identify the user's intent
    const isSchemeQuery = /scheme|subsidy|loan|kisan|yojana|പദ്ധതി|സബ്സിഡി|ലോൺ|കിസാൻ/i.test(message);
    const isWeatherQuery = /weather|rain|monsoon|summer|കാലാവസ്ഥ|മഴ|വേനൽ|forecast|temperature|hot|dry/i.test(message);

    // 1. Handle Scheme Queries
    if (isSchemeQuery) {
      const result = await provideGovernmentSchemeInformation({ query: message });
      return result.response;
    }

    // 2. Handle Weather Queries
    if (isWeatherQuery) {
        const result = await giveWeatherBasedAdvice({ query: message });
        return result.response;
    }

    // 3. Handle Image Queries
    if (imageDataUri) {
        // Since we don't have a crop name from the image, we ask the AI to do its best.
        // A more advanced version could run a crop identification model first.
        const result = await diagnoseWithPhoto({ crop: 'unknown', photoDataUri: imageDataUri });
        return result.response;
    }

    // 4. Handle Text-based Crop Problem Queries
    const analysis = await identifyPestDisease({ symptoms: message });

    if (analysis.confidence === 'low' || analysis.crop === 'unknown' || analysis.problem === 'unknown') {
       // If confidence is low, but we identified something, we can ask for clarification.
      if (analysis.crop === 'unknown' && analysis.problem !== 'unknown') {
         return 'Understood. Could you please specify which crop has this issue?';
      }
      
      // Otherwise, escalate to a human expert.
      console.log(`Escalating query: ${message}`);
      const escalationResponse = await escalateQuery({ query: message });
      return escalationResponse.response;
    }
    
    // 5. Get Treatment Recommendations
    // If analysis was successful, get treatment options from another specialized flow.
    const treatmentResponse = await recommendTreatmentOptions({
        crop: analysis.crop,
        pestOrDisease: analysis.problem,
    });
    return treatmentResponse.treatmentRecommendations;


  } catch (error) {
    console.error('Error processing user message:', error);
    return 'Sorry, a technical error occurred. I could not process your request. Please try again.';
  }
}

export async function processVoiceModeMessage(
  history: Message[],
  message: string,
): Promise<string> {
    try {
        const historyForAI = history.map(({id, image, ...rest}) => rest);
        const result = await processVoiceQuery({query: message, history: historyForAI});
        return result.response;
    } catch (error) {
        console.error("Error processing voice message:", error);
        return "Sorry, I ran into a problem. Please try again.";
    }
}
