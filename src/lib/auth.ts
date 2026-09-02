/**
 * Centralized Authentication Helper for Skokka / MyCityQueen
 * Manages JWT tokens, session persistence, and authorization headers.
 */

export const TOKEN_KEYS = ["skokka_jwt_token", "token", "skokka_admin_token", "adminToken"];

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value && value.trim() !== "" && value !== "null" && value !== "undefined") {
      return value.trim();
    }
  }
  return null;
};

export const setAuthToken = (token: string, user?: any): void => {
  if (typeof window === "undefined") return;
  if (!token) return;
  
  // Set primary and compatibility token keys
  localStorage.setItem("skokka_jwt_token", token);
  localStorage.setItem("token", token);
  localStorage.setItem("skokka_admin_token", token);
  localStorage.setItem("adminToken", token);

  if (user) {
    localStorage.setItem("skokka_admin_auth", "true");
    localStorage.setItem("skokka_admin_user", JSON.stringify(user));
    localStorage.setItem("skokka_admin_session", JSON.stringify(user));
  }
};

export const clearAuthToken = (): void => {
  if (typeof window === "undefined") return;
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("skokka_admin_auth");
  localStorage.removeItem("skokka_admin_user");
  localStorage.removeItem("skokka_admin_session");
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
