/**
 * NyayaSetu — Defensive Pricing & Monetary Formatting Utilities
 * Eliminates all ₹NaN, NaN/min, undefined, null, Infinity bugs across the application.
 */

/**
 * Safely parse any input into a finite number.
 * Returns fallback (default null) if value is invalid, null, undefined, NaN, or infinite.
 */
export function parseNumeric(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const cleaned = value.trim();
    if (cleaned === '' || cleaned.toLowerCase() === 'nan' || cleaned.toLowerCase() === 'undefined' || cleaned.toLowerCase() === 'null') {
      return fallback;
    }
    const stripped = cleaned.replace(/[^0-9.-]/g, '');
    if (stripped === '' || stripped === '-' || stripped === '.' || stripped === '-.') {
      return fallback;
    }
    const parsed = Number(stripped);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * Format Indian Rupee currency safely.
 * Never outputs ₹NaN or ₹undefined.
 * If invalid or null, returns fallback (default: 'Price unavailable').
 *
 * Example:
 * formatCurrency(500) -> "₹500"
 * formatCurrency(null) -> "Price unavailable"
 * formatCurrency(NaN) -> "Price unavailable"
 */
export function formatCurrency(amount, { decimals = 0, fallback = 'Price unavailable' } = {}) {
  const numeric = parseNumeric(amount);
  if (numeric === null || numeric === undefined) {
    return fallback;
  }
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numeric);
  } catch (e) {
    return fallback;
  }
}

/**
 * Format per-minute rate safely.
 * Returns "₹X/min" for valid values, or "Price unavailable" if invalid.
 *
 * Example:
 * formatPerMinuteRate(25) -> "₹25/min"
 * formatPerMinuteRate(null) -> "Price unavailable"
 * formatPerMinuteRate("NaN") -> "Price unavailable"
 */
export function formatPerMinuteRate(rate, { fallback = 'Price unavailable' } = {}) {
  const numeric = parseNumeric(rate);
  if (numeric === null || numeric === undefined || numeric < 0) {
    return fallback;
  }
  return `₹${Math.round(numeric)}/min`;
}

/**
 * Calculate and format total consultation price safely from rate & duration.
 *
 * Example:
 * formatConsultationPrice(25, 20) -> "₹500"
 * formatConsultationPrice(null, 20) -> "Price unavailable"
 * formatConsultationPrice(25, null) -> "Price unavailable"
 */
export function formatConsultationPrice(ratePerMinute, durationMinutes, { decimals = 0, fallback = 'Price unavailable' } = {}) {
  const numRate = parseNumeric(ratePerMinute);
  const numDuration = parseNumeric(durationMinutes);
  if (numRate === null || numDuration === null || numRate < 0 || numDuration <= 0) {
    return fallback;
  }
  const total = numRate * numDuration;
  return formatCurrency(total, { decimals, fallback });
}

/**
 * Safely compute raw numeric cost for consultations without throwing NaN.
 */
export function calculateConsultationCost(ratePerMinute, durationMinutes, fallback = 0) {
  const numRate = parseNumeric(ratePerMinute);
  const numDuration = parseNumeric(durationMinutes);
  if (numRate === null || numDuration === null || numRate < 0 || numDuration <= 0) {
    return fallback;
  }
  return numRate * numDuration;
}

/**
 * Safely format consultation duration string.
 * formatDuration(20) -> "20 mins"
 * formatDuration(null) -> "20 mins"
 */
export function formatDuration(durationMinutes, fallback = '20 mins') {
  const num = parseNumeric(durationMinutes);
  if (num === null || num <= 0) {
    return fallback;
  }
  return `${Math.round(num)} mins`;
}
