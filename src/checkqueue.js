import { messageQueue } from "./queue/queue.js";

async function checkQueueStatus() {
  const waiting = await messageQueue.getWaiting();
  const active = await messageQueue.getActive();
  const failed = await messageQueue.getFailed();
  const completed = await messageQueue.getCompleted();

  console.log("📥 Waiting jobs:", waiting.length);
  console.log("⚙️ Active jobs:", active.length);
  console.log("❌ Failed jobs:", failed.length);
  console.log("✅ Completed jobs:", completed.length);
}

checkQueueStatus();
