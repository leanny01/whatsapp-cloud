import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_team(msg, state) {
  const team = (msg.text || "").trim().toLowerCase();
  if (!["alone", "team"].includes(team)) {
    await sendText({
      phone: msg.phone,
      text: "Do you work by yourself or have a team? Please reply 'alone' or 'team'.",
    });
    return state;
  }
  await sendText({
    phone: msg.phone,
    text: "🚛 *Routes & Areas*\n\nWhich routes or areas do you often work on? This helps us match you with the right jobs!\n\n*Examples:*\n• *Gauteng:* Johannesburg CBD, Sandton, Pretoria East, Midrand\n• *Western Cape:* Cape Town CBD, Bellville, Durbanville, Table View\n• *KZN:* Durban CBD, Umhlanga, Ballito, Westville\n• *Inter-city:* JHB ↔ CPT, JHB ↔ DBN, CPT ↔ PE\n\nJust list the areas you know well, separated by commas! 📍",
  });
  return updateState(state, {
    step: "awaiting_routes",
    driver: { ...state.driver, works_alone: team === "alone" },
  });
}
