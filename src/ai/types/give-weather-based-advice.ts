import {z} from 'genkit';

export const GiveWeatherBasedAdviceInputSchema = z.object({
  query: z.string().describe('The user query about weather.'),
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

export const GiveWeatherBasedAdviceOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The structured weather advisory response, with Malayalam first, followed by an English summary.'
    ),
});
export type GiveWeatherBasedAdviceOutput = z.infer<
  typeof GiveWeatherBasedAdviceOutputSchema
>;
