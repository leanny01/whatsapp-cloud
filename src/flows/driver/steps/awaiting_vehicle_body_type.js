import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_vehicle_body_type(msg, state) {
  const input = (msg.text || "").trim();

  const bodyTypeMap = {
    1: "Open Body",
    2: "Closed Body",
    3: "Refrigerated",
    4: "Specialized",
    5: "Trailer",
    6: "Other",
  };

  if (!bodyTypeMap[input]) {
    await sendText({
      phone: msg.phone,
      text: "🚛 *Please choose a body type:*\n\n1️⃣ *Open Body* - Flatbed, dropside, tipper\n2️⃣ *Closed Body* - Box truck, panel van, container\n3️⃣ *Refrigerated* - Cold storage, freezer truck\n4️⃣ *Specialized* - Crane, lift, specialized equipment\n5️⃣ *Trailer* - Semi-trailer, flatbed trailer\n6️⃣ *Other* - Different body type\n\nReply with 1, 2, 3, 4, 5, or 6! 🚚",
    });
    return state;
  }

  const bodyType = bodyTypeMap[input];

  // Store the body type and move to capacity selection
  await sendText({
    phone: msg.phone,
    text: `📏 *Great! You selected ${bodyType}.*\n\nNow, what's the capacity of your vehicle?\n\n1️⃣ *1 Ton* - Small delivery van\n2️⃣ *2 Tons* - Medium truck\n3️⃣ *5 Tons* - Large truck\n4️⃣ *8 Tons* - Heavy truck\n5️⃣ *10+ Tons* - Extra heavy truck\n6️⃣ *Other* - Different capacity\n\nReply with 1, 2, 3, 4, 5, or 6! 📦`,
  });

  return updateState(state, {
    step: "awaiting_vehicle_capacity",
    driver: {
      ...state.driver,
      currentVehicle: { bodyType },
    },
  });
}
