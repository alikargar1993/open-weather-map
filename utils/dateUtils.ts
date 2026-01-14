/**
 * Date and time utility functions
 */

/**
 * Formats a Date object to a full date-time string
 * @param date - The Date object to format
 * @returns Formatted date-time string (e.g., "Monday, January 1, 2024, 12:00 PM")
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Formats a timestamp to a relative time string (e.g., "Just now", "5m ago", "2h ago")
 * @param timestamp - The timestamp in milliseconds, or null
 * @returns Formatted relative time string or "Never" if timestamp is null
 */
export const formatLastUpdated = (timestamp: number | null): string => {
  if (!timestamp) return "Never";
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);

  if (diffMins < 1) {
    return `Just now (${diffSecs}s ago)`;
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else {
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
};
