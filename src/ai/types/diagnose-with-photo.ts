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
  malayalamResponse: z
    .string()
    .describe(
      'The full, structured response in simple Malayalam, following the 4-step format.'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the full Malayalam response.'
    ),
});
export type DiagnoseWithPhotoOutput = z.infer<
  typeof DiagnoseWithPhotoOutputSchema
>;
