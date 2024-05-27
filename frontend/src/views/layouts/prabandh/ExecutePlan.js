import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Features from "../../../redux/features";
import api from "../../../apps/utilities/api";
import { Helper } from "../../../apps";
import { Modal } from "../../../apps/components/elements";
import "./spill.css";
import { REACT_APP_URL } from "../../../env";
import axios from "axios";
import Btnloader from "../../../apps/components/elements/Btnloader";
import store from "../../../redux/app/store";
import exportToExcel from "./PrabandhReports/ExcelReports";

const ExecutePlan = () => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const { year } = useSelector((state) => state.year);
  const { version } = useSelector((state) => state.version);
  const [planData, setPlanData] = useState([]);
  const [managedData, setManagedData] = useState([]);
  const [activeAM, setActiveAM] = useState({});
  const [showPopoverWindow, setShowPopoverWindow] = useState(false);
  const [activePopover, setActivePopover] = useState("");
  const [spillOverData, setSpillOverData] = useState([]);
  const [modalNumber, setModalNumber] = useState(0);
  const [tableData, setTableData] = useState([
    { id: 1, value: "", remarks: "" },
  ]);
  const [inputFormData, setInputFormData] = useState([]);
  // const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const [activityMasterDetailsList, ] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    subcomponentid: 0,
    activitymasterid: 0,
    data: [],
  });

  useEffect(() => {
    api.post(
      "api/prabandh/fetch-state-saved-plan-activity-list",
      {
        districtid: user?.user_district_id,
        year: year,
        version: version,
        stateid: user?.user_state_id,
        get: "allgrouped",
        role: user?.user_role_id,
        activity_group_code: user?.activity_group_code 
      },
      (res) => {
        setPlanData(res.data);
      }
    );
  }, []);

  const showPopover = (e, idx) => {
    api.post(
      "api/prabandh/spillover",
      {
        districtid: user?.user_district_id,
        unique_code: idx.unique_code,
      },
      (res) => {
        if (res?.data?.length > 0) {
          setSpillOverData(res.data);
          setShowPopoverWindow(!showPopoverWindow);
          setActivePopover(idx.unique_code);
        }
      }
    );
  };

  const handleInputType = (e, amd) => {
    const data = { input_type: e.target.value, field_id: amd.unique_code };
    const updatedFormData = inputFormData.filter(
      (item) => item.field_id !== amd.unique_code
    );
    setInputFormData([...updatedFormData, data]);
  };

  const handleInputValues = (e, amd) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    let rowToUpdate = inputFormData.filter(
      (i) => i.field_id === amd.unique_code
    );
    let rowNotToUpdate = inputFormData.filter(
      (k) => k.field_id !== amd.unique_code
    );

    if (rowNotToUpdate?.length > 0) {
      setInputFormData([
        ...rowNotToUpdate,
        {
          ...rowToUpdate[0],
          value: numericValue,
        },
      ]);
    } else {
      setInputFormData([
        {
          ...rowToUpdate[0],
          value: numericValue,
        },
      ]);
    }
  };

  /*   const encData = (
    sid,
    mcid,
    scid,
    amcid,
    amn,
    amid,
    ddbl,
    ddch,
    ddds,
    ddhs,
    ddna,
    ddsc,
    ddst
  ) => {
    const dd = {
      sid: sid,
      mcid: mcid,
      scid: scid,
      amid: amid,
      amcid: amcid,
      amn: amn,
      ddbl: ddbl,
      ddch: ddch,
      ddds: ddds,
      ddhs: ddhs,
      ddna: ddna,
      ddsc: ddsc,
      ddst: ddst,
    };
    const jsonString = JSON.stringify(dd);
    const base64String = btoa(jsonString);
    return base64String;
  }; */

  const submitForm = () => {
    api.post(
      "api/prabandh/savedata",
      {
        data: inputFormData,
        year: year,
        version: version,
        status: 0,
        created_by: user?.id,
        state_id: user?.user_state_id,
        district_id: user?.user_district_id,
      },
      (res) => {
        if (res.message === true && res.status === true) {
          setModalNumber(0);
          dispatch(
            Features.showToast({
              message: "Data saved successfully",
              flag: "info",
            })
          );
          dispatch(Features.hideModal());
        }
      }
    );
  };

  const showManage = (parent) => {
    setActiveAM(parent);
    setModalNumber(2);
    dispatch(
      Features.showModal({
        title: "Manage Window",
        btntext: "Select",
      })
    );
  };

  const handleAddRow = () => {
    const newRow = { id: tableData?.length + 1, value: "", remarks: "" };
    setTableData([...tableData, newRow]);
  };

  const handleDeleteRow = (id) => {
    const updatedData = tableData.filter((row) => row.id !== id);
    setTableData(updatedData);
  };

  const handleInputChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(updatedData);
  };

  const getFilledData = () => {
    setModalNumber(1);
    const filledData = tableData.filter((row) => row.value || row.remarks);
    setManagedData([
      ...managedData,
      { unique_code: activeAM.unique_code, data: filledData },
    ]);
  };

  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const handleGeneratePdf = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/viewplans`;
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          state_id: user.user_state_id,
          district_id: user.user_district_id,
          state_name:
            user.state_name === null ? "--Select State--" : user?.state_name,
          district_name:
            user.district_name === null ? "All District" : user?.district_name,
          report_type: "Fill Plan",
          get: "allgrouped",
          role: user.user_role_id,
          apiYear: apiYear,
          apiVersion: apiVersion,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            API_Year: apiYear,
            API_Version: apiVersion,
            Authorization: `Bearer ${Helper.token()}`,
          },
        }
      );
      if (response) {
        setPdfbtnStatus(false);
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        "_" +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      link.setAttribute("download", `FillPlans_2024-2025${datetime}.pdf`); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const exportTableToExcel = async () => {
    exportToExcel("genericReport", {
      reportData: planData,
      headers: [
        { srl: "S. No.", width: "5%", className: "text-left" },
        { scheme_name: "Scheme Name" },
        { major_component_name: "Major Component Name" },
        { sub_component_name: "Sub Component Name" },
        { activity_master_name: "Activity" },
      ],
      sheeName: "Sheet 1",
      fileName: "Fill_plan_data",
    });
  };

  return (
    <div className="dashboard-main-content">
      <div className="col-md-12 pb-2">
        <div
          className="dashboard-main-content__header mb-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1>Fill Plan</h1>
          <div>
            <button
              type="button"
              style={{ marginRight: "1rem" }}
              className="btn btn-danger float-end btn-sm"
              disabled={
                planData && planData?.length > 0
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
          </div>
        </div>
        <div className="dashboard-main-content-info ">
          <div className=" table-scroll-section m-0">
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
                {planData?.length > 0 &&
                  planData.map((p, idx) => {
                    return (
                      <tr
                        key={`plandata_${idx}`}
                        style={{
                          backgroundColor: `${
                            p.scheme_id === "1"
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
                        <td>
                          <Link
                            to="/auth/prabandh/plan/form"
                            state={{
                              sid: p.scheme_id,
                              mcid: p.major_component_id,
                              scid: p.sub_component_id,
                              amid: p.activity_master_id,
                              amcid: p.activity_master_component_id,
                              amn: p.activity_master_name,
                              ddbl: p.drill_down_block,
                              ddch: p.drill_down_child,
                              ddds: p.drill_down_district,
                              ddhs: p.drill_down_hostel,
                              ddna: p.drill_down_national,
                              ddsc: p.drill_down_school,
                              ddst: p.drill_down_state,
                            }}
                          >
                            <div className="fill_plan_edit_icon">
                              <i className="bi bi-pencil-square text-primary fill_plan_edit_hover"></i>
                            </div>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {modalNumber > 0 && (
            <Modal
              levelHandler={{ level: modalNumber, handler: setModalNumber }}
            >
              {modalNumber === 1 && (
                <Fragment>
                  <div className="row p-3">
                    <table className="table table-compact table-bordered">
                      <tbody>
                        {activityMasterDetailsList?.data?.length > 0 &&
                          activityMasterDetailsList?.data.map(
                            (amd, idxamdl) => {
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
                                              activePopover ===
                                                amd.unique_code &&
                                              spillOverData?.length > 0 && (
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
                                                      {spillOverData?.length >
                                                        0 &&
                                                        spillOverData.map(
                                                          (s, idxod) => {
                                                            return (
                                                              <tr
                                                                key={`SOD_${idxod}`}
                                                              >
                                                                <td>
                                                                  {s.year}
                                                                </td>
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
                            }
                          )}
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
          )}
        </div>
      </div>
    </div>
  );
};
export default ExecutePlan;
