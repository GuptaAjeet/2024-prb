import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useYears = () => {
  const [response, setResponse] = useState(null);
  const url = "api/years/list";
  useEffect(() => {
    const years = localStorage.getItem("years");
    if (years !== undefined && years !== null) {
      setResponse(JSON.parse(years));
    } else {
      api.get(url, null, (response) => {
        if (response.data !== undefined && response.data !== null) {
          localStorage.setItem("years", JSON.stringify(response.data));
          setResponse(response.data);
        }
      });
    }
  }, [url]);

  return response;
};

export default useYears;
