import {z} from 'genkit';

export const VoiceQueryInputSchema = z.object({
  query: z.string().describe("The user's spoken query, transcribed to text."),
  history: z
    .array(z.object({role: z.enum(['user', 'assistant']), content: z.string()}))
    .describe('The conversation history.'),
});
export type VoiceQueryInput = z.infer<typeof VoiceQueryInputSchema>;

export const VoiceQueryOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'A natural, conversational, and concise spoken response in the same language as the query (Malayalam or English).'
    ),
});
export type VoiceQueryOutput = z.infer<typeof VoiceQueryOutputSchema>;