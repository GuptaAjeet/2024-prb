import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Helper, Hook } from "../../../apps";
import "./ReportStyle.css";
import api from "../../../apps/utilities/api";
import "./ReportStyle.css";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import Btnloader from "../../../apps/components/elements/Btnloader";
import customNoRowsOverlay from "../../admin/users/admin/master/reports/childrens/customNoRowsOverlay";
import { useNavigate } from "react-router-dom";

const CombinedReport = () => {
  const user = Helper.auth.user;
  const gridRef = useRef();
  const gridStyle = useMemo(
    () => ({ height: 600, width: "100%", marginLeft: "10px" }),
    []
  );
  const [rowData, setRowData] = useState();
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [, setDistrictsList] = useState([]);
  const [stateID, setStateID] = useState(0);
  const [, setDistrictID] = useState(0);
  const [reportData] = useState([]);
  const navigate = useNavigate();

  const state_name = stateList?.filter((c) => c.id === stateID);
  const [pagesize, setpagesize] = useState(10);
  const [columnDefs] = useState([
    {
      headerName: `Expenditure Report`,
      headerClass: "main_header",
      children: [
        {
          headerName: "Particular",
          rowSpan: 2,
          headerClass: "subheader",
          children: [
            {
              headerName: "Scheme",
              field: "scheme_name",
              headerClass: "report_header",
            },
            {
              headerName: "Major Component",
              field: "major_component_name",
              chartDataType: "category",
              headerClass: "report_header",
            },
            {
              headerName: "Sub Component",
              field: "sub_component_name",
              headerClass: "report_header",
              chartDataType: "series",
              headerClass: "report_header",
            },
            {
              headerName: "Activity Master",
              field: "activity_master_name",
              headerClass: "report_header",
              headerClass: "report_header",
            },
            {
              headerName: "Activity Detail",
              field: "activity_master_details_name",
              headerClass: "report_header",
            },
          ],
        },
        {
          headerName: "Proposal",
          headerClass: "subheader",
          children: [
            {
              headerName: "Physical",
              field: "physical_quantity",
              headerClass: "report_header",
            },
            {
              headerName: "Unit Cost",
              field: "udise_sch_code",
              headerClass: "report_header",
              headerClass: "report_header",
            },
            {
              headerName: "Financial",
              field: "financial_amount",
              headerClass: "report_header",
              headerClass: "report_header",
            },
          ],
        },
      ],
    },
  ]);

  const getSavedData = () => {
    if (stateID !== 0 || null) {
      api.post(
        `api/reports/get-expenditure-report`,
        {
          state_id: stateID,
          district: "0",
          scheme_id: "0",
          major_component_id: "0",
          sub_component_id: "0",
          activity_master_id: "0",
          activity_master_details_id: "0",
          inception_year: "2023-2024",
        },
        (res) => {
          if (res?.data?.length > 0) {
            if (res?.data?.length === 0 || res?.data?.length === 1) {
              setRowData([]);
              return gridRef?.current?.api?.showNoRowsOverlay();
            } else {
              setRowData(res.data);
              gridRef?.current?.api?.hideOverlay();
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    if (stateID === 0) {
      setRowData([]);
    } else {
      getSavedData();
    }
  }, [stateID]);

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
      return { background: "#8cffa1" }; // Change the background color based on your condition
    }
    return null; // Default styling if no condition is met
  };

  const headerRows = [
    {
      headerName: `Expenditure Report ${state_name?.length > 0 && state_name[0].name
        }`,
      headerClass: "main_header",
      children: [
        {
          headerName: "S. No.",
          field: "index",
          headerClass: "report_header",
          width: 20,
          valueGetter: (params) => params.node.rowIndex + 1,
        },
        {
          headerName: "Scheme",
          field: "scheme_name",
          headerClass: "report_header",
          width: 250,
          valueGetter: (params) =>
            +params.data.scheme_id === 555555
              ? `Subtotal: `
              : params.data.scheme_name,
          colSpan: (params) => (params.data.scheme_id === 555555 ? 5 : 1),
        },
        {
          headerName: "Major Component",
          field: "major_component_name",
          chartDataType: "category",
          headerClass: "report_header",
          width: 250,
          valueGetter: (params) =>
            +params.data.major_component_id === 666666 &&
              params.data.scheme_id !== 555555
              ? `Subtotal: `
              : params.data.major_component_name,
          colSpan: (params) =>
            params.data.major_component_id === 666666 ? 4 : 1,
        },
        {
          headerName: "Sub Component",
          field: "sub_component_name",
          headerClass: "report_header",
          chartDataType: "series",
          headerClass: "report_header",
          width: 250,
          valueGetter: (params) =>
            +params.data.sub_component_id === 777777 &&
              +params.data.major_component_id !== 666666
              ? `Subtotal: `
              : params.data.sub_component_name,
          colSpan: (params) => (params.data.sub_component_id === 777777 ? 3 : 1),
        },
        {
          headerName: "Activity Master",
          field: "activity_master_name",
          headerClass: "report_header",
          headerClass: "report_header",
          width: 250,
          valueGetter: (params) =>
            +params.data.activity_master_id === 888888 &&
              +params.data.sub_component_id !== 777777
              ? `Subtotal: `
              : params.data.activity_master_name,
          colSpan: (params) =>
            params.data.activity_master_id === 888888 ? 2 : 1,
        },
        {
          headerName: "Sub Activity ",
          field: "activity_master_details_name",
          headerClass: "report_header",
          width: 250,
          valueGetter: (params) =>
            +params.data.activity_master_details_id === 999999 &&
              +params.data.activity_master_id !== 888888
              ? `Subtotal: `
              : params.data.activity_master_details_name,
        },
        {
          headerName: "Budget Approved",
          headerClass: "report_header",
          children: [
            {
              headerName: "Physical",
              field: "budget_quantity",
              headerClass: "report_header",
              cellStyle: (params) => ({ textAlign: "right" }),
              valueGetter: (params) =>
                params.data["budget_quantity"] == null
                  ? 0
                  : params.data["budget_quantity"],
            },
            {
              headerName: "Financial Amount",
              headerClass: "report_header",
              valueGetter: (params) => {
                return Helper.numberFormat(params.data["budget_amount"], 5);
                return params.data["budget_amount"] == null
                  ? 0
                  : params.data["budget_amount"]
              },
//              valueFormatter: params => parseFloat(params.value)?.toFixed(5).replace(/(\.[0-9]*[1-9])0+$|\.0*$/g, "$1"),
              cellStyle: (params) => ({ textAlign: "right" }),
            },
          ],
        },
        {
          headerName: "Expected Progress Up To 31st March 2024",
          field: "activity_master_details_name",
          headerClass: "report_header",
          children: [
            {
              headerName: "Physical",
              field: "progress_quantity",
              headerClass: "report_header",
              valueGetter: (params) =>
                params.data["progress_quantity"] == null
                  ? 0
                  : params.data["progress_quantity"],
              cellStyle: (params) => ({ textAlign: "right" }),
            },
            {
              headerName: "Financial Amount",
              field: "progress_amount",
              headerClass: "report_header",
              valueGetter: (params) => Helper.numberFormat(params.data["progress_amount"], 5),
              // valueFormatter: params => parseFloat(params.value)?.toFixed(5).replace(/(\.[0-9]*[1-9])0+$|\.0*$/g, "$1"),
              cellStyle: (params) => ({ textAlign: "right" }),
            },
          ],
        },
      ],
    },
  ];

  const excelStyles = useMemo(() => {
    return [
      {
        id: "cell",
        alignment: {
          vertical: "Center",
          horizontal: "Left",
        },
        borders: {
          borderBottom: {
            color: "#ffab00",
            lineStyle: "Continuous",
            weight: 6,
          },
        },
        font: {
          size: 10,
        },
      },
      {
        id: "main_header",
        alignment: {
          vertical: "Center",
          horizontal: "Center",
        },
        interior: {
          color: "#64e359",
          pattern: "Solid",
          patternColor: undefined,
        },
        borders: {
          borderBottom: {
            color: "#ffab00",
            lineStyle: "Continuous",
            weight: 6,
          },
        },
        font: {
          color: "#ffffff",
          size: 28,
          weight: 6,
        },
      },
      {
        id: "subheader",
        alignment: {
          vertical: "Center",
          horizontal: "Center",
        },
        interior: {
          color: "#8edfe8",
          pattern: "None",
          patternColor: "#000000",
          width: 500,
        },
        font: {
          color: "#0059ff",
          size: 20,
        },
      },
      {
        id: "report_header",
        alignment: {
          vertical: "Center",
          horizontal: "Center",
        },
        font: {
          color: "#000000",
          bold: true,
          size: 16,
        },
        interior: {
          color: "#ffffff",
          pattern: "None",
          patternColor: "#000000",
        },
      },
    ];
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      minWidth: 100,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      floatingFilter: false,
      wrapHeaderText: true,

      pagination: true,
    };
  }, []);

  useEffect(() => {
    const allColumnIds = [];
    columnDefs.forEach((column) => {
      allColumnIds.push(column.field);
    });
  }, []);
  const onBtExport = useCallback(() => {
    const fileName = `Expenditure_Report (${state_name?.length > 0 ? state_name[0]?.name : ''})_` + Date.now().toString();
    gridRef.current.api.exportDataAsExcel({ fileName });
  }, []);

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

  useEffect(() => {
    setStateID(user.user_state_id || 0);
    setDistrictID(user.user_district_id || 0);
    //getStateList();
    getDistrictsList("find", user?.user_state_id || 0);
  }, [reportData]);

  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);
  };

  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const handleGeneratePdf = async () => {
    let thead = [
      [
        {
          name: "S.NO.",
          rowSpan: 2,
        },
        {
          name: "SCHEME",
          rowSpan: 2,
        },
        {
          name: "MAJOR COMPONENT",
          rowSpan: 2,
        },
        {
          name: "SUB COMPONENT",
          rowSpan: 2,
        },
        {
          name: "ACTIVITY MASTER",
          rowSpan: 2,
        },
        {
          name: "SUB ACTIVITY",
          rowSpan: 2,
        },
        {
          name: "Budget Approved",
          colSpan: 2,
        },
        {
          name: "Progress",
          colSpan: 2,
        },
      ],
      [
        {
          name: "Physical",
        },
        {
          name: "Financial (₹ In Lakhs)",
        },
        {
          name: "Physical",
        },
        {
          name: "Financial (₹ In Lakhs)",
        },
      ],
    ];
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        `${REACT_APP_URL}api/download/pdf/report`,
        {
          filter: {
            state_id: stateID,
            district: "0",
            scheme_id: "0",
            major_component_id: "0",
            sub_component_id: "0",
            activity_master_id: "0",
            activity_master_details_id: "0",
            inception_year: "2023-2024",
          },
          name: "expenditure",
          heading: `Expenditure Report ${state_name.length === 0
            ? "( All States )"
            : `( ${state_name?.length > 0 && state_name[0].name} )`
            } `,
          thead,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`,
          },
        }
      );
      setPdfbtnStatus(false);
      if (response) {
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
        link.setAttribute("download", `Expenditure_2024-2025_${datetime}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const noRowsOverlayComponent = useMemo(() => {
    return customNoRowsOverlay;
  }, []);

  const handleChangePageSize = (e) => {
    setpagesize(e.target.value);
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>Expenditure Report</h1>
        <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate("/auth/prabandh/report")}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>
      </div>

      <div className="row p-3">
        <div
          className="dashboard-main-content-info mb-2"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-select"
                name="state-list"
                value={stateID}
                disabled={user.state_id}
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

            <div className="col-md-3"></div>

            <div className="col-md-6 text-end">
              <button
                type="button"
                className="btn btn-success float-end"
                disabled={rowData && rowData.length > 0 ? false : true}
                onClick={onBtExport}
              >
                <i className="bi bi-file-earmark-excel"></i>{" "}
                <span className="mobile-hide">Export To</span> Excel
              </button>
              <button
                type="button"
                style={{ marginRight: "1rem" }}
                className="btn btn-danger float-end"
                disabled={
                  rowData && rowData.length > 0
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
            </div>
          </div>
        </div>
      </div>
      {+stateID && +stateID !== 0 ? (
        <div >

          <div className="row">
            <div style={gridStyle} className={"ag-theme-alpine AS"}>
              <AgGridReact
                ref={gridRef}
                columnDefs={headerRows}
                rowData={rowData}
                animateRows={true}
                defaultColDef={defaultColDef}
                checkboxSelection={true}
                suppressRowClickSelection={true}
                rowSelection={"single"}
                getRowStyle={getRowStyle}
                pagination={true}
                excelStyles={excelStyles}
                paginationPageSize={pagesize ? pagesize : 10}
                paginationPageSizeSelector={[pagesize ? pagesize : 10, 20, 50, 100]}
                paginationAutoPageSize={false}
                viewportRowModelPageSize={1}
                noRowsOverlayComponent={noRowsOverlayComponent}
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
                  onClick={handleChangePageSize}
                >
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value={rowData ? rowData.length : null}>All</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3 style={{ textAlign: "center", height: "600px" }}>No Data Found</h3>
      )}
    </div>
  );
};

export default CombinedReport;
