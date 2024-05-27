import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useGender = () => {
  const [response, setResponse] = useState(null);
  const url = "api/genders/list";
  useEffect(() => {
    const genders = localStorage.getItem("genders");
    if (genders !== undefined && genders !== null) {
      setResponse(JSON.parse(genders));
    } else {
      api.get(url, null, (response) => {
        if (response.data !== undefined && response.data !== null) {
          localStorage.setItem("genders", JSON.stringify(response.data));
          setResponse(response.data);
        }
      });
    }
  }, [url]);
  return response;
};

export default useGender;
