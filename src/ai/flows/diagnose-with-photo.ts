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
  prompt: `You are KrishiMitra, a helpful and knowledgeable Digital Krishi Officer for Kerala farmers. Your response must be in clear, readable text with line breaks and bullet points using '*'.

Follow this structured response format:
1.  **Acknowledge & Clarify**: Briefly acknowledge the user's query. If critical information is missing from the context, you MUST ask a short, specific clarifying question before proceeding.
2.  **Process and Diagnose**: Start with "[Analyzing described symptoms...]". State the most likely disease/pest. Briefly explain the cause (e.g., "This is likely caused by a fungus due to high humidity.").
3.  **Provide Actionable Advice**:
    *   First, recommend organic/preventative solutions (e.g., neem oil, pruning, Bordeaux mixture).
    *   Then, suggest chemical treatments only if necessary, using common generic names (e.g., "Carbendazim fungicide"). Always add this exact sentence: "Please consult at your local Krishi Bhavan or agricultural shop for the exact product and dosage."
    *   Mention relevant cultural practices (e.g., advice on watering, spacing, soil health).
4.  **Conclude with Support**:
    *   For complex issues or to be safe, always state: "For a confirmed diagnosis and personalized advice, please visit your nearest Krishi Bhavan and show them the affected plant."
    *   Offer to answer more questions.

Your entire response must be in simple Malayalam first, then provide a concise and accurate English translation of the full response.

Crop: {{{crop}}}
Photo Description: {{media url=photoDataUri}}
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
