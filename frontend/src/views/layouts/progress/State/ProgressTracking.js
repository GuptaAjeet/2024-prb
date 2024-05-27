import React, { useEffect, Fragment, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../../../../apps/utilities/api";
import {  useDispatch } from "react-redux";
import {  Helper, Column } from "../../../../apps";
import Features from "../../../../redux/features";
import sweetAlert from "../../../../apps/utilities/sweetalert";
//import SchoolList from "./School/SchoolList";
import { Modal } from "../../../../apps/components/elements";
//import useDistricts from "../../../../apps/hooks/masters/useDistricts";
//import { useLocation } from "react-router-dom";
//import Spinner from "../../../apps/components/elements/Spinner";

const ProgressTracking = () => {
  const user = Helper.auth.user;
  const dispatch = useDispatch();
  const location = useLocation();
  const [initialParams, setInitialParams] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [shouldBe, setShouldBe] = useState("");
  const [schoolMode, setSchoolMode] = useState(false);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [, setSchoolList] = useState([]);
  const [viewSchools, setViewSchools] = useState(false);
  const [districtsList, setDistrictsList] = useState([]);
  const [activeDistrict, setActiveDistrict] = useState("");

  //const location = useLocation();
  //const [schemesList, setSchemesList] = useState([]);
  //const [majorComponenetList, setMajorComponenetList] = useState([]);
  //const [subCompList, setSubCompList] = useState([]);
  //const [actMasterList, setActMasterList] = useState([]);
  //const [actMasterDetailList, setActMasterDetailList] = useState([]);
  //const [rowList, setRowList] = useState([]);
  //const [parentPage, setParentPage] = useState("");
  //const handler = useSelector((state) => state.handler);
  //const [activeSchool, setActiveSchool] = useState({});
  //const [formFieldsList, setFormFieldsList] = useState({});
  //const [finalData, setFinalData] = useState([]);
  //const [spin, setSpin] = useState(false);
  //const [activeRow, setActiveRow] = useState(0);
  //const [editable, setEditale] = useState(false);
  //const [lock, showLock] = useState(false);
  /* const [formData, setFormData] = useState({
    id: null,
    target_value: null,
    yet_to_start: null,
    in_progress: null,
    completed: null,
    financial: null,
  }); */

  const months = [
    { key: 1, value: "January" },
    { key: 2, value: "February" },
    { key: 3, value: "March" },
    { key: 4, value: "April" },
    { key: 5, value: "May" },
    { key: 6, value: "June" },
    { key: 7, value: "July" },
    { key: 8, value: "August" },
    { key: 9, value: "September" },
    { key: 10, value: "October" },
    { key: 11, value: "November" },
    { key: 12, value: "December" },
  ];

  const checkMonth = (monthid) => {
    const date = new Date();
    const currentMonthId = date.getMonth() + 1;
    if (+monthid === +currentMonthId) {
      return { backgroundColor: "#d1ede7" };
    } else {
      return { backgroundColor: "#f2f2f2" };
    }
  };

  useEffect(() => {
    setInitialParams(location.state);
    checkProgressData(location.state);
    setSchoolMode(() =>
      +location.state.activityDetails.dd_school === 1 ? true : false
    );
    getDistricts();
  }, [refresh]);

  const checkProgressData = (props) => {
    api.post(
      "api/prabandh/check-progress-data",
      {
        data: props.filter,
        activity_master_details_id: props.activityDetails.id,
        activity_master_id: props.activityDetails.activity_master_id,
      },
      (res) => {
        setShouldBe(res?.should_be ?? "");
        setDataList(res.data);
      }
    );
  };

  const getDistricts = () => {
    api.post("api/districts/selectlist", { state_id: 116 }, (res) => {
      setDistrictsList(res.data);
    });
  };

  const updateProgressListState = () => {
    api.post(
      "api/prabandh/update-progress-list",
      {
        data: initialParams.filter,
        progress_list: dataList,
        activity_master_details_id: initialParams.activityDetails.id,
        activity_master_id: initialParams.activityDetails.activity_master_id,
        should_be: shouldBe,
      },
      (res) => {
        sweetAlert.done({
          msg: `Data ${
            shouldBe === "update" ? "Updated" : "Inserted"
          } Successfully.`,
        });
        setRefresh(new Date().getMilliseconds());
      }
    );
  };

  const getAllocationSchoolList = (data) => {
    setSchoolList([]);
    api.post(
      "api/prabandh/allocation-schools-list",
      {
        state_id:
          +initialParams.filter.state === 0
            ? user?.user_state_id
            : initialParams.filter.state,
        dataObj: data,
      },
      (res) => {
        setSchoolList(res?.data);
        setViewSchools(true);
        dispatch(
          Features.showModal({
            title: "View Schools",
            size: "lg",
          })
        );
      }
    );
  };

  // const openSchoolList = (data) => {
  //   getAllocationSchoolList(data);
  // };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <h5 style={{ display: "inline-block" }}>
          {`${
            initialParams?.activityDetails?.activity_master_details_name ?? ""
          }`}
        </h5>
        <h4
          style={{ display: "inline-block", float: "right" }}
          className="text-success"
        >
          <div style={{ display: "inline-block", float: "right" }}>
            <Link
              to="/auth/progress/state"
              className="bi bi-arrow-left font-size-16 btn btn-primary"
              state={{
                backParams: initialParams,
              }}
            >
              {" "}
              Back
            </Link>
          </div>
        </h4>
      </div>

      <div className="col-md-12 pb-2">
        <div className="dashboard-main-content-info clear">
          <div className="row p-3">
            <div className="col-lg-8">
              <Fragment>
                <div>
                  <div className="row mb-3">
                    <div className="col-sm-3 mb-3 mb-sm-0">
                      <div className="card">
                        <div className="card-body">
                          <p
                            className="card-title"
                            style={{ fontSize: "16px", fontWeight: "500" }}
                          >
                            ALLOTED
                            <span
                              className="card-text"
                              style={{
                                float: "right",
                                background: "#1d467a",
                                color: "#fff",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontSize: "16px",
                              }}
                            >
                              23541
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="card">
                        <div className="card-body">
                          <p
                            className="card-title"
                            style={{ fontSize: "16px", fontWeight: "500" }}
                          >
                            CUMULATIVE
                            <span
                              className="card-text"
                              style={{
                                float: "right",
                                background: "#1d467a",
                                color: "#fff",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontSize: "16px",
                              }}
                            >
                              23541
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="card">
                        <div className="card-body">
                          <p
                            className="card-title"
                            style={{ fontSize: "16px", fontWeight: "500" }}
                          >
                            CURRENT
                            <span
                              className="card-text"
                              style={{
                                float: "right",
                                background: "#1d467a",
                                color: "#fff",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontSize: "16px",
                              }}
                            >
                              23541
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="card">
                        <div className="card-body">
                          <p
                            className="card-title"
                            style={{ fontSize: "16px", fontWeight: "500" }}
                          >
                            REMAINS
                            <span
                              className="card-text"
                              style={{
                                float: "right",
                                background: "#1d467a",
                                color: "#fff",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontSize: "16px",
                              }}
                            >
                              23541
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    borderRadius: "5px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="col-lg-10"
                    style={{ border: "1px solid #ccc", padding: "5px" }}
                  >
                    {initialParams?.activityDetails
                      ?.activity_master_details_name ?? ""}
                  </div>
                  <div
                    className="col-lg-2"
                    style={{ border: "1px solid #ccc", padding: "5px" }}
                  >
                    📆
                    {
                      months.filter(
                        (m) => m.key === new Date().getMonth() + 1
                      )[0].value
                    }
                  </div>
                </div>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>DISTRICT</th>
                      <th className={`${!schoolMode && "d-none"}`}>
                        YET TO START
                      </th>
                      <th className={`${!schoolMode && "d-none"}`}>
                        IN PROGRESS
                      </th>
                      <th>COMPLETED</th>
                      <th>FINANCIAL</th>
                      {schoolMode ? <th>School</th> : ""}
                    </tr>
                  </thead>
                  <tbody>
                    {months.length > 0 &&
                      months.map((m) => {
                        return (
                          <tr
                            key={`data_list_${m.key}`}
                            className={`${
                              +m.key !== new Date().getMonth() + 1
                                ? "disabled"
                                : ""
                            }`}
                          >
                            <td style={checkMonth(m.key)}>{m.key}</td>
                            <td style={{ background: "#b5ebdf" }}>{m.value}</td>
                            <td
                              className={`${!schoolMode && "d-none"}`}
                              style={checkMonth(m.key)}
                            >
                              <input
                                type="number"
                                value={m.physical_progress_yet_to_start}
                                name="physical_progress_yet_to_start"
                                className={`form-control physical_progress_yet_to_start_${m.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[m.key][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            <td
                              className={`${!schoolMode && "d-none"}`}
                              style={checkMonth(m.key)}
                            >
                              <input
                                type="number"
                                value={m.physical_progress_in_progress}
                                name="physical_progress_in_progress"
                                className={`form-control physical_progress_in_progress_${m.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[m.key][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            <td style={checkMonth(m.key)}>
                              <input
                                type="number"
                                value={m.physical_progress_completed}
                                name="physical_progress_completed"
                                className={`form-control physical_progress_completed_${m.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[m.key][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            <td style={checkMonth(m.key)}>
                              <input
                                type="number"
                                value={m.financial_expenditure}
                                name="financial_expenditure"
                                className={`form-control financial_expenditure_${m.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[m.key][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    {/*                    {dataList.length > 0 &&
                      dataList.map((d, idx) => {
                        return (
                          <tr key={`data_list_${idx + 1}`}>
                            <td>{idx + 1}</td>
                            <td>{d.district_name}</td>
                            <td>
                              {Helper.numberFormat(
                                d.allocated_financial_amount ?? 0,
                                5
                              )}
                            </td>
                            <td>{d.allocated_physical_quantity ?? 0}</td>
                            <td className={`${!schoolMode && "d-none"}`}>
                              <input
                                type="number"
                                value={d.physical_progress_yet_to_start}
                                name="physical_progress_yet_to_start"
                                className={`form-control physical_progress_yet_to_start_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[idx][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            <td className={`${!schoolMode && "d-none"}`}>
                              <input
                                type="number"
                                value={d.physical_progress_in_progress}
                                name="physical_progress_in_progress"
                                className={`form-control physical_progress_in_progress_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[idx][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={d.physical_progress_completed}
                                name="physical_progress_completed"
                                className={`form-control physical_progress_completed_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[idx][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={d.financial_expenditure}
                                name="financial_expenditure"
                                className={`form-control financial_expenditure_${d.prb_ann_wrk_pln_bdgt_data_allocation_district_id}`}
                                onInput={(e) => {
                                  setDataList((prevState) => {
                                    prevState[idx][e.target.name] =
                                      e.target.value;
                                    return [...prevState];
                                  });
                                }}
                              />
                            </td>
                            {schoolMode ? (
                              <td>
                                <button
                                  className="btn btn-sm btn-light"
                                  onClick={() => openSchoolList(d)}
                                >
                                  👁️‍🗨️ View
                                </button>
                              </td>
                            ) : (
                              ""
                            )}
                          </tr>
                        );
                      })} */}
                  </tbody>
                </table>

                {dataList.length > 0 && (
                  <div className="text-end">
                    <span className="lock-span">
                      <i className="fa-solid fa-lock lock-icon"></i>
                    </span>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={updateProgressListState}
                    >
                      Save
                    </button>
                  </div>
                )}

                {viewSchools && (
                  <Modal close={() => setViewSchools(false)}>
                    <div
                      className="row"
                      style={{ maxHeight: "400px", "--bs-gutter-x": "unset" }}
                    >
                      {/* <SchoolList schoolList={schoolList} /> */}
                    </div>
                  </Modal>
                )}
              </Fragment>
            </div>
            <div className="col-lg-4">
              <div className="alert alert-info bg-primary fLarger f900">
                DISTRICT LIST
              </div>
              <ol className="list-group list-group-numbered fLarger">
                {districtsList.length > 0 &&
                  districtsList.map((d) => {
                    return (
                      <button
                        key={d.id}
                        type="button"
                        className={`list-group-item list-group-item-action ${
                          +d.id === +activeDistrict ? "activeL" : ""
                        }`}
                        onClick={() => setActiveDistrict(d.id)}
                      >
                        {d.name}
                      </button>
                    );
                  })}
              </ol>
            </div>
          </div>
          <div className="row p-3"></div>
        </div>
      </div>
    </div>
  );
};
export default ProgressTracking;
