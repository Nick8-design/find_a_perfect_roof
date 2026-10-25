# NyumbaAI — Conversational AI Rental Discovery & PayPal Lease Booking

NyumbaAI is a full-stack real estate discovery and lease reservation platform built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/). It pairs a conversational AI assistant (**Nixy**, powered by Google Gemini function calling) with the [PayPal Orders v2 API](https://developer.paypal.com/docs/api/orders/v2/) and an atomic 15-minute PostgreSQL reservation lock to eliminate rental double-bookings and manual deposit friction.

## Live Deployments

| Service | Hosted URL | Platform |
| :--- | :--- | :--- |
| **Frontend Web App** | [https://nyumbaai-safe-roof.vercel.app](https://www.google.com/search?q=https://nyumbaai-safe-roof.vercel.app) | Vercel |
| **Backend REST API** | [https://find-a-perfect-roof.onrender.com](https://www.google.com/search?q=https://find-a-perfect-roof.onrender.com) | Render |
| **API Health Check** | [https://find-a-perfect-roof.onrender.com/health](https://www.google.com/search?q=https://find-a-perfect-roof.onrender.com/health) | Render |

## Problem & Solution

Finding and securing a rental home in fast-moving urban markets like Nairobi (Westlands, Kilimani, Karen, Kileleshwa, and Upper Hill) suffers from three persistent problems:
1. **Static, fragmented search:** Renters waste hours scrolling through outdated listings without knowing if a unit is still available or how to reach the caretaker.
2. **Double-booking during payment:** Two prospective tenants can pay holding deposits for the same apartment simultaneously while bank or mobile transfers are in flight.
3. **Lack of verifiable lease receipts:** Informal deposits often lack clear calculation of multi-month rent, move-in/end dates, and transaction audit trails.

**NyumbaAI solves this end-to-end:**
* **Conversational Search & Booking with Nixy:** Tenants chat naturally with **Nixy** (powered by `gemini-2.5-flash` tool calling) to filter houses by neighborhood, budget, and bedrooms, inspect caretaker contact details, or initiate a reservation directly inside the chat drawer.
* **Atomic 15-Minute Double-Booking Lock:** Before a PayPal order is created, the backend executes an atomic PostgreSQL update that transitions the property from `AVAILABLE` to `PENDING_PAYMENT` with a 15-minute `locked_until` window. Concurrent booking attempts receive an immediate `409 Conflict` until the hold either converts to `BOOKED` or expires.
* **PayPal Orders v2 & Multi-Month Lease Engine:** Tenants select their move-in date and lease duration (1 to 12 months). The backend computes `(monthly_rent × months_paid) + deposit_amount`, calculates the exact lease expiration date, attaches idempotency headers (`PayPal-Request-Id`), and processes payment through the official PayPal Sandbox checkout flow.

## Key Features

* **AI Assistant (Nixy) with Function Calling:** Executes `searchHouses`, `getHouseDetails`, and `initiateBooking` tools dynamically from natural conversation and addresses signed-in users by name.
* **Interactive PayPal Checkout:** Supports both embedded `<PayPalButtons />` (`@paypal/react-paypal-js`) in the booking modal and direct PayPal approval links generated inside AI chat bubbles.
* **Automatic Hold Release on Cancel:** If a tenant closes the PayPal popup or cancels checkout, the frontend triggers `/api/bookings/cancel-order` to release the 15-minute database lock immediately so other renters can book.
* **Verified Leases & Printable Receipts:** Filters out incomplete or canceled attempts so the **My Bookings** dashboard displays only verified `PAID` leases with remaining-day countdowns, embedded Google Maps, direct caretaker phone/WhatsApp/email links, and printable receipts with PayPal Capture IDs.

## Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Bootstrap 5, Bootstrap Icons, `@paypal/react-paypal-js`, Axios, Google Maps Embed |
| **Backend** | Node.js, Express.js, `@google/genai` (Gemini 2.5 Flash), PayPal REST API v2 (OAuth2 + Orders v2) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) (`@neondatabase/serverless` over stateless HTTPS) |
| **Hosting** | Vercel (Frontend SPA with rewrite rules), Render (Backend Web Service) |

## Payment & Reservation Lifecycle

1. **Select Property & Terms:** The tenant clicks **Book** on a listing card (or asks Nixy to book a property) and selects their move-in date and number of months.
2. **Atomic Lock & Order Creation (`POST /api/bookings/create-order`):**
   * Backend locks the house row in Neon PostgreSQL for 15 minutes (`status = 'PENDING_PAYMENT'`).
   * Backend creates a `PENDING` booking record with calculated `total_amount_paid` and `end_date`.
   * Backend authenticates with PayPal Sandbox OAuth2 (`/v1/oauth2/token`) and calls `POST /v2/checkout/orders` with `intent: "CAPTURE"` and `custom_id` metadata.
   * Backend returns `{ orderId, bookingId, approveUrl }` to the client.
3. **Buyer Approval (PayPal Sandbox):** The tenant signs into the PayPal popup with a Sandbox Personal (Buyer) account and approves the payment.
4. **Payment Capture & Lease Confirmation (`POST /api/bookings/capture-order`):**
   * Backend calls `POST /v2/checkout/orders/{orderId}/capture`.
   * Upon `COMPLETED` status, the booking row is updated to `PAID` with `paypal_capture_id`, `paypal_payer_id`, and `paid_at` timestamp, and the property status is permanently set to `BOOKED`.

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Returns server status and timestamp |
| `GET` | `/api/houses` | Lists available houses with optional `location`, `maxRent`, and `bedrooms` query filters |
| `GET` | `/api/houses/:id` | Returns full property details, amenities, and caretaker contacts |
| `POST` | `/api/houses` | Creates a new rental property listing |
| `POST` | `/api/chat` | Sends user message and conversation history to Nixy (Gemini 2.5 Flash with tools) |
| `POST` | `/api/bookings/create-order` | Places 15-minute atomic lock on property and creates a PayPal Sandbox order |
| `POST` | `/api/bookings/capture-order` | Captures approved PayPal order, marks booking `PAID`, and sets house `BOOKED` |
| `POST` | `/api/bookings/cancel-order` | Releases the 15-minute property hold and marks the booking `CANCELLED` |

## Local Development Setup

### Prerequisites
* Node.js v18+ (v20+ recommended)
* A [Neon PostgreSQL](https://neon.tech/) connection string
* A [Google Gemini API Key](https://aistudio.google.com/)
* A [PayPal Developer](https://developer.paypal.com/dashboard/applications/sandbox) Sandbox Client ID and Secret

### 1. Backend Setup

```bash
cd house_hunting_backend
npm install
```

Create a `.env` file in `house_hunting_backend/`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgres://user:password@ep-your-instance.us-east-2.aws.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com
```

Start the backend server (tables and sample Nairobi listings auto-initialize on boot):

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd house_hunting_frontend
npm install --legacy-peer-deps
```

Create a `.env` file in `house_hunting_frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

Start the Vite development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Quick Testing Guide for Judges

1. Visit the live app at [https://nyumbaai-safe-roof.vercel.app](https://www.google.com/search?q=https://nyumbaai-safe-roof.vercel.app) and create an account or sign in.
2. Click **Ask AI** in the top navigation bar to open **Nixy**.
3. Try prompts such as:
   * *"Find me a 2-bedroom house in Westlands under $800"*
   * *"Who is the caretaker for the Westlands apartment?"*
   * *"Book the first house for 2 months"*
4. Click **Book** on any available property card, choose a move-in date and duration, and click **Continue to PayPal**.
5. Complete the sandbox checkout using any PayPal Sandbox Personal (Buyer) account to view the instant payment receipt and inspect the active lease under **My Bookings**.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
