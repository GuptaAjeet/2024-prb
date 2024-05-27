import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../../../views/layouts/admin";
import Features from "../../../../redux/features";
import { useDispatch, useSelector } from "react-redux";
import { APP_ENVIRONMENT } from "../../../../env";
function AdminGuard(props) {
  const isSignedIn = localStorage.getItem("login");
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);

  if (!isSignedIn) {
    const title = `Admin Login`;
    localStorage.setItem("label", title);
    dispatch(Features.setLabel({ title: title }));

    return <Navigate to="/" replace />;
  }

  if (
    APP_ENVIRONMENT === "testing" &&
    !window.location.href.includes("testing")
  ) {
    return <Navigate to={`/testing${window.location.pathname}`} replace />;
  }

  function isUrlExistInObjects(url) {
    // Iterate over each object in the array
    for (const obj of menu) {
        // Check if the URL exists in the current object's 'url' property
        if (obj.url === url) {
            return true;
        }
        // Check if the URL exists in any 'smp_url' property within 'parent_sm'
        if (obj.parent_sm && Array.isArray(obj.parent_sm)) {
            for (const subItem of obj.parent_sm) {
                if (subItem.smp_url === url) {
                    return true;
                }
            }
        }
    }
    // If the URL does not exist in any object, return false
    return false;
  }

  let skipValidationRuls = [
    "/auth/admin",
    "/auth/prabandh/report",
    "/auth/prabandh/report/view-state-report",
    "/auth/prabandh/report/matrixreport",
    "/auth/prabandh/report/recommendation",
    "/auth/prabandh/report/recommendation-detail",
    "/auth/prabandh/report/spilloverreport",
    "/auth/prabandh/report/expenditure-report",
    "/auth/prabandh/report/ppt-report",
    
    "/auth/prabandh/ticket",
  ]

  // if(menu.length && !isUrlExistInObjects(window.location.pathname) && skipValidationRuls.indexOf(window.location.pathname)<0 ){
  //   return <Navigate to="/" replace />;
  // }
  
  // if((module && !window.location.href.includes(module)) || (!module && (window.location.href.includes("progress") || window.location.href.includes("allocation"))) ){
  //   return <Navigate to={`/`} replace />;
  // }

  /*     if(Helper.token() !==null && Helper.auth.flag === 'volunteer') {
        return <Navigate to="/auth/volunteer" replace />
    }
    
    if(Helper.token() !==null && Helper.auth.flag === 'school') {
        return <Navigate to="/auth/school" replace />
    } */

  return <Layout>{props.children}</Layout>;
}

export default AdminGuard;
