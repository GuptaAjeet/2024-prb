import { useState, useEffect } from "react";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import API from "../../utilities/api";

const usePost = request => {
    const loader       =    (request.loader !== undefined && request.loader === false) ? false : true;
    const [response, setResponse] = useState(null);
    const JSONString   =    JSON.stringify(request);
    const dispatch     =    useDispatch();

    useEffect(() => { 
        (loader) && dispatch(Features.showLoader({show:"show",display:'block'}));       
        const object =   JSON.parse(JSONString);
        API.post(object.url,object.data,(data)=>{
            (loader) && dispatch(Features.hideLoader({show:"",display:'none'}));
            setResponse(data); 
        })
    },[JSONString]);

    return response;
};

export default usePost;
