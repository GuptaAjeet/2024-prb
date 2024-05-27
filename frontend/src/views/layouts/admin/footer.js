import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Helper, Hook } from "../../../apps";
import { useSelector } from "react-redux";

import NText from "../../../apps/components/elements/nictext";
//import Nlogo from "../../../apps/components/elements/niclogo";
import VLogo from "../../../apps/components/elements/logo";
import { APP_ENVIRONMENT } from "../../../env";

const Footer = () => {
  const [STimer, setSTimer] = useState(0);
  const [logout, setLogout] = useState(false);
  const response = Hook.useLogout({ logout: logout });
  const sessionTime = Hook.useAutoLogout();
  const object = useSelector((state) => state.label);

  useEffect(() => {
    Helper.startTimer(sessionTime, setSTimer);

    if (response) {
      const title = "Admin Login";
      localStorage.setItem("label", title);
      window.location.href = (APP_ENVIRONMENT==="testing" ? "/testing" : "") +"/";
    }

    if (sessionTime === 0) {
      setLogout(true);
    }
  }, [response, sessionTime, object]);

  return (
    <div
      className="dashboard-footer d-flex justify-content-between align-items-center"
    >
      <div className="footer-section f-section-2 pt-2">
        <NText flag={1} />
      </div>
      <VLogo />
    </div>
  );
};

export default Footer;
