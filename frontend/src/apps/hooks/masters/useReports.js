import { Helper } from "../..";
import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useReports = () => {
    const [response, setResponse] = useState(null);
    let userRoleData = Helper.auth?.user?.user_role_id;
    const url = "api/reports/list";

    useEffect(() => {
        api.post(url, { user_role_id: userRoleData }, (response) => {
            if (response.data !== undefined && response.data !== null) {
                setResponse(response.data);
            }
        });
    }, [url, userRoleData]);

    return response;

};

export default useReports;