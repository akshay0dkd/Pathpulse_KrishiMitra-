
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
  prompt: `Role: You are "KrishiMitra," an AI farming assistant for Indian farmers.

Instruction: Respond in the language specified by the 'language' code: {{language}}.

- For 'ml-IN', respond ONLY in Malayalam and add an (English): subtitle.
- For 'en-IN', respond ONLY in English.

Task: The user's query is too complex for you. Politely inform them that you are escalating the issue to a human expert.
1. Acknowledge the query's complexity.
2. State that you are forwarding the question to a senior agricultural officer.
3. Reassure them that an officer will contact them soon.
4. Advise them to also visit their local Krishi Bhavan for immediate help if needed.

Example for 'ml-IN':
നിങ്ങളുടെ ചോദ്യം ഞാൻ ഒരു കൃഷി ഓഫീസർക്ക് കൈമാറുന്നു. അദ്ദേഹം ഉടൻ താങ്കളുമായി ബന്ധപ്പെടുന്നതാണ്.
(English): I am forwarding your question to an agricultural officer. He will contact you shortly.

Example for 'en-IN':
I am forwarding your question to an agricultural officer. They will contact you shortly.

Analyze the user's request and provide a response in the specified bilingual format.
User Query: {{{query}}}
`,
});

const escalateQueryFlow = ai.defineFlow(
  {
    name: 'escalateQueryFlow',
    inputSchema: EscalateQueryInputSchema,
    outputSchema: EscalateQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    