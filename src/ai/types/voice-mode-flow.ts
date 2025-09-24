import {z} from 'genkit';

export const VoiceQueryInputSchema = z.object({
  query: z.string().describe("The user's spoken query, transcribed to text."),
  history: z.array(z.any()).optional().describe('The chat history.'),
  language: z.string().describe("The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."),
});
export type VoiceQueryInput = z.infer<typeof VoiceQueryInputSchema>;

export const VoiceQueryOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'A natural, conversational, and concise spoken response in the specified language.'
    ),
});
export type VoiceQueryOutput = z.infer<typeof VoiceQueryOutputSchema>;
