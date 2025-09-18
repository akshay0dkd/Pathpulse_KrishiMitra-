import {z} from 'genkit';

export const GiveWeatherBasedAdviceInputSchema = z.object({
  greeting: z
    .boolean()
    .optional()
    .describe('If true, generate only the initial greeting.'),
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

export const GiveWeatherBasedAdviceOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The initial greeting or response in Malayalam, followed by an English translation.'
    ),
});
export type GiveWeatherBasedAdviceOutput = z.infer<
  typeof GiveWeatherBasedAdviceOutputSchema
>;