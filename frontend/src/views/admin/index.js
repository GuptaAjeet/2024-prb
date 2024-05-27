import React, { Fragment, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import CommingSoon from "../layouts/prabandh/CommingSoon";

const Dashboard = lazy(() => import("../admin/dashboard"));
const Users = lazy(() => import("../admin/users/admin"));
const UserProfile = lazy(() => import("../admin/users/admin/profile"));
const ChangePassword = lazy(() =>
  import("../admin/users/admin/reset-password")
);
const States = lazy(() => import("../admin/masters/states"));
const Countries = lazy(() => import("../admin/masters/countries"));
const Genders = lazy(() => import("../admin/masters/genders"));
const Status = lazy(() => import("../admin/masters/status"));
const Districts = lazy(() => import("../admin/masters/districts"));
const Blocks = lazy(() => import("../admin/masters/blocks"));
const Roles = lazy(() => import("../admin/masters/roles"));
const Configurator = lazy(() => import("../admin/masters/configurator"));
const UserLogs = lazy(() => import("../admin/logs/user-logs"));

const Administratives = () => {
  const handler = useSelector((state) => state.label);
  const [active, setActive] = useState("Dashboard");
  const { module } = useSelector((state) => state.module);

  useEffect(() => {
    setActive(handler.title.replace(/[\s]/g, ""));
  }, [handler]);

  return (
    <Fragment>
      {active === "Dashboard" &&  <Dashboard />} 
      {active === "AdminUser" && <Users />}
      {active === "UserProfile" && <UserProfile />}
      {active === "ChangePassword" && <ChangePassword />}
      {active === "Countries" && <Countries />}
      {active === "States" && <States />}
      {active === "Districts" && <Districts />}
      {active === "Configurator" && <Configurator />}
      {active === "Blocks" && <Blocks />}
      {active === "Genders" && <Genders />}
      {active === "Roles" && <Roles />}
      {active === "Status" && <Status />}
      {active === "UserLogs" && <UserLogs />}
    </Fragment>
  );
};

export default Administratives;
