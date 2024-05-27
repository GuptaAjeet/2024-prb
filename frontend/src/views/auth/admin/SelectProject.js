import React, { useEffect, useRef, useState } from "react";
import { Hook, Form, API, Helper } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import { Link} from "react-router-dom";
import { encrypt } from "../../../apps/utilities/hash";
import { APP_ENVIRONMENT, SCHOOL_LOGIN } from "../../../env";
import axios from "axios";
const CryptoJS  =   require("crypto-js");

const SelectProject = () => {

  const application = useRef();
  const [alerts, setAlerts] = useState({ message: "", class: "danger" });

  const loginHandler = async  (e) => {

  }

  return (
    <div className="row ">
      
      <Link to="/" className="pointer forgot-pass-link text-primary">
          <h6 title="Go to homepage" className="text-primary p-3 back-to-home">
            <i className="bi bi-arrow-left me-2"></i>Back to home
          </h6>
      </Link>

      <div className="shadow-lg bg-body col-xl-4 col-lg-5 col-md-6 col-sm-10 rounded text-center mt-5">
        <div className="pt-5 pb-2 ">
          <Alert alert={alerts} />
          <div className="d-flex justify-content-around">
            <h1 className="sec-title title-login">Select Application</h1>

            <button
              className={`btn btn-primary`}
              onClick={()=>{
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              role="school"
              style={{width:"auto",  height: "47px"}}
            >
              <i className="bi bi-power text-danger"></i> Logout
            </button>
          </div>
          
          
          {/* <p>Log in to your account to continue.</p> */}
          <div className="text-start d-flex justify-content-center">
            <div className="form1 px-3 login-width">
              
              <div
                id="email-field"
                className={`field-wrapper input mb-3`}
              >
                <select className="form-control" name="application" ref={application}>
                  <option value="0">Select</option>
                  <option value="prabandh">Prabandh</option>
                  <option value="pmshri">PMShri</option>
                </select>
              </div>

              <div className="text-center mt-4">
                <div className="field-wrapper">
                  
                  <Form.Button
                    button={{
                      type: "button",
                      // disabled: (form.disable || currentCaptcha!==captcha?.current?.value),
                      onClick: (e)=>{
                        localStorage.setItem("login", true);
                        localStorage.setItem("application", application?.current?.value);
                        if (application?.current?.value!=="0") {alert()
                          localStorage.setItem("label", "Dashboard");
                          window.location.href =
                            (APP_ENVIRONMENT === "testing" ? "/testing" : "") + `${localStorage.getItem("application")!=="prabandh" ? `/${localStorage.getItem("application")}` : ""}` + "/auth/admin";
                        }else{
                          setAlerts({message: "Please Select Application!", class: "danger" });
                        }
                      },
                    }}
                    className={`btn btn-primary float-end`}
                  >
                    Continue
                  </Form.Button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center" style={{ color: "rgb(255 108 0)" }}>

      </div>
    </div>
  );
};

export default SelectProject;
