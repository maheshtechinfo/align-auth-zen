// Mock "database" for uniqueness checks. Replace with API calls in production.
const EXISTING_EMAILS = new Set<string>(["admin@taskalign.com", "demo@taskalign.com"]);
const EXISTING_MOBILES = new Set<string>(["+15551234567", "+919999999999"]);

export function emailExists(email: string) {
  return EXISTING_EMAILS.has(email.trim().toLowerCase());
}
export function mobileExists(mobile: string) {
  return EXISTING_MOBILES.has(mobile.replace(/\s+/g, ""));
}
export function registerEmail(email: string) {
  EXISTING_EMAILS.add(email.trim().toLowerCase());
}
export function registerMobile(mobile: string) {
  EXISTING_MOBILES.add(mobile.replace(/\s+/g, ""));
}
