import main_menu from "./steps/main_menu.js";
import awaiting_from from "./steps/awaiting_from.js";
import awaiting_to from "./steps/awaiting_to.js";
import awaiting_date from "./steps/awaiting_date.js";
import awaiting_items from "./steps/awaiting_items.js";
import awaiting_more_items from "./steps/awaiting_more_items.js";
import review_quote from "./steps/review_quote.js";
import edit_menu from "./steps/edit_menu.js";
import edit_from from "./steps/edit_from.js";
import edit_to from "./steps/edit_to.js";
import edit_date from "./steps/edit_date.js";
import edit_items from "./steps/edit_items.js";
import cancel_confirm from "./steps/cancel_confirm.js";
import main_menu_confirm from "./steps/main_menu_confirm.js";
import quote_submitted_menu from "./steps/quote_submitted_menu.js";
import awaiting_feedback_comment from "./steps/awaiting_feedback_comment.js";
import quote_submitted_actions from "./steps/quote_submitted_actions.js";
import my_quotes_list from "./steps/my_quotes_list.js";

const handlers = {
  main_menu,
  awaiting_from,
  awaiting_to,
  awaiting_date,
  awaiting_items,
  awaiting_more_items,
  review_quote,
  edit_menu,
  edit_from,
  edit_to,
  edit_date,
  edit_items,
  cancel_confirm,
  main_menu_confirm,
  quote_submitted_menu,
  awaiting_feedback_comment,
  quote_submitted_actions,
  my_quotes_list,
};

export function getStepHandler(step) {
  if (!step || typeof step !== "string") {
    return handlers["main_menu"];
  }
  return handlers[step] || handlers["main_menu"];
}
