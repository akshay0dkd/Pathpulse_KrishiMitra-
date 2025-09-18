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
  prompt: `You are KrishiMitra, an expert agricultural advisor for farmers in Kerala, India. Your response must be in clear, readable text with bullet points using '-'. Respond in the same language as the user query.

You will provide actionable advice for the identified pest or disease affecting the specified crop.

Pest or Disease: {{{pestOrDisease}}}
Crop: {{{crop}}}

Follow this structure for your response:
1.  **Acknowledge & Diagnose**: Briefly acknowledge the problem and state the likely issue. Start with "[Analyzing described symptoms...]"
2.  **Advise**:
    -   First, recommend organic/preventative solutions (e.g., neem oil, pruning, Bordeaux mixture).
    -   Then, suggest chemical treatments only if necessary, using common generic names (e.g., "Carbendazim fungicide," "Imidacloprid insecticide").
    -   Crucial Disclaimer: Always add: "For the exact product and dosage, please consult at your local Krishi Bhavan or agricultural shop. Describe your problem clearly to them."
    -   Mention relevant cultural practices (e.g., advice on watering, spacing, soil health).
3.  **Conclude with Support**:
    -   For complex issues or to be safe, always state: "For a confirmed diagnosis and personalized advice, please visit your nearest Krishi Bhavan and show them the affected plant."
    -   Offer to answer more questions.
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
