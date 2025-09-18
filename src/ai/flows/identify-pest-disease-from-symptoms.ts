'use server';

/**
 * @fileOverview Identifies potential pests or diseases affecting crops based on symptom descriptions.
 *
 * - identifyPestDisease - A function that identifies pests/diseases from symptoms.
 * - IdentifyPestDiseaseInput - The input type for the identifyPestDisease function.
 * - IdentifyPestDiseaseOutput - The return type for the identifyPestDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPestDiseaseInputSchema = z.object({
  symptoms: z
    .string()
    .describe("Description of the symptoms affecting the crop (e.g., leaf color, spot shape, affected crop)."),
  crop: z.string().describe("The crop that is affected by the symptoms."),
  location: z
    .string()
    .optional()
    .describe("Optional: The location of the farm.  If not provided, assume Thrissur, Kerala."),
});
export type IdentifyPestDiseaseInput = z.infer<typeof IdentifyPestDiseaseInputSchema>;

const IdentifyPestDiseaseOutputSchema = z.object({
  pestOrDisease: z.string().describe("The identified pest or disease."),
  confidence: z.number().describe("The confidence level (0-1) of the identification."),
  recommendations: z
    .string()
    .describe("Specific, actionable advice and recommendations for treatment, including organic and chemical solutions."),
});
export type IdentifyPestDiseaseOutput = z.infer<typeof IdentifyPestDiseaseOutputSchema>;

export async function identifyPestDisease(input: IdentifyPestDiseaseInput): Promise<IdentifyPestDiseaseOutput> {
  return identifyPestDiseaseFlow(input);
}

const identifyPestDiseasePrompt = ai.definePrompt({
  name: 'identifyPestDiseasePrompt',
  input: {schema: IdentifyPestDiseaseInputSchema},
  output: {schema: IdentifyPestDiseaseOutputSchema},
  prompt: `You are KrishiMitra, a helpful and knowledgeable Digital Krishi Officer specializing in identifying pests and diseases in Kerala crops.
  Based on the symptoms provided, identify the potential pest or disease and provide specific, actionable advice and recommendations.
  Provide both organic and chemical solutions, mentioning specific pesticide names common in Kerala (e.g., "Bordeaux mixture," "Neem oil").

  Crop: {{{crop}}}
  Symptoms: {{{symptoms}}}
  Location: {{#if location}}{{{location}}}{{else}}Thrissur, Kerala{{/if}}

  Format your response as follows:
  Pest or Disease: [Identified pest or disease]
  Confidence: [Confidence level (0-1)]
  Recommendations: [Specific, actionable advice and recommendations]`,
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
