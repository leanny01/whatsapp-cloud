import driver_menu from "./steps/driver_menu.js";
import awaiting_name from "./steps/awaiting_name.js";
import awaiting_phone from "./steps/awaiting_phone.js";
import awaiting_call_number from "./steps/awaiting_call_number.js";
import awaiting_address from "./steps/awaiting_address.js";
import awaiting_license from "./steps/awaiting_license.js";
import awaiting_vehicle from "./steps/awaiting_vehicle.js";
import awaiting_vehicle_body_type from "./steps/awaiting_vehicle_body_type.js";
import awaiting_vehicle_capacity from "./steps/awaiting_vehicle_capacity.js";
import awaiting_vehicle_type_final from "./steps/awaiting_vehicle_type_final.js";
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
import { withQuitSupport } from "../../lib/stateUtils.js";

const handlers = {
  driver_menu, // No quit support for driver menu (it's a sub-menu)
  awaiting_name: withQuitSupport(awaiting_name),
  awaiting_phone: withQuitSupport(awaiting_phone),
  awaiting_call_number: withQuitSupport(awaiting_call_number),
  awaiting_address: withQuitSupport(awaiting_address),
  awaiting_license: withQuitSupport(awaiting_license),
  awaiting_vehicle: withQuitSupport(awaiting_vehicle),
  awaiting_vehicle_body_type: withQuitSupport(awaiting_vehicle_body_type),
  awaiting_vehicle_capacity: withQuitSupport(awaiting_vehicle_capacity),
  awaiting_vehicle_type_final: withQuitSupport(awaiting_vehicle_type_final),
  awaiting_ownership: withQuitSupport(awaiting_ownership),
  awaiting_company_registration: withQuitSupport(awaiting_company_registration),
  awaiting_company_name: withQuitSupport(awaiting_company_name),
  awaiting_vehicle_photos: withQuitSupport(awaiting_vehicle_photos),
  awaiting_more_vehicles: withQuitSupport(awaiting_more_vehicles),
  awaiting_experience: withQuitSupport(awaiting_experience),
  awaiting_team: withQuitSupport(awaiting_team),
  awaiting_routes: withQuitSupport(awaiting_routes),
  awaiting_specialization: withQuitSupport(awaiting_specialization),
  awaiting_other_activities: withQuitSupport(awaiting_other_activities),
  awaiting_id_photo: withQuitSupport(awaiting_id_photo),
  awaiting_license_photo: withQuitSupport(awaiting_license_photo),
  review_driver: withQuitSupport(review_driver),
  driver_submitted: withQuitSupport(driver_submitted),
  driver_status: withQuitSupport(driver_status),
  driver_status_menu: withQuitSupport(driver_status_menu),
};

export function getDriverStepHandler(step) {
  return handlers[step] || handlers["driver_menu"];
}
