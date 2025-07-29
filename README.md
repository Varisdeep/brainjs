# Full Stack Next.js + MongoDB App

This is a full-stack web application built using **Next.js 15 (App Router)**, **MongoDB Atlas**, and **Tailwind CSS**. It connects to a cloud MongoDB database and is deployable both locally and on **Vercel**.

---

## 🔧 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: MongoDB Atlas, API Routes
- **Deployment**: Vercel

## 🚀 Environment Variables

To run this application, you need to set up the following environment variables:

### Required Variables:
- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_URL`: Your application URL (e.g., http://localhost:3000 for local development)
- `NEXTAUTH_SECRET`: A random string for NextAuth.js encryption

### Optional Variables:
- `SENDGRID_API_KEY`: For email notifications (role updates)
- `GOOGLE_CLIENT_ID`: For Google OAuth authentication
- `GOOGLE_CLIENT_SECRET`: For Google OAuth authentication

### Local Development:
Create a `.env.local` file in the root directory with the required variables.

### Vercel Deployment:
Add these environment variables in your Vercel project settings under the "Environment Variables" section.

## 📦 Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## 🔧 Build Issues Fixed

The following issues have been resolved:
- MongoDB connection error during build time
- ESLint warnings for unused variables
- Next.js Image optimization warnings
