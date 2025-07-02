import driver_menu from "./steps/driver_menu.js";
import awaiting_name from "./steps/awaiting_name.js";
import awaiting_phone from "./steps/awaiting_phone.js";
import awaiting_call_number from "./steps/awaiting_call_number.js";
import awaiting_address from "./steps/awaiting_address.js";
import awaiting_license from "./steps/awaiting_license.js";
import awaiting_vehicle from "./steps/awaiting_vehicle.js";
import awaiting_ownership from "./steps/awaiting_ownership.js";
import awaiting_company_registration from "./steps/awaiting_company_registration.js";
import awaiting_company_name from "./steps/awaiting_company_name.js";
import awaiting_vehicle_photos from "./steps/awaiting_vehicle_photos.js";
import awaiting_more_vehicles from "./steps/awaiting_more_vehicles.js";
import awaiting_experience from "./steps/awaiting_experience.js";
import awaiting_team from "./steps/awaiting_team.js";
import awaiting_routes from "./steps/awaiting_routes.js";
import awaiting_specialization from "./steps/awaiting_specialization.js";
import awaiting_other_activities from "./steps/awaiting_other_activities.js";
import awaiting_id_photo from "./steps/awaiting_id_photo.js";
import awaiting_license_photo from "./steps/awaiting_license_photo.js";
import review_driver from "./steps/review_driver.js";
import driver_submitted from "./steps/driver_submitted.js";
import driver_status from "./steps/driver_status.js";
import driver_status_menu from "./steps/driver_status_menu.js";

const handlers = {
  driver_menu,
  awaiting_name,
  awaiting_phone,
  awaiting_call_number,
  awaiting_address,
  awaiting_license,
  awaiting_vehicle,
  awaiting_ownership,
  awaiting_company_registration,
  awaiting_company_name,
  awaiting_vehicle_photos,
  awaiting_more_vehicles,
  awaiting_experience,
  awaiting_team,
  awaiting_routes,
  awaiting_specialization,
  awaiting_other_activities,
  awaiting_id_photo,
  awaiting_license_photo,
  review_driver,
  driver_submitted,
  driver_status,
  driver_status_menu,
};

export function getDriverStepHandler(step) {
  return handlers[step] || handlers["driver_menu"];
}
