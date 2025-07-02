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
import view_recent_quote from "./steps/view_recent_quote.js";
import view_recent_quote_actions from "./steps/view_recent_quote_actions.js";
import { withQuitSupport } from "../../lib/stateUtils.js";

const handlers = {
  main_menu, // No quit support for main menu (it's the exit destination)
  awaiting_from: withQuitSupport(awaiting_from),
  awaiting_to: withQuitSupport(awaiting_to),
  awaiting_date: withQuitSupport(awaiting_date),
  awaiting_items: withQuitSupport(awaiting_items),
  awaiting_more_items: withQuitSupport(awaiting_more_items),
  review_quote: withQuitSupport(review_quote),
  edit_menu: withQuitSupport(edit_menu),
  edit_from: withQuitSupport(edit_from),
  edit_to: withQuitSupport(edit_to),
  edit_date: withQuitSupport(edit_date),
  edit_items: withQuitSupport(edit_items),
  cancel_confirm: withQuitSupport(cancel_confirm),
  main_menu_confirm: withQuitSupport(main_menu_confirm),
  quote_submitted_menu: withQuitSupport(quote_submitted_menu),
  awaiting_feedback_comment: withQuitSupport(awaiting_feedback_comment),
  quote_submitted_actions: withQuitSupport(quote_submitted_actions),
  my_quotes_list: withQuitSupport(my_quotes_list),
  view_recent_quote: withQuitSupport(view_recent_quote),
  view_recent_quote_actions: withQuitSupport(view_recent_quote_actions),
};

export function getStepHandler(step) {
  if (!step || typeof step !== "string") {
    return handlers["main_menu"];
  }
  return handlers[step] || handlers["main_menu"];
}
