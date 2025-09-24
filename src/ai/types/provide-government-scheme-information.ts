import {z} from 'genkit';

export const ProvideGovernmentSchemeInformationInputSchema = z.object({
  query: z.string().describe('The query about government schemes.'),
  language: z.string().describe("The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."),
});
export type ProvideGovernmentSchemeInformationInput = z.infer<
  typeof ProvideGovernmentSchemeInformationInputSchema
>;

export const ProvideGovernmentSchemeInformationOutputSchema = z.object({
  response: z
    .string()
    .describe('The structured information about government schemes in the specified language.'),
});
export type ProvideGovernmentSchemeInformationOutput = z.infer<
  typeof ProvideGovernmentSchemeInformationOutputSchema
>;
