```md
# MLR Predictor

MLR Predictor is an AI-powered agricultural analytics platform designed to help farmers monitor fields, analyze crop health, and predict yield using data-driven insights.

The system combines field structure management (farms, fields, seasons) with analytics and machine learning to support modern precision agriculture workflows.

---

## Overview

MLR Predictor provides a centralized dashboard where users can:

- Manage farms and agricultural fields
- Track seasonal crop data
- Analyze historical and current agricultural metrics
- Predict crop yield using AI models
- Generate actionable recommendations based on collected data

The platform focuses on building a scalable MVP using modern full-stack web technologies.

---

## Tech Stack

### Frontend / Meta Framework

- Nuxt v4
- Vue v3
- Nuxt UI v4
- Tailwind CSS v4

### Backend

- Nuxt Server Routes (Nitro server engine)
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- Custom auth middleware

---

## Core Concepts

### Farms

Represents a physical agricultural location owned by a user.

### Fields

Subdivisions of farms that contain crop-specific information such as area and crop type.

### Seasons

Defines agricultural periods (year + crop) linked to a specific field.

---

## Features (MVP)

- Authentication-protected dashboard
- Farm management
- Field management
- Season tracking
- Dashboard statistics
- Recent seasons table
- API-driven data fetching
- Prisma-based database models

---

## Project Structure (Simplified)

```

.
├── components/
├── pages/
│   └── dashboard/
├── server/
│   ├── api/
│   └── middleware/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── layouts/
├── middleware/
└── nuxt.config.ts

````

---

## Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd mlr-predictor
````

### 2. Install dependencies

```bash
pnpm install
```

(or npm/yarn depending on your setup)

### 3. Environment variables

Create `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mlr_predictor"
```

---

### 4. Prisma setup

Run migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

---

### 5. Seed database

```bash
tsx prisma/seed.ts
```

Options:

```
--down        Clear database
--seed-only   Seed without cleaning
```

---

### 6. Run development server

```bash
pnpm dev
```

Application will be available at:

```
http://localhost:3000
```

---

## API (Example Endpoints)

* `/api/dashboard/stats`
* `/api/farms`
* `/api/fields`
* `/api/seasons`

---

## Design Goals

* Clean architecture aligned with Nuxt ecosystem
* Server-driven data flow using Nuxt server routes
* Fast MVP development using Nuxt UI
* Scalable database design with Prisma
* Type-safe fullstack development

---

## Future Roadmap

* NDVI/EVI data integration
* AI-based yield prediction engine
* Drone imagery processing
* Recommendation system for fertilizers and crop management
* Alerts and notifications
* Role-based access control