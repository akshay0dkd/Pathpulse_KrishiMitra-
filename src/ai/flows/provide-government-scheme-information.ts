'use server';

/**
 * @fileOverview A flow that provides information about government schemes.
 *
 * - provideGovernmentSchemeInformation - A function that handles the retrieval of information about government schemes.
 * - ProvideGovernmentSchemeInformationInput - The input type for the provideGovernmentSchemeInformation function.
 * - ProvideGovernmentSchemeInformationOutput - The return type for the provideGovernmentSchemeInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideGovernmentSchemeInformationInputSchema = z.object({
  query: z
    .string()
    .describe('The query about government schemes.'),
});
export type ProvideGovernmentSchemeInformationInput = z.infer<typeof ProvideGovernmentSchemeInformationInputSchema>;

const ProvideGovernmentSchemeInformationOutputSchema = z.object({
  response: z.string().describe('The information about government schemes.'),
});
export type ProvideGovernmentSchemeInformationOutput = z.infer<typeof ProvideGovernmentSchemeInformationOutputSchema>;

export async function provideGovernmentSchemeInformation(input: ProvideGovernmentSchemeInformationInput): Promise<ProvideGovernmentSchemeInformationOutput> {
  return provideGovernmentSchemeInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideGovernmentSchemeInformationPrompt',
  input: {schema: ProvideGovernmentSchemeInformationInputSchema},
  output: {schema: ProvideGovernmentSchemeInformationOutputSchema},
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. A farmer is asking about government schemes. Respond in Malayalam, but you can mix in common agricultural terms in English if they are widely understood.

  Here is the farmer's query: {{{query}}}

  Mention scheme names like \"Sub-Mission on Agriculture Mechanization (SMAM)\" or \"PM-KISAN\" and advise them to contact their local Krishi Bhavan for application details.

  If a query is too complex, vague, or involves legal/financial advice, simulate escalation. Say: \"ഈ ചോദ്യം കൂടുതൽ വിശദമായ പരിശോധന requires. I am escalating this to a local Agri Officer at the Krishi Bhavan. They will contact you shortly. Please ensure your phone number is registered.\"`,
});

const provideGovernmentSchemeInformationFlow = ai.defineFlow(
  {
    name: 'provideGovernmentSchemeInformationFlow',
    inputSchema: ProvideGovernmentSchemeInformationInputSchema,
    outputSchema: ProvideGovernmentSchemeInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
