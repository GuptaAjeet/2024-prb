import React, { useState } from "react";
import $ from "jquery";
const NicText = (props) => {
  const [mode, setMode] = useState("Dark");
  const changeMode = () => {
    if (mode === "Dark") {
      setMode("Light");
      $("body").css("filter", "invert(1)");
    } else {
      setMode("Dark");
      $("body").css("filter", "invert(0)");
    }
  };
  return (
    <>
      <p>
        This site is designed, developed, maintained and hosted by National
        Informatics Centre (<span onClick={changeMode}>NIC</span>),{" "}
        {props.flag !== undefined} Ministry of Electronics &amp; Information
        Technology. Government of India.
      </p>
      {props.flag === undefined && (
        <p>
          This Website belongs to Department of School Education &amp; Literacy,
          Ministry of Education, Government of India.
        </p>
      )}
    </>
  );
};

export default NicText;
