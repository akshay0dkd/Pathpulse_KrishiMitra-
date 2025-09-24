import {z} from 'genkit';

export const DiagnoseWithPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  crop: z.string().describe('The crop that is affected by the symptoms.'),
  language: z.string().describe("The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."),
});
export type DiagnoseWithPhotoInput = z.infer<
  typeof DiagnoseWithPhotoInputSchema
>;

export const DiagnoseWithPhotoOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The full, structured response in the specified language.'
    ),
});
export type DiagnoseWithPhotoOutput = z.infer<
  typeof DiagnoseWithPhotoOutputSchema
>;
