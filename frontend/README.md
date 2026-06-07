# Poets Anders

Multilingual website for **Poets Anders**, a car-cleaning and detailing business in Papendrecht, the Netherlands.

The application presents the available treatments, provides detailed service pages, and includes a responsive booking form with a calendar and time-slot selection.

## Features

- Responsive home and services pages
- Five detailed car-care treatments:
  - Total Treatment
  - Interior Treatment
  - Exterior Treatment
  - Headlight Treatment
  - Ozone Treatment
- Multilingual content in English, German, and Dutch
- Reactive language switching
- Booking form with:
  - Multiple treatment selection
  - Customer and vehicle details
  - Monthly calendar
  - Date and time selection
  - Client-side validation
- Responsive navbar and footer
- Angular server-side rendering and prerendering
- Tailwind CSS styling

## Technology

- Angular 21
- TypeScript
- Angular Router
- Angular Reactive Forms
- Angular SSR
- RxJS
- Tailwind CSS 4
- Vitest

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/services` | Main services overview |
| `/services/:slug` | Dynamic treatment detail page |
| `/book` | Appointment request form |

Available service slugs:

```text
total-treatment
interior-treatment
exterior-treatment
headlight-treatment
ozone-treatment
```

## Getting Started

### Requirements

- A Node.js version supported by Angular 21
- npm 11 or a compatible npm version

### Installation

```bash
git clone https://github.com/yassineao/poetsanders.git
cd poetsanders/frontend
npm install
```

### Development Server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200).

The development server watches the source files and reloads the application after changes.

## Available Scripts

```bash
npm start
```

Starts the Angular development server.

```bash
npm run build
```

Creates a production browser and server build in `dist/frontend`.

```bash
npm run watch
```

Runs a development build in watch mode.

```bash
npm test
```

Runs the test suite.

```bash
npm run serve:ssr:frontend
```

Runs the compiled SSR server after a production build.

## Project Structure

```text
src/app/
├── core/
│   ├── i18/
│   │   └── translations/
│   │       ├── de/
│   │       ├── en/
│   │       └── nl/
│   └── interfaces/
├── features/
│   ├── form/
│   │   ├── components/
│   │   └── page/
│   ├── home/
│   │   ├── components/
│   │   └── pages/
│   └── services/
│       ├── components/
│       └── pages/
└── shared/
    └── components/
        ├── footer/
        └── navBar/
```

## Localization

Localized content is stored in:

```text
src/app/core/i18/translations/
```

Each language has its own `home`, `services`, navbar, footer, and booking content. Shared interfaces in `src/app/core/interfaces` ensure that every locale provides the required fields.

To update a translation, edit the matching file in:

```text
translations/en/
translations/de/
translations/nl/
```

## Service Detail Pages

Service detail pages use the dynamic route `/services/:slug`.

The route selects the matching treatment from the active locale. Each treatment can provide:

- Introductory description
- Included services
- Benefits
- Treatment process
- Detailed content sections
- Price information
- Booking call to action

## Booking Form

The booking form is implemented with Angular Reactive Forms in:

```text
src/app/features/form/components/form.component.ts
src/app/features/form/components/form.component.html
```

Users can select multiple treatments, choose a future date, select a preferred time, and enter their contact and vehicle information.

> The form currently performs client-side validation and displays a confirmation message. It is not yet connected to an email service, API, or database.

## Production Build

```bash
npm run build
```

The application uses Angular SSR with server output. Dynamic service-detail routes are rendered on the server, while static routes are prerendered.

The current production build may report an initial bundle budget warning because the bundle exceeds the configured `500 kB` warning threshold. The build still completes successfully.

## Assets

Static images and branding files are stored in:

```text
public/
```

## Repository

[github.com/yassineao/poetsanders](https://github.com/yassineao/poetsanders)
