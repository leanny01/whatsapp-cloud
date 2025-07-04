import { sendText } from "../../../lib/messages.js";

export default async function awaiting_more_vehicles(msg, state) {
  const response = (msg.text || "").trim().toLowerCase();
  if (!["yes", "no"].includes(response)) {
    await sendText({
      phone: msg.phone,
      text: "Do you have more vehicles to register? Please reply 'yes' or 'no'.",
    });
    return state;
  }

  if (response === "yes") {
    // Loop back to collect another vehicle
    state.step = "awaiting_vehicle";
    await sendText({
      phone: msg.phone,
      text: "What type is your next vehicle? (e.g., truck, van, etc.)",
    });
  } else {
    // No more vehicles, proceed to experience
    state.step = "awaiting_experience";
    await sendText({
      phone: msg.phone,
      text: "How many years of driving experience do you have? (number)",
    });
  }
  return state;
}
