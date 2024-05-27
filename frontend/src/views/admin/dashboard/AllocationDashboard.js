import React, { useEffect, useState, Fragment } from "react";
import {
  Helper,
  Hook,
  API,
  Column,
  Settings,
  DynamicTable,
} from "../../../apps";
import { useDispatch } from "react-redux";
import features from "../../../redux/features";
import Btnloader from "../../../apps/components/elements/Btnloader";

const AllocationDashboard = () => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const stateList = Hook.useStates();
  const [stateID, setStateID] = useState(0);
  const [loader, setLoader] = useState(false);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (+stateID > 0) {
      getAllocationDashboardData();
    }
  }, [stateID]);

  const getAllocationDashboardData = () => {
    API.post(
      `api/prabandh/allocation-dashboard-data`,
      { state: stateID },
      (res) => {
        setActivities(res.data);
      }
    );
  };

  const FinalizeAllocationDashboard = () => {
    setLoader(true);
    API.post(
      "api/prabandh/allocation-dashboard-finalize",
      { state_id: stateID },
      (res) => {
        if (+res.status === 200) {
          setLoader(false);
          dispatch(features.showToast({ message: "Initialize  Successfully" }));
          getAllocationDashboardData()
        } else if (+res.status === 400) {
          setLoader(false);
          dispatch(
            features.showToast({
              message: `${res.count} data inserted`,
              flag: "bg-danger",
            })
          );
        } else {
          setLoader(false);
          dispatch(
            features.showToast({
              message: `Some thing went Wrong`,
              flag: "bg-danger",
            })
          );
        }
      }
    );
  };

  useEffect(() => {
    setStateID(user.user_state_id || 0);
  }, []);

  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);
    if (+e.target.value === 0) {
      setActivities([]);
    }
  };

  return (
    <>
      <div className="dashboard-main-content">
        <div className="dashboard-main-content-info mb-3">
          <div className="row">
            {/* Settings.isNationalUser() ? "col-md-12" :  */}
            <div className={"col-lg-3 col-md-4"}>
              <select
                className="form-select"
                name="state-list"
                value={stateID}
                disabled={
                  user.user_role_id < 4
                    ? false
                    : (+user.user_role_id === 15 || +user.user_role_id === 25 )
                    ? false
                    : true
                }
                onChange={updateDistrictsList}
              >
                <option value={0}>--Select State--</option>
                {stateList &&
                  stateList?.length > 0 &&
                  stateList?.map((st, stidx) => {
                    return (
                      <option key={`st_${stidx}`} value={st.id}>
                        {st.name}
                      </option>
                    );
                  })}
              </select>
              
            </div>
            {/* Settings.isNationalUser() ? "d-none" :  */}
            <div className={"col-lg-2 col-md-2 d-none"}>
              <button
                className="btn btn-primary"
           
                disabled={+stateID === 0 || loader}
                onClick={FinalizeAllocationDashboard}
              >
                {loader && <Btnloader />} Initialize Allocation
              </button>
            </div>
          </div>
        </div>
        <div
          id="dashboard-main-content"
          className="dashboard-main-content-info accordions"
        >
          <Fragment>
            {activities.length > 0 ? (
              <div className="accordion contribute-page" id="accordionExample">
                {Object?.entries(
                  activities?.reduce((result, currentItem) => {
                    const { scheme_name, ...rest } = currentItem;
                    if (result[scheme_name]) {
                      result[scheme_name].push(rest);
                    } else {
                      result[scheme_name] = [rest];
                    }
                    return result;
                  }, {}) || {}
                ).map(([scheme, data]) => (
                  <div className="accordion-item border-0" key={scheme + "aaaa"}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseOne${scheme.replace(
                          " ",
                          ""
                        )}`}
                        aria-expanded="true"
                        aria-controls={`collapseOne${scheme.replace(" ", "")}`}
                      >
                        {scheme} ({data?.length} Activities)
                      </button>
                    </h2>

                    <div
                      id={`collapseOne${scheme.replace(" ", "")}`}
                      className={`accordion-collapse collapse ${
                        activities.length === 1 ? "show" : ""
                      }`}
                      data-bs-parent="#accordionExample"
                    >
                      <div
                        className="accordion-body"
                        style={{ padding: "0px" }}
                      >
                        <div className="table-responsive">
                          {data.length > 0 && (
                            <DynamicTable
                              data={data}
                              displayChildHeader={false}
                              header={Column.allocationDashboardHeader()}
                              columns={Column.allocationDashboardTableView()}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h4>No Data Found</h4>
              </div>
            )}
          </Fragment>
        </div>
      </div>
    </>
  );
};

export default AllocationDashboard;
