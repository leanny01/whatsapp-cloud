import { sendText } from "../../../lib/messages.js";

export default async function awaiting_team(msg, state) {
  const team = (msg.text || "").trim().toLowerCase();
  if (!["alone", "team"].includes(team)) {
    await sendText({
      phone: msg.phone,
      text: "Do you work by yourself or have a team? Please reply 'alone' or 'team'.",
    });
    return state;
  }
  state.driver = { ...state.driver, works_alone: team === "alone" };
  state.step = "awaiting_routes";
  await sendText({
    phone: msg.phone,
    text: "What routes or areas do you often work on? (List or describe)",
  });
  return state;
}
