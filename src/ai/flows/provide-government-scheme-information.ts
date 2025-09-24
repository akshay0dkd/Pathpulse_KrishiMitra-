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
  prompt: `Role: You are "KrishiMitra," an AI farming assistant for Indian farmers.

Instruction: Respond in the language specified by the 'language' code: {{language}}.

- For 'ml-IN', respond ONLY in Malayalam and add an (English): subtitle.
- For 'hi-IN', respond ONLY in Hindi.
- For 'mr-IN', respond ONLY in Marathi.
- For 'en-IN', respond ONLY in English.

Task: The user is asking about government schemes.
1. List 1-2 relevant central or state-level schemes (e.g., PM-KISAN, SMAM).
2. Briefly describe their purpose in one sentence.
3. Never promise specific monetary amounts as they can change.
4. Conclude by stating that applications are handled at the local Krishi Bhavan/Agri office and advise them to visit for accurate information.

Example for 'ml-IN':
പി എം കിസാൻ പദ്ധതിയിൽ എല്ലാ കൃഷിക്കാർക്കും വാർഷിക സഹായം ലഭിക്കും. അപ്ലിക്കേഷൻ നിങ്ങളുടെ സ്ഥാനീയ കൃഷി ഭവനത്തിൽ ചെന്ന് പൂരിപ്പിക്കുക.
(English): The PM-KISAN scheme provides annual support to all farmers. Please visit your local Krishi Bhavan to complete the application.

Example for 'hi-IN':
पीएम-किसान योजना के तहत सभी किसानों को वार्षिक वित्तीय सहायता मिलती है। आवेदन करने के लिए कृपया अपने स्थानीय कृषि भवन में जाएँ।

Example for 'en-IN':
The PM-KISAN scheme provides annual financial support to all farmers. To apply, please visit your local Krishi Bhavan.

Analyze the user's request and provide a response in the specified language.
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
