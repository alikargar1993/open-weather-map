import {
  getWeatherIcon,
  getWeatherIconUrl,
  formatTemperature,
  formatWindSpeed,
  formatTime,
  formatDate,
  getWindDirection,
} from '../weatherUtils';

describe('weatherUtils', () => {
  describe('getWeatherIcon', () => {
    it('should return correct emoji for clear sky day', () => {
      expect(getWeatherIcon('01d')).toBe('☀️');
    });

    it('should return correct emoji for clear sky night', () => {
      expect(getWeatherIcon('01n')).toBe('🌙');
    });

    it('should return default emoji for unknown icon code', () => {
      expect(getWeatherIcon('99x')).toBe('☀️');
    });
  });

  describe('getWeatherIconUrl', () => {
    it('should return correct URL for icon code', () => {
      expect(getWeatherIconUrl('01d')).toBe(
        'https://openweathermap.org/img/wn/01d@2x.png'
      );
    });
  });

  describe('formatTemperature', () => {
    it('should format temperature correctly', () => {
      expect(formatTemperature(20.5)).toBe('21°');
      expect(formatTemperature(-5.3)).toBe('-5°');
      expect(formatTemperature(0)).toBe('0°');
    });
  });

  describe('formatWindSpeed', () => {
    it('should convert m/s to km/h and format correctly', () => {
      expect(formatWindSpeed(5)).toBe('18 km/h');
      expect(formatWindSpeed(10)).toBe('36 km/h');
      expect(formatWindSpeed(0)).toBe('0 km/h');
    });
  });

  describe('formatTime', () => {
    it('should format timestamp to time string', () => {
      const timestamp = 1609459200; // 2021-01-01 00:00:00 UTC
      const result = formatTime(timestamp);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });
  });

  describe('formatDate', () => {
    it('should format timestamp to date string', () => {
      const timestamp = 1609459200; // 2021-01-01 00:00:00 UTC
      const result = formatDate(timestamp);
      expect(result).toContain('Friday');
      expect(result).toContain('Jan');
    });
  });

  describe('getWindDirection', () => {
    it('should return correct direction for 0 degrees (North)', () => {
      expect(getWindDirection(0)).toBe('N');
    });

    it('should return correct direction for 90 degrees (East)', () => {
      expect(getWindDirection(90)).toBe('E');
    });

    it('should return correct direction for 180 degrees (South)', () => {
      expect(getWindDirection(180)).toBe('S');
    });

    it('should return correct direction for 270 degrees (West)', () => {
      expect(getWindDirection(270)).toBe('W');
    });

    it('should return correct direction for 45 degrees (NE)', () => {
      expect(getWindDirection(45)).toBe('NE');
    });
  });
});
