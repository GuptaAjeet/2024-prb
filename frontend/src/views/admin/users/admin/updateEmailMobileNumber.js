import React, { useEffect, useState, useRef } from "react";
import { API, Form, Hook, sweetAlert } from "../../../../apps";
import { Modal, Alert } from "../../../../apps/components/elements";
import { useDispatch } from "react-redux";
import Features from "../../../../redux/features";
import { useNavigate } from "react-router-dom";

const UpdateEmailMobileNumber = (props) => {
    const maskedNumber = props.mobile.replace(/(\d{2})(\d+)(\d{2})/, function (match, p1, p2, p3) {
        return p1 + "x".repeat(p2.length) + p3;
    });

    const [alerts, setAlerts] = useState({ message: "Enter OTP sent on mobile number " + maskedNumber, class: "success" });
    const [timer, setTimer] = useState();
    const [sendOTP, setSendOTP] = useState(false);
    const [otpSent, setOTPSent] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);
    const [otpData, setOTPData] = useState({});

    var email = useRef();
    var otp = useRef();
    const mobile = useRef();

    const defaultValidationInputs = [email, mobile];

    const [fInputs, SetFInputs] = useState(defaultValidationInputs);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => props?.setUpdateContact(false);

    const { handleChange, values, errors, form } = Hook.useForm(fInputs);

    useEffect(() => {
        sendOTPHandler();
    }, [])

    useEffect(() => {
        if(mobileVerified === true){
            if(email !== undefined){
                email.current.value = props.email
            }
            if(mobile !== undefined){
                mobile.current.value = props.mobile
            }
        }
    }, [mobileVerified])


    const sendOTPHandler = () => {
        dispatch(Features.showLoader({ show: "show", display: "block" }));
        const data = {
            flag: "admin",
            email: props.email,
            mobile: props.mobile
        };
        setAlerts({ ...alerts, message: "" });
        API.post("auth/password/validate/user-without-captcha", data, (result) => {
            if (result.status) {
                startTimer(120);
                setOTPSent(true);
                setTimeout(() => {
                    setOTPData({
                        ots: result.ots,
                        token: result.token
                    })
                    setAlerts({ ...alerts, message: result.message, class: "success" });
                }, 50);
            } else {
                setAlerts({ ...alerts, message: result.message, class: "danger" });
            }
            setTimeout(() => {
                dispatch(Features.hideLoader({ show: "", display: "none" }));
            }, 100);
        });
    }

    const otpValidateHandler = () => {
        dispatch(Features.showLoader({ show: "show", display: "block" }));
        const data = { ots: otpData.ots, otp: otp.current.value };
        setAlerts({ ...alerts, message: "" });
        API.post("auth/password/validate/otp", data, (result) => {
            if (result.status) {
                setMobileVerified(true);
            } else {
                setAlerts({ ...alerts, message: result.message, class: "danger" });
                form.disable = true;
                otp.current.value = "";
            }
            setTimeout(() => {
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
                    setSendOTP(true);
                    setAlerts({ ...alerts, message: "", class: "" });
                }
            }
        }, 1000);
    };

    const updateDetailsHandler = () => {
        dispatch(Features.showLoader({ show: "show", display: "block" }));
        setAlerts({ ...alerts, message: "" });
        const data = { id: props.id, data: {
            email: email.current.value,
            mobile: mobile.current.value
        } };

        if (data !== null) {
            dispatch(Features.showLoader());

            API.post(`api/admin-users/update`, data, (response) => {
              dispatch(Features.showToast({ message: response.message }));
              if (response.status) {
                navigate("/auth/admin/list")
                dispatch(Features.hideLoader());
                handleClose();
              } else {
                dispatch(Features.hideLoader());
              }
            });
          }
    };

    return (
        <Modal clickHandler={updateDetailsHandler} close={handleClose} size="default" dismissable={props.dismissable}>
            {mobileVerified === false && <div className="row" id="step-1">
                <div className="col-md-12 text-center">
                    <h5>Step 1</h5>
                </div>

                <div className="col-md-1 mb-3"></div>

                <div className="col-md-10 mb-3">
                    <Alert alert={alerts} />

                    {otpSent === true && <div id="otp-field" className={`field-wrapper input mb-3`}>
                        <Form.Password className={'ps-3'} attr={{
                            ref: otp, id: "otp", name: "otp", maxLength: "6", onChange: handleChange, onFocus: handleChange,
                            ots: "", type: "password"
                        }} show={false} label="OTP" error={errors.otp} mandatory={true} />
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
                    </div>}

                    {otpSent === true &&
                        <div className="col-md-12 mb-4" style={{ paddingLeft: '35%' }}>
                            <Form.Button button={{ 'type': 'button', 'onClick': otpValidateHandler }} className={`btn btn-success mb-3`}>
                                Verify OTP
                            </Form.Button>
                        </div>}
                </div>

                <div className="col-md-1 mb-3"></div>

            </div>}

            {mobileVerified === true && <div className="row">
                <h5 className="text-center">Step 2</h5>

                <div className="col-md-1 mb-3"></div>

                <div className="col-md-10 mb-3 popup-icon">
                    <div className="mb-3 position-relative">
                        <i className="bi bi-envelope-at" style={{ left: '1px' }}></i>
                        <Form.Email attr={{ ref: email, id: "email", name: "email", onChange: (e) => handleChange(e), onFocus: handleChange }}
                            label="Email Id" error={errors.email} mandatory="true" />
                    </div>

                    <div className="mb-3 position-relative">
                        <i className="bi bi-phone" style={{ left: '1px' }}></i>
                        <Form.Mobile attr={{ ref: mobile, id: "mobile", name: "mobile", onChange: handleChange, onFocus: handleChange }}
                            label="Mobile Number" error={errors.mobile} mandatory="true" />
                    </div>
                </div>

                <div className="col-md-1 mb-3"></div>


                <div className="col-md-12 mb-4" style={{ paddingLeft: '35%' }}>
                    <Form.Button button={{ 'type': 'submit', 'onClick': updateDetailsHandler }} className={`btn btn-success`}>
                        Update Details
                    </Form.Button>
                </div>

            </div>}
        </Modal>
    );
};

export default UpdateEmailMobileNumber;