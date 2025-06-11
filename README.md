# WhatsApp Cloud Messaging (Node.js + Express 5)

A clean and modular Node.js starter for WhatsApp Cloud API integration, using:

- ✅ Express 5 (with `import` syntax)
- ✅ Native `fetch` (no Axios)
- ✅ Mongoose for MongoDB
- ✅ Environment configuration via `.env`
- ✅ GitHub Actions for CI
- ✅ Vertical Slicing Architecture
- ✅ Vitest for testing

---

## 📁 Folder Structure

```
src/
  ├── config/       # DB connection
  ├── messages/     # WhatsApp messaging logic
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
Used to receive incoming messages. Logs the JSON body.

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

> ⚠️ Replace the recipient number in `src/server.js` with your test phone number.

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
- [ ] Add message persistence model (`MessageLog`)
- [ ] Add webhook signature validation
- [ ] Add user message replies

---

## License

MIT
