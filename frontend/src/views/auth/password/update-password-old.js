import React, { useEffect, useRef, useState } from "react";
import { API, Form, Helper, Hook, Rules } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import PasswordRule from "../../../apps/components/elements/password-rules";

const UpdatePassword = (props) =>{
    const dispatch     = useDispatch();
    const otp          = useRef(); 
    const captcha      = useRef(); 
    const password     = useRef(); 
    const cpassword    = useRef(); 
    const [timer, setTimer] = useState();
    const [show,setShow]  = useState(true);
    const [sendOTP,setSendOTP]  = useState(false);
    const [pass,setPass]  = useState('');
    const [reloadCap,setReloadCap]  = useState(null);
    const [fSubmit,setFSubmit] = useState(false);
    const [fInputs,setFInputs] = useState([password,cpassword]);
    const [alerts,setAlerts]   = useState({'message':'','class':'danger'}); 
    const { handleChange,values,errors,form } = Hook.useForm(fInputs);
    const [logout,setLogout]    = useState(false);
    const response              = Hook.useLogout({logout:logout});

    useEffect(()=>{
        if(response){ 
            window.location.reload();  
        }        
    },[response,values,reloadCap,logout])

    const resetPasswordHandler = () =>{
        if(password.current.value !== cpassword.current.value){
            setAlerts({...alerts,message:Rules.bothPasswrod});   
            form.disable = true;
            password.current.value  = '';
            cpassword.current.value = '';
        }else{
            setPass(password.current.value);
            userCheckHandler(false);
        }
    }

    const userCheckHandler = (flag) => {
        dispatch(Features.showLoader({ show: "show", display: 'block' }));
        setFSubmit(true);
        setAlerts({ ...alerts, message: '' });
        API.post('auth/password/check/user', null, (result) => {
            if (result.status) {
                setShow(false);
                setFInputs([otp, captcha]);
                //otp.current.token   = pass; 
                setTimeout(() => {
                    startTimer(120)
                    // otp.current.value='';
                    // captcha.current.value='';
                    setReloadCap(Helper.random())
                    if (flag) {
                        setTimeout(() => {
                            setSendOTP(false);
                        }, 1000);
                    }
                    otp.current.ots = result.ots;
                    otp.current.value = '';
                    otp.current.focus();
                    setAlerts({ ...alerts, 'message': result.message, 'class': 'success' });
                }, 10);
            } else {
                form.disable = true;
                setReloadCap(Helper.random())
                setShow(show);
                setAlerts({ ...alerts, 'message': result.message, 'class': 'danger' });
            }
            setTimeout(() => {
                setFSubmit(false);
                dispatch(Features.hideLoader({ show: "", display: 'none' }));
            }, 100);
        })
    }

    const updatePasswordHandler = () =>{
        dispatch(Features.showLoader({show:"show",display:'block'})); 
        setFSubmit(true);
        const flag = (props.flag).toLowerCase();
        const data = {
            'password':pass,'ots':otp.current.ots,'otp':otp.current.value,
            'flag':flag,'otc':captcha.current.otc,'captcha':captcha.current.value
        };
        API.post('auth/password/update/password',data,(result)=>{
            if(result.status){ 
                setAlerts({...alerts,message:result.message,'class':'success'}); 
                setLogout(true);  
                setTimeout(() => {
                    if(logout){
                        const title = `${props.flag} Login`;
                        localStorage.setItem('label',title);
                        dispatch(Features.setLabel({title:title}));
                    }
                }, 3000); 
            }else{
                setAlerts({...alerts,message:result.message,'class':'danger'});   
                form.disable = true;             
                otp.current.value = '';
                captcha.current.value = '';                   
                setReloadCap(Helper.random())
                setShow(!show);
                startTimer(0);
            }
            setTimeout(() => {
                setFSubmit(false);            
                dispatch(Features.hideLoader({show:"",display:'none'}));
            },100);
        });
    }
    
    const resendOTPHandler = () => {
        userCheckHandler(true);
    }

    const startTimer = (duration) => {
        var timer = duration,minutes,seconds;
        setInterval(function () {
            if(timer > 0){
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);    
                minutes = minutes < 10 ? 0 + minutes : minutes;
                seconds = seconds < 10 ? 0 + seconds : seconds;    
                if ((--timer === 0)) {
                    clearInterval(timer);
                    timer = 0;
                    setSendOTP(true)
                    setAlerts({...alerts,message:'','class':''}); 
                }
                setTimer(minutes + ":" + seconds);
            }   
        },1000);
    }

    const submitHandler = (show) ? resetPasswordHandler : updatePasswordHandler ;

    return (
        <div className="bg-white">
            {
                (props.flag !=='Admin') &&
                <div className="card-header">
                    <h5 className="p-2  text-primary">Reset Password</h5>
                </div>
            }
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6 pt-3 border-right">
                        <div className="text-start m-3">
                            <Alert alert={alerts} />
                            {
                                <div className="form">
                                    {
                                        (show)
                                            ? <>
                                                <div id="password-field" className="field-wrapper input mb-3">
                                                    <Form.Password attr={{ ref: password, 'id': 'password', 'name': 'password', 'maxLength': '20', 'onChange': handleChange, 'onFocus': handleChange }} show={true} label="New Password" error={errors.password} mandatory={true} />
                                                </div>
                                                <div id="cpassword-field" className="field-wrapper input mb-3">
                                                    <Form.Password attr={{ ref: cpassword, 'id': 'cpassword', 'name': 'cpassword', 'maxLength': '20', 'onChange': handleChange, 'onFocus': handleChange }} show={true} label="Confirm Password" error={errors.cpassword} mandatory={true} />
                                                </div>
                                            </>
                                            : <>
                                                <div id="otp-field" className={`field-wrapper input mb-3`}>
                                                    <Form.Password attr={{ ref: otp, 'id': 'otp', 'name': 'otp', 'maxLength': '6', 'onChange': handleChange, 'onFocus': handleChange, 'ots': '', 'token': '' }} show={false} label="OTP" error={errors.otp} mandatory={true} />
                                                    {(!sendOTP) && <p className="text-success">OTP valid time {<span className="forgot-pass-link text-primary float-end">{timer}</span>}</p> }
                                                </div>
                                                <div id="captcha-field" className="field-wrapper input mb-3">
                                                    <Form.Captcha attr={{ ref: captcha, 'id': 'captcha', 'name': 'captcha', 'onChange': handleChange, 'onFocus': handleChange, 'otc': '' }} reloadCap={reloadCap} error={errors.captcha} />
                                                </div>
                                            </>
                                    }
                                    <div className="mt-3">
                                        <div className="row p-1">
                                            <div className="col-md-12">
                                                <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick': submitHandler }} className={`btn btn-primary float-end`} fSubmit={fSubmit} >
                                                    {(show) ? 'Submit' : <> Update Password <i className="fa-solid fa-lock"></i></>}
                                                </Form.Button>
                                                {
                                                    (sendOTP) &&                                                                                 
                                                    <Form.Button button={{ 'type':'button','onClick':resendOTPHandler}}  className={`me-2 btn btn-primary float-end`} fSubmit={fSubmit} >
                                                        Send OTP 
                                                    </Form.Button>
                                                }    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="pt-5 mt-5"> 
                                <p className=" alert alert-danger">Note: Afrer changing password you will be logged out automatically.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 text-start text-primary td-flex justify-content-between  pt-5 pe-4 border-start">
                        <PasswordRule/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword;