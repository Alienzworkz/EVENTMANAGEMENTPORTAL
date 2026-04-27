#  Eventrix — Event Management Portal

![Eventrix Banner](client/public/vite.svg) *Replace with actual banner screenshot*

Eventrix is a premium, full-stack, comprehensive Software as a Service (SaaS) Event Management platform built with the MERN stack. Designed specifically for Event Attendees, Organizers, and System Administrators, Eventrix provides a modern, fast, and secure way to manage the entire lifecycle of events—from creation to ticketing and analytics.

---

## 🎥 Project Demo

[![Watch Demo](https://img.youtube.com/vi/MMgkvfXM-KU/0.jpg)](https://youtu.be/MMgkvfXM-KU)

---
## 🎥 Code Explanation (Frontend)

[![Watch Frontend Explanation](https://img.youtube.com/vi/qb8Mjf8Zdms/0.jpg)](https://youtu.be/qb8Mjf8Zdms)

## 🎥 Code Explanation (Backend)
[Watch Video](https://youtu.be/MMgkvfXM-KU)

## 🎥 Project Overview
[![Watch Overview](https://img.youtube.com/vi/WSK5PCVrLRU/0.jpg)](https://youtu.be/WSK5PCVrLRU)

###  How to Record Your Videos:
1. **Code Walkthrough:** Use OBS Studio or Loom. Show your editor (`client` and `server` folders). Explain the MVC architecture in the backend, the React component structure, the Context API for state management, and the Recharts implementation.
2. **Project Demo:** Open the app in the browser. Walk through a user journey: Register as an Organizer -> Create an event -> Log out -> Register as an Attendee -> Search for the event -> Book a ticket -> Check the dashboard. Switch to Admin to show the analytics module.

---

##  Features by Role

###  Attendee
* **Authentication**: Secure sign-up and login utilizing JWT.
* **Event Discovery**: Intelligently search and filter upcoming events by category, status, and custom search queries.
* **Ticketing System**: View event capacity in real-time and effortlessly book digital tickets.
* **Dashboard**: Track confirmed/pending bookings, view total expenditure, and see personal event stats via a clean graphical dashboard.
* **Profile Management**: Update personal details and password.

###  Organizer
* **All Attendee Features** plus:
* **Event Creation Studio**: Create rich events with dates, capacities, image URLs, and dynamic tagging.
* **Event Management**: Edit event details, track real-time registration counts, or cancel events securely.
* **Organizer Analytics**: Visualize event health via Recharts. See 'Events by Status' pie charts and track ticket revenue.
* **Attendee Tracking**: See exactly who is attending your hosted events.

###  System Administrator
* **Global Analytics Dashboard**: Monitor total system health. View total users, global platform revenue, platform-wide bookings, and detailed category breakdowns.
* **User Management System**: Upgrade users to 'Organizer' or 'Admin' roles, or prune accounts from the platform.
* **Global Event Control**: Approve/reject events submitted by organizers, and force-delete non-compliant events.

---

##  Technology Stack

**Frontend Architecture:**
* React.js (via Vite)
* Tailwind CSS + ShadCN UI principles
* Framer Motion (Micro-interactions & page transitions)
* Recharts (Data visualization & analytics)
* Axios (Promise-based HTTP client)
* React Router DOM (Dynamic SPA routing)

**Backend Architecture:**
* Node.js & Express.js (RESTful API foundation)
* MongoDB & Mongoose (NoSQL Database & Schema validation)
* JSON Web Tokens (Stateless Authentication)
* Bcrypt.js (Password encryption)
* Express Validator (Input sanitization)

---

##  Local Setup Instructions

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas URL)

### 1. Database & Backend Setup
```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# The .env file has been pre-configured (.env), but ensure you have a MongoDB instance running locally on port 27017, OR replace MONGO_URI in server/.env with your Atlas string.

# Seed the database with demo users, events, and bookings (highly recommended)
npm run seed

# Start the development server
npm run dev
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to the client directory
cd client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

Your app will be running at `http://localhost:5173`.

---

##  Deployment Guide

To deploy this application to production:

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. Go to [Render](https://render.com/), create a new **Web Service**.
3. Connect your GitHub repo.
4. Set the Root Directory to `server`.
5. Set Build Command to `npm install`.
6. Set Start Command to `npm start`.
7. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
8. Deploy.

### Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a new project.
2. Connect your GitHub repo.
3. Set the Root Directory to `client`.
4. Vercel should auto-detect Vite. Build command: `npm run build`, Output directory: `dist`.
5. Add Environment Variables (if `API_URL` needs to point to your new Render backend instead of the local proxy).
6. Deploy.

---

##  Screenshots

*(Instructor Note: Take screenshots of these views and add them to your `client/public` folder, then update the paths below).*

**1. Landing Page**
![Landing Page](client/public/landing.png)

**2. Organizer Dashboard (Analytics)**
![Organizer Dashboard](client/public/organizer-dash.png)

**3. Event Browsing & Search**
![Browse Events](client/public/events.png)

---

> Built for modern web engineering standards.
