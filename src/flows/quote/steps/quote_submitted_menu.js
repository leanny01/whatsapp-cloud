import { sendText } from "../../../lib/messages.js";
import { getContactMessage } from "../../../lib/contact.js";

const confirmationMenu =
  `✅ Your quote has been submitted! ${getContactMessage()}\n\n` +
  "How would you rate your experience with our quote service?\n\n" +
  "5 ⭐⭐⭐⭐⭐ Excellent\n" +
  "4 ⭐⭐⭐⭐ Good\n" +
  "3 ⭐⭐⭐ Okay\n" +
  "2 ⭐⭐ Poor\n" +
  "1 ⭐ Very Poor\n\n" +
  "Reply with 1, 2, 3, 4, or 5";

export default async function quote_submitted_menu(msg, state) {
  // If this is the first time in this step or no valid option selected, show feedback menu
  if (
    !msg.text ||
    !["1", "2", "3", "4", "5"].includes((msg.text || "").trim())
  ) {
    await sendText({ phone: msg.phone, text: confirmationMenu });
    return state;
  }

  // Store the feedback rating
  const rating = msg.text.trim();

  // Save feedback to the most recent quote
  if (state.lastQuoteId) {
    try {
      const Quote = (await import("../model.js")).default;
      await Quote.findByIdAndUpdate(state.lastQuoteId, {
        "feedback.rating": rating,
        "feedback.submittedAt": new Date(),
      });
    } catch (error) {
      console.error("❌ Error saving feedback:", error);
    }
  }

  // Handle different ratings
  if (rating === "1" || rating === "2" || rating === "3") {
    // Lower ratings - ask for details
    state.step = "awaiting_feedback_comment";
    const ratingText =
      rating === "1" ? "very poor" : rating === "2" ? "poor" : "okay";
    await sendText({
      phone: msg.phone,
      text: `We appreciate your honest feedback! 🙏\n\nYou rated us as ${ratingText}. Please tell us what we can improve and where we fell short. Your feedback helps us serve you better.\n\nType your feedback below:`,
    });
  } else {
    // Higher ratings - show next options
    const thankYouMessage =
      rating === "5"
        ? "Thank you for the excellent rating! 😊 We're glad you had a great experience."
        : "Thank you for your feedback! We're glad you had a good experience.";

    await sendText({
      phone: msg.phone,
      text: `${thankYouMessage}\n\nWhat would you like to do next?\n\n1️⃣ Submit another quote\n2️⃣ Back to main menu\n\nReply with 1 or 2.`,
    });
    state.step = "quote_submitted_actions";
  }

  return state;
}
