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
  response: z.string().describe('The information about government schemes in Malayalam.'),
  englishTranslation: z.string().describe('The English translation of the response.')
});
export type ProvideGovernmentSchemeInformationOutput = z.infer<typeof ProvideGovernmentSchemeInformationOutputSchema>;

export async function provideGovernmentSchemeInformation(input: ProvideGovernmentSchemeInformationInput): Promise<ProvideGovernmentSchemeInformationOutput> {
  return provideGovernmentSchemeInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideGovernmentSchemeInformationPrompt',
  input: {schema: ProvideGovernmentSchemeInformationInputSchema},
  output: {schema: ProvideGovernmentSchemeInformationOutputSchema},
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. A farmer is asking about government schemes. 
  
  Your primary response must be in simple Malayalam. Mention scheme names like "Sub-Mission on Agriculture Mechanization (SMAM)" or "PM-KISAN" and advise them to contact their local Krishi Bhavan for application details.
  
  If a query is too complex, vague, or involves legal/financial advice, simulate escalation. Say: "ഈ ചോദ്യത്തിന് കൂടുതൽ വിശദമായ പരിശോധന ആവശ്യമാണ്. ഞാൻ ഇത് കൃഷി ഭവനിലെ ഒരു കൃഷി ഓഫീസർക്ക് കൈമാറുന്നു. അവർ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും. നിങ്ങളുടെ ഫോൺ നമ്പർ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക."
  
  Then, provide a concise and accurate English translation of your response. For the escalation message, the translation should be: "This question requires a more detailed examination. I am escalating this to a local Agri Officer at the Krishi Bhavan. They will contact you shortly. Please ensure your phone number is registered."

  Here is the farmer's query: {{{query}}}
  `,
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
