import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useMajorComponents = () => {
    const [response, setResponse] = useState(null);
    const url = "api/prabandhdata/major-component-list";

    useEffect(() => { 
        const majorComponents    =   localStorage.getItem('majorComponents');
        if(majorComponents !== undefined && majorComponents !==null){
            setResponse(JSON.parse(majorComponents));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){
                    localStorage.setItem('majorComponents',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useMajorComponents;