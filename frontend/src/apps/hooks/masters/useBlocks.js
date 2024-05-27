import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useBlocks = () => {
    const [response, setResponse] = useState(null);
    const url = "api/blocks/list";
    useEffect(() => { 
        const blocks    =   localStorage.getItem('blocks');
        if(blocks !== undefined && blocks !==null){
            setResponse(JSON.parse(blocks));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){
                    localStorage.setItem('blocks',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useBlocks;