import { Language } from '../contexts/LanguageContext';

export interface GeolocationResult {
  country: string;
  countryCode: string;
  suggestedLanguage: Language;
  detected: boolean;
}

const GEOLOCATION_KEY = 'unilancer_geolocation_detected';
const GEOLOCATION_CACHE_KEY = 'unilancer_geolocation_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function detectUserLocation(): Promise<GeolocationResult | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const alreadyDetected = localStorage.getItem(GEOLOCATION_KEY);
  if (alreadyDetected === 'true') {
    return null;
  }

  const cachedData = localStorage.getItem(GEOLOCATION_CACHE_KEY);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        return parsed.result;
      }
    } catch (error) {
      console.error('Error parsing cached geolocation:', error);
    }
  }

  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Geolocation API request failed');
    }

    const data = await response.json();

    const countryCode = data.country_code || data.country || 'TR';
    const country = data.country_name || 'Turkey';

    const suggestedLanguage: Language = countryCode === 'TR' ? 'tr' : 'en';

    const result: GeolocationResult = {
      country,
      countryCode,
      suggestedLanguage,
      detected: true
    };

    localStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify({
      result,
      timestamp: Date.now()
    }));

    return result;
  } catch (error) {
    console.error('Error detecting user location:', error);
    return {
      country: 'Unknown',
      countryCode: 'TR',
      suggestedLanguage: 'tr',
      detected: false
    };
  }
}

export function markGeolocationDetected(): void {
  localStorage.setItem(GEOLOCATION_KEY, 'true');
}

export function resetGeolocationDetection(): void {
  localStorage.removeItem(GEOLOCATION_KEY);
  localStorage.removeItem(GEOLOCATION_CACHE_KEY);
}

export function hasGeolocationBeenDetected(): boolean {
  return localStorage.getItem(GEOLOCATION_KEY) === 'true';
}
