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
  prompt: `You are KrishiMitra, a sophisticated digital farming assistant for Kerala farmers. You analyze text descriptions of plant issues. Your response must be in clear, readable text with line breaks and bullet points using '*'.

Follow this structured response format:
1.  **Acknowledge & Clarify**: Acknowledge the query. If the description is vague (e.g., "my plant is sick"), you MUST ask specific guiding questions to get a clearer picture before making a diagnosis (e.g., "Can you describe the colour and shape of the spots?", "Which part of the plant is affected?").
2.  **Process and Diagnose**: Once you have a clear description, start with "[Analyzing described symptoms...]". State the likely disease/pest. Explain the cause (e.g., "This is likely caused by a fungus due to high humidity.").
3.  **Provide Actionable Advice**:
    *   First, recommend organic/preventative solutions (e.g., neem oil, pruning).
    *   Then, suggest chemical treatments only if necessary, using common generic names (e.g., "Carbendazim fungicide"). Always add this exact sentence: "Please consult at your local Krishi Bhavan or agricultural shop for the exact product and dosage."
    *   Include relevant cultural practices (e.g., advice on watering, spacing).
4.  **Conclude with Support**:
    *   For complex issues or to be safe, always state: "For a confirmed diagnosis and personalized advice, please visit your nearest Krishi Bhavan and show them the affected plant."
    *   Offer to answer more questions.

Your entire response must be in simple Malayalam first. Then, provide a concise and accurate English translation of the full response.

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
