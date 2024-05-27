import React, { lazy, Fragment, useState, useEffect } from "react";
import { Loader, Toast } from "../../../apps/components/elements";
import Footer from "./footer";
import Header from "./header";
import SideBar from "./sidebar";
import api from "../../../apps/utilities/api";
import { Helper } from "../../../apps";
import { useNavigate, useLocation } from "react-router-dom";
import { APP_ENVIRONMENT } from "../../../env";
import { useDispatch, useSelector } from "react-redux";
import Features from "../../../redux/features";

const TwoFactorAuth = lazy(() => import("../../admin/users/admin/twoFA"));

const Index = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [customPageModelSetting, setCustomPageModelSetting] = useState(location.pathname);

  const [schemesList, setSchemesList] = useState([]);
  const [majorComponentList, setMajorComponenetList] = useState({ schemeid: 0, data: [] });
  const [subComponentObj, setSubComponentObj] = useState({});
  const [userData, setUserData] = useState();
  const [twoFA, setTwoFA] = useState(false);
  const reduxObj = useSelector((state) => state.modal);

  useEffect(() => {
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
    });
    setUserData(Helper.auth?.user);
  }, []);

  useEffect(() => {
    if (+userData?.two_fa_enabled === 0) {
      setTwoFA(true);
      dispatch(Features.showModal({ title: "Set Two Factor Authentication" }));
    }
  }, [userData?.two_fa_enabled])

  const showMajorComponents = (uq) => {
    api.post("api/prabandh/major-components", { schemeid: uq }, (res) => {
      setMajorComponenetList({ schemeid: uq, data: res.data });
    });
  };

  const setActiveSubComponent = (scobj, schemeid) => {
    const a = JSON.stringify({ subComponent: scobj, schemeId: schemeid });
    localStorage.setItem("subcomponent_config", a);
    setSubComponentObj({ subComponent: scobj, schemeId: schemeid });
  };

  // const user = Helper.auth.user;
  const handleLogout = () => {
    // API.post("auth/user/logout", user.id, (result) => {
    //   if (result.status) {
    localStorage.clear();
    sessionStorage.clear();

    /*     localStorage.removeItem("login");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("impersonate");
    localStorage.removeItem("userData");
    localStorage.removeItem("states");
    localStorage.removeItem("roles");
    localStorage.removeItem("districts");
    localStorage.removeItem("designations");
    localStorage.removeItem("subcomponent_config");
    localStorage.removeItem("blocks");
    sessionStorage.removeItem("token");
    localStorage.setItem("label", "Admin Login"); */
    // localStorage.removeItem("menu");

    // window.location.reload();
    // window.location.href = '/';
    navigate("/admin-login");
    window.location.reload();
    //   }
    // })
  };

  const exitSimulation = () => {
    const oldUser = JSON.parse(localStorage.getItem("userData"));
    const simulateObj = JSON.parse(window.atob(localStorage.getItem("impersonate")));
    localStorage.setItem("userData", JSON.stringify({ ...oldUser, user: simulateObj.local.userData }));
    sessionStorage.setItem("token", simulateObj.session.token);
    localStorage.removeItem("impersonate");
    window.location.reload();
  };

  return (
    <Fragment>
      {APP_ENVIRONMENT === "testing" && (
        <div style={{ color: "red", background: "yellow", fontSize: "18px", zIndex: "99999", width: "100%", padding: "unset", margin: "unset" }}>
          <marquee behavior="alternate"> Prabandh: This environment is for testing purposes only. Do not use real data. </marquee>
        </div>
      )}
      <div className="main-container noselect" id="container">
        {customPageModelSetting !== "/auth/prabandh/schools/configure" && (
          <SideBar sl={schemesList} mcl={majorComponentList} smc={showMajorComponents} sasc={setActiveSubComponent} />
        )}

        <div id="content" className={`${customPageModelSetting !== "/auth/prabandh/schools/configure" ? "dashboard--remaining--width" : ""}`}>
          <div className={`${customPageModelSetting !== "/auth/prabandh/schools/configure" ? "dashboard-main--wrapper" : ""}`}>
            <Header logout={handleLogout} simulationClose={exitSimulation} />
            <Loader />
            {/*             {props.children} */}
            {reduxObj.view && twoFA && (<TwoFactorAuth role={+userData?.user_role_id} id={+userData?.id} username={userData?.user_name} dismissable="false" mobile={userData?.user_mobile} email={userData?.user_email} setTwoFA={setTwoFA} />)}
            <div>{React.cloneElement(props.children, subComponentObj)}</div>
          </div>
          <Footer />
        </div>
        <Toast />
      </div>
    </Fragment>
  );
};

export default Index;