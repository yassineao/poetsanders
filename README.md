# Poets Anders

Full-stack website for **Poets Anders**, a car cleaning and detailing business
in Papendrecht, the Netherlands.

The repository contains an Angular frontend and a Spring Boot API. Customers
can browse treatments, create an account, sign in, book appointments, review
their bookings, and cancel appointments from their profile.

## Features

- Responsive home, services, booking, login, and profile pages
- English, German, and Dutch content
- Five car-care treatment packages
- Registration and login with JWT cookies
- Authenticated appointment booking
- Customer profile with booking history
- Appointment cancellation
- Angular SSR and prerendering
- PostgreSQL persistence
- Tailwind CSS styling

## Technology

### Frontend

- Angular 21
- TypeScript
- Angular Router and Reactive Forms
- Angular SSR
- RxJS
- Tailwind CSS 4
- Vitest

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT authentication
- Maven
- Docker

## Repository Structure

```text
poetsanders/
|-- frontend/
|   |-- public/                  Static assets
|   |-- scripts/                 Environment generation
|   `-- src/app/
|       |-- core/
|       |   |-- auth/            Authentication service
|       |   |-- booking/         Booking API service
|       |   |-- i18/             Translations and language service
|       |   `-- interfaces/      Shared TypeScript interfaces
|       |-- features/
|       |   |-- form/            Booking page
|       |   |-- home/            Home page
|       |   |-- login/           Login and registration
|       |   |-- profile/         Account details and bookings
|       |   `-- services/        Treatment pages
|       `-- shared/              Navbar and footer
|-- backend/
|   `-- AutoAnders/
|       |-- src/main/java/       Spring application
|       |-- src/main/resources/  Configuration
|       |-- compose.yaml         API container definition
|       `-- Dockerfile
|-- README.md
`-- vercel.json
```

## Requirements

- Node.js supported by Angular 21
- npm 11.6.1
- Java 21
- PostgreSQL database
- Docker, optional

## Frontend Setup

Create the local environment file:

```bash
cd frontend
cp .env.example .env
```

Default development configuration:

```dotenv
API_BASE_URL=
API_PROXY_TARGET=http://localhost:8080
```

- `API_BASE_URL` is compiled into the Angular environment.
- An empty `API_BASE_URL` uses relative API paths.
- `API_PROXY_TARGET` tells the Angular development proxy where the backend is.

Install and start the frontend:

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

The environment generator runs automatically before development and production
builds. It creates:

```text
frontend/src/environments/environment.generated.ts
```

Do not edit that generated file directly.

## Backend Setup

The API reads its database and JWT configuration from environment variables:

```dotenv
SUPABASE_DB_URL=jdbc:postgresql://localhost:5432/autoanders
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your-password
SUPABASE_JWT_SECRET=use-a-long-random-secret
```

Set these variables in your shell or deployment environment, then run:

```bash
cd backend/AutoAnders
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend/AutoAnders
.\mvnw.cmd spring-boot:run
```

The API runs at [http://localhost:8080](http://localhost:8080).

### Docker

Create `backend/AutoAnders/.env` with the backend variables, then run:

```bash
cd backend/AutoAnders
docker compose up --build
```

The compose configuration exposes the API on port `8080`.

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/services` | Treatment overview |
| `/services/:slug` | Treatment details |
| `/book` | Authenticated booking form |
| `/login` | Login and registration |
| `/profile` | Customer details and bookings |

Treatment slugs:

```text
total-treatment
interior-treatment
exterior-treatment
headlight-treatment
ozone-treatment
```

## Authentication

The backend issues access and refresh tokens as HTTP-only cookies. Frontend API
requests use `withCredentials: true`, so cookies are sent automatically.

Important authentication endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account |
| `POST` | `/auth/login` | Sign in |
| `GET` | `/auth/me` | Restore the current user |
| `POST` | `/auth/refresh` | Refresh the access token |
| `POST` | `/auth/logout` | Clear authentication cookies |

## Booking API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/wash_calendar` | Book one treatment |
| `GET` | `/wash_calendar/by_user` | Get the current user's bookings |
| `GET` | `/wash_calendar/date/:date` | Get bookings for a date |
| `DELETE` | `/wash_calendar/:id` | Cancel a booking |

Selecting multiple treatments creates one backend booking record per treatment.
The profile groups records with the same date and time into one appointment.
Cancelling that appointment removes all associated records.

## Frontend Commands

Run these commands from `frontend`:

| Command | Description |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run build` | Create browser and server production bundles |
| `npm run watch` | Build continuously in development mode |
| `npm test` | Run frontend tests |
| `npm run serve:ssr:frontend` | Serve an existing SSR build |

Production output is written to:

```text
frontend/dist/frontend
```

## Backend Commands

Run these commands from `backend/AutoAnders`:

| Command | Description |
| --- | --- |
| `./mvnw spring-boot:run` | Start the API |
| `./mvnw test` | Run backend tests |
| `./mvnw package` | Build the application JAR |
| `docker compose up --build` | Build and run the API container |

Backend tests use Testcontainers and therefore require a running Docker engine.

## Localization

Translations are stored in:

```text
frontend/src/app/core/i18/translations/
```

Each locale has separate files for page and component copy:

```text
translations/en/
translations/de/
translations/nl/
```

## Vercel Deployment

Configure the Vercel project root as `frontend`.

The repository's `vercel.json` uses:

```text
Install command: npm ci
Build command: npm run build
Output directory: dist/frontend/browser
```

Set this frontend environment variable in Vercel:

```dotenv
API_BASE_URL=https://your-api-domain.example
```

Keep `frontend/package.json` and `frontend/package-lock.json` synchronized.
Vercel uses `npm ci`, which intentionally fails when dependency declarations
and the lockfile differ.

## Security Notes

- Never commit `.env` files or production secrets.
- Use a long random JWT secret.
- Production cookies require HTTPS.
- Configure backend CORS for the deployed frontend domain.
- The backend verifies that a customer owns a booking before cancellation.

## Repository

[github.com/yassineao/poetsanders](https://github.com/yassineao/poetsanders)
