import React, { Fragment } from "react";
import MiddleBar from "../../web/middle-bar";
import { Loader, Toast } from "../../../../apps/components/elements";
import Logo from "../../../../public/web/images/nic.png";
import NicText from "../../../../apps/components/elements/nictext";
import "./App.css";

const Layout = (props) => {
  return (
    <Fragment>
      <header className="header">
        <MiddleBar />
      </header>
      <div className="container p-4">
        <div id="content">
          {/* <Loader /> */}
          {props.children}
        </div>
        <Toast />
      </div>
      <footer
        className="footer1 text-white pt-3 ps-3 pe-3"
        style={{ background: "#1d477a" }}
      >
        <div className="row">
          <div className="col-sm-6">
            <img src={Logo} />
          </div>
          <div className="col-sm-6 text-start">
            <NicText flag={1} />
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Layout;
