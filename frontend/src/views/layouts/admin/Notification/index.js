import { useState, useEffect, Fragment } from "react";
import api from "../../../../apps/utilities/api";
import { Helper } from "../../../../apps";

const Notification = () => {
  const user = Helper.auth.user;
  const [showList, setShowList] = useState(false);
  const [bgClass, setBgClass] = useState("bg-danger");
  const [intervalID, setIntervalID] = useState(0);
  const [globalMSG, setGlobalMSG] = useState("");

  useEffect(() => {
    const intervalValue = setInterval(() => {
      setBgClass((prevClass) =>
        prevClass === "bg-danger" ? "bg-info" : "bg-danger"
      );
    }, 250);
    setIntervalID(intervalValue);

    // const apiIntervalValue = setInterval(() => {
    //   api.post(
    //     "api/prabandh/notification",
    //     { data: user, type: "get" },
    //     (res) => {
    //       if (res?.data?.length > 0) {
    //         const g = res.data.filter((r) => r.type === "GLOBAL");
    //         if (g.length > 0) {
    //           setGlobalMSG(g[0].message);
    //           setShowList(true);
    //           setIntervalID(1);
    //         }
    //       } else {
    //         setGlobalMSG("");
    //         setShowList(false);
    //         setIntervalID(0);
    //       }
    //     }
    //   );
    // }, 30000);

    return () => {
      //clearInterval(intervalValue);
      //clearInterval(apiIntervalValue);
    };
  }, []);

  const handleButtonClick = () => {
    if (intervalID !== 0) {
      setShowList(!showList);
    }
  };

  const messageMarkedRead = () => {
    //clearInterval(intervalID);
    //setIntervalID(0);
    setShowList(!showList);
  };

  const closeNotification = () => {
    setShowList(false);
  };

  return (
    <Fragment>
      {intervalID !== 0 && globalMSG !== "" && (
        <Fragment>
          <button
            className="badge text-bg-light position-relative"
            style={{ float: "right" }}
            onClick={handleButtonClick}
          >
            <i className="bi bi-bell-fill"></i>

            <span
              className={`position-absolute top-0 start-100 translate-middle p-2 ${bgClass} border border-light rounded-circle`}
            >
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
          <ul>
            {" "}
            {/* can be multiple in future */}
            {showList && (
              <Fragment>
                <li>
                  <span
                    className="list-group"
                    style={{
                      position: "fixed",
                      right: "150px",
                      zIndex: "1000",
                      boxShadow: "2px 2px 10px darkgoldenrod",
                    }}
                  >
                    <span
                      className={`list-group-item list-group-item-action ${bgClass}`}
                      style={{
                        width: "250px",
                        color: "#000 !important",
                        textAlign: "justify",
                        /* background: "gold", */
                        fontSize: "12px",
                      }}
                    >
                      <span className="notification_msg">{globalMSG}</span>
                      <span
                        className="badge rounded-pill text-bg-dark ms-2"
                        /* onClick={messageMarkedRead} */
                        onClick={closeNotification}
                      >
                        Close {/* Mark as Read */}
                      </span>
                    </span>
                  </span>
                </li>
              </Fragment>
            )}
          </ul>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Notification;
