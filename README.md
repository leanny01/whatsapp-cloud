# WhatsApp Cloud Messaging (Node.js + Express 5)

A clean and modular Node.js starter for WhatsApp Cloud API integration, using:

- ✅ Express 5 (with `import` syntax)
- ✅ Native `fetch` (no Axios)
- ✅ Mongoose for MongoDB
- ✅ Environment configuration via `.env`
- ✅ GitHub Actions for CI
- ✅ Vertical Slicing Architecture
- ✅ Vitest for testing
- ✅ Message logging and persistence
- ✅ Phone number normalization
- ✅ Bearer token authentication

## 📋 Table of Contents

- [WhatsApp Cloud Messaging (Node.js + Express 5)](#whatsapp-cloud-messaging-nodejs--express-5)
  - [📋 Table of Contents](#-table-of-contents)
  - [📁 Folder Structure](#-folder-structure)
  - [🚀 Getting Started](#-getting-started)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Environment Variables](#2-environment-variables)
    - [3. Run the App](#3-run-the-app)
    - [4. PM2 Process Management (Production)](#4-pm2-process-management-production)
  - [🧪 Testing](#-testing)
  - [📫 API Endpoints](#-api-endpoints)
    - [✅ Webhook Verification (Public)](#-webhook-verification-public)
    - [📥 Webhook Receive (Public)](#-webhook-receive-public)
    - [✉️ Send Message (Protected)](#️-send-message-protected)
    - [📊 Message Logs (Protected)](#-message-logs-protected)
  - [🔒 Authentication](#-authentication)
  - [🔄 Message Logging Features](#-message-logging-features)
  - [✅ GitHub Actions](#-github-actions)
  - [🧱 Built With](#-built-with)
  - [📌 TODOs](#-todos)
  - [🗺️ Conversation Flows](#️-conversation-flows)
  - [License](#license)

---

## 📁 Folder Structure

```
src/
  ├── config/       # DB connection
  ├── lib/          # Shared utilities
  ├── middleware/   # Express middleware
  ├── messages/     # WhatsApp messaging logic
  ├── models/       # Database models
  ├── webhook/      # Incoming & verification logic
  └── server.js     # Main app
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
PORT=3000
VERIFY_TOKEN=your_verify_token
WHATSAPP_TOKEN=your_long_lived_token
PHONE_NUMBER_ID=your_phone_number_id
MONGO_URI=mongodb://localhost:27017/whatsapp
API_TOKEN=your_api_token_here  # For protected routes
```

### 3. Run the App

```bash
npm run dev
```

Or in production:

```bash
npm start
```

### 4. PM2 Process Management (Production)

For production deployment, use PM2 to manage the server and worker processes:

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start both server and worker processes
pm2 start ecosystem.config.js

# View running processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart all processes
pm2 restart all

# Stop all processes
pm2 stop all

# Delete all processes
pm2 delete all

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

**PM2 Configuration:**

- `whatsapp_api`: Express server (port 3000)
- `whatsapp_worker`: Message processing worker
- Auto-restart on crashes
- Memory limit: 1GB per process
- Logs stored in `./logs/` directory

---

## 🧪 Testing

Run all tests using Vitest:

```bash
npm run test
```

---

## 📫 API Endpoints

### ✅ Webhook Verification (Public)

**GET** `/webhook`  
Used by Meta's webhook verification process.

Query parameters:

- `hub.mode`
- `hub.verify_token`
- `hub.challenge`

### 📥 Webhook Receive (Public)

**POST** `/webhook`  
Used to receive incoming messages. Automatically logs messages to database.

### ✉️ Send Message (Protected)

**GET** `/test`  
Trigger a test message using `sendMessage()`.

Headers:

- `Authorization: Bearer your_api_token`

Query parameters:

- `phone`: Recipient's phone number (required)

Example:

```bash
curl -H "Authorization: Bearer your_api_token" "http://localhost:3000/test?phone=1234567890"
```

### 📊 Message Logs (Protected)

**GET** `/api/logs/:phone`  
Get all messages for a specific phone number.

Headers:

- `Authorization: Bearer your_api_token`

Query parameters:

- `limit`: Number of messages to return (optional)
- `skip`: Number of messages to skip (optional)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort order (1 for ascending, -1 for descending)

Example:

```bash
curl -H "Authorization: Bearer your_api_token" "http://localhost:3000/api/logs/1234567890?limit=10"
```

**GET** `/api/logs`  
Get messages with phone number as query parameter.

Headers:

- `Authorization: Bearer your_api_token`

Query parameters:

- `phone`: Phone number to get messages for (required)
- `limit`: Number of messages to return (optional)
- `skip`: Number of messages to skip (optional)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort order (1 for ascending, -1 for descending)

Example:

```bash
curl -H "Authorization: Bearer your_api_token" "http://localhost:3000/api/logs?phone=1234567890&limit=10"
```

---

## 🔒 Authentication

Protected routes require a Bearer token in the Authorization header:

```bash
Authorization: Bearer your_api_token
```

The token is configured via the `API_TOKEN` environment variable.

---

## 🔄 Message Logging Features

- ✅ Automatic logging of inbound and outbound messages
- ✅ Phone number normalization (removes '+' and leading '0')
- ✅ Comprehensive phone number format matching
- ✅ Pagination and sorting support
- ✅ Message count tracking
- ✅ Error handling and validation

---

## ✅ GitHub Actions

CI runs on every push to `main`. It checks:

- Dependency install
- Linting (if added)
- Test suite via Vitest

---

## 🧱 Built With

- Node.js 20+
- Express 5
- MongoDB + Mongoose
- Native fetch API
- PM2 (Process Manager)
- Vitest
- GitHub Actions

---

## 📌 TODOs

- [ ] Add Dockerfile
- [ ] Add webhook signature validation
- [ ] Add user message replies
- [ ] Add message search functionality
- [ ] Add date range filtering for messages

## 🗺️ Conversation Flows

This project features two main WhatsApp flows:

- **Quote Flow**: Users can request a moving quote, view their quotes, or cancel a quote. [See full flow documentation →](docs/quote-flow.md)
- **Driver Application Flow**: Drivers can register, check their application status, and manage their profile. [See full flow documentation →](docs/driver-flow.md)

Each flow is fully documented with diagrams and step-by-step breakdowns in the linked files.

- The previous inlined diagrams have been removed for clarity. See the linked documentation files for full details.

---

## License

MIT
