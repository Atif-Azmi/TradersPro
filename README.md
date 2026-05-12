# TraderPro — Business Management System

Premium SaaS management system for hardware/iron material stores.

## Features
- **Dashboard**: Real-time sales and inventory metrics.
- **Inventory**: Full product management with stock alerts.
- **Customers**: Detailed directory with payment tracking.
- **Sales & Retail**: Fast entry logging for account and walk-in sales.
- **Professional Billing**: Automated PDF generation and WhatsApp sharing.
- **URL Shortening**: TinyURL integration for easy bill access.
- **Reports**: Master sales reports for any date range.

## Tech Stack
- **Frontend**: React (Vite), React Router v6, React Query, Lucide Icons.
- **Backend**: Node.js, Express, Puppeteer (PDF).
- **Database**: Supabase (PostgreSQL + RLS).
- **Storage**: Supabase Storage for PDF bills.

## Setup Instructions

### 1. Database Setup
1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** and run the queries found in `supabase-queries.sql`.
3. Go to **Storage** and create two buckets:
   - `bills`: Set to **Private**.
   - `logos`: Set to **Public**.

### 2. Environment Variables
Fill in the following in `server/.env` and `client/.env`:

#### `server/.env`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `TINYURL_API_KEY`

#### `client/.env`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Installation
```bash
# In the root directory
cd server && npm install
cd ../client && npm install
```

### 4. Running Locally
```bash
# Start backend (Port 5000)
cd server && npm run dev

# Start frontend (Port 5173)
cd client && npm run dev
```

## UI Aesthetic
Inspired by **DairyPro**, featuring a clean cream background, deep navy sidebar, and vibrant orange accents.
