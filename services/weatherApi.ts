/**
 * OpenWeatherMap API Service
 * Free tier: 60 calls/minute, 1,000,000 calls/month
 */

import axios, { AxiosError } from "axios";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherError {
  cod: string;
  message: string;
}

class WeatherApiService {
  private baseUrl: string;
  private apiKey: string;
  private axiosInstance;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000, // 10 second timeout
      params: {
        appid: this.apiKey,
        units: "metric",
      },
    });

    // Add request interceptor for logging (optional)
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (!this.apiKey) {
          throw new Error(
            "OpenWeatherMap API key is not configured. Please set EXPO_PUBLIC_WEATHER_API_KEY in your .env file"
          );
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<WeatherError>) => {
        if (error.response) {
          // Server responded with error status
          const errorData = error.response.data;
          throw new Error(
            errorData?.message || `HTTP error! status: ${error.response.status}`
          );
        } else if (error.request) {
          // Request was made but no response received
          throw new Error("Network error: No response from server");
        } else {
          // Something else happened
          throw new Error(error.message || "Failed to fetch weather data");
        }
      }
    );
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch weather data");
    }
  }

  /**
   * Get current weather by city name
   */
  async getCurrentWeatherByCity(city: string): Promise<CurrentWeather> {
    const endpoint = `/weather?q=${encodeURIComponent(city)}`;
    return this.fetchData<CurrentWeather>(endpoint);
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoords(
    lat: number,
    lon: number
  ): Promise<CurrentWeather> {
    const endpoint = `/weather?lat=${lat}&lon=${lon}`;
    return this.fetchData<CurrentWeather>(endpoint);
  }

  /**
   * Get 5-day forecast by city name
   */
  async getForecastByCity(city: string): Promise<ForecastResponse> {
    const endpoint = `/forecast?q=${encodeURIComponent(city)}`;
    return this.fetchData<ForecastResponse>(endpoint);
  }

  /**
   * Get 5-day forecast by coordinates
   */
  async getForecastByCoords(
    lat: number,
    lon: number
  ): Promise<ForecastResponse> {
    const endpoint = `/forecast?lat=${lat}&lon=${lon}`;
    return this.fetchData<ForecastResponse>(endpoint);
  }
}

export const weatherApi = new WeatherApiService();
