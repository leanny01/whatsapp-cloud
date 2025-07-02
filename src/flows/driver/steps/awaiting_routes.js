import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_routes(msg, state) {
  const routes = (msg.text || "").trim();
  if (!routes) {
    await sendText({
      phone: msg.phone,
      text: "Please list the routes or areas you often work on.",
    });
    return state;
  }
  const common_routes = routes
    .split(/,|\n|;/)
    .map((r) => r.trim())
    .filter(Boolean);
  await sendText({
    phone: msg.phone,
    text: "What do you specialize in?\n\n1. Furniture moving\n2. Other activities\n3. Both\n\nReply with 1, 2, or 3.",
  });
  return updateState(state, {
    step: "awaiting_specialization",
    driver: { ...state.driver, common_routes },
  });
}
