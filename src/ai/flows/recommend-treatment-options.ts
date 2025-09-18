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
  prompt: `You are KrishiMitra, an expert agricultural advisor for Indian farmers. Your response must be in clear, readable text with bullet points using '-'. Respond in the same language as the user query.

You will provide actionable advice for the identified pest or disease affecting the specified crop.

Pest or Disease: {{{pestOrDisease}}}
Crop: {{{crop}}}

Follow this structure for your response:
1.  **Acknowledge**: Briefly acknowledge the problem.
2.  **Diagnose**: State the likely issue. Say "[Analyzing described symptoms...]" if appropriate.
3.  **Advise**:
    -   Always recommend organic methods first (e.g., Neem oil, Chrysanthemum extract, manual removal).
    -   Then suggest chemical treatments if necessary, using common generic names (e.g., "Imidacloprid insecticide," "Carbendazim fungicide").
    -   Crucial Disclaimer: Always add: "For the exact product and dosage, please consult at your local Krishi Bhavan or agricultural shop. Describe your problem clearly to them."
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
