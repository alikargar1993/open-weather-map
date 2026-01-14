import { CurrentWeather, ForecastItem } from '@/services/weatherApi';

export interface WeatherState {
  currentWeather: CurrentWeather | null;
  forecast: ForecastItem[];
  hourlyForecast: ForecastItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  currentCity: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}
