import axios from "axios";
import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useCaptcha = (reload, url) => {
    const [captcha,setCaptcha]    = useState(null);
    const [ccode,setCaptchaCode]  = useState(null);
    useEffect(() => {  
        if(url){
            axios.get(url).then((result)=>{
                setCaptcha(result.data.captcha);
                setCaptchaCode(result.data.OTC);
            });
        }else{
            api.get("auth/captcha",null,(result)=>{
                setCaptcha(result.captcha);
                setCaptchaCode(result.OTC);
            })  
        }       
        
    },[reload]);

    return [captcha,ccode];
};

export default useCaptcha;