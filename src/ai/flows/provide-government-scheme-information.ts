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
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. A farmer is asking about government schemes, subsidies, or financial aid. Your role is to provide information and guidance, not financial advice. Your response must be in clear, readable text with line breaks and bullet points using '*'.

Your response must be in simple Malayalam first, followed by a concise English translation. It must follow this structure:
1.  **Acknowledge**: Start with "[Information on Government Schemes...]".
2.  **Scheme Identification**: Name the relevant scheme(s) (e.g., "PM-KISAN," "Sub-Mission on Agriculture Mechanization (SMAM)").
3.  **Objective**: Briefly state the purpose of the scheme.
4.  **Eligibility (General)**: Mention general eligibility criteria.
5.  **How to Apply**: State that the application process, required documents, and detailed eligibility are available at their local Krishi Bhavan. You MUST always direct them there for official information and assistance. Never promise any monetary amounts.

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
