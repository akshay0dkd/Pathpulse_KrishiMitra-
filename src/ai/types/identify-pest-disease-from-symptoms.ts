import {z} from 'genkit';

export const IdentifyPestDiseaseInputSchema = z.object({
  symptoms: z.string().describe('Description of the symptoms affecting the crop (e.g., leaf color, spot shape, affected crop).'),
  crop: z.string().describe('The crop that is affected by the symptoms.'),
  location: z
    .string()
    .optional()
    .describe(
      'Optional: The location of the farm.  If not provided, assume Thrissur, Kerala.'
    ),
});
export type IdentifyPestDiseaseInput = z.infer<
  typeof IdentifyPestDiseaseInputSchema
>;

export const IdentifyPestDiseaseOutputSchema = z.object({
  pestOrDisease: z.string().describe('The identified pest or disease.'),
  confidence: z
    .number()
    .describe('The confidence level (0-1) of the identification.'),
  recommendations: z
    .string()
    .describe(
      'Specific, actionable advice and recommendations for treatment, in simple Malayalam. Recommend organic solutions first, then chemical treatments.'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the recommendations.'
    ),
});
export type IdentifyPestDiseaseOutput = z.infer<
  typeof IdentifyPestDiseaseOutputSchema
>;