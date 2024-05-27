import React, { useEffect } from "react";
import Routers from "./routes";
import "./App.css";
import { useDispatch } from "react-redux";
import { Helper } from "./apps";
import { APP_ENVIRONMENT } from "./env";
import features from "./redux/features";

function App() {
  const dispatch = useDispatch();

  // useEffect(()=>{
  
  // },[])

  useEffect(() => {
    // window.addEventListener("beforeunload", (e) =>{
    //     e.preventDefault();
    //     localStorage.clear();
    //     sessionStorage.clear();
    //     return e.returnValue = 'Are you sure you want to close?';
    // });
    const yr = localStorage.getItem("selected_year");
    yr && dispatch(features.setYear({ year: yr }));

    window.addEventListener("popstate", (e) => {
      e.preventDefault();
      window.history.go(1);
    });

    // document.addEventListener('contextmenu', event => event.preventDefault());
    // document.onkeydown = function (e) {
    //     if((e.keyCode == 123) ||(e.ctrlKey && e.shiftKey && (e.keyCode ==73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
    //         return false;
    //     }
    // }
  }, []);

  var sessionStorage_transfer = function (event) {
    if (!event) {
      event = window.event;
    }
    if (!event.newValue) return;
    if (event.key === "getSessionStorage") {
      localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
      localStorage.removeItem("sessionStorage");
    } else if (event.key === "sessionStorage" && !sessionStorage.length) {
      var data = JSON.parse(event.newValue);
      for (var key in data) {
        sessionStorage.setItem(key, data[key]);
      }
    }
  };

  setInterval(() => {
    if (Helper.token() !== null) {
      var loginTime = localStorage.getItem("loginTime");
      if (loginTime == null) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href =
          (APP_ENVIRONMENT === "testing" ? "/testing" : "") + "/";
      }
    }
  }, 10);

  // listen for changes to localStorage
  if (window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
  } else {
    window.attachEvent("onstorage", sessionStorage_transfer);
  }

  // Ask other tabs for session storage (this is ONLY to trigger event)
  if (!sessionStorage.length) {
    localStorage.setItem("getSessionStorage", "foobar");
    localStorage.removeItem("getSessionStorage", "foobar");
  }

  return <Routers />;
}

export default App;
