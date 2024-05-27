
import { useState, useEffect } from "react";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
//import API from "../../utilities/api";

const useLogin = request => {
    const [response, setResponse] = useState(null);
    const JSONString   =    JSON.stringify(request);
    const dispatch     =    useDispatch();
    
    useEffect(() => {       
        const object =   JSON.parse(JSONString);
        if(object.login){
            dispatch(Features.showLoader({show:"show",display:'block'})); 
            //API.post(object.url,object.data,(data)=>{

                localStorage.setItem("login",true);
                localStorage.setItem("token",'admin'); 
                setResponse(true);         
                dispatch(Features.hideLoader({show:"",display:'none'}));
            //})
        }
    },[JSONString]);

    return response;
};

export default useLogin;