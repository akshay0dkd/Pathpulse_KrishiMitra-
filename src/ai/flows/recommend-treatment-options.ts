
'use server';

/**
 * @fileOverview Recommends treatment options for identified pests or diseases.
 *
 * - recommendTreatmentOptions - A function that recommends treatment options.
 */

import {ai} from '@/ai/genkit';
import type {
  RecommendTreatmentOptionsInput,
  RecommendTreatmentOptionsOutput,
} from '@/ai/types/recommend-treatment-options';
import {
  RecommendTreatmentOptionsInputSchema,
  RecommendTreatmentOptionsOutputSchema,
} from '@/ai/types/recommend-treatment-options';

export async function recommendTreatmentOptions(
  input: RecommendTreatmentOptionsInput
): Promise<RecommendTreatmentOptionsOutput> {
  return recommendTreatmentOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTreatmentOptionsPrompt',
  input: {schema: RecommendTreatmentOptionsInputSchema},
  output: {schema: RecommendTreatmentOptionsOutputSchema},
  prompt: `Role: You are "KrishiMitra," an AI farming assistant for Indian farmers.

Instruction: Respond in the language specified by the 'language' code: {{language}}.

- For 'ml-IN', respond ONLY in Malayalam. If the query is in English, still respond in Malayalam and add an (English): subtitle.
- For 'en-IN', respond ONLY in English.

Task: The user has a crop problem. Provide treatment advice for the identified problem.
1. State the likely issue.
2. Recommend an organic/preventative solution first.
3. Suggest a chemical treatment if necessary, using generic names.
4. Always conclude by directing the user to their local Krishi Bhavan/Agri office for confirmation.

Example for 'ml-IN':
വാഴയിലെ തവിട്ട് പുള്ളികൾ ഫംഗസ് രോഗത്തിന്റെ ലക്ഷണമാണ്. 1% ബോർഡോ മിശ്രിതം 15 ദിവസത്തിൽ ഒരിക്കൽ തെളിക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് കൃഷി ഭവനത്തിൽ ബന്ധപ്പെടുക.
(English): Brown spots on banana leaves are a sign of fungal disease. Spray 1% Bordeaux mixture once every 15 days. Contact your local Krishi Bhavan for more details.

Example for 'en-IN':
The brown spots on the banana leaves are a sign of a fungal disease. Spray a 1% Bordeaux mixture once every 15 days. For more information, contact your local Krishi Bhavan.


Analyze the user's request and provide a response in the specified language.
Pest or Disease: {{{pestOrDisease}}}
Crop: {{{crop}}}
`,
});

const recommendTreatmentOptionsFlow = ai.defineFlow(
  {
    name: 'recommendTreatmentOptionsFlow',
    inputSchema: RecommendTreatmentOptionsInputSchema,
    outputSchema: RecommendTreatmentOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    