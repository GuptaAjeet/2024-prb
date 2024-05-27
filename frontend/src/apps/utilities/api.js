import Hash from "../utilities/hash";
import helper from "./helper";
// import { useNavigate } from "react-router-dom";
import { APP_ENVIRONMENT, REACT_APP_URL } from "../../env";
import { useDispatch } from "react-redux";
import store from ".././../redux/app/store";
import Swal from "sweetalert2";
import features from "../../redux/features";
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

const api = {
  get: (url, data, callback) => {
    api.handle(url, "get", data, (response) => {
      callback(response);
    });
  },
  post: (url, data, callback) => {
    api.handle(url, "post", data, (response) => {
      callback(response);
    });
  },
  put: (url, data, callback) => {
    api.handle(url, "put", data, (response) => {
      callback(response);
    });
  },
  patch: (url, data, callback) => {
    api.handle(url, "patch", data, (response) => {
      callback(response);
    });
  },
  delete: (url, data, callback) => {
    api.handle(url, "delete", data, (response) => {
      callback(response);
    });
  },
  handle: (url, method, data = null, callback) => {
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    //const progressMonth = store.getState().month.month;
    const progressMonth = localStorage.getItem("progress_month") ?? 0;
    const dietProgressMonth = localStorage.getItem("diet_progress_month") ?? 0;
    var header = {};
    header.method = method;
    header.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${helper.token()}`,
      API_Year: apiYear,
      API_Version: apiVersion,
      PROGRESS_MONTH: progressMonth,
      DIET_PROGRESS_MONTH: dietProgressMonth,
    };
    if (data !== null) {
      header.body = JSON.stringify({
        data: data,
        secure: Hash.encrypt(JSON.stringify(data)),
      });
    }

    api.callApi(url, header, (response) => {
      callback(response);
    });
  },
  file: (url, data = null, callback) => {
    var fromData = {
      headers: { Authorization: `Bearer ${helper.token()}` },
      method: "post",
      body: data,
    };
    api.callApi(url, fromData, (response) => {
      callback(response);
    });
  },
  callApi: async (url, data, callback) => {

    await fetch(REACT_APP_URL + url, data).then((result) => {
    
    
      if(result?.status===400 ){
      return  result.json().then((response) => {
          callback(response);
        });
      }
      if(result?.status===500 ){
        // Swal.fire({
        //   title: 'Error!',
        //   text: 'There was an error processing your request.',
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
       
      return  result.json().then((response) => {
          callback(response);
        });
      }
      if (result?.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href =
          (APP_ENVIRONMENT === "testing" ? "/testing" : "") + "/";
      } else {
        result.json().then((response) => {
          callback(response);
        });
      }
    }).catch((e)=>{
    
      
      if(e.result===undefined){
        // Swal.fire({
        //   title: 'Error!',
        //   text: 'There was an error processing your request.',
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
        return e
      }
    });
  },
  download: async (url, data, callback) => {
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    const header = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${helper.token()}`,
        API_Year: apiYear,
        API_Version: apiVersion,
      },
      body: JSON.stringify({ secure: Hash.encrypt(JSON.stringify(data)) }),
    };

    await fetch(REACT_APP_URL + url, header)
      .then((res) => {
        callback(res);
        return res.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute(
          "download",
          data?.filename ||
            data?.activityObj?.activity_master_details_name + ".csv"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        return Promise.reject({ Error: "Something Went Wrong", err });
      });
  },
  upload: async (url, file, secureData, callback) => {
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("secure", Hash.encrypt(JSON.stringify(secureData)));

    const header = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${helper.token()}`,
        API_Year: apiYear,
        API_Version: apiVersion,
        APPLICATION: localStorage.getItem("application"),
      },
      body: formData,
    };

    try {
      const response = await fetch(REACT_APP_URL + url, header);
      const data = await response.json();

      if (typeof callback === "function") {
        callback(data);
      }

      if (!response.ok) {
        return Promise.reject({ Error: "Upload Failed", data });
      }

      return data;
    } catch (err) {
      return Promise.reject({ Error: "Something Went Wrong", err });
    }
  },
};

export default api;
