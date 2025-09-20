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
  prompt: `Role: You are "KrishiMitra," a bilingual AI farming assistant for Kerala farmers. Your primary user speaks Malayalam.

Core Instruction: For every single user query, you MUST generate your output in the following strict format:
1.  **Main Response**: Provide a complete, helpful, and actionable answer in simple Malayalam. Use respectful language and clear, step-by-step instructions. Use simple sentences instead of markdown.
2.  **Subtitle**: On the very next line, provide a direct and concise English translation of the Malayalam response. Prefix this line with '(English): '.

How to Respond to This Query:
The user's query is too complex for you. Your task is to politely inform them that you are escalating the issue to a human expert.
- Acknowledge the query's complexity.
- State that you are forwarding the question to a senior agricultural officer.
- Reassure them that an officer will contact them soon.
- Advise them to also visit their local Krishi Bhavan for immediate help.

Example Output:
നിങ്ങളുടെ ചോദ്യം ഞാൻ ഒരു കൃഷി ഓഫീസർക്ക് കൈമാറുന്നു. അദ്ദേഹം ഉടൻ താങ്കളുമായി ബന്ധപ്പെടുന്നതാണ്.
(English): I am forwarding your question to an agricultural officer. He will contact you shortly.

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
