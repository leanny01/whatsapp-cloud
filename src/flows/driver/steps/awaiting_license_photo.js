import { sendText } from "../../../lib/messages.js";
import review_driver from "./review_driver.js";

export default async function awaiting_license_photo(msg, state) {
  console.log("📸 License photo step - received message:", {
    has_content: !!msg.content,
    content_type: msg.content?.type,
    text: msg.text,
  });

  if (
    !msg.content ||
    (msg.content.type !== "image" && msg.content.type !== "document")
  ) {
    console.log("❌ Invalid content type, asking for license photo");
    await sendText({
      phone: msg.phone,
      text: "Please send a clear photo of your driver's license.",
    });
    return state;
  }

  console.log(
    "✅ Valid license photo received, transitioning to review_driver"
  );
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
