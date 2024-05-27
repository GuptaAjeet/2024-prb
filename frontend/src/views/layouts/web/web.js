import React, { Fragment } from "react";
import { Loader, Toast } from "../../../apps/components/elements";
// import LImg2 from "../../../public/web/images/login-img-left.png";
import LImg2 from "../../../public/web/images/prabandh-login-img.svg";
// import Emblem from "../../../public/web/images/emblem-school-white.svg";
import Emblem from "../../../public/web/images/emblem_prabandh.svg";
import BPencil from "../../../public/web/images/pencil-bg.svg";
import { Link } from "react-router-dom";
// import NavBar from "./nav-bar";
import "../../../public/web/css/login.css";
import "./App.css";

const Layout = (props) => {
  return (
    <Fragment>
      <div className="login-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-5 col-lg-5 col-sm-6 p-0 login-bg">
              <div className="login-head pt-4 ">
                <Link to="https://dsel.education.gov.in/" target="_blank">
                  <img src={Emblem} className="logo-left" alt="dsel education gov link" />
                </Link>
              </div>
              <div className="login-content">
                <h2>{props?.attr?.title}</h2>
                <h1>PRABANDH</h1>
                {/* <h3>A school Programme</h3> */}
              </div>
              <div className="text-center">
                <img src={LImg2} className="login-img" alt="login" />
              </div>
            </div>
            <div className="col-xl-7 col-lg-7 col-sm-6 p-0 login-right position-relative">
              {/* <Link to="/" className="text-primary back-to-home">
                                <strong><i className="fa-solid fa-arrow-left"></i> Back to Home</strong> 
                            </Link> */}

              <div className="login-head pt-4 text-end">
                {/* <Link to="/"><img src={VLogo} className="logo-right" /></Link> */}
              </div>
              {/* <NavBar size={props.size}/> */}
              <div className="login-form">
                <div
                  className={`login-cnt ${props?.attr?.flag === "register" && "v-register"
                    }`}
                >
                  <Loader />
                  {props.children}
                  <Toast />
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src={BPencil} className="pencil-bg" alt="pencil" />
      </div>
    </Fragment>
  );
};

export default Layout;
