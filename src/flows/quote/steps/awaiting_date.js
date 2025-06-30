import { sendText } from "../../../lib/messages.js";

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default async function awaiting_date(msg, state) {
  const input = (msg.text || "").trim().toLowerCase();

  // Handle numeric input for flexible date options
  if (input === "1" || input === "one") {
    state.lead = { ...state.lead, date: "Flexible" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "No problem! We'll note that your date is flexible. 😊\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  if (input === "2" || input === "two") {
    state.lead = { ...state.lead, date: "ASAP" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "Got it! We'll prioritize your request as urgent. 🚀\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  if (input === "3" || input === "three") {
    state.lead = { ...state.lead, date: "Next Month" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "Perfect! We'll plan for next month. 📅\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  if (input === "4" || input === "four") {
    state.lead = { ...state.lead, date: "In a few months" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "Great! We'll keep your quote for future reference. 📋\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  // Handle text input for flexible date options (backward compatibility)
  if (
    input === "not sure" ||
    input === "unsure" ||
    input === "maybe" ||
    input === "flexible"
  ) {
    state.lead = { ...state.lead, date: "Flexible" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "No problem! We'll note that your date is flexible. 😊\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  if (input === "soon" || input === "asap" || input === "urgent") {
    state.lead = { ...state.lead, date: "ASAP" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "Got it! We'll prioritize your request as urgent. 🚀\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  if (input === "next month" || input === "next month") {
    state.lead = { ...state.lead, date: "Next Month" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "Perfect! We'll plan for next month. 📅\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  if (
    input === "in a few months" ||
    input === "few months" ||
    input === "later"
  ) {
    state.lead = { ...state.lead, date: "In a few months" };
    state.step = "awaiting_items";
    await sendText({
      phone: msg.phone,
      text: "Great! We'll keep your quote for future reference. 📋\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
    });
    return state;
  }

  // Check for valid date format
  if (!isValidDate(msg.text)) {
    await sendText({
      phone: msg.phone,
      text: "When do you want to move?\n\n📅 Enter a specific date (YYYY-MM-DD)\n\nOR choose an option:\n\n1️⃣ Not sure / Flexible\n2️⃣ Soon / ASAP\n3️⃣ Next month\n4️⃣ In a few months\n\nJust type the number or your preference!",
    });
    return state;
  }

  // Valid date entered
  state.lead = { ...state.lead, date: msg.text };
  state.step = "awaiting_items";
  await sendText({
    phone: msg.phone,
    text: "Perfect! We'll plan for that date. 📅\n\nWhat are you moving? You can:\n\n📸 Share pictures of your items\n📹 Send videos\n📄 Upload documents (inventory lists, etc.)\n📝 Type a text description\n\nSend any of these to help us understand your moving needs!",
  });
  return state;
}
