import { useSyncExternalStore } from "react";

export type UserProfile = {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  avatarDataUrl: string | null;
  createdAt: string;
  lastLogin: string;
};

const STORAGE_KEY = "taskalign.profile";

const DEFAULT_PROFILE: UserProfile = {
  fullName: "Mahesh Kumar",
  email: "mahesh@gmail.com",
  mobile: "9876543210",
  role: "Manager",
  avatarDataUrl: null,
  createdAt: "15-Apr-2026",
  lastLogin: "25-Jun-2026 09:30 AM",
};

let current: UserProfile = load();
const listeners = new Set<() => void>();

function load(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

export function getProfile(): UserProfile {
  return current;
}

export function updateProfile(patch: Partial<UserProfile>) {
  current = { ...current, ...patch };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProfile(): UserProfile {
  return useSyncExternalStore(subscribe, getProfile, getProfile);
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Simple uniqueness check against a reserved set (excluding current user values).
const RESERVED_EMAILS = new Set(["admin@taskalign.com", "demo@taskalign.com"]);
const RESERVED_MOBILES = new Set(["9999999999", "1234567890"]);

export function isEmailTaken(email: string) {
  const normalized = email.trim().toLowerCase();
  if (normalized === current.email.toLowerCase()) return false;
  return RESERVED_EMAILS.has(normalized);
}
export function isMobileTaken(mobile: string) {
  const normalized = mobile.replace(/\s+/g, "");
  if (normalized === current.mobile) return false;
  return RESERVED_MOBILES.has(normalized);
}

// Mock current password
let currentPassword = "Password@123";
export function verifyPassword(p: string) {
  return p === currentPassword;
}
export function setPassword(p: string) {
  currentPassword = p;
}

export function passwordStrength(p: string): { score: 0 | 1 | 2 | 3; label: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;
  const s = Math.min(score, 3) as 0 | 1 | 2 | 3;
  return { score: s, label: ["Too weak", "Weak", "Medium", "Strong"][s] };
}
