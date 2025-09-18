import {z} from 'genkit';

export const EscalateQueryInputSchema = z.object({
  query: z.string().describe('The user query to be escalated.'),
});
export type EscalateQueryInput = z.infer<
  typeof EscalateQueryInputSchema
>;

export const EscalateQueryOutputSchema = z.object({
  malayalamResponse: z
    .string()
    .describe(
      'The structured escalation response in simple Malayalam.'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the Malayalam response.'
    ),
});
export type EscalateQueryOutput = z.infer<
  typeof EscalateQueryOutputSchema
>;