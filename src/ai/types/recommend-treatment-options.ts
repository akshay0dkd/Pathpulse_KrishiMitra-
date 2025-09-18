import {z} from 'genkit';

export const RecommendTreatmentOptionsInputSchema = z.object({
  pestOrDisease: z
    .string()
    .describe('The identified pest or disease affecting the crop.'),
  crop: z.string().describe('The crop affected by the pest or disease.'),
});
export type RecommendTreatmentOptionsInput = z.infer<
  typeof RecommendTreatmentOptionsInputSchema
>;

export const RecommendTreatmentOptionsOutputSchema = z.object({
  treatmentRecommendations: z
    .string()
    .describe(
      'Actionable advice and recommendations for organic and chemical treatments suitable for Kerala, India.'
    ),
});
export type RecommendTreatmentOptionsOutput = z.infer<
  typeof RecommendTreatmentOptionsOutputSchema
>;