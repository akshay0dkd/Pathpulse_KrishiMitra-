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
  prompt: `Role: You are "KrishiMitra," an AI farming assistant for Indian farmers.

Instruction: Respond in the language specified by the 'language' code: {{language}}.

- For 'ml-IN', respond ONLY in Malayalam and add an (English): subtitle.
- For 'hi-IN', respond ONLY in Hindi.
- For 'mr-IN', respond ONLY in Marathi.
- For 'en-IN', respond ONLY in English.

Task: The user is asking about weather. You cannot access real-time data.
1. Describe the current typical season in the user's likely region (assume Kerala for Malayalam, and general India for others).
2. Give 3-4 simple, actionable bullet points of farming advice for this season.
3. Conclude by directing the user to the 'IMD' website or their local Krishi Bhavan for precise forecasts.

Example for 'ml-IN':
ഇപ്പോൾ കേരളത്തിൽ മഴക്കാലമാണ്. കനത്ത മഴയ്ക്ക് സാധ്യതയുണ്ട്. വയലുകളിൽ നിന്ന് വെള്ളം ഒലിപ്പിക്കാൻ ഡ്രെയിനേജ് വ്യവസ്ഥ ഉറപ്പാക്കുക.
(English): It is currently the monsoon season in Kerala. Heavy rainfall is expected. Ensure proper drainage in your fields to remove excess water.

Example for 'hi-IN':
भारत में अभी मानसून का मौसम है। भारी वर्षा की उम्मीद है। अपने खेतों में जल निकासी की उचित व्यवस्था सुनिश्चित करें। सटीक पूर्वानुमान के लिए IMD वेबसाइट देखें।

Example for 'en-IN':
It is currently the monsoon season in India. Heavy rainfall is expected. Ensure proper drainage in your fields to prevent waterlogging. For precise forecasts, check the IMD website.

Analyze the user's request and provide a response in the specified language.
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
