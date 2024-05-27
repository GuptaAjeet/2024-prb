import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API, Form, Helper, Hook } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";

const AdminLogin = (props) => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const otp = useRef();
  const email = useRef();
  const captcha = useRef();
  const mobile = useRef();
  const udise = useRef();
  const [show, setShow] = useState(true);
  const [timer, setTimer] = useState();
  const [sendOTP, setSendOTP] = useState(false);
  const [subBtn, setSubBtn] = useState(true);
  const [reloadCap, setReloadCap] = useState(null);
  const [fSubmit, setFSubmit] = useState(false);
  const [alerts, setAlerts] = useState({ message: "", class: "danger" });
  const [fInputs, setFInputs] = useState([email, mobile, captcha]);
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);
  const [currentCaptcha, setToPerantCaptcha] = useState(null);
 
  const location = useLocation();
  const flag = location.pathname.split("-")[0].replace("/", "");

  useEffect(() => {
    if (flag !== "school") {
      setFInputs([email, mobile, captcha]);
    } else {
      setFInputs([udise, captcha]);
    }
    //setFlag(props.option);
  }, [values, reloadCap]);

  const userValidateHandler = () => {
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    setFSubmit(true);
    const data = {
      flag: flag.toLowerCase(),
      email: email.current.value,
      mobile: mobile.current.value,
      captcha: captcha.current.value,
      udise: udise.current.value,
      otc: captcha.current.otc,
    };
    setAlerts({ ...alerts, message: "" });
    API.post("auth/password/validate/user", data, (result) => {
      if (result.status) {
        startTimer(120);
        setShow(!show);
        setFInputs([otp]);
        setTimeout(() => {
          otp.current.ots = result.ots;
          otp.current.token = result.token;
          setAlerts({ ...alerts, message: result.message, class: "success" });
        }, 50);
      } else {
        setReloadCap(Helper.random());
        setAlerts({ ...alerts, message: result.message, class: "danger" });
        form.disable = true;
        if (result.captcha) {
          captcha.current.value = "";
        } else {
          captcha.current.value = "";
          if (flag !== "school") {
            mobile.current.value = "";
            email.current.value = "";
          } else {
            udise.current.value = "";
          }
        }
      }
      setTimeout(() => {
        setFSubmit(false);
        dispatch(Features.hideLoader({ show: "", display: "none" }));
      }, 100);
    });
  };

  const sendOTPHandler = () => {
    setSubBtn(true);
    form.disable = true;
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    setFSubmit(true);
    const data = { mobile: mobile.current.value, udise: udise.current.value };
    setAlerts({ ...alerts, message: "" });
    setSendOTP(false);
    API.post("auth/password/resend/otp", data, (result) => {
      if (result.status) {
        startTimer(120);
        if (errors.otp !== undefined) {
          errors.otp.valid = false;
        }
        otp.current.disabled = false;
        // setTimeout(() => {
        //     setSendOTP(false);
        //     setSubBtn(true)
        // }, 1000);
        setAlerts({ ...alerts, message: result.message, class: "success" });
      } else {
        setReloadCap(Helper.random());
        setAlerts({ ...alerts, message: result.message, class: "danger" });
        form.disable = true;
        otp.current.value = "";
      }
      setTimeout(() => {
        setFSubmit(false);
        dispatch(Features.hideLoader({ show: "", display: "none" }));
      }, 100);
    });
  };

  const otpValidateHandler = () => {
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    setFSubmit(true);
    const data = { ots: otp.current.ots, otp: otp.current.value };
    setAlerts({ ...alerts, message: "" });
    API.post("auth/password/validate/otp", data, (result) => {
      if (result.status) {
        // const title = `Reset Password`;
        // localStorage.setItem('label',title);
        // dispatch(Features.setLabel({title:title}));
        // localStorage.setItem('resetToken',otp.current.token);
        navigator(`/${flag}-reset-password/${otp.current.token}`);
      } else {
        setAlerts({ ...alerts, message: result.message, class: "danger" });
        form.disable = true;
        otp.current.value = "";
      }
      setTimeout(() => {
        setFSubmit(false);
        dispatch(Features.hideLoader({ show: "", display: "none" }));
      }, 100);
    });
  };

  const startTimer = (duration) => {
    var timer = duration,
      minutes,
      seconds;
    setInterval(function () {
      if (timer > 0) {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? 0 + minutes : minutes;
        seconds = seconds < 10 ? 0 + seconds : seconds;
        setTimer(minutes + ":" + seconds);
        if (--timer === 0) {
          if (errors.otp !== undefined) {
            errors.otp.valid = true;
          }
          clearInterval(timer);
          timer = 0;
          otp.current.value = "";
          otp.current.disabled = true;
          captcha.current.value = "";
          setReloadCap(Helper.random());
          setSendOTP(true);
          setSubBtn(false);
          setAlerts({ ...alerts, message: "", class: "" });
        }
      }
    }, 1000);
  };

  const submitHandler = show ? userValidateHandler : otpValidateHandler;

  return (
    <div className="row justify-content-center">
      <div className="shadow-lg bg-body col-xl-4 col-lg-5 col-md-6 col-sm-10 rounded  mt-5  mt-5 mb-5">
        <div className="pt-5 pb-5">
          <div className="text-start mt-3">
            <div className="form p-3">
              <h2 className="text-primary text-center mb-4 sec-title title-login">
                Forgot Password?
              </h2>
              <p className="text-center bg-light p-2">
                Reset your password.
                {/* <strong className="text-primary"></strong> */}
              </p>
              <Alert alert={alerts} />
              <div className={`${show ? "" : "d-none"}`}>
                <div className={`${flag !== "school" ? "" : "d-none"}`}>
                  <div id="email-field" className="field-wrapper input mb-3">
                    <Form.Email
                      attr={{
                        ref: email,
                        id: "email",
                        name: "email",
                        onChange: handleChange,
                        onFocus: handleChange,
                      }}
                      label="Email ID"
                      error={errors.email}
                      mandatory={true}
                    />
                  </div>
                  <div id="email-field" className="field-wrapper input mb-3">
                    <Form.Mobile
                      attr={{
                        ref: mobile,
                        id: "mobile",
                        name: "mobile",
                        onChange: handleChange,
                        onFocus: handleChange,
                      }}
                      label="Mobile number"
                      error={errors.mobile}
                      mandatory={true}
                    />
                  </div>
                </div>
                <div
                  id="email-field"
                  className={`field-wrapper input mb-3 ${
                    flag === "school" ? "" : "d-none"
                  }`}
                >
                  <Form.Udise
                    attr={{
                      ref: udise,
                      id: "udise",
                      name: "udise",
                      onChange: handleChange,
                      onFocus: handleChange,
                    }}
                    label="Udise Code"
                    error={errors.udise}
                    mandatory={true}
                  />
                </div>
                <div id="email-field" className={`field-wrapper input mb-3`}>
                  <Form.Captcha
                    attr={{
                      ref: captcha,
                      id: "captcha",
                      name: "captcha",
                      onChange: handleChange,
                      onFocus: handleChange,
                      otc: "",
                      token: "",
                    }}
                    setToPerantCaptcha={setToPerantCaptcha}
                    reloadCap={reloadCap}
                    error={errors.captcha}
                  />
                </div>
              </div>
              <div
                id="otp-field"
                className={`field-wrapper input mb-3 ${!show ? "" : "d-none"}`}
              >
                <Form.Password
                  attr={{
                    ref: otp,
                    id: "otp",
                    name: "otp",
                    maxLength: "6",
                    onChange: handleChange,
                    onFocus: handleChange,
                    ots: "",
                    type: "password",
                  }}
                  show={false}
                  label="OTP"
                  error={errors.otp}
                  mandatory={true}
                />
                {!sendOTP && (
                  <p className="text-success">
                    OTP valid time{" "}
                    {
                      <span className="forgot-pass-link text-primary float-end">
                        {timer}
                      </span>
                    }
                  </p>
                )}
              </div>
              <div className="mt-3">
                <div className="row p-1">
                  <div className="col-md-12">
                    {subBtn && (
                      <Form.Button
                        button={{
                          type: "submit",
                          disabled: form.disable,
                          onClick: submitHandler,
                        }}
                        className={`btn btn-success float-end ms-2`}
                        fSubmit={fSubmit}
                      >
                        Submit
                      </Form.Button>
                    )}
                    {sendOTP && (
                      <Form.Button
                        button={{ type: "button", onClick: sendOTPHandler }}
                        className={`btn btn-primary float-end`}
                        fSubmit={fSubmit}
                      >
                        {" "}
                        Send OTP{" "}
                      </Form.Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <Link to={`/${flag}-login`} className="pointer text-primary">
                  Already have account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
