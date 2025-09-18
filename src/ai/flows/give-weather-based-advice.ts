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
  season: z
    .string()
    .describe('The current season in Kerala (e.g., monsoon, summer, winter).'),
  crop: z.string().optional().describe('The crop the user is growing.'),
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

const GiveWeatherBasedAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe(
      'General farming advice based on the provided season in Kerala.'
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
  prompt: `You are an expert agricultural advisor for Kerala farmers.

  Provide general farming advice based on the current season: {{{season}}}.

  If the user is growing a specific crop such as {{{crop}}}, tailor the advice to that crop.
  Make sure that the advice is relevant to Kerala.

  Respond primarily in Malayalam, using simple words. You can mix in common agricultural terms in English if they are widely understood.

  Greet the user in Malayalam, introduce yourself as KrishiMitra, and ask how you can assist. Example: \"നമസ്കാരം, ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി ക്രിഷിമിത്രയാണ്. ഇന്ന് എന്താണ് സംഭവിക്കുന്നത്? (Hello, I am your digital farming assistant, KrishiMitra. What is happening today?)\".
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
