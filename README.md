# Poets Anders

Poets Anders is a full-stack car cleaning and detailing application for a
business in Papendrecht, the Netherlands.

Customers can browse treatments, switch languages, create an account, log in,
book one or more treatments, review their appointments, and cancel bookings.
The repository also contains backend support for cars and car pictures.

## Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication Flow](#authentication-flow)
- [Booking Flow](#booking-flow)
- [Profile and Cancellation Flow](#profile-and-cancellation-flow)
- [Database Model](#database-model)
- [Rendering and Environment Flow](#rendering-and-environment-flow)
- [Local Development](#local-development)
- [API Reference](#api-reference)
- [Testing and Builds](#testing-and-builds)
- [Deployment](#deployment)
- [Current Limitations](#current-limitations)

## Features

- Responsive home, services, booking, login, and profile pages
- English, German, and Dutch translations
- Five detailing treatments
- Angular reactive forms and client-side validation
- Registration and login with JWT cookies
- Automatic login after registration
- Booking for authenticated and new customers
- Multiple treatments at one appointment time
- Customer profile with grouped appointment history
- Appointment cancellation with ownership checks
- Angular SSR, prerendering, and client hydration
- Spring Security role-based authorization
- PostgreSQL persistence
- Supabase-compatible database and picture storage configuration
- Docker support for the backend
- Vercel configuration for the frontend

## Technology

| Area | Technology |
| --- | --- |
| Frontend | Angular 21, TypeScript, RxJS, Reactive Forms |
| Styling | Tailwind CSS 4 |
| Rendering | Angular SSR, prerendering, hydration with event replay |
| Frontend tests | Vitest through the Angular test builder |
| Backend | Java 21, Spring Boot 3.5 |
| Security | Spring Security, BCrypt, JJWT |
| Persistence | Spring Data JPA, Hibernate, PostgreSQL |
| Database migration | Flyway dependencies are included |
| Backend tests | JUnit, Spring Boot Test, Testcontainers |
| Packaging | npm, Maven Wrapper, Docker |

## System Architecture

```mermaid
flowchart LR
    User[Browser user]

    subgraph Frontend["Angular frontend"]
        Router[Angular Router]
        Pages[Standalone pages and components]
        Signals[Signals and computed state]
        Forms[Reactive Forms]
        Services[AuthService and BookingService]
        I18n[I18nService]
    end

    subgraph Backend["Spring Boot API"]
        Security[Spring Security filter chain]
        Controllers[REST controllers]
        DomainServices[Application services]
        Repositories[Spring Data repositories]
        Storage[Supabase picture storage client]
    end

    DB[(PostgreSQL)]
    Supabase[(Supabase Storage)]

    User --> Router
    Router --> Pages
    Pages --> Signals
    Pages --> Forms
    Pages --> I18n
    Pages --> Services
    Services -->|HTTPS and cookies| Security
    Security --> Controllers
    Controllers --> DomainServices
    DomainServices --> Repositories
    Repositories --> DB
    DomainServices --> Storage
    Storage --> Supabase
```

### Request Boundaries

1. Angular components never access PostgreSQL directly.
2. Components call injectable frontend services.
3. Frontend services use Angular `HttpClient` with `withCredentials: true`.
4. Spring Security validates the access token before protected controllers run.
5. Controllers convert HTTP requests into service calls.
6. Backend services apply domain checks and use repositories.
7. JPA repositories read and write PostgreSQL entities.

## Repository Structure

```text
poetsanders/
|-- frontend/
|   |-- public/                       Static assets
|   |-- scripts/
|   |   `-- generate-environment.mjs  Generates Angular environment code
|   |-- src/
|   |   |-- environments/             Generated/runtime build configuration
|   |   `-- app/
|   |       |-- core/
|   |       |   |-- auth/             Authentication HTTP service
|   |       |   |-- booking/          Booking HTTP service
|   |       |   |-- i18/              Language state and translations
|   |       |   `-- interfaces/       Shared TypeScript contracts
|   |       |-- features/
|   |       |   |-- form/             Booking feature
|   |       |   |-- home/             Home feature
|   |       |   |-- login/            Login feature
|   |       |   |-- profile/          Profile and appointments
|   |       |   `-- services/         Treatment overview and details
|   |       `-- shared/                Navbar and footer
|   |-- angular.json
|   |-- package.json
|   `-- proxy.conf.cjs
|-- backend/
|   `-- AutoAnders/
|       |-- src/main/java/Gloyoo/AutoAnders/
|       |   |-- config/               Security, JWT, CORS, datasource
|       |   |-- user/                 Accounts and authentication
|       |   |-- washCalendar/         Appointment domain
|       |   |-- Cars/                 Car domain
|       |   |-- CarPictures/          Picture metadata
|       |   `-- storage/              Supabase upload client
|       |-- src/main/resources/
|       |   `-- application.yaml
|       |-- compose.yaml
|       |-- Dockerfile
|       `-- pom.xml
|-- README.md
`-- vercel.json
```

## Frontend Architecture

The frontend uses standalone Angular components. There is no root NgModule.
Application providers are registered in `app.config.ts`.

```mermaid
flowchart TD
    Config[app.config.ts]
    RouterProvider[provideRouter]
    HttpProvider[provideHttpClient with fetch]
    Hydration[provideClientHydration with event replay]

    Config --> RouterProvider
    Config --> HttpProvider
    Config --> Hydration

    RouterProvider --> Routes[app.routes.ts]
    Routes --> Home[HomePageComponent]
    Routes --> Services[Services pages]
    Routes --> Booking[BookingPageComponent]
    Routes --> Login[LoginPageComponent]
    Routes --> Profile[ProfilePageComponent]

    Booking --> BookingForm[BookingFormComponent]
    Login --> LoginForm[LoginFormComponent]
    Profile --> Details[ProfileDetailsComponent]
    Profile --> Appointments[ProfileBookingsComponent]
```

### Frontend State

Angular signals hold local and shared state:

| State | Owner | Purpose |
| --- | --- | --- |
| `currentUser` | `AuthService` | Shared authenticated user |
| `submitting` | Form components | Prevent duplicate submissions |
| `selectedDate` | Booking form | Chosen calendar date |
| `selectedTime` | Booking form | Chosen appointment time |
| `bookings` | Profile page | Raw booking rows returned by the API |
| `appointments` | Profile page | Computed groups of booking rows |
| `cancellingIds` | Profile page | IDs currently being deleted |
| `language` | `I18nService` | Active locale and translated copy |

Computed signals derive display data without storing duplicate state. For
example, the profile converts raw `UserBooking[]` records into localized
appointment cards.

```mermaid
flowchart LR
    Raw[bookings signal]
    Language[language signal]
    Group[Group by localDateTime]
    Translate[Map WashType to localized title]
    Format[Format localized date and time]
    Sort[Sort newest first]
    Cards[Appointment card input]

    Raw --> Group
    Language --> Translate
    Language --> Format
    Group --> Translate
    Translate --> Format
    Format --> Sort
    Sort --> Cards
```

### Frontend Service Layer

`AuthService` owns authentication HTTP calls and the shared user signal:

```text
login()    -> POST /auth/login    -> set currentUser
register() -> POST /auth/register -> set currentUser
me()       -> GET  /auth/me       -> set currentUser
logout()   -> POST /auth/logout   -> clear currentUser
```

`BookingService` maps frontend treatment slugs to backend enum values:

```text
total-treatment     -> Total_Treatment
interior-treatment  -> Interior_Treatment
exterior-treatment  -> Exterior_Treatment
ozone-treatment     -> Ozone_Treatment
headlight-treatment -> Headlight_Treatment
```

For multiple treatments, `BookingService` creates one HTTP request per
treatment and combines them with RxJS `forkJoin`.

### Booking Form State Machine

```mermaid
stateDiagram-v2
    [*] --> Editing
    Editing --> Invalid: Submit with missing or invalid data
    Invalid --> Editing: User corrects fields
    Editing --> Submitting: Valid submit
    Submitting --> Success: All API calls complete
    Submitting --> Conflict: Registration returns 409
    Submitting --> Unavailable: Other API failure
    Conflict --> Editing
    Unavailable --> Editing
    Success --> Editing: User changes selection
```

The booking form behaves differently based on authentication:

- Existing customer: book treatments immediately.
- Anonymous customer: validate account fields, register, then book treatments.

### Localization

Translations live in:

```text
frontend/src/app/core/i18/translations/
|-- en/
|-- de/
`-- nl/
```

Page components read translated content from `I18nService`. Date formatting
uses `Intl.DateTimeFormat` with the active locale, so month, weekday, date, and
time labels update reactively.

## Backend Architecture

The backend follows controller, service, repository, and entity layers.

```mermaid
flowchart TD
    Request[HTTP request]
    Cors[CORS configuration]
    JwtFilter[JwtAuthFilter]
    Authorization[Spring authorization rules]
    Controller[REST controller]
    Service[Domain service]
    Repository[JPA repository]
    Entity[JPA entity]
    DB[(PostgreSQL)]

    Request --> Cors
    Cors --> JwtFilter
    JwtFilter --> Authorization
    Authorization --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> Entity
    Entity --> DB
```

### Security Rules

The API is stateless. Spring does not create an HTTP session.

| Request | Access |
| --- | --- |
| `OPTIONS /**` | Public for CORS preflight |
| `/`, `/health`, `/auth/**` | Public |
| `/admin/**` | `ADMIN` role |
| Write operations under `/cars/**` | `ADMIN` role |
| `GET /cars/**` | Public |
| Remaining endpoints | Authenticated user |

CSRF is disabled because authentication is stateless and API-oriented. CORS
allows credentials, so the backend must explicitly permit frontend origins.

### JWT Filter Logic

```mermaid
flowchart TD
    Start[Incoming request]
    Skip{Public auth endpoint?}
    Source{Bearer header exists?}
    Cookie[Read accessToken cookie]
    Header[Read Bearer token]
    Present{Token present?}
    Parse[Parse and validate JWT]
    Refresh{Token type is refresh?}
    Claims[Read uid role user email]
    Context[Create Spring Authentication]
    Chain[Continue filter chain]
    Reject[Return 401 JSON]

    Start --> Skip
    Skip -->|Yes| Chain
    Skip -->|No| Source
    Source -->|Yes| Header
    Source -->|No| Cookie
    Header --> Present
    Cookie --> Present
    Present -->|No| Chain
    Present -->|Yes| Parse
    Parse -->|Invalid or expired| Reject
    Parse --> Refresh
    Refresh -->|Yes| Reject
    Refresh -->|No| Claims
    Claims --> Context
    Context --> Chain
```

The authenticated identity is stored in `Authentication.details` as:

```json
{
  "uid": "user UUID",
  "role": "USER",
  "user": "display name",
  "email": "customer@example.com"
}
```

Controllers use the `uid` value to load or modify records belonging to the
current user.

### Backend Service Responsibilities

`UserService`:

- Rejects duplicate email addresses.
- Hashes passwords with BCrypt.
- Creates users with the `USER` role.
- Looks up users by email or ID.
- Verifies raw passwords against stored hashes.

`WashCalendarService`:

- Loads the authenticated user.
- Creates one `WashCalendar` entity per treatment.
- Finds bookings for the current user or date.
- Verifies ownership before deletion.

`SupaBasePictureStorage`:

- Creates a unique object path per car and file.
- Uploads bytes through the Supabase Storage REST API.
- Returns stored object paths and public URLs.

## Authentication Flow

### Registration

```mermaid
sequenceDiagram
    actor Customer
    participant Angular as Angular form
    participant AuthService
    participant AuthController
    participant UserService
    participant Users as UserRepository
    participant JWT as JwtService

    Customer->>Angular: Submit registration data
    Angular->>AuthService: register(credentials)
    AuthService->>AuthController: POST /auth/register
    AuthController->>UserService: register(request)
    UserService->>Users: existsByEmail(email)

    alt Email already exists
        Users-->>UserService: true
        UserService-->>AuthController: IllegalArgumentException
        AuthController-->>AuthService: 409 ProblemDetail
        AuthService-->>Angular: HttpErrorResponse
    else New email
        Users-->>UserService: false
        UserService->>UserService: BCrypt encode password
        UserService->>Users: save USER entity
        Users-->>UserService: persisted user
        UserService-->>AuthController: user
        AuthController->>JWT: generate access token for 15 minutes
        AuthController->>JWT: generate refresh token for 7 days
        AuthController-->>AuthService: 201 + HttpOnly cookies + user payload
        AuthService->>AuthService: currentUser.set(user)
        AuthService-->>Angular: authenticated user
    end
```

### Login

```mermaid
sequenceDiagram
    actor Customer
    participant LoginForm
    participant AuthService
    participant AuthController
    participant UserService
    participant JWT as JwtService
    participant Browser

    Customer->>LoginForm: Enter email and password
    LoginForm->>LoginForm: Validate required fields and email
    LoginForm->>AuthService: login(credentials)
    AuthService->>AuthController: POST /auth/login
    AuthController->>UserService: findByEmailOrThrow(email)
    AuthController->>UserService: checkPassword(user, password)

    alt Invalid credentials
        AuthController-->>AuthService: 401
        AuthService-->>LoginForm: credentials error
    else Valid credentials
        AuthController->>JWT: Create access and refresh tokens
        AuthController-->>Browser: Set-Cookie accessToken and refreshToken
        AuthController-->>AuthService: AuthUser payload
        AuthService->>AuthService: currentUser.set(user)
        AuthService-->>LoginForm: Success
    end
```

### Cookie Behavior

| Cookie | Lifetime | Purpose |
| --- | --- | --- |
| `accessToken` | 15 minutes | Authenticate API requests |
| `refreshToken` | 7 days | Request a new access token |

Both cookies are HTTP-only and use path `/`.

- Local HTTP requests use `Secure=false` and `SameSite=Lax`.
- HTTPS requests use `Secure=true` and `SameSite=None`.
- The backend checks proxy and origin headers to detect HTTPS deployments.

The browser stores and sends these cookies. Angular cannot read HTTP-only
cookies directly, which reduces exposure to client-side JavaScript attacks.

### Session Restoration

The shared Angular signal is memory-only. A browser refresh clears it.
Protected UI flows restore the user by calling `GET /auth/me`.

```mermaid
flowchart LR
    Refresh[Browser refresh]
    Empty[currentUser is null]
    Me[GET /auth/me with cookie]
    Filter[JwtAuthFilter]
    Details[Authentication details]
    Signal[currentUser.set user]

    Refresh --> Empty
    Empty --> Me
    Me --> Filter
    Filter --> Details
    Details --> Signal
```

## Booking Flow

### Existing Customer

```mermaid
sequenceDiagram
    actor Customer
    participant Form as BookingFormComponent
    participant BookingService
    participant Security as JwtAuthFilter
    participant Controller as WashCalendarController
    participant Service as WashCalendarService
    participant DB as PostgreSQL

    Customer->>Form: Select treatments, date, and time
    Form->>Form: Build localDateTime string
    Form->>BookingService: bookTreatments(slugs, localDateTime)

    loop Once per selected treatment
        BookingService->>Security: POST /wash_calendar + cookies
        Security->>Security: Validate access token
        Security->>Controller: Authenticated request
        Controller->>Service: book request + authenticated user ID
        Service->>DB: Find user
        Service->>DB: Insert wash_calendar row
        DB-->>Service: Saved row
        Service-->>Controller: Entity
        Controller-->>BookingService: WashCalendarResponse
    end

    BookingService-->>Form: forkJoin completes
    Form-->>Customer: Show success state
```

### New Customer Booking

```mermaid
flowchart TD
    Submit[Submit booking form]
    Validate[Validate account, treatments, date, and time]
    Register[POST /auth/register]
    Cookies[Receive auth cookies]
    Book[POST one booking per treatment]
    Success[Show confirmation]
    Conflict[Show email conflict]
    Failure[Show unavailable message]

    Submit --> Validate
    Validate -->|Invalid| Submit
    Validate -->|Valid| Register
    Register -->|201| Cookies
    Register -->|409| Conflict
    Register -->|Other error| Failure
    Cookies --> Book
    Book -->|All requests succeed| Success
    Book -->|Any request fails| Failure
```

### Appointment Storage Model

One selected treatment equals one `wash_calendar` database row.

For example, selecting Interior and Exterior for the same time creates:

```text
Row 1: Interior_Treatment, 2026-06-15T10:00:00, user A
Row 2: Exterior_Treatment, 2026-06-15T10:00:00, user A
```

The backend returns these as separate records. The profile groups records with
the same `localDateTime` into one visual appointment.

## Profile and Cancellation Flow

The profile page is a smart container:

- Restores the authenticated user when necessary.
- Loads raw user booking records.
- Groups and localizes appointments.
- Coordinates cancellation and logout.

The child components are presentational:

- `ProfileDetailsComponent` displays customer details.
- `ProfileBookingsComponent` displays loading, empty, error, and booking states.
- The bookings component emits selected record IDs to the page.

```mermaid
sequenceDiagram
    actor Customer
    participant Card as ProfileBookingsComponent
    participant Page as ProfilePageComponent
    participant BookingService
    participant Controller as WashCalendarController
    participant Service as WashCalendarService
    participant DB as PostgreSQL

    Customer->>Card: Click Cancel appointment
    Card->>Page: emit cancelAppointment(ids)
    Page->>Page: Add IDs to cancellingIds

    loop Every treatment row in appointment
        Page->>BookingService: cancelBookings(ids)
        BookingService->>Controller: DELETE /wash_calendar/{id}
        Controller->>Service: delete(id, authenticatedUserId)
        Service->>DB: Find booking by ID

        alt Booking belongs to user
            Service->>DB: Delete booking
            Controller-->>BookingService: 204 No Content
        else Different owner
            Service-->>Controller: Reject deletion
            Controller-->>BookingService: Error response
        end
    end

    alt All deletes succeed
        BookingService-->>Page: forkJoin completes
        Page->>Page: Remove IDs from local bookings signal
        Page-->>Card: Appointment disappears
    else A delete fails
        BookingService-->>Page: Error
        Page-->>Card: Display appointments error
    end

    Page->>Page: Remove IDs from cancellingIds
```

## Database Model

```mermaid
erDiagram
    USERS ||--o{ WASH_CALENDAR : books
    USERS ||--o{ CARS : owns
    CARS ||--o{ CAR_PICTURES : contains

    USERS {
        uuid id PK
        string email UK
        string name
        string password
        string phone_number
        string role
        instant created_at
        instant updated_at
    }

    WASH_CALENDAR {
        uuid id PK
        string wash_type
        uuid user_id FK
        datetime local_date_time
    }

    CARS {
        uuid id PK
        string title
        string license_plate UK
        decimal price
        string status
        uuid user_id FK
    }

    CAR_PICTURES {
        uuid id PK
        string storage_path
        string title
        string description
        integer width
        integer height
        uuid car_id FK
    }
```

### Entity Relationships

- Deleting a user cascades to owned cars and bookings.
- Deleting a car cascades to its picture metadata.
- `WashCalendar.user` is loaded lazily.
- DTO responses prevent recursive entity serialization.

## Rendering and Environment Flow

### Angular Rendering

```mermaid
flowchart TD
    Build[npm run build]
    Generate[Generate environment.generated.ts]
    AngularBuild[Angular application build]
    Routes{Route type}
    SSR[Server render services/:slug]
    Prerender[Prerender all other routes]
    Browser[Browser bundle]
    Hydrate[Client hydration and event replay]

    Build --> Generate
    Generate --> AngularBuild
    AngularBuild --> Routes
    Routes -->|services/:slug| SSR
    Routes -->|all other routes| Prerender
    AngularBuild --> Browser
    SSR --> Hydrate
    Prerender --> Hydrate
    Browser --> Hydrate
```

The Express SSR server listens on `PORT`, defaulting to `4000`.

### Frontend Environment Generation

Angular does not read `.env` files directly in browser code. A Node script
loads `.env` before start, build, watch, and test commands.

```mermaid
flowchart LR
    DotEnv[frontend/.env]
    Script[generate-environment.mjs]
    Generated[environment.generated.ts]
    Environment[environment.ts]
    Services[AuthService and BookingService]

    DotEnv --> Script
    Script --> Generated
    Generated --> Environment
    Environment --> Services
```

Development environment:

```dotenv
API_BASE_URL=
API_PROXY_TARGET=http://localhost:8080
```

- Empty `API_BASE_URL` makes requests relative, such as `/auth/login`.
- Angular's development proxy forwards `/auth` and `/wash_calendar`.
- `API_PROXY_TARGET` controls the proxy destination.

Production environment:

```dotenv
API_BASE_URL=https://your-api-domain.example
```

The URL is compiled into the frontend during the production build.

## Local Development

### Requirements

- Node.js supported by Angular 21
- npm 11.6.1
- Java 21
- PostgreSQL
- Docker for containerized backend runs and backend tests

### 1. Clone

```bash
git clone https://github.com/yassineao/poetsanders.git
cd poetsanders
```

### 2. Configure the Backend

The current `application.yaml` maps these variables:

```dotenv
SUPABASE_DB_URL=jdbc:postgresql://localhost:5432/autoanders
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your-password
SUPABASE_JWT_SECRET=replace-with-a-long-random-secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=car-pictures
```

Database configuration also supports deployment-style alternatives:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD

DATABASE_URL

PGHOST
PGPORT
PGDATABASE
PGUSER
PGPASSWORD
```

`DATABASE_URL` may include credentials:

```text
postgresql://username:password@host:5432/database
```

### 3. Start the Backend

Linux or macOS:

```bash
cd backend/AutoAnders
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend/AutoAnders
.\mvnw.cmd spring-boot:run
```

The backend runs at [http://localhost:8080](http://localhost:8080).

### 4. Configure the Frontend

```bash
cd frontend
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 5. Start the Frontend

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Docker Backend

Create `backend/AutoAnders/.env`, then run:

```bash
cd backend/AutoAnders
docker compose up --build
```

The compose file builds the API image and publishes port `8080`.

## Application Routes

| Route | Component | Description |
| --- | --- | --- |
| `/` | `HomePageComponent` | Landing page |
| `/services` | `ServicesPageComponent` | Treatment overview |
| `/services/:slug` | `ServiceDetailPageComponent` | Treatment details |
| `/book` | `BookingPageComponent` | Account creation and booking |
| `/login` | `LoginPageComponent` | Existing customer login |
| `/profile` | `ProfilePageComponent` | User details and appointments |

Treatment slugs:

```text
total-treatment
interior-treatment
exterior-treatment
headlight-treatment
ozone-treatment
```

## API Reference

### Authentication

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Create user and issue cookies |
| `POST` | `/auth/login` | Public | Verify credentials and issue cookies |
| `POST` | `/auth/refresh` | Refresh token | Issue a new access cookie |
| `GET` | `/auth/me` | Access token | Return authenticated user details |
| `POST` | `/auth/logout` | Public | Expire both cookies |
| `GET` | `/auth/getUserCars` | Access token | Return cars for current user |
| `GET` | `/auth/health` | Public | Authentication controller health |

Example registration request:

```json
{
  "name": "Jane Customer",
  "email": "jane@example.com",
  "password": "StrongPass12!",
  "phoneNumber": "+31 6 12345678"
}
```

Example authenticated user response:

```json
{
  "uid": "3e8cfad6-228c-46bc-ae43-afd905914df2",
  "role": "USER",
  "user": "Jane Customer",
  "email": "jane@example.com"
}
```

### Booking

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/wash_calendar` | Required | Create one treatment booking |
| `GET` | `/wash_calendar` | Required | List all bookings |
| `GET` | `/wash_calendar/by_user` | Required | Current user's bookings |
| `GET` | `/wash_calendar/date/{dateTime}` | Required | Bookings at a date and time |
| `DELETE` | `/wash_calendar/{id}` | Required | Delete an owned booking |

Example booking request:

```json
{
  "washType": "Interior_Treatment",
  "localDateTime": "2026-06-15T10:00:00"
}
```

Example booking response:

```json
{
  "id": "fc912912-310d-4d1d-822f-a5ada79d3528",
  "washType": "Interior_Treatment",
  "userId": "3e8cfad6-228c-46bc-ae43-afd905914df2",
  "localDateTime": "2026-06-15T10:00:00"
}
```

### Cars and Pictures

The backend contains additional APIs for car records and picture uploads:

```text
GET    /cars
GET    /cars/{id}
POST   /cars
DELETE /cars/{id}
POST   /cars/{id}
POST   /cars/statusUpdate/{id}

GET    /cars/{carId}/pictures
POST   /cars/{carId}/pictures
```

Car reads are public. Car writes require the `ADMIN` role.

## Testing and Builds

### Frontend Commands

Run from `frontend`:

| Command | Description |
| --- | --- |
| `npm ci` | Reproduce the lockfile exactly |
| `npm start` | Generate environment and start development server |
| `npm run build` | Generate environment and build browser plus SSR output |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run Angular unit tests |
| `npm run serve:ssr:frontend` | Serve an existing SSR build |

Build output:

```text
frontend/dist/frontend/
|-- browser/
`-- server/
```

The production build currently warns when the initial bundle exceeds the
configured `500 kB` warning budget. The error threshold is `1 MB`.

### Backend Commands

Run from `backend/AutoAnders`:

| Command | Description |
| --- | --- |
| `./mvnw spring-boot:run` | Start the API |
| `./mvnw test` | Compile and run tests |
| `./mvnw package` | Build the JAR |
| `docker compose up --build` | Build and run the API container |

Windows uses `.\mvnw.cmd` instead of `./mvnw`.

Backend tests use Testcontainers with PostgreSQL. Docker must be running or
the Spring context tests will fail before reaching application assertions.

## Deployment

### Deployment Architecture

```mermaid
flowchart LR
    Browser[Customer browser]
    Vercel[Vercel Angular frontend]
    API[Deployed Spring Boot API]
    Postgres[(Hosted PostgreSQL)]
    Storage[(Supabase Storage)]

    Browser -->|HTTPS| Vercel
    Browser -->|HTTPS API calls and cookies| API
    API --> Postgres
    API --> Storage
```

### Vercel Frontend

Configure the Vercel project root as `frontend`.

The repository `vercel.json` defines:

```text
Install command: npm ci
Build command: npm run build
Output directory: dist/frontend/browser
```

Configure:

```dotenv
API_BASE_URL=https://your-api-domain.example
```

`package.json` and `package-lock.json` must always be committed together.
Vercel uses `npm ci`, which fails when they are out of sync.

### Backend Deployment

The backend deployment must provide:

- A Java 21 runtime or Docker runtime
- PostgreSQL connection variables
- JWT secret
- Supabase storage variables
- HTTPS
- A public API domain

The frontend domain must be present in the backend CORS configuration.
Credentialed CORS requires an explicit allowed origin; wildcard-only origins
cannot be used with cookies.

### Production Cookie Requirements

For cross-origin frontend and backend domains:

1. Both services must use HTTPS.
2. The backend detects HTTPS and issues `Secure; SameSite=None` cookies.
3. The frontend must use `withCredentials: true`.
4. CORS must use `allowCredentials=true`.
5. The exact frontend origin must be allowed.

## Security Notes

- Passwords are BCrypt hashes, not plaintext.
- JWTs contain user identity and role claims.
- Access and refresh tokens are HTTP-only cookies.
- Refresh tokens cannot authenticate protected endpoints.
- Booking cancellation checks authenticated ownership.
- Administrative car mutations require `ROLE_ADMIN`.
- Never commit `.env` files, database passwords, JWT secrets, or service keys.
- The Supabase service-role key must only exist on the backend.

## Current Limitations

These are current implementation details, not completed features:

- Angular does not automatically refresh expired access tokens. The backend
  provides `/auth/refresh`, but no frontend interceptor currently calls it.
- The login form sets authenticated state but does not automatically redirect
  to the profile.
- Appointment availability conflicts are not enforced atomically in the
  current booking service.
- Multi-treatment booking uses separate HTTP requests. If one request fails
  after another succeeds, the operation is not rolled back as one transaction.
- Multi-row cancellation also uses separate requests and is not atomic.
- Several profile and authentication labels are still hardcoded in English.
- The profile route redirects after an API `401`; there is no route guard.
- Flyway dependencies exist, while Hibernate is currently configured with
  `ddl-auto: update`.
- The Maven file contains duplicate JJWT dependency declarations and should be
  cleaned up.
- The configured Spring Boot parent is a snapshot version and may be less
  reproducible than a stable release.

## Repository

[github.com/yassineao/poetsanders](https://github.com/yassineao/poetsanders)
