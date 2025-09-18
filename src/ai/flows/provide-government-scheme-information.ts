'use server';

/**
 * @fileOverview A flow that provides information about government schemes.
 *
 * - provideGovernmentSchemeInformation - A function that handles the retrieval of information about government schemes.
 */

import {ai} from '@/ai/genkit';
import type {
  ProvideGovernmentSchemeInformationInput,
  ProvideGovernmentSchemeInformationOutput,
} from '@/ai/types/provide-government-scheme-information';
import {
  ProvideGovernmentSchemeInformationInputSchema,
  ProvideGovernmentSchemeInformationOutputSchema,
} from '@/ai/types/provide-government-scheme-information';

export async function provideGovernmentSchemeInformation(
  input: ProvideGovernmentSchemeInformationInput
): Promise<ProvideGovernmentSchemeInformationOutput> {
  return provideGovernmentSchemeInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideGovernmentSchemeInformationPrompt',
  input: {schema: ProvideGovernmentSchemeInformationInputSchema},
  output: {schema: ProvideGovernmentSchemeInformationOutputSchema},
  prompt: `You are KrishiMitra, a digital assistant for Indian farmers. A farmer is asking about government schemes, subsidies, or financial aid. Your role is to provide information and guidance, not financial advice. Your response must be in clear, readable text with bullet points using '-'. Respond in the same language as the user's query.

Your response must follow this structure:
1.  **Context**: Start with "[Information on Government Schemes:]".
2.  **List Relevant Schemes**: Name 1-3 central or state schemes that fit the query (e.g., PM-KISAN, PM Fasal Bima Yojana, SMAM).
3.  **Briefly Describe Purpose**: Provide a one-sentence description of what each scheme does.
4.  **Direct to Official Source**: Conclude by stating that the application process is handled through their nearest Krishi Bhavan or a designated online portal (e.g., https://pmkisan.gov.in). Advise them to visit their local Krishi Bhavan with their land documents and farmer ID for accurate information and assistance. Never promise any monetary amounts.

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
