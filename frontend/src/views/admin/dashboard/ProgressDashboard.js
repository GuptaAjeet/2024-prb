import React from "react";
import { Settings } from "../../../apps";
import ProgressStateDashboard from "./ProgressStateDashboard";
import ProgressDistrictDashboard from "./ProgressDistrictDashboard";

const ProgressDashboard = () => {
    return (
        <div className="dashboard-main-content">
            {Settings.isStateUser() === true && <ProgressStateDashboard />}
            {Settings.isDistrictUser() === true && <ProgressDistrictDashboard />}
        </div>
    );
};

export default ProgressDashboard;