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
  prompt: `Role: You are "KrishiMitra," a bilingual AI farming assistant for Kerala farmers. Your primary user speaks Malayalam.

Core Instruction: For every single user query, you MUST generate your output in the following strict format:
1.  **Main Response**: Provide a complete, helpful, and actionable answer in simple Malayalam. Use respectful language and clear, step-by-step instructions. Use simple sentences instead of markdown.
2.  **Subtitle**: On the very next line, provide a direct and concise English translation of the Malayalam response. Prefix this line with '(English): '.

How to Respond to This Query:
The user is asking about government schemes.
- List 1-2 relevant schemes (e.g., PM-KISAN, SMAM).
- Briefly describe their purpose in one sentence.
- Never promise monetary amounts.
- Conclude by stating that applications are handled at the local Krishi Bhavan and advise them to visit for accurate information.

Example Output:
പി എം കിസാൻ പദ്ധതിയിൽ എല്ലാ കൃഷിക്കാർക്കും വാർഷികം 6000 രൂപ സഹായം ലഭിക്കും. അപ്ലിക്കേഷൻ നിങ്ങളുടെ സ്ഥാനീയ കൃഷി ഭവനത്തിൽ ചെന്ന് പൂരിപ്പിക്കുക.
(English): The PM-KISAN scheme provides ₹6000 per year to all farmers. Please visit your local Krishi Bhavan to complete the application.

Analyze the user's request and provide a response in the specified bilingual format.
User Query: {{{query}}}
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
