# Poets Anders

Multilingual website for **Poets Anders**, a car-cleaning and detailing
business in Papendrecht, the Netherlands.

The site presents the available treatments, provides individual service
pages, and includes a responsive appointment-request form.

## Features

- Responsive home, services, service-detail, and booking pages
- English, German, and Dutch translations
- Five car-care treatment packages
- Reactive language switching and localized metadata
- Booking calendar, time selection, and client-side validation
- Angular server-side rendering (SSR) and prerendering
- Tailwind CSS styling

## Tech Stack

- Angular 21
- TypeScript
- Angular Router and Reactive Forms
- Angular SSR
- RxJS
- Tailwind CSS 4
- Vitest

## Getting Started

### Requirements

- Node.js compatible with Angular 21
- npm 11 or a compatible version

### Install and Run

```bash
cd frontend
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Scripts

Run all commands from the `frontend` directory.

| Command | Description |
| --- | --- |
| `npm start` | Start the local Angular development server |
| `npm run build` | Create the production browser and server builds |
| `npm run watch` | Build in development watch mode |
| `npm test` | Run the Vitest test suite |
| `npm run serve:ssr:frontend` | Serve an existing production SSR build |

To run the compiled SSR application:

```bash
npm run build
npm run serve:ssr:frontend
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/services` | Treatment overview |
| `/services/:slug` | Individual treatment details |
| `/book` | Appointment-request form |

Available treatment slugs:

```text
total-treatment
interior-treatment
exterior-treatment
headlight-treatment
ozone-treatment
```

## Project Structure

```text
poetsanders/
|-- frontend/
|   |-- public/                 Static images and branding
|   `-- src/app/
|       |-- core/
|       |   |-- i18/           Localization service and translations
|       |   `-- interfaces/    Shared copy and application types
|       |-- features/
|       |   |-- form/          Booking page and form
|       |   |-- home/          Home page and sections
|       |   `-- services/      Service list and detail pages
|       `-- shared/
|           `-- components/    Navbar and footer
|-- README.md
`-- vercel.json
```

## Localization

Translations live in:

```text
frontend/src/app/core/i18/translations/
```

Each locale (`en`, `de`, and `nl`) contains copy for the home page, services,
booking form, navbar, and footer. Shared interfaces in
`frontend/src/app/core/interfaces` keep the locale files consistent.

The default language is English. Language changes are handled by
`I18nService` and also update the document language and social metadata.

## Rendering

The Angular application uses a hybrid rendering setup:

- Service detail routes (`/services/:slug`) use server rendering.
- All other routes are prerendered during the production build.
- Client hydration uses event replay.

Production output is written to `frontend/dist/frontend`.

## Booking Status

The booking form currently performs client-side validation and shows a
confirmation state. It is not connected to an API, database, or email
service, so submissions are not persisted or delivered.

## Deployment

The repository includes a `vercel.json` configuration for installing,
building, serving the browser output, and rewriting application routes to
`index.html`.

For Vercel, configure `frontend` as the project root so that the npm scripts
and output paths resolve from the Angular application directory.
