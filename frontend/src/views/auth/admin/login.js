import React, { useEffect, useRef, useState } from "react";
import { Hook, Form, API, Helper, sweetAlert } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { encrypt } from "../../../apps/utilities/hash";
import { APP_ENVIRONMENT, SCHOOL_LOGIN, SELECT_APPLICATION } from "../../../env";
import $ from "jquery";
const CryptoJS = require("crypto-js");

const AdminLogin = () => {
  // const navigate = useNavigate();
  const dnone = "d-none";
  const password = useRef();
  const otp = useRef();
  const email = useRef();
  const captcha = useRef();
  const mobile = useRef();
  const school = useRef();
  const otpCheck = useRef();
  const twoFAOTP = useRef();
  const otpSMSCheck = useRef();
  const [login, setLogin] = useState(false);
  // const [reload, setReload] = useState(null);
  const [timer, setTimer] = useState();
  const [sendOTP, setSendOTP] = useState(false);
  const [reloadCap, setReloadCap] = useState(null);
  const [currentCaptcha, setToPerantCaptcha] = useState(null);
  const [type, setType] = useState("email");
  // const [tsss, settss] = useState(null);
  const [schoolMobile, setSchoolMobile] = useState([]);
  //const response = Hook.useLogin({login:login});
  const [show, setShow] = useState({
    email: "",
    emailInputField: "",
    password: "",
    captcha: "",
    submit: "",
    mobile: dnone,
    mobileInputField: dnone,
    school: dnone,
    validateUdise: dnone,
    otpSend: dnone,
    resendOtp: dnone,
    twoFAOTP: dnone,
    verifyOTP: dnone
  });
  const [fSubmit, setFSubmit] = useState(false);
  const [fInputs, setFInputs] = useState([email, password, captcha]);
  const [alerts, setAlerts] = useState({ message: "", class: "danger" });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [overrideTwoFA, setOverrideTwoFA] = useState(false);
  const [loginResult, setLoginResult] = useState();
  const dispatch = useDispatch();
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);

  useEffect(() => {
    if (login) {
      localStorage.setItem("label", "Dashboard");
      window.location.href =
        (APP_ENVIRONMENT === "testing" ? "/testing" : "") +
        (SELECT_APPLICATION ? "/project" : "/auth/admin");
    }
  }, [login, values, show, reloadCap]);

  const changeHandler = (e) => {
    setAlerts({ ...alerts, message: "" });
    setReloadCap(new Date().getTime());
    let role = e.target.getAttribute("role");
    if (!role) {
      role = $(e.target).closest("button").attr("role")
    }
    setType(role);
    if (role === "email") {
      captcha.current.value = "";
      password.current.value = "";
      mobile.current.value = "";
      mobile.current.disabled = false;
      // otpCheck.current.disabled = false;
      // otpCheck.current.checked = false;
      setFInputs([email, password, captcha]);
      setShow({
        ...show,
        email: "",
        emailInputField: "",
        mobile: dnone,
        mobileInputField: dnone,
        password: "",
        captcha: "",
        submit: "",
        otpSend: dnone,
        resendOtp: dnone,
        school: dnone,
        validateUdise: dnone,
        twoFAOTP: dnone,
        verifyOTP: dnone
      });
    } else if (role === "mobile") {
      const check = document?.getElementById("otpCheck")?.checked || null;
      if (check) {
        setFInputs([mobile]);
      } else {
        setFInputs([mobile, password, captcha]);
      }
      // captcha.current.value = "";
      // password.current.value = "";
      // email.current.value = "";
      setShow({
        ...show,
        email: dnone,
        emailInputField: dnone,
        otp: dnone,
        school: dnone,
        validateUdise: dnone,
        submit: "",
        mobile: "",
        mobileInputField: "",
        password: "",
        twoFAOTP: dnone,
        verifyOTP: dnone
      });
    } else if (role === "school") {
      const check = document?.getElementById("otpCheck")?.checked || null;
      if (check) {
        setFInputs([school]);
      } else {
        setFInputs([school, captcha]);
      }
      if (school) {
        school.current.value = "";
      }
      if (captcha?.current) {
        captcha.current.value = "";
      }
      setShow({
        ...show,
        captcha: "",
        email: dnone,
        emailInputField: dnone,
        password: "",
        mobile: dnone,
        mobileInputField: dnone,
        school: "",
        validateUdise: dnone,
        submit: "",
        twoFAOTP: dnone,
        verifyOTP: dnone
      });
    }
  };

  const otpHandler = (e) => {
    setAlerts({ ...alerts, message: "" });
    if (e.target.checked) {
      if (mobile.current.value.length === 10) {
        form.disable = false;
      }
      setFInputs([mobile]);
      setShow({
        ...show,
        password: dnone,
        captcha: dnone,
        submit: dnone,
        otpSend: "",
        resendOtp: dnone,
        otp: dnone,
        school: dnone,
        validateUdise: dnone,
      });
    } else {
      form.disable = true;
      setFInputs([mobile, password, captcha]);
      setShow({
        ...show,
        password: "",
        captcha: "",
        submit: "",
        otpSend: dnone,
        resendOtp: dnone,
        otp: dnone,
        school: dnone,
        validateUdise: dnone,
      });
    }
  };

  const otpSMSHandler = (e) => {
    setAlerts({ ...alerts, message: "" });
    if (e.target.checked) {
      if (mobile.current.value.length === 10) {
        form.disable = false;
      }
      setFInputs([mobile]);
      setShow({
        ...show,
        password: dnone,
        captcha: dnone,
        submit: dnone,
        otpSend: "",
        resendOtp: dnone,
        otp: dnone,
        school: dnone,
        validateUdise: dnone,
        twoFAOTP: dnone
      });
      setOverrideTwoFA(true)
    }
  };

  const sendOTPHandler = async (e) => {
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    setFSubmit(true);
    if (show.school === "") {
      // const data   = {flag:'school',udise:school.current.value,ST:true}
      // const response = await axios.post(+'auth/otp/send',data);
      // console.log("response", response)
    } else {
      const data = { flag: "admin", mobile: mobile.current.value };
      form.disable = true;
      API.post("auth/two-factor-auth/check-status", data, async (result) => {
        if(result.message){
          setAlerts({...alerts, message: result.message, class: "danger"})
          setTimeout(() => {
            setFSubmit(false);
            dispatch(Features.hideLoader({ show: "", display: "none" }));
          }, 100);
        }
        else{
          if (+result.two_fa_enabled === 1 && overrideTwoFA === false) {
            setTwoFAEnabled(true);
  
            setFInputs([mobile, twoFAOTP, captcha]);
            setShow({
              ...show,
              captcha: "",
              submit: "",
              twoFAOTP: "",
              otpSend: dnone,
              resendOtp: dnone,
              school: dnone,
              validateUdise: dnone,
              verifyOTP: dnone
            });
  
            setTimeout(() => {
              setFSubmit(false);
              dispatch(Features.hideLoader({ show: "", display: "none" }));
            }, 100);
          }
          else {
            let objectd = API.post("auth/otp/send", data, (result) => {
              if (result.time) {
                setShow({
                  ...show,
                  captcha: "",
                  otp: "",
                  submit: "",
                  otpSend: dnone,
                  resendOtp: dnone,
                  school: dnone,
                  validateUdise: dnone,
                });
              }
  
              if (result.status) {
                startTimer(120);
                sessionStorage.setItem("ots", result.ots);
                setTimeout(() => {
                  setSendOTP(false);
                }, 1000);
                otp.current.ots = result.ots;
                e.target.disabled = true;
                mobile.current.disabled = true;
                otpCheck.current.disabled = true;
                setFInputs([mobile, otp, captcha]);
                setShow({
                  ...show,
                  captcha: "",
                  otp: "",
                  submit: "",
                  otpSend: dnone,
                  resendOtp: dnone,
                  school: dnone,
                  validateUdise: dnone,
                });
                setAlerts({ ...alerts, message: result.message, class: "success" });
              }
              else {
                setAlerts({ ...alerts, message: result.message, class: "danger" });
                otp.current.ots = result.ots;
                // mobile.current.value = null;
                // mobile.current.disabled = false;
                // otpCheck.current.disabled = false;
                // setShow({
                //   ...show,
                //   otp: "",
                //   captcha: "",
                //   submit: "",
                //   otpSend: dnone,
                // });
              }
              setTimeout(() => {
                setFSubmit(false);
                dispatch(Features.hideLoader({ show: "", display: "none" }));
              }, 100);
            });
          }
        }
      })

    }
  };

  const validateUdise = async () => {
    // const data = { 'udisecode':school.current.value,'çaptcha':captcha.current.value,'otc':captcha.current.otc };
    // let response = await axios.post(+"/auth/udiseplus/validate-udisecode", data);
    // if(response){
    //   if(response?.data?.data?.data?.hosMobile){
    //     let mobiles = [response.data.data.data.hosMobile,
    //       response.data.data.data.schMobile,
    //       response.data.data.data.respMobile];
    //     mobiles = [...mobiles.filter(i=>!!i)];
    //     if(mobiles.length===1){
    //       mobile.current.value = mobiles[0];
    //     }
    //     setSchoolMobile(mobiles);
    //     setShow({ ...show, mobile: "", otpSend: "", submit: dnone, otp: dnone, captcha: dnone, validateUdise: dnone });
    //   }
    // }
  };

  const loginHandler = async (e) => {
    // dispatch(Features.showLoader({ show: "show", display: "block" }));
    // setAlerts({ ...alerts, message: "" });
    // setFSubmit(true);
    const checking = Date.now();
    if (show.school === "") {
      if (currentCaptcha === captcha.current.value) {
        let result = {
          status: true,
          data: {
            userId: "16030604502",
            roleId: 9,
            userRegionId: 3101275,
            userStateId: 116,
            userName: "Modassar Hussain",
            userRoleType: "SCHOOL USER",
            userRegion: "School",
            phoneNumber: "7665646565",
            designation: null,
            userStatus: "ACTIVE",
          },
          errorDetails: "",
          message: "Successful",
        };
        const text = 123456;
        let encryptPass = CryptoJS.SHA256(text + CryptoJS.SHA256(password.current.value).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);

        // result = await axios.post(`http://10.23.252.24:8081/master-services/v1.2/checkLoginCredentials/${school.current.value}/${encryptPass}/123456`, {abc: ''} ,{
        //   headers: {identity: "shawez003"}
        // },)

        // if (result?.data?.status) {
        API.post("auth/user/after-school-login", { udise_code: school.current.value, password: encryptPass, text },
          (resultRes) => {
            if (resultRes.status) {
              Helper.storeToken(resultRes);
              sessionStorage.removeItem("ots");
              setTimeout(() => {
                setLogin(true);
              }, 50)
            }
            else {
              setAlerts({ ...alerts, message: resultRes.message, class: "danger" });
              if (resultRes.captcha) {
                setReloadCap(new Date().getTime());
              }
              password.current.value = null;
              captcha.current.value = null;
            }

            setTimeout(() => {
              setFSubmit(false);
              dispatch(Features.hideLoader({ show: "", display: "none" }));
            }, 200);
          })
        // }else {
        //   setAlerts({ ...alerts, message: result.data.errorDetails.message, class: "danger" });
        //   password.current.value = null;
        //   captcha.current.value = null;
        // }
      }
    }
    else {
      // encrypt(password.current.value)
      const data = {
        flag: "admin",
        email: email.current.value,
        password: encrypt(password.current.value),
        ots: otp.current.ots || sessionStorage.getItem("ots"),
        type: type,
        captcha: captcha.current.value,
        mobile: mobile.current.value,
        otp: otp.current.value,
        otc: captcha.current.otc,
        secure: true,
        check: checking,
        token: twoFAOTP.current.value
      };
      if (twoFAEnabled === true && overrideTwoFA === false) {
        API.post("auth/two-factor-auth/otp-login", data, (result) => {
          if (result.status) {
            if (checking === result.check) {
              Helper.storeToken(result);
              setLogin(true);
            }
            sessionStorage.removeItem("ots");
          }
          else {
            setAlerts({ ...alerts, message: result.message, class: "danger" });
            if (result.captcha) {
              setReloadCap(new Date().getTime());
            }
            if (result.otp) {
            }
            email.current.value = null;
            if (type === "email") {
              mobile.current.value = null;
            }
            if (type === "mobile") {
              otp.current.value = null;
            }
            password.current.value = null;
            captcha.current.value = null;
          }
          setTimeout(() => {
            setFSubmit(false);
            dispatch(Features.hideLoader({ show: "", display: "none" }));
          }, 200);
        });
      } else {
        API.post("auth/user/login", data, (result) => {
          if (result.status) {
            if (checking === result.check) {
              let loginData = JSON.parse(atob(result.token.split(".")[1]));

              if (+loginData.user.two_fa_enabled === 1 && (password.current.value.trim().length > 0)) {
                setTwoFAEnabled(true);
                setLoginResult(result);
                setShow({
                  ...show,
                  emailInputField: dnone,
                  mobileInputField: dnone,
                  password: dnone,
                  captcha: dnone,
                  submit: dnone,
                  validateUdise: dnone,
                  otpSend: dnone,
                  resendOtp: dnone,
                  twoFAOTP: "",
                  verifyOTP: ""
                });
              } else {
                Helper.storeToken(result);
                setLogin(true);
              }
            }
            sessionStorage.removeItem("ots");
          }
          else {
            setAlerts({ ...alerts, message: result.message, class: "danger" });
            if (result.captcha) {
              setReloadCap(new Date().getTime());
              //errors.captcha.focus();
            }
            if (result.otp) {
              // errors.otp.focus();
            }
            email.current.value = null;
            if (type === "email") {
              mobile.current.value = null;
            }
            if (type === "mobile") {
              otp.current.value = null;
            }
            password.current.value = null;
            captcha.current.value = null;
          }
          setTimeout(() => {
            setFSubmit(false);
            dispatch(Features.hideLoader({ show: "", display: "none" }));
          }, 200);
        });
      }
    }
  };

  const verifyOTPHandler = async (e) => {
    let data = JSON.parse(atob(loginResult.token.split(".")[1]));
    API.post("auth/two-factor-auth/verify-otp",
      { username: data.user.user_name.trim().replace(/\s/g, "_").toLowerCase(), token: values.twoFAOTP.toString(), secret: data.user.token_secret, id: data.user.id },
      (response) => {
        if (+response.result === 1) {
          Helper.storeToken(loginResult);
          setLogin(true);
        } else {
          sweetAlert.error({ msg: response.message })
        }
      }
    );
  }

  const startTimer = (duration) => {
    var timer = duration, minutes, seconds;

    setInterval(function () {
      if (timer > 0) {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? 0 + minutes : minutes;
        seconds = seconds < 10 ? 0 + seconds : seconds;
        if (--timer === 0) {
          clearInterval(timer);
          timer = 0;
          otp.current.value = "";
          captcha.current.value = "";
          form.disable = true;
          setReloadCap(Helper.random());
          setSendOTP(true);
          setAlerts({ ...alerts, message: "", class: "" });
        }
        setTimer(minutes + ":" + seconds);
      }
    }, 1000);

    setTimeout(() => {
      otpCheck.current.disabled = false;
      mobile.current.disabled = false;
      setShow({
        email: dnone,
        password: dnone,
        captcha: dnone,
        submit: dnone,
        mobile: "",
        otp: dnone,
        otpSend: dnone,
        resendOtp: "",
        validateUdise: dnone,
        school: dnone,
      });
    }, duration * 1000);
  };

  const loadPage = (e) => {
    const title = "Forgot Password";
    localStorage.setItem("label", title);
    dispatch(Features.setLabel({ title: title, optional: "Admin" }));
    localStorage.setItem("optional", "Admin");
  };

  return (
    <div className="row ">
      <Link to="/" className="pointer forgot-pass-link text-primary">
        <h6 title="Go to homepage" className="text-primary p-3 back-to-home">
          <i className="bi bi-arrow-left me-2"></i>Back to home
        </h6>
      </Link>

      <div className="shadow-lg bg-body col-xl-4 col-lg-5 col-md-6 col-sm-10 rounded text-center mt-5">
        <div className="pt-5 pb-2">
          <h1 className="sec-title title-login">Login</h1>
          {/* <p>Log in to your account to continue.</p> */}
          <div className="text-start d-flex justify-content-center">
            <div className="form1 p-3 login-width">
              <div className="button-group d-flex justify-content-center mb-5">
                <button className={`btn pointer ${show.email === "" ? "active" : ""} ${type === "email" && ""}`} onClick={changeHandler} role="email">
                  <i className="fa-regular fa-envelope"></i> Email
                </button>

                <button className={`btn ${show.mobile === "" ? "active" : ""} ms-2 me-2 pointer ${type === "mobile" && ""}`} onClick={changeHandler} role="mobile">
                  <i className="fa-solid fa-mobile-screen"></i> Mobile
                </button>

                {SCHOOL_LOGIN && <button className={`btn ${show.school === "" ? "active" : ""} pointer ${type === "school" && ""}`} onClick={changeHandler}
                  role="school" >
                  <i className="fa-solid fa-school"></i> School
                </button>}
              </div>

              <Alert alert={alerts} />

              <div id="email-field" className={`field-wrapper input mb-3 ${show.emailInputField}`} >
                <Form.Email attr={{ ref: email, id: "email", name: "email", onChange: handleChange, onFocus: handleChange }} label="Email ID" error={errors.email}
                  mandatory={true} />
              </div>


              <div id="school-field" className={`field-wrapper input mb-3 ${show.school}`} >
                <Form.Text attr={{ ref: school, id: "school", name: "school", onChange: handleChange, onFocus: handleChange }} label="Email ID/UDISE ID"
                  mandatory={true} />
              </div>

              <div className={`${show.mobile}`}>
                <div id="mobile-field" className="field-wrapper input mb-3">
                  {schoolMobile.length > 1 ? <div className="mt-2">
                    <ul style={{ listStyleType: "none" }}>
                      {schoolMobile.map((mob, i) => <li><input type="radio" name="mobile" value={mob} id={"mobile" + i} /> <label htmlFor={"mobile" + i}>{mob}</label>
                      </li>)}
                    </ul>
                  </div> :
                    <Form.Mobile attr={{ ref: mobile, id: "mobile", name: "mobile", onChange: handleChange, onFocus: handleChange, disabled: show.school === "" }}
                      label="Mobile Number" error={errors.mobile} mandatory={true} />}

                  {show.school === "d-none" && <div id="otpCheck-field" className="field-wrapper input mb-3 mt-1">
                    <Form.Checkbox attr={{ ref: otpCheck, name: "otpCheck", id: "otpCheck", onClick: otpHandler }} label="Login with OTP?" />
                  </div>}
                </div>

                <div id="otp-field" className={`field-wrapper input mb-3 ${show.otp}`}>
                  <Form.Text attr={{ ref: otp, id: "otp", name: "otp", maxLength: "6", onChange: handleChange, onFocus: handleChange, ots: "", type: "password" }}
                    label="OTP" error={errors.otp} mandatory={true} />

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
              </div>

              <div id="password-field" className={`field-wrapper input ${show.password}`}>
                <Form.Password attr={{ ref: password, id: "logpass", name: "logpass", maxLength: "20", onChange: handleChange, onFocus: handleChange }} label="Password"
                  error={errors.logpass} mandatory={true} />

                <div className="d-flex justify-content-end">
                  <Link to="/admin-forgot-password" className="pointer forgot-pass-link text-primary">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div id="otp-field" className={`field-wrapper input mb-3 ${show.twoFAOTP}`}>
                <Form.Text attr={{ ref: twoFAOTP, id: "twoFAOTP", name: "twoFAOTP", maxLength: "6", onChange: handleChange, onFocus: handleChange, ots: "", type: "password" }}
                  label="Enter Google Authenticator OTP" error={errors.otp} mandatory={true} />

                {show.mobile !== "d-none" && <div id="otpSMSCheck-field" className="field-wrapper input mb-3 mt-1">
                  <Form.Checkbox attr={{ ref: otpSMSCheck, name: "otpSMSCheck", id: "otpSMSCheck", onClick: otpSMSHandler }} label="Get OTP on SMS ?" />
                </div>}
              </div>

              <div id="captcha-field" className={`field-wrapper input ${show.captcha}`}>
                <Form.Captcha attr={{ ref: captcha, id: "captcha", name: "captcha", onChange: handleChange, onFocus: handleChange, otc: "" }}
                  setToPerantCaptcha={setToPerantCaptcha} udise={!show.school} reloadCap={reloadCap} error={errors.captcha} />
              </div>

              <div className="text-center mt-4">
                <div className="field-wrapper">
                  {/* <Form.Button button={{ type: "submit", disabled: form.disable, onClick: validateUdise }}
                    className={`btn btn-primary float-end ${show.validateUdise}`} fSubmit={fSubmit}>
                    Validate Udise
                  </Form.Button> */}

                  <Form.Button button={{ type: "submit", disabled: (form.disable || currentCaptcha !== captcha?.current?.value), onClick: loginHandler }}
                    className={`btn btn-primary float-end ${show.submit}`} fSubmit={fSubmit}>
                    Login
                  </Form.Button>

                  <Form.Button button={{ type: "submit", onClick: verifyOTPHandler, disabled: !values.twoFAOTP || values?.twoFAOTP.length < 6 }}
                    className={`btn btn-primary float-end ${show.verifyOTP}`} fSubmit={fSubmit}>
                    Verify OTP
                  </Form.Button>

                  <Form.Button button={{ type: "submit", onClick: sendOTPHandler, disabled: form.disable }}
                    className={`btn btn-primary float-end ${show.otpSend}`} fSubmit={fSubmit}>
                    Send OTP
                  </Form.Button>

                  <Form.Button button={{ type: "submit", onClick: sendOTPHandler, disabled: values?.mobile?.length < 10 ? true : false }}
                    className={`btn btn-primary float-end ${show.resendOtp}`} fSubmit={fSubmit}>
                    Resend OTP
                  </Form.Button>

                  {/* {sendOTP && (<Form.Button button={{ type: "button", onClick: sendOTPHandler }} className={`me-2 btn btn-primary float-end`} fSubmit={fSubmit}>
                      Send OTP
                    </Form.Button>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center" style={{ color: "rgb(255 108 0)" }}></div>
    </div>
  );
};

export default AdminLogin;