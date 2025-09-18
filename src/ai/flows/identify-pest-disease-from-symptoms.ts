'use server';

/**
 * @fileOverview Identifies potential pests or diseases affecting crops based on symptom descriptions.
 *
 * - identifyPestDisease - A function that identifies pests/diseases from symptoms.
 */

import {ai} from '@/ai/genkit';
import type {
  IdentifyPestDiseaseInput,
  IdentifyPestDiseaseOutput,
} from '@/ai/types/identify-pest-disease-from-symptoms';
import {
  IdentifyPestDiseaseInputSchema,
  IdentifyPestDiseaseOutputSchema,
} from '@/ai/types/identify-pest-disease-from-symptoms';

export async function identifyPestDisease(
  input: IdentifyPestDiseaseInput
): Promise<IdentifyPestDiseaseOutput> {
  return identifyPestDiseaseFlow(input);
}

const identifyPestDiseasePrompt = ai.definePrompt({
  name: 'identifyPestDiseasePrompt',
  input: {schema: IdentifyPestDiseaseInputSchema},
  output: {schema: IdentifyPestDiseaseOutputSchema},
  prompt: `You are KrishiMitra, a sophisticated vision model AI for Kerala farmers. You analyze text descriptions of plant issues as if you were analyzing an image.

  Your response must start with "[Analyzing image...]".

  Based on the symptoms provided, act as if you are analyzing an image. Identify the potential pest or disease. Justify your diagnosis based on the visual symptoms described.
  
  If the description is vague (e.g., "my plant is sick"), you MUST ask specific guiding questions to get a clearer picture before making a diagnosis. Examples:
  - "Can you describe the colour and shape of the spots?"
  - "Is there any white, powdery substance on the leaves?"
  - "Are the leaves turning yellow or curling up?"
  - "Which part of the plant is affected? Leaves, stem, or fruit?"
  - "Please mention the crop name."

  Once you have a clear description, your primary response must be in simple Malayalam. Provide both organic and chemical solutions, mentioning specific pesticide names common in Kerala (e.g., "Bordeaux mixture," "Neem oil").
  
  Then, provide a concise and accurate English translation of your response.

  Crop: {{{crop}}}
  Symptoms (as image description): {{{symptoms}}}
  Location: {{#if location}}{{{location}}}{{else}}Thrissur, Kerala{{/if}}
  `,
});

const identifyPestDiseaseFlow = ai.defineFlow(
  {
    name: 'identifyPestDiseaseFlow',
    inputSchema: IdentifyPestDiseaseInputSchema,
    outputSchema: IdentifyPestDiseaseOutputSchema,
  },
  async input => {
    const {output} = await identifyPestDiseasePrompt(input);
    return output!;
  }
);
