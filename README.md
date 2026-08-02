# Imagify

AI-powered image generation web application built using the MERN stack, with credit-based generation and Razorpay payments.

## Features

- User Authentication (JWT)
- Credit Based System + Daily Free Credits (auto top-up once per day on login)
- Razorpay Payment Gateway
- AI Image Generation with Multiple Model Support (Clipdrop + Pollinations, pluggable for more)
- Image Generation History (auto-saved per user)
- Favorite Image Collections
- Prompt Templates (curated starter prompts by category)
- Public Gallery (users can opt-in to share generations)
- User Profile Dashboard (stats: credits, images generated, favorites, public shares)
- Admin Analytics Dashboard (users, revenue, images, model usage breakdown)
- Email Notifications (welcome email + payment confirmation, via Nodemailer)
- Dark Mode (persisted, class-based Tailwind dark variant)
- Responsive UI

## Tech Stack

- React 19 + Vite + Tailwind CSS v4
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- Razorpay
- JWT Authentication
- Nodemailer

## Installation

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run server
```

## Environment Variables

### server/.env
```
MONGODB_URI=
JWT_SECRET=
CLIPDROP_API=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CURRENCY=
DAILY_FREE_CREDITS=3

# Optional — enables real welcome/payment emails. Leave blank to skip emails safely.
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

### client/.env
```
VITE_BACKEND_URL=
VITE_RAZORPAY_KEY_ID=
```

## Making a user an Admin

There's no public signup flag for admin access (by design, for security). To grant admin access:

1. Register a normal account through the app.
2. In MongoDB Atlas (or Compass/mongosh), open the `imagify.users` collection.
3. Find your user document and set `isAdmin: true`.
4. Log out and back in — the "Admin Dashboard" link will now appear on your Profile page and Navbar dropdown.

## New API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | /api/image/models | List available AI models |
| GET | /api/image/templates | List curated prompt templates |
| GET | /api/image/history | Logged-in user's generation history |
| GET | /api/image/favorites | Logged-in user's favorited images |
| PATCH | /api/image/:id/favorite | Toggle favorite on an image |
| PATCH | /api/image/:id/public | Toggle whether an image shows in the public gallery |
| GET | /api/image/gallery | Public gallery feed (no auth) |
| GET | /api/user/profile | Profile dashboard stats |
| GET | /api/admin/analytics | Admin-only platform analytics |
