import MessageLog from "./model.js";

export async function logOutbound({ phone, text, result }) {
  await MessageLog.create({
    from: "system",
    to: phone,
    type: "text",
    text: { body: text },
    direction: "outbound",
    raw: result,
    timestamp: Date.now(),
  });
}

export async function logInbound(msg) {
  await MessageLog.create({
    from: msg.from,
    type: msg.type,
    timestamp: msg.timestamp,
    text: msg.text || {},
    direction: "inbound",
    raw: msg,
  });
}
