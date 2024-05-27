
import { useEffect, useState } from "react";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import API from "../../utilities/api";

const useLogout = request => {
    const [response, setResponse] = useState(null);
    const JSONString   =    JSON.stringify(request);
    const dispatch     =    useDispatch();
    
    useEffect(() => {      
        const object =   JSON.parse(JSONString);
        if(object.logout){
            dispatch(Features.showLoader({show:"show",display:'block'}));              
            API.post('auth/user/logout',object.data,(data)=>{
                if(data.status){
                    setTimeout(() => {    
                        localStorage.clear();
                        sessionStorage.clear();
                        setResponse(true); 
                        dispatch(Features.hideLoader({show:"",display:'none'}));
                    },200);
                }
            })
        }
    },[JSONString]);

    return response;
};

export default useLogout
