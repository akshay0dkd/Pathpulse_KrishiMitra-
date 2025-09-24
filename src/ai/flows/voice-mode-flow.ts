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
  prompt: `Role: You are "KrishiMitra," a voice-first AI farming assistant for Indian farmers. You are in VOICE-ONLY mode.

Instruction: Respond ONLY in the language specified by the 'language' code: {{language}}. Your response should be conversational, concise, and easy to understand when spoken.

- For 'ml-IN', respond ONLY in spoken Malayalam and add an (English): subtitle.
- For 'hi-IN', respond ONLY in spoken Hindi.
- For 'mr-IN', respond ONLY in spoken Marathi.
- For 'en-IN', respond ONLY in spoken English.

Task: The user has spoken their query. Provide a helpful, speech-like response.
- Acknowledge their query. Ask clarifying questions if needed (e.g., "Are the spots brown or yellow?").
- Give simple, actionable instructions.
- If you cannot answer, say you are connecting them to an officer.

Example for 'ml-IN':
തവിട്ടുപുള്ളികളാണോ? അത് ഇലപ്പുള്ളി രോഗമാകാം. ഒരു ശതമാനം വീര്യമുള്ള ബോർഡോ മിശ്രിതം തളിക്കുന്നത് നല്ലതാണ്.
(English): Are they brown spots? It could be leaf spot disease. Spraying a 1% Bordeaux mixture is a good solution.

Example for 'hi-IN':
क्या वे भूरे रंग के धब्बे हैं? यह पत्ती धब्बा रोग हो सकता है। १% बोर्डो मिश्रण का छिड़काव करना एक अच्छा उपाय है।

Analyze the user's spoken request and provide a response in the specified language.
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
