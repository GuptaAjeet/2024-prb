import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Helper, Settings, API, Model } from "../../../apps";
import PlanConfirmationDialog from "../../../apps/components/form/ConfirmPlanSubmissionDialog";
import { AgGridReact } from "ag-grid-react";
import store from "../../../redux/app/store";
import axios from "axios";
import Btnloader from "../../../apps/components/elements/Btnloader";
import exportToExcel from "./PrabandhReports/ExcelReports";
import customNoRowsOverlay from "../../admin/users/admin/master/reports/childrens/customNoRowsOverlay";

const SubmitPlan = () => {
  const user = Helper.auth.user;
  const userData = Helper.auth.user;
  const simulatedUser = Helper.simulationAuth?.local?.userData;
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  //const [reportData, setReportData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [disableButton, setdisableButton] = useState(false);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const [hideButton, setHideButton] = useState(true);
  const [saveAction, setSaveAction] = useState(0);
  //const [pdfStatus, setPdfStatus] = useState(false);

  //const dispatch = useDispatch();

  /* aggrid code start */
  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [object, setObject] = useState({});
  const [pagesize, setpagesize] = useState(12);
  const getRowStyle = (params) => {
    if (params.data.scheme_id === 555555) {
      return { background: "#ff9696" };
    } else if (params.data.major_component_id === 666666) {
      return { background: "#f799ff" };
    } else if (params.data.sub_component_id === 777777) {
      return { background: "#8cf0ff" };
    } else if (params.data.activity_master_id === 888888) {
      return { background: "#f5df98" };
    } else if (params.data.activity_master_details_id === 999999) {
      return { background: "#8cffa1" };
    }
    return null;
  };

  const [headerRows, setHeaderRows] = useState([]);
  const formatHeader = (key) => {
    return Helper.ucfirst(key.toLowerCase().split("_").join(" "));
  };

  const configGridHeader = useCallback(
    (dataObj) => {
      if (
        dataObj !== null &&
        dataObj?.data?.fields !== undefined &&
        headerRows.length === 0
      ) {
        dataObj?.data?.fields?.forEach((itm) => {
          if (
            Settings.isDataNotExistsInArray(
              [
                "activity_master_details_id",
                "scheme_id",
                "major_component_id",
                "sub_component_id",
                "activity_master_id",
                "status",
              ],
              itm.name
            )
          ) {
            let rowObj = {};

            rowObj["headerName"] =
              itm.name === "id" ? "S.No." : formatHeader(itm.name);
            rowObj["field"] = itm.name === "id" ? null : itm.name;
            rowObj["valueGetter"] = (params) => {
              if (
                Settings.isDataExistsInArray(
                  [
                    "id",
                    "scheme_name",
                    "major_component_name",
                    "sub_component_name",
                    "activity_master_name",
                    "activity_master_details_name",
                  ],
                  itm.name
                )
              ) {
                if (itm.name === "major_component_name") {
                  if (params.data.major_component_id === 666666) {
                    return `Major Component Subtotal: `;
                  }
                }
                if (itm.name === "sub_component_name") {
                  if (params.data.sub_component_id === 777777) {
                    return `Subtotal: `;
                  }
                }
                if (itm.name === "activity_master_name") {
                  if (params.data.activity_master_id === 888888) {
                    return `Subtotal: `;
                  }
                }
                if (itm.name === "activity_master_details_name") {
                  if (params.data.activity_master_details_id === 999999) {
                    return `Subtotal: `;
                  }
                }

                if (params.data.scheme_id === 555555) {
                  return `Grand Subtotal: `;
                } else {
                  return params.data[itm.name];
                }
              } else {
                return params.data[itm.name];
              }
            };
            rowObj["colSpan"] = (params) => {
              if (itm.name === "scheme_name") {
                if (params.data.scheme_id === 555555) {
                  return 5;
                } else {
                  return 1;
                }
              } else if (itm.name === "major_component_name") {
                if (params.data.major_component_id === 666666) {
                  return 4;
                } else {
                  return 1;
                }
              } else if (itm.name === "sub_component_name") {
                if (params.data.sub_component_id === 777777) {
                  return 3;
                } else {
                  return 1;
                }
              } else if (itm.name === "activity_master_name") {
                if (params.data.activity_master_id === 888888) {
                  return 2;
                } else {
                  return 1;
                }
              } else {
                return 1;
              }
            };
            rowObj["width"] = itm.name === "id" ? 91 : null;
            rowObj["cellStyle"] = (params) => {
              return !Settings.isDataNotExistsInArray(
                [
                  "id",
                  "scheme_name",
                  "major_component_name",
                  "sub_component_name",
                  "activity_master_name",
                ],
                itm.name
              )
                ? { textAlign: "right" }
                : { textAlign: "left" };
            };
            setHeaderRows((prev) => [...prev, rowObj]);
          }
        });
      }
    },
    [headerRows]
  );

  const noRowsOverlayComponent = useMemo(() => {
    return customNoRowsOverlay;
  }, []);

  useEffect(() => {
    setObject({});
    API.post("api/prabandh/submit-plan_submit-district-plan", { state_id: stateID, district_id: user?.user_district_id, activity_group_code: user?.activity_group_code },
      (res) => {
        if (res?.data?.rowCount !== (1 || 0)) {
          noRowsOverlayComponent();
        }
        setObject(res);
        configGridHeader(res);
        if (Settings.isDistrictApproverUser()) {
          setHideButton(false);
        } else {
          setHideButton(true);
        }
        if (res?.data?.rows[0]?.status >= 3) {
          setdisableButton(true);
        } else {
          setdisableButton(false);
        }
      }
    );
  }, [refresh]);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      // flex: 2,
      floatingFilter: false,
      sortable: true,
      resizable: true,
      filter: true,
    };
  }, []);

  const renderAGGrid = () => {
    if (object?.data) {
      return (
        <div style={gridStyle} className={"ag-theme-alpine AS"}>
          <AgGridReact
            ref={gridRef}
            columnDefs={headerRows}
            rowData={
              object?.data?.rows?.length === (1 || 0) ? [] : object?.data?.rows
            }
            animateRows={true}
            defaultColDef={defaultColDef}
            checkboxSelection={false}
            rowSelection={"single"}
            pagination={false}
            paginationAutoPageSize={false}
            paginationPageSize={pagesize ? pagesize : 10}
            viewportRowModelPageSize={1}
            getRowStyle={getRowStyle}
            noRowsOverlayComponent={noRowsOverlayComponent}
          />
        </div>
      );
    }
  };

  const handleSave = (e) => {
    API.post("api/prabandh/save-plan-status-details",
      {
        state_id: user.user_state_id,
        district_id: user.user_district_id,
        user_id: user.id,
        user_role_id: user.user_role_id,
        plan_status_id: saveAction,
        plan_session_id: 1,
        plan_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1
          }`,
        user_remarks: e,
      },
      (res) => {
        API.post("api/prabandh/submit-plan", { district_id: user.user_district_id, status: saveAction, user_state_id: user?.user_state_id },
          (res) => {
            //setReportData(res.data.rows);
            setRefresh(new Date().getMilliseconds());
          }
        );
      }
    );
  };

  // const exportToExcel = async (fileName = "State_plan") => {
  //   let headers = [
  //     { srl: "S.No." },
  //     { scheme_name: "SCHEME" },
  //     { major_component_name: "MAJOR COMPONENT" },
  //     { sub_component_name: "SUB COMPONENT" },
  //     { activity_master_name: "ACTIVITY" },
  //     { activity_master_details_name: "SUB ACTIVITY" },
  //     { physical_quantity: "PHYSICAL QUANTITY" },
  //     { unit_cost: "UNIT COST (₹ In Lakhs)" },
  //     { financial_amount: "FINANCIAL AMOUNT (₹ In Lakhs)" },
  //   ];
  // };
  /*
  const handleGeneratePdf = async (fileName) => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/submitstateplan`;
    // const state_id = $("select[name=state-list]").val();
    // const district_id = $("select[name=districts-list]").val();
    // const scheme_id = $("select[name=scheme-list]").val();
    // const major_component_id = $("select[name=major-component-list]").val();

    const dt = JSON.parse(localStorage.getItem("subcomponent_config"));
    try {
      setPdfStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          user: user,
          state_id: user?.user_state_id,
          district_id: null,
          scheme_id: dt?.schemeId || 0,
          major_component_id: dt?.subComponent?.prb_major_component_id || "0",
          report_type: "Submit State Plan",
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
        }
      );
      setPdfStatus(false);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + ".pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
*/

  const exportTableToPDF = async () => {
    const apiYear = store.getState().year.year;
    const district_id = user?.user_district_id;
    const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/costing-report/${district_id}/2/${apiYear}`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          Authorization: `Bearer ${Helper.token()}`
          // API_Year: apiYear,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      link.setAttribute(
        "download",
        `FillPlans_${apiYear + "_" + currentdate}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
      setPdfbtnStatus(false);
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };
  const scheme = Model.scheme;
  // const state_name = stateList?.filter((c) => c.id == stateID);

  const exportTableToExcel = async () => {
    // const districts = getDistrictsList("find", user?.user_state_id || 0);
    // const district_name = districts && districts?.filter(vl=>(vl.district_id===userData))
    const apiYear = store.getState().year.year;
    exportToExcel("districtReport", {
      reportData: object?.data?.rows,
      headers: headerRows,
      scheme: scheme,
      fileName: `${userData?.district_name}_District`,
      sheetName: "Sheet 1",
      report_header: `District Report: ${userData?.district_name}, Year: ${apiYear}`,
    });
  };
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header row px-2 mb-3">
        <div className="col-xl-4 col-lg-4 col-sm-4">
          <h1>Submit District Plan</h1>
        </div>
        <div className="col-xl-4 col-lg-4 col-sm-4">
          {disableButton && (
            <h6 style={{ fontWeight: "bold" }}>Status : Already Approved</h6>
          )}
        </div>
        <div className="col-xl-4 col-lg-4 col-sm-4">
          <button
            type="button"
            style={{ marginRight: "1rem" }}
            className="btn btn-danger float-end"
            disabled={
              object?.length === 0
                ? true
                : object?.data?.rows?.length === (1 || 0)
                  ? true
                  : pdfbtnStatus
            }
            onClick={exportTableToPDF}
          >
            {pdfbtnStatus ? <Btnloader /> : ""}{" "}
            <i className="bi bi-file-earmark-pdf"></i>{" "}
            <span className="mobile-hide">Export To</span> PDF
          </button>
          <button
            type="button"
            className="btn btn-success float-end mx-2"
            onClick={exportTableToExcel}
            disabled={
              object === undefined || object?.data?.rows?.length === (1 || 0)
            }
          >
            <i className="bi bi-file-earmark-excel"></i>{" "}
            <span className="mobile-hide">Export To</span> Excel
          </button>
        </div>
      </div>

      <div className="dashboard-main-content-info">
        <div className="row">
          {renderAGGrid()}
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            {!hideButton && !disableButton && (
              <button
                className="btn btn-success cfr mt-3"
                onClick={(e) => {
                  setSaveAction(3);
                  setIsOpen(true);
                }}
                disabled={object?.data?.rows?.length === (1 || 0)}
              >
                <i className="bi bi-save"></i> Approve
              </button>
            )}
            {!hideButton &&
              !disableButton &&
              user.user_role_id < 8 &&
              !simulatedUser &&
              simulatedUser?.user_role_id !== 4 && (
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
    </div>
  );
};
export default SubmitPlan;
