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
  malayalamResponse: z
    .string()
    .describe(
      'The full, structured response in simple Malayalam. This can be a clarifying question or a full diagnosis with advice, following the 4-step format.'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the full Malayalam response.'
    ),
});
export type IdentifyPestDiseaseOutput = z.infer<
  typeof IdentifyPestDiseaseOutputSchema
>;
