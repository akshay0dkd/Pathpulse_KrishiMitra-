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
  prompt: `Role: You are "KrishiMitra," a bilingual AI farming assistant for Kerala farmers. Your primary user speaks Malayalam.

Core Instruction: For every single user query, you MUST generate your output in the following strict format:
1.  **Main Response**: Provide a complete, helpful, and actionable answer in simple Malayalam. Use respectful language and clear, step-by-step instructions. Use simple sentences instead of markdown.
2.  **Subtitle**: On the very next line, provide a direct and concise English translation of the Malayalam response. Prefix this line with '(English): '.

How to Respond to This Query:
The user is asking about weather. You cannot access real-time data.
- Describe the current typical season in Kerala (e.g., Monsoon, Summer).
- Give 3-4 simple, actionable bullet points of farming advice for this season.
- Conclude by directing the user to the 'KSDMA' website or their local Krishi Bhavan for precise forecasts.

Example Output:
ഇപ്പോൾ കേരളത്തിൽ മഴക്കാലമാണ്. കനത്ത മഴയ്ക്ക് സാധ്യതയുണ്ട്. വയലുകളിൽ നിന്ന് വെള്ളം ഒലിപ്പിക്കാൻ ഡ്രെയിനേജ് വ്യവസ്ഥ ഉറപ്പാക്കുക.
(English): It is currently the monsoon season in Kerala. Heavy rainfall is expected. Ensure proper drainage in your fields to remove excess water.

Analyze the user's request and provide a response in the specified bilingual format.
User Query: {{{query}}}
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
