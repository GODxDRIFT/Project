# Biziffy — Business Listing Platform

A full-stack business directory platform built with Next.js (frontend), Node/Express/TypeScript (backend), and MongoDB.

## Project Structure

```
biziffy/
├── frontend/     # Next.js 14 app
├── backend/      # Node + Express + TypeScript API
└── admin/        # React + Vite admin panel
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Admin Panel Setup
```bash
cd admin
bun install
bun run dev
```

## Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 18001) |
| `MONGO_URI` | MongoDB connection string |
| `GOOGLE_API_KEY` | Google Geocoding + Places API key |
| `JWT_SECRET` | JWT signing secret |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads |

## Key Features
- Business listing & search
- Google Location API integration (reverse geocoding)
- Zip code / area search
- Admin dashboard
- Membership & pricing plans

## Google API Setup
Enable these in Google Cloud Console:
1. **Geocoding API**
2. **Places API**

Then add the key to `backend/.env` as `GOOGLE_API_KEY`.
