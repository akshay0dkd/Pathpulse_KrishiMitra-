
'use server';

import { diagnoseWithPhoto } from '@/ai/flows/diagnose-with-photo';
import { giveWeatherBasedAdvice } from '@/ai/flows/give-weather-based-advice';
import { identifyPestDisease } from '@/ai/flows/identify-pest-disease-from-symptoms';
import { provideGovernmentSchemeInformation } from '@/ai/flows/provide-government-scheme-information';
import { processVoiceQuery } from '@/ai/flows/voice-mode-flow';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

function findCropInConversation(history: Message[]): string | null {
  const knownCrops: { [key: string]: string } = {
    'banana': 'banana', 'വാഴ': 'banana', 'പഴം': 'banana',
    'rice': 'rice', 'നെല്ല്': 'rice', 'paddy': 'rice',
    'coconut': 'coconut', 'തെങ്ങ്': 'coconut',
    'pepper': 'pepper', 'കുരുമുളക്': 'pepper',
    'rubber': 'rubber',
    'tapioca': 'tapioca', 'മരച്ചീനി': 'tapioca', 'കപ്പ': 'tapioca',
    'mango': 'mango', 'മാങ്ങ': 'mango',
  };

  for (let i = history.length - 1; i >= 0; i--) {
    const messageContent = history[i].content.toLowerCase();
    for (const keyword in knownCrops) {
      if (messageContent.includes(keyword)) {
        return knownCrops[keyword];
      }
    }
  }
  return null;
}

export async function processUserMessage(
  history: Message[],
  message: string,
  imageDataUri?: string
): Promise<string> {
  try {
    const isSchemeQuery = /scheme|subsidy|loan|kisan|പദ്ധതി|സബ്സിഡി|ലോൺ|കിസാൻ/i.test(
      message
    );
    if (isSchemeQuery) {
      const result = await provideGovernmentSchemeInformation({ query: message });
      return `${result.malayalamResponse}\n\n**(English):** ${result.englishTranslation}`;
    }

    const isWeatherQuery = /weather|rain|monsoon|summer|കാലാവസ്ഥ|മഴ|വേനൽ/i.test(
      message
    );
    if (isWeatherQuery) {
        const result = await giveWeatherBasedAdvice({ query: message });
        return `${result.malayalamResponse}\n\n**(English):** ${result.englishTranslation}`;
    }

    const currentHistory = [...history, { id: 'current', role: 'user', content: message }];
    const crop = findCropInConversation(currentHistory);

    if (!crop) {
      return 'മനസ്സിലായി. ഏത് വിളയിലാണ് ഈ പ്രശ്നം എന്ന് പറയാമോ?\n\n**(English):** Understood. Could you please specify which crop has this issue?';
    }

    if (imageDataUri) {
        const result = await diagnoseWithPhoto({ crop, photoDataUri: imageDataUri });
        return `${result.malayalamResponse}\n\n**(English):** ${result.englishTranslation}`;
    }
    
    const symptoms = message; 

    const result = await identifyPestDisease({ crop, symptoms });
    
    return `${result.malayalamResponse}\n\n**(English):** ${result.englishTranslation}`;

  } catch (error) {
    console.error('Error processing user message:', error);
    return 'ക്ഷമിക്കണം, ഒരു സാങ്കേതിക തകരാർ സംഭവിച്ചു. എനിക്ക് നിങ്ങളുടെ ചോദ്യം പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.\n\n**(English):** Sorry, a technical error occurred. I could not process your request. Please try again.';
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
