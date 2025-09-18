import { config } from 'dotenv';
config();

import '@/ai/flows/identify-pest-disease-from-symptoms.ts';
import '@/ai/flows/recommend-treatment-options.ts';
import '@/ai/flows/provide-government-scheme-information.ts';
import '@/ai/flows/give-weather-based-advice.ts';