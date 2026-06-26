# Maxim Vet

Premium Agrochemicals & Animal Health Suppliers in Kenya. Shop certified crop
protection, fertilizers, and veterinary medicines, and request expert
agronomy and veterinary consultations — all from one modern storefront.

## Overview

Maxim Vet is a single-page web app for a Kenyan agribusiness. It combines an
e-commerce catalog with service booking, educational content, and dedicated
academy portals for vets and farmers.

### Features

- **Hero slideshow** highlighting core product lines and services
- **Certified product catalog** with search, category filters, and detail modals
- **Shopping cart drawer** with quantity management and checkout flow
- **Service booking** for veterinary visits, soil testing, agronomy advice, and delivery
- **Academy portals** — separate `/vets` and `/farmers` experiences
- **Academy blog** with article listing and detail views
- **Get In Touch** page with inquiry and support desk tabs
- **Animated stats, newsletter signup, partner marquee, and a sticky glass navbar**
- **Resilient images** — every image falls back to a branded placeholder if a remote source fails

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vitejs.dev/) for dev/build tooling
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Motion](https://motion.dev/) for animations
- [lucide-react](https://lucide.dev/) for icons
- [@google/genai](https://www.npmjs.com/package/@google/genai) for Gemini AI features

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ (Node 24 recommended)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file (you can copy `.env.example`) and set your keys:

```bash
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

3. Start the development server:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the Vite dev server on port 3000        |
| `npm run build`   | Build the production bundle to `dist/`         |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`    | Type-check the project with `tsc --noEmit`     |
| `npm run clean`   | Remove build artifacts                         |

## Project Structure

```
src/
  App.tsx              # Root app, routing, layout, header & footer
  data.ts              # Product and blog content
  types.ts             # Shared TypeScript types
  imageFallback.ts     # Shared image error-fallback helper
  index.css            # Global styles & Tailwind setup
  components/
    HeroSlider.tsx
    ProductCatalog.tsx
    CartDrawer.tsx
    BlogSection.tsx
    BlogDetail.tsx
    FAQSection.tsx
    GetInTouchPage.tsx
    VetAcademyPortal.tsx
    FarmersAcademyPortal.tsx
```

## Environment Variables

| Variable         | Description                                  |
| ---------------- | -------------------------------------------- |
| `GEMINI_API_KEY` | API key for Gemini AI features               |
| `APP_URL`        | Base URL of the deployed app                 |

> Keep `.env.local` out of version control — it is already in `.gitignore`.

## License

© 2026 Maxim Vet Ltd. All rights reserved.
