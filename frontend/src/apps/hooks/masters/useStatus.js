import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useStatus = () => {
  const [response, setResponse] = useState(null);
  const url = "api/status/detailed-list";
  useEffect(() => {
      api.get(url, null, (response) => {
        if (response.data !== undefined && response.data !== null) {
          setResponse(response.data);
        }
      });
  }, [url]);

  return response;
};

export default useStatus;