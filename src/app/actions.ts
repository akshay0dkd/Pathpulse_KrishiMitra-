
'use server';

import { diagnoseWithPhoto } from '@/ai/flows/diagnose-with-photo';
import { giveWeatherBasedAdvice } from '@/ai/flows/give-weather-based-advice';
import type { GiveWeatherBasedAdviceOutput } from '@/ai/types/give-weather-based-advice';
import { identifyPestDisease } from '@/ai/flows/identify-pest-disease-from-symptoms';
import { provideGovernmentSchemeInformation } from '@/ai/flows/provide-government-scheme-information';
import { processVoiceQuery as processVoiceQueryFlow } from '@/ai/flows/voice-mode-flow';
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
  language: string,
  imageDataUri?: string
): Promise<string> {
  try {
    const lang = language || 'en-IN';
    // Keywords to identify the user's intent
    const isSchemeQuery = /scheme|subsidy|loan|kisan|yojana|പദ്ധതി|സബ്സിഡി|ലോൺ|കിസാൻ|योजना|कर्ज|सब्सिडी|योजना|कर्ज/i.test(message);
    
    // We remove the weather query check here because it will be handled by a dedicated function.
    // const isWeatherQuery = /weather|rain|monsoon|summer|കാലാവസ്ഥ|മഴ|വേനൽ|forecast|temperature|hot|dry|मौसम|बारिश|पूर्वानुमान|तापमान|हवामान|पाऊस/i.test(message);

    // 1. Handle Scheme Queries
    if (isSchemeQuery) {
      const result = await provideGovernmentSchemeInformation({ query: message, language: lang });
      return result.response;
    }

    // 2. Handle Image Queries
    if (imageDataUri) {
        const result = await diagnoseWithPhoto({ crop: 'unknown', photoDataUri: imageDataUri, language: lang });
        return result.response;
    }

    // 3. Handle Text-based Crop Problem Queries
    const analysis = await identifyPestDisease({ symptoms: message });

    if (analysis.confidence === 'low' || analysis.crop === 'unknown' || analysis.problem === 'unknown') {
       if (analysis.crop === 'unknown' && analysis.problem !== 'unknown') {
          const clarificationRequests: Record<string, string> = {
            'en-IN': 'Understood. Could you please specify which crop has this issue?',
            'ml-IN': 'മനസ്സിലായി. ഏത് വിളയിലാണ് ഈ പ്രശ്നമെന്ന് ദയവായി വ്യക്തമാക്കാമോ?',
            'hi-IN': 'समझ गया। क्या आप कृपया बता सकते हैं कि यह समस्या किस फसल में है?',
            'mr-IN': 'समजले. कृपया कोणत्या पिकाला ही समस्या आहे हे स्पष्ट करू शकाल का?',
          };
         return clarificationRequests[lang] || clarificationRequests['en-IN'];
      }
      
      console.log(`Escalating query: ${message}`);
      const escalationResponse = await escalateQuery({ query: message, language: lang });
      return escalationResponse.response;
    }
    
    // 4. Get Treatment Recommendations
    const treatmentResponse = await recommendTreatmentOptions({
        crop: analysis.crop,
        pestOrDisease: analysis.problem,
        language: lang,
    });
    return treatmentResponse.treatmentRecommendations;


  } catch (error) {
    console.error('Error processing user message:', error);
    const errorMessages: Record<string, string> = {
        'en-IN': 'Sorry, a technical error occurred. I could not process your request. Please try again.',
        'ml-IN': 'ക്ഷമിക്കണം, ഒരു സാങ്കേതിക പിശക് സംഭവിച്ചു. നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യാൻ എനിക്ക് കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
        'hi-IN': 'क्षमा करें, एक तकनीकी त्रुटि हुई। मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।',
        'mr-IN': 'माफ करा, तांत्रिक त्रुटी आली आहे. मी तुमच्या विनंतीवर प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.',
    }
    return errorMessages[language] || errorMessages['en-IN'];
  }
}

export async function processVoiceModeMessage(
  history: Message[],
  message: string,
  language: string,
): Promise<string> {
    try {
        const historyForAI = history.map(({id, image, ...rest}) => rest);
        const result = await processVoiceQueryFlow({query: message, history: historyForAI, language: language });
        return result.response;
    } catch (error) {
        console.error("Error processing voice message:", error);
        return "Sorry, I ran into a problem. Please try again.";
    }
}

export async function getWeatherForecast(
  language: string,
  lat: number,
  lon: number
): Promise<GiveWeatherBasedAdviceOutput> {
  const lang = language || 'en-IN';
  try {
    const result = await giveWeatherBasedAdvice({ lat, lon, language: lang });
    return result;
  } catch (error) {
    console.error("Error getting weather forecast:", error);
    // Return a default error structure that the UI can handle.
    const errorMessage = (error as Error).message || "Could not fetch data";
    
    let displayMessage = 'Could not fetch weather data. Please try again.';
    if (errorMessage.includes('OPENWEATHER_API_KEY')) {
        displayMessage = 'API key is missing or invalid. Please check server configuration.';
    } else if (errorMessage.includes('Failed to fetch')) {
        displayMessage = 'Could not connect to the weather service. Please check your network and try again.';
    }

    return {
      location: 'Error',
      temperature: '-',
      condition: displayMessage,
      conditionIcon: 'Cloudy',
      advice: [],
      sprayingAdvice: '',
      daily: [],
    };
  }
}
