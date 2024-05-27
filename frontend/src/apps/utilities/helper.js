import React from "react";
import { format } from "date-fns";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { APP_ENVIRONMENT, SELECT_APPLICATION } from "../../env";
import Decimal from "decimal.js";

const token = () => {
  return sessionStorage.getItem("token");
};

const login = () => {
  return localStorage.getItem("login");
};

const location = () => {
  const uri = window.location.href;
  return uri;
};

const reAuth = () => {
  if (token() !== null && token() !== undefined) {
    return jwt_decode(token());
  } else {
    return null;
  }
};

const auth = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : token() !== null && token() !== undefined ? jwt_decode(token()) : "";
// const auth = token() !== null && token() !== undefined ? jwt_decode(token()) : JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : "";

const isLoggedIn = login() !== null && login() !== undefined && token() !== null && token() !== undefined ? login() : "false";

const storeToken = async (result) => {
  localStorage.setItem("loginTime", new Date().getTime());
  if (!SELECT_APPLICATION) {
    localStorage.setItem("login", true);
  }
  localStorage.setItem("progress_month", 1);
  localStorage.setItem("diet_progress_month", 1);
  sessionStorage.setItem("token", result.token);
  let userData = JSON.parse(atob(result.token.split(".")[1]));
  if (+userData.user.user_role_id == 16) {
    userData.user.user_role_id = +userData.user.user_roles.split(",")[0] === 16 ? +userData.user.user_roles.split(",")[1] : +userData.user.user_roles.split(",")[0];
  }
  localStorage.setItem("userData", JSON.stringify(userData));
  localStorage.setItem("APP_ENVIRONMENT", APP_ENVIRONMENT);
};

const countWords = (str) => {
  const arr = str.split(" ");
  return arr.filter((word) => word !== "").length;
};

const dateFormate = (date, formatType = "dd-MM-yyyy") => {
  return format(new Date(date), formatType);
};

const dateFormateInYmd = (date, formatType = "yyyy-MM-dd") => {
  return format(new Date(date), formatType);
};

const dateDMY = (string) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(string).toLocaleDateString("en-US", options);
};

const dateTime = (time) => {
  return format(new Date(time), "HH:mm:ss p");
};

const counter = (i, perpage, page) => {
  const index = page === 1 ? i++ : perpage * (page - 1) + i;
  return <div className="text-left">{index}.</div>;
};

const districtFilter = (options, state) => {
  if (options.length > 0) {
    if (state > 0) {
      return options
        .filter((item) => +item.district_state_id === +state)
        .map((item) => ({ id: item.district_id, name: item.district_name }));
    }
    return [];
  }
};

const subCatFilter = (options, catid) => {
  if (options.length > 0) {
    if (catid > 0) {
      return options.filter((item) => item.activity_category_id === +catid);
    }
    return [];
  }
};

const subCatAssetsFilter = (options, catid) => {
  if (options.length > 0) {
    if (catid > 0) {
      return options.filter((item) => +item.asset_category_id === +catid);
    }
    return [];
  }
};

const unitFilter = (options, id) => {
  if (options.length > 0) {
    if (id > 0) {
      return options.filter((item) => +item.id === +id);
    }
    return [];
  }
};

const roleFilter = (options, roles) => {
  if (options?.length > 0) {
    if (roles?.length > 0) {
      return options?.filter((item) => roles?.includes(+item.id));
    }
    return [];
  }
};

const contoryFilter = (options, country_id) => {
  if (options.length > 0) {
    if (country_id > 0) {
      return options.filter((item) => item.id === +country_id);
    }
    return [];
  }
};

const genderFilter = (options, gen_id) => {
  if (options.length > 0) {
    if (gen_id > 0) {
      return options.filter((item) => item.id !== +gen_id);
    }
    return [];
  }
};

const adminRoleFilter = (options, role_id) => {
  if (options !== undefined && options !== null && options.length > 0) {
    if (role_id > 0) {
      return options.filter((item) => item.id === 2 || item.id === 3);
    }
    return [];
  }
};

const blockFilter = (options, state, district) => {
  if (options.length > 0) {
    if (district > 0) {
      return options.filter(
        (item) =>
          item.block_state_id === +state && item.block_district_id === +district
      );
    }
    return [];
  }
};

const dropHandler = (e) => {
  e.preventDefault();
  return false;
};

const pasteHandler = (e) => {
  e.preventDefault();
  return false;
};

const startTimer = (duration, setSTimer) => {
  var timer = duration,
    minutes,
    seconds;
  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  setSTimer(minutes + ":" + seconds);
};

const AddScript = (urlOfTheLibrary) => {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = true;
  script.type = "text/javascript";
  document.body.appendChild(script);
};

const resetForm = (setSeed, form, errors, values) => {
  setSeed(Math.random());
  form.disable = true;
  Object.keys(values).map((key) => {
    errors[key].message = "";
    errors[key].valid = true;
  });
};

const random = (setSeed, form, errors) => {
  return new Date().getTime();
};

const uniqueArray = (data) => {
  return data.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
};

const ucfirst = (string) => {
  return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

const fUpper = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const userDistrictFilter = (options, district_id) => {
  if (options.length > 0) {
    if (district_id > 0) {
      return options.filter((item) => item.id === +district_id);
    }
    return [];
  }
};

const stateFilter = (options, state_id) => {
  if (options.length > 0) {
    if (state_id > 0) {
      return options.filter((item) => item.id === +state_id);
    }
    return [];
  }
};

const designationFilter = (options, designation_id) => {
  if (options.length > 0) {
    if (designation_id > 0) {
      return options.filter((item) => item.id === +designation_id);
    }
    return [];
  }
};

const subOptionFilter = (options, majorComponent) => {
  if (options.length > 0) {
    if (majorComponent > 0) {
      return options
        .filter((item) => item.major_component_id === +majorComponent)
        .map((item) => ({ id: item.id, label: item.label }));
    }
    return [];
  }
};

const designationsFilter = (options, designations) => {
  if (options.length > 0) {
    if (designations.length > 0) {
      return options.filter((item) => designations.includes(+item.id));
    }
    return [];
  }
};

const whereObjSelector = (
  userData,
  roleBasedSearch = false,
  searchKey = ""
) => {
  let whereObj = {};

  switch (userData?.user_role_id) {
    case 1:
      whereObj = {
        key: "u.user_role_id",
        operator: ">",
        value: 0,
      };
      break;

    case 4:
      whereObj = {
        user_state_id: userData.user_state_id,
      };
      break;

    case 8:
      whereObj = {
        user_state_id: userData.user_state_id,
        user_district_id: userData.user_district_id,
      };
      break;

    default:
      whereObj = {
        key: "u.user_role_id",
        operator: ">",
        value: 20,
      };
      break;
  }

  if (roleBasedSearch) {
    whereObj.searchParams = {
      operator: "ILIKE",
      value: `${searchKey}%`,
      user_name: "u.user_name",
      user_email: "u.user_email",
      user_mobile: "u.user_mobile",
      role_name: "mr.role_name",
      state_name: "ms.state_name",
      district_name: "md.district_name",
    };
  }

  return whereObj;
};

const whereMasterObjSelector = (searchKey = "") => {
  let wheremasterObj = {};

  wheremasterObj = {
    value: `${searchKey}`,
  };

  return wheremasterObj;
};
const whereCategorySelector = (searchKey = "") => {
  let wherecategoryObj = {};

  wherecategoryObj = {
    value: `${searchKey}`,
  };

  return wherecategoryObj;
};
const whereMasterTypeObjSelector = (searchKey = "") => {
  let wheremasterObj = {};

  wheremasterObj = {
    value: `${searchKey}`,
  };

  return wheremasterObj;
};
const dashboardFilter = (searchKey = "") => {
  let wheredashboardObj = {};

  wheredashboardObj = {
    value: `${searchKey}`,
  };

  return wheredashboardObj;
};

const whereMasterUploadSelector = (searchKey = "") => {
  let wheremasterObj = {};

  wheremasterObj = {
    value: `${searchKey}`,
  };

  return wheremasterObj;
};

const simulationData = () => {
  try {
    const impersonate = localStorage.getItem("impersonate");
    if (impersonate !== null) {
      try {
        return JSON.parse(window.atob(impersonate));
      } catch (parseError) {
        return null;
      }
    } else {
      return null;
    }
  } catch (storageError) {
    return null;
  }
};

/* const numberFormatter = (value, decimalPlaces) => {
  if (isNaN(+value) || isNaN(+decimalPlaces)) {
    return 0;
  } else {
    return (
      Math.trunc(+value * Math.pow(10, +decimalPlaces)) /
      Math.pow(10, +decimalPlaces)
    );
  }
}; */

const numberFormatter = (value, decimalPlaces) => {
  if (isNaN(+value) || isNaN(+decimalPlaces)) {
    return 0;
  } else {
    const result = new Decimal(+value).times(
      new Decimal(1).pow(+decimalPlaces)
    );
    return result.toDecimalPlaces(+decimalPlaces).toString();
  }
};

const accountFormat = (value, decimalPlaces) => {
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: decimalPlaces,
  }).format(value);

  return formattedNumber;
};

const numberFormat = (value, decimalPlaces) => {
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    style: "decimal",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);

  return formattedNumber;
};

const unitCostCalculator = (
  physicalQuantity,
  unitCost,
  amountUnit = 100000
) => {
  if (isNaN(+physicalQuantity) || isNaN(+unitCost) || isNaN(+amountUnit)) {
    return 0;
  } else {
    return +unitCost * +physicalQuantity;
  }
};

const validateNumberInput = (e) => {
  if (["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key) || window.getSelection().toString() !== '') {
    return;
  }

  const currentInput = e.target.value;
  const decimalIndex = currentInput.indexOf(".");
  const hasDecimal = decimalIndex > -1;

  const isNumberOrDecimal =
    !isNaN(Number(e.key)) || (e.key === "." && !hasDecimal);

  if (!isNumberOrDecimal) {
    e.preventDefault();
    return;
  }

  if (currentInput.length === 10 && e.key !== "." && !hasDecimal) {
    e.preventDefault();
    return;
  }

  if (hasDecimal) {
    const decimalPart = currentInput.substring(decimalIndex + 1);
    if (decimalPart.length >= 5 && e.key !== "." && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }
  }

  if (decimalIndex > 10) {
    e.preventDefault();
    return;
  }
};


const validateUnitCostInput = (e) => {
  if (["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    return;
  }

  const currentInput = e.target.value;
  const decimalIndex = currentInput.indexOf(".");
  const hasDecimal = decimalIndex > -1;

  const isNumberOrDecimal =
    !isNaN(Number(e.key)) || (e.key === "." && !hasDecimal);

  if (!isNumberOrDecimal) {
    e.preventDefault();
    return;
  }

  if (currentInput.length === 6 && e.key !== "." && !hasDecimal) {
    e.preventDefault();
    return;
  }

  if (hasDecimal) {
    const decimalPart = currentInput.substring(decimalIndex + 1);
    if (decimalPart.length >= 5 && e.key !== "." && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }
  }

  if (decimalIndex > 10) {
    e.preventDefault();
    return;
  }
};

/* const validateNumberInput = (e, nonDecimalLength, decimalLength) => {
  if (
    ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    return;
  }

  const currentInput = e.target.value;
  const decimalIndex = currentInput.indexOf(".");

  const isNumberOrDecimal =
    !isNaN(Number(e.key)) || (e.key === "." && decimalIndex === -1);

  if (!isNumberOrDecimal) {
    e.preventDefault();
    return;
  }

  if (decimalIndex === -1 && currentInput.length > 9) {
    if (currentInput.length === 10) {
      if (e.key !== ".") {
        e.preventDefault();
        return;
      }
    } else {
      e.preventDefault();
      return;
    }
  }

  if (decimalIndex > -1) {
    const decimalPart = currentInput.substring(decimalIndex + 1);
    if (decimalPart.length >= 5) {
      e.preventDefault();
      return;
    }
  }
  if (decimalIndex > 10) {
    e.preventDefault();
    return;
  }
}; */

/* const validateNumberInput = (e, nonDecimalLength, decimalLength) => {
  if (
    ["Tab", "Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    return;
  }

  const currentInput = e.target.value;
  const decimalIndex = currentInput.indexOf(".");

  const isNumberOrDecimal =
    !isNaN(Number(e.key)) || (e.key === "." && decimalIndex === -1);

  if (!isNumberOrDecimal) {
    e.preventDefault();
    return;
  }

  if (decimalIndex > -1) {
    const digitsBeforeDecimal = currentInput.substring(0, decimalIndex);
    if (digitsBeforeDecimal.length >= 10) {
      e.preventDefault();
      return;
    }
  } else if (currentInput.length >= 10) {
    e.preventDefault();
    return;
  }

  if (decimalIndex > -1) {
    const decimalPart = currentInput.substring(decimalIndex + 1);
    if (decimalPart.length >= 5) {
      e.preventDefault();
    }
  }
}; */

const simulationAuth = localStorage.getItem("impersonate") ? JSON.parse(window.atob(localStorage.getItem("impersonate"))) : "";

const getRolesToAdd = (roleId, roles) => {
  if (+roleId > 0) {
    if (roles?.length > 0) {
      return roles?.filter((item) => (JSON.parse(item?.available_for)).includes(+roleId));
    }
    return [];
  }
};

const helper = {
  subCatFilter,
  adminRoleFilter,
  roleFilter,
  auth,
  whereMasterObjSelector,
  token,
  storeToken,
  countWords,
  counter,
  AddScript,
  districtFilter,
  blockFilter,
  dropHandler,
  pasteHandler,
  startTimer,
  resetForm,
  random,
  dateFormate,
  subCatAssetsFilter,
  pasteHandler,
  startTimer,
  resetForm,
  random,
  dateTime,
  genderFilter,
  dateDMY,
  reAuth,
  contoryFilter,
  uniqueArray,
  ucfirst,
  dateFormateInYmd,
  fUpper,
  unitFilter,
  stateFilter,
  userDistrictFilter,
  designationFilter,
  whereObjSelector,
  isLoggedIn,
  location,
  simulationData,
  subOptionFilter,
  designationsFilter,
  whereMasterUploadSelector,
  whereMasterTypeObjSelector,
  whereCategorySelector,
  numberFormatter,
  unitCostCalculator,
  validateNumberInput,
  dashboardFilter,
  simulationAuth,
  accountFormat,
  numberFormat,
  getRolesToAdd,
  validateUnitCostInput
};

export default helper;