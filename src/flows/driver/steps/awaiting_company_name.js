import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_company_name(msg, state) {
  const company_name = (msg.text || "").trim();
  if (!company_name) {
    await sendText({
      phone: msg.phone,
      text: "Please enter the company name.",
    });
    return state;
  }

  // Update the current vehicle's company name
  const vehicles = state.driver.vehicles;
  const currentVehicleIndex = vehicles.length - 1;
  vehicles[currentVehicleIndex] = {
    ...vehicles[currentVehicleIndex],
    company_name,
  };

  await sendText({
    phone: msg.phone,
    text: "Please send a photo of this vehicle.",
  });
  return updateState(state, {
    step: "awaiting_vehicle_photos",
    driver: { ...state.driver, vehicles },
  });
}
