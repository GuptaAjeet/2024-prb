import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useRoles = () => {
    const [response, setResponse] = useState(null);
    const url = "api/roles/list";
    useEffect(() => { 
        const roles    =   localStorage.getItem('roles');
        if(roles !== undefined && roles !==null){
            setResponse(JSON.parse(roles));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){
                    localStorage.setItem('roles',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useRoles;