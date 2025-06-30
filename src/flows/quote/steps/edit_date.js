import { sendText } from "../../../lib/messages.js";

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default async function edit_date(msg, state) {
  const input = (msg.text || "").trim().toLowerCase();

  // Handle flexible date options
  if (
    input === "not sure" ||
    input === "unsure" ||
    input === "maybe" ||
    input === "flexible"
  ) {
    state.lead.date = "Flexible";
    state.step = "review_quote";
    return state;
  }

  if (input === "soon" || input === "asap" || input === "urgent") {
    state.lead.date = "ASAP";
    state.step = "review_quote";
    return state;
  }

  if (input === "next month") {
    state.lead.date = "Next Month";
    state.step = "review_quote";
    return state;
  }

  if (
    input === "in a few months" ||
    input === "few months" ||
    input === "later"
  ) {
    state.lead.date = "In a few months";
    state.step = "review_quote";
    return state;
  }

  // Check for valid date format
  if (!isValidDate(msg.text)) {
    await sendText({
      phone: msg.phone,
      text: "When do you want to move?\n\n📅 Enter a specific date (YYYY-MM-DD)\n\nOR choose an option:\n\n• Not sure / Flexible\n• Soon / ASAP\n• Next month\n• In a few months\n\nJust type your preference!",
    });
    return state;
  }

  // Valid date entered
  state.lead.date = msg.text;
  state.step = "review_quote";
  return state;
}
