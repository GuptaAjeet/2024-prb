import StateProgressTracking from "./StateProgressTracking";
import DistrictProgressTracking from "./DistrictProgressTracking";
import { Settings } from "../../../apps";

const ProgressTracking = () => {
  return (
    <div className="dashboard-main-content">
      {Settings.isNationalOrStateUser() && <StateProgressTracking />}
      {Settings.isDistrictApproverUser() && <DistrictProgressTracking />}
    </div>
  );
};

export default ProgressTracking;
