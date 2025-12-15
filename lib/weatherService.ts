import * as Location from 'expo-location';

// Free API - no key needed for basic usage with open-meteo
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'stormy';

export interface WeatherData {
  temperature: number; // in Fahrenheit
  feelsLike: number;
  condition: WeatherCondition;
  conditionText: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
}

export interface OutfitSuggestion {
  category: string;
  items: string[];
  tip: string;
}

const getWeatherCondition = (weatherCode: number): { condition: WeatherCondition; text: string; icon: string } => {
  // WMO Weather interpretation codes
  if (weatherCode === 0) return { condition: 'sunny', text: 'Clear sky', icon: '☀️' };
  if (weatherCode <= 3) return { condition: 'cloudy', text: 'Partly cloudy', icon: '⛅' };
  if (weatherCode <= 49) return { condition: 'cloudy', text: 'Foggy', icon: '🌫️' };
  if (weatherCode <= 59) return { condition: 'rainy', text: 'Drizzle', icon: '🌧️' };
  if (weatherCode <= 69) return { condition: 'rainy', text: 'Rain', icon: '🌧️' };
  if (weatherCode <= 79) return { condition: 'snowy', text: 'Snow', icon: '🌨️' };
  if (weatherCode <= 84) return { condition: 'rainy', text: 'Rain showers', icon: '🌦️' };
  if (weatherCode <= 94) return { condition: 'snowy', text: 'Snow showers', icon: '🌨️' };
  if (weatherCode <= 99) return { condition: 'stormy', text: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'cloudy', text: 'Unknown', icon: '🌡️' };
};

const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9/5) + 32);
};

export const getLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentWeather = async (): Promise<WeatherData | null> => {
  try {
    const hasPermission = await getLocationPermission();
    if (!hasPermission) {
      // Return mock data for demo if no permission
      return getMockWeather();
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Get city name
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    const city = address?.city || address?.subregion || 'Your Location';

    // Fetch weather from Open-Meteo (free, no API key needed)
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=mph`
    );
    
    const data = await response.json();
    const current = data.current;

    const weatherInfo = getWeatherCondition(current.weather_code);

    return {
      temperature: celsiusToFahrenheit(current.temperature_2m),
      feelsLike: celsiusToFahrenheit(current.apparent_temperature),
      condition: weatherInfo.condition,
      conditionText: weatherInfo.text,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      icon: weatherInfo.icon,
      city,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return getMockWeather();
  }
};

const getMockWeather = (): WeatherData => ({
  temperature: 65,
  feelsLike: 63,
  condition: 'sunny',
  conditionText: 'Partly cloudy',
  humidity: 45,
  windSpeed: 8,
  icon: '⛅',
  city: 'Your City',
});

export const getOutfitSuggestions = (
  weather: WeatherData,
  selectedVibes: string[],
  clothingItems: any[]
): OutfitSuggestion[] => {
  const suggestions: OutfitSuggestion[] = [];
  const temp = weather.temperature;
  const condition = weather.condition;

  // Temperature-based suggestions
  if (temp < 40) {
    suggestions.push({
      category: 'Outerwear',
      items: ['Heavy coat', 'Puffer jacket', 'Wool coat'],
      tip: '🥶 It\'s freezing! Layer up with a warm coat',
    });
    suggestions.push({
      category: 'Accessories',
      items: ['Scarf', 'Gloves', 'Beanie'],
      tip: 'Don\'t forget to cover your extremities',
    });
  } else if (temp < 55) {
    suggestions.push({
      category: 'Outerwear',
      items: ['Light jacket', 'Cardigan', 'Hoodie'],
      tip: '🍂 Cool weather - a light layer will do',
    });
  } else if (temp < 70) {
    suggestions.push({
      category: 'Tops',
      items: ['Long sleeve shirt', 'Light sweater', 'Button-up'],
      tip: '👍 Perfect weather for layering',
    });
  } else if (temp < 85) {
    suggestions.push({
      category: 'Tops',
      items: ['T-shirt', 'Tank top', 'Light blouse'],
      tip: '☀️ Warm day - keep it light and breathable',
    });
  } else {
    suggestions.push({
      category: 'Tops',
      items: ['Tank top', 'Linen shirt', 'Sleeveless top'],
      tip: '🔥 It\'s hot! Wear loose, breathable fabrics',
    });
  }

  // Weather condition-based suggestions
  if (condition === 'rainy' || condition === 'stormy') {
    suggestions.push({
      category: 'Rain Gear',
      items: ['Waterproof jacket', 'Rain boots', 'Umbrella'],
      tip: '🌧️ Rain expected - grab waterproof gear',
    });
  }

  if (weather.windSpeed > 15) {
    suggestions.push({
      category: 'Wind Protection',
      items: ['Windbreaker', 'Fitted jacket', 'Layers'],
      tip: '💨 Windy conditions - avoid loose clothing',
    });
  }

  // Vibe-based suggestions
  if (selectedVibes.includes('1') || selectedVibes.includes('Confident')) {
    suggestions.push({
      category: 'Confident Look',
      items: ['Bold colors', 'Statement piece', 'Sharp fit'],
      tip: '😎 Own the day with a power outfit',
    });
  }

  if (selectedVibes.includes('4') || selectedVibes.includes('Elegant')) {
    suggestions.push({
      category: 'Elegant Touch',
      items: ['Neutral tones', 'Clean lines', 'Quality fabrics'],
      tip: '✨ Keep it classy and sophisticated',
    });
  }

  if (selectedVibes.includes('7') || selectedVibes.includes('Professional')) {
    suggestions.push({
      category: 'Professional',
      items: ['Blazer', 'Dress shirt', 'Tailored pants'],
      tip: '💼 Dress to impress for work',
    });
  }

  if (selectedVibes.includes('5') || selectedVibes.includes('Relaxed')) {
    suggestions.push({
      category: 'Casual Comfort',
      items: ['Comfortable jeans', 'Soft tee', 'Sneakers'],
      tip: '🌊 Keep it chill and comfortable',
    });
  }

  return suggestions;
};

export const getTemperatureColor = (temp: number): string => {
  if (temp < 40) return '#60a5fa'; // Cold blue
  if (temp < 55) return '#93c5fd'; // Cool blue
  if (temp < 70) return '#86efac'; // Mild green
  if (temp < 85) return '#fcd34d'; // Warm yellow
  return '#f87171'; // Hot red
};
