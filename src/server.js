import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import webhookGet from './webhook/get.js';
import webhookPost from './webhook/post.js';
import { sendMessage } from './messages/send.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/webhook', webhookGet);
app.post('/webhook', webhookPost);

app.get('/test', async (req, res) => {
  await sendMessage({ phone: 'YOUR_NUMBER', text: 'Test message' });
  res.send('Message sent');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
