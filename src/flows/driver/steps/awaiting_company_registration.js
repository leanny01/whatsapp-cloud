import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_company_registration(msg, state) {
  const response = (msg.text || "").trim().toLowerCase();
  if (!["yes", "no"].includes(response)) {
    await sendText({
      phone: msg.phone,
      text: "Is this vehicle registered under a company? Please reply 'yes' or 'no'.",
    });
    return state;
  }

  // Update the current vehicle's company registration status
  const vehicles = state.driver.vehicles;
  const currentVehicleIndex = vehicles.length - 1;
  vehicles[currentVehicleIndex] = {
    ...vehicles[currentVehicleIndex],
    registered_under_company: response === "yes",
  };

  if (response === "yes") {
    await sendText({
      phone: msg.phone,
      text: "What is the company name?",
    });
    return updateState(state, {
      step: "awaiting_company_name",
      driver: { ...state.driver, vehicles },
    });
  } else {
    await sendText({
      phone: msg.phone,
      text: "Please send a photo of this vehicle.",
    });
    return updateState(state, {
      step: "awaiting_vehicle_photos",
      driver: { ...state.driver, vehicles },
    });
  }
}
