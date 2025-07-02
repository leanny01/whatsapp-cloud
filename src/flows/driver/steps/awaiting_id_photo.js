import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_id_photo(msg, state) {
  if (
    !msg.content ||
    (msg.content.type !== "image" && msg.content.type !== "document")
  ) {
    await sendText({
      phone: msg.phone,
      text: "Please send a clear photo of your ID or passport.",
    });
    return state;
  }
  const id_passport = (state.driver.documents?.id_passport || []).concat([
    msg.content,
  ]);
  await sendText({
    phone: msg.phone,
    text: "Please send a clear photo of your driver's license.",
  });
  return updateState(state, {
    step: "awaiting_license_photo",
    driver: {
      ...state.driver,
      documents: { ...state.driver.documents, id_passport },
    },
  });
}
