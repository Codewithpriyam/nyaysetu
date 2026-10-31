# NyayaSetu (न्यायसेतु) — Justice. Simplified.

> Modern Indian Legal Access & Citizen Empowerment Platform bridging 1.4 billion citizens with statutory rights, legal remedies, and licensed advocates.

---

## 🏛️ Overview

**NyayaSetu** is a full-stack, enterprise-grade Indian legal intelligence and consultation platform. It simplifies complex Indian statutory law (Bharatiya Nyaya Sanhita, Consumer Protection Act, CrPC/BNSS, RERA, Cyber Law, Labour Laws) into actionable plain-language steps for citizens, provides contextual AI assistance via Groq Llama-3 70B, and enables direct advocate bookings via an integrated sovereign UPI payment gateway (YouPI PG).

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + Cormorant Garamond & Inter typography
- **Animations**: GSAP 3 (ScrollTrigger, Flip, Observer) + Lenis smooth scrolling
- **State & Server Cache**: Zustand + TanStack React Query v5
- **Authentication**: Clerk OAuth2 & JWT
- **Linter**: Oxlint (0 errors, 0 warnings)

### Backend
- **Framework**: Java 17 + Spring Boot 3.3.0
- **Security**: Spring Security 6 + OAuth2 Resource Server (Clerk JWT integration)
- **Database & ORM**: MySQL 8 / H2 in-memory (testing), Spring Data JPA, Hibernate
- **Migrations**: Flyway Migration Engine (V1 through V5)
- **AI Engine**: Groq Cloud API (Llama-3.3 70B Versatile with legal statutory guardrails)
- **Payment Gateway**: YouPI PG sovereign UPI payment system (HMAC-SHA256 webhooks, Central Admin Escrow routing)

---

## 📁 Repository Structure

```
Nyaysetu/
├── backend/                             # Spring Boot 3.3 Java backend
│   ├── src/main/java/com/nyaysetu/backend/
│   │   ├── config/                      # SecurityConfig, CorsConfig, ClerkJwtConverter, DataInitializer
│   │   ├── controller/                  # Admin, Advocate, AI, Case, Consultation, Me, Payment controllers
│   │   ├── dto/                         # Strongly-typed data transfer objects
│   │   ├── exception/                   # Global exception handling & error responses
│   │   ├── model/                       # JPA entities (User, LegalCase, Consultation, Payment, etc.)
│   │   ├── repository/                  # Spring Data JPA repositories with parameterized queries
│   │   └── service/                     # GroqAiEngine, UserService, YoupiPaymentService
│   ├── src/main/resources/
│   │   ├── application.properties       # App configuration & environment mappings
│   │   └── db/migration/                # Flyway V1..V5 SQL schema migrations
│   ├── src/test/                        # Automated unit & integration test suite
│   ├── .env.example                     # Environment variables template
│   ├── Dockerfile                       # Production container definition
│   └── pom.xml                          # Maven build dependencies
│
├── frontend/                            # React 19 + Vite frontend
│   ├── public/                          # Static assets (fonts, icons, favicon)
│   ├── src/
│   │   ├── animations/                  # GSAP & smooth scroll configurations
│   │   ├── components/                  # Reusable UI components (BentoTilt, Buttons, Navigation, Modals)
│   │   ├── constants/                   # Routes, legal categories, status codes
│   │   ├── data/                        # State advocate rosters & mock datasets
│   │   ├── pages/                       # Public, user dashboard, lawyer panel, and admin portal pages
│   │   ├── sections/                    # Modular landing page sections
│   │   ├── services/                    # Axios API client, Groq Legal AI service, OSM search
│   │   └── utils/                       # Formatting, defensive pricing, user registry
│   ├── .env.example                     # Environment variables template
│   ├── package.json                     # Clean production dependencies
│   └── vite.config.js                   # Vite bundler configuration
│
├── AGENTS.md                            # Non-negotiable repository security & vibe-check rules
└── SECURITY_AUDIT_REPORT.md             # Security audit compliance ledger
```

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Maven**: 3.9+
- **Node.js**: v20+ & npm 10+
- **MySQL**: 8.0+ (or use default H2 for local evaluation)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env` and provide your credentials:
   ```bash
   cp .env.example .env
   ```
3. Build and run tests:
   ```bash
   mvn clean test
   ```
4. Start the Spring Boot backend server:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will run on `http://localhost:8080` (API base: `/api/v1`).

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run code linter:
   ```bash
   npm run lint
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

6. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Governance

The codebase adheres strictly to the security standards documented in `AGENTS.md`:

1. **Authentication & Role-Based Authorization**: Every protected route enforces JWT authentication and role authorization (`ROLE_USER`, `ROLE_LAWYER`, `ROLE_ADMIN`).
2. **Object-Level Access Controls (IDOR Defense)**: Resource ownership is strictly checked server-side (`current_user.id == resource.owner_id`) for all cases, consultations, and payment records.
3. **Webhook Verification**: Payment webhooks enforce HMAC-SHA256 signature validation via the `X-Gateway-Signature` header.
4. **Input & Upload Safety**: File uploads inspect magic bytes directly, enforce strict extension whitelisting (`.png`, `.jpg`, `.jpeg`, `.webp`), and store files under server-generated UUIDs.
5. **Security Headers**: Standard CSP, HSTS (`max-age=31536000`), X-Frame-Options (`DENY`), and X-Content-Type-Options (`nosniff`) headers are active.

---

## 📄 License

Proprietary — All rights reserved. Developed for NyayaSetu.

