# Security Rules (from benavlabs/vibe-check)

These rules apply to all code generated and modified in NyayaSetu. They are non-negotiable.

## 1. Secrets & Credentials
- NEVER hardcode API keys, database credentials, or secret tokens in frontend or backend source files.
- NEVER put secret keys in environment variables prefixed with `NEXT_PUBLIC_`, `VITE_`, or `REACT_APP_` (these are bundled into the client).
- The `.env` file MUST remain in `.gitignore`. Always use `.env.example` with sanitized placeholder values.
- In `application.properties`, never rely on hardcoded fallback secrets for production cryptographic operations (e.g. `youpi.webhook.secret`).

## 2. Authentication & Authorization
- EVERY API route that returns or modifies user data MUST have authentication middleware running BEFORE the handler.
- Unauthenticated requests to protected endpoints MUST return HTTP 401 Unauthorized.
- EVERY route taking a resource ID MUST verify that the authenticated user owns that resource: `current_user.id == resource.owner_id`. This is an independent check from authentication.
- Admin endpoints MUST strictly verify `hasRole('ADMIN')` and return HTTP 403 Forbidden for non-admin users.
- Public registration or modification of privileged profiles (e.g., `POST /api/v1/lawyers`) is forbidden without `ADMIN` authority.

## 3. Payment & Webhook Security
- ALL incoming payment webhooks (e.g. `/api/v1/payments/youpi/webhook`) MUST require the signature header (`X-Gateway-Signature`). If missing, empty, or invalid, the request MUST be rejected immediately with HTTP 401.
- Never trust amounts submitted in client request bodies; always source transaction amounts server-side from authoritative database records.
- Testing/simulation endpoints (e.g., `/simulate-success/**`) MUST be disabled in production environments or restricted to `hasRole('ADMIN')`.

## 4. Input & File Upload Safety
- File uploads MUST validate MIME types using magic bytes (header inspection), NOT client-supplied `Content-Type` headers.
- File extensions MUST be strictly checked against an allowed whitelist (`.png`, `.jpg`, `.jpeg`, `.webp`, `.pdf`).
- Uploaded files must be renamed to server-generated UUIDs and stored outside executable web roots.
- All database interactions MUST remain parameterized via Spring Data JPA; NEVER concatenate user strings into queries.

## 5. Security Headers & CORS
- Set standard security headers on all responses:
  - `Content-Security-Policy: default-src 'self'; ...`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- NEVER configure CORS with wildcard `allowedOrigins("*")` alongside stateful credentials or sensitive API methods. Restrict allowed origins to designated frontend domains.
