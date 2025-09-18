'use server';

/**
 * @fileOverview A flow to provide general farming advice based on seasonal weather conditions in Kerala.
 *
 * - giveWeatherBasedAdvice - A function that provides weather-based advice to farmers.
 * - GiveWeatherBasedAdviceInput - The input type for the giveWeatherBasedAdvice function.
 * - GiveWeatherBasedAdviceOutput - The return type for the giveWeatherBasedAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GiveWeatherBasedAdviceInputSchema = z.object({
    greeting: z.boolean().optional().describe("If true, generate only the initial greeting.")
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

const GiveWeatherBasedAdviceOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The initial greeting or response in Malayalam, followed by an English translation.'
    ),
});
export type GiveWeatherBasedAdviceOutput = z.infer<
  typeof GiveWeatherBasedAdviceOutputSchema
>;

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
  "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി, ക്രിഷിമിത്രയാണ്. എന്നെ ഇംഗ്ലീഷിലോ മലയാളത്തിലോ ചോദിക്കാം. (Hello! I am your digital farming assistant, KrishiMitra. You can ask me in English or Malayalam.)

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
