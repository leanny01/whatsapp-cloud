import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

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
    return updateState(state, {
      step: "review_quote",
      lead: { ...state.lead, date: "Flexible" },
    });
  }

  if (input === "soon" || input === "asap" || input === "urgent") {
    return updateState(state, {
      step: "review_quote",
      lead: { ...state.lead, date: "ASAP" },
    });
  }

  if (input === "next month") {
    return updateState(state, {
      step: "review_quote",
      lead: { ...state.lead, date: "Next Month" },
    });
  }

  if (
    input === "in a few months" ||
    input === "few months" ||
    input === "later"
  ) {
    return updateState(state, {
      step: "review_quote",
      lead: { ...state.lead, date: "In a few months" },
    });
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
  return updateState(state, {
    step: "review_quote",
    lead: { ...state.lead, date: msg.text },
  });
}
