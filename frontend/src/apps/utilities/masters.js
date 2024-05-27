import api from "./api";
import helper from "./helper";
const masters = {
  getStates: (callback) => {
    const states = localStorage.getItem("state");
    if (states !== undefined && states !== null) {
      callback(JSON.parse(states));
    } else {
      masters.getHandler("api/states/list", (response) => {
        localStorage.setItem("state", JSON.stringify(response));
        callback(response);
      });
    }
  },
  getDistricts: (callback, id) => {
    const districts = localStorage.getItem("districts");
    if (typeof districts !== undefined && districts !== null) {
      if (Object.keys(districts).length > 0) {
        callback(
          JSON.parse(districts).filter((item) => {
            return item.state_id == id;
          })
        );
      }
    } else {
      masters.getHandler("auth/districts/list/" + id, (response) => {
        localStorage.setItem("districts", JSON.stringify(response));
        callback(
          response.filter((item) => {
            return parseInt(item.state_id) === parseInt(id);
          })
        );
      });
    }
  },
  getBlocks: (callback, data) => {
    const blocks = localStorage.getItem("blocks");
    if (blocks !== undefined && blocks !== null) {
      if (Object.keys(blocks).length > 0) {
        const blockData = helper.blockFilter(blocks, data);
        callback(blockData);
      }
    } else {
      masters.postHandler("auth/blocks/list", data, (response) => {
        localStorage.setItem("blocks", JSON.stringify(response));
        callback(helper.blockFilter(response, data));
      });
    }
  },
  getRoles: (callback) => {
    const roles = localStorage.getItem("roles");
    if (roles !== undefined && roles !== null) {
      callback(JSON.parse(roles));
    } else {
      masters.getHandler("auth/roles/list", (response) => {
        localStorage.setItem("roles", JSON.stringify(response));
        callback(response);
      });
    }
  },
  getDesignations: (callback) => {
    const roles = localStorage.getItem("designations");
    if (roles !== undefined && roles !== null) {
      callback(JSON.parse(roles));
    } else {
      masters.getHandler("auth/designations/list", (response) => {
        localStorage.setItem("roles", JSON.stringify(response));
        callback(response);
      });
    }
  },
  getServerIP: (callback) => {
    setInterval(
      api.get("ip", null, (response) => {
        callback(response.data);
      }),
      30000
    );
  },
  logout: (callback) => {
    api.post("auth/logout", null, (result) => {
      if (result.status === true) {
        callback(result.data);
      }
    });
  },
  validate: (callback) => {
    api.get("validate/token", null, (result) => {
      callback(result);
    });
  },
  getHandler: (url, callback) => {
    alert(6);
    api.get(url, null, (result) => {
      if (result.status === true) {
        callback(result.data);
      }
    });
  },
  downloadServerFile: (url, data, callback) => {
    api.post(url, data, (result) => {
      callback("complete");
      if (result.status === true) {
        const link = document.createElement("a");
        link.download = result.filename;
        link.href = result.data;
        link.click();
      } else {
        alert("Error, Something went wrong ");
      }
    });
  },
  postHandler: (url, data, callback) => {
    api.post(url, data, (result) => {
      if (result.status === true) {
        callback(result.data);
      }
    });
  },
};

export default masters;
