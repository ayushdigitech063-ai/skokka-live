/**
 * Universal API helper for Skokka India Classifieds.
 * Supports Next.js (process.env.NEXT_PUBLIC_API_URL / BACKEND_URL)
 * and Vite (import.meta.env?.VITE_API_URL).
 */

const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  }

  try {
    // Vite environment variable check
    if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Ignore in non-Vite contexts
  }

  return 'https://skokka-backend-live.onrender.com';
};

const baseUrl = getBaseUrl();

export const CANDIDATE_API_URLS = Array.from(
  new Set(
    [
      baseUrl ? `${baseUrl}/api/profiles` : null,
      'https://skokka-backend-live.onrender.com/api/profiles',
    ].filter(Boolean)
  )
);

/**
 * Fetches profiles from API endpoints.
 * Works seamlessly across Next.js and Vite.
 * @returns {Promise<{ profiles: Array, error: string | null }>}
 */
export async function fetchProfilesApi() {
  let lastError = 'Unable to connect to backend server';

  for (const url of CANDIDATE_API_URLS) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        return { profiles: data, error: null };
      } else {
        lastError = `API endpoint returned status ${response.status} (${response.statusText})`;
      }
    } catch (err) {
      lastError = err?.message ? `fetch failed: ${err.message}` : 'fetch failed';
    }
  }

  return { profiles: [], error: lastError };
}
