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
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. The user is asking about weather. Your response must be in clear, readable Malayalam text with bullet points. You cannot access real-time data.

Your response must follow this structure:
1.  **Context**: Start with "[പൊതുവായ കാലാവസ്ഥാ ഉപദേശം:]".
2.  **General Forecast**: Describe the current typical season in Kerala.
3.  **Actionable Advice**: Give 3-5 bullet points of advice for farmers during this season.
4.  **Final Guidance**: Conclude by advising the user to check the 'KSDMC' (Kerala State Disaster Management Authority) website or their local Krishi Bhavan for precise, location-specific forecasts.
5.  **English Summary**: After the Malayalam response, provide a brief summary of the advice in English, prefixed with "(English): ".

Here is the user's query: {{{query}}}
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
