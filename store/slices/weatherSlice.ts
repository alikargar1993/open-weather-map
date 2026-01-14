import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { weatherApi } from '@/services/weatherApi';
import { locationService } from '@/services/locationService';
import { WeatherState, DailyForecast, HourlyForecast } from '@/types/weather';
import { CurrentWeather, ForecastItem } from '@/services/weatherApi';
import { storage } from '../persistence';

const CACHE_KEY = 'weather_cache';
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

interface CachedWeather {
  currentWeather: CurrentWeather | null;
  forecast: ForecastItem[];
  hourlyForecast: ForecastItem[];
  timestamp: number;
  city: string | null;
}

// Load cached data (async)
const loadCachedData = async (): Promise<Partial<WeatherState> | null> => {
  try {
    const cached = await storage.getItem(CACHE_KEY);
    if (cached) {
      const data: CachedWeather = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < CACHE_EXPIRY) {
        return {
          currentWeather: data.currentWeather,
          forecast: data.forecast,
          hourlyForecast: data.hourlyForecast,
          currentCity: data.city,
          lastUpdated: data.timestamp,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load cached weather data:', error);
  }
  return null;
};

// Save data to cache (async)
const saveToCache = async (state: WeatherState) => {
  try {
    const cache: CachedWeather = {
      currentWeather: state.currentWeather,
      forecast: state.forecast,
      hourlyForecast: state.hourlyForecast,
      timestamp: Date.now(),
      city: state.currentCity,
    };
    await storage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache weather data:', error);
  }
};

// Helper to process hourly forecast (next 24 hours)
const processHourlyForecast = (forecast: ForecastItem[]): ForecastItem[] => {
  const now = Date.now() / 1000;
  return forecast
    .filter((item) => item.dt >= now)
    .slice(0, 24);
};

// Helper to process daily forecast (group by day)
const processDailyForecast = (forecast: ForecastItem[]): DailyForecast[] => {
  const dailyMap = new Map<string, ForecastItem[]>();
  
  forecast.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, []);
    }
    dailyMap.get(dateKey)!.push(item);
  });

  const dailyForecast: DailyForecast[] = [];
  const today = new Date().toDateString();

  dailyMap.forEach((items, dateKey) => {
    if (dateKey === today) return; // Skip today
    
    const temps = items.map((item) => item.main.temp);
    const high = Math.max(...temps);
    const low = Math.min(...temps);
    const mainItem = items[Math.floor(items.length / 2)]; // Middle item of the day
    
    dailyForecast.push({
      date: dateKey,
      dayName: new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short' }),
      high,
      low,
      condition: mainItem.weather[0].main,
      icon: mainItem.weather[0].icon,
      humidity: mainItem.main.humidity,
      windSpeed: mainItem.wind.speed,
    });
  });

  return dailyForecast.slice(0, 5); // Return 5 days
};

// Async thunk to load cached data
export const loadCachedWeather = createAsyncThunk(
  'weather/loadCached',
  async () => {
    try {
      const cached = await loadCachedData();
      return cached || null;
    } catch (error) {
      console.error('Failed to load cached weather data:', error);
      return null;
    }
  }
);

// Async thunks
export const fetchWeatherByLocation = createAsyncThunk(
  'weather/fetchByLocation',
  async (_, { rejectWithValue }) => {
    try {
      const coords = await locationService.getCurrentLocation();
      const [currentWeather, forecast] = await Promise.all([
        weatherApi.getCurrentWeatherByCoords(coords.latitude, coords.longitude),
        weatherApi.getForecastByCoords(coords.latitude, coords.longitude),
      ]);

      return {
        currentWeather,
        forecast: forecast.list,
        city: currentWeather.name,
        location: coords,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch weather');
    }
  }
);

export const fetchWeatherByCity = createAsyncThunk(
  'weather/fetchByCity',
  async (city: string, { rejectWithValue }) => {
    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherApi.getCurrentWeatherByCity(city),
        weatherApi.getForecastByCity(city),
      ]);

      return {
        currentWeather,
        forecast: forecast.list,
        city: currentWeather.name,
        location: {
          latitude: currentWeather.coord.lat,
          longitude: currentWeather.coord.lon,
        },
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch weather');
    }
  }
);

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  hourlyForecast: [],
  loading: false,
  error: null,
  lastUpdated: null,
  currentCity: null,
  location: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load cached data
      .addCase(loadCachedWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCachedWeather.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          Object.assign(state, action.payload);
        }
      })
      .addCase(loadCachedWeather.rejected, (state) => {
        state.loading = false;
        // Cache load failure is not critical, continue normally
      })
      // Fetch by location
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.currentWeather;
        state.forecast = action.payload.forecast;
        state.hourlyForecast = processHourlyForecast(action.payload.forecast);
        state.currentCity = action.payload.city;
        state.location = action.payload.location;
        state.lastUpdated = Date.now();
        state.error = null;
        saveToCache(state);
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by city
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.currentWeather;
        state.forecast = action.payload.forecast;
        state.hourlyForecast = processHourlyForecast(action.payload.forecast);
        state.currentCity = action.payload.city;
        state.location = action.payload.location;
        state.lastUpdated = Date.now();
        state.error = null;
        saveToCache(state);
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = weatherSlice.actions;

// Selectors
export const selectCurrentWeather = (state: { weather: WeatherState }) => state.weather.currentWeather;
export const selectForecast = (state: { weather: WeatherState }) => state.weather.forecast;
export const selectHourlyForecast = (state: { weather: WeatherState }) => state.weather.hourlyForecast;
export const selectDailyForecast = (state: { weather: WeatherState }): DailyForecast[] => {
  return processDailyForecast(state.weather.forecast);
};
export const selectLoading = (state: { weather: WeatherState }) => state.weather.loading;
export const selectError = (state: { weather: WeatherState }) => state.weather.error;
export const selectCurrentCity = (state: { weather: WeatherState }) => state.weather.currentCity;
export const selectLastUpdated = (state: { weather: WeatherState }) => state.weather.lastUpdated;

export default weatherSlice.reducer;
