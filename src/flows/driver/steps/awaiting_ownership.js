import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_ownership(msg, state) {
  const owns = (msg.text || "").trim().toLowerCase();
  if (!["yes", "no"].includes(owns)) {
    await sendText({
      phone: msg.phone,
      text: "Do you own this vehicle? Please reply 'yes' or 'no'.",
    });
    return state;
  }

  // Update the current vehicle's ownership
  const vehicles = state.driver.vehicles;
  const currentVehicleIndex = vehicles.length - 1;
  vehicles[currentVehicleIndex] = {
    ...vehicles[currentVehicleIndex],
    owns: owns === "yes",
  };

  await sendText({
    phone: msg.phone,
    text: "Is this vehicle registered under a company? (yes/no)",
  });
  return updateState(state, {
    step: "awaiting_company_registration",
    driver: { ...state.driver, vehicles },
  });
}
