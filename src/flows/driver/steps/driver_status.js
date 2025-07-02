import { sendText } from "../../../lib/messages.js";
import { getDriverApplications } from "../service.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function driver_status(msg, state) {
  try {
    // Find all driver applications by WhatsApp ID
    const applications = await getDriverApplications(msg.wa_id);

    if (!applications || applications.length === 0) {
      await sendText({
        phone: msg.phone,
        text: "📝 *No applications found yet*\n\nI don't see any driver applications for your number yet. No worries though - let's get you started!\n\nWould you like to apply as a driver? Reply with *1* to begin your application! 🚛",
      });
      return updateState(state, { step: "driver_menu" });
    }

    // Build a summary for each application
    const statusMap = {
      submitted: { emoji: "✅", msg: "Submitted and under review" },
      approved: { emoji: "🎉", msg: "Approved!" },
      rejected: { emoji: "❌", msg: "Not approved" },
      pending: { emoji: "⏳", msg: "Pending review" },
      default: { emoji: "📝", msg: "Being processed" },
    };

    const summary = applications
      .map((app, idx) => {
        const status = statusMap[app.status] || statusMap.default;
        return (
          `${idx + 1}. ${status.emoji} *${app.name || "(No Name)"}*\n` +
          `   Status: ${status.msg}\n` +
          `   Submitted: ${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Unknown"}`
        );
      })
      .join("\n\n");

    const statusText = `📊 *Your Driver Applications*\n\n${summary}\n\nWhat would you like to do next?\n\n1️⃣ *Apply Again* - Submit another application\n2️⃣ *Driver Menu* - Back to driver options\n3️⃣ *Main Menu* - Return to main menu`;

    await sendText({
      phone: msg.phone,
      text: statusText,
    });

    return updateState(state, { step: "driver_status_menu" });
  } catch (error) {
    console.error("Error checking driver status:", error);
    await sendText({
      phone: msg.phone,
      text: "😔 Sorry, I'm having trouble checking your application status right now. Please try again in a few minutes!",
    });
    return updateState(state, { step: "driver_menu" });
  }
}
