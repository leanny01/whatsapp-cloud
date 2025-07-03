import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_license(msg, state) {
  const license = (msg.text || "").trim();
  if (!license) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your driver's license number.",
    });
    return state;
  }
  await sendText({
    phone: msg.phone,
    text: "🚛 *What type of vehicle do you have?*\n\nLet's start with the body type:\n\n1️⃣ *Open Body* - Flatbed, dropside, tipper\n2️⃣ *Closed Body* - Box truck, panel van, container\n3️⃣ *Refrigerated* - Cold storage, freezer truck\n4️⃣ *Specialized* - Crane, lift, specialized equipment\n5️⃣ *Trailer* - Semi-trailer, flatbed trailer\n6️⃣ *Other* - Different body type\n\nReply with 1, 2, 3, 4, 5, or 6! 🚚",
  });
  return updateState(state, {
    step: "awaiting_vehicle_body_type",
    driver: { ...state.driver, license },
  });
}
