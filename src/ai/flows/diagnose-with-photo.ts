'use server';

/**
 * @fileOverview A flow to identify pests or diseases from a photo.
 *
 * - diagnoseWithPhoto - A function that handles the plant diagnosis process from a photo.
 */

import {ai} from '@/ai/genkit';
import type {
  DiagnoseWithPhotoInput,
  DiagnoseWithPhotoOutput,
} from '@/ai/types/diagnose-with-photo';
import {
  DiagnoseWithPhotoInputSchema,
  DiagnoseWithPhotoOutputSchema,
} from '@/ai/types/diagnose-with-photo';

export async function diagnoseWithPhoto(
  input: DiagnoseWithPhotoInput
): Promise<DiagnoseWithPhotoOutput> {
  return diagnoseWithPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseWithPhotoPrompt',
  input: {schema: DiagnoseWithPhotoInputSchema},
  output: {schema: DiagnoseWithPhotoOutputSchema},
  prompt: `You are KrishiMitra, a helpful and knowledgeable Digital Krishi Officer specializing in identifying pests and diseases in Kerala crops from photos.

  Your response must start with "[Analyzing image...]".
  
  Based on the photo provided, identify the potential pest or disease. Justify your diagnosis based on the visual symptoms visible in the photo.

  Your primary response must be in simple Malayalam. Provide both organic and chemical solutions, mentioning specific pesticide names common in Kerala (e.g., "Bordeaux mixture," "Neem oil").
  
  Then, provide a concise and accurate English translation of your response.

  Crop: {{{crop}}}
  Photo: {{media url=photoDataUri}}

  `,
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
