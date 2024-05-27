import React, { useEffect, Fragment, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Helper, API, Model } from "../../../apps";
import Features from "../../../redux/features";
import sweetAlert from "../../../apps/utilities/sweetalert";
import SchoolList from "./School/SchoolList";
import { Modal } from "../../../apps/components/elements";
import store from "../../../redux/app/store";

const StateProgressTracking = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = Helper.auth.user;

  const [initialParams, setInitialParams] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [shouldBe, setShouldBe] = useState("");
  const [schoolMode, setSchoolMode] = useState(false);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [schoolList, setSchoolList] = useState([]);
  const [viewSchools, setViewSchools] = useState(false);

  useEffect(() => {
    setInitialParams(location.state);
    checkProgressData(location.state);
    setSchoolMode(() => +location.state.activityDetails.dd_school === 1 ? true : false);
  }, [refresh]);

  const checkProgressData = (props) => {
    API.post("api/prabandh/check-progress-data",
      { data: props.filter, activity_master_details_id: props.activityDetails.id, activity_master_id: props.activityDetails.activity_master_id },
      (res) => {
        setShouldBe(res?.should_be ?? "");
        setDataList(res.data);
      }
    );
  };

  const updateProgressListState = () => {
    API.post("api/prabandh/update-progress-list",
      {
        data: initialParams.filter,
        progress_list: dataList,
        activity_master_details_id: initialParams.activityDetails.id,
        activity_master_id: initialParams.activityDetails.activity_master_id,
        should_be: shouldBe
      },
      (res) => {
        sweetAlert.done({ msg: `Data ${shouldBe === "update" ? "Updated" : "Inserted"} Successfully.` });
        setRefresh(new Date().getMilliseconds());
      }
    );
  };

  const getAllocationSchoolList = (data) => {
    setSchoolList([]);
    API.post("api/prabandh/allocation-schools-list",
      {
        state_id: +initialParams.filter.state === 0 ? user?.user_state_id : initialParams.filter.state,
        dataObj: data,
      },
      (res) => {
        setSchoolList(res?.data);
        setViewSchools(true);
        dispatch(Features.showModal({ title: "View Schools", size: "lg" }));
      }
    );
  };

  const openSchoolList = (data) => {
    getAllocationSchoolList(data);
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content-info table-container mt-3">
        <h5 className="text-center mb-2">
          <strong>
            {`${+initialParams?.filter?.month ? Model.monthsOfYear[+initialParams?.filter?.month].name : 'Invalid month number'} (${store.getState().year.year})`}
          </strong>
        </h5>
        <div className="d-flex justify-content-between">
          <h5>
            <strong>
              Progress Report For {`${initialParams?.activityDetails?.activity_master_details_name ?? ""}`}
            </strong>
          </h5>

          <h4 style={{ display: "inline-block", float: "right" }} className="text-success">
            <div style={{ display: "inline-block", float: "right" }}>
              <Link to="/auth/progress/admin" className="bi bi-arrow-left font-size-16 btn btn-primary" state={{ backParams: initialParams }}>{" "}Back</Link>
            </div>
          </h4>
        </div>

        <div className="row m-3">
          <table cellPadding={5} cellSpacing={5} className="table table-bordered mt-3">
            <tbody>
              <tr>
                <td className="bg-light">Scheme : </td>
                <td>{initialParams?.activityDetails?.scheme_name ?? ""}</td>
                <td className="bg-light">Major Component :</td>
                <td>{initialParams?.activityDetails?.major_component_name ?? ""}</td>
              </tr>
              <tr>
                <td className="bg-light">Sub Component :</td>
                <td>{initialParams?.activityDetails?.sub_component_name ?? ""}</td>
                <td className="bg-light">Activity Master :</td>
                <td>{initialParams?.activityDetails?.activity_master_name ?? ""}</td>
              </tr>
              <tr>
                <td className="bg-light">Approved Outlay :</td>
                <td><span className="text-danger">Physical Quantity</span> 📦 :{" "}0</td>
                <td className="bg-light"><span className="text-success">Budget Approved ✅</span> :{" "}0</td>
                <td>(₹ in Lakh)</td>
              </tr>
            </tbody>
          </table>

          <Fragment>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>DISTRICT</th>
                  <th>ALLOCATED QUANTITY</th>
                  <th>ALLOCATED AMOUNT</th>
                  <th>YET TO START</th>
                  <th>IN PROGRESS</th>
                  <th>COMPLETED</th>
                  <th>FINANCIAL</th>
                  {schoolMode ? <th>School</th> : ""}
                </tr>
              </thead>
              <tbody>
                {dataList.length > 0 &&
                  dataList.map((d, idx) => {
                    return (
                      <tr key={`data_list_${idx + 1}`}>
                        <td>{idx + 1}</td>
                        <td>{d.district_name}</td>
                        <td>{d.allocated_physical_quantity ?? 0}</td>
                        <td>{Helper.numberFormat(d.allocated_financial_amount ?? 0, 5)}</td>
                        <td><input type="number" value={d.physical_progress_yet_to_start} name="physical_progress_yet_to_start"
                          className={`form-control physical_progress_yet_to_start_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                          onInput={(e) => {
                            setDataList((prevState) => {
                              prevState[idx][e.target.name] = e.target.value;
                              return [...prevState];
                            });
                          }}
                        />
                        </td>
                        <td><input type="number" value={d.physical_progress_in_progress} name="physical_progress_in_progress"
                          className={`form-control physical_progress_in_progress_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                          onInput={(e) => {
                            setDataList((prevState) => {
                              prevState[idx][e.target.name] = e.target.value;
                              return [...prevState];
                            });
                          }}
                        />
                        </td>
                        <td><input type="number" value={d.physical_progress_completed} name="physical_progress_completed"
                          className={`form-control physical_progress_completed_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                          onInput={(e) => {
                            setDataList((prevState) => {
                              prevState[idx][e.target.name] = e.target.value;
                              return [...prevState];
                            });
                          }}
                        />
                        </td>
                        <td><input type="number" value={d.financial_expenditure} name="financial_expenditure"
                          className={`form-control financial_expenditure_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                          onInput={(e) => {
                            setDataList((prevState) => {
                              prevState[idx][e.target.name] = e.target.value;
                              return [...prevState];
                            });
                          }}
                        />
                        </td>
                        {schoolMode ? (
                          <td><button className="btn btn-sm btn-light" onClick={() => openSchoolList(d)}>👁️‍🗨️ View</button></td>
                        ) : (
                          ""
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {dataList.length > 0 && (
              <div className="text-end">
                <span className="lock-span"><i className="fa-solid fa-lock lock-icon"></i></span>

                <button type="button" className="btn btn-success" onClick={updateProgressListState}>Save</button>
              </div>
            )}

            {viewSchools && (
              <Modal close={() => setViewSchools(false)}>
                <div className="row" style={{ maxHeight: "400px", "--bs-gutter-x": "unset" }}>
                  <SchoolList schoolList={schoolList} />
                </div>
              </Modal>
            )}
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default StateProgressTracking;
