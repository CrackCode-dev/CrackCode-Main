// leaderboardService.js
// Place this in: src/services/leaderboardService.js (or src/api/leaderboard.js)

// =============================================================================
// API Configuration
// =============================================================================

// Retrieve the API base URL from environment variables (Vite-style).
// Falls back to localhost:5051 for local development if not set.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5051";

// =============================================================================
// Leaderboard API Functions
// =============================================================================

/**
 * Fetch top 10 players (public - no auth needed)
 * 
 * Retrieves the global leaderboard showing the top-ranked players.
 * This endpoint is publicly accessible and doesn't require authentication.
 * 
 * @returns {Promise<{ success: boolean, leaderboard: Array, source: string }>}
 *          - success: indicates if the request was successful
 *          - leaderboard: array of top player objects
 *          - source: identifies where the data came from (e.g., cache vs database)
 * @throws {Error} If the fetch request fails (non-2xx response)
 */
export const getGlobalLeaderboard = async () => {
  // Make GET request to the global leaderboard endpoint
  const res = await fetch(`${BASE_URL}/api/leaderboard/global`, {
    credentials: "include", // Include cookies for session handling (if any)
  });

  // Throw an error if the response status indicates failure
  if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);

  // Parse and return the JSON response body
  return res.json();
};

/**
 * Fetch paginated leaderboard (public - no auth needed)
 * 
 * Retrieves a paginated view of the leaderboard, useful for displaying
 * large lists of players with pagination controls.
 * 
 * @param {number} page - The page number to fetch (default: 1, first page)
 * @param {number} limit - Number of results per page (default: 20)
 * @returns {Promise<Object>} Paginated leaderboard data with player entries
 * @throws {Error} If the fetch request fails (non-2xx response)
 */
export const getPaginatedLeaderboard = async (page = 1, limit = 20) => {
  // Build URL with query parameters for pagination
  const res = await fetch(
    `${BASE_URL}/api/leaderboard/paginated?page=${page}&limit=${limit}`,
    { credentials: "include" } // Include cookies for session handling
  );

  // Throw an error if the response status indicates failure
  if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);

  // Parse and return the JSON response body
  return res.json();
};

/**
 * Fetch current user's rank (requires login)
 * 
 * Retrieves the authenticated user's position on the leaderboard.
 * This endpoint requires the user to be logged in (session cookie).
 * 
 * @returns {Promise<{ success: boolean, position: number, username: string, totalXP: number, rank: string }>}
 *          - success: indicates if the request was successful
 *          - position: user's numerical rank on the leaderboard
 *          - username: the user's display name
 *          - totalXP: user's accumulated experience points
 *          - rank: user's tier/rank title (e.g., "Gold", "Platinum")
 * @throws {Error} If the fetch request fails or user is not authenticated
 */
export const getMyRank = async () => {
  // Make GET request to the user-specific rank endpoint
  // credentials: "include" is required here to send the auth session cookie
  const res = await fetch(`${BASE_URL}/api/leaderboard/me`, {
    credentials: "include",
  });

  // Throw an error if the response status indicates failure
  // Common failures: 401 (not logged in), 404 (user not found)
  if (!res.ok) throw new Error(`Failed to fetch rank: ${res.status}`);

  // Parse and return the JSON response body
  return res.json();
};