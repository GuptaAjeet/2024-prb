import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import "./spill.css";
// import axios from "axios";
import { Helper, Hook } from "../../../../apps";
import api from "../../../../apps/utilities/api";
// import Features from "../../../../redux/features";
// import store from "../../../../redux/app/store";
// import { REACT_APP_URL } from "../../../../env";
// import Btnloader from "../../../../apps/components/elements/Btnloader";
// import exportToExcel from "../PrabandhReports/ExcelReports";
// import { Modal } from "../../../../apps/components/elements";
import {Tooltip } from "react-bootstrap";

const UploadedDocList = () => {
  // const dispatch = useDispatch();
  const user = Helper.auth.user;
  // const { year } = useSelector((state) => state.year);
  // const { version } = useSelector((state) => state.version);
  const [planData, setPlanData] = useState(null);
  // const [managedData, setManagedData] = useState([]);
  // const [activeAM, setActiveAM] = useState({});
  // const [showPopoverWindow, setShowPopoverWindow] = useState(false);
  // const [activePopover, setActivePopover] = useState("");
  // const [spillOverData, setSpillOverData] = useState([]);
  // const [modalNumber, setModalNumber] = useState(0);
  const [details, setDetails] = useState(null);
  // const [tableData, setTableData] = useState([
  //   { id: 1, value: "", remarks: "" },
  // ]);
  // const [inputFormData, setInputFormData] = useState([]);
  const [userPer, setUserPer] = useState([]);
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  // const [spin, setSpin] = useState([]);
  const [filter, setFilter] = useState({
    state: "0",
    type: "",
    year: "0",
  });
  // const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  // const [activityMasterDetailsList, setActivityMasterDetailsList] = useState({
  //   schemeid: 0,
  //   majorcomponentid: 0,
  //   subcomponentid: 0,
  //   activitymasterid: 0,
  //   data: [],
  // });
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setFilter({
        state: location.state.stateid,
        type: location.state.type,
        year: location.state.year,
      });
      handleFetchData(location.state.year, location.state.stateid);
    } else {
      setFilter((prevState) => {
        return {
          ...prevState,
          state: user?.user_state_id || 0,
        };
      });
    }
    getUserPer();
    //getStateList();
  }, [location?.state,user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => {
      return { ...prevState, [name]: value };
    });
    setPlanData(null);
  };
  const getUserPer = () => {
    api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };
  /*   const getStateList = () => {
    setSpin(true);
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */
  // useEffect(() => {
  // setFilter((prevState) => {
  //   return {
  //     ...prevState,
  //     state: user?.user_state_id || 0,
  //   };
  // });
  // getUserPer();
  // getStateList();
  // }, [user]);
  const handleFetchData = (year, state) => {
    api.post(
      "api/prabandh/fetch-activity-list-doc",
      {
        year: year,
        stateid: state,
      },
      (res) => {
        setPlanData(res.data);
      }
    );
  };
  const handleMouseEnter = (activity_master_id) => {
    api.post(
      "api/prabandh/fetch-doc-activity-detail-list",
      {
        activity_master_id: activity_master_id,
        year: filter.year,
        stateid: filter?.state,
      },
      (res) => {
        if (res.status) setDetails(res.data);
        else {
        }
      }
    );
  };

  const tooltipContent = <Tooltip className="tooltip_hover" id="custom-overlay" style={{ backgroundColor: "red", maxWidth: "100%" }} >
    <table cellPadding={5}
      cellSpacing={5}
      className="table table-bordere mt-3"
    // style={{ width: "100%", height: "100%" }}
    >
      <tr>
        <td
          colSpan={4}
          style={{ fontWeight: "bold" }}
        >
          Sub Activity{" "}
        </td>
      </tr>

      <tbody>
        {details?.map((c) => (
          <tr>
            <td>
              <i
                data-bs-toggle="tooltip"
                title="Submitted Activity"
                className="bi bi-check-circle bg-success"
                style={{
                  borderRadius: "5px",
                  marginRight: "3px",
                  padding: "2px 4px",
                }}
              ></i>
              <span style={{ fontSize: "12px" }}>
                {c?.activity_master_details_name}
              </span>
            </td>
            <td className="bg-light">
              {c?.proposed_physical_quantity}
            </td>
            <td className="bg-light">
              {+c?.eligible_for_allocation === 1
                ? "Approved"
                : "Pending"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Tooltip>
  return (
    <div className="dashboard-main-content">
      <div className="col-md-12 pb-2">
        <div
          className="dashboard-main-content__header mb-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1>Upload School List As Per Approved Plan</h1>
          {/* <div>
            <button
              type="button"
              style={{ marginRight: "1rem" }}
              className="btn btn-danger float-end btn-sm"
              disabled={
                planData && planData.length > 0
                  ? pdfbtnStatus
                    ? true
                    : false
                  : true
              }
              onClick={handleGeneratePdf}
            >
              {pdfbtnStatus ? <Btnloader /> : ""}{" "}
              <i className="bi bi-file-earmark-pdf"></i>{" "}
              <span className="mobile-hide">Export To</span> PDF
            </button>
            <button
              type="button"
              className="btn btn-success float-end mx-2 btn-sm"
              disabled={planData?.length > 0 ? false : true}
              onClick={exportTableToExcel}
            >
              <i className="bi bi-file-earmark-excel"></i>{" "}
              <span className="mobile-hide">Export To</span> Excel
            </button>
          </div> */}
        </div>
        <div className="dashboard-main-content-info ">
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-select"
                name="state"
                value={filter?.state}
                onChange={handleChange}
                disabled={stateList?.find(
                  (state) => +state.id === +user.user_state_id
                )}
              >
                <option value={0}>Select State</option>
                {userPer?.length
                  ? userPer
                    .reduce((uniqueStates, currentItem) => {
                      if (
                        !uniqueStates.some(
                          (item) => item.state_id === currentItem.state_id
                        )
                      ) {
                        uniqueStates.push(currentItem);
                      }
                      return uniqueStates;
                    }, [])
                    .map((st, stidx) => (
                      <option key={`st_${stidx}`} value={st.state_id}>
                        {st.state_name}
                      </option>
                    ))
                  : stateList?.map((st, stidx) => (
                    <option key={`st_${stidx}`} value={st.id}>
                      {st.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="type"
                value={filter?.type}
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <option value={0}>Select Plan Type</option>
                {/* <option value="spill_over">Spill Over</option> */}
                <option value="other">Plan</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                name="year"
                value={filter?.year}
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <option value={0}>Select Plan Year</option>
                {/* <option value="2023-2024">2023-2024</option> */}
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-danger"
                style={{ marginLeft: "10px" }}
                disabled={
                  +filter.type === 0 ||
                  +filter.year === 0 ||
                  +filter.state === 0
                }
                onClick={() => handleFetchData(filter.year, filter.state)}
              >
                Show
              </button>
            </div>
          </div>
        </div>
        <div className=" table-scroll-section mt-4">
          {planData && (
            <table className="table-scroll table-sm">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Scheme</th>
                  <th>Major Component</th>
                  <th>Sub Component</th>
                  <th>Activity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  // +filter.type === 0 || +filter.year === 0 || +filter.state === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", fontSize: "25px" }}>Please Select All Filters</td></tr> :
                  planData && planData?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", fontSize: "25px" }}
                      >
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    planData?.length > 0 &&
                    planData?.map((p, idx) => {
                      return (
                        <tr
                          key={`plandata_${idx}`}
                          style={{
                            backgroundColor: `${p.scheme_id === "1"
                              ? "#bedef4"
                              : p.scheme_id === "2"
                                ? "#c1f1d5"
                                : "#fce2b6"
                              }`,
                          }}
                        >
                          <td>{idx + 1}</td>
                          <td>{p.scheme_name}</td>
                          <td>{p.major_component_name}</td>
                          <td>{p.sub_component_name}</td>
                          <td>{p.activity_master_name}</td>
                          <td className="d-flex gap-3">
                            <Link
                              to="/auth/prabandh/uploadadd"
                              state={{
                                sid: p.scheme_id,
                                mcid: p.major_component_id,
                                scid: p.sub_component_id,
                                amid: p.activity_master_id,
                                stateid: filter?.state,
                                type: filter?.type,
                                year: filter?.year,
                                scheme_name: p.scheme_name,
                                major_component_name: p.major_component_name,
                                sub_component_name: p.sub_component_name,
                                activity_master_name: p.activity_master_name,
                              }}
                            >
                              <div className="fill_plan_edit_icon">
                                <i className="bi bi-pencil-square text-primary fill_plan_edit_hover"></i>
                              </div>
                            </Link>

                            {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              Launch demo modal
                            </button> */}
                            <button className="btn btn-success px-2 py-1" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"
                              onClick={() =>
                                handleMouseEnter(p.activity_master_id)
                              }>
                              <i
                                data-bs-toggle="tooltip"
                                // title="Submitted Activity"
                                className="bi bi-eye"
                              ></i>
                            </button>

                            <div className="modal fade status-preview" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                  <div className="modal-header mb-0">
                                    <h5 className="modal-title" id="exampleModalLabel">Preview Status</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div className="modal-body p-3">
                                    <table cellPadding={5}
                                      cellSpacing={5}
                                      className="table table-bordere mt-1"
                                    // style={{ width: "100%", height: "100%" }}
                                    >
                                      <tr>
                                        <th style={{ fontWeight: "bold" }}
                                        >
                                          Sub Activity{" "}
                                        </th>
                                        <th style={{ fontWeight: "bold" }}
                                        >Quantity</th>
                                        <th style={{ fontWeight: "bold" }}
                                        >Status</th>
                                      </tr>

                                      <tbody>
                                        {details?.map((c) => (
                                          <tr>
                                            <td>
                                              <i
                                                data-bs-toggle="tooltip"
                                                title="Submitted Activity"
                                                className="bi bi-check-circle bg-success"
                                                style={{
                                                  borderRadius: "5px",
                                                  marginRight: "3px",
                                                  padding: "2px 4px",
                                                }}
                                              ></i>
                                              <span style={{ fontSize: "12px" }}>
                                                {c?.activity_master_details_name}
                                              </span>
                                            </td>
                                            <td className="bg-light">
                                              {c?.proposed_physical_quantity}
                                            </td>
                                            <td className="bg-light">
                                              {+c?.eligible_for_allocation === 1
                                                ? "Approved"
                                                : "Pending"}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* <OverlayTrigger
                              placement="left"
                              style={{ minWidth: "100%", height: "100%", backgroundColor: "yellow" }}
                              overlay={tooltipContent}
                            ><button className="btn btn-success"
                              onMouseEnter={() =>
                                handleMouseEnter(p.activity_master_id)
                              }>
                                <i
                                  data-bs-toggle="tooltip"
                                  // title="Submitted Activity"
                                  className="bi bi-check-circle"
                                ></i>
                              </button></OverlayTrigger> */}
                            {/* <div
                              className="btn_hover_div"
                              onMouseEnter={() =>
                                handleMouseEnter(p.activity_master_id)
                              }
                            >
                              <button className="btn btn-success cutom_tooltip_btn">
                                <i
                                  data-bs-toggle="tooltip"
                                  title="Submitted Activity"
                                  className="bi bi-check-circle"
                                ></i>
                              </button>
                              <div className="cutom_tooltip_show">
                                <i className="bi bi-caret-right-fill arraow_icon"></i>
                                <table
                                  cellPadding={5}
                                  cellSpacing={5}
                                  className="table table-bordered mt-3"
                                >
                                  <tr>
                                    <td
                                      colSpan={4}
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Sub Activity{" "}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Name</b>
                                    </td>
                                    <td>
                                      <b>Quantity</b>
                                    </td>
                                    <td>
                                      <b>Status</b>
                                    </td>
                                  </tr>
                                  <tbody>
                                    {details?.map((c) => (
                                      <tr>
                                        <td>
                                          <i
                                            data-bs-toggle="tooltip"
                                            title="Submitted Activity"
                                            className="bi bi-check-circle bg-success"
                                            style={{
                                              borderRadius: "5px",
                                              marginRight: "3px",
                                              padding: "2px 4px",
                                            }}
                                          ></i>
                                          <span style={{ fontSize: "12px" }}>
                                            {c?.activity_master_details_name}
                                          </span>
                                        </td>
                                        <td className="bg-light">
                                          {c?.proposed_physical_quantity}
                                        </td>
                                        <td className="bg-light">
                                          {+c?.eligible_for_allocation === 1
                                            ? "Approved"
                                            : "Pending"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div> */}
                            {/* <button
                              data-bs-toggle="tooltip"
                              title="Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v" className="btn btn-sm btn-success">submitted</button> */}
                          </td>
                        </tr>
                      );
                    })
                  )
                }
              </tbody>
            </table>
          )}
        </div>
        {/* {modalNumber > 0 && (
            <Modal
              levelHandler={{ level: modalNumber, handler: setModalNumber }}
            >
              {modalNumber === 1 && (
                <Fragment>
                  <div className="row p-3">
                    <table className="table table-compact table-bordered">
                      <tbody>
                        {activityMasterDetailsList.data.length > 0 &&
                          activityMasterDetailsList.data.map((amd, idxamdl) => {
                            return (
                              <Fragment key={`AMDL_${idxamdl}`}>
                                {amd.activity_master_details !== "" && (
                                  <tr>
                                    <td
                                      style={{ textAlign: "left" }}
                                      width="38%"
                                    >
                                      <strong>
                                        {amd.activity_master_details}
                                      </strong>
                                      <span className="cnd">
                                        <br />
                                        <span className="text-danger">*</span>
                                        <strong>Norms:</strong> {amd.norms}
                                        <br />
                                        <span className="text-danger">*</span>
                                        <strong>
                                          Criteria for appraisal:
                                        </strong>{" "}
                                        {amd.criteria_for_appraisal}
                                      </span>
                                    </td>
                                    <td width="20%">
                                      <select
                                        className="form-control input"
                                        id={`l_${amd.unique_code}_${amd.year}`}
                                        onChange={(e) =>
                                          handleInputType(e, amd)
                                        }
                                        defaultValue={amd.amt_qty_type || ""}
                                      >
                                        <option value="">Select Input</option>
                                        <option value="Amount">Amount</option>
                                        <option value="Quantity">
                                          Quantity
                                        </option>
                                      </select>
                                    </td>
                                    <td width="20%">
                                      <input
                                        type="text"
                                        className="form-control amt_qty"
                                        id={`i_${amd.unique_code}_${amd.year}`}
                                        defaultValue={amd.amount}
                                        onInput={(e) =>
                                          handleInputValues(e, amd)
                                        }
                                      />
                                    </td>
                                    <td width="12%">
                                      <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => showManage(amd)}
                                      >
                                        Manage
                                      </button>
                                    </td>
                                    <td width="10%">
                                      {amd.spillover_status === 1 && (
                                        <>
                                          <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => {
                                              showPopover(e, amd);
                                            }}
                                          >
                                            Spillover
                                          </button>
                                          {showPopoverWindow &&
                                            activePopover === amd.unique_code &&
                                            spillOverData.length > 0 && (
                                              <div
                                                id={`spill_${idxamdl}`}
                                                className="spldv"
                                              >
                                                <table>
                                                  <thead>
                                                    <tr>
                                                      <th>Year</th>
                                                      <th>Amount</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {spillOverData.length > 0 &&
                                                      spillOverData.map(
                                                        (s, idxod) => {
                                                          return (
                                                            <tr
                                                              key={`SOD_${idxod}`}
                                                            >
                                                              <td>{s.year}</td>
                                                              <td>
                                                                {s.amount}
                                                              </td>
                                                            </tr>
                                                          );
                                                        }
                                                      )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="row p-3 cfr">
                    <button className="btn btn-warning cbr">Reset</button>
                    <button
                      className="btn btn-success cbfs cbr"
                      onClick={submitForm}
                    >
                      Submit
                    </button>
                  </div>
                </Fragment>
              )}
              {modalNumber === 2 && (
                <Fragment>
                  <div className="p-2">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>VALUE</th>
                          <th>REMARKS</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row) => (
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>
                              <input
                                name="value"
                                className="form-control"
                                value={row.value}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                value={row.remarks}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteRow(row.id)}
                              >
                                -
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div>
                      <table width="100%">
                        <tbody>
                          <tr>
                            <td width="20%">
                              <button
                                className="btn btn-info btn-sm"
                                onClick={getFilledData}
                              >
                                Save & Back
                              </button>
                            </td>
                            <td width="80%">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={handleAddRow}
                                style={{
                                  float: "right",
                                  marginBottom: "10px",
                                  marginRight: "22px",
                                }}
                              >
                                +
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Fragment>
              )}
            </Modal>
          )} */}
      </div>
    </div>
  );
};
export default UploadedDocList;
