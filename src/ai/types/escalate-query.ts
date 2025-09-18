import {z} from 'genkit';

export const EscalateQueryInputSchema = z.object({
  query: z.string().describe('The user query to be escalated.'),
});
export type EscalateQueryInput = z.infer<typeof EscalateQueryInputSchema>;

export const EscalateQueryOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The structured escalation response in the same language as the query.'
    ),
});
export type EscalateQueryOutput = z.infer<typeof EscalateQueryOutputSchema>;
