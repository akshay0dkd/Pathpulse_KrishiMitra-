'use server';

import { diagnoseWithPhoto } from '@/ai/flows/diagnose-with-photo';
import { giveWeatherBasedAdvice } from '@/ai/flows/give-weather-based-advice';
import { identifyPestDisease } from '@/ai/flows/identify-pest-disease-from-symptoms';
import { provideGovernmentSchemeInformation } from '@/ai/flows/provide-government-scheme-information';
import { processVoiceQuery } from '@/ai/flows/voice-mode-flow';
import { escalateQuery } from '@/ai/flows/escalate-query';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

// MOCK DATABASE for crop_solutions
// In a real app, this would be a Firestore query.
const cropSolutionsDB: Record<string, Record<string, { ml: string; en: string }>> = {
  "banana": {
    "leaf spot": {
      "ml": "തവിട്ട് പുള്ളി രോഗം. ബോർഡോ മിശ്രിതം (1%) തെളിക്കുക. 15 ദിവസം ഇടവേളയിൽ ആവർത്തിക്കുക.",
      "en": "For Leaf Spot Disease, spray 1% Bordeaux mixture. Repeat every 15 days."
    },
    "aphids": {
      "ml": "ആഫിഡ്സ്. നീം ഓയിൽ (5 മില്ലി/ലിറ്റർ വെള്ളം) തെളിക്കുക.",
      "en": "For Aphids, spray Neem Oil (5ml per liter of water)."
    },
    "yellow leaves": {
       "ml": "മഞ്ഞ ഇലകൾക്ക് കാരണം പോഷകക്കുറവ് ആകാം, പ്രത്യേകിച്ച് പൊട്ടാസ്യം. ജൈവവളം ചേർക്കുക. കൂടുതൽ വിവരങ്ങൾക്കായി കൃഷിഭവനുമായി ബന്ധപ്പെടുക.",
       "en": "Yellow leaves could be due to nutrient deficiency, especially Potassium. Add organic manure. Contact Krishi Bhavan for more details."
    }
  },
  "rice": {
      "fertilizer": {
          "ml": "നെല്ലിന് സാധാരണയായി യൂറിയ, ഫാക്ടംഫോസ്, പൊട്ടാഷ് എന്നിവയാണ് നൽകുന്നത്. നിങ്ങളുടെ മണ്ണിന്റെ തരം അനുസരിച്ച് അളവിൽ മാറ്റം വരാം. കൃഷിഭവനിൽ ചോദിക്കുക.",
          "en": "For rice, Urea, Factamfos, and Potash are commonly used. The amount depends on your soil type. Please ask at your Krishi Bhavan."
      }
  }
};


function findSolution(crop: string, problem: string): { ml: string; en: string } | null {
    const solutions = cropSolutionsDB[crop];
    if (solutions && solutions[problem]) {
        return solutions[problem];
    }
    // A more advanced version could check for partial matches in problem string
    for (const key in solutions) {
        if (problem.includes(key)) {
            return solutions[key];
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

    if (imageDataUri) {
        const result = await diagnoseWithPhoto({ crop: 'unknown', photoDataUri: imageDataUri });
        return `${result.malayalamResponse}\n\n**(English):** ${result.englishTranslation}`;
    }

    // New "Smart" Workflow
    const analysis = await identifyPestDisease({ symptoms: message });

    if (analysis.confidence === 'low' || analysis.crop === 'unknown' || analysis.problem === 'unknown') {
      
      if (analysis.crop === 'unknown' && analysis.problem !== 'unknown') {
         return 'മനസ്സിലായി. ഏത് വിളയിലാണ് ഈ പ്രശ്നം എന്ന് പറയാമോ?\n\n**(English):** Understood. Could you please specify which crop has this issue?';
      }
      
      // ESCALATE: Save to `escalated_queries` and tell user.
      // In a real app, you would save this to Firestore.
      console.log(`Escalating query: ${message}`);
      const escalationResponse = await escalateQuery({ query: message });
      return `${escalationResponse.malayalamResponse}\n\n**(English):** ${escalationResponse.englishTranslation}`;
    }

    // SEARCH KNOWLEDGE BASE
    const solution = findSolution(analysis.crop, analysis.problem);

    if (solution) {
      // FOUND ANSWER: Return it
      return `${solution.ml}\n\n**(English):** ${solution.en}`;
    } else {
      // If we get here, the crop/problem wasn't found in the DB -> ESCALATE
      console.log(`Escalating query (solution not found): ${message}`);
      const escalationResponse = await escalateQuery({ query: message });
      return `${escalationResponse.malayalamResponse}\n\n**(English):** ${escalationResponse.englishTranslation}`;
    }

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
