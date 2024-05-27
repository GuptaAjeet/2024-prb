import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useDesignations = () => {
    const [response, setResponse] = useState(null);
    const url = "api/designations/list";

    useEffect(() => { 
        const designations    =   localStorage.getItem('designations');
        if(designations !== undefined && designations !==null){
            setResponse(JSON.parse(designations));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){                    
                    localStorage.setItem('designations',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useDesignations;