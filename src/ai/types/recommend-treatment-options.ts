import {z} from 'genkit';

export const RecommendTreatmentOptionsInputSchema = z.object({
  pestOrDisease: z
    .string()
    .describe('The identified pest or disease affecting the crop.'),
  crop: z.string().describe('The crop affected by the pest or disease.'),
  language: z.string().describe("The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."),
});
export type RecommendTreatmentOptionsInput = z.infer<
  typeof RecommendTreatmentOptionsInputSchema
>;

export const RecommendTreatmentOptionsOutputSchema = z.object({
  treatmentRecommendations: z
    .string()
    .describe(
      'Actionable advice and recommendations for organic and chemical treatments in the specified language.'
    ),
});
export type RecommendTreatmentOptionsOutput = z.infer<
  typeof RecommendTreatmentOptionsOutputSchema
>;
