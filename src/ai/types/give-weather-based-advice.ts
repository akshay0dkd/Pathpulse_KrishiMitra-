import {z} from 'genkit';

export const GiveWeatherBasedAdviceInputSchema = z.object({
  lat: z.number().describe("The user's latitude."),
  lon: z.number().describe("The user's longitude."),
  language: z
    .string()
    .describe(
      "The user's selected language (e.g., 'en-IN', 'ml-IN', 'hi-IN', 'mr-IN')."
    ),
});
export type GiveWeatherBasedAdviceInput = z.infer<
  typeof GiveWeatherBasedAdviceInputSchema
>;

export const WeatherForecastSchema = z.object({
  location: z.string().describe('The city and state for the forecast, e.g., "Thrissur, Kerala".'),
  temperature: z.string().describe('The current temperature, e.g., "28°C".'),
  condition: z.string().describe('The current weather condition, e.g., "Partly Cloudy".'),
  conditionIcon: z.enum(['CloudSun', 'Cloudy', 'Sun', 'CloudRain', 'CloudLightning', 'Haze', 'Drizzle', 'Mist', 'Snow', 'Smoke', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado']).describe('An icon name representing the current condition.'),
  advice: z.array(z.string()).describe('An array of 3-4 actionable bullet points of farming advice for the current season.'),
  sprayingAdvice: z.string().describe('A single, concise sentence about the ideal time for spraying crops based on the forecast.'),
  daily: z.array(z.object({
    day: z.string().describe('The day of the week, e.g., "Monday".'),
    conditionIcon: z.enum(['CloudSun', 'Cloudy', 'Sun', 'CloudRain', 'CloudLightning', 'Haze', 'Drizzle', 'Mist', 'Snow', 'Smoke', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado']).describe('An icon name for the day\'s forecast.'),
    temp: z.string().describe('The temperature for that day, e.g., "29°C".'),
  })).describe('A 3-day forecast.'),
});

export const GiveWeatherBasedAdviceOutputSchema = WeatherForecastSchema;

export type GiveWeatherBasedAdviceOutput = z.infer<
  typeof GiveWeatherBasedAdviceOutputSchema
>;
