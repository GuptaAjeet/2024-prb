import { useState, useEffect } from "react";
import api from "../../utilities/api";

const useDIETs = (district_state_id) => {
    const [response, setResponse] = useState(null);
    const url = "api/diet/list";

    useEffect(() => {
        api.post(url, {district_state_id}, (response) => {
            if (response.data !== undefined && response.data !== null) {
                setResponse(response.data);
            }
        })
    }, [url]);

    return response;
};
export default useDIETs;
