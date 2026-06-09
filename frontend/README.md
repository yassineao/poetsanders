# Poets Anders Frontend

Angular frontend for the Poets Anders detailing website and appointment
platform.

## Features

- Responsive multilingual website in English, Dutch, and German
- Treatment overview and detail pages
- Account registration and cookie-based login
- Multi-treatment booking with date and time selection
- Booking confirmation and appointment history
- Pending, partially accepted, and accepted appointment states
- Appointment cancellation
- Profile updates for name, phone number, and password
- Admin dashboard with:
  - Summary statistics
  - Searchable and paginated users
  - Searchable, filterable, paginated appointments
  - Earliest-first appointment ordering
  - Appointment acceptance
- Configurable external dealership link
- Angular SSR, prerendering, and hydration

## Technology

- Angular 21 standalone components
- TypeScript 5.9
- Angular Router and Reactive Forms
- Angular signals and RxJS
- Tailwind CSS 4
- Angular SSR
- Vitest

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page and authenticated appointment preview |
| `/admin` | Admin dashboard |
| `/appointments` | Full appointment history |
| `/book` | Registration and booking form |
| `/faq` | Frequently asked questions |
| `/login` | Login |
| `/profile` | Profile editing and logout |
| `/services` | Treatment overview |
| `/services/:slug` | Treatment details |

After login, `ADMIN` users are redirected to `/admin`; other users are
redirected to `/`.

## Environment

Create `.env` from `.env.example`:

```dotenv
API_BASE_URL=
API_PROXY_TARGET=http://localhost:8080
DEALERSHIP_URL=
```

| Variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Backend origin compiled into production builds |
| `API_PROXY_TARGET` | Local Angular proxy target |
| `DEALERSHIP_URL` | External dealership URL shown in navigation |

With an empty `API_BASE_URL`, requests to `/auth` and `/wash_calendar` are
forwarded to `API_PROXY_TARGET`. The current proxy does not include `/admin`,
so use `API_BASE_URL=http://localhost:8080` when testing the admin dashboard
locally, or add `/admin` to `proxy.conf.cjs`.

The `prestart`, `prebuild`, `prewatch`, and `pretest` scripts generate:

```text
src/environments/environment.generated.ts
```

## Getting Started

Requirements:

- Node.js supported by Angular 21
- npm 11
- Running Poets Anders backend

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Generate environment and start Angular |
| `npm run build` | Build browser and SSR bundles |
| `npm run watch` | Run a development build in watch mode |
| `npm test` | Run tests |
| `npm run serve:ssr:frontend` | Serve an existing SSR build |

## Structure

```text
src/app/
|-- core/
|   |-- admin/                 Admin API client
|   |-- auth/                  Authentication and session state
|   |-- booking/               Appointment API client
|   |-- i18/                   Locale state and translations
|   `-- interfaces/            Typed frontend contracts
|-- features/
|   |-- admin/
|   |   |-- components/
|   |   |   |-- admin-appointments/
|   |   |   |-- admin-dashboard-stats/
|   |   |   `-- admin-users/
|   |   `-- pages/
|   |-- appointments/
|   |-- faq/
|   |-- form/
|   |-- home/
|   |-- login/
|   |-- profile/
|   `-- services/
`-- shared/components/        Navbar and footer
```

The admin page remains the data container. Its child components independently
own table search, filtering, sorting, and pagination.

## Authentication

All authenticated requests use `withCredentials: true`. The backend stores
access and refresh JWTs in HTTP-only cookies. `AuthService.currentUser` holds
the active user in memory and `/auth/me` restores the session after reload.

Backend authorization is authoritative. The frontend also checks the `ADMIN`
role before displaying the admin dashboard.

## Verification

```bash
npx tsc --noEmit -p tsconfig.app.json
npx ngc -p tsconfig.app.json
npm run build
```

The production build currently completes with an initial bundle budget warning.

## Repository

[github.com/yassineao/poetsanders](https://github.com/yassineao/poetsanders)
