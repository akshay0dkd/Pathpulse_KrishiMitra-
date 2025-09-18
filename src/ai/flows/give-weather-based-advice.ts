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
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. The user is asking about weather. Your response must be in clear, readable text with line breaks and bullet points using '*'. You cannot access real-time data.
  
Your response must be based on general knowledge of Kerala's seasonal weather patterns (Southwest Monsoon, Northeast Monsoon, Summer).

Your response must be in simple Malayalam first, followed by a concise English translation. The response must follow this structure:
1.  **General Forecast**: Start with "[General Weather Advisory for Kerala:]". Describe the current typical season in Kerala.
2.  **Agricultural Impact**: Explain how this weather affects common crops (e.g., waterlogging for paddy, fungal diseases in humidity).
3.  **Actionable Recommendations**: Give advice to farmers (e.g., ensure proper drainage, adjust fertilizer application).
4.  **Final Guidance**: Conclude by advising the user to check the 'KSDMC' (Kerala State Disaster Management Authority) website or their local Krishi Bhavan for precise, location-specific forecasts.

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
