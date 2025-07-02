import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_experience(msg, state) {
  const years = parseInt((msg.text || "").trim(), 10);
  if (isNaN(years) || years < 0) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid number of years of experience.",
    });
    return state;
  }
  await sendText({
    phone: msg.phone,
    text: "Do you work by yourself or have a team? (Reply 'alone' or 'team')",
  });
  return updateState(state, {
    step: "awaiting_team",
    driver: { ...state.driver, experience_years: years },
  });
}
