import React, { useEffect, useRef, useState } from "react";
import { API, Form, Helper, Hook, Rules } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import PasswordRule from "../../../apps/components/elements/password-rules";

const UpdatePassword = (props) =>{
    const dispatch     = useDispatch();
    const captcha      = useRef(); 
    const password     = useRef(); 
    const cpassword    = useRef(); 
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

    const updatePasswordHandler = () =>{
        dispatch(Features.showLoader({show:"show",display:'block'})); 
        setFSubmit(true);
        const flag = (props.flag).toLowerCase();
        const data = {
            'password':password.current.value,'flag':flag,'otc':captcha.current.otc,'captcha':captcha.current.value
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
                captcha.current.value = '';                   
                setReloadCap(Helper.random())
            }
            setTimeout(() => {
                setFSubmit(false);            
                dispatch(Features.hideLoader({show:"",display:'none'}));
            },100);
        });
    }

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
                            <div className="form">
                                <div id="password-field" className="field-wrapper input mb-3">
                                    <Form.Password attr={{ ref: password, 'id': 'password', 'name': 'password', 'maxLength': '20', 'onChange': handleChange, 'onFocus': handleChange }} show={true} label="New Password" error={errors.password} mandatory={true} />
                                </div>
                                <div id="cpassword-field" className="field-wrapper input mb-3">
                                    <Form.Password attr={{ ref: cpassword, 'id': 'cpassword', 'name': 'cpassword', 'maxLength': '20', 'onChange': handleChange, 'onFocus': handleChange }} show={true} label="Confirm Password" error={errors.cpassword} mandatory={true} />
                                </div>
                                <div id="captcha-field" className="field-wrapper input mb-3">
                                    <Form.Captcha attr={{ ref: captcha, 'id': 'captcha', 'name': 'captcha', 'onChange': handleChange, 'onFocus': handleChange, 'otc': '' }} reloadCap={reloadCap} error={errors.captcha} />
                                </div>
                                <div className="mt-3">
                                    <div className="row p-1">
                                        <div className="col-md-12">
                                            <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick': updatePasswordHandler }} className={`btn btn-primary float-end`} fSubmit={fSubmit} >
                                                Update Password 
                                            </Form.Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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