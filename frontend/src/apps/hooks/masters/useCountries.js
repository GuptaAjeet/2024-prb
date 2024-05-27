import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useCountries = () => {
    const [response, setResponse] = useState(null);
    const url = "api/countries/list";
    useEffect(() => { 
        const countries    =   localStorage.getItem('countries');
        if(countries !== undefined && countries !==null){
            setResponse(JSON.parse(countries));
        }else{
            api.get(url,null,(response)=>{
                if(response.data !== undefined && response.data !==null){
                    localStorage.setItem('countries',JSON.stringify(response.data));
                    setResponse(response.data);
                }
            })
        }        
    },[url]);

    return response;
};

export default useCountries;