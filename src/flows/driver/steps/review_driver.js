import { sendText } from "../../../lib/messages.js";
import { saveDriverApplication } from "../service.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function review_driver(msg, state) {
  const d = state.driver;

  // If user sends "submit", process the submission
  if ((msg.text || "").trim().toLowerCase() === "submit") {
    await saveDriverApplication(msg.wa_id, d);
    await sendText({
      phone: msg.phone,
      text: "✅ Your driver application has been submitted! We will contact you soon.",
    });
    return updateState(state, { step: "driver_submitted" });
  }

  // If user sends "edit", go back to edit menu (you can implement this)
  if ((msg.text || "").trim().toLowerCase() === "edit") {
    await sendText({
      phone: msg.phone,
      text: "Edit functionality coming soon. For now, please reply 'submit' to submit your application.",
    });
    return state;
  }

  // Build vehicle summary with company details
  const vehicleSummary =
    d.vehicles
      ?.map((v, i) => {
        let vehicleInfo = `${i + 1}. ${v.type} (${v.owns ? "Owned" : "Not Owned"})`;
        if (v.registered_under_company) {
          vehicleInfo += ` - Company: ${v.company_name}`;
        }
        return vehicleInfo;
      })
      .join("\n") || "None";

  // Build specialization info
  const specializationText =
    d.specialization === "furniture_moving"
      ? "Furniture Moving"
      : d.specialization === "other"
        ? "Other Activities"
        : "Both";

  const otherActivitiesText = d.other_activities
    ? `\n*Other Activities:* ${d.other_activities}`
    : "";

  // Show summary and menu
  const summary = `*Driver Application Summary*\n\n*Name:* ${d.name}\n*WhatsApp:* ${d.phone}\n*Call Number:* ${d.call_number}\n*Address:* ${d.home_address}\n*License:* ${d.license}\n*Vehicles:* ${d.vehicles?.length || 0}\n${vehicleSummary}\n*Experience:* ${d.experience_years} years\n*Works Alone:* ${d.works_alone ? "Yes" : "No"}\n*Routes:* ${(d.common_routes || []).join(", ")}\n*Specialization:* ${specializationText}${otherActivitiesText}\n*ID/Passport Photo:* ${d.documents?.id_passport?.length ? "✅" : "❌"}\n*License Photo:* ${d.documents?.license?.length ? "✅" : "❌"}\n\nReply 'submit' to submit, or 'edit' to change any info.`;

  await sendText({ phone: msg.phone, text: summary });
  return state;
}
