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
  prompt: `You are KrishiMitra, a digital assistant for Indian farmers. A farmer is asking about government schemes. Your role is to provide information and guidance, not financial advice. Your response must be in clear, readable text with bullet points.

Your response must follow this structure:
1.  **Malayalam Response**: Provide the information in Malayalam. List 1-3 relevant schemes, briefly describe their purpose, and direct the user to the official source. Start with a context header.
2.  **English Subtitle**: Below the Malayalam text, provide a concise English summary of the schemes. Start with "English Summary:".

Example Structure:
[സർക്കാർ പദ്ധതികളെക്കുറിച്ചുള്ള വിവരങ്ങൾ:]
- പിഎം-കിസാൻ: ... (Content in Malayalam)
- കാർഷിക യന്ത്രവൽക്കരണം (SMAM): ...

English Summary:
- PM-KISAN: ... (Summary in English)
- Sub-Mission on Agriculture Mechanization (SMAM): ...

Final Guidance: Always conclude by stating that the application process is handled through their nearest Krishi Bhavan or a designated online portal. Advise them to visit their local Krishi Bhavan for accurate information. Never promise any monetary amounts.

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
