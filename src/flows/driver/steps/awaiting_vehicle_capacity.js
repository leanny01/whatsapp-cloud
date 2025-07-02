import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_vehicle_capacity(msg, state) {
  const input = (msg.text || "").trim();

  const capacityMap = {
    1: "1 Ton",
    2: "2 Tons",
    3: "5 Tons",
    4: "8 Tons",
    5: "10+ Tons",
    6: "Other",
  };

  if (!capacityMap[input]) {
    await sendText({
      phone: msg.phone,
      text: "📏 *Please choose a capacity:*\n\n1️⃣ *1 Ton* - Small delivery van\n2️⃣ *2 Tons* - Medium truck\n3️⃣ *5 Tons* - Large truck\n4️⃣ *8 Tons* - Heavy truck\n5️⃣ *10+ Tons* - Extra heavy truck\n6️⃣ *Other* - Different capacity\n\nReply with 1, 2, 3, 4, 5, or 6! 📦",
    });
    return state;
  }

  const capacity = capacityMap[input];
  const bodyType = state.driver.currentVehicle.bodyType;

  // Store the capacity and move to vehicle type selection
  await sendText({
    phone: msg.phone,
    text: `🚛 *Perfect! ${bodyType} with ${capacity} capacity.*\n\nFinally, what type of vehicle is it?\n\n1️⃣ *Truck* - Standard truck\n2️⃣ *Van* - Delivery van, panel van\n3️⃣ *Pickup* - Bakkie, utility vehicle\n4️⃣ *Trailer* - Trailer unit\n5️⃣ *Specialized* - Crane, lift, etc.\n6️⃣ *Other* - Different vehicle type\n\nReply with 1, 2, 3, 4, 5, or 6! 🚚`,
  });

  return updateState(state, {
    step: "awaiting_vehicle_type_final",
    driver: {
      ...state.driver,
      currentVehicle: {
        ...state.driver.currentVehicle,
        capacity,
      },
    },
  });
}
