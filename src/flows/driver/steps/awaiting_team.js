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
    text: "What routes or areas do you often work on? (List or describe)",
  });
  return updateState(state, {
    step: "awaiting_routes",
    driver: { ...state.driver, works_alone: team === "alone" },
  });
}
