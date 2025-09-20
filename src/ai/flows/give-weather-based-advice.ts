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
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. The user is asking about weather. Your response must be in clear, readable text with bullet points. You cannot access real-time data.

Your response must follow this structure:
1.  **Malayalam Response**: Provide the full advisory in Malayalam, based on general knowledge of Kerala's seasonal weather patterns. Start with a context header and use bullet points for advice.
2.  **English Subtitle**: Below the Malayalam text, provide a concise English summary. Start with "English Summary:" and summarize the key points.

Example Structure:
[പൊതുവായ കാലാവസ്ഥാ ഉപദേശം:]
ഇപ്പോൾ കേരളത്തിൽ ... (Main content in Malayalam)
- ഉപദേശം 1
- ഉപദേശം 2

English Summary:
General weather advisory... (Summary in English)
- Advice 1
- Advice 2

Final Guidance: Conclude by advising the user to check the 'KSDMC' (Kerala State Disaster Management Authority) website or their local Krishi Bhavan for precise, location-specific forecasts.

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
