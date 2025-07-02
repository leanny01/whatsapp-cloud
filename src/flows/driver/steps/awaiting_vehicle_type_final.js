import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_vehicle_type_final(msg, state) {
  const input = (msg.text || "").trim();

  const vehicleTypeMap = {
    1: "Truck",
    2: "Van",
    3: "Pickup",
    4: "Trailer",
    5: "Specialized",
    6: "Other",
  };

  if (!vehicleTypeMap[input]) {
    await sendText({
      phone: msg.phone,
      text: "🚛 *Please choose a vehicle type:*\n\n1️⃣ *Truck* - Standard truck\n2️⃣ *Van* - Delivery van, panel van\n3️⃣ *Pickup* - Bakkie, utility vehicle\n4️⃣ *Trailer* - Trailer unit\n5️⃣ *Specialized* - Crane, lift, etc.\n6️⃣ *Other* - Different vehicle type\n\nReply with 1, 2, 3, 4, 5, or 6! 🚚",
    });
    return state;
  }

  const vehicleType = vehicleTypeMap[input];
  const { bodyType, capacity } = state.driver.currentVehicle;

  // Create the complete vehicle description
  const vehicleDescription = `${vehicleType} - ${bodyType} - ${capacity}`;

  // Initialize vehicles array if it doesn't exist
  const vehicles = state.driver.vehicles || [];
  vehicles.push({
    type: vehicleDescription,
    bodyType,
    capacity,
    vehicleType,
  });

  await sendText({
    phone: msg.phone,
    text: `🎉 *Perfect!* Your vehicle: *${vehicleDescription}*\n\nDo you own this vehicle? (yes/no)`,
  });

  return updateState(state, {
    step: "awaiting_ownership",
    driver: {
      ...state.driver,
      vehicles,
      currentVehicle: undefined, // Clear the temporary vehicle data
    },
  });
}
