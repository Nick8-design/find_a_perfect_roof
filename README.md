#  NyumbaAI: AI-Powered Real Estate & Rental Platform

[![Payment: PayPal](https://img.shields.io/badge/Payments-PayPal%20REST%20v2-003087.svg)](https://developer.paypal.com/)
[![AI Model: Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-4285F4.svg)](https://aistudio.google.com/)
[![Maps: Google Maps](https://img.shields.io/badge/Maps-Google%20Maps%20Platform-EA4335.svg)](https://mapsplatform.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg)](https://vitejs.dev/)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599.svg)](https://neon.tech/)
[![Emails](https://img.shields.io/badge/Notifications-Resend%20API-black.svg)](https://resend.com/)

NyumbaAI is an end-to-end, AI-driven real estate and rental management platform tailored for the modern Kenyan housing market (Nairobi, Westlands, Kilimani, Karen, Lavington, Kileleshwa, and beyond). It streamlines the entire rental lifecycle: conversational AI property search, concurrency-safe holds, automated PayPal deposits, dynamic Google Maps exploration, lease expiration tracking, and tenant notification workflows.

---

##  Table of Contents

- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Key Workflows](#-key-workflows)
  - [1. AI Agent (Nixy) & Function Calling](#1-ai-agent-nixy--function-calling)
  - [2. Concurrency-Safe Booking & PayPal](#2-concurrency-safe-booking--paypal)
  - [3. Automated Lease Warnings & Cron](#3-automated-lease-warnings--cron)
  - [4. Authentication & OTP Recovery](#4-authentication--otp-recovery)
- [Contributing & License](#-license)

---

##  Key Features

###  1. Conversational AI Assistant ("Nixy")
- **Gemini 2.5 Flash Integration**: Built with the official `@google/genai` SDK and function calling to search properties, pull high-res galleries, and initiate reservations in natural language.
- **Direct Chat Booking**: Tenants can type *"Book house_1"* directly in the chat. Nixy locks the house on the database and generates a live PayPal checkout order link inside the conversation.
- **Smart Local Fallback**: If the Gemini API key is missing or unauthorized, a local natural language search engine kicks in, ensuring zero downtime for house hunting and booking.
- **Responsive Drawer**: Expandable, minimize-to-pill, and responsive on all mobile, tablet, and desktop screens.

###  2. Instant Booking & Secure PayPal Checkout
- **15-Minute Concurrency Lock**: Prevents double-booking by putting a temporary lock on the property while the tenant completes payment.
- **PayPal Sandbox REST API v2**: Automated order creation, capture, and verification with tenant custom ID tracking.
- **Dynamic Duration Pricing**: Configurable lease terms (1 to 12 months) with deposit calculation and instant receipt generation.

###  3. Real-Time Bookings Dashboard & Lease Reminders
- **Remaining Days Countdown**: Calculates active lease duration and remaining days dynamically.
- **Automated Expiration Cron**: Hourly background worker monitors active leases.
  - **5-Day Advance Warning**: Sends automated email reminders via Resend API before a lease expires.
  - **Auto-Release**: Once a lease expires, the house is automatically unlisted from the tenant's active bookings and restored to available inventory for other seekers.
- **Direct Landlord & Caretaker Contacts**: One-click Phone, Email, and WhatsApp integration for seamless tenant-caretaker communication.

###  4. Interactive Property Discovery & Google Maps
- **Neighborhood Filtering**: Search across Nairobi's prime neighborhoods (Westlands, Kilimani, Karen, Lavington, Kileleshwa, etc.).
- **Budget & Bedroom Range Sliders**: Real-time filtering with instant result counts.
- **Google Maps Embed**: Visualizes coordinates for each house listing.

###  5. Full Authentication & Password Recovery
- **Strict Access Gate**: Unauthenticated users are routed to a dedicated portal before accessing property details or private dashboards.
- **2-Step OTP Password Reset**: Sends a secure 6-digit verification code via Resend email API to reset credentials.
- **Client-Side HTML5 History Routing**: Clean URL navigation (`/login`, `/register`, `/forgot-password`, `/explore`, `/bookings`, `/add-house`) with browser back/forward support.

---

## 🛠 Architecture & Tech Stack

```mermaid
flowchart LR
    subgraph Frontend ["React 19 Frontend (Vite)"]
        UI["Bootstrap 5 UI + Icons"]
        Router["HTML5 History Router"]
        ChatUI["ChatAgent Drawer (Nixy)"]
        PayPalSDK["@paypal/react-paypal-js"]
    end

    subgraph Backend ["Node.js / Express 5 API"]
        AuthCtrl["Auth & JWT Middleware"]
        HouseCtrl["House Controller (50+ Seeded Homes)"]
        BookingCtrl["Booking & Lock Manager"]
        ChatCtrl["Gemini 2.5 Flash + Fallback"]
        Cron["Lease Expiration Cron Service"]
    end

    subgraph External ["Cloud Services"]
        NeonDB[("Neon Serverless PostgreSQL")]
        GeminiAPI["Google Gemini AI"]
        PayPalAPI["PayPal REST API v2"]
        ResendAPI["Resend Email Service"]
        MapsAPI["Google Maps Embed API"]
    end

    UI --> Router
    Router --> AuthCtrl
    ChatUI --> ChatCtrl
    PayPalSDK --> BookingCtrl
    HouseCtrl --> NeonDB
    BookingCtrl --> NeonDB
    BookingCtrl --> PayPalAPI
    ChatCtrl --> GeminiAPI
    ChatCtrl --> HouseCtrl
    Cron --> NeonDB
    Cron --> ResendAPI
    AuthCtrl --> ResendAPI
```

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Bootstrap 5, Bootstrap Icons, Axios, `@paypal/react-paypal-js` |
| **Backend** | Node.js v20+, Express 5, `@google/genai`, `@neondatabase/serverless`, `pg`, `bcryptjs`, `jsonwebtoken` |
| **Database** | Neon Serverless PostgreSQL with SSL connection pooling |
| **Artificial Intelligence** | Google Gemini 2.5 Flash via `@google/genai` (Function Calling & Tool Execution) |
| **Payment Gateway** | PayPal Developer REST API v2 (Sandbox / Live) |
| **Email Service** | Resend REST API |
| **Mapping** | Google Maps Platform Embed API |

---

##  Project Directory Structure

```text
.
├── README.md                           # Master Project Documentation
├── LICENSE                             # MIT License file (to be added)
│
├── house_hunting_backend/              # Express 5 REST API Server
│   ├── controllers/
│   │   ├── authController.js           # Signup, Signin, Profile, OTP Reset
│   │   ├── bookingController.js        # Create, PayPal capture, locks, user bookings
│   │   ├── chatController.js           # Gemini 2.5 AI agent + smart local fallback
│   │   └── houseController.js          # House search, detail view, creation
│   ├── database/
│   │   └── db.js                       # Neon Postgres pool & 50 seeded houses
│   ├── middleware/
│   │   ├── auth.js                     # JWT authorization verification
│   │   └── errorHandler.js            # Global error handling
│   ├── models/
│   │   ├── Booking.js                  # Booking queries & lease calculations
│   │   ├── House.js                    # House queries, filters & concurrency locks
│   │   └── User.js                     # User entity & password hashing
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth routes
│   │   ├── bookingRoutes.js            # /api/bookings routes
│   │   ├── chatRoutes.js               # /api/chat routes
│   │   └── houseRoutes.js              # /api/houses routes
│   ├── services/
│   │   ├── emailService.js             # Resend email dispatcher (OTP & lease notices)
│   │   └── leaseCronService.js         # Hourly lease expiration & 5-day warning cron
│   ├── .env                            # Backend environment secrets (untracked)
│   ├── package.json
│   └── server.js                       # Server entrypoint with IPv4 DNS patch
│
└── house_hunting_frontend/             # React 19 Single Page Application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AuthModal.jsx           # Quick authentication modal
    │   │   ├── BookingModal.jsx        # Date picker, lease terms, PayPal button
    │   │   ├── ChatAgent.jsx           # Nixy AI conversational drawer
    │   │   ├── GoogleMapEmbed.jsx      # Google Maps iframe embedder
    │   │   ├── HouseCard.jsx           # Listing card with tags & actions
    │   │   ├── Navbar.jsx              # Responsive header & sidebar toggle
    │   │   ├── ProfileModal.jsx        # Edit profile & avatar selector
    │   │   └── Sidebar.jsx             # Collapsible menu (desktop & mobile)
    │   ├── context/
    │   │   ├── AuthContext.jsx         # User session & token state
    │   │   └── RouterContext.jsx       # HTML5 history router & URL synchronization
    │   ├── pages/
    │   │   ├── AddHousePage.jsx        # List a new property
    │   │   ├── ExplorePage.jsx         # Search, filter, house grid & map view
    │   │   ├── LoginPage.jsx           # Strict authentication portal
    │   │   └── MyBookingsPage.jsx      # Booked houses, carousels, days left
    │   ├── services/
    │   │   └── api.js                  # Axios client & endpoint wrappers
    │   ├── App.jsx                     # Route guard & page view coordinator
    │   ├── App.css                     # Custom animations & responsive overrides
    │   └── main.jsx                    # React root entrypoint
    ├── .env                            # Frontend environment configuration
    ├── package.json
    └── vite.config.js
```

---

##  Getting Started

### Prerequisites

- **Node.js** >= `20.x`
- **npm** >= `9.x`
- **Neon PostgreSQL Database** URL (or standard PostgreSQL instance)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey))
- **PayPal Developer Sandbox** Client ID & Secret ([PayPal Developer Dashboard](https://developer.paypal.com/))
- **Resend API Key** ([Resend.com](https://resend.com/))

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd house_hunting_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file (refer to the [Environment Variables](#-environment-variables) section below):
   ```bash
   cp .env.example .env # or create .env directly
   ```

4. Start the backend in development mode (with auto-reloading and IPv4 DNS prioritization):
   ```bash
   npm run dev
   ```
   *The server will boot on `http://localhost:5000` and automatically initialize database tables and seed 50 detailed Nairobi properties if they don't already exist.*

---

### 2. Frontend Setup

1. In a separate terminal tab, navigate to the frontend folder:
   ```bash
   cd house_hunting_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your frontend `.env`:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_optional
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

##  Environment Variables

### Backend (`house_hunting_backend/.env`)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Neon PostgreSQL Database Connection String
DATABASE_URL=postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require

# Google Gemini API Key (starts with AIzaSy... from Google AI Studio)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# PayPal Developer REST API Credentials
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com

# Resend Email API Key (for OTP codes and lease warning emails)
RESEND_API_KEY=re_your_resend_api_key

# JWT Token Secret for Authentication
JWT_SECRET=super_secret_jwt_key_nyumbaai_2026_secure
```

### Frontend (`house_hunting_frontend/.env`)

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# PayPal Client ID for JavaScript SDK buttons
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# Google Maps API Key for embedded coordinates
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

##  API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account with bcrypt password hashing |
| `POST` | `/api/auth/login` | Sign in with email & password, returns JWT token |
| `GET` | `/api/auth/profile` | Get logged-in user profile (Bearer token required) |
| `PUT` | `/api/auth/profile` | Update user name, phone number, and avatar |
| `POST` | `/api/auth/forgot-password` | Generate & dispatch 6-digit OTP code via Resend |
| `POST` | `/api/auth/reset-password` | Verify OTP code and set new password |

### Houses (`/api/houses`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/houses` | Search houses by `location`, `maxRent`, `bedrooms`, `minRent` |
| `GET` | `/api/houses/:id` | Get comprehensive details, pictures, amenities, and caretaker |
| `POST` | `/api/houses` | Add a new rental listing |
| `POST` | `/api/houses/:id/lock` | Acquire temporary 15-minute hold on a house |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings/initiate` | Lock house and create PayPal checkout order |
| `POST` | `/api/bookings/capture-paypal` | Capture PayPal payment, verify amount, confirm lease |
| `GET` | `/api/bookings/my-bookings` | Retrieve user bookings with calculated days remaining |

### AI Assistant (`/api/chat`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send message to Nixy with conversation history & user context |

---

##  Key Workflows

### 1. AI Agent (Nixy) & Function Calling
Nixy is grounded with system instructions tailored to the Nairobi rental ecosystem. Through function declarations, the model directly queries backend models:
1. When asked about houses in Kilimani, Nixy executes `searchHouses({ location: "Kilimani" })`.
2. When asked to reserve a home, Nixy executes `initiateBooking({ houseId: "house_1" })`.
3. The server locks the house, registers a pending booking, creates a PayPal order, and returns the PayPal approval link directly in the chat balloon.

### 2. Concurrency-Safe Booking & PayPal
- **Locking Mechanism**: The `houses` table tracks `locked_by` and `lock_expires_at`.
- When user A clicks "Book" or instructs Nixy to reserve, a 15-minute lease lock is applied.
- Other tenants attempting to book that property are politely informed that the listing is currently on hold.
- When PayPal triggers payment capture on `/api/bookings/capture-paypal`, the property is marked as `status = 'booked'`, permanently reserved for that tenant's lease duration.

### 3. Automated Lease Warnings & Cron
- The background cron service (`services/leaseCronService.js`) inspects active bookings against `CURRENT_DATE`.
- **5 Days Prior**: When `days_remaining <= 5`, an advance expiration notification email is automatically sent to the tenant's email address via Resend.
- **After Expiration**: When `days_remaining <= 0`, the booking is marked `expired`, the house is reset to `status = 'available'`, and it returns to the public explore feed.

### 4. Authentication & OTP Recovery
- **Security**: Passwords salted with `bcryptjs`. Session tokens signed via `jsonwebtoken` with 7-day expiration.
- **OTP Reset Flow**: In case of forgotten credentials, a 6-digit cryptographic numeric token is generated, stored with a 15-minute expiration timestamp in PostgreSQL, and delivered to the registered email using Resend.

---

##  License

This project is licensed under the **MIT License**.

> *The complete MIT License text will be added to the [`LICENSE`](./LICENSE) file in the root of this repository. You are free to use, modify, distribute, and integrate this software in private or commercial applications in accordance with the terms of the MIT License.*

---

**Crafted with ❤️ for modern real estate hunting in Kenya.[`DND`](https://nickdieda.web.app/)**

