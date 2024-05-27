import React, { lazy, useEffect, useMemo, useRef, useState } from "react";
import { Hook, Helper, API } from "../../../../apps";
import Features from "../../../../redux/features";
import { useSelector, useDispatch } from "react-redux";
import "../../../../App.css";
import axios from "axios";
import { REACT_APP_URL } from "../../../../env";
import Btnloader from "../../../../apps/components/elements/Btnloader";
import ConfirmationDialog from "../../../../apps/components/form/ConfirmationDialog";
import { AgGridReact } from "ag-grid-react";
import sweetAlert from "../../../../apps/utilities/sweetalert";
import { UserManagementGrid } from "../../../../apps/utilities/GridHeaderColumns";
import api from "../../../../apps/utilities/api";


const Dashboard = () => {

  const user = Helper.auth.user;
  const [schoolDetails, setSchoolDetails] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(()=>{
    getSchoolDetail();
  }, [user])

  const getSchoolDetail = () =>{
    // API.post(`api/schools/school-detail`, {user_master_id: user?.user_master_id}, (res) => {
    API.post(`api/schools/school-detail`, {school_id: user?.school_id}, (res) => {
      if (res.status) {
        setSchoolDetails(res.data);
        getActivityList(res.data);
      }
    });
  } 

  const getActivityList = (currentUser) =>{
    API.post(`api/schools/activity-list`, {stateid: currentUser?.state_id, districtid : currentUser?.district_id, udise_sch_code: currentUser?.udise_sch_code }, (res) => {
      if (res.status) {
        setActivities(res.data);
      }
    });
  } 
  
  return (
    <div className="dashboard-main-content">
      
      <div className="dashboard-main-content__header mb-2" style={{ display: "flex", justifyContent: "space-between" }} >
        <h1>Basic Information</h1>
      </div>
      <div className="dashboard-main-content-info">
        <div className="row">
          {schoolDetails?.school_name && <div className="col-xl-12 col-lg-12 col-sm-12 ">
            <h4>{schoolDetails?.school_name}, {schoolDetails?.address} </h4>
            
            <div className="row">
              <div className="col-sm-1">
                <p>UDISE Code</p>
                {/* <p>School Category</p>
                <p>School Management</p> */}
                <p>Email-ID</p>
                <p>Address</p>
              </div>

              <div className="col-sm-5">
                <p>: {schoolDetails?.udise_sch_code}</p>
                {/* <p>: {schoolDetails?.udise_sch_code}</p>
                <p>: {schoolDetails?.udise_sch_code}</p> */}
                <p>: {schoolDetails?.email_id || schoolDetails?.email}</p>
                <p>: {schoolDetails?.address}</p>
              </div>

              <div className="col-sm-1">
                {/* <p>School Type</p>
                <p>School Status</p> */}
                <p>Pin code</p>
                <p>Class</p>
              </div>

              <div className="col-sm-5">
                {/* <p>: {schoolDetails?.udise_sch_code}</p>
                <p>: {schoolDetails?.udise_sch_code}</p> */}
                <p>: {schoolDetails?.pincode}</p>
                <p>: {schoolDetails?.class_frm} to {schoolDetails?.class_to}</p>
              </div>
            </div>

          </div>}
        </div>
      </div>

      <div className="dashboard-main-content__header mt-3 mb-2" style={{ display: "flex", justifyContent: "space-between" }} >
        <h1>Activities</h1>
      </div>
      <div className="dashboard-main-content-info">
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            List
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
