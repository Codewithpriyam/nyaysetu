/**
 * NyayaSetu — Route Path Constants
 * Single source of truth for all route strings.
 */

export const ROUTES = {
  // Public
  HOME:             '/',
  KNOW_YOUR_RIGHTS: '/know-your-rights',
  CATEGORIES:       '/categories',
  CATEGORY:         '/categories/:slug',
  GUIDE:            '/guides/:slug',
  LAWYERS:          '/lawyers',
  LAWYER_PROFILE:   '/lawyers/:id',
  LAWYER_DETAIL:    '/lawyers/:id',
  RESOURCES:        '/resources',
  ABOUT:            '/about',
  ARCHITECTURE:     '/architecture',
  PRIVACY:          '/privacy',
  TERMS:            '/terms',
  CONTACT:          '/contact',
  HELP:             '/help',
  FAQ:              '/faq',

  // Auth
  SIGN_IN:          '/sign-in',
  SIGN_UP:          '/sign-up',

  // User (protected)
  DASHBOARD:        '/dashboard',
  CASES:            '/cases',
  CASE_DETAIL:      '/cases/:id',
  CONSULTATIONS:    '/consultations',
  CONSULTATION_DETAIL: '/consultations/:id',
  DOCUMENTS:        '/documents',

  // Lawyer (protected)
  LAWYER_DASHBOARD:    '/lawyer/dashboard',
  LAWYER_REQUESTS:     '/lawyer/requests',
  LAWYER_CONSULTATIONS: '/lawyer/consultations',
  LAWYER_AVAILABILITY: '/lawyer/availability',
  LAWYER_PROFILE_EDIT: '/lawyer/profile',
  LAWYER_EARNINGS:     '/lawyer/earnings',

  // Admin (protected)
  ADMIN:                '/admin',
  ADMIN_DASHBOARD:      '/admin/dashboard',
  ADMIN_USERS:          '/admin/users',
  ADMIN_LAWYERS:        '/admin/lawyers',
  ADMIN_CONSULTATIONS:  '/admin/consultations',
  ADMIN_LEGAL_CONTENT:  '/admin/legal-content',
  ADMIN_CATEGORIES:     '/admin/categories',
  ADMIN_AUDIT:          '/admin/audit',
};

/**
 * Helper to build dynamic routes
 * Usage: buildRoute(ROUTES.LAWYER_PROFILE, { id: '123' }) → '/lawyers/123'
 */
export function buildRoute(pattern, params = {}) {
  if (!pattern) return '#';
  return Object.entries(params).reduce(
    (path, [key, val]) => path.replace(`:${key}`, val),
    pattern
  );
}
