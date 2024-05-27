import helper from "../../utilities/helper";
//import fileDownload from 'js-file-download';
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
import { REACT_APP_URL } from "../../../env/";

const useDownloader = (request) => {
  const dispatch = useDispatch();

  if (request.data.id > 0) {
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    const header = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${helper.token()}`,
      },
      body: JSON.stringify(request.data),
    };

    fetch(REACT_APP_URL + request.url, header)
      .then((res) => {
        dispatch(Features.hideLoader({ show: "", display: "none" }));
        return res.blob();
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "certificate.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      })
      .catch((err) => {
        return Promise.reject({ Error: "Something Went Wrong", err });
      });
  }
};

export default useDownloader;
