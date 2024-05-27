import React, { useEffect, useState, useRef } from "react";
import { API, Form, Hook, sweetAlert } from "../../../../apps";
import { Modal, Alert } from "../../../../apps/components/elements";
import { useDispatch } from "react-redux";
import Features from "../../../../redux/features";

const TwoFactorAuth = (props) => {
    const maskedNumber = props.mobile.replace(/(\d{2})(\d+)(\d{2})/, function (match, p1, p2, p3) {
        return p1 + "x".repeat(p2.length) + p3;
    });
    const [qrCodeURL, setQRCodeURL] = useState('');
    const [secretCode, setSecretCode] = useState('')
    const [alerts, setAlerts] = useState({ message: "Confirm your mobile number " + maskedNumber, class: "success" });
    const [timer, setTimer] = useState();
    const [sendOTP, setSendOTP] = useState(false);
    const [otpSent, setOTPSent] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);
    const [otpData, setOTPData] = useState({});

    var authotp = useRef();
    var otp = useRef();
    const mobile = useRef();

    const defaultValidationInputs = [mobile, authotp];

    const [fInputs, SetFInputs] = useState(defaultValidationInputs);
    const dispatch = useDispatch();

    const handleClose = () => props?.setTwoFA(false);

    useEffect(() => {
        API.post("auth/two-factor-auth/enable",
            { username: props.username.trim().replace(/\s/g, "_").toLowerCase(), id: props?.id },
            (response) => {
                setQRCodeURL(response?.url);
                setSecretCode(response?.secret);
            }
        );
    }, [])

    const { handleChange, values, errors, form } = Hook.useForm(fInputs);

    const verifyOTP = () => {
        API.post("auth/two-factor-auth/verify-otp",
            { username: props.username.trim().replace(/\s/g, "_").toLowerCase(), token: values.authotp.toString(), secret: secretCode, two_fa_enabled: 1, id: props?.id },
            (response) => {
                if (+response.result === 1) {
                    sweetAlert.done({ msg: response.message })
                    //    props.setTwoFAEnabled(true);
                    handleClose();
                } else {
                    sweetAlert.error({ msg: response.message })
                }
            }
        );
    }

    const sendOTPHandler = () => {
        if (values.mobile !== props.mobile) {
            setAlerts({ ...alerts, message: "Entered number doesn\'t match", class: "danger" });
        }
        else {
            //     const data = { mobile: mobile.current.value, flag: "admin" };
            //     setAlerts({ ...alerts, message: "" });
            //     setSendOTP(false);
            //     API.post("auth/otp/send", data, (result) => {
            //         if (result.status) {
            //             startTimer(120);
            //             if (errors.otp !== undefined) {
            //                 errors.otp.valid = false;
            //             }
            //             setAlerts({ ...alerts, message: result.message, class: "success" });
            //             setOTPSent(true);
            //         } else {
            //             setAlerts({ ...alerts, message: result.message, class: "danger" });
            //             form.disable = true;
            //             otp.current.value = "";
            //         }
            //         setTimeout(() => {
            //             dispatch(Features.hideLoader({ show: "", display: "none" }));
            //         }, 100);
            //     });
            // }

            dispatch(Features.showLoader({ show: "show", display: "block" }));
            const data = {
                flag: "admin",
                email: props.email,
                mobile: mobile.current.value
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
        };
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

    return (
        <Modal clickHandler={verifyOTP} close={handleClose} size="default" dismissable={props.dismissable}>
            {mobileVerified === false && <div className="row" id="step-1">
                <div className="col-md-12 text-center">
                    <h5>Step 1</h5>
                </div>

                <div className="col-md-1 mb-3"></div>

                <div className="col-md-10 mb-3">
                    <Alert alert={alerts} />

                    <div id="email-field" className="field-wrapper input mb-3">
                        <Form.Mobile className={'ps-3'} attr={{
                            ref: mobile, id: "mobile", name: "mobile", onChange: handleChange, onFocus: handleChange,
                        }} label="Mobile number" error={errors.mobile} mandatory={true} />
                    </div>

                    {otpSent === false &&
                        <div className="col-md-12 mb-4" style={{ paddingLeft: '33%' }}>
                            <Form.Button button={{ 'type': 'button', 'onClick': sendOTPHandler }} className={`btn btn-primary mb-3`}>
                                Send SMS OTP
                            </Form.Button>
                        </div>}

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

                    {otpSent === true && <div className="col-md-12 mb-4" style={{ paddingLeft: '35%' }}>
                        <Form.Button button={{ 'type': 'button', 'onClick': otpValidateHandler }} className={`btn btn-success mb-3`}>
                            Verify OTP
                        </Form.Button>
                    </div>}
                </div>

                <div className="col-md-1 mb-3"></div>

            </div>}

            {mobileVerified === true && <div className="row">
                <h5 className="text-center">Step 2</h5>

                <div className="col-md-12" style={{ paddingLeft: '27%' }}>
                    <img src={qrCodeURL} alt="QR Code for two factor authentication" />
                </div>

                <div className="col-md-1 mb-3"></div>

                <div className="col-md-10 mb-3">
                    <div id="email-field" className="field-wrapper input mb-3">
                        <Form.Text className={'ps-3'} attr={{ ref: authotp, id: "authotp", name: "authotp", onChange: handleChange, onFocus: handleChange, maxLength: 100 }} label="Enter 6 Digit OTP" />
                    </div>
                </div>

                <div className="col-md-1 mb-3"></div>


                <div className="col-md-12 mb-4" style={{ paddingLeft: '35%' }}>
                    <Form.Button button={{ 'type': 'submit', 'onClick': verifyOTP }} className={`btn btn-success`}>
                        Verify & Enable
                    </Form.Button>
                </div>

                <p style={{ fontSize: '0.7rem', color: 'black', lineHeight: '17px' }}>
                    Disclaimer - To enable two factor authentication scan this QR Code using "Google Authenticator" App on your smartphone.
                    You can install this app on <a className="app-store-link" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US" target="_blank">Android</a>
                    &nbsp;and&nbsp;<a className="app-store-link" href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank">iOS</a> based devices.
                </p>
            </div>}
        </Modal>
    );
};

export default TwoFactorAuth;