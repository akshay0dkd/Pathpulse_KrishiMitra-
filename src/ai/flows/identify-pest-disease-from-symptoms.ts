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
  prompt: `You are KrishiMitra, a helpful and knowledgeable Digital Krishi Officer specializing in identifying pests and diseases in Kerala crops.
  
  Based on the symptoms provided, identify the potential pest or disease.
  
  Your primary response must be in simple Malayalam. Provide both organic and chemical solutions, mentioning specific pesticide names common in Kerala (e.g., "Bordeaux mixture," "Neem oil").
  
  Then, provide a concise and accurate English translation of your response.

  Crop: {{{crop}}}
  Symptoms: {{{symptoms}}}
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