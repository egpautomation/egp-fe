/**
 * Central app config from environment variables.
 * All sensitive / environment-specific values should be read from here.
 */

// @ts-nocheck
const getEnv = (key: string) => {
  // Check runtime env first (docker), then build time env (local/vite)
  if (typeof window !== "undefined" && window._env_ && window._env_[key]) {
    return window._env_[key];
  }
  return import.meta.env[key] as string | undefined;
};

export const config = {
  /** Main API base URL (auth, most CRUD) */
  apiBaseUrl: getEnv("VITE_API_BASE_URL"),
  /** Alternate API (some endpoints on Vercel) */
  apiBaseUrlAlt: getEnv("VITE_API_BASE_URL"), // Using main API for alt as well per user request
  /** Exin / AllTender API */
  exinApiBaseUrl: getEnv("VITE_EXIN_API_BASE_URL"),
  /** TTI server */
  ttiServerUrl: getEnv("VITE_TTI_SERVER_URL"),
  /** ImageBB API key for image upload */
  imagebbApiKey: getEnv("VITE_IMAGEBB_API_KEY"),
  /** Support WhatsApp number (country code, no +) */
  supportWhatsApp: getEnv("VITE_SUPPORT_WHATSAPP"),
  /** EGP site URL for links */
  egpSiteUrl: getEnv("VITE_EGP_SITE_URL"),
} as const;

export default config;
