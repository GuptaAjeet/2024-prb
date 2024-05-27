import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { Helper, Settings, Hook } from "../../../apps";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "./spill.css";
import api from "../../../apps/utilities/api";
import Spinner from "../../../apps/components/elements/Spinner";
import exportToExcel from "./PrabandhReports/ExcelReports";
import store from "../../../redux/app/store";
import Btnloader from "../../../apps/components/elements/Btnloader";

const StateReports = () => {
  let userData = Helper.auth?.user;

  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [spin, setSpin] = useState(false);
  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [object, setObject] = useState();
  const [setReportData] = useState([]);
  const [pagesize, setpagesize] = useState(12);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const state_name = stateList?.filter((c) => +c.id === +stateID);
  const scheme = {
    1: "Primary Education",
    2: "Secondary Education",
    3: "Teacher's Eductaion",
  };
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

  const getStateMatrixData = () => {
    setSpin(true);
    api.post(
      "api/prabandh/state-costing-sheet-report",
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
      headerName: `Costing Report ( ${state_name[0]?.name} )`,
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
                ],
                itm.name
              )
            ) {
              if (itm.name === "major_component_name") {
                if (+params.data.major_component_id === 666666) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "sub_component_name") {
                if (+params.data.sub_component_id === 777777) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "activity_master_name") {
                if (+params.data.activity_master_id === 888888) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "activity_master_details_name") {
                if (+params.data.activity_master_details_id === 999999) {
                  return `Subtotal: `;
                }
              }
              if (+params.data.scheme_id === 555555) {
                return `Grand Subtotal: `;
              } else {
                return params.data[itm.name];
              }
            } else {
              return params.data[itm.name] == null ? 0 : params.data[itm.name];
            }
          };
          rowObj["colSpan"] = (params) => {
            if (itm.name === "scheme_name") {
              if (+params.data.scheme_id === 555555) {
                return 5;
              } else {
                return 1;
              }
            } else if (itm.name === "major_component_name") {
              if (+params.data.major_component_id === 666666) {
                return 4;
              } else {
                return 1;
              }
            } else if (itm.name === "sub_component_name") {
              if (+params.data.sub_component_id === 777777) {
                return 3;
              } else {
                return 1;
              }
            } else if (itm.name === "activity_master_name") {
              if (+params.data.activity_master_id === 888888) {
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
    if (+stateID !== 0) {
      getStateMatrixData();
    } else {
      setObject([]);
    }
  }, [stateID]);

  useEffect(() => {
    if (object !== undefined && object?.data?.rows?.length > 0) {
      configGridHeader();
    }
  }, [object]);
  useEffect(() => {
    api.post(
      "api/prabandh/get-state-cost-sheet-data",
      {
        report_id: 123,
        user: userData,
        state_id: userData.user_state_id,
        district_id: 2607,
        year: new Date().getFullYear(),
      },
      (res) => {
        setReportData(res.data);
      }
    );
  }, []);
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
      // sortable: true,
      // resizable: true,
      minWidth: 250,
      // filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      // floatingFilter: false,
      initialWidth: 250,
      wrapHeaderText: true,
    };
  }, []);

  const exportTableToExcel = async () => {
    const apiYear = store.getState().year.year;
    // exportToExcel(`Costing Report: ${state_name[0] && state_name[0]?.name} and Year: ${apiYear}`, {
    //   reportData: object?.data?.rows,
    //   headers: headerRows,
    //   scheme: scheme,
    //   fileName: "State_costing",
    //   sheetName: "Costing Sheet",
    // });
    exportToExcel("stateReport", {
      reportData: object?.data?.rows,
      headers: headerRows,
      scheme: scheme,
      fileName: "State_costing",
      sheetName: "Sheet 1",
      report_header: `Costing Report: ${
        state_name[0] && state_name[0]?.name
      }, Year: ${apiYear}`,
    });
    //  Helper.exportAGGridTableToExcel(object.data, headerRows, scheme, "Major_component_district_matrix");
  };
  // const exportTableToPDF = async () => {
  //   const apiYear = store.getState().year.year;
  //   const pdfUrl = `${REACT_APP_URL}api/download/pdf/download-state-report`;
  //   const data = {
  //     report_id: 123,
  //     user: userData,
  //     state_id: stateID,
  //     district_id: 2607,
  //   };
  //   try {
  //     setPdfbtnStatus(true);
  //     const response = await axios.post(pdfUrl, data, {
  //       responseType: "arraybuffer",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/pdf",
  //         API_Year: apiYear,
  //       },
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     var currentdate = new Date();
  //     link.setAttribute("download", `FillPlans_2024-2025${currentdate}.pdf`); //or any other extension
  //     document.body.appendChild(link);
  //     link.click();
  //     setPdfbtnStatus(false);
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     setPdfbtnStatus(false);
  //   }
  // };

  const exportTableToPDF = async () => {
    const apiYear = store.getState().year.year;
    const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/costing-report/${stateID}/1/${apiYear}`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
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
          // gridOptions={gridOptions}
          /*          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true} */
          // ref={gridRef}
          columnDefs={repo_head}
          rowData={object?.data?.rows}
          animateRows={true}
          defaultColDef={defaultColDef}
          checkboxSelection={false}
          rowSelection={"single"}
          // domLayout='autoHeight'
          pagination={true}
          paginationAutoPageSize={false}
          paginationPageSize={pagesize ? pagesize : 12}
          viewportRowModelPageSize={1}
          getRowStyle={getRowStyle}

          // pinnedBottomRowData={pinnedBottomRowData}
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
            </option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>State Costing Report</h1>

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
          {pdfbtnStatus ? <Btnloader /> : ""}{" "}
          <i className="bi bi-file-earmark-pdf"></i>{" "}
          <span className="mobile-hide">Export To</span> PDF
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

export default StateReports;
