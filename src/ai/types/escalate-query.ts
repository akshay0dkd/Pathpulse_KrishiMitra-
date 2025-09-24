import {z} from 'genkit';

export const EscalateQueryInputSchema = z.object({
  query: z.string().describe('The user query to be escalated.'),
  language: z.string().describe("The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."),
});
export type EscalateQueryInput = z.infer<typeof EscalateQueryInputSchema>;

export const EscalateQueryOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The structured escalation response in the specified language.'
    ),
});
export type EscalateQueryOutput = z.infer<typeof EscalateQueryOutputSchema>;
