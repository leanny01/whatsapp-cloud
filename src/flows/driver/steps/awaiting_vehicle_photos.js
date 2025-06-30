import { sendText } from "../../../lib/messages.js";

export default async function awaiting_vehicle_photos(msg, state) {
  if (
    !msg.content ||
    (msg.content.type !== "image" && msg.content.type !== "document")
  ) {
    await sendText({
      phone: msg.phone,
      text: "Please send a clear photo of this vehicle.",
    });
    return state;
  }

  // Add photo to the current vehicle
  const vehicles = state.driver.vehicles;
  const currentVehicleIndex = vehicles.length - 1;
  const currentVehicle = vehicles[currentVehicleIndex];
  const photos = currentVehicle.photos || [];
  photos.push(msg.content);

  vehicles[currentVehicleIndex] = { ...currentVehicle, photos };
  state.driver = { ...state.driver, vehicles };

  state.step = "awaiting_more_vehicles";
  await sendText({
    phone: msg.phone,
    text: "Do you have more vehicles to register? (yes/no)",
  });
  return state;
}
