import {z} from 'genkit';

export const VoiceQueryInputSchema = z.object({
  query: z.string().describe("The user's spoken query, transcribed to text."),
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
