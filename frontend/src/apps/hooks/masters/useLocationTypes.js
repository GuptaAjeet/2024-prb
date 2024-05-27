import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useLocationTypes = () => {
    const [response, setResponse] = useState(null);
    const url = "api/school-types/list";
    useEffect(() => { 
        setResponse([{'id':1,'name':'Rural'},{'id':2,'name':'Urban'},{'id':9,'name':'Other'}]);
        // const locationtype    =   localStorage.getItem('locationtype');
        // if(locationtype !== undefined && locationtype !==null){
        //     setResponse(JSON.parse(locationtype));
        // }else{
        //     api.get(url,null,(response)=>{
        //         if(response.data !== undefined && response.data !==null){
        //             localStorage.setItem('locationtype',JSON.stringify(response.data));
        //             setResponse(response.data);
        //         }
        //     })
        // }        
    },[url]);
    return response;
};

export default useLocationTypes;