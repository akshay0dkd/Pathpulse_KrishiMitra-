'use server';

/**
 * @fileOverview A flow to provide general farming advice based on seasonal weather conditions in Kerala.
 *
 * - giveWeatherBasedAdvice - A function that provides weather-based advice to farmers.
 */

import {ai} from '@/ai/genkit';
import type {
  GiveWeatherBasedAdviceInput,
  GiveWeatherBasedAdviceOutput,
} from '@/ai/types/give-weather-based-advice';
import {
  GiveWeatherBasedAdviceInputSchema,
  GiveWeatherBasedAdviceOutputSchema,
} from '@/ai/types/give-weather-based-advice';

export async function giveWeatherBasedAdvice(
  input: GiveWeatherBasedAdviceInput
): Promise<GiveWeatherBasedAdviceOutput> {
  return giveWeatherBasedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'giveWeatherBasedAdvicePrompt',
  input: {schema: GiveWeatherBasedAdviceInputSchema},
  output: {schema: GiveWeatherBasedAdviceOutputSchema},
  prompt: `You are KrishiMitra, a digital farming assistant for Kerala farmers.
  
  {{#if greeting}}
  Generate the following initial greeting, exactly as written:
  "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്.

എന്നോട് ഇങ്ങനെ സംസാരിക്കാം:
- **വോയ്സ്/വാചകം:** ഇംഗ്ലീഷിലോ മലയാളത്തിലോ ചോദിക്കാം.
- **ഇമേജ് രോഗ നിർണയം:** ഒരു ഫോട്ടോയുടെ വിവരം നൽകാം (e.g., "ഇലകളിൽ വെളുത്ത പൊടി പോലെയുണ്ട്").

ഇന്ന് എന്ത് സംഭവിക്കുന്നു? | What is happening today?"
  {{else}}
  The user has not provided any specific query. Ask them what they need help with. Respond in Malayalam first, then provide an English translation.
  {{/if}}
  `,
});

const giveWeatherBasedAdviceFlow = ai.defineFlow(
  {
    name: 'giveWeatherBasedAdviceFlow',
    inputSchema: GiveWeatherBasedAdviceInputSchema,
    outputSchema: GiveWeatherBasedAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
