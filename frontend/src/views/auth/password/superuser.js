import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation} from "react-router-dom";
import { API, Form, Hook } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
// import Features from "../../../redux/features";
// import { useDispatch } from "react-redux";

const Superuser = (props) => {
  // const navigator = useNavigate();
  // const dispatch = useDispatch();
  const otp = useRef();
  const email = useRef();
  const captcha = useRef();
  const mobile = useRef();
  const ref_user_id = useRef();
  const self_user_id = useRef();
  const udise = useRef();
  const [show, setShow] = useState(true);
  // const [timer, setTimer] = useState();
  // const [sendOTP, setSendOTP] = useState(false);
  // const [subBtn, setSubBtn] = useState(true);
  const [reloadCap, setReloadCap] = useState(null);
  const [fSubmit, setFSubmit] = useState(false);
  const [alerts, setAlerts] = useState({ message: "", class: "danger" });
  const [fInputs, setFInputs] = useState([
    otp,
    ref_user_id,
    self_user_id,
    captcha,
  ]);
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);

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

  const submitHandler = () => {
    const data = {
      user_id: self_user_id.current.value,
      reference_user_id: ref_user_id.current.value,
      // otp: otp.current.value,
      captcha: captcha.current.value,
      otc: captcha.current.otc,
    };
    API.post("auth/user/refrenceupdate", data, (result) => {
      if (result.status) {
        setAlerts({ ...alerts, message: result.message, class: "success" });
      } else if (result.code === 400) {
        setAlerts({ ...alerts, message: result.message, class: "danger" });
        form.disable = true;
        // otp.current.value = "";
      }
    });
  };
  return (
    <div className="row justify-content-center">
      <Link to="/" className="pointer forgot-pass-link text-primary">
        <h6 title="Go to homepage" className="text-primary p-3 back-to-home">
          <i className="bi bi-arrow-left me-2"></i>Back to home
        </h6>
      </Link>
      <div className="shadow-lg bg-body col-xl-4 col-lg-5 col-md-6 col-sm-10 rounded  mt-5  mt-5 mb-5">
        <div className="pt-5 pb-5">
          <div className="text-start mt-3">
            <div className="form p-3">
              <h2 className="text-primary text-center mb-4 sec-title title-login">
                Reference User
              </h2>
              {/* <p className="text-center bg-light p-2">Reference User.
                            </p> */}
              {/* <strong className="text-primary"></strong> */}
              <Alert alert={alerts} />
              <div className={`${show ? "" : "d-none"}`}>
                <div className={`${flag !== "school" ? "" : "d-none"}`}>
                  <div id="email-field" className="field-wrapper input mb-3">
                    <Form.Number
                      attr={{
                        ref: self_user_id,
                        id: "self_user_id",
                        type: "text",
                        name: "self_user_id",
                        onChange: handleChange,
                        onFocus: handleChange,
                        maxLength: 10,
                      }}
                      label="Self User ID"
                      error={errors.self_user_id}
                      mandatory={true}
                    />
                  </div>
                  <div id="email-field" className="field-wrapper input mb-3">
                    <Form.Number
                      attr={{
                        ref: ref_user_id,
                        id: "ref_user_id",
                        type: "text",
                        name: "ref_user_id",
                        onChange: handleChange,
                        onFocus: handleChange,
                        maxLength: 10,
                      }}
                      label="Refrence User ID"
                      mandatory={false} 
                    />
                  </div>
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
                    reloadCap={reloadCap}
                    error={errors.captcha}
                  />
                </div>
              </div>
              {/* <div id="otp-field" className={`field-wrapper input mb-3 ${(!show) ? '' : 'd-none'}`}>
                                <Form.Password attr={{ ref: otp, 'id': 'otp', 'name': 'otp', 'maxLength': '6', 'onChange': handleChange, 'onFocus': handleChange, 'ots': '', 'type': 'password' }} show={false} label="OTP" error={errors.otp} mandatory={true} />
                                {(!sendOTP) && <p className="text-success">OTP valid time {<span className="forgot-pass-link text-primary float-end">{timer}</span>}</p>}
                            </div> */}
              <div className="mt-3">
                <div className="row p-1">
                  <div className="col-md-12">
                    {/* {(subBtn) &&  */}
                    <Form.Button
                      button={{
                        type: "submit",
                        disabled:
                          self_user_id?.current?.value?.length < 10
                            ? true
                            : form.disable,
                        onClick: submitHandler,
                      }}
                      className={`btn btn-success float-end ms-2`}
                      fSubmit={fSubmit}
                    >
                      Submit
                    </Form.Button>
                    {/* // } */}
                    {/* {(sendOTP) && <Form.Button button={{ 'type': 'button', 'onClick': sendOTPHandler }} className={`btn btn-primary float-end`} fSubmit={fSubmit} > Send OTP </Form.Button>} */}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <Link to={`/admin-login`} className="pointer text-primary">
                  Login ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Superuser;
