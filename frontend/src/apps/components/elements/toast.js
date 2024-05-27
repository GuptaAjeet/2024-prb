import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../../../redux/features/toast";

const Toast = () => {
  const [timer, setTimer] = useState(true);

  const dispatch = useDispatch();
  const object = useSelector((state) => state.toast);

  const closeHandler = () => {
    dispatch(hideToast({ show: "", message: "" }));
    setTimer(false);
  };

  if (object.message !== "" && timer) {
    setInterval(function () {
      dispatch(hideToast({ show: "", message: "" }));
      setTimer(false);
    }, 5000);
  }
  const flag = object.flag==='info'?'bg-info':object.flag || "bg-success"

  return (
    <div
     // className={`toast ${object.show} ${object.flag} ? bg-${object.flag} : bg-success `}
      className={`toast ${object.show} ${flag}  `}
      style={{ position: "fixed", top: 45, right: 10, zIndex: 999999 }}
    >
      <div className="d-flex">
        <div className={`toast-body`}>
          {object.message}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={closeHandler}></button>
      </div>

      {/* <div className="toast-body p-0">
        <div className="row p-3 ps-1">
          <div className="col-md-10 p-2 text-center text-white">
            {object.message}
          </div>
          <div className="col-md-2">
            <button
              onClick={closeHandler}
              style={{
                border: "1px solid #5c5c5c",
                boxShadow: "2px 2px 3px #5c5c5c",
                background: "#fff",
                borderRadius: "5px",
              }}
            >
              <span>X</span>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Toast;
