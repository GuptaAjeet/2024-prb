import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { Helper, Settings, Hook } from "../../../apps";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "../prabandh/spill.css";
import api from "../../../apps/utilities/api";
import Spinner from "../../../apps/components/elements/Spinner";
import exportToExcel from "./ExportReports/ExcelReports";
import store from "../../../redux/app/store";
import Btnloader from "../../../apps/components/elements/Btnloader";
import { useNavigate } from "react-router-dom";

const Recommendation = () => {
  let userData = Helper.auth?.user;

  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [spin, setSpin] = useState(false);
  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [object, setObject] = useState();
  const [pagesize, setpagesize] = useState(12);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const [pdfbtnStatuss, setPdfbtnStatuss] = useState(false);
  const state_name = stateList?.filter((c) => +c.id === +stateID);
  const scheme = {
    1: "Primary Education",
    2: "Secondary Education",
    3: "Teacher's Eductaion",
  };
  const navigate = useNavigate();

  const getRowStyle = (params) => {
    if (+params.data.scheme_id === 555555) {
      return { background: "#ff9696" };
    } else if (+params.data.major_component_id === 666666) {
      return { background: "#f799ff" };
    } else if (+params.data.sub_component_id === 777777) {
      return { background: "#8cf0ff" };
    } else if (+params.data.activity_master_id === 888888) {
      return { background: "#f5df98" };
    } else if (+params.data.activity_master_details_id === 999999) {
      return { background: "#8cffa1" }; // Change the background color based on your condition
    }
    return null; // Default styling if no condition is met
  };

  const getStateCostingProposedData = () => {
    setSpin(true);
    api.post(
      "api/reports/state-costing-proposed-sheet-report",
      { state_id: stateID },
      (res) => {
        setObject(res);
        setSpin(false);
      }
    );
  };

  /*   const getStateList = () => {
    setSpin(true);
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */

  const [headerRows, setHeaderRows] = useState([]);
  let repo_head = [
    {
      headerName: `Recommendation ( ${state_name?.length > 0 && state_name[0]?.name} )`,
      headerClass: "main_header",
      children: headerRows,
    },
  ];

  const formatHeader = (key) => {
    return Helper.ucfirst(key.toLowerCase().split("_").join(" "));
  };

  const configGridHeader = useCallback(() => {
    if (object !== null && object?.data?.fields !== undefined) {
      setHeaderRows([]);
      object?.data?.fields?.forEach((itm) => {
        let rowObj = {};

        if (Settings.isDataExistsInArray(itm?.name, "id")) {
          return null;
        } else {
          rowObj["headerName"] =
            itm.name === "id" ? "S.No." : formatHeader(itm.name);
          rowObj["field"] = itm.name === "id" ? null : itm.name;
          rowObj["valueGetter"] = (params) => {
            if (
              Settings.isDataExistsInArray(
                [
                  "scheme_name",
                  "major_component_name",
                  "sub_component_name",
                  "activity_master_name",
                  "activity_master_details_name",
                  "coordinator_remarks",
                ],
                itm.name
              )
            ) {
              if (itm.name === "major_component_name") {
                if (+params.data.major_component_id === 666666 && +params.data.scheme_id !== 555555) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "sub_component_name") {
                if (+params.data.sub_component_id === 777777 && +params.data.major_component_id !== 666666) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "activity_master_name") {
                if (+params.data.activity_master_id === 888888 && +params.data.sub_component_id !== 777777) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "activity_master_details_name") {
                if (+params.data.activity_master_details_id === 999999 && +params.data.activity_master_id !== 888888) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "coordinator_remarks") {
                if (params.data.coordinator_remarks === null) {
                  return "";
                } if (+params.data.scheme_id === 555555 || +params.data.major_component_id === 666666 || +params.data.sub_component_id === 777777 || +params.data.activity_master_id === 888888 || +params.data.activity_master_details_id === 999999) {
                  return "";
                }
              } if (itm.name === "scheme_name") {
                if (+params.data.scheme_id === 555555) {
                  return `Grand Subtotal: `;
                } else {
                  return params.data.scheme_name;
                }
              } else {
                return params.data[itm.name];
              }
            } else if (Settings.isDataExistsInArray(["physical_quantity", "proposed_physical_quantity",], itm.name)) {
              return params.data[itm.name] === null ? 0 : Helper.numberFormat(params.data[itm.name], 0)
            } else {
              return params.data[itm.name] === null ? 0 : `₹${Helper.numberFormat(params.data[itm.name], 5)}`
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
          rowObj["headerClass"] = "report_header";
          rowObj["width"] = itm.name === "id" ? 91 : null;
          rowObj["cellStyle"] = (params) => {
            
            return Settings.isDataNotExistsInArray(
              [
                "id",
                "scheme_name",
                "major_component_name",
                "sub_component_name",
                "activity_master_name",
                "activity_master_details_name",
                "coordinator_remarks",
              ],
              itm.name
            )
              ? { textAlign: "right" }
              : { textAlign: "left" };
          };
        }
        setHeaderRows((prev) => [...prev, rowObj]);
      });
    }
  }, [object]);

  useEffect(() => {
    //getStateList();
  }, []);

  useEffect(() => {
    if (stateID !== 0) {
      getStateCostingProposedData();
    } else {
      setObject([]);
    }
  }, [stateID]);

  useEffect(() => {
    if (object !== undefined && object?.data?.rows?.length > 0) {
      configGridHeader();
    }
  }, [object]);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: false,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      editable: false,
      minWidth: 250,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      initialWidth: 250,
      wrapHeaderText: true,
    };
  }, []);

  const exportTableToExcel = async () => {
    const apiYear = store.getState().year.year;

    exportToExcel("stateProposedReport", {
      reportData: object?.data?.rows,
      headers: headerRows,
      scheme: scheme,
      fileName: "Recommendation",
      sheetName: "Sheet 1",
      report_header: `Recommendation: ${state_name?.length > 0 && state_name[0]?.name
        }, Year: ${apiYear}`,
    });
  };

  const exportDetailsTableToPDFs = async () => {
    const apiYear = store.getState().year.year;
    const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/recommendation-details/${stateID}/${apiYear}`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.get(pdfUrl, {
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

      link.setAttribute(
        "download",
        `Recommendation_${apiYear + "_" + currentdate}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
      setPdfbtnStatus(false);
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };

  const exportTableToPDF = async () => {
    const apiYear = store.getState().year.year;
    const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/recommendation/${stateID}/${apiYear}`;
    try {
      setPdfbtnStatuss(true);
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          Authorization: `Bearer ${Helper.token()}`
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      link.setAttribute(
        "download",
        `Recommendation_${apiYear + "_" + currentdate}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
      setPdfbtnStatuss(false);
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatuss(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state-list") {
      setStateID(+value);
    }
  };

  const handlePagination = (e) => {
    e.preventDefault();
    const value = parseInt(e.target.value);
    setpagesize(+value);
  };
  const renderAGGrid = () => {
    return (
      <div style={gridStyle} className={"ag-theme-alpine AS"}>
        <AgGridReact
          ref={gridRef}
          columnDefs={repo_head}
          rowData={object?.data?.rows}
          animateRows={true}
          defaultColDef={defaultColDef}
          checkboxSelection={false}
          rowSelection={"single"}
          pagination={true}
          // paginationAutoPageSize={false}
          paginationPageSize={pagesize ? pagesize : 12}
          paginationPageSizeSelector={[pagesize ? pagesize : 12, 20, 50, 100]}
          // viewportRowModelPageSize={1}
          getRowStyle={getRowStyle}
        />
        <div
          className="mx-2"
          style={{
            position: "absolute",
            marginTop: "-33px",
            width: "200px",
            height: "50px",
          }}
        >
          Page Size :
          <select
            name="pagination"
            id="pet-select"
            className="mx-2"
            style={{
              position: "absolute",
              marginTop: "-3px",
              width: "130px",
              height: "25px",
            }}
            onClick={handlePagination}
          >
            <option value={12}>12</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option
              value={object?.data?.rows ? object?.data?.rows?.length : null}
            >
              All
            </option>.

          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>Recommendation Report</h1>
        <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate("/auth/prabandh/report")}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>
        <button
          type="button"
          style={{ marginRight: "1rem" }}
          className="btn btn-danger float-end"
          disabled={
            object?.length === 0
              ? true
              : object?.data?.length === 0
                ? true
                : pdfbtnStatus
          }
          onClick={exportTableToPDF}
        >
          {pdfbtnStatuss ? <Btnloader /> : ""}{" "}
          <i className="bi bi-file-earmark-pdf"></i>{" "}
          <span className="mobile-hide">Export To </span> PDF
        </button>
        <button
          type="button"
          className="btn btn-success float-end mx-2"
          onClick={exportTableToExcel}
          disabled={
            object?.length === 0
              ? true
              : object?.data?.length === 0
                ? true
                : pdfbtnStatus
          }
        >
          <i className="bi bi-file-earmark-excel"></i>{" "}
          <span className="mobile-hide">Export To</span> Excel
        </button>
      </div>

      {Settings.isNationalUser() && (
        <div
          className="dashboard-main-content-info mb-3 mt-3"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="state-list"
                    value={stateID}
                    onChange={handleChange}
                    disabled={stateList?.find(
                      (state) => state.id === userData.user_state_id
                    )}
                  >
                    <option value={0}>--Select State--</option>
                    {stateList?.map((st, stidx) => (
                      <option key={`st_${stidx}`} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-content-info">
        <div className="row">
          {spin ? (
            <Spinner />
          ) : object === undefined ||
            object.length === 0 ||
            object?.data?.length === 0 ? (
            <h3 className="text-center">No Data Found</h3>
          ) : (
            renderAGGrid()
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
