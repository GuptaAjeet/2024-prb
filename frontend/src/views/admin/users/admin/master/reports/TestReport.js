import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../../../apps/utilities/api";
import { Helper, Settings, Hook } from "../../../../../../apps";
import { REACT_APP_URL } from "../../../../../../env";
import Btnloader from "../../../../../../apps/components/elements/Btnloader";
import PlanConfirmationDialog from "../../../../../../apps/components/form/ConfirmPlanSubmissionDialog";
import exportToExcel from "../../../../../layouts/prabandh/PrabandhReports/ExcelReports";

const SubmitPlan = (props) => {
  const user = Helper.auth.user;
  const simulatedUser = Helper.simulationAuth?.local?.userData;
  const [reportData, setReportData] = useState([]);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [schemeNameRowSpan, setSchemeNameRowSpan] = useState([]);
  const [majorComponentRowSpan, setMajorComponentRowSpan] = useState([]);
  const [subComponentRowSpan, setSubComponentRowSpan] = useState([]);
  const [activityMasterRowSpan, setActivityMasterRowSpan] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [disableButton, setdisableButton] = useState(false);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [hideButton, setHideButton] = useState(true);
  const [saveAction, setSaveAction] = useState(0);
  const state_name = stateList?.filter((c) => +c.id === +stateID);
  const district_name = districtsList?.filter((c) => +c.id === +districtID);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  
  useEffect(() => {
    if (user.user_role_id >= 8) {
      api.post(
        "api/prabandh/report",
        {
          report_id: 123,
          user: user,
          state_id: user.user_state_id,
          district_id: user.user_district_id,
          year: new Date().getFullYear(),
        },
        (res) => {
          setReportData(res.data.rows);
          if (res.data.rows.length > 0) {
            if (Settings.isDistrictApproverUser()) {
              setHideButton(false);
            } else {
              setHideButton(true);
            }

            if (res.data.rows[0].status >= 3) {
              setdisableButton(true);
            }
          }
        }
      );
    }
  }, [refresh]);

  useEffect(() => {
    calculateRowSpan();
    setStateID(user.user_state_id || 0);
    setDistrictID(user.user_district_id || 0);
    //getStateList();
    getDistrictsList("find", user?.user_state_id || 0);
  }, [reportData]);

  useEffect(() => {
    dependencyHandler(schemeNameRowSpan, "major_component_name");
  }, [schemeNameRowSpan]);

  useEffect(() => {
    dependencyHandler(majorComponentRowSpan, "sub_component_name");
  }, [majorComponentRowSpan]);

  useEffect(() => {
    dependencyHandler(subComponentRowSpan, "activity_master_name");
  }, [subComponentRowSpan]);

  /*   const getStateList = () => {
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
    });
  }; */

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        setDistrictsList(res.data);
      }
    );
  };

  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);
    getDistrictsList("find", e.target.value);
  };

  const calculateRowSpan = () => {
    if (reportData != null && reportData.length > 0) {
      let namesArr = {};
      setSchemeNameRowSpan(
        reportData.reduce((result, item, key) => {
          if (namesArr[item.scheme_name] === undefined) {
            namesArr[item.scheme_name] = key;
            result[key] = 1;
          } else {
            const firstIndex = namesArr[item.scheme_name];
            if (
              firstIndex === key - 1 ||
              (item.scheme_name === reportData[key - 1].scheme_name &&
                result[key - 1] === 0)
            ) {
              result[firstIndex]++;
              result[key] = 0;
            } else {
              result[key] = 1;
              namesArr[item.scheme_name] = key;
            }
          }
          return result;
        }, [])
      );
    }
  };

  const dependencyHandler = (parentCol, childCol) => {
    if (
      reportData != null &&
      reportData.length > 0 &&
      parentCol != null &&
      parentCol.length > 0
    ) {
      switch (childCol) {
        case "major_component_name":
          setMajorComponentRowSpan(
            calculateDependentRowSpan(parentCol, childCol)
          );
          break;

        case "sub_component_name":
          setSubComponentRowSpan(
            calculateDependentRowSpan(parentCol, childCol)
          );
          break;

        case "activity_master_name":
          setActivityMasterRowSpan(
            calculateDependentRowSpan(parentCol, childCol)
          );
          break;
      }
    }
  };

  const calculateDependentRowSpan = (parentCol, childCol) => {
    if (
      reportData != null &&
      reportData.length > 0 &&
      parentCol != null &&
      parentCol.length > 0
    ) {
      let rowSpan = [];
      parentCol.forEach((item, index) => {
        let items = {};
        let itemCounter = {};

        if (item > 1) {
          for (let i = index; i < index + item; i++) {
            if (items[reportData[i][childCol]] == undefined) {
              items[reportData[i][childCol]] = i;
              itemCounter[reportData[i][childCol]] = 1;
            }
            if (
              i - 1 >= index &&
              reportData[i][childCol] === reportData[i - 1][childCol]
            ) {
              itemCounter[reportData[i][childCol]]++;
            } else {
              itemCounter[reportData[i][childCol]] = 1;
            }
          }

          Object.values(items).forEach((item, index) => {
            rowSpan[item] = itemCounter[Object.keys(items)[index]];
          });
        }

        if (item == 1) {
          rowSpan[index] = item;
        }

        if (rowSpan[index] == undefined) {
          rowSpan[index] = 0;
        }
      });
      return rowSpan;
    }
  };

  const handleSave = (e) => {
    api.post(
      "api/prabandh/save-plan-status-details",
      {
        state_id: user.user_state_id,
        district_id: user.user_district_id,
        user_id: user.id,
        user_role_id: user.user_role_id,
        plan_status_id: saveAction,
        plan_session_id: 1,
        plan_year: `${new Date().getFullYear()}-${
          new Date().getFullYear() + 1
        }`,
        user_remarks: e,
      },
      (res) => {
        api.post(
          "api/prabandh/submit-plan",
          {
            district_id: user.user_district_id,
            status: saveAction,
            plan_year: `${new Date().getFullYear()}-${
              new Date().getFullYear() + 1
            }`,
            user_state_id: user?.user_state_id,
          },
          (res) => {
            setReportData(res?.data?.rows);

            setRefresh(new Date().getMilliseconds());
          }
        );
      }
    );
  };

  const fetchReportData = (e) => {
    setDistrictID(e.target.value || 0);
    if (e.target.value > 0) {
      api.post(
        "api/prabandh/get-state-cost-sheet-data",
        {
          report_id: 123,
          user: user,
          state_id: stateID,
          district_id: e.target.value,
          year: new Date().getFullYear(),
        },
        (res) => {
          setReportData(res?.data?.rows);
          if (res?.data?.length > 0) {
            if (Settings.isDistrictApproverUser()) {
              setHideButton(false);
            } else {
              setHideButton(true);
            }

            if (res.data[0].status > 0) {
              setdisableButton(true);
            } else {
              setdisableButton(false);
            }
          } else {
            setHideButton(true);
          }
        }
      );
    }
  };

  const exportTableToExcel = () => {
    exportToExcel("viewReport", {
      reportData: reportData,
      schemeNameRowSpan: schemeNameRowSpan,
      majorComponentRowSpan: majorComponentRowSpan,
      activityMasterRowSpan: activityMasterRowSpan,
      sheetName: "Sheet 1",
      fileName: "Approved_plan",
    });
  };

  const handleGeneratePdf = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/submitedplans`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          state_id: stateID,
          district_id: districtID,
          state_name:
            state_name?.length === 0
              ? "--Select State--"
              : `State: ${state_name[0]?.name}`,
          district_name:
            district_name?.length === 0
              ? "All District"
              : `District: ${district_name[0]?.district_name}`,
          report_type: "Annual Work Plan & Budget 2024-2025",
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href
        = url;
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
      setPdfbtnStatus(false);
      link.setAttribute(
        "download",
        `Annual Work Plan and Budget ${state_name[0]?.name} ${district_name[0]?.district_name} 2024-2025_${datetime}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };

  const exportTableToPDF = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/download-state-report`;
    const data = {
      report_id: 123,
      user: user,
      state_id: user.user_state_id,
      district_id: 2607,
      year: new Date().getFullYear(),
    };
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(pdfUrl, data, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      link.setAttribute("download", `FillPlans_2024-2025${currentdate}.pdf`); //or any other extension
      document.body.appendChild(link);
      link.click();
      setPdfbtnStatus(false);
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };

  
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header row px-2">
        <div className="col-xl-4 col-lg-4 col-sm-4">
          <h1>Submit Plan</h1>
        </div>
        <div className="col-xl-4 col-lg-4 col-sm-4">
          {disableButton && (
            <h6 style={{ fontWeight: "bold" }}>Status : Already Approved</h6>
          )}
        </div>
        {/* <div className="col-xl-4 col-lg-4 col-sm-4">
          {!hideButton && !disableButton && (
            <button
              className="btn btn-success cfr"
              onClick={(e) => {
                setSaveAction(3);
                setIsOpen(true);
              }}
            >
              <i className="bi bi-save"></i> Approve
            </button>
          )}
          {!hideButton && !disableButton && user.user_role_id<8 && (!simulatedUser && simulatedUser?.user_role_id != 4) && (
              <button
                className="btn btn-danger cfr mx-2"
                onClick={(e) => {
                  setSaveAction(11)
                  setIsOpen(true)
                }}
              >
                <i className="bi bi-x-circle"></i> Reject
              </button>
            )}
        </div> */}
      </div>

      <div className="row p-3">
        <div
          className="dashboard-main-content-info mb-2"
          id="search"
          style={{ backgroundColor: "rgb(5 43 96)" }}
        >
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-select"
                name="state-list"
                value={stateID}
                disabled={user.user_role_id >= 4 ? true : false}
                onChange={updateDistrictsList}
              >
                <option value="0">Select State</option>
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

            <div className="col-md-3">
              <select
                className="form-select"
                name="districts-list"
                disabled={user.user_role_id >= 8 ? true : false}
                onChange={fetchReportData}
                value={districtID}
              >
                <option value={null}>Select District</option>
                {districtsList &&
                  districtsList.length > 0 &&
                  districtsList.map((ds, dsidx) => {
                    return (
                      <option key={`ds_${dsidx}`} value={ds.id}>
                        {ds.district_name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="col-md-6 text-end">
              <button
                type="button"
                className="btn btn-success float-end"
                disabled={reportData && reportData.length > 0 ? false : true}
                onClick={exportTableToExcel}
              >
                <i className="bi bi-file-earmark-excel"></i>{" "}
                <span className="mobile-hide">Export To</span> Excel
              </button>
              {
              }
              <button
                type="button"
                style={{ marginRight: "1rem" }}
                className="btn btn-danger float-end"
                disabled={pdfbtnStatus}
                onClick={exportTableToPDF}
              >
                {pdfbtnStatus ? <Btnloader /> : ""}{" "}
                <i className="bi bi-file-earmark-pdf"></i>{" "}
                <span className="mobile-hide">Export To</span> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content-info">
        <div>
          <table className="table-scroll">
            <thead>
              <tr style={{ border: "none" }}>
                <th colSpan="7">
                  <div style={{ marginLeft: "80%" }}>
                    <div
                      className="my-1 font-monospace"
                      style={{
                        textAlign: "center",
                        backgroundColor: "gray",
                        height: "21px",
                        width: "200px",
                        padding: "1px",
                      }}
                    >
                      Sub Component Total{" "}
                    </div>
                    <div
                      className="font-monospace"
                      style={{
                        textAlign: "center",
                        backgroundColor: "orange",
                        height: "21px",
                        width: "200px",
                        padding: "1px",
                      }}
                    >
                      Activity Master Total{" "}
                    </div>
                    <div
                      className="my-1 font-monospace"
                      style={{
                        textAlign: "center",
                        backgroundColor: "green",
                        height: "21px",
                        width: "200px",
                        padding: "1px",
                      }}
                    >
                      Major Component Total
                    </div>
                  </div>
                </th>
              </tr>
              <tr style={{ border: "none" }}>
                <th colSpan="2">Particulars</th>
                {/* <th>Scheme</th> */}
                <th colSpan="2">Proposal</th>

                <th colSpan="3">Final Approved Outlay</th>
              </tr>
              <tr style={{ border: "none" }}>
                <th>S.No.</th>
                {/* <th>Scheme</th> */}
                <th>Major Component</th>
                <th>Sub Component</th>
                <th>Activity</th>
                <th>Physical</th>
                <th>Unit Cost</th>
                <th>Financial</th>
              </tr>
            </thead>
            <tbody>
              {reportData &&
                reportData?.length > 0 &&
                reportData?.map((d, idx) => {
                  d.unit_cost = Helper.numberFormatter(d.unit_cost, 5);
                  return (
                    <tr
                      key={`row_${idx + 1}`}
                      style={{
                        backgroundColor:
                          d?.activity_master_details_id == "999999" &&
                          d.activity_master_id == "888888"
                            ? "green"
                            : d?.activity_master_details_id == "999999"
                            ? "gray"
                            : "",
                      }}
                    >
                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : "",
                        }}
                      >
                        {idx + 1}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : "",
                        }}
                      >
                        {d.major_component_name}
                      </td>

                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : "",
                        }}
                      >
                        {d.sub_component_name}
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : d.scheme_id == "555555" &&
                                d.scheme_name === null
                              ? "blue"
                              : "",
                        }}
                      >
                        {d.activity_master_details_name
                          ? d.activity_master_details_name
                          : d.scheme_id == "555555"
                          ? "Grand Total"
                          : d.sub_component_id == "777777"
                          ? "Activity Master Total"
                          : d.activity_master_id == "888888"
                          ? "Total"
                          : d.major_component_id == "666666"
                          ? "Major Component"
                          : "Sub Component Total"}
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : "",
                        }}
                      >
                        {d.physical_quantity}
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : "",
                        }}
                      >
                        {d.unit_cost}
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            d?.activity_master_details_id == "999999" &&
                            d.sub_component_id == "777777"
                              ? "orange"
                              : "",
                        }}
                      >
                        {d.financial_amount}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {!hideButton && !disableButton && (
            <button
              className="btn btn-success cfr mt-3"
              onClick={(e) => {
                setSaveAction(3);
                setIsOpen(true);
              }}
            >
              <i className="bi bi-save"></i> Approve
            </button>
          )}
          {!hideButton &&
            !disableButton &&
            user.user_role_id < 8 &&
            !simulatedUser &&
            simulatedUser?.user_role_id != 4 && (
              <button
                className="btn btn-danger cfr mt-3 mx-2"
                onClick={(e) => {
                  setSaveAction(11);
                  setIsOpen(true);
                }}
              >
                <i className="bi bi-x-circle"></i> Reject
              </button>
            )}

          {isOpen && (
            <PlanConfirmationDialog
              onConfirm={(e) => {
                setIsOpen(false);
                handleSave(e);
              }}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title={"Remarks"}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default SubmitPlan;
