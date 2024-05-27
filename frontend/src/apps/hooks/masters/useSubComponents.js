import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useSubComponents = () => {
    const [response, setResponse] = useState(null);
    const url = "api/prabandhdata/sub-component-list";

    useEffect(() => { 
        const subComponents    =   localStorage.getItem('subComponents');
        if(subComponents !== undefined && subComponents !==null){
            setResponse(JSON.parse(subComponents));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){
                    localStorage.setItem('subComponents',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useSubComponents;
