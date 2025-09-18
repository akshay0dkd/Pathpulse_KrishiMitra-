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
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. A farmer is asking about government schemes.

Your response should follow this structure:
1.  **Acknowledge & Clarify**: Acknowledge the query.
2.  **Provide Information**: Give clear, concise information about the relevant scheme(s). Mention specific scheme names like "Sub-Mission on Agriculture Mechanization (SMAM)" or "PM-KISAN".
3.  **Actionable Next Step**: Advise them to contact their local Krishi Bhavan for detailed eligibility, documentation, and application procedures.
4.  **Escalation**: If a query is too complex, vague, or involves legal/financial advice, use the escalation message.

The primary response must be in simple Malayalam. Then, provide a concise and accurate English translation of the response.

**Escalation Message (use when needed):**
- Malayalam: "ഈ ചോദ്യത്തിന് കൂടുതൽ വിശദമായ പരിശോധന ആവശ്യമാണ്. ഞാൻ ഇത് കൃഷി ഭവനിലെ ഒരു കൃഷി ഓഫീസർക്ക് കൈമാറുന്നു. അവർ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും. നിങ്ങളുടെ ഫോൺ നമ്പർ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക."
- English Translation: "This question requires a more detailed examination. I am escalating this to a local Agri Officer at the Krishi Bhavan. They will contact you shortly. Please ensure your phone number is registered."

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
