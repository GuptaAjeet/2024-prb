import {
  showLoader,
  hideLoader,
  navReloader,
  listingReloader,
  reRender,
  logout,
} from "./loader";
import { showToast, hideToast } from "./toast";
import { showModal, hideModal } from "./modal";
import { getLabel, setLabel } from "./label";
import { makeHandler } from "./handler";
import { makepreferenceHandler } from "./preference";
import { setMenu, getMenu } from "./menu";
import { setYear, getYear } from "./year";
import { setModule, getModule } from "./module";
import { setVersion, getVersion } from "./version";
import { setMonth, getMonth } from "./month";
import { setDietMonth, getDietMonth } from "./dietMonth";

export default {
  showLoader,
  hideLoader,
  hideToast,
  hideModal,
  showToast,
  showModal,
  getLabel,
  setLabel,
  makeHandler,
  makepreferenceHandler,
  navReloader,
  listingReloader,
  reRender,
  logout,
  setMenu,
  getMenu,
  setYear,
  getYear,
  setModule,
  getModule,
  setVersion,
  getVersion,
  setMonth,
  getMonth,
  setDietMonth, 
  getDietMonth
};
