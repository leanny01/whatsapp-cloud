import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_feedback_comment(msg, state) {
  if (!msg.text || msg.text.trim().length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please provide more details about your experience. What specifically could we improve? (At least 3 characters)",
    });
    return state;
  }

  // Save the feedback comment
  const comment = msg.text.trim();

  if (state.lastQuoteId) {
    try {
      const Quote = (await import("../model.js")).default;
      await Quote.findByIdAndUpdate(state.lastQuoteId, {
        "feedback.comment": comment,
      });
    } catch (error) {
      console.error("❌ Error saving feedback comment:", error);
    }
  }

  // Thank them and show next options
  await sendText({
    phone: msg.phone,
    text: "Thank you for your detailed feedback! 🙏\n\nWe take all feedback seriously and will use it to improve our service.\n\nWhat would you like to do next?\n\n1️⃣ Submit another quote\n2️⃣ Back to main menu\n\nReply with 1 or 2.",
  });

  return updateState(state, { step: "quote_submitted_actions" });
}
