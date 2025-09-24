
'use server';
/**
 * @fileOverview A Genkit tool for fetching real-time weather data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WeatherToolInputSchema = z.object({
  lat: z.number().describe('Latitude for the weather forecast.'),
  lon: z.number().describe('Longitude for the weather forecast.'),
});

// A simplified schema for the OpenWeatherMap API response
const WeatherToolOutputSchema = z.object({
    locationName: z.string(),
    current: z.object({
        temp: z.number(),
        weather: z.object({
            main: z.string(),
            description: z.string(),
        }),
    }),
    daily: z.array(z.object({
        dt: z.number(),
        temp: z.object({ day: z.number() }),
        weather: z.array(z.object({ main: z.string() })),
    })),
});


export const getWeatherTool = ai.defineTool(
  {
    name: 'getWeatherTool',
    description: 'Get the current weather and a short forecast for a given location.',
    inputSchema: WeatherToolInputSchema,
    outputSchema: WeatherToolOutputSchema,
  },
  async ({ lat, lon }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not defined in the environment.');
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    try {
      // Fetch weather data first, as it's the most critical part.
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text();
        console.error('OpenWeatherMap API error:', errorText);
        throw new Error(`Failed to fetch weather data: ${weatherResponse.statusText}`);
      }
      const weatherData = await weatherResponse.json();

      // Fetch location name with a fallback.
      let locationName = 'Unknown Location';
      try {
        const geoResponse = await fetch(geoUrl);
        if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            if (geoData[0]) {
                locationName = `${geoData[0].name}, ${geoData[0].state || geoData[0].country}`;
            }
        }
      } catch (geoError) {
          console.error('Could not fetch location name, but proceeding with weather data:', geoError);
          // Don't re-throw; we can proceed without the location name.
      }
      
      return {
        locationName,
        current: {
            temp: weatherData.current.temp,
            weather: {
                main: weatherData.current.weather[0].main,
                description: weatherData.current.weather[0].description,
            },
        },
        daily: weatherData.daily.slice(1, 4).map((d: any) => ({ // Get next 3 days
            dt: d.dt,
            temp: { day: d.temp.day },
            weather: [{ main: d.weather[0].main }],
        })),
      };

    } catch (error) {
      console.error('Error in getWeatherTool:', error);
      // Re-throw the original error to be caught by the action
      throw error;
    }
  }
);
