import { configureStore } from "@reduxjs/toolkit";
import loader from "../features/loader";
import label from "../features/label";
import modal from "../features/modal";
import toast from "../features/toast";
import handler from "../features/handler";
import preference from "../features/preference";
import menu from "../features/menu";
import year from "../features/year";
import version from "../features/version";
import module from "../features/module";
import month from "../features/month";

export default configureStore({
  reducer: {
    loader: loader,
    modal: modal,
    toast: toast,
    label: label,
    handler: handler,
    menu: menu,
    preference: preference,
    year: year,
    version: version,
    module: module,
    month: month,
  },
});
