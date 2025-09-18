
'use server';

import { diagnoseWithPhoto } from '@/ai/flows/diagnose-with-photo';
import { giveWeatherBasedAdvice } from '@/ai/flows/give-weather-based-advice';
import { identifyPestDisease } from '@/ai/flows/identify-pest-disease-from-symptoms';
import { provideGovernmentSchemeInformation } from '@/ai/flows/provide-government-scheme-information';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

export async function getInitialGreeting(): Promise<string> {
  try {
    const response = await giveWeatherBasedAdvice({ season: 'monsoon' });
    return response.advice;
  } catch (error) {
    console.error('Error getting initial greeting:', error);
    return 'നമസ്കാരം, ഒരു സാങ്കേതിക തകരാർ കാരണം എനിക്ക് ഇപ്പോൾ നിങ്ങളെ സഹായിക്കാൻ കഴിയില്ല. ദയവായി പിന്നീട് ശ്രമിക്കുക.';
  }
}

function findCropInConversation(history: Message[]): string | null {
  const knownCrops: { [key: string]: string } = {
    'banana': 'banana', 'വാഴ': 'banana', 'പഴം': 'banana',
    'rice': 'rice', 'നെല്ല്': 'rice', 'paddy': 'rice',
    'coconut': 'coconut', 'തെങ്ങ്': 'coconut',
    'pepper': 'pepper', 'കുരുമുളക്': 'pepper',
    'rubber': 'rubber',
    'tapioca': 'tapioca', 'മരച്ചീനി': 'tapioca', 'കപ്പ': 'tapioca',
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
      return result.response;
    }

    const currentHistory = [...history, { id: 'current', role: 'user', content: message }];
    const crop = findCropInConversation(currentHistory);

    if (!crop) {
      return 'മനസ്സിലായി. ഏത് വിളയിലാണ് ഈ പ്രശ്നം എന്ന് പറയാമോ? (Understood. Could you please specify which crop has this issue?)';
    }

    if (imageDataUri) {
        const result = await diagnoseWithPhoto({ crop, photoDataUri: imageDataUri });
        let response = `നിങ്ങളുടെ ഫോട്ടോ ലഭിച്ചു. ഇത് '${result.pestOrDisease}' ആകാൻ സാധ്യതയുണ്ട് (Confidence: ${Math.round(result.confidence * 100)}%).\n\n`;
        response += `**ശുപാർശകൾ:**\n${result.recommendations}`;
        return response;
    }
    
    // Assuming the latest message contains the primary symptoms
    const symptoms = message; 

    const result = await identifyPestDisease({ crop, symptoms });

    let response = `രോഗം കൃത്യമായി മനസിലാക്കാൻ ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുന്നത് സഹായകമാകും. നിങ്ങൾ നൽകിയ വിവരങ്ങൾ അനുസരിച്ച്, ഇത് '${result.pestOrDisease}' ആകാൻ സാധ്യതയുണ്ട് (Confidence: ${Math.round(result.confidence * 100)}%).\n\n`;
    response += `**ശുപാർശകൾ:**\n${result.recommendations}`;
    
    return response;

  } catch (error) {
    console.error('Error processing user message:', error);
    return 'ക്ഷമിക്കണം, ഒരു സാങ്കേതിക തകരാർ സംഭവിച്ചു. എനിക്ക് നിങ്ങളുടെ ചോദ്യം പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.';
  }
}
