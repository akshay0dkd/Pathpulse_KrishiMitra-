'use server';

/**
 * @fileOverview A flow to provide general farming advice based on real-time weather conditions.
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
import {getWeatherTool} from '@/ai/tools/weather';

export async function giveWeatherBasedAdvice(
  input: GiveWeatherBasedAdviceInput
): Promise<GiveWeatherBasedAdviceOutput> {
  return giveWeatherBasedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'giveWeatherBasedAdvicePrompt',
  input: {schema: GiveWeatherBasedAdviceInputSchema},
  output: {schema: GiveWeatherBasedAdviceOutputSchema},
  tools: [getWeatherTool],
  prompt: `Role: You are "KrishiMitra," an AI farming assistant for Indian farmers.

Instruction: The user has provided their location (latitude: {{lat}}, longitude: {{lon}}). Your task is to provide a weather forecast and relevant farming advice. You MUST use the provided getWeatherTool to fetch the current weather data.

Task:
1.  **Fetch Weather**: Call the 'getWeatherTool' with the user's coordinates.
2.  **Populate Weather Data**: Use the data returned from the tool to fill in the 'location', 'temperature', 'condition', 'conditionIcon', and 'daily' forecast fields in the output schema.
    -   The 'temperature' and 'temp' fields should be formatted as a string with the degree symbol, e.g., "28°C".
    -   The 'conditionIcon' for both current weather and the daily forecast MUST be one of the allowed values from the schema. Map the 'main' weather condition from the tool's output (e.g., "Clouds", "Rain", "Clear") to the corresponding icon name.
    -   The 'day' for the daily forecast should be the day of the week (e.g., "Monday").
3.  **Generate Farming Advice**: Based on the real weather data you just fetched, provide 3-4 simple, actionable bullet points of farming advice suitable for the conditions (e.g., if rain is coming, advise on drainage; if it's hot and sunny, advise on irrigation).
4.  **Generate Spraying Advice**: Provide one short, specific sentence for the 'sprayingAdvice' field. This advice should be about the best time to spray crops, considering the real weather forecast.
5.  **Translate for Language**: The content of 'location', 'condition', 'advice', and 'sprayingAdvice' strings should be in the user's specified language ('ml-IN', 'hi-IN', 'mr-IN', 'en-IN'). The 'day' and 'temp' can remain in English/numerals.

User's Language: {{language}}
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
    if (!output) {
      throw new Error('The model did not return a response.');
    }
    return output;
  }
);
