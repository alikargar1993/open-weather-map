import type { CurrentWeather, ForecastResponse } from '../weatherApi';

// Create a mock axios instance that will be reused
// The interceptors need to actually store the functions
let requestInterceptor: ((config: any) => any) | null = null;
let responseInterceptorFulfilled: ((response: any) => any) | null = null;
let responseInterceptorRejected: ((error: any) => any) | null = null;

const mockAxiosInstance = {
  get: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn((fulfilled?: any, rejected?: any) => {
        requestInterceptor = fulfilled;
        return 0; // Return interceptor ID
      }),
    },
    response: {
      use: jest.fn((fulfilled?: any, rejected?: any) => {
        responseInterceptorFulfilled = fulfilled;
        responseInterceptorRejected = rejected;
        return 0; // Return interceptor ID
      }),
    },
  },
};

// Mock axios with factory function
jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: jest.fn(() => mockAxiosInstance),
  };
});

describe('WeatherApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.EXPO_PUBLIC_WEATHER_API_KEY = 'test-api-key';
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

      // Setup mock to call interceptors
      mockAxiosInstance.get.mockImplementation(async (url: string) => {
        // Apply request interceptor if exists
        let config = { url };
        if (requestInterceptor) {
          config = requestInterceptor(config) || config;
        }
        // Simulate successful response
        const response = { data: mockWeather };
        // Apply response interceptor if exists
        if (responseInterceptorFulfilled) {
          return responseInterceptorFulfilled(response);
        }
        return response;
      });

      // Re-import to get fresh instance with mocked axios
      const { weatherApi: freshWeatherApi } = require('../weatherApi');
      const result = await freshWeatherApi.getCurrentWeatherByCity('New York');

      expect(result).toEqual(mockWeather);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather?q=New%20York')
      );
    });

    it('should throw error when API key is missing', async () => {
      delete process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      // Re-import to get fresh instance (this will set up interceptors)
      const { weatherApi: freshWeatherApi } = require('../weatherApi');

      // Setup mock to call request interceptor
      mockAxiosInstance.get.mockImplementation(async (url: string) => {
        // Apply request interceptor - it should throw if API key is missing
        if (requestInterceptor) {
          requestInterceptor({ url });
        }
        return { data: {} };
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

      // Setup mock to reject and call response interceptor
      mockAxiosInstance.get.mockImplementation(async (url: string) => {
        // Apply request interceptor if exists
        if (requestInterceptor) {
          requestInterceptor({ url });
        }
        // Simulate error
        const error = mockError;
        // Apply response interceptor error handler if exists
        if (responseInterceptorRejected) {
          return Promise.reject(responseInterceptorRejected(error));
        }
        return Promise.reject(error);
      });

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

      // Setup mock to call interceptors
      mockAxiosInstance.get.mockImplementation(async (url: string) => {
        if (requestInterceptor) {
          requestInterceptor({ url });
        }
        const response = { data: mockWeather };
        if (responseInterceptorFulfilled) {
          return responseInterceptorFulfilled(response);
        }
        return response;
      });

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

      // Setup mock to call interceptors
      mockAxiosInstance.get.mockImplementation(async (url: string) => {
        if (requestInterceptor) {
          requestInterceptor({ url });
        }
        const response = { data: mockForecast };
        if (responseInterceptorFulfilled) {
          return responseInterceptorFulfilled(response);
        }
        return response;
      });

      const { weatherApi: freshWeatherApi } = require('../weatherApi');
      const result = await freshWeatherApi.getForecastByCity('New York');

      expect(result).toEqual(mockForecast);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/forecast?q=New%20York')
      );
    });
  });
});
