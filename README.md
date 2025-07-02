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
    - [PM2 Usage Examples](#pm2-usage-examples)
  - [🧪 Testing](#-testing)
  - [📫 API Endpoints](#-api-endpoints)
    - [✅ Webhook Verification (Public)](#-webhook-verification-public)
    - [📥 Webhook Receive (Public)](#-webhook-receive-public)
    - [✉️ Send Message (Protected)](#️-send-message-protected)
    - [📊 Message Logs (Protected)](#-message-logs-protected)
  - [🔒 Authentication](#-authentication)
  - [🔄 Message Logging Features](#-message-logging-features)
  - [🗑️ Cache Management](#️-cache-management)
    - [Quick Start](#quick-start)
    - [Key Features](#key-features)
  - [📚 Documentation](#-documentation)
  - [🏷️ Release Information](#️-release-information)
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
  │   ├── cacheManager.js  # Cache management utilities
  │   └── stateUtils.js    # State management helpers
  ├── middleware/   # Express middleware
  ├── messages/     # WhatsApp messaging logic
  ├── models/       # Database models
  ├── webhook/      # Incoming & verification logic
  ├── flows/        # Conversation flow handlers
  │   ├── quote/    # Quote request flow
  │   └── driver/   # Driver application flow
  ├── queue/        # Message processing queue
  ├── leads/        # User state management
  └── server.js     # Main app

scripts/
  └── clear-cache.js  # Cache management CLI tool
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

For production deployment, use PM2 to manage the server and worker processes with integrated cache management:

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start all processes (including scheduled maintenance)
pm2 start ecosystem.config.cjs

# View running processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart all processes (with automatic cache clearing)
pm2 restart all

# Stop all processes
pm2 stop all

# Delete all processes
pm2 delete all

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Deploy to production (with cache clearing)
pm2 deploy production setup  # First time
pm2 deploy production        # Deploy updates

# View specific process logs
pm2 logs cache_maintenance
pm2 logs whatsapp_api
pm2 logs whatsapp_worker

# Check PM2 and cache status
node scripts/clear-cache.js pm2-status

# Clean restart (clear caches and restart)
node scripts/clear-cache.js pm2-clean
```

**PM2 Configuration:**

- `whatsapp_api`: Express server (port 3000)
- `whatsapp_worker`: Message processing worker
- `cache_maintenance`: Daily cache maintenance at 2 AM
- `cache_cleanup`: Weekly cleanup at 3 AM Sundays
- Auto-restart on crashes with cache management
- Memory limit: 1GB per process (512MB for maintenance)
- Logs stored in `./logs/` directory
- **PM2 Hooks**: Automatic cache clearing on restarts and deployments
- **Graceful Restarts**: Preserves user states during restarts
- **Deployment Integration**: Cache management for deployments
- **Scheduled Maintenance**: Automatic daily/weekly cache cleanup

### PM2 Usage Examples

```bash
# Process Management
pm2 start ecosystem.config.cjs          # Start all processes
pm2 restart all                         # Restart with cache clearing
pm2 stop all                           # Stop all processes
pm2 delete all                         # Remove from PM2

# Deployment
pm2 deploy production setup            # Initial setup
pm2 deploy production                  # Deploy updates
pm2 deploy production revert 1         # Rollback

# Monitoring
pm2 status                             # View process status
pm2 monit                              # Monitor resources
pm2 logs                               # View all logs
pm2 logs cache_maintenance             # View maintenance logs

# Specific Process Control
pm2 restart whatsapp_api               # Restart API only
pm2 logs whatsapp_worker --follow      # Follow worker logs
pm2 describe cache_maintenance         # View maintenance schedule
```

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

## 🗑️ Cache Management

The application includes comprehensive cache management tools for Redis-based state storage and memory optimization. This system provides CLI tools, programmatic APIs, and automated maintenance capabilities.

**📖 [View Complete Cache Management Documentation →](docs/cache-management.md)**

### Quick Start

```bash
# View cache statistics
node scripts/clear-cache.js stats

# Clear all caches
node scripts/clear-cache.js all

# Clear old data (24+ hours)
node scripts/clear-cache.js old

# Clear specific user
node scripts/clear-cache.js user 27xxxxxxxxx

# Perform maintenance
node scripts/clear-cache.js maintenance

# PM2 status and cache info
node scripts/clear-cache.js pm2-status

# View maintenance logs
pm2 logs cache_maintenance
tail -f ./logs/cache-maintenance-combined.log
```

### Key Features

- ✅ **CLI Interface**: Easy command-line cache management
- ✅ **Programmatic API**: `CacheManager` class for integration
- ✅ **Memory Monitoring**: Real-time statistics and analytics
- ✅ **Automated Maintenance**: Scheduled cleanup and optimization
- ✅ **Selective Clearing**: User-specific and time-based clearing
- ✅ **Emergency Recovery**: Complete system reset capabilities

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

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### 📋 Core Documentation

- **[CHANGELOG.md](docs/CHANGELOG.md)** - Complete version history and changes
- **[Cache Management](docs/cache-management.md)** - Cache operations and maintenance
- **[Quote Flow](docs/quote-flow.md)** - Quote request process documentation
- **[Driver Flow](docs/driver-flow.md)** - Driver application process documentation

### 🏷️ Release Information

- **[Release Notes v1.0.0](docs/releases/RELEASE_NOTES_v1.0.0.md)** - Detailed release information
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history and migration guides

### 📖 Quick Links

- [Cache Management CLI](docs/cache-management.md#cli-usage)
- [PM2 Process Management](docs/cache-management.md#pm2-integration)
- [Deployment Guide](docs/releases/RELEASE_NOTES_v1.0.0.md#deployment)
- [API Documentation](#-api-endpoints)

---

## 🏷️ Release Information

### Current Version: 1.0.0

**Release Date:** January 2, 2025  
**Release Type:** Initial Release

### 🎉 What's New in 1.0.0

- ✅ **Complete WhatsApp Integration** - Full quote and driver application flows
- ✅ **Enhanced User Experience** - Conversational interfaces with South African context
- ✅ **Robust State Management** - Immutable state updates and error handling
- ✅ **Cache Management System** - Comprehensive Redis cache operations
- ✅ **PM2 Process Management** - Production-ready deployment with scheduled maintenance
- ✅ **Universal Quit Functionality** - Users can exit any flow gracefully
- ✅ **Detailed Vehicle Selection** - 3-step driver vehicle registration process
- ✅ **View My Quote Feature** - Immediate quote viewing after submission
- ✅ **Enhanced Date Input** - Progressive disclosure with flexible options

### 📋 Key Features

#### 🚛 Driver Flow

- Comprehensive 3-step vehicle selection (Body Type → Capacity → Vehicle Type)
- South African context examples for routes
- Application status tracking and management
- Professional registration process

#### 📋 Quote Flow

- Multi-item upload support (photos, videos, documents, audio, text)
- Enhanced date input with flexible options
- Immediate quote viewing after submission
- Feedback system with star ratings
- Conversational interface throughout

#### 🔧 System Features

- Universal quit functionality across all flows
- Robust state management with validation
- Comprehensive cache management
- PM2 production deployment
- Automated maintenance and cleanup

### 🔗 Quick Links

- **[Full Release Notes →](docs/releases/RELEASE_NOTES_v1.0.0.md)**
- **[Complete Changelog →](docs/CHANGELOG.md)**
- **[Migration Guide →](docs/CHANGELOG.md#migration-guide)**

---

## 🗺️ Conversation Flows

This project features two main WhatsApp flows:

- **Quote Flow**: Users can request a moving quote, view their quotes, or cancel a quote. [See full flow documentation →](docs/quote-flow.md)
- **Driver Application Flow**: Drivers can register, check their application status, and manage their profile. [See full flow documentation →](docs/driver-flow.md)

Each flow is fully documented with diagrams and step-by-step breakdowns in the linked files.

---

## License

MIT
