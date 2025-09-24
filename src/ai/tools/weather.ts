
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
    
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      const data = await response.json();

      // We need to resolve the location name from coordinates as well for a better UX
      const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      const locationName = geoData[0] ? `${geoData[0].name}, ${geoData[0].state || geoData[0].country}` : 'Unknown Location';
      
      return {
        locationName,
        current: {
            temp: data.current.temp,
            weather: {
                main: data.current.weather[0].main,
                description: data.current.weather[0].description,
            },
        },
        daily: data.daily.slice(1, 4).map((d: any) => ({ // Get next 3 days
            dt: d.dt,
            temp: { day: d.temp.day },
            weather: [{ main: d.weather[0].main }],
        })),
      };

    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Could not retrieve weather information.');
    }
  }
);
