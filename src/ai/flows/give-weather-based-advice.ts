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

Instruction: The user is asking for weather. You CANNOT access real-time data. Your task is to generate a plausible, simulated weather forecast based on the user's language and likely location. Respond ONLY with the JSON object defined in the output schema.

- If language is 'ml-IN', assume the location is 'Thrissur, Kerala' and the season is monsoon (June-Sept). Generate a forecast with some rain.
- If language is 'hi-IN' or 'mr-IN', assume 'Nagpur, Maharashtra' and the current season is summer (March-June). Generate a hot and sunny forecast.
- For 'en-IN', assume 'Bangalore, Karnataka' with a pleasant, partly cloudy forecast.

Task:
1.  **Determine Location & Season**: Based on the language code.
2.  **Generate Current Conditions**: Create a plausible temperature, condition (e.g., "Partly Cloudy"), and a corresponding 'conditionIcon'.
3.  **Generate 3-Day Forecast**: Create a plausible forecast for the next 3 days (e.g., Monday, Tuesday, Wednesday), including a conditionIcon and temperature for each day.
4.  **Generate Farming Advice**: Provide 3-4 simple, actionable bullet points of farming advice suitable for the generated season and weather. Do NOT include a concluding sentence about checking other sources.
5.  **Generate Spraying Advice**: Provide one short, specific sentence for the 'sprayingAdvice' field. This advice should be about the best time to spray crops, considering the simulated weather. For example, if rain is forecast, advise against spraying. If it is hot, suggest spraying in the cooler parts of the day.
6.  **Translate for Language**: While the schema fields are in English, the content of 'location', 'condition', 'advice', and 'sprayingAdvice' strings should be in the user's specified language ('ml-IN', 'hi-IN', 'mr-IN', 'en-IN'). The 'day' and 'temp' can remain in English/numerals.

Example for 'ml-IN' output (partial):
{
  "location": "തൃശ്ശൂർ, കേരളം",
  "temperature": "27°C",
  "condition": "മേഘാവൃതം",
  "conditionIcon": "Cloudy",
  "advice": [
    "വയലുകളിൽ നിന്ന് വെള്ളം ഒലിപ്പിക്കാൻ ഡ്രെയിനേജ് വ്യവസ്ഥ ഉറപ്പാക്കുക.",
    "കനത്ത മഴയ്ക്ക് സാധ്യതയുള്ളതിനാൽ വിളകൾക്ക് താങ്ങ് നൽകുക."
  ],
  "sprayingAdvice": "മഴ സാധ്യതയുള്ളതിനാൽ ഇന്ന് മരുന്ന് തളിക്കുന്നത് ഒഴിവാക്കുക.",
  ...
}

User's Language: {{language}}
User's Query: {{{query}}}
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
