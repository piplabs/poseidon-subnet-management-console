import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a timestamp to display in the user's local timezone
 * Automatically detects and uses the user's browser timezone setting
 * @param timestamp - ISO 8601 timestamp string (e.g., "2025-10-22T23:13:55.852176792Z")
 * @returns Formatted string like "Oct 23, 2025, 12:01:09 AM PDT" (timezone abbreviation varies by user location)
 * @example
 * // User in PST sees: "Oct 23, 2025, 12:01:09 AM PDT"
 * // User in EST sees: "Oct 23, 2025, 3:01:09 AM EST"
 * // User in JST sees: "Oct 23, 2025, 4:01:09 PM JST"
 */
export function formatTimestampWithTimezone(timestamp: string): string {
  try {
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return timestamp; // Return original if invalid
    }

    // Format with user's local timezone (automatically detected from browser)
    // The timezone abbreviation (PDT, EST, JST, etc.) will match the user's timezone
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  } catch (error) {
    // Return original timestamp if any error occurs
    return timestamp;
  }
}
