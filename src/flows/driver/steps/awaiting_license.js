import { sendText } from "../../../lib/messages.js";

export default async function awaiting_license(msg, state) {
  const license = (msg.text || "").trim();
  if (!license) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your driver's license number.",
    });
    return state;
  }
  state.driver = { ...state.driver, license };
  state.step = "awaiting_vehicle";
  await sendText({
    phone: msg.phone,
    text: "What type of vehicle do you drive? (e.g., Truck, Van, Pickup, etc.)",
  });
  return state;
}
