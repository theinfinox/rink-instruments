# RINK Technology Transfer Portal

A modern web platform developed for the **Research Innovation Network Kerala (RINK)** under **Kerala Startup Mission (KSUM)** to enable startup founders, entrepreneurs, researchers, investors, and industry partners to discover technologies available for technology transfer and commercialization.

---

## Project Overview

The RINK Technology Transfer Portal is designed to bridge the gap between research institutions and startups by providing a centralized technology discovery platform.

The portal allows users to:

- Discover technologies from leading research institutions
- Search technologies using advanced full-text search
- Browse technologies by sector
- Explore participating institutions
- View detailed technology information
- Submit Expressions of Interest (EOI) for technology transfer
- Identify commercialization opportunities

---

## Live Website

https://rink-ksum.vercel.app

---

## Technology Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Search Engine

- Orama Search

### Database

- Google Sheets
- Google Apps Script API

### Deployment

- Vercel

---

## Key Features

### Technology Discovery

- Full technology catalogue
- Technology detail pages
- Institution-wise browsing
- Sector-wise browsing

### Advanced Search

Search by:

- Technology Name
- Technology ID
- Keywords
- Institution
- Problem Solved
- Applications
- Technology Type
- Primary Sector
- Secondary Sector

### Filtering

Browse technologies using filters such as:

- Institution
- Sector
- Technology Type
- TRL
- IP Status

### Featured Technologies

Homepage automatically displays technologies marked as:

```
startup_potential = High
```

This field is used internally only and is not displayed to users.

### Technology Details

Each technology page includes:

- Technology Title
- Institution
- Technology ID
- Sector
- Problem Being Solved
- Technology Description
- Applications & Industrial Potential
- Technology Readiness Level (TRL)
- IP / Patent Status
- Expression of Interest (EOI)

---

## Search Engine

The portal uses **Orama Search** for fast local full-text searching.

Indexed fields include:

- technology_name
- technology_id
- institution
- keywords
- applications
- problem_solved
- description
- technology_type
- primary_sector
- secondary_sector

---

## Data Source

The application uses Google Sheets as the primary database.

Main sheet contains fields including:

- technology_id
- technology_name
- institution
- primary_sector
- secondary_sector
- technology_type
- problem_solved
- description
- applications
- trl
- patent_status
- contact_person
- email
- source_pdf
- page_no
- keywords
- image_url
- startup_potential
- ip_status_frontend

---

## Project Structure

```
app/
components/
hooks/
lib/
services/
types/
public/
styles/
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Production build

```bash
npm run build
```

---

## Environment Variables

Create a `.env.local` file.

Example:

```env
NEXT_PUBLIC_GOOGLE_SHEET_API=YOUR_API_ENDPOINT
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=YOUR_SCRIPT_URL
```

---

## Deployment

The application is deployed using Vercel.

Deployment steps:

1. Connect GitHub repository
2. Configure environment variables
3. Deploy

---

## Current Status

Completed

- Homepage
- Browse Technologies
- Technology Details
- Institution Pages
- Sector Pages
- Advanced Search
- Orama Integration
- Responsive UI
- Google Sheets Integration
- Featured Technologies
- EOI Workflow

---

## Future Improvements

Potential enhancements include:

- Admin Dashboard
- Institution Login
- Technology Analytics
- AI-powered Recommendations
- Saved Technologies
- User Authentication
- Technology Comparison
- PDF Preview
- Technology Transfer Workflow Tracking

---

## Developed By

**Muhammed Ashik S**

Academic Intern

Research Innovation Network (RINK)

Kerala Startup Mission



---

## Acknowledgements

Research Innovation Network Kerala (RINK)

Kerala Startup Mission (KSUM)

Participating Research Institutions across Kerala

---

## License

Developed as part of the Research Innovation Network (RINK) internship at Kerala Startup Mission.

All institutional technology data belongs to the respective research institutions and Kerala Startup Mission.

The source code should be used in accordance with Kerala Startup Mission's project guidelines.
em.
