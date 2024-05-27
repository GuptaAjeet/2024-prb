import { useState, useEffect } from "react";
import helper from "../../utilities/helper";

const usePostFile = request => {
    const [response, setResponse] = useState(null);
    const JSONString   =   JSON.stringify(request);
    
    useEffect(() => {
        const object =   JSON.parse(JSONString);
        const header = {
            method: 'PUT', 
            headers: {
                "Accept": "application/json",
                "Authorization" : `Bearer ${helper.token()}`,
            },
            body: JSON.stringify(object.data)
        };
        fetch(object.url,header).then((res) => res.json()).then((data) => setResponse(data));
    },[JSONString]);

    return response;
};

export default usePostFile;

