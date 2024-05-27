import React, { useEffect, useRef, useState } from "react";
import { Helper, Settings, API, Hook, Column } from "../../../apps";
import "../prabandh/spill.css";
import sweetAlert from "../../../apps/utilities/sweetalert";
import { subDays, format } from "date-fns";
//import Spinner from "../../../apps/components/elements/Spinner";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import store from "../../../redux/app/store";
import Btnloader from "../../../apps/components/elements/Btnloader";
import { useSelector } from "react-redux";

const SelectedYear = () => {
    const { year: defaultYear } = useSelector((state) => state.year);

    return <h6 style={{ color: "", background: "rgb(226, 160, 63)", margin: "auto", padding: "5px 10px", color: "white", fontSize: "18px", borderRadius: "5px" }}>
        {defaultYear}
    </h6>
};

export default SelectedYear;
