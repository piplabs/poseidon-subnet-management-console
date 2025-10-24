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

/**
 * Formats a timestamp to short relative time or date
 * @param timestamp - ISO 8601 timestamp string (e.g., "2025-10-24T11:46:49.425738-07:00")
 * @returns Short format like "10m ago", "2h ago", "7d ago", or "Sep 25" for older dates
 * @example
 * formatShortRelativeTime("2025-10-23T10:50:00Z") // "10m ago" (if current time is 11:00)
 * formatShortRelativeTime("2025-10-23T09:00:00Z") // "2h ago"
 * formatShortRelativeTime("2025-10-16T09:00:00Z") // "7d ago"
 * formatShortRelativeTime("2025-09-25T09:00:00Z") // "Sep 25"
 */
export function formatShortRelativeTime(timestamp: string): string {
  try {
    // Sanitize timestamp: JavaScript Date can handle up to milliseconds (3 decimal places)
    // but some APIs return microseconds (6 decimal places) which can cause parsing issues
    let sanitizedTimestamp = timestamp;

    // If there's a decimal point in the seconds, limit to 3 decimal places
    const decimalMatch = timestamp.match(/\.(\d+)([+-Z]|$)/);
    if (decimalMatch && decimalMatch[1].length > 3) {
      sanitizedTimestamp = timestamp.replace(
        /\.(\d{3})\d+([+-Z])/,
        '.$1$2'
      );
    }

    const date = new Date(sanitizedTimestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', timestamp);
      return "Invalid Date";
    }

    const now = Date.now();
    const then = date.getTime();
    const diffMs = now - then;

    if (diffMs < 0) return "just now";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Less than 1 hour: show minutes
    if (minutes < 60) return `${minutes}m ago`;

    // Less than 24 hours: show hours
    if (hours < 24) return `${hours}h ago`;

    // Less than 30 days: show days
    if (days < 30) return `${days}d ago`;

    // 30+ days: show date (e.g., "Sep 25")
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', timestamp, error);
    return "Invalid Date";
  }
}

export function shortenAddress(address: string, length: number = 4): string {
  if (!address) {
    return ''
  }
  if (address.length < 2 * length + 2) {
    // Check if the address is too short to be shortened.
    return address
  }

  const start = address.substring(0, length + 2)
  const end = address.substring(address.length - length)
  return `${start}...${end}`
}

/**
 * Get Tailwind CSS background color class for workflow status
 * @param status - Workflow status string
 * @returns Tailwind background color class (e.g., "bg-blue-500")
 */
export function getWorkflowStatusBgColor(status: string): string {
  switch (status) {
    case "Completed":
      return "bg-green-500"
    case "Running":
      return "bg-blue-500"
    case "Failed":
      return "bg-red-500"
    case "Terminated":
      return "bg-orange-500"
    case "Paused":
      return "bg-yellow-500"
    case "Pending":
    case "Created":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}