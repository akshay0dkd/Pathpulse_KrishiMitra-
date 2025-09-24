import {z} from 'genkit';

export const GiveWeatherBasedAdviceInputSchema = z.object({
  query: z.string().describe('The user query about weather.'),
  language: z.string().describe("The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."),
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

export const GiveWeatherBasedAdviceOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The structured weather advisory response in the specified language.'
    ),
});
export type GiveWeatherBasedAdviceOutput = z.infer<
  typeof GiveWeatherBasedAdviceOutputSchema
>;
