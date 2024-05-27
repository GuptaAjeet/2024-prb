import React from "react";
import { Helper } from "../../../apps";
import { useSelector } from "react-redux";
import PlanDashboard from "./PlanDashboard";
import AllocationDashboard from "./AllocationDashboard";
import ProgressDashboard from "./ProgressDashboard";
import SchoolDashboard from "./SchoolDashboard";
import DIETDashboard from "./DIETDashboard";
import CommingSoon from "../../layouts/prabandh/CommingSoon";

const Dashboard = () => {
  const user = Helper.auth.user;
  const { module } = useSelector((state) => state.module);
  if (
    !module &&
    +user?.user_role_id &&
    ![22, 25, 26, 27].includes(+user?.user_role_id)
  ) {
    return <PlanDashboard />;
  } else if (
    module === "allocation" &&
    +user?.user_role_id &&
    // ![22, 25, 26, 27].includes(+user?.user_role_id)
    ![22, 27].includes(+user?.user_role_id)
  ) {
    return <AllocationDashboard />;
  } else if (
    module === "progress" &&
    +user?.user_role_id &&
    ![22, 25, 26, 27].includes(+user?.user_role_id)
  ) {
    return <ProgressDashboard />;
  } else if (!module && +user?.user_role_id === 22) {
    return <SchoolDashboard />;
  } else if ([25, 26, 27].includes(+user?.user_role_id)) {
    return <DIETDashboard />;
  } else {
    return <CommingSoon />;
  }
};

export default Dashboard;
