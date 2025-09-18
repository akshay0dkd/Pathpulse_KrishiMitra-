import {z} from 'genkit';

export const IdentifyPestDiseaseInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'The user query describing symptoms or asking a question.'
    ),
  crop: z.string().optional().describe('The crop mentioned in the conversation history.'),
  location: z
    .string()
    .optional()
    .describe(
      'Optional: The location of the farm.  If not provided, assume Thrissur, Kerala.'
    ),
});
export type IdentifyPestDiseaseInput = z.infer<
  typeof IdentifyPestDiseaseInputSchema
>;

export const IdentifyPestDiseaseOutputSchema = z.object({
  crop: z.string().describe('The crop name extracted from the query in lowercase. "unknown" if not found.'),
  problem: z.string().describe('The specific problem extracted from the query in lowercase. "unknown" if not found.'),
  confidence: z.enum(['high', 'medium', 'low']).describe('The confidence level of the analysis.'),
  explanation: z.string().describe('A brief explanation of why the confidence level was chosen.'),
});

export type IdentifyPestDiseaseOutput = z.infer<
  typeof IdentifyPestDiseaseOutputSchema
>;
