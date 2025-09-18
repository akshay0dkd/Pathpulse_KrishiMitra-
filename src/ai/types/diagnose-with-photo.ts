import {z} from 'genkit';

export const DiagnoseWithPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  crop: z.string().describe('The crop that is affected by the symptoms.'),
});
export type DiagnoseWithPhotoInput = z.infer<
  typeof DiagnoseWithPhotoInputSchema
>;

export const DiagnoseWithPhotoOutputSchema = z.object({
  pestOrDisease: z.string().describe('The identified pest or disease.'),
  confidence: z
    .number()
    .describe('The confidence level (0-1) of the identification.'),
  recommendations: z
    .string()
    .describe(
      'Specific, actionable advice and recommendations for treatment, including organic and chemical solutions, in Malayalam.'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the recommendations.'
    ),
});
export type DiagnoseWithPhotoOutput = z.infer<
  typeof DiagnoseWithPhotoOutputSchema
>;