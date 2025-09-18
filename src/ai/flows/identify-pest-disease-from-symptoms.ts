'use server';

/**
 * @fileOverview Identifies potential pests or diseases affecting crops based on symptom descriptions.
 * This flow now acts as an analyzer, extracting structured data from the user query.
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
  prompt: `You are an agricultural expert AI named "KrishiMitra". Your only task is to analyze a farmer's query and identify the exact CROP and the specific PROBLEM mentioned.

**Instructions:**
1. Read the user's input carefully, which may be in English or Malayalam.
2. Identify the primary CROP (e.g., Banana, Rice, Coconut). If no crop is mentioned, return "unknown".
3. Identify the specific PROBLEM (e.g., leaf spot, aphids, fertilizer, watering). If it's a general greeting or unrelated question, return "unknown".
4. Determine your confidence (high, medium, or low) based on how specific the user's query is.
5. Your output MUST be a valid JSON object.

**Examples:**
User Input: "My banana plant has yellow leaves"
Output: { "crop": "banana", "problem": "yellow leaves", "confidence": "high", "explanation": "Query contains both crop and a clear symptom." }

User Input: "What fertilizer for rice?"
Output: { "crop": "rice", "problem": "fertilizer", "confidence": "high", "explanation": "Specific crop and topic identified." }

User Input: "Hello"
Output: { "crop": "unknown", "problem": "unknown", "confidence": "low", "explanation": "This is a general greeting, not a specific agricultural query." }

User Input: "വാഴയിലെ തവിട്ട് പുള്ളികൾക്ക് എന്ത് ചെയ്യണം?"
Output: { "crop": "banana", "problem": "leaf spot", "confidence": "high", "explanation": "Query in Malayalam identifies both crop (vazha) and problem (brown spots)." }

User Input: "plant is sick"
Output: { "crop": "unknown", "problem": "sick plant", "confidence": "low", "explanation": "Query is too vague. Crop and specific symptoms are missing." }

Now, analyze this user input: {{{symptoms}}}
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
    // This flow now returns the structured JSON from the AI.
    // The calling action will handle the database lookup or escalation.
    return output!;
  }
);
