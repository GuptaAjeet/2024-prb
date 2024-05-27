import api from "../../utilities/api";
import { useState, useEffect } from "react";

const useActivityComponents = () => {
  const [response, setResponse] = useState(null);
  const url = "api/prabandhdata/active-master-list";

  useEffect(() => {
    // const subComponents    =   localStorage.getItem('activitymaster');
    // if(subComponents !== undefined && subComponents !==null){
    //     setResponse(JSON.parse(subComponents));
    // }else{
    api.post(url, null, (response) => {
      if (response.data !== undefined && response.data !== null) {
        // localStorage.setItem("subComponents", JSON.stringify(response.data));
        setResponse(response.data);
      }
    });
    // }
  }, [url]);

  return response;
};

export default useActivityComponents;
