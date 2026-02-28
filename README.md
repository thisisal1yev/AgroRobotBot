# AgroDoctorBot

AI-powered agricultural platform for managing farms, monitoring fields with autonomous robots, detecting plant diseases, and generating data-driven recommendations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 / Vue 3 |
| UI | Nuxt UI 4 / Tailwind CSS 4 |
| Backend | Nitro Server Routes / TypeScript |
| Database | PostgreSQL / Prisma ORM |
| Auth | nuxt-auth-utils (encrypted session cookies) |
| Font | Montserrat (Google Fonts) |

---

## Project Structure

```
app/
├── components/          # UI components (DataTable, StatCard, FilterBar, slidesovers)
├── composables/         # useDashboard (navigation, keyboard shortcuts)
├── constants/           # navigation, roles, routes
├── layouts/             # default, auth, admin, farmer
├── middleware/           # auth guard (session + role-based redirect)
├── pages/
│   ├── index.vue        # Public landing page
│   ├── auth.vue         # Login / Register
│   ├── admin/           # Admin dashboard, users, farms, fields, robots, alerts, reports
│   └── farmer/          # Farmer dashboard, farms, fields, seasons, robots, alerts, predictions
└── utils/               # Formatting helpers

server/
├── api/
│   ├── auth/            # login, register, logout, me
│   ├── admin/           # stats, users CRUD
│   ├── farms/           # CRUD
│   ├── fields/          # CRUD
│   ├── robots/          # CRUD
│   ├── seasons/         # CRUD
│   ├── alerts/          # list, get
│   ├── missions/        # list
│   ├── telemetry/       # list
│   ├── plant-analyses/  # list
│   ├── recommendations/ # list
│   └── reports/         # list, get
└── utils/               # auth guards, param helpers

prisma/
├── schema.prisma        # Database schema
├── db.ts                # PrismaClient singleton
├── seed.ts              # Seed / reset script
└── migrations/          # Migration history
```

---

## Data Model

```
User ──< Farm ──< Field ──< TelemetryReading
  │        │        │            (from Robot)
  │        │        ├──< PlantAnalysis
  │        │        ├──< Alert
  │        │        ├──< Recommendation
  │        │        └──< Mission ──> Robot
  │        ├──< Robot
  │        └──< Season
  └──< Report ──> Farm
```

**Enums:** `Role` (FARMER, ADMIN), `SoilType`, `SeasonStatus`, `RobotStatus`, `MissionStatus`, `AlertSeverity`, `AlertStatus`

---

## Features

- **Two roles:** Admin (system-wide management) and Farmer (own data only)
- **Farm management:** Create, edit, delete farms with location, area, soil type
- **Field management:** Subdivisions of farms with crop type and coordinates
- **Robot fleet:** Track autonomous robots (status, battery, firmware, missions)
- **Telemetry:** Soil data collection (moisture, pH, NPK, EC, temperature, humidity)
- **Plant analysis:** AI-based disease detection with confidence scoring
- **Alerts:** Severity-based alerting system (LOW to CRITICAL)
- **Recommendations:** Agronomic suggestions with apply tracking
- **Seasons:** Crop season tracking (PLANNED / ACTIVE / COMPLETED)
- **Reports:** Generated reports linked to farms
- **Keyboard shortcuts:** `G`+key navigation across dashboards

---

## API Endpoints

| Resource | Methods | Notes |
|---|---|---|
| `/api/auth/*` | POST (login, register, logout), GET (me) | Session-based |
| `/api/admin/stats` | GET | Aggregate system counts |
| `/api/admin/users` | GET, POST | Admin only |
| `/api/admin/users/[id]` | GET, PUT, DELETE | Admin only |
| `/api/farms` | GET, POST | Scoped by role |
| `/api/farms/[id]` | GET, PUT, DELETE | Owner or admin |
| `/api/fields` | GET, POST | Scoped by farm ownership |
| `/api/fields/[id]` | GET, PUT, DELETE | Owner or admin |
| `/api/robots` | GET (`?farmId`), POST | Scoped by farm ownership |
| `/api/robots/[id]` | GET, PUT, DELETE | Owner or admin |
| `/api/seasons` | GET, POST | Scoped by farm ownership |
| `/api/seasons/[id]` | GET, PUT, DELETE | Owner or admin |
| `/api/alerts` | GET (`?status`) | Scoped |
| `/api/alerts/[id]` | GET | Scoped |
| `/api/missions` | GET | Scoped |
| `/api/telemetry` | GET | Scoped |
| `/api/plant-analyses` | GET | Scoped |
| `/api/recommendations` | GET (`?applied`) | Scoped |
| `/api/reports` | GET | Scoped |
| `/api/reports/[id]` | GET | Scoped |

---

## Getting Started

### Prerequisites

- Bun
- PostgreSQL

### Installation

```bash
git clone <repository-url>
cd AgroDoctorBot
bun install
```

### Environment

Create a `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/agrodoctorbot"
NUXT_SESSION_PASSWORD="your-secret-key-min-32-chars"
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Seed Data

```bash
tsx prisma/seed.ts
```

| Flag | Description |
|---|---|
| `--down` | Clear all data |
| `--seed-only` | Seed without cleaning first |

### Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### Other Scripts

| Script | Description |
|---|---|
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run typecheck` | Run type checking |
| `bun run lint` | ESLint (zero warnings) |
| `pnpm prisma:studio` | Open Prisma Studio |

---

## Auth System

- **Login/Register** via email + password (bcrypt hashed)
- **Sessions** stored as encrypted HTTP-only cookies (nuxt-auth-utils)
- **Client middleware** redirects unauthenticated users to `/auth` and enforces role-based routing
- **Server guards:** `requireAuth`, `requireAdmin`, `requireOwnerOrAdmin` — farmers are automatically scoped to their own data at the query level

---

## Roadmap

- NDVI/EVI satellite data integration
- AI-based yield prediction engine
- Drone imagery processing
- Fertilizer recommendation system
- Push notifications
- Role-based access control expansion
