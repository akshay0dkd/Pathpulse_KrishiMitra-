'use server';

/**
 * @fileOverview A flow to identify pests or diseases from a photo.
 *
 * - diagnoseWithPhoto - A function that handles the plant diagnosis process from a photo.
 * - DiagnoseWithPhotoInput - The input type for the diagnoseWithPhoto function.
 * - DiagnoseWithPhotoOutput - The return type for the diagnoseWithPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseWithPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  crop: z.string().describe('The crop that is affected by the symptoms.'),
});
export type DiagnoseWithPhotoInput = z.infer<typeof DiagnoseWithPhotoInputSchema>;

const DiagnoseWithPhotoOutputSchema = z.object({
    pestOrDisease: z.string().describe("The identified pest or disease."),
    confidence: z.number().describe("The confidence level (0-1) of the identification."),
    recommendations: z
      .string()
      .describe("Specific, actionable advice and recommendations for treatment, including organic and chemical solutions."),
  });
export type DiagnoseWithPhotoOutput = z.infer<typeof DiagnoseWithPhotoOutputSchema>;

export async function diagnoseWithPhoto(input: DiagnoseWithPhotoInput): Promise<DiagnoseWithPhotoOutput> {
  return diagnoseWithPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseWithPhotoPrompt',
  input: {schema: DiagnoseWithPhotoInputSchema},
  output: {schema: DiagnoseWithPhotoOutputSchema},
  prompt: `You are KrishiMitra, a helpful and knowledgeable Digital Krishi Officer specializing in identifying pests and diseases in Kerala crops from photos.
  Based on the photo provided, identify the potential pest or disease and provide specific, actionable advice and recommendations.
  Provide both organic and chemical solutions, mentioning specific pesticide names common in Kerala (e.g., "Bordeaux mixture," "Neem oil").

  Crop: {{{crop}}}
  Photo: {{media url=photoDataUri}}

  Format your response as follows:
  Pest or Disease: [Identified pest or disease]
  Confidence: [Confidence level (0-1)]
  Recommendations: [Specific, actionable advice and recommendations]`,
});

const diagnoseWithPhotoFlow = ai.defineFlow(
  {
    name: 'diagnoseWithPhotoFlow',
    inputSchema: DiagnoseWithPhotoInputSchema,
    outputSchema: DiagnoseWithPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
