import { sendText } from "../../../lib/messages.js";

export default async function awaiting_vehicle(msg, state) {
  const vehicle_type = (msg.text || "").trim();
  if (!vehicle_type) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your vehicle type (e.g., truck, van, etc.).",
    });
    return state;
  }

  // Initialize vehicles array if it doesn't exist
  const vehicles = state.driver.vehicles || [];
  vehicles.push({ type: vehicle_type });

  state.driver = { ...state.driver, vehicles };
  state.step = "awaiting_ownership";
  await sendText({
    phone: msg.phone,
    text: "Do you own this vehicle? (yes/no)",
  });
  return state;
}
