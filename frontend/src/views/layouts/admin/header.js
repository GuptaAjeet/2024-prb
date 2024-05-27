import React, { Fragment, useState } from "react";
import "./App.css";
import { Helper, Hook } from "../../../apps";
import emblem from "../../../public/images/emblem.png";
import { useDispatch, useSelector } from "react-redux";
import { APP_ENVIRONMENT } from "../../../env";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "./Notification";

// const View = lazy(() => import("../../admin/users/admin/operate"));
// const UpdatePass = lazy(() => import("../../admin/users/admin/updatePass"));

const Header = (props) => {
  const navigator = useNavigate();
  const location = useLocation();
  const { logout, simulationClose } = props;
  const user = Helper.auth.user;
  const auth = Helper.auth;
  const DeOption = Hook.useDesignations();
  const roles = Hook.useRoles();
  // const dispatch = useDispatch();
  // const handler = useSelector((state) => state.handler);
  // const model = useSelector((state) => state.modal);
  // const reduxObj = useSelector((state) => state.modal);
  const { year: defaultYear } = useSelector((state) => state.year);
  const { module } = useSelector((state) => state.module);
  // const { version: defaultVersion } = useSelector((state) => state.version);

  const [, setId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [, setUserRoleId] = useState();
  const [, setUpdateUser] = useState(false);
  // const [changePass, setChangePass] = useState(false);

  var areaDataString;
  var userDesignation;
  var userRole;

  let impersonate = null;
  if (localStorage.getItem("impersonate") !== null) {
    impersonate = JSON.parse(window.atob(localStorage.getItem("impersonate")))
      ?.session?.token;
  }

  if (user !== null && user !== undefined && Object.keys(user).length > 0) {
    if (DeOption !== null) {
      let designations = Helper.designationFilter(
        DeOption,
        user.designation_code
      );
      userDesignation =
        designations && designations.length > 0
          ? "- " +
            Helper.designationFilter(DeOption, user.designation_code)[0].name
          : "";
    }

    if (roles !== null) {
      userRole = Helper.roleFilter(roles, [user.user_role_id])[0]?.name;
    }
    areaDataString =
      user.state_name !== "" && user.state_name !== null
        ? `State : ${user.state_name}`
        : "";
    areaDataString =
      areaDataString !== "" &&
      user.district_name !== "" &&
      user.district_name !== null
        ? `${areaDataString} District : ${user.district_name}`
        : areaDataString;
  }

  const userAreaLabel = () => {
    var areaSt = "";
    var areaDt = "";
    areaSt =
      user.state_name !== "" && user.state_name !== null ? user.state_name : "";
    areaDt = user.district_name;

    return (
      <Fragment>
        {areaSt !== "" && (
          <div
            className="alert alert-light"
            role="alert"
            style={{
              padding: "0.3rem 0.6rem 0.3rem 0.6rem",
              fontWeight: "bolder",
              lineHeight: 1,
            }}
          >
            <table>
              <tbody>
                {areaSt && (
                  <tr>
                    <td>State:</td>
                    <td>
                      <b>{areaSt}</b>
                    </td>
                  </tr>
                )}
                {areaDt && (
                  <tr>
                    <td>District:</td>
                    <td>
                      <b>{areaDt}</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Fragment>
    );
  };

  const simulateAction = (role_id) => {
    auth.user.user_role_id = +role_id;
    localStorage.setItem("userData", JSON.stringify(auth));
    window.location.href =
      (APP_ENVIRONMENT === "testing" ? "/testing" : "") + "/auth/admin";
  };

  // const changePassClick = () => {
  //   setChangePass(true);
  //   dispatch(features.showModal({ title: "Change Password" }));
  // }

  // const changeBaseYear = (e) => {
  //   const yr = e.target.value;
  //   sweetAlert.confirmation({
  //     title: "Are you sure?",
  //     msg: `Do you really want to change year to ${yr}`,
  //     yesBtnText: "Yes",
  //     noBtnText: "No",
  //     url: "",
  //     callback: () => {
  //       dispatch(features.setYear({ year: yr }));
  //       setTimeout(() => {
  //         navigator(`/auth/admin`);
  //       }, 200);
  //     },
  //     redirect: "",
  //   });
  // }

  // const handleClosePassword = () => {
  //   setUpdateUser(false);
  //   setChangePass(false);
  // }

  return (
    <>
      <div className="header-top d-none">
        <div className="container-flued d-flex align-items-center justify-content-between">
          <ul className="list-unstyled d-flex align-items-center mb-0 left-list mob-header">
            <li>
              <a
                href="https://www.india.gov.in"
                target="blank"
                className="text-black"
              >
                भारत सरकार
                <span>Government of India</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.education.gov.in/"
                target="blank"
                className="text-black"
              >
                शिक्षा मंत्रालय<span>Ministry of Education</span>
              </a>
            </li>
          </ul>
          <ul className="list-unstyled d-flex align-items-center mb-0 me-3">
            <li className="d-none d-lg-block">
              <Link to="/" className="text-black">
                <i className="bi bi-house"></i>Home
              </Link>
            </li>
            <li className="d-none d-lg-block">
              {/* <a className="text-black"> */}
              <i className="bi bi-arrow-down"></i>Skip To Navigation
              {/* </a> */}
            </li>

            <li className="d-none d-lg-block">
              {/* <a className="text-black"> */}
              <i className="bi bi-arrow-down"></i>Skip To Main Content
              {/* </a> */}
            </li>

            <li className="d-none d-lg-block">
              {/* <a className="text-black"> */}
              <i className="bi bi-volume-down"></i>
              Screen Reader Access
              {/* </a> */}
            </li>
          </ul>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="dashboard-header--image ">
          <a href="https://dsel.education.gov.in/" target="blank">
            {" "}
            <img
              src={emblem}
              alt="logo"
              className="image-fluid"
              style={{ maxWidth: "65%" }}
            />
          </a>

          <button
            className="btn-primary mobile-icon"
            onClick={() => setShowMenu(!showMenu)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className={`mobile-menu ${showMenu ? "" : "menu-right"}`}>
          <div className="dashboard-header--info ">
            {!!user?.id && (
              <>
                <div className="dashboard-header--helloo me-2">
                  <div className="alert alert-warning" role="alert">
                    <p>PRABANDH OF {defaultYear}</p>
                  </div>
                </div>
                <div className="dashboard-header--helloo me-2">
                  <div
                    className="alert alert-warning"
                    role="alert"
                    style={{
                      backgroundColor: "#e2a03f",
                      borderColor: "#e2a03f",
                    }}
                  >
                    <p> {module ? module.toUpperCase() : "PLAN"} MODULE</p>
                  </div>
                </div>
                <div className="dashboard-header--helloo me-2">
                  {userAreaLabel()}
                </div>
                {user?.user_roles && (
                  <div className="top-form">
                    <select
                      className="form-select me-2 wth-130"
                      value={user?.user_role_id}
                      onChange={(e) => {
                        simulateAction(e.target.value);
                      }}
                    >
                      {roles?.map((role) => {
                        if (
                          user?.user_roles
                            ?.split(",")
                            .map(Number)
                            .indexOf(role.id) > -1
                        ) {
                          return (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          );
                        }
                      })}
                      {[2206, 3202, 2206, 3172, 3174].includes(+user?.id) && (
                        <option key="25" value="25">
                          National DIET User
                        </option>
                      )}
                    </select>                   
                  </div>
                )}
                <div
                  className="dashboard-header--notification ms-3"
                  title="Click here to update profile"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user.udise_sch_code) {
                      setId(user.id);
                      setUserRoleId(user.user_role_id);
                      navigator("/auth/admin/users", {
                        state: {
                          id: user.id,
                          userRoleId: user.user_role_id,
                          prevPath: location.pathname,
                        },
                      });
                      setUpdateUser(true);
                    }
                  }}
                  style={{
                    background: "#042a61",
                    color: "white",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  {user?.user_name
                    ?.split(" ")
                    ?.map((word) => word[0])
                    .join("")}
                  {/* <i className="bi bi-person" /> */}
                </div>
                <div className="dashboard-header--details">
                  <p className="dashboard-header--hello">
                    Welcome
                    <Notification />
                  </p>
                  <p className="dashboard-header--name">{user?.user_name}</p>

                  <div className="dashboard-top--header__dropdown">
                    <div className="dropdown">
                      {userRole}
                      {/* {userDesignation} */}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="dashboard-header--logo text-center logout_hover_class">
              {/* <a href="#"> */}
              <div>
                {impersonate === null ? (
                  <span
                    onClick={logout}
                    style={{
                      color: "red",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    {/* ❌<i className="bi bi-box-arrow-right"></i> */}
                    <i className="bi bi-power" style={{ fontSize: "20px" }}></i>
                    <div className="text-black">Logout</div>
                  </span>
                ) : (
                  <span
                    onClick={simulationClose}
                    style={{
                      color: "red",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    ❌{/* <i className="bi bi-box-arrow-right"></i> */}
                    <div className="text-black">Exit Simulation</div>
                  </span>
                )}
              </div>
              {/* </a> */}
            </div>
          </div>
        </div>
      </div>
      {/* {reduxObj.view && updateUser && (
        <Modal>
          {!changePass ? (
            <View btntext={"Update Profile"} role={+userRoleId} id={+id} close={() => setUpdateUser(false)} changePass={changePassClick} />
          ) : (
            <UpdatePass btntext={"Change Password"} role={+userRoleId} id={+id} close={handleClosePassword} />
          )}
        </Modal>
      )} */}
    </>
  );
};

export default Header;
