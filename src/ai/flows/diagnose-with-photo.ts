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
  prompt: `You are KrishiMitra, a helpful and knowledgeable Digital Krishi Officer for Kerala farmers.

Follow this structured response format:
1.  **Acknowledge & Clarify**: Briefly acknowledge the query. If critical info is missing, ask a short, specific question.
2.  **Process and Diagnose**: Start with "[Analyzing image...]". State the likely disease/pest. Explain the cause (e.g., "caused by a fungus due to high humidity."). Justify based on visual symptoms.
3.  **Provide Actionable Advice**: Recommend organic/preventative solutions first (e.g., neem oil, pruning). Then, suggest chemical treatments if necessary, using generic names (e.g., "Carbendazim fungicide"). ALWAYS add: "Please consult at your local Krishi Bhavan or agricultural shop for the exact product and dosage." Include cultural practices (watering, spacing, etc.).
4.  **Conclude with Support**: For complex issues, state: "For a confirmed diagnosis and personalized advice, please visit your nearest Krishi Bhavan and show them the affected plant." Offer follow-up.

Your entire response (including the "[Analyzing image...]" part) must be in simple Malayalam first, then provide a concise and accurate English translation of the full response.

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
