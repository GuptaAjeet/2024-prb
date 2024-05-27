import React, { useEffect, useState } from "react";
import { Helper, API } from "../../../apps";
import { Link } from "react-router-dom";
import SchoolDashboardData from "./SchoolDashboardData";

const SchoolDashboard = () => {

    const user = Helper.auth.user;
    const [schoolDetails, setSchoolDetails] = useState({});
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        getSchoolDetail();
    }, [user])

    const getSchoolDetail = () => {
        // API.post(`api/schools/school-detail`, {user_master_id: user?.user_master_id}, (res) => {
        API.post(`api/schools/school-detail`, { school_id: user?.udise_code }, (res) => {
            if (res.status) {
                setSchoolDetails(res.data);
                getActivityList(res.data);
            }
        });
    }

    const getActivityList = (currentUser) => {
        API.post(`api/schools/activity-list`, { stateid: currentUser?.state_id, districtid: currentUser?.district_id, udise_sch_code: currentUser?.udise_sch_code }, (res) => {
            if (res.status) {
                setActivities(res.data);
            }
        });
    }

    // const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })

    return (
         <div className="dashboard-main-content">
            {schoolDetails?.school_name ? <>
                <div className="dashboard-main-content__header mb-2" style={{ display: "flex", justifyContent: "space-between" }} >
                    <h1>Basic Information</h1>
                </div>

                <div className="dashboard-main-content-info">
                    <div className="row">
                        {schoolDetails?.school_name && <div className="col-xl-12 col-lg-12 col-sm-12 ">
                            {/* <h4>{schoolDetails?.school_name}, {schoolDetails?.address} </h4> */}
                            <h4>{schoolDetails?.school_name}</h4>

                            <table className="table table-bordered mb-0">
                                <tbody>
                                    <tr>
                                        <th>UDISE Code</th>
                                        <td>{schoolDetails?.udise_sch_code}</td>
                                        <th>Pin code</th>
                                        <td>{schoolDetails?.pincode}</td>
                                    </tr>

                                    <tr>
                                        <th>Address</th>
                                        <td>{schoolDetails?.address}</td>
                                        <th>Class</th>
                                        <td>{schoolDetails?.class_frm} to {schoolDetails?.class_to}</td>
                                    </tr>
                                </tbody>
                            </table >

                            {/* <div className="row">
                                <div className="col-sm-1">
                                    <p>UDISE Code</p>
                                    <p>Email-ID</p>
                                    <p>Address</p>
                                </div>

                                <div className="col-sm-5">
                                    <p>: {schoolDetails?.udise_sch_code}</p>
                                    <p>: {schoolDetails?.email_id || schoolDetails?.email}</p>
                                    <p>: {schoolDetails?.address}</p>
                                </div>

                                <div className="col-sm-1">
                                    <p>Pin code</p>
                                    <p>Class</p>
                                </div>

                                <div className="col-sm-5">
                                    <p>: {schoolDetails?.pincode}</p>
                                    <p>: {schoolDetails?.class_frm} to {schoolDetails?.class_to}</p>
                                </div>
                            </div> */}

                        </div>}
                    </div>
                </div>

                <div className="dashboard-main-content__header mt-3 mb-2" style={{ display: "flex", justifyContent: "space-between" }} >
                    <h1>Activities</h1>
                </div>

                <div className="dashboard-main-content-info">
                    <SchoolDashboardData />
                </div>
            </> : <div className="text-center mt-5">
                <h1 className="text-danger">Please contact the System Administrator.</h1>
                <h5 className="mt-5">No data found.</h5>
            </div>}
        </div>
    );
}

export default SchoolDashboard;