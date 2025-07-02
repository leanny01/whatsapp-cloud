import { sendText } from "../../../lib/messages.js";
import { getContactMessage } from "../../../lib/contact.js";
import { updateState } from "../../../lib/stateUtils.js";

const confirmationMenu =
  `🎉 *Quote submitted successfully!* ${getContactMessage()}\n\n` +
  "We'd love to hear how your experience was! How would you rate our quote service?\n\n" +
  "5 ⭐⭐⭐⭐⭐ *Excellent*\n" +
  "4 ⭐⭐⭐⭐ *Good*\n" +
  "3 ⭐⭐⭐ *Okay*\n" +
  "2 ⭐⭐ *Poor*\n" +
  "1 ⭐ *Very Poor*\n\n" +
  "Reply with *1*, *2*, *3*, *4*, or *5*";

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
    const ratingText =
      rating === "1" ? "very poor" : rating === "2" ? "poor" : "okay";
    await sendText({
      phone: msg.phone,
      text: `🙏 Thank you for your honest feedback!\n\nYou rated us as *${ratingText}*. We want to improve and serve you better. Please tell us what we can do differently and where we fell short.\n\nType your detailed feedback below:`,
    });
    return updateState(state, { step: "awaiting_feedback_comment" });
  } else {
    // Higher ratings - show next options
    const thankYouMessage =
      rating === "5"
        ? "😊 Thank you for the excellent rating! We're thrilled you had such a great experience with us!"
        : "😊 Thank you for your feedback! We're glad you had a good experience with our service.";

    await sendText({
      phone: msg.phone,
      text: `${thankYouMessage}\n\nWhat would you like to do next?\n\n1️⃣ *Submit Another Quote* - Start a new request\n2️⃣ *View My Quote* - See your submitted quote\n3️⃣ *Main Menu* - Back to main options\n\nReply with *1*, *2*, or *3*`,
    });
    return updateState(state, { step: "quote_submitted_actions" });
  }
}
