import React, { lazy, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { Loader, Toast } from "../../../apps/components/elements";

const Hader = lazy(() => import("./header"));
const Footer = lazy(() => import("./footer"));

const Layout = (props) => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <Fragment>
      <Hader size={props.size} />
      <div className="">
        <Loader />
        {props.children}
        <Toast />
      </div>
      <Footer />
      {/* <a href="javascript:void(0);" className="backtotop" title="Back to top">
        {" "}
        <i className="fa fa-arrow-up" />
      </a> */}
    </Fragment>
  );
};

export default Layout;
