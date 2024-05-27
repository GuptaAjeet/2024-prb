import { useEffect, useState } from "react";
import { APP_ENVIRONMENT, REACT_APP_TTL } from "../../../env";

const useAutoLogout = () => {
  const startTime = +REACT_APP_TTL * 60;
  const [timer, setTimer] = useState(startTime);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = (APP_ENVIRONMENT==="testing" ? "/testing" : "") +"/";
      }
    }, 1000);

    const resetTimeout = () => {
      setTimer(startTime);
    };

    const events = ["mousemove", "mousedown", "click", "scroll", "keypress"];

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }

    return () => {
      clearInterval(myInterval);
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
      }
    };
  });

  return timer;
};

export default useAutoLogout;
