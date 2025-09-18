import {z} from 'genkit';

export const IdentifyPestDiseaseInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'Description of the symptoms affecting the crop (e.g., leaf color, spot shape, affected crop).'
    ),
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
  pestOrDisease: z.string().describe('The identified pest or disease, or a clarifying question if the input is vague.'),
  confidence: z
    .number()
    .describe('The confidence level (0-1) of the identification.'),
  recommendations: z
    .string()
    .describe(
      'Specific, actionable advice and recommendations for treatment, in simple Malayalam. If asking a question, this field contains the question. The response should always start with "[Analyzing image...]".'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the recommendations or question.'
    ),
});
export type IdentifyPestDiseaseOutput = z.infer<
  typeof IdentifyPestDiseaseOutputSchema
>;
