import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default async function awaiting_date(msg, state) {
  const input = (msg.text || "").trim().toLowerCase();

  // If no input provided, show the initial prompt
  if (!input) {
    await sendText({
      phone: msg.phone,
      text: "📅 *When are you planning to move?*\n\nChoose an option:\n\n1️⃣ *Not sure / Flexible* - We'll work around your schedule\n2️⃣ *Soon / ASAP* - We'll prioritize your request\n3️⃣ *Next month* - We'll plan ahead\n4️⃣ *In a few months* - We'll keep your quote ready\n5️⃣ *Specific date* - Enter your exact move date\n\nJust choose 1, 2, 3, 4, or 5! 📅",
    });
    return state;
  }

  // Handle numeric input for flexible date options
  if (input === "1" || input === "one") {
    await sendText({
      phone: msg.phone,
      text: "😊 *No problem!* We'll work around your schedule and keep your quote flexible. 📅\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "Flexible" },
    });
  }

  if (input === "2" || input === "two") {
    await sendText({
      phone: msg.phone,
      text: "🚀 *Got it!* We'll prioritize your request as urgent and get back to you quickly!\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "ASAP" },
    });
  }

  if (input === "3" || input === "three") {
    await sendText({
      phone: msg.phone,
      text: "📅 *Perfect!* We'll plan for next month and make sure everything is ready for your move.\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "Next Month" },
    });
  }

  if (input === "4" || input === "four") {
    await sendText({
      phone: msg.phone,
      text: "📋 *Great!* We'll keep your quote ready for future reference and reach out when it's closer to your move date.\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "In a few months" },
    });
  }

  if (input === "5" || input === "five") {
    await sendText({
      phone: msg.phone,
      text: "📅 *Perfect!* Let's get your exact move date.\n\nPlease enter your move date in this format:\n\n*Examples:*\n• *2024-12-15* (December 15, 2024)\n• *2025-01-20* (January 20, 2025)\n• *2024-11-30* (November 30, 2024)\n\nJust type the date as YYYY-MM-DD! 📅",
    });
    return updateState(state, { step: "awaiting_specific_date" });
  }

  // Handle text input for flexible date options (backward compatibility)
  if (
    input === "not sure" ||
    input === "unsure" ||
    input === "maybe" ||
    input === "flexible"
  ) {
    await sendText({
      phone: msg.phone,
      text: "😊 *No problem!* We'll work around your schedule and keep your quote flexible. 📅\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "Flexible" },
    });
  }

  if (input === "soon" || input === "asap" || input === "urgent") {
    await sendText({
      phone: msg.phone,
      text: "🚀 *Got it!* We'll prioritize your request as urgent and get back to you quickly!\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "ASAP" },
    });
  }

  if (input === "next month" || input === "next month") {
    await sendText({
      phone: msg.phone,
      text: "📅 *Perfect!* We'll plan for next month and make sure everything is ready for your move.\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "Next Month" },
    });
  }

  if (
    input === "in a few months" ||
    input === "few months" ||
    input === "later"
  ) {
    await sendText({
      phone: msg.phone,
      text: "📋 *Great!* We'll keep your quote ready for future reference and reach out when it's closer to your move date.\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚",
    });
    return updateState(state, {
      step: "awaiting_items",
      lead: { ...state.lead, date: "In a few months" },
    });
  }

  // Check for valid date format
  if (!isValidDate(msg.text)) {
    await sendText({
      phone: msg.phone,
      text: "📅 *When are you planning to move?*\n\nChoose an option:\n\n1️⃣ *Not sure / Flexible* - We'll work around your schedule\n2️⃣ *Soon / ASAP* - We'll prioritize your request\n3️⃣ *Next month* - We'll plan ahead\n4️⃣ *In a few months* - We'll keep your quote ready\n5️⃣ *Specific date* - Enter your exact move date\n\nJust choose 1, 2, 3, 4, or 5! 📅",
    });
    return state;
  }

  // Valid date entered
  await sendText({
    phone: msg.phone,
    text: `🎉 *Perfect!* We've got your move date scheduled for *${msg.text}*. 📅\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚`,
  });
  return updateState(state, {
    step: "awaiting_items",
    lead: { ...state.lead, date: msg.text },
  });
}
