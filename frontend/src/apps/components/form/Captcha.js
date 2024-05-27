import React, { useEffect, useState } from 'react';
//import Text from './Text';
import { Hook } from '../../../apps';
import Label from '../elements/label';
import { REACT_APP_URL } from '../../../env';

const Captcha =(props)=>{
    const key                 =   props.reloadCap;
    const inputErr            =   (props.error !== undefined) ? props.error : '';
    const inputBorder         =   (props.error !== undefined && props.error.valid === false) ? 'border border-danger': '';
    const [refresh,setRefresh]  =   useState(0);
    const [captcha,CCode]       =   Hook.useCaptcha(refresh);

    useEffect(()=>{
        if(CCode !== null){
            props.attr.ref.current.otc = CCode;
        }
        if(key){
            setRefresh(key);
        }
        props?.setToPerantCaptcha(captcha);
    },[CCode,key])
    
    const reloadCaptcha =()=>{
        setRefresh((new Date()).getTime());
    }
    const captch_copy_diable= REACT_APP_URL.includes("localhost") 
    //CLASS FOR CAPTCHA NOT SLEECT= captch_select_diable 
    return(
        <div id="captcha-field" className="field-wrapper input">
            {
                (captcha !==null) &&
                <>
                    <Label mandatory={true} error={inputErr}>Captcha</Label>
                    <div className={`input-group`}>                
                        <input type='text' {...props.attr} maxLength={6} autoComplete="off" className={`form-control ${inputBorder}`} />
                        <div className="input-group-append">
                            <span className={`p-0 input-group-text bg-light ${inputBorder} ps-3 pe-3 ${captch_copy_diable ? "":"captch_select_diabl"}`} >
                                {captcha}
                                {/* <img src='' alt={captcha} className="" id='captcha' style={style} draggable="false" /> */}
                            </span>
                            <span className={`input-group-text ${inputBorder}`}>
                                <i className="fas fa-redo text-primary" style={{'fontSize':'18px'}} onClick={reloadCaptcha}></i>
                            </span>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
export default Captcha;