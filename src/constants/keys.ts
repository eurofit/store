export const NAMESPACE = '_ef'; // ef = eurofit

export const COOKIE_KEYS = {
  GUEST_SESSION_ID: `${NAMESPACE}_g`,
} as const;

export const STORAGE_KEYS = {
  RECENT_SEARCHES: `${NAMESPACE}_rs`,
} as const;
