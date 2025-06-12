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

---

## 📁 Folder Structure

```
src/
  ├── config/       # DB connection
  ├── lib/          # Shared utilities
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
```

### 3. Run the App

```bash
npm run dev
```

Or in production:

```bash
npm start
```

---

## 🧪 Testing

Run all tests using Vitest:

```bash
npm run test
```

---

## 📫 API Endpoints

### ✅ Webhook Verification

**GET** `/webhook`  
Used by Meta's webhook verification process.

Query parameters:

- `hub.mode`
- `hub.verify_token`
- `hub.challenge`

### 📥 Webhook Receive

**POST** `/webhook`  
Used to receive incoming messages. Automatically logs messages to database.

Example Test in Postman:

- Method: `POST`
- URL: `http://localhost:3000/webhook`
- Body (raw / JSON):

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "1234567890",
                "text": {
                  "body": "Hello"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### ✉️ Send Message

**GET** `/test`  
Trigger a test message using `sendMessage()`.

Query parameters:

- `phone`: Recipient's phone number (required)

Example:

```
GET /test?phone=1234567890
```

### 📊 Message Logs

**GET** `/api/logs/:phone`  
Get all messages for a specific phone number.

Query parameters:

- `limit`: Number of messages to return (optional)
- `skip`: Number of messages to skip (optional)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort order (1 for ascending, -1 for descending)

Example:

```
GET /api/logs/1234567890?limit=10&skip=0&sortBy=createdAt&sortOrder=-1
```

Response:

```json
{
  "success": true,
  "data": {
    "messages": [...],
    "total": 123,
    "phone": "1234567890"
  }
}
```

**GET** `/api/logs`  
Get messages with phone number as query parameter.

Query parameters:

- `phone`: Phone number to get messages for (required)
- `limit`: Number of messages to return (optional)
- `skip`: Number of messages to skip (optional)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort order (1 for ascending, -1 for descending)

Example:

```
GET /api/logs?phone=1234567890&limit=10
```

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
- Vitest
- GitHub Actions

---

## 📌 TODOs

- [ ] Add Dockerfile
- [ ] Add webhook signature validation
- [ ] Add user message replies
- [ ] Add message search functionality
- [ ] Add date range filtering for messages

---

## License

MIT
