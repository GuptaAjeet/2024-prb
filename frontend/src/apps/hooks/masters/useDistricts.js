import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useDistricts = () => {
    const [response, setResponse] = useState(null);
    const url   =   "api/districts/list";

    useEffect(() => { 
        const districts    =   localStorage.getItem('districts');
        if(districts !== undefined && districts !==null){
            setResponse(JSON.parse(districts));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){
                    localStorage.setItem('districts',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useDistricts;