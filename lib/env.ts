/**
 * Environment configuration
 * Provides type-safe access to environment variables
 */

export const env = {
  /**
   * Base URL for the API
   * Falls back to empty string if not defined (will use mock data)
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
} as const

/**
 * Check if API is configured
 */
export const isApiConfigured = (): boolean => {
  return Boolean(env.apiBaseUrl)
}

/**
 * Get API endpoint URL
 * @param path - API path (e.g., "/api/v1/workflows")
 * @returns Full URL or empty string if API not configured
 */
export const getApiUrl = (path: string): string => {
  if (!env.apiBaseUrl) {
    return ""
  }

  // Remove leading slash from path if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path

  // Remove trailing slash from base URL if present
  const cleanBase = env.apiBaseUrl.endsWith("/")
    ? env.apiBaseUrl.slice(0, -1)
    : env.apiBaseUrl


  return `${cleanBase}/${cleanPath}`
}
