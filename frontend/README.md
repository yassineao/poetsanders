# Poets Anders Frontend

Angular frontend for the Poets Anders public website, booking flow, customer account pages, admin dashboard, and car inventory management.

## Features

- Multilingual public pages in English, Dutch, and German
- Treatment overview and detail pages
- Booking flow for detailing appointments
- Cookie-based login and session restore
- Automatic token refresh for authenticated API requests
- Customer profile and appointment history
- Admin dashboard protected by a route guard
- Admin management for users, appointments, and cars
- Multi-picture car upload with previews

## Commands

```bash
npm ci
npm start
npm run build
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/book` | Booking flow |
| `/services` | Treatment overview |
| `/services/:slug` | Treatment details |
| `/faq` | FAQ |
| `/login` | Login |
| `/profile` | Profile |
| `/appointments` | Appointment history |
| `/admin` | Admin dashboard |

## Environment

Create `.env` from `.env.example`:

```dotenv
API_BASE_URL=https://autoanders-api.onrender.com
API_PROXY_TARGET=http://localhost:8080
DEALERSHIP_URL=
```

The generated Angular environment file is created by the npm pre-scripts.
