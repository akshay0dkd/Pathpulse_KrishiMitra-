'use server';

/**
 * @fileOverview A flow to handle voice-first interactions for the KrishiMitra assistant.
 *
 * - processVoiceQuery - A function that handles voice-based queries.
 */

import {ai} from '@/ai/genkit';
import type {VoiceQueryInput, VoiceQueryOutput} from '@/ai/types/voice-mode-flow';
import {
  VoiceQueryInputSchema,
  VoiceQueryOutputSchema,
} from '@/ai/types/voice-mode-flow';

export async function processVoiceQuery(
  input: VoiceQueryInput
): Promise<VoiceQueryOutput> {
  return voiceModeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceModePrompt',
  input: {schema: VoiceQueryInputSchema},
  output: {schema: VoiceQueryOutputSchema},
  prompt: `Role: You are "KrishiMitra," a bilingual AI farming assistant for Kerala farmers. You are in VOICE-ONLY mode. Your primary user speaks Malayalam.

Core Instruction: For every single user query, you MUST generate your output in the following strict format:
1.  **Main Response**: Provide a complete, helpful, and scannable answer in simple Malayalam. Your response should be conversational and concise, as if spoken. Use simple sentences.
2.  **Subtitle**: On the very next line, provide a direct and concise English translation of the Malayalam response. Prefix this line with '(English): '.

How to Respond to This Query:
The user has spoken their query. Your task is to provide a helpful, speech-like response in the specified bilingual format.
- Acknowledge and ask clarifying questions if needed (e.g., "Are the spots brown or yellow?").
- Give simple, actionable instructions.
- If you cannot answer or the issue is complex, say you are connecting them to an officer.

Example Output:
തവിട്ടുപുള്ളികളാണോ? അത് ഇലപ്പുള്ളി രോഗമാകാം. ഒരു ശതമാനം വീര്യമുള്ള ബോർഡോ മിശ്രിതം തളിക്കുന്നത് നല്ലതാണ്.
(English): Are they brown spots? It could be leaf spot disease. Spraying a 1% Bordeaux mixture is a good solution.

Analyze the user's spoken request and provide a response in the specified bilingual format.
User Query: "{{query}}"
`,
});

const voiceModeFlow = ai.defineFlow(
  {
    name: 'voiceModeFlow',
    inputSchema: VoiceQueryInputSchema,
    outputSchema: VoiceQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
