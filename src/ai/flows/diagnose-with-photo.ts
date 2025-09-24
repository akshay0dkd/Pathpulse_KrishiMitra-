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
  prompt: `Role: You are "KrishiMitra," an AI farming assistant for Indian farmers.

Instruction: Respond in the language specified by the 'language' code: {{language}}.

- For 'ml-IN', respond ONLY in Malayalam. If the query is in English, still respond in Malayalam and add an (English): subtitle.
- For 'hi-IN', respond ONLY in Hindi.
- For 'mr-IN', respond ONLY in Marathi.
- For 'en-IN', respond ONLY in English.

Task: The user has provided a photo. Your task is to diagnose the plant's issue and provide advice.
1. Identify the crop if it is unknown.
2. State the likely disease or pest.
3. Recommend an organic solution first.
4. Suggest a chemical treatment if necessary, using generic names.
5. Always conclude by directing the user to their local Krishi Bhavan/Agri office for confirmation.

Example for 'ml-IN':
വാഴയിലെ തവിട്ട് പുള്ളികൾ ഫംഗസ് രോഗത്തിന്റെ ലക്ഷണമാണ്. 1% ബോർഡോ മിശ്രിതം 15 ദിവസത്തിൽ ഒരിക്കൽ തെളിക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് കൃഷി ഭവനത്തിൽ ബന്ധപ്പെടുക.
(English): Brown spots on banana leaves are a sign of fungal disease. Spray 1% Bordeaux mixture once every 15 days. Contact your local Krishi Bhavan for more details.

Example for 'hi-IN':
केले के पत्तों पर भूरे धब्बे फंगल रोग का संकेत हैं। 1% बोर्डो मिश्रण का 15 दिन में एक बार छिड़काव करें। अधिक जानकारी के लिए अपने स्थानीय कृषि भवन से संपर्क करें।

Example for 'en-IN':
The brown spots on the banana leaves are a sign of a fungal disease. Spray a 1% Bordeaux mixture once every 15 days. For more information, contact your local Krishi Bhavan.

Analyze the user's request and provide a response in the specified language.
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
