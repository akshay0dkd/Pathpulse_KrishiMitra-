'use server';

/**
 * @fileOverview A flow to handle complex queries by escalating them.
 *
 * - escalateQuery - A function that handles the escalation of a query.
 */

import {ai} from '@/ai/genkit';
import type {
  EscalateQueryInput,
  EscalateQueryOutput,
} from '@/ai/types/escalate-query';
import {
  EscalateQueryInputSchema,
  EscalateQueryOutputSchema,
} from '@/ai/types/escalate-query';

export async function escalateQuery(
  input: EscalateQueryInput
): Promise<EscalateQueryOutput> {
  return escalateQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'escalateQueryPrompt',
  input: {schema: EscalateQueryInputSchema},
  output: {schema: EscalateQueryOutputSchema},
  prompt: `You are KrishiMitra, a digital assistant for Kerala farmers. The user has a complex query that is beyond your current capabilities. Your task is to acknowledge the complexity and escalate it. Your response must be in clear, readable text.

Respond in the same language as the user query. Your response must follow this structure:
1.  **Acknowledge and Reassure**: Acknowledge that the query requires expert attention.
2.  **Inform**: State that the query is being forwarded to a senior agricultural officer.
3.  **Set Expectation**: Inform the user that an officer will contact them soon for further assistance.
4.  **Advise**: As always, recommend they can also visit their local Krishi Bhavan for immediate help.

Here is the user's query: {{{query}}}
`,
});

const escalateQueryFlow = ai.defineFlow(
  {
    name: 'escalateQueryFlow',
    inputSchema: EscalateQueryInputSchema,
    outputSchema: EscalateQueryOutputSchema,
  },
  async input => {
    // In a real application, this is where you would add the logic to save the query
    // to a database (e.g., Firestore) for a human officer to review.
    // For this prototype, we just return the formatted response.
    const {output} = await prompt(input);
    return output!;
  }
);
