import { useState, useEffect } from "react";
import Features from "../../../redux/features/loader";
import { useDispatch } from "react-redux";
import API from "../../utilities/api";

const useDelete = request => {
    const [response, setResponse] = useState(null);
    const JSONString   =    JSON.stringify(request);
    const dispatch     =    useDispatch();
    
    useEffect(() => { 
        dispatch(Features.showLoader({show:"show",display:'block'}));       
        const object =   JSON.parse(JSONString);
        API.delete(object.url,object.data,(data)=>{
            setResponse(data);
            setTimeout(() => {                
                dispatch(Features.hideLoader({show:"",display:'none'}));
            },200);
        })
    },[JSONString]);

    return response;
};

export default useDelete;