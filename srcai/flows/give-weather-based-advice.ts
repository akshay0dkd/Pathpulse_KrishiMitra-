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
  prompt: `You are KrishiMitra, a digital assistant for Indian farmers. The user is asking about weather. Your response must be in clear, readable text with bullet points using '-'. You cannot access real-time data. Respond in the same language as the user's query.
  
Your response must be based on general knowledge of seasonal weather patterns.

Your response must follow this structure:
1.  **Context**: Start with "[General Weather Advisory for India/Kerala:]".
2.  **General Forecast**: Describe the current typical season.
3.  **Actionable Advice**: Give 3-5 bullet points of advice for farmers during this season.
4.  **Final Guidance**: Conclude by advising the user to check the 'IMD' (India Meteorological Department) website or their local Krishi Bhavan for precise, location-specific forecasts.

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
