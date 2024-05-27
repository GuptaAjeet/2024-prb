import React from "react";
import MLogo from "../../../public/web/images/logo.svg";
import Samagra_Shiksha_Logo from "../../../public/web/images/Samagra_Shiksha_Logo_1.png";
import { Link } from "react-router-dom";

const MiddleBar = (props) => {
  return (
    <div className="mid-header pt-3 pb-3">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand" target="_blank" href="https://dsel.education.gov.in/" rel="noreferrer">
          <img className="img-fluid logo" src={MLogo} />
        </a>

        <div className="d-flex align-items-center">
          <Link to="/">
            <div className="pe-3 text-end border-end">
              <h3 className="mb-0">PRABANDH</h3>
              <p className="mb-0">
                {" "}
                <strong>P</strong>roject <strong>A</strong>ppraisal,{" "}
                <strong>B</strong>udgeting, <strong>A</strong>chievements a
                <strong>n</strong>d
                <br />
                <strong>D</strong>ata <strong>H</strong>andling System
              </p>
            </div>
          </Link>
          <div className="">
            {/* <h4>Samagra Shiksha</h4> */}
            <img className="img-fluid logo" src={Samagra_Shiksha_Logo} style={{width:"180px"}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddleBar;
