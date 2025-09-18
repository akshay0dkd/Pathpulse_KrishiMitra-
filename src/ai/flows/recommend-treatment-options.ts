// src/ai/flows/recommend-treatment-options.ts
'use server';

/**
 * @fileOverview Recommends treatment options for identified pests or diseases.
 *
 * - recommendTreatmentOptions - A function that recommends treatment options.
 * - RecommendTreatmentOptionsInput - The input type for the recommendTreatmentOptions function.
 * - RecommendTreatmentOptionsOutput - The return type for the recommendTreatmentOptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTreatmentOptionsInputSchema = z.object({
  pestOrDisease: z
    .string()
    .describe('The identified pest or disease affecting the crop.'),
  crop: z.string().describe('The crop affected by the pest or disease.'),
});
export type RecommendTreatmentOptionsInput = z.infer<
  typeof RecommendTreatmentOptionsInputSchema
>;

const RecommendTreatmentOptionsOutputSchema = z.object({
  treatmentRecommendations: z
    .string()
    .describe(
      'Actionable advice and recommendations for organic and chemical treatments suitable for Kerala, India.'
    ),
});
export type RecommendTreatmentOptionsOutput = z.infer<
  typeof RecommendTreatmentOptionsOutputSchema
>;

export async function recommendTreatmentOptions(
  input: RecommendTreatmentOptionsInput
): Promise<RecommendTreatmentOptionsOutput> {
  return recommendTreatmentOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTreatmentOptionsPrompt',
  input: {schema: RecommendTreatmentOptionsInputSchema},
  output: {schema: RecommendTreatmentOptionsOutputSchema},
  prompt: `You are an expert agricultural advisor for Kerala, India.

You will provide actionable advice and recommend appropriate organic and chemical treatments for the identified pest or disease affecting the specified crop.

Pest or Disease: {{{pestOrDisease}}}
Crop: {{{crop}}}

Provide recommendations suitable for Kerala farmers, including specific pesticide names common in the region (e.g., Bordeaux mixture, Neem oil). Recommend organic solutions first, then chemical treatments.`,
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
