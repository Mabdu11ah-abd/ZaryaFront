# Zarya Lead Finder

Zarya is a lead-prospecting web app built with Next.js. It is designed to help teams discover people and companies, enrich contact data, save results into collections, and organize outreach campaigns. The product surface is similar to Apollo-style sales intelligence tools, with a focus on finding prospects, filtering them, and moving them into outreach workflows.

## What The App Does

- Search for companies and pivot those results into the companies workspace.
- Browse and filter people leads by role, tags, company, employee range, and location.
- Scrape new leads from a company prompt and optional target roles.
- View person detail pages with role, tags, LinkedIn links, email status, and company information.
- Browse company detail data including domains, employee counts, revenue, categories, technologies, origins, customers, and contact details.
- Save people and companies into collections for later use.
- Search companies with autocomplete-style suggestions and hand results off to the companies page.
- Build and manage outreach campaigns with multi-step email sequences, including template and AI-generated steps.
- Find people for selected companies and move those leads into the people workspace.

## Stack

- Next.js 15 with the App Router
- React 19
- Tailwind CSS 4
- Radix UI primitives
- Lucide icons
- SWR for data loading and cache updates
- Sonner for toast notifications

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - start the development server with Turbopack
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Project Structure

- `src/app` - route pages for people, companies, collections, campaigns, search, login, and signup
- `src/components` - shared UI and feature components
- `src/lib/mock-api.js` - mocked people, collections, and campaign data for the demo experience
- `src/lib/mock-company-api.js` - mocked company search and detail data
- `src/hooks` - reusable client-side hooks

## Notes

- Several screens are wired to local or mocked data sources so the product can be explored without a full backend.
- Some flows persist results in `localStorage` so one workspace can hand off data to another, such as search results into companies and company matches into people.

## Learn More

This project uses the Next.js App Router and standard Next.js deployment patterns. For framework documentation, see the Next.js docs at https://nextjs.org/docs.
