import axios from 'axios';
import { weatherApi } from '../weatherApi';
import { CurrentWeather, ForecastResponse } from '../weatherApi';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherApiService', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_WEATHER_API_KEY = 'test-api-key';

    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    };

    // Mock axios.create to return our mock instance
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  });

  describe('getCurrentWeatherByCity', () => {
    it('should fetch current weather by city name', async () => {
      const mockWeather: CurrentWeather = {
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

      mockAxiosInstance.get.mockResolvedValue({ data: mockWeather });

      // Re-import to get fresh instance with mocked axios
      jest.resetModules();
      const { weatherApi: freshWeatherApi } = require('../weatherApi');
      const result = await freshWeatherApi.getCurrentWeatherByCity('New York');

      expect(result).toEqual(mockWeather);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather?q=New%20York')
      );
    });

    it('should throw error when API key is missing', async () => {
      delete process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      // Re-import to get fresh instance
      jest.resetModules();
      const { weatherApi: freshWeatherApi } = require('../weatherApi');

      // Mock the request interceptor to throw error
      const requestInterceptor = mockAxiosInstance.interceptors.request.use;
      requestInterceptor.mockImplementation((onFulfilled: any) => {
        if (!process.env.EXPO_PUBLIC_WEATHER_API_KEY) {
          throw new Error(
            'OpenWeatherMap API key is not configured. Please set EXPO_PUBLIC_WEATHER_API_KEY in your .env file'
          );
        }
        return onFulfilled({});
      });

      await expect(
        freshWeatherApi.getCurrentWeatherByCity('New York')
      ).rejects.toThrow('OpenWeatherMap API key is not configured');
    });

    it('should handle API errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: {
            cod: '404',
            message: 'city not found',
          },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Mock response interceptor to handle error
      const responseInterceptor = mockAxiosInstance.interceptors.response.use;
      responseInterceptor.mockImplementation(
        (onFulfilled: any, onRejected: any) => {
          return onRejected(mockError);
        }
      );

      jest.resetModules();
      const { weatherApi: freshWeatherApi } = require('../weatherApi');

      await expect(
        freshWeatherApi.getCurrentWeatherByCity('InvalidCity')
      ).rejects.toThrow('city not found');
    });
  });

  describe('getCurrentWeatherByCoords', () => {
    it('should fetch current weather by coordinates', async () => {
      const mockWeather: CurrentWeather = {
        coord: { lon: -74.006, lat: 40.7128 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
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

      mockAxiosInstance.get.mockResolvedValue({ data: mockWeather });

      jest.resetModules();
      const { weatherApi: freshWeatherApi } = require('../weatherApi');
      const result = await freshWeatherApi.getCurrentWeatherByCoords(40.7128, -74.006);

      expect(result).toEqual(mockWeather);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather?lat=40.7128&lon=-74.006')
      );
    });
  });

  describe('getForecastByCity', () => {
    it('should fetch forecast by city name', async () => {
      const mockForecast: ForecastResponse = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: [],
        city: {
          id: 5128581,
          name: 'New York',
          coord: { lat: 40.7128, lon: -74.006 },
          country: 'US',
          population: 8175133,
          timezone: -18000,
          sunrise: 1609430400,
          sunset: 1609466400,
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockForecast });

      jest.resetModules();
      const { weatherApi: freshWeatherApi } = require('../weatherApi');
      const result = await freshWeatherApi.getForecastByCity('New York');

      expect(result).toEqual(mockForecast);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/forecast?q=New%20York')
      );
    });
  });
});
