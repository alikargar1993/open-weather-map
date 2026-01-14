import { formatDateTime, formatLastUpdated } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDateTime', () => {
    it('should format a date correctly', () => {
      const date = new Date('2024-01-15T14:30:45');
      const result = formatDateTime(date);
      
      expect(result).toContain('Monday');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });

    it('should include weekday, month, day, year, and time', () => {
      const date = new Date('2024-12-25T09:15:30');
      const result = formatDateTime(date);
      
      // Check that all expected parts are present
      expect(result).toMatch(/[A-Za-z]+,/); // Weekday
      expect(result).toMatch(/[A-Za-z]+ \d{1,2}, \d{4}/); // Month day, year
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/); // Time
    });

    it('should handle different dates correctly', () => {
      const date1 = new Date('2024-06-01T00:00:00');
      const result1 = formatDateTime(date1);
      expect(result1).toBeTruthy();
      expect(typeof result1).toBe('string');
      
      const date2 = new Date('2024-12-31T23:59:59');
      const result2 = formatDateTime(date2);
      expect(result2).toBeTruthy();
      expect(typeof result2).toBe('string');
    });
  });

  describe('formatLastUpdated', () => {
    beforeEach(() => {
      // Mock Date.now() to have consistent test results
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "Never" for null timestamp', () => {
      expect(formatLastUpdated(null)).toBe('Never');
    });

    it('should return "Just now" format for timestamps less than 1 minute ago', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 30000; // 30 seconds ago
      const result = formatLastUpdated(timestamp);
      
      expect(result).toMatch(/Just now \(\d+s ago\)/);
    });

    it('should return minutes format for timestamps less than 1 hour ago', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 5 * 60000; // 5 minutes ago
      const result = formatLastUpdated(timestamp);
      
      expect(result).toBe('5m ago');
    });

    it('should return hours format for timestamps less than 24 hours ago', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 3 * 60 * 60000; // 3 hours ago
      const result = formatLastUpdated(timestamp);
      
      expect(result).toBe('3h ago');
    });

    it('should return formatted date for timestamps more than 24 hours ago', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 25 * 60 * 60000; // 25 hours ago
      const result = formatLastUpdated(timestamp);
      
      // Should be a formatted date string, not relative time
      expect(result).not.toMatch(/\d+h ago/);
      expect(result).toMatch(/[A-Za-z]{3} \d{1,2}, \d{1,2}:\d{2}/);
    });

    it('should handle edge case of exactly 1 minute', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 60000; // exactly 1 minute ago
      const result = formatLastUpdated(timestamp);
      
      expect(result).toBe('1m ago');
    });

    it('should handle edge case of exactly 1 hour', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 60 * 60000; // exactly 1 hour ago
      const result = formatLastUpdated(timestamp);
      
      expect(result).toBe('1h ago');
    });

    it('should handle edge case of exactly 24 hours', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 24 * 60 * 60000; // exactly 24 hours ago
      const result = formatLastUpdated(timestamp);
      
      // Should still be hours format (24h ago)
      expect(result).toBe('24h ago');
    });

    it('should handle very recent timestamps (seconds)', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 10000; // 10 seconds ago
      const result = formatLastUpdated(timestamp);
      
      expect(result).toMatch(/Just now \(10s ago\)/);
    });

    it('should handle very old timestamps', () => {
      const now = 1609459200000; // Fixed timestamp: 2021-01-01 00:00:00 UTC
      jest.setSystemTime(now);
      
      const timestamp = now - 7 * 24 * 60 * 60000; // 7 days ago
      const result = formatLastUpdated(timestamp);
      
      // Should be a formatted date string
      expect(result).toMatch(/[A-Za-z]{3} \d{1,2}, \d{1,2}:\d{2}/);
    });
  });
});
