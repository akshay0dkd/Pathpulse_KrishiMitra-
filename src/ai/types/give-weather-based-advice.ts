import {z} from 'genkit';

export const GiveWeatherBasedAdviceInputSchema = z.object({
  // This input is currently not used, but kept for potential future use.
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
