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
    
    // Use the current free API endpoints
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    try {
      // Fetch current weather and forecast data in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl),
      ]);

      if (!currentResponse.ok) {
        const errorText = await currentResponse.text();
        throw new Error(`Failed to fetch current weather: ${currentResponse.statusText} - ${errorText}`);
      }
      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text();
        throw new Error(`Failed to fetch forecast: ${forecastResponse.statusText} - ${errorText}`);
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      // Process forecast data to get one entry per day for the next 3 days
      const dailyForecasts: any = {};
      const today = new Date().getUTCDate();
      
      for (const item of forecastData.list) {
          const itemDate = new Date(item.dt * 1000);
          const dayOfMonth = itemDate.getUTCDate();
          
          // Check if it's a future day and we don't have it yet.
          // We'll take the first forecast entry we find for each future day.
          if (dayOfMonth !== today && !dailyForecasts[dayOfMonth] && Object.keys(dailyForecasts).length < 3) {
              dailyForecasts[dayOfMonth] = {
                  dt: item.dt,
                  temp: { day: item.main.temp },
                  weather: [{ main: item.weather[0].main }],
              };
          }
      }
      
      const daily = Object.values(dailyForecasts);
      
      return {
        locationName: `${currentData.name}, ${currentData.sys.country}`,
        current: {
            temp: currentData.main.temp,
            weather: {
                main: currentData.weather[0].main,
                description: currentData.weather[0].description,
            },
        },
        daily: daily as any, // Cast as we have manually built this structure
      };

    } catch (error) {
      console.error('Error in getWeatherTool:', error);
      // Re-throw the original error to be caught by the action
      throw error;
    }
  }
);
