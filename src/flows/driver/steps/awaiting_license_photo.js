import { sendText } from "../../../lib/messages.js";
import review_driver from "./review_driver.js";

export default async function awaiting_license_photo(msg, state) {
  if (
    !msg.content ||
    (msg.content.type !== "image" && msg.content.type !== "document")
  ) {
    await sendText({
      phone: msg.phone,
      text: "Please send a clear photo of your driver's license.",
    });
    return state;
  }
  const license = (state.driver.documents?.license || []).concat([msg.content]);
  state.driver = {
    ...state.driver,
    documents: { ...state.driver.documents, license },
  };
  state.step = "review_driver";
  await sendText({
    phone: msg.phone,
    text: "Thank you! Let's review your application.",
  });
  // Immediately show the review summary
  await review_driver({ ...msg, text: "" }, state);
  return state;
}
