import { useState } from "react";
import api from "../../utilities/api";

const useSchemes = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = () => {
    try {
      setLoading(true);
      api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
        setList(res.data);
        setLoading(false);
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return { list, loading, fetchList };
};
export default useSchemes;
