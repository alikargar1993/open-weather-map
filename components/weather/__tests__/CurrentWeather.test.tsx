import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CurrentWeather } from '../CurrentWeather';
import weatherReducer from '@/store/slices/weatherSlice';
import { CurrentWeather as CurrentWeatherType } from '@/services/weatherApi';

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
    preloadedState: {
      weather: initialState,
    },
  });
};

const mockCurrentWeather: CurrentWeatherType = {
  coord: { lon: -74.006, lat: 40.7128 },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  base: 'stations',
  main: {
    temp: 20,
    feels_like: 19,
    temp_min: 18,
    temp_max: 22,
    pressure: 1013,
    humidity: 65,
  },
  visibility: 10000,
  wind: { speed: 3.5, deg: 180 },
  clouds: { all: 0 },
  dt: 1609459200,
  sys: {
    type: 1,
    id: 5122,
    country: 'US',
    sunrise: 1609430400,
    sunset: 1609466400,
  },
  timezone: -18000,
  id: 5128581,
  name: 'New York',
  cod: 200,
};

describe('CurrentWeather', () => {
  it('should render current weather information', () => {
    const store = createMockStore({
      currentWeather: mockCurrentWeather,
      forecast: [],
      hourlyForecast: [],
      loading: false,
      error: null,
      lastUpdated: null,
      currentCity: 'New York',
      location: null,
    });

    const { getByText } = render(
      <Provider store={store}>
        <CurrentWeather />
      </Provider>
    );

    expect(getByText('New York')).toBeTruthy();
    expect(getByText('clear sky')).toBeTruthy();
    expect(getByText('21°')).toBeTruthy();
    expect(getByText('Feels like 19°')).toBeTruthy();
    expect(getByText('65%')).toBeTruthy();
  });

  it('should not render when currentWeather is null', () => {
    const store = createMockStore({
      currentWeather: null,
      forecast: [],
      hourlyForecast: [],
      loading: false,
      error: null,
      lastUpdated: null,
      currentCity: null,
      location: null,
    });

    const { queryByText } = render(
      <Provider store={store}>
        <CurrentWeather />
      </Provider>
    );

    expect(queryByText('New York')).toBeNull();
  });
});
