# Poets Anders

Full-stack website and appointment platform for **Poets Anders**, a vehicle
cleaning and detailing business in Papendrecht, the Netherlands.

The public website presents detailing treatments in English, German, and Dutch.
Customers can create an account, log in, request one or more treatments for a
selected date and time, review appointment status, cancel appointment rows, and
update their profile. The backend also contains a separate dealership domain
for cars and Supabase-hosted car pictures.

> This README documents the code as it currently exists. The
> [Known Issues and Security Gaps](#known-issues-and-security-gaps) section
> distinguishes implemented behavior from behavior that still needs hardening.

## Table of Contents

- [Feature Overview](#feature-overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication and Authorization](#authentication-and-authorization)
- [Booking and Appointment Logic](#booking-and-appointment-logic)
- [Car and Picture Logic](#car-and-picture-logic)
- [Database Model](#database-model)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Testing and Verification](#testing-and-verification)
- [Build and Rendering](#build-and-rendering)
- [Deployment](#deployment)
- [Known Issues and Security Gaps](#known-issues-and-security-gaps)
- [Development Guidelines](#development-guidelines)

## Feature Overview

### Customer Website

- Responsive home page with business details, treatments, testimonials, FAQ,
  location, contact information, and an authenticated appointment preview
- Treatment overview and dynamic treatment detail pages
- English (`en`), German (`de`), and Dutch (`nl`) translations
- Runtime language switching through Angular signals
- Booking calendar with future-date selection and fixed time slots
- Multi-treatment appointment requests
- Account creation during the booking flow
- Login with HTTP-only JWT cookies
- Profile editing for name, phone number, and password
- Appointment history and upcoming appointment display
- Pending, partially accepted, and accepted appointment states
- Appointment cancellation
- Admin dashboard with summary statistics, searchable paginated users,
  chronologically sorted appointments, status filtering, and appointment acceptance
- Link to a separate dealership website through `DEALERSHIP_URL`

### Backend Domains

- User registration, login, refresh, logout, profile loading, and profile update
- Wash appointment creation, listing, filtering, acceptance, and deletion
- Car inventory creation, reading, updating, status updates, and deletion
- Car picture metadata and Supabase Storage uploads
- PostgreSQL persistence with Spring Data JPA
- Flyway-managed schema migrations with Hibernate startup validation
- Stateless Spring Security with role-based endpoint rules

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend framework | Angular 21 standalone components |
| Frontend language | TypeScript 5.9 |
| State management | Angular signals and computed signals |
| Forms | Angular Reactive Forms |
| HTTP and async logic | Angular `HttpClient`, RxJS |
| Routing | Angular Router |
| Styling | Tailwind CSS 4 |
| Rendering | Angular SSR, prerendering, hydration, event replay |
| Frontend tests | Angular unit-test builder and Vitest |
| Backend framework | Spring Boot 3.5.14 |
| Backend language | Java 21 |
| Security | Spring Security, BCrypt, JJWT |
| Persistence | Spring Data JPA, Hibernate, PostgreSQL |
| Database migrations | Flyway |
| File storage | Supabase Storage REST API |
| Backend tests | JUnit 5, Mockito, Spring Boot Test, Testcontainers |
| Packaging | npm, Maven Wrapper, Docker |
| Frontend hosting config | Vercel |

## System Architecture

```mermaid
flowchart LR
    Customer[Customer browser]
    Admin[Administrative API client]

    subgraph Frontend["Angular frontend"]
        Router[Angular Router]
        Pages[Standalone pages]
        Components[Feature and shared components]
        Signals[Signals and computed state]
        Forms[Reactive Forms]
        AuthClient[AuthService]
        BookingClient[BookingService]
        I18n[I18nService]
    end

    subgraph Backend["Spring Boot API"]
        CORS[CORS]
        JWT[JwtAuthFilter]
        Rules[Spring authorization rules]
        Controllers[REST controllers]
        Services[Domain services]
        Repositories[Spring Data repositories]
        StorageClient[Supabase Storage client]
    end

    PostgreSQL[(PostgreSQL)]
    Supabase[(Supabase Storage)]
    Dealership[External dealership site]

    Customer --> Router
    Router --> Pages
    Pages --> Components
    Components --> Signals
    Components --> Forms
    Components --> I18n
    Components --> AuthClient
    Components --> BookingClient
    Customer -->|Dealership link| Dealership

    AuthClient -->|HTTPS + credentials| CORS
    BookingClient -->|HTTPS + credentials| CORS
    Admin -->|HTTPS + JWT cookie or Bearer token| CORS
    CORS --> JWT
    JWT --> Rules
    Rules --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> PostgreSQL
    Services --> StorageClient
    StorageClient --> Supabase
```

### Request Boundaries

1. Angular components do not access the database directly.
2. Components call frontend services.
3. Frontend services send JSON requests with `withCredentials: true`.
4. Spring Security extracts an access token from a Bearer header or cookie.
5. Controllers translate HTTP requests into domain service calls.
6. Services implement domain operations and call repositories.
7. JPA repositories persist entities in PostgreSQL.
8. Car picture bytes are uploaded separately to Supabase Storage.

## Repository Structure

```text
poetsanders/
|-- frontend/
|   |-- public/                         Static images and public assets
|   |-- scripts/
|   |   `-- generate-environment.mjs    Generates Angular environment code
|   |-- src/
|   |   |-- environments/
|   |   |   |-- environment.ts
|   |   |   `-- environment.generated.ts  Generated and gitignored
|   |   |-- app/
|   |   |   |-- core/
|   |   |   |   |-- admin/             Admin dashboard HTTP client
|   |   |   |   |-- auth/              Authentication HTTP client
|   |   |   |   |-- booking/           Appointment HTTP client
|   |   |   |   |-- i18/               Locale state and translations
|   |   |   |   `-- interfaces/        TypeScript contracts
|   |   |   |-- features/
|   |   |   |   |-- admin/             Admin dashboard page and components
|   |   |   |   |-- appointments/      Appointment cards and history
|   |   |   |   |-- faq/               FAQ page
|   |   |   |   |-- form/              Booking form and calendar
|   |   |   |   |-- home/              Landing page sections
|   |   |   |   |-- login/             Login page
|   |   |   |   |-- profile/           Profile view and editor
|   |   |   |   `-- services/          Treatment pages
|   |   |   `-- shared/
|   |   |       `-- components/         Navbar and footer
|   |   `-- server.ts                   Angular SSR Express server
|   |-- .env.example
|   |-- angular.json
|   |-- package.json
|   `-- proxy.conf.cjs
|-- backend/
|   `-- AutoAnders/
|       |-- src/main/java/Gloyoo/AutoAnders/
|       |   |-- config/                 Security, JWT, datasource
|       |   |-- user/                   Accounts and authentication
|       |   |-- washCalendar/           Detailing appointments
|       |   |-- Cars/                   Dealership inventory
|       |   |-- CarPictures/            Picture metadata
|       |   `-- storage/                Supabase Storage integration
|       |-- src/main/resources/
|       |   |-- db/migration/           Flyway SQL migrations
|       |   `-- application.yaml
|       |-- src/test/                    Unit and integration tests
|       |-- compose.yaml
|       |-- Dockerfile
|       |-- mvnw / mvnw.cmd
|       `-- pom.xml
|-- .gitignore
|-- README.md
`-- vercel.json
```

## Frontend Architecture

The frontend uses standalone Angular components. There is no root NgModule.
Global providers are registered in `app.config.ts`.

```mermaid
flowchart TD
    AppConfig[app.config.ts]
    RouterProvider[provideRouter]
    HttpProvider[provideHttpClient with fetch]
    Hydration[provideClientHydration with event replay]

    AppConfig --> RouterProvider
    AppConfig --> HttpProvider
    AppConfig --> Hydration

    RouterProvider --> Routes[app.routes.ts]
    Routes --> Home[HomePageComponent]
    Routes --> Admin[AdminDashboardPageComponent]
    Routes --> Services[ServicesPageComponent]
    Routes --> Detail[ServiceDetailPageComponent]
    Routes --> Book[BookingPageComponent]
    Routes --> Login[LoginPageComponent]
    Routes --> Profile[ProfilePageComponent]
    Routes --> Appointments[AppointmentsPageComponent]
    Routes --> FAQ[FaqPageComponent]

    Home --> Preview[AppointmentsListComponent pageMode=false]
    Book --> BookingForm[BookingFormComponent]
    Login --> LoginForm[LoginFormComponent]
    Profile --> ProfileEditor[ProfileEditorComponent]
    Appointments --> History[AppointmentsListComponent pageMode=true]
    Admin --> Stats[AdminDashboardStatsComponent]
    Admin --> Users[AdminUsersComponent]
    Admin --> AdminAppointments[AdminAppointmentsComponent]
```

### Frontend Routes

| Route | Component | Rendering | Purpose |
| --- | --- | --- | --- |
| `/` | `HomePageComponent` | Prerender | Landing page and upcoming bookings |
| `/admin` | `AdminDashboardPageComponent` | Prerender | Admin-only users and appointments dashboard |
| `/appointments` | `AppointmentsPageComponent` | Prerender | Full appointment history |
| `/book` | `BookingPageComponent` | Prerender | Registration and booking |
| `/faq` | `FaqPageComponent` | Prerender | Frequently asked questions |
| `/login` | `LoginPageComponent` | Prerender | Existing customer login |
| `/profile` | `ProfilePageComponent` | Prerender | Profile editing and logout |
| `/services` | `ServicesPageComponent` | Prerender | Treatment overview |
| `/services/:slug` | `ServiceDetailPageComponent` | Server render | Dynamic treatment details |
| Any unknown route | Redirect to `/` | N/A | Fallback |

Routes are not protected with Angular route guards. Components restore the
session in the browser and redirect to `/login` after a `401` where required.
The admin page also verifies `currentUser.role === 'ADMIN'`; backend
authorization remains the authoritative security boundary.

After login, users with the `ADMIN` role are sent directly to `/admin`.
Other users are sent to `/`.

### Core Frontend Services

#### `AuthService`

`AuthService` owns the shared in-memory `currentUser` signal.

| Method | HTTP request | State effect |
| --- | --- | --- |
| `register()` | `POST /auth/register` | Stores returned user |
| `login()` | `POST /auth/login` | Stores returned user |
| `me()` | `GET /auth/me` | Restores returned user |
| `updateProfile()` | `PATCH /auth/update` | Replaces stored user |
| `logout()` | `POST /auth/logout` | Clears stored user |

The signal is memory-only. It is restored after a browser refresh by calls to
`GET /auth/me` from the navbar, profile, and appointment components.

#### `BookingService`

`BookingService` maps public treatment slugs to backend enum names:

| Frontend slug | Backend `WashType` |
| --- | --- |
| `total-treatment` | `Total_Treatment` |
| `interior-treatment` | `Interior_Treatment` |
| `exterior-treatment` | `Exterior_Treatment` |
| `ozone-treatment` | `Ozone_Treatment` |
| `headlight-treatment` | `Headlight_Treatment` |

It sends all selected treatments to the transactional
`POST /wash_calendar/batch` endpoint. Grouped cancellation sends every row ID
to the transactional `DELETE /wash_calendar/batch` endpoint. It also
normalizes backend date values because `LocalDateTime` may arrive as an ISO
string or a numeric date array.

#### `I18nService`

`I18nService` stores the active locale in a signal:

```text
en -> English
de -> German
nl -> Dutch
```

Translation files are type-checked through shared interfaces. Components read
copy through a computed signal, and date labels use `Intl.DateTimeFormat` with
the active locale.

The selected language is not currently persisted to local storage or a cookie.
A full page reload resets it to English.

#### `AdminService`

`AdminService` loads the role-protected dashboard and accepts appointment rows:

| Method | HTTP request | Purpose |
| --- | --- | --- |
| `dashboard()` | `GET /admin/dashboard` | Load totals, users, and appointments |
| `acceptAppointment(id)` | `POST /wash_calendar/accept/{id}` | Mark one appointment row accepted |

### Admin Dashboard Components

The admin feature keeps API orchestration in the routed page and presentation
state in focused standalone components:

| Component | Responsibility |
| --- | --- |
| `AdminDashboardPageComponent` | Authentication, dashboard loading, acceptance requests, shared state updates |
| `AdminDashboardStatsComponent` | User and appointment summary cards |
| `AdminUsersComponent` | User search, localized dates, and independent pagination |
| `AdminAppointmentsComponent` | Search, status filter, earliest-first sorting, pagination, and accept actions |

Both tables show 10 rows per page. User and appointment pagination are
independent. Appointment filtering and search happen before pagination.

### Frontend State Model

| State | Owner | Purpose |
| --- | --- | --- |
| `currentUser` | `AuthService` | Current authenticated identity |
| `language` | `I18nService` | Current locale |
| `selectedDate` | Booking form | Appointment calendar date |
| `selectedTime` | Booking form | Appointment time |
| `services` form control | Booking form | Selected treatment slugs |
| `submitting` | Form components | Prevent duplicate submissions |
| `bookings` | Appointment list | Raw booking rows from API |
| `appointments` | Computed appointment state | Grouped visual appointments |
| `cancellingIds` | Appointment list | Rows currently being deleted |

### Booking Form Validation

Anonymous customers must provide:

| Field | Client and backend rules |
| --- | --- |
| Name | Required, maximum 255 characters |
| Email | Required, valid email |
| Password | Required, 12-30 characters |
| Password composition | Uppercase, lowercase, digit, and `@$!%*?&` |
| Password confirmation | Must match password |
| Phone | Required, 8-30 characters |
| Treatments | At least one treatment |
| Date | Today or a future date |
| Time | One configured time slot |

Authenticated customers only need treatments, date, and time. The identity
fields remain in the form model but are hidden and ignored by submission
validation.

### Booking Form State Machine

```mermaid
stateDiagram-v2
    [*] --> Editing
    Editing --> Invalid: Submit invalid form
    Invalid --> Editing: Correct fields
    Editing --> Registering: Anonymous valid submit
    Editing --> Booking: Authenticated valid submit
    Registering --> Booking: Registration succeeds
    Registering --> Conflict: Email already exists
    Registering --> Unavailable: Other registration error
    Booking --> Confirmed: Every treatment request succeeds
    Booking --> Unavailable: Any treatment request fails
    Conflict --> Editing
    Unavailable --> Editing
    Confirmed --> Editing: Book another appointment
```

### Appointment Grouping

The database stores one row per treatment. The frontend groups rows with an
identical `localDateTime` into one appointment card.

```mermaid
flowchart LR
    Rows[WashCalendar rows]
    Validate[Discard invalid dates]
    Filter[Hide past rows on home page]
    Group[Group by localDateTime]
    Treatments[Translate WashType values]
    Status[Calculate accepted / partial / pending]
    Format[Format localized date and time]
    Sort[Sort by page mode]
    Cards[Appointment cards]

    Rows --> Validate --> Filter --> Group
    Group --> Treatments
    Group --> Status
    Treatments --> Format
    Status --> Format
    Format --> Sort --> Cards
```

- Home page mode shows future appointments, oldest first.
- Appointment page mode shows past and future appointments, newest first.
- All rows accepted means `accepted`.
- Some rows accepted means `partial`.
- No rows accepted means `pending`.

## Backend Architecture

The backend uses controller, service, repository, and entity layers.

```mermaid
flowchart TD
    Request[HTTP request]
    Cors[CORS processing]
    Filter[JwtAuthFilter]
    Authorization[SecurityFilterChain]
    Controller[REST controller]
    Service[Domain service]
    Repository[JPA repository]
    Entity[JPA entity]
    DB[(PostgreSQL)]

    Request --> Cors --> Filter --> Authorization
    Authorization --> Controller --> Service --> Repository --> Entity --> DB
```

### Backend Packages

| Package | Responsibility |
| --- | --- |
| `config` | JWT parsing, Spring Security, CORS, datasource resolution |
| `user` | Accounts, authentication, profile updates, and the role-based admin dashboard |
| `washCalendar` | Detailing appointment rows and acceptance state |
| `Cars` | Dealership vehicle inventory |
| `CarPictures` | Picture metadata linked to cars |
| `storage` | Uploading picture bytes to Supabase Storage |

### Service Responsibilities

#### `UserService`

- Reject duplicate email addresses during registration
- Hash passwords with BCrypt
- Assign the `USER` role to new accounts
- Load users by email or UUID
- Verify login passwords
- Load cars owned by a user
- Update nonblank name, phone number, and password values

Administrators are not a separate entity or table. An administrator is an
ordinary `User` record whose existing `role` field is `ADMIN`.

#### `WashCalendarService`

- Load the authenticated user before booking
- Create one appointment row per request
- List rows by user, date, acceptance state, or globally
- Delete a row by UUID
- Set the `accepted` flag to `true`

#### `CarService`

- Reject duplicate license plates
- Associate new cars with the authenticated administrator
- Read all cars or one car
- Replace all editable car fields during update
- Update a car status
- Delete a car

#### `CarPictureService`

- Verify that the target car exists
- Upload picture bytes to Supabase Storage
- Persist picture metadata and the returned storage path
- List picture metadata for a car

## Authentication and Authorization

### Token Model

The backend issues two signed HS256 JWTs:

| Token | Lifetime | Cookie | Purpose |
| --- | --- | --- | --- |
| Access token | 15 minutes | `accessToken` | Authenticate API requests |
| Refresh token | 7 days | `refreshToken` | Issue a new access token |

JWT claims include:

```json
{
  "sub": "customer@example.com",
  "uid": "user-uuid",
  "role": "USER",
  "user": "Customer Name",
  "type": "refresh only on refresh tokens"
}
```

The JWT secret must contain at least 32 bytes.

### Cookie Behavior

Both cookies are:

- HTTP-only
- Available under path `/`
- `SameSite=Lax` and not secure for detected local HTTP requests
- `SameSite=None; Secure` for detected HTTPS requests

HTTPS detection checks:

- Servlet request security
- `X-Forwarded-Proto`
- `Forwarded`
- `X-Forwarded-Ssl`
- `Origin`
- `Referer`

The browser stores the cookies. Angular sends them by setting
`withCredentials: true`.

### Authentication Filter

```mermaid
flowchart TD
    Start[Incoming request]
    Skip{Login, register, refresh, or logout?}
    Bearer{Bearer token present?}
    Cookie[Read accessToken cookie]
    Parse[Parse and verify JWT]
    Refresh{Token type is refresh?}
    Claims[Read uid, role, user, subject]
    Context[Create Spring Authentication]
    Rules[Apply endpoint authorization]
    Continue[Continue request]
    Reject[Return 401 JSON]

    Start --> Skip
    Skip -->|Yes| Rules
    Skip -->|No| Bearer
    Bearer -->|Yes| Parse
    Bearer -->|No| Cookie
    Cookie --> Parse
    Parse -->|Missing token| Rules
    Parse -->|Invalid or expired| Reject
    Parse --> Refresh
    Refresh -->|Yes| Reject
    Refresh -->|No| Claims --> Context --> Rules --> Continue
```

The authenticated principal is the user's display name. Additional identity
data is stored in `Authentication.details`:

```json
{
  "uid": "user-uuid",
  "role": "USER",
  "user": "Customer Name",
  "email": "customer@example.com"
}
```

### Registration Sequence

```mermaid
sequenceDiagram
    actor Customer
    participant Form as Angular booking form
    participant Auth as AuthService
    participant Controller as AuthController
    participant Users as UserService
    participant DB as UserRepository
    participant JWT as JwtService

    Customer->>Form: Submit account and booking data
    Form->>Auth: register(credentials)
    Auth->>Controller: POST /auth/register
    Controller->>Users: register(request)
    Users->>DB: existsByEmail(email)

    alt Email exists
        DB-->>Users: true
        Users-->>Controller: IllegalArgumentException
        Controller-->>Auth: 409 ProblemDetail
        Auth-->>Form: Conflict error
    else New email
        DB-->>Users: false
        Users->>Users: BCrypt encode password
        Users->>DB: Save USER account
        DB-->>Users: Persisted user
        Users-->>Controller: User
        Controller->>JWT: Generate access token
        Controller->>JWT: Generate refresh token
        Controller-->>Auth: 201 + cookies + AuthUser
        Auth->>Auth: currentUser.set(user)
    end
```

### Login Sequence

```mermaid
sequenceDiagram
    actor Customer
    participant Login as LoginFormComponent
    participant Auth as AuthService
    participant Controller as AuthController
    participant Users as UserService
    participant JWT as JwtService

    Customer->>Login: Enter email and password
    Login->>Login: Validate form
    Login->>Auth: login(credentials)
    Auth->>Controller: POST /auth/login
    Controller->>Users: findByEmailOrThrow(email)
    Controller->>Users: checkPassword(user, password)

    alt Invalid credentials
        Controller-->>Auth: 401
        Auth-->>Login: Show credentials error
    else Valid credentials
        Controller->>JWT: Generate access and refresh tokens
        Controller-->>Auth: Cookies + AuthUser
        Auth->>Auth: currentUser.set(user)
        Auth-->>Login: Success
        Login->>Login: Navigate to /
    end
```

### Access Rules

The Spring session policy is `STATELESS`, CSRF is disabled, and CORS allows
credentialed requests.

| Request pattern | Security rule |
| --- | --- |
| `OPTIONS /**` | Public |
| `/`, `/health`, `/auth/**` | Public at the authorization-rule level |
| `/admin/**` | Requires `ADMIN` |
| `GET /wash_calendar` | Requires `ADMIN` |
| `GET /wash_calendar/date/**` | Requires `ADMIN` |
| `POST /wash_calendar/accept/**` | Requires `ADMIN` |
| `POST`, `PUT`, `PATCH`, `DELETE /cars/**` | Requires `ADMIN` |
| `GET /cars/**` | Public |
| Everything else | Requires authentication |

Some `/auth/**` controller methods still perform their own authentication
checks. The JWT filter only skips login, register, refresh, and logout.

### CORS Origins

The current backend allows credentialed requests from:

```text
http://localhost:3000
http://localhost:4200
http://localhost:5173
https://poetsanders.nl
https://www.poetsanders.nl
https://guitar-io.vercel.app
https://*.vercel.app
```

Allowed methods are `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, and `OPTIONS`.

## Booking and Appointment Logic

### Existing Customer Booking

```mermaid
sequenceDiagram
    actor Customer
    participant Form as BookingFormComponent
    participant Client as BookingService
    participant Security as JwtAuthFilter
    participant Controller as WashCalendarController
    participant Service as WashCalendarService
    participant DB as PostgreSQL

    Customer->>Form: Select treatments, date, and time
    Form->>Form: Build YYYY-MM-DDTHH:mm:00
    Form->>Client: bookTreatments(slugs, localDateTime)

    Client->>Security: POST /wash_calendar/batch + access cookie
    Security->>Controller: Authenticated request
    Controller->>Service: wash types + date/time + user UUID
    Service->>DB: Load user
    Service->>DB: Insert all rows in one transaction
    DB-->>Service: Saved rows
    Service-->>Controller: WashCalendar list
    Controller-->>Client: WashCalendarResponse list
    Client-->>Form: Batch request completes
    Form-->>Customer: Show confirmation
```

### New Account Booking

```mermaid
flowchart TD
    Submit[Submit form]
    Validate[Validate account and appointment]
    Register[POST /auth/register]
    Cookies[Receive auth cookies]
    Book[POST one transactional batch]
    Success[Show confirmation]
    Conflict[Show account already exists]
    Error[Show service unavailable]

    Submit --> Validate
    Validate -->|Invalid| Submit
    Validate -->|Valid| Register
    Register -->|201| Cookies --> Book
    Register -->|409| Conflict
    Register -->|Other error| Error
    Book -->|All requests succeed| Success
    Book -->|Any request fails| Error
```

### Guest Booking

Guests can choose the guest option instead of creating an account. The frontend
sends name, email, phone number, treatments, and date/time to
`POST /wash_calendar/guest`.

The backend prefixes the normalized email with `GUEST_EMAIL_PREFIX`, generates
and hashes an inaccessible random password, creates the guest user, and saves
all selected treatment rows in one transaction. The unique prefixed email
limits an email address to one guest appointment. Guest bookings do not create
an authenticated session and cannot be managed online.

Authenticated registered customers receive an email after a successful
appointment request when SMTP delivery is enabled. Guest users do not receive
this registered-account confirmation email. A mail delivery failure is logged
without rolling back the saved appointment.

Every appointment receives a cryptographically random cancellation token. All
treatment rows in one grouped appointment share that token. Only its SHA-256
hash is stored in PostgreSQL, while the raw token is included in the registered
customer's booking email and the booking creation response. Later appointment
reads do not expose it because the raw token is not persisted. Calling
`DELETE /wash_calendar/cancel/{cancellationToken}` removes the entire grouped
appointment and makes the token unusable.

Successful cancellation sends an email to the customer's real address. For
guest users, the backend removes the configured `guest::` prefix before sending
mail. When the cancelled rows are the guest's final appointment rows, the
temporary guest user is also deleted. Registered accounts are never
automatically deleted.

New customers also receive a welcome email immediately after successful
registration. Guest users are created through the guest-booking endpoint and
therefore do not receive the registration welcome email.

When a customer later registers with an email previously used for a guest
booking, registration upgrades the existing `guest::email` user row instead of
creating a second user. The user UUID stays unchanged, so all guest
appointments automatically become visible under the new registered account.

### Storage Granularity

One treatment equals one `wash_calendar` row. Selecting Interior and Exterior
at the same time creates two records:

```text
Interior_Treatment | 2026-06-15T10:00:00 | user A | accepted=false
Exterior_Treatment | 2026-06-15T10:00:00 | user A | accepted=false
```

The frontend groups those rows into one visual appointment.

### Acceptance Logic

Each row has its own `accepted` flag:

```mermaid
stateDiagram-v2
    [*] --> Pending: Booking created
    Pending --> Accepted: POST /wash_calendar/accept/{uuid}
    Accepted --> Accepted: Repeated acceptance
```

There is no endpoint to set acceptance back to `false`.

For grouped appointments:

- `pending`: every treatment row is false
- `partial`: a mixture of true and false
- `accepted`: every treatment row is true

### Cancellation Logic

The UI cancels a grouped appointment with one transactional batch request:

```mermaid
sequenceDiagram
    actor Customer
    participant Card as AppointmentCardComponent
    participant List as AppointmentsListComponent
    participant Client as BookingService
    participant API as WashCalendarController
    participant DB as PostgreSQL

    Customer->>Card: Click cancel
    Card->>List: Emit appointment IDs
    List->>List: Mark all IDs as cancelling

    List->>Client: cancelBookings(ids)
    Client->>API: DELETE /wash_calendar/batch
    API->>API: Validate every ID and owner
    API->>DB: Delete all rows in one transaction
    DB-->>API: Deleted
    API-->>List: 204 No Content
    List->>List: Remove IDs from local state
```

If any ID is missing or belongs to another user, validation fails before any
row is deleted.

## Car and Picture Logic

The car domain is currently exposed through the backend but is not consumed by
the Poets Anders Angular feature code. The navbar can link to a separate
dealership site through `DEALERSHIP_URL`.

### Car Lifecycle

```mermaid
flowchart TD
    Admin[Authenticated ADMIN]
    Create[POST /cars]
    Unique{License plate unique?}
    Owner[Load administrator user]
    Save[Save car]
    Update[POST /cars/{id}]
    Status[POST /cars/statusUpdate/{id}]
    Delete[DELETE /cars/{id}]
    Public[Public GET /cars and /cars/{id}]

    Admin --> Create --> Unique
    Unique -->|No| Error[400 response]
    Unique -->|Yes| Owner --> Save
    Admin --> Update
    Admin --> Status
    Admin --> Delete
    Public --> Save
```

Supported enum values include:

| Field | Values |
| --- | --- |
| Body type | `MPV`, `SUV`, `SEDAN`, `HATCHBACK`, `STATION_WAGON`, `COUPE`, `CABRIOLET`, `VAN` |
| Gearbox | `MANUAL`, `AUTOMATIC`, `SEMI_AUTOMATIC` |
| Fuel | `PETROL`, `DIESEL`, `ELECTRIC`, `HYBRID`, `LPG`, `CNG` |
| Emission class | `EURO_1` through `EURO_6` |
| Energy label | `A` through `G` |
| Paint | `BASIC`, `METALLIC`, `PEARL`, `MATTE` |
| Upholstery | `FABRIC`, `LEATHER`, `PART_LEATHER`, `ALCANTARA` |
| Status | `Available`, `Pending_Confirmation`, `Booked`, `Cancelled` |

### Picture Upload

```mermaid
sequenceDiagram
    actor Admin
    participant API as CarPictureController
    participant Service as CarPictureService
    participant Cars as CarRepository
    participant Storage as Supabase Storage
    participant Pictures as CarPictureRepository

    Admin->>API: Multipart POST /cars/{carId}/pictures
    API->>Service: File and metadata
    Service->>Cars: Find car
    Service->>Storage: Upload bytes
    Storage-->>Service: cars/{carId}/{uuid}.{ext}
    Service->>Pictures: Save metadata and storage path
    Pictures-->>API: CarPicture
    API-->>Admin: 200 response
```

The upload request contains:

```text
file          required binary file
title         optional request field
description   optional request field
width         required integer
height        required integer
```

Supabase receives:

- `Authorization: Bearer <service-role-key>`
- `apikey: <service-role-key>`
- Original content type
- `x-upsert: false`

## Database Model

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ WASH_CALENDAR : books
    USERS ||--o{ CARS : owns
    CARS ||--o{ CAR_PICTURES : has

    USERS {
        uuid id PK
        varchar email UK
        varchar name
        varchar password
        varchar phone_number
        varchar role
        timestamp created_at
        timestamp updated_at
    }

    WASH_CALENDAR {
        uuid id PK
        varchar wash_type
        uuid user_id FK
        timestamp local_date_time
        boolean accepted
    }

    CARS {
        uuid id PK
        varchar title
        varchar subtitle
        integer year_of_manufacture
        integer mileage
        varchar license_plate UK
        numeric price
        varchar status
        uuid user_id FK
    }

    CAR_PICTURES {
        uuid id PK
        varchar storage_path UK
        varchar title
        varchar description
        integer width
        integer height
        uuid car_id FK
    }
```

### JPA Relationships

- `User -> Car`: one-to-many, cascade all, orphan removal
- `User -> WashCalendar`: one-to-many, cascade all, orphan removal
- `Car -> User`: many-to-one, lazy, required
- `WashCalendar -> User`: many-to-one, lazy, required
- `Car -> CarPicture`: one-to-many, cascade all, orphan removal
- `CarPicture -> Car`: many-to-one, lazy, required

### Migration History

| Migration | Purpose |
| --- | --- |
| `V1__extensions.sql` | Enable `pgcrypto` and `uuid-ossp` |
| `V2__create_users_table.sql` | Create users |
| `V3__create_cars_table.sql` | Create cars and indexes |
| `V4__add_unique_license_plate_to_cars.sql` | Add unique plate constraint |
| `V5__add_user_id_to_cars.sql` | Delete existing cars and add required owner |
| `V6__create_car_pictures_table.sql` | Create picture metadata |
| `V7__create_wash_calendar_table.sql` | Create appointment rows |
| `V8__align_schema_with_entities.sql` | Add user phone numbers, appointment acceptance, and car status |
| `V9__add_appointment_cancellation_tokens.sql` | Add hashed cancellation tokens for grouped appointments |

Applied Flyway migrations are immutable. Never edit an existing migration after
it has run in any shared environment; add a new version instead. SQL migration
files are forced to LF line endings through `.gitattributes`.

The `Car.co2Emissions` property is explicitly mapped to the existing
`cars.co2_emissions` column. Hibernate otherwise derives `co2emissions` for this
digit-and-acronym property and fails schema validation even though `V3` created
the correct database column. The numbered lease fields are likewise explicitly
mapped to `lease_price_60_months`, `lease_price_48_months`, and
`lease_price_36_months`.

If production reports a checksum mismatch for `V8`, first verify that its
schema changes are present:

```sql
SELECT table_name, column_name
FROM information_schema.columns
WHERE (table_name, column_name) IN (
  ('users', 'phone_number'),
  ('wash_calendar', 'accepted'),
  ('cars', 'status')
);
```

When all three rows are returned and the deployed `V8` is the intended
migration, repair the Flyway history once:

```sql
UPDATE flyway_schema_history
SET checksum = 1320712067
WHERE version = '8'
  AND checksum = -842893664;
```

Restart the backend afterward. Do not disable Flyway validation.

Flyway is the schema authority. Hibernate uses `ddl-auto: validate`, so startup
fails when the migrated database no longer matches the JPA mappings instead of
silently changing production tables.

## API Reference

Unless stated otherwise, request and response bodies use JSON.

### Authentication API

| Method | Endpoint | Effective access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register and issue both cookies |
| `POST` | `/auth/login` | Public | Validate credentials and issue cookies |
| `POST` | `/auth/refresh` | Public route; requires refresh token | Replace access cookie |
| `GET` | `/auth/me` | Valid access token | Return current user |
| `PATCH` | `/auth/update` | Valid access token | Update profile and rotate both tokens |
| `POST` | `/auth/logout` | Public | Expire both cookies |
| `GET` | `/auth/getUserCars` | Intended authenticated access | Return current user's cars |
| `GET` | `/auth/health` | Public | Return `OK` |

#### Register

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Jane Customer",
  "email": "jane@example.com",
  "password": "StrongPass12!",
  "phoneNumber": "+31 6 12345678"
}
```

Success: `201 Created`, access and refresh cookies, and:

```json
{
  "uid": "3e8cfad6-228c-46bc-ae43-afd905914df2",
  "role": "USER",
  "user": "Jane Customer",
  "email": "jane@example.com",
  "phoneNumber": "+31 6 12345678"
}
```

Duplicate email: `409 Conflict` with a Spring `ProblemDetail`.

#### Login

```json
{
  "email": "jane@example.com",
  "password": "StrongPass12!"
}
```

Success returns the same user payload as registration. Invalid credentials
return `401 Unauthorized`.

#### Refresh

The refresh token may be supplied through the `refreshToken` cookie or body:

```json
{
  "refreshToken": "optional-token-value"
}
```

Success replaces only the access cookie. The refresh response is built from JWT
claims and currently omits `phoneNumber`.

#### Update Profile

```json
{
  "name": "Jane Updated",
  "phoneNumber": "+31 6 87654321",
  "password": "OptionalNew12!"
}
```

Blank values are ignored by `UserService`. A successful update rotates both
JWTs so the name claim stays current.

### Wash Calendar API

Every wash calendar route requires authentication through the global security
rule.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/wash_calendar` | Create one treatment row |
| `POST` | `/wash_calendar/batch` | Atomically create treatment rows |
| `GET` | `/wash_calendar` | Admin: list every appointment row |
| `GET` | `/wash_calendar/by_user` | List current user's rows |
| `GET` | `/wash_calendar/date/{localDateTime}` | Admin: list rows at exact date/time |
| `GET` | `/wash_calendar/accepted/{TF}` | Current user's rows by status |
| `POST` | `/wash_calendar/accept/{uuid}` | Admin: mark one row accepted |
| `DELETE` | `/wash_calendar/{uuid}` | Delete one owned row |
| `DELETE` | `/wash_calendar/batch` | Atomically delete owned rows |

#### Create Booking

```json
{
  "washType": "Interior_Treatment",
  "localDateTime": "2026-06-15T10:00:00"
}
```

Response:

```json
{
  "id": "fc912912-310d-4d1d-822f-a5ada79d3528",
  "washType": "Interior_Treatment",
  "userId": "3e8cfad6-228c-46bc-ae43-afd905914df2",
  "localDateTime": "2026-06-15T10:00:00",
  "accepted": false
}
```

`{TF}` accepts standard boolean path values such as `true` and `false`.
`{localDateTime}` must be an ISO date-time accepted by Spring.

Batch booking request:

```json
{
  "washTypes": [
    "Interior_Treatment",
    "Exterior_Treatment"
  ],
  "localDateTime": "2026-06-15T10:00:00"
}
```

Batch cancellation request:

```json
{
  "ids": [
    "fc912912-310d-4d1d-822f-a5ada79d3528",
    "67aa9e29-6cc8-4372-aa03-82452c025db9"
  ]
}
```

Batch cancellation verifies that every ID exists and belongs to the
authenticated user before deleting any rows.

### Admin API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/admin/dashboard` | `ADMIN` | Return totals, users, and appointments |

The response excludes password hashes and JWT values. It contains summary
counts, password-safe user records, and appointment records enriched with the
customer's name, email address, and phone number.

The Angular admin dashboard sorts appointments from the earliest date to the
latest. Pending rows expose an Accept action. A successful action updates the
row status and the pending/accepted summary totals without reloading the page.

### Cars API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/cars` | Public | List cars |
| `GET` | `/cars/{id}` | Public | Get one car |
| `POST` | `/cars` | `ADMIN` | Create car |
| `POST` | `/cars/{id}` | `ADMIN` | Update car |
| `POST` | `/cars/statusUpdate/{id}` | `ADMIN` | Update only status |
| `DELETE` | `/cars/{id}` | `ADMIN` | Delete car |

The update endpoint uses `POST`, not `PUT` or `PATCH`.

Example status body:

```json
"Available"
```

The full `CarRequest` supports:

```text
title, subtitle, yearOfManufacture, mileage, power, referenceNumber, price,
firstRegistrationDate, numberOfDoors, wheelbase, numberOfCylinders,
motorVehicleTax, modelDateFrom, modelDateTo, maxTowingWeight,
maxTowingWeightUnbraked, urbanFuelConsumption, combinedFuelConsumption,
motorwayFuelConsumption, co2Emissions, taxDeductible, chassisNumber,
numberOfKeys, licensePlate, engineDisplacement, colour, emptyWeight,
taxAdditionPercentage, apkMotDate, serviceDocumentation, location,
financialLeasePricePerMonth, leasePrice60Months, leasePrice48Months,
leasePrice36Months, bodyType, gearbox, fuel, emissionClass, energyLabel,
paintType, upholstery, status
```

### Car Pictures API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/cars/{carId}/pictures` | Public | List picture metadata |
| `POST` | `/cars/{carId}/pictures` | `ADMIN` | Upload picture and metadata |

Upload content type: `multipart/form-data`.

## Environment Variables

Never commit real passwords, JWT secrets, or Supabase service-role keys.
Both frontend and backend `.env` files are ignored by Git.

### Frontend

Create `frontend/.env` from `frontend/.env.example`:

```dotenv
API_BASE_URL=
API_PROXY_TARGET=http://localhost:8080
DEALERSHIP_URL=
```

| Variable | Required | Description |
| --- | --- | --- |
| `API_BASE_URL` | Production | Backend origin compiled into Angular |
| `API_PROXY_TARGET` | Local development | Target for `/auth` and `/wash_calendar` |
| `DEALERSHIP_URL` | Optional | External dealership link in navbar |

Recommended local values:

```dotenv
API_BASE_URL=
API_PROXY_TARGET=http://localhost:8080
DEALERSHIP_URL=https://your-dealership.example
```

An empty `API_BASE_URL` produces relative API calls. Angular's development
proxy then forwards supported paths to `API_PROXY_TARGET`.

Before start, build, watch, and test, `generate-environment.mjs` creates:

```text
frontend/src/environments/environment.generated.ts
```

That generated file is gitignored.

> The development proxy currently forwards only `/auth` and
> `/wash_calendar`. It does not proxy `/cars`.

### Backend

Minimum application configuration:

```dotenv
SUPABASE_DB_URL=jdbc:postgresql://localhost:5432/autoanders
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=replace-me
SUPABASE_JWT_SECRET=replace-with-at-least-32-bytes
GUEST_EMAIL_PREFIX=guest::
MAIL_ENABLED=false
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-smtp-app-password
MAIL_FROM=your-email@example.com

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-me
SUPABASE_STORAGE_BUCKET=car-pictures
```

`GUEST_EMAIL_PREFIX` is server-side configuration. Keep it on the backend so
clients cannot choose how guest identities are stored.

Set `MAIL_ENABLED=true` only after configuring valid SMTP credentials. For
Gmail, `MAIL_PASSWORD` must be an app password rather than the normal account
password.

Spring's relaxed environment binding maps the Supabase storage variables to:

```text
supabase.url
supabase.service-role-key
supabase.storage.bucket
```

### Datasource Resolution

`DataSourceConfig` supports several deployment formats.

Priority for URL:

1. `spring.datasource.url`
2. `SPRING_DATASOURCE_URL`
3. `URLDATABASE`
4. `DATABASE_URL`
5. `PGHOST` plus `PGDATABASE`

Username candidates:

```text
spring.datasource.username
SPRING_DATASOURCE_USERNAME
PGUSER
POSTGRES_USER
```

Password candidates:

```text
spring.datasource.password
SPRING_DATASOURCE_PASSWORD
PGPASSWORD
POSTGRES_PASSWORD
```

Supported `DATABASE_URL` format:

```text
postgresql://username:password@host:5432/database
```

The datasource appends `prepareThreshold=0` to PostgreSQL JDBC URLs unless it
is already present.

Default Hikari settings:

| Setting | Default |
| --- | --- |
| Maximum pool size | `10` |
| Minimum idle | `2` |
| Keepalive time | `300000 ms` |
| Idle timeout | `600000 ms` |

## Local Development

### Requirements

- Git
- Node.js supported by Angular 21
- npm 11.6.1 or a compatible npm 11 release
- Java 21
- PostgreSQL
- Docker Desktop or another Docker runtime for Testcontainers and Docker runs

### 1. Clone the Repository

```bash
git clone https://github.com/yassineao/poetsanders.git
cd poetsanders
```

### 2. Create a PostgreSQL Database

Example:

```sql
CREATE DATABASE autoanders;
```

The configured database user must be able to create extensions, tables,
indexes, and constraints when migrations run.

### 3. Configure the Backend

Create:

```text
backend/AutoAnders/.env
```

Use the backend variables described above. Maven does not automatically load a
plain `.env` file by itself. Export the variables in your shell, configure them
in your IDE run configuration, or run through Docker Compose, which reads the
backend `.env`.

PowerShell example:

```powershell
$env:SUPABASE_DB_URL = "jdbc:postgresql://localhost:5432/autoanders"
$env:SUPABASE_DB_USERNAME = "postgres"
$env:SUPABASE_DB_PASSWORD = "replace-me"
$env:SUPABASE_JWT_SECRET = "replace-with-at-least-32-bytes"
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "replace-me"
$env:SUPABASE_STORAGE_BUCKET = "car-pictures"
```

### 4. Start the Backend

PowerShell:

```powershell
cd backend/AutoAnders
.\mvnw.cmd spring-boot:run
```

Linux or macOS:

```bash
cd backend/AutoAnders
./mvnw spring-boot:run
```

Default URL:

```text
http://localhost:8080
```

Health check:

```text
GET http://localhost:8080/auth/health
```

### 5. Configure the Frontend

PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env
```

Linux or macOS:

```bash
cd frontend
cp .env.example .env
```

For customer flows, keep `API_BASE_URL` empty and set
`API_PROXY_TARGET=http://localhost:8080`. The current proxy does not include
`/admin`, so set `API_BASE_URL=http://localhost:8080` when testing the admin
dashboard locally, or add an `/admin` proxy entry.

### 6. Install and Start the Frontend

```bash
npm ci
npm start
```

Open:

```text
http://localhost:4200
```

### Docker Backend

The backend image uses a two-stage Java 21 build:

1. Maven compiles and packages the application.
2. Eclipse Temurin JRE 21 runs `app.jar`.

Start through Compose:

```bash
cd backend/AutoAnders
docker compose up --build
```

Compose:

- Builds the local Dockerfile
- Names the container `autoanders-api`
- Tags the image `gloyoo/autoanders-api:latest`
- Publishes `8080:8080`
- Reads `backend/AutoAnders/.env`

## Testing and Verification

### Frontend Commands

Run from `frontend`:

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exactly from `package-lock.json` |
| `npm start` | Generate environment and run development server |
| `npm run build` | Generate environment and build browser plus SSR bundles |
| `npm run watch` | Development build in watch mode |
| `npm test` | Generate environment and run unit tests |
| `npm run serve:ssr:frontend` | Serve an existing SSR build |

Current frontend test coverage is small and mainly contains the generated root
application test. Booking, login, profile, and appointment flows need dedicated
unit and integration coverage.

### Backend Commands

Run from `backend/AutoAnders`:

PowerShell:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

Linux or macOS:

```bash
./mvnw test
./mvnw package
```

Existing backend tests include:

- Spring application context loading with a PostgreSQL Testcontainer
- User repository email lookup
- Booking service assignment of the authenticated user

Current test prerequisites and limitations:

- Docker must be running for `AutoAndersApplicationTests`, which starts a
  PostgreSQL Testcontainer.
- `UserRepositoryTest` currently cannot create its test application context
  because `@DataJpaTest` requests an embedded database, but no embedded database
  dependency is installed and the test does not import the PostgreSQL
  Testcontainer configuration.
- `WashCalendarServiceTest` is an isolated Mockito unit test and passes without
  Docker.

### Suggested Manual Smoke Test

1. Start PostgreSQL and the backend.
2. Start Angular at `http://localhost:4200`.
3. Register through `/book`.
4. Select two treatments at one date and time.
5. Verify two `wash_calendar` rows are created.
6. Reload the browser and verify `/auth/me` restores the session.
7. Verify one grouped appointment appears on `/appointments`.
8. Update name or phone on `/profile`.
9. Log out and verify protected pages redirect or hide authenticated content.
10. Log in again and cancel the grouped appointment.
11. Log in with an `ADMIN` account and verify redirect to `/admin`.
12. Search and paginate users and appointments.
13. Accept a pending appointment and verify its status and summary totals update.

## Build and Rendering

### Frontend Build Pipeline

```mermaid
flowchart TD
    Command[npm run build]
    Prebuild[prebuild hook]
    DotEnv[Read frontend/.env]
    Generated[Write environment.generated.ts]
    Angular[ng build]
    Browser[Browser bundle]
    Server[SSR server bundle]
    Routes{Server route mode}
    Dynamic[Server render services/:slug]
    Static[Prerender all other routes]

    Command --> Prebuild --> DotEnv --> Generated --> Angular
    Angular --> Browser
    Angular --> Server
    Angular --> Routes
    Routes --> Dynamic
    Routes --> Static
```

Build output:

```text
frontend/dist/frontend/
|-- browser/
`-- server/
```

The Express SSR server:

- Serves browser assets with a one-year cache duration
- Delegates other requests to `AngularNodeAppEngine`
- Uses `PORT` or defaults to `4000`

### Bundle Budgets

| Budget | Warning | Error |
| --- | --- | --- |
| Initial bundle | `500 kB` | `1 MB` |
| Any component style | `4 kB` | `8 kB` |

The production build currently completes with an initial bundle-size warning.

## Deployment

### Deployment Diagram

```mermaid
flowchart LR
    Browser[Customer browser]
    Vercel[Vercel static Angular browser output]
    API[Spring Boot API]
    DB[(Hosted PostgreSQL)]
    Storage[(Supabase Storage)]
    Dealer[External dealership frontend]

    Browser -->|HTTPS| Vercel
    Browser -->|HTTPS + cookies| API
    Browser -->|External link| Dealer
    API -->|JDBC TLS as configured| DB
    API -->|Storage REST API| Storage
```

### Vercel Frontend

The repository-root `vercel.json` currently declares:

```text
Install: npm ci
Build: npm run build
Output: dist/frontend/browser
Fallback rewrite: /(.*) -> /index.html
```

There is a path mismatch in the current repository layout:

- If Vercel runs from the repository root, `package.json` is under `frontend`,
  so the declared install and build commands need to enter that directory.
- If the Vercel project root is configured as `frontend`, the root-level
  `vercel.json` is outside that project root and should be moved or duplicated
  into `frontend`.

Resolve one of those layouts before relying on the current config for a fresh
deployment.

Production frontend variables:

```dotenv
API_BASE_URL=https://your-api.example
DEALERSHIP_URL=https://your-dealership.example
```

`API_BASE_URL` is compiled into the frontend during the build. Changing it
requires a new frontend deployment.

### Backend Deployment Requirements

- Java 21 or Docker
- Public HTTPS API origin
- PostgreSQL connection values
- JWT secret of at least 32 bytes
- Supabase URL, service-role key, and bucket
- Frontend origin allowed by CORS

For cross-origin cookie authentication:

1. Frontend and backend must use HTTPS.
2. Backend must detect HTTPS and issue `Secure; SameSite=None` cookies.
3. Angular must use `withCredentials: true`.
4. CORS must allow credentials.
5. The exact frontend origin or matching allowed-origin pattern must be present.

## Known Issues and Security Gaps

These items describe the current implementation and should be reviewed before
production use.

### Recently Resolved

- Spring Boot is pinned to stable version `3.5.14`; snapshot repositories are
  no longer configured.
- JJWT dependencies use one version (`0.12.6`), are declared only once, and
  `JwtService` uses the matching parser API.
- Flyway migration V8 adds the previously missing `phone_number`, `accepted`,
  and `status` columns.
- Hibernate now uses `ddl-auto: validate`; it no longer mutates the schema.
- Wash-calendar controllers return response DTOs instead of serializing the
  bidirectional JPA user relationship.

### Correctness and Runtime Risks

1. `GET /auth/getUserCars` casts `Authentication.getPrincipal()` to `User`, but
   `JwtAuthFilter` stores the display name string as the principal. This endpoint
   is likely to fail with `ClassCastException`.

2. The frontend has no automatic access-token refresh interceptor. After the
   15-minute access token expires, requests return `401` until login or an
   explicit refresh call.

3. There is no database constraint preventing two users from booking the same
   date, time, or treatment.

4. Past dates are blocked in the browser but not validated by the backend.

5. `CarPictureRepository` declares `Long` as its ID type while `CarPicture.id`
   is a UUID.

6. Picture request fields `title` and `description` are optional at the HTTP
   layer, while migration V6 declares them `NOT NULL`.

7. Car entities are returned directly from controllers. Lazy relationships and
   bidirectional references can create serialization or session-boundary
   problems. Dedicated response DTOs are safer.

8. The registration flow detects duplicate email addresses before insert, but a
   concurrent duplicate can still rely on the database unique constraint and
   may not be converted to the intended `409`.

### Schema and Build Maintenance

1. Migration V5 executes `DELETE FROM cars` before adding a required owner
   column. This is destructive for an existing database.

2. The frontend production deployment serves only `dist/frontend/browser`.
   This means Vercel uses SPA fallback behavior rather than running the Angular
   Express SSR server produced by the build.

3. The frontend development proxy does not include `/admin` or `/cars`.

4. `UserRepositoryTest` is configured as `@DataJpaTest` without an embedded
   database dependency or imported Testcontainer configuration, so it cannot
   currently initialize its datasource.

5. Full Flyway migration and Hibernate validation tests require a running
   PostgreSQL database. The Testcontainers suite also requires Docker.

### UX and State Limitations

1. Language selection is not persisted across reloads.
2. There are no Angular route guards.
3. Appointment availability is based on fixed translated time slots, not live
   backend availability.
4. A booking confirmation means the request was stored, not that every row was
   accepted by the business.
5. The booking form still contains an unused `message` form control while its
   textarea is not rendered.
6. The standalone `ProfileDetailsComponent` contains hardcoded English labels
   and is currently not used by the profile page.

## Development Guidelines

### Adding a Treatment

1. Add the treatment to all three translation sets.
2. Add its slug and content to the service interfaces if needed.
3. Add a matching backend `WashType` enum value.
4. Add the slug-to-enum mapping in `BookingService`.
5. Add the enum-to-slug mapping in `AppointmentsListComponent`.
6. Test booking, grouping, translation, and service-detail routing.

### Adding a Frontend Locale

1. Add the locale to the `Locale` type.
2. Add it to `I18nService.languages`.
3. Create the complete translation directory.
4. Register the copy in the translation map.
5. Verify date formatting and all shared interface requirements.

### Adding a Database Field

1. Update the JPA entity.
2. Add a new Flyway migration; never rewrite an applied migration.
3. Update request and response DTOs.
4. Update frontend interfaces if the field crosses the API boundary.
5. Add repository or service tests.
6. Verify against a clean database and a migrated existing database.

### Recommended Production Hardening Order

1. Add backend date and conflict validation.
2. Add automatic token refresh or a clear re-authentication strategy.
3. Replace remaining car entity responses with DTOs.
4. Repair repository and Testcontainers test configuration.
5. Add frontend route guards and broader automated tests.

## Repository

[github.com/yassineao/poetsanders](https://github.com/yassineao/poetsanders)
