import {z} from 'genkit';

export const ProvideGovernmentSchemeInformationInputSchema = z.object({
  query: z.string().describe('The query about government schemes.'),
});
export type ProvideGovernmentSchemeInformationInput = z.infer<
  typeof ProvideGovernmentSchemeInformationInputSchema
>;

export const ProvideGovernmentSchemeInformationOutputSchema = z.object({
  malayalamResponse: z
    .string()
    .describe('The structured information about government schemes in Malayalam.'),
  englishTranslation: z
    .string()
    .describe('The English translation of the response.'),
});
export type ProvideGovernmentSchemeInformationOutput = z.infer<
  typeof ProvideGovernmentSchemeInformationOutputSchema
>;
