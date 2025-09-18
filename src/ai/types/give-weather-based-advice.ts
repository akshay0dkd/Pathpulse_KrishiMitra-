import {z} from 'genkit';

export const GiveWeatherBasedAdviceInputSchema = z.object({
  query: z.string().describe('The user query about weather.'),
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

export const GiveWeatherBasedAdviceOutputSchema = z.object({
  malayalamResponse: z
    .string()
    .describe(
      'The structured weather advisory response in simple Malayalam.'
    ),
  englishTranslation: z
    .string()
    .describe(
      'A concise and accurate English translation of the Malayalam response.'
    ),
});
export type GiveWeatherBasedAdviceOutput = z.infer<
  typeof GiveWeatherBasedAdviceOutputSchema
>;
