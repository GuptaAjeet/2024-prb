import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API, Form, Helper, Hook, Rules } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import PasswordRule from "../../../apps/components/elements/password-rules";

const AdminLogin = () =>{
    const dispatch                  = useDispatch();
    const otp                       = useRef(); 
    const captcha                   = useRef(); 
    const password                  = useRef(); 
    const cpassword                 = useRef(); 
    const [timer, setTimer]         = useState();
    const [sendOTP,setSendOTP]      = useState(false);
    const navigator                 = useNavigate();
    const [show,setShow]            = useState(true);
    const [reloadCap,setReloadCap]  = useState(null);
    const [fSubmit,setFSubmit]      = useState(false);
    const [fInputs,setFInputs]      = useState([password,cpassword]);
    const [alerts,setAlerts]        = useState({'message':'','class':'danger'}); 
    const location                  = useLocation();
    const token                   =   location.pathname.split("/")[2];
    //const token                     =   localStorage.getItem('resetToken');
    const { handleChange,values,errors,form } = Hook.useForm(fInputs);
    const object                    = Hook.usePost({url :"auth/password/validate/token",data : {token:token}});

   // const location = useLocation();
    const flag = (location.pathname.split('-')[0]).replace('/','');

    useEffect(()=>{ 
    },[values,reloadCap])

    const resetPasswordHandler = () =>{
        if(password.current.value !== cpassword.current.value){
            setAlerts({...alerts,message:Rules.bothPasswrod});   
            form.disable = true; 
            password.current.value  = '';
            cpassword.current.value = '';
            setReloadCap(Helper.random())
        }else{
            const pass = password.current.value
            setShow(!show);
            setFInputs([otp,captcha]);
            setTimeout(() => {
                startTimer(120)
                captcha.current.value='';
                setReloadCap(Helper.random())
                otp.current.token   = pass;                  
                otp.current.ots     = object.ots;
                otp.current.value   = '';
                otp.current.focus();
                setAlerts({...alerts,'message':object.message,'class':'success'}); 
            }, 100);
        }
    }

    const updatePasswordHandler = () =>{
        dispatch(Features.showLoader({show:"show",display:'block'})); 
        setFSubmit(true);
        //const flag = (localStorage.getItem('optional')).toLowerCase();
        const data = {
            'password':otp.current.token,'ots':otp.current.ots,'otp':otp.current.value,
            'flag':flag,token:token,'otc':captcha.current.otc,'captcha':captcha.current.value
        };
        API.post('auth/password/reset/password',data,(result)=>{
            if(result.status){  
                navigator(`/${flag}-login`);
                // setReloadCap(Helper.random())
                // const title = `${localStorage.getItem('optional')} Login`;
                // localStorage.setItem('label',title);
                // dispatch(Features.setLabel({title:title}));
            }else{
                setSendOTP(false);
                setAlerts({...alerts,message:result.message,'class':'danger'});   
                setFInputs([cpassword,password]);
                form.disable = true;             
                otp.current.value = '';
                captcha.current.value = '';
                password.current.value  = '';
                cpassword.current.value = '';
                setReloadCap(Helper.random());
                setShow(!show);
            }
            setTimeout(() => {
                setFSubmit(false);            
                dispatch(Features.hideLoader({show:"",display:'none'}));
            },100);
        });
    }

    const resendOTPHandler = () => {
        form.disable = true; 
        dispatch(Features.showLoader({show:"show",display:'block'})); 
        setFSubmit(true);
        setAlerts({...alerts,message:''}); 
        API.post('auth/password/validate/token',{token:token},(result)=>{
            if(result.status){
                startTimer(120)
                otp.current.value='';
                captcha.current.value='';
                setReloadCap(Helper.random())
                setTimeout(() => {
                    setSendOTP(false);
                }, 1000);
                setAlerts({...alerts,'message':result.message,'class':'success'}); 
            }else{
                setReloadCap(Helper.random());
                setAlerts({...alerts,'message':result.message,'class':'danger'}); 
                form.disable = true;             
                otp.current.value = '';
            }
            setTimeout(() => {
                setFSubmit(false);            
                dispatch(Features.hideLoader({show:"",display:'none'}));
            },100);
        });
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

    return(
        <div className='row justify-content-center'>
            <div className='shadow-lg bg-body col-xl-7 col-lg-5 col-md-6 col-sm-10 rounded  mt-5  mt-5 mb-5'>
                <div className="p-0">
                    <div className="row">
                        <div className="col-md-12 pt-4 ps-4">
                            <h3 className="text-center m-3 text-primary sec-title title-login">Reset Password?</h3>
                            <div className="text-start m-3">
                                <Alert alert={alerts} />
                                {
                                    (object !== null && object.status === false)
                                    ? <h3 className="text-danger text-center mt-5">
                                        <i className="fa-solid fa-link-slash mb-3"></i> <br />Oops! The link you followed has expired.
                                    </h3>
                                    : <div className="form">
                                        <div className={`${(show) ? '' : 'd-none'}`}>
                                            <div id="password-field" className="field-wrapper input mb-3">
                                                <Form.Password attr={{ ref: password, 'id': 'password', 'name': 'password', 'maxLength': '20', 'onChange': handleChange, 'onFocus': handleChange }} show={true} label="New Password" error={errors.password} mandatory={true} />
                                            </div>
                                            <div id="cpassword-field" className="field-wrapper input mb-3">
                                                <Form.Password attr={{ ref: cpassword, 'id': 'cpassword', 'name': 'cpassword', 'maxLength': '20', 'onChange': handleChange, 'onFocus': handleChange }} show={true} label="Confirm Password" error={errors.cpassword} mandatory={true} />
                                            </div>
                                        </div>
                                        <div className={`field-wrapper input mb-3 ${(!show) ? '' : 'd-none'}`}>
                                            <div id="otp-field" className={`field-wrapper input mb-3`}>
                                                <Form.Password attr={{ ref: otp, 'id': 'otp', 'name': 'otp', 'maxLength': '6', 'onChange': handleChange, 'onFocus': handleChange, 'ots': '', 'token': '' }} show={false} label="OTP" error={errors.otp} mandatory={true} />
                                                {(!sendOTP) && <p className="text-success">OTP valid time {<span className="forgot-pass-link text-primary float-end">{timer}</span>}</p>}
                                            </div>
                                            <div id="captcha-field" className="field-wrapper input mb-3">
                                                <Form.Captcha attr={{ ref: captcha, 'id': 'captcha', 'name': 'captcha', 'onChange': handleChange, 'onFocus': handleChange, 'otc': '' }} reloadCap={reloadCap} error={errors.captcha} />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="row p-1">
                                                <div className="col-md-12">
                                                    <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick': submitHandler }} className={`btn btn-primary float-end`} fSubmit={fSubmit} >
                                                        {(show) ? 'Submit' : <> Update Password <i className="fa-solid fa-lock"></i></>}
                                                    </Form.Button>
                                                    {
                                                        (sendOTP) &&
                                                        <Form.Button button={{ 'type': 'button', 'onClick': resendOTPHandler }} className={`me-2 btn btn-primary float-end`} fSubmit={fSubmit} >
                                                            Send OTP
                                                        </Form.Button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-12 pt-4 ps-4">
                            <PasswordRule />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin;