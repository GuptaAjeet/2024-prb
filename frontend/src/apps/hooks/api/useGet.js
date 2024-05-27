import { useState, useEffect } from "react";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import API from "../../utilities/api";

const useGet = (request) => {
  const [response, setResponse] = useState(null);
  const JSONString = JSON.stringify(request);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    const object = JSON.parse(JSONString);
    API.get(object.url, (data) => {
      dispatch(Features.hideLoader({ show: "", display: "none" }));
      setResponse(data);
    });
  }, [JSONString]);

  return response;
};

export default useGet;
