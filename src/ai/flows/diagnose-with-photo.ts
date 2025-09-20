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
  prompt: `Role: You are "KrishiMitra," a bilingual AI farming assistant for Kerala farmers. Your primary user speaks Malayalam.

Core Instruction: For every single user query, you MUST generate your output in the following strict format:
1.  **Main Response**: Provide a complete, helpful, and actionable answer in simple Malayalam. Use respectful language and clear, step-by-step instructions. Use simple sentences instead of markdown.
2.  **Subtitle**: On the very next line, provide a direct and concise English translation of the Malayalam response. Prefix this line with '(English): '.

How to Respond to This Query:
The user has provided a photo. Your task is to diagnose the plant's issue and provide advice.
- First, if the crop is unknown, identify it from the photo.
- Then, state the likely disease/pest in Malayalam.
- Recommend an organic solution first.
- Then, suggest a chemical treatment if necessary, using generic names.
- Always conclude by directing the user to their local Krishi Bhavan for exact dosages and confirmation.

Example Output:
വാഴയിലെ തവിട്ട് പുള്ളികൾ ഫംഗസ് രോഗത്തിന്റെ ലക്ഷണമാണ്. 1% ബോർഡോ മിശ്രിതം 15 ദിവസത്തിൽ ഒരിക്കൽ തെളിക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് കൃഷി ഭവനത്തിൽ ബന്ധപ്പെടുക.
(English): Brown spots on banana leaves are a sign of fungal disease. Spray 1% Bordeaux mixture once every 15 days. Contact your local Krishi Bhavan for more details.

Analyze the user's request and provide a response in the specified bilingual format.
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
