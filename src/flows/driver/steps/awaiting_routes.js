import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_routes(msg, state) {
  const routes = (msg.text || "").trim();
  if (!routes) {
    await sendText({
      phone: msg.phone,
      text: "🚛 *Routes & Areas*\n\nWhich routes or areas do you often work on? This helps us match you with the right jobs!\n\n*Examples:*\n• *Gauteng:* Johannesburg CBD, Sandton, Pretoria East, Midrand\n• *Western Cape:* Cape Town CBD, Bellville, Durbanville, Table View\n• *KZN:* Durban CBD, Umhlanga, Ballito, Westville\n• *Inter-city:* JHB ↔ CPT, JHB ↔ DBN, CPT ↔ PE\n\nJust list the areas you know well, separated by commas! 📍",
    });
    return state;
  }
  const common_routes = routes
    .split(/,|\n|;/)
    .map((r) => r.trim())
    .filter(Boolean);
  await sendText({
    phone: msg.phone,
    text: "🎯 *Great routes!* Now let's talk about your expertise.\n\nWhat do you specialize in?\n\n1️⃣ *Furniture Moving* - Household & office furniture\n2️⃣ *Other Activities* - Specialized moving services\n3️⃣ *Both* - You do it all!\n\nReply with *1*, *2*, or *3*",
  });
  return updateState(state, {
    step: "awaiting_specialization",
    driver: { ...state.driver, common_routes },
  });
}
