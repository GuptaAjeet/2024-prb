import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API, Form, Helper, Hook} from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import PasswordRule from "../../../apps/components/elements/password-rules";

const AdminLogin = () => {
  const dispatch = useDispatch();
  // const otp = useRef();
  const captcha = useRef();
  const password = useRef();
  const cpassword = useRef();
  // const [timer, setTimer] = useState();
  const [sendOTP, setSendOTP] = useState(false);
  const navigator = useNavigate();
  // const [show, setShow] = useState(true);
  const [reloadCap, setReloadCap] = useState(null);
  const [fSubmit, setFSubmit] = useState(false);
  const [fInputs, setFInputs] = useState([password, cpassword]);
  const [currentCaptcha, setToPerantCaptcha] = useState(null);
  const [alerts, setAlerts] = useState({ message: "", class: "danger" });
  const location = useLocation();
  const token = location.pathname.split("/")[2];
  //const token                     =   localStorage.getItem('resetToken');
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);
  const object = Hook.usePost({
    url: "auth/password/validate/token",
    data: {
      token: token,
      flag: location.pathname.split("-")[0].replace("/", ""),
    },
  });
  // const location = useLocation();
  const flag = location.pathname.split("-")[0].replace("/", "");

  useEffect(() => {}, [values, reloadCap]);

  const updatePasswordHandler = () => {
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    setFSubmit(true);
    const data = {
      password: password.current.value,
      flag: flag,
      token: token,
      otc: captcha.current.otc,
      captcha: captcha.current.value,
    };
    API.post("auth/password/reset/password", data, (result) => {
      if (result.status) {
        navigator(`/${flag}-login`);
      } else {
        setSendOTP(false);
        setAlerts({ ...alerts, message: result.message, class: "danger" });
        setFInputs([cpassword, password]);
        form.disable = true;
        captcha.current.value = "";
        password.current.value = "";
        cpassword.current.value = "";
        setReloadCap(Helper.random());
      }
      setTimeout(() => {
        setFSubmit(false);
        dispatch(Features.hideLoader({ show: "", display: "none" }));
      }, 100);
    });
  };

  // const resendOTPHandler = () => {
  //     form.disable = true;
  //     dispatch(Features.showLoader({show:"show",display:'block'}));
  //     setFSubmit(true);
  //     setAlerts({...alerts,message:''});
  //     API.post('auth/password/validate/token',{token:token},(result)=>{
  //         if(result.status){
  //             startTimer(120)
  //             otp.current.value='';
  //             captcha.current.value='';
  //             setReloadCap(Helper.random())
  //             setTimeout(() => {
  //                 setSendOTP(false);
  //             }, 1000);
  //             setAlerts({...alerts,'message':result.message,'class':'success'});
  //         }else{
  //             setReloadCap(Helper.random());
  //             setAlerts({...alerts,'message':result.message,'class':'danger'});
  //             form.disable = true;
  //             otp.current.value = '';
  //         }
  //         setTimeout(() => {
  //             setFSubmit(false);
  //             dispatch(Features.hideLoader({show:"",display:'none'}));
  //         },100);
  //     });
  // }

  return (
    <div className="row justify-content-center">
      <div className="shadow-lg bg-body col-xl-7 col-lg-5 col-md-6 col-sm-10 rounded  mt-5  mt-5 mb-5">
        <div className="p-0">
          <div className="row">
            <div className="col-md-12 pt-4 ps-4">
              <h3 className="text-center m-3 text-primary sec-title title-login">
                Reset Password?
              </h3>
              <div className="text-start d-flex justify-content-center">
                <Alert alert={alerts} />
                {object !== null && object.status === false ? (
                  <h3 className="text-danger text-center mt-5">
                    <i className="fa-solid fa-link-slash mb-3"></i> <br />
                    Oops! The link you followed has expired.
                  </h3>
                ) : (
                  <div className="form1 p-3 login-width">
                    <div className={``}>
                      <div
                        id="password-field"
                        className="field-wrapper input mb-3"
                      >
                        <Form.Password
                          attr={{
                            ref: password,
                            id: "password",
                            name: "password",
                            maxLength: "20",
                            onChange: handleChange,
                            onFocus: handleChange,
                          }}
                          show={true}
                          label="New Password"
                          error={errors.password}
                          mandatory={true}
                        />
                      </div>
                      <div
                        id="cpassword-field"
                        className="field-wrapper input mb-3"
                      >
                        <Form.Password
                          attr={{
                            ref: cpassword,
                            id: "cpassword",
                            name: "cpassword",
                            maxLength: "20",
                            onChange: handleChange,
                            onFocus: handleChange,
                          }}
                          show={true}
                          label="Confirm Password"
                          error={errors.cpassword}
                          mandatory={true}
                        />
                      </div>
                      <div
                        id="captcha-field"
                        className="field-wrapper input mb-3"
                      >
                        <Form.Captcha
                    
                          attr={{
                            ref: captcha,
                            id: "captcha",
                            name: "captcha",
                            onChange: handleChange,
                            onFocus: handleChange,
                            otc: "",
                          }}
                          reloadCap={reloadCap}
                          error={errors.captcha}
                          setToPerantCaptcha={setToPerantCaptcha}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="row p-1">
                        <div className="col-md-12">
                          <Form.Button
                            button={{
                              type: "submit",
                              disabled: form.disable,
                              onClick: updatePasswordHandler,
                            }}
                            className={`btn btn-primary float-end`}
                            fSubmit={fSubmit}
                          >
                            Update Password
                          </Form.Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-12 pt-4 ps-4">
              <PasswordRule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
