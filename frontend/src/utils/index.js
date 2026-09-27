/**
 * NyayaSetu — Utility Functions
 */
import clsx from 'clsx';

/** clsx wrapper — use this everywhere instead of importing clsx directly */
export const cn = (...args) => clsx(...args);

export * from './pricing';

/**
 * Format a date for display
 * formatDate(new Date()) → "7 Aug 2026"
 */
export function formatDate(date, options = {}) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
      ...options,
    }).format(new Date(date));
  } catch {
    return '';
  }
}

/**
 * Format time for display
 * formatTime(new Date()) → "8:30 PM"
 */
export function formatTime(date) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      hour:   'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  } catch {
    return '';
  }
}


/**
 * Truncate text to a given length with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generate initials from a name
 * initials("Priya Sharma") → "PS"
 */
export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/**
 * Slugify a string
 * slugify("Consumer Rights") → "consumer-rights"
 */
export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Clamp a number between min and max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Sleep — useful for artificial delays in mock flows
 * await sleep(500);
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
