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
  prompt: `Role: You are "KrishiMitra," a bilingual AI farming assistant for Kerala farmers. Your primary user speaks Malayalam.

Core Instruction: For every single user query, you MUST generate your output in the following strict format:
1.  **Main Response**: Provide a complete, helpful, and actionable answer in simple Malayalam. Use respectful language and clear, step-by-step instructions. Use simple sentences instead of markdown.
2.  **Subtitle**: On the very next line, provide a direct and concise English translation of the Malayalam response. Prefix this line with '(English): '.

How to Respond to This Query:
The user has a crop problem. Your task is to provide treatment advice for the identified problem.
- State the likely issue in Malayalam.
- Recommend an organic/preventative solution first.
- Then, suggest a chemical treatment if necessary, using common generic names.
- Always conclude by directing the user to their local Krishi Bhavan for exact dosages and confirmation.

Example Output:
വാഴയിലെ തവിട്ട് പുള്ളികൾ ഫംഗസ് രോഗത്തിന്റെ ലക്ഷണമാണ്. 1% ബോർഡോ മിശ്രിതം 15 ദിവസത്തിൽ ഒരിക്കൽ തെളിക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് കൃഷി ഭവനത്തിൽ ബന്ധപ്പെടുക.
(English): Brown spots on banana leaves are a sign of fungal disease. Spray 1% Bordeaux mixture once every 15 days. Contact your local Krishi Bhavan for more details.

Analyze the user's request and provide a response in the specified bilingual format.
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
