import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useStates = () => {
  const [response, setResponse] = useState(null);
  const url = "api/states/list";
  useEffect(() => {
    const states = localStorage.getItem("states");
    if (states !== undefined && states !== null) {
      setResponse(JSON.parse(states));
    } else {
      api.get(url, null, (response) => {
        if (response.data !== undefined && response.data !== null) {
          localStorage.setItem("states", JSON.stringify(response.data));
          setResponse(response.data);
        }
      });
    }
  }, [url]);

  return response;
};

export default useStates;
