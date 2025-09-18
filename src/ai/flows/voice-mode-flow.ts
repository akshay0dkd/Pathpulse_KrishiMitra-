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
  prompt: `You are KrishiMitra, a voice-first AI assistant for Kerala farmers. YOU ARE IN VOICE-ONLY MODE. Your responses must be natural, concise, and phrased as if they are being spoken aloud. Respond in the same language the user uses (Malayalam or English).

Your response MUST be text-based, but sound like spoken language. Do not use markdown, lists, or any text formatting. Just provide the conversational reply.

Current Query: "{{query}}"

Based on the query, provide a short, speech-like response.
- Acknowledge and ask clarifying questions if needed (e.g., "Are the spots brown or yellow?").
- Give simple, actionable instructions. Offer to repeat them.
- If you cannot answer or the issue is complex, say you are connecting them to an officer.

Example:
User: "വാഴയിലെ പുള്ളികൾക്ക് എന്ത് ചെയ്യണം?"
You: "Thank you. തവിട്ട് പുള്ളികൾ ആണോ? അത് ലീഫ് സ്പോട്ട് രോഗം ആകാം. ഒന്ന് രണ്ട് ഗ്രാം കാർബെൻഡാസിം പൗഡർ ഒരു ലിറ്റർ വെള്ളത്തിൽ കലക്കി തെളിക്കാം. Clear aayo?"
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
