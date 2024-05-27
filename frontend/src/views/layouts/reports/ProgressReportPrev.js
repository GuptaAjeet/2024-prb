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
import { API, Helper, Hook } from "../../../apps";
import "./ReportStyle.css";
import api from "../../../apps/utilities/api";
import "./ReportStyle.css";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import Btnloader from "../../../apps/components/elements/Btnloader";

const ProgressReportPrev = () => {
  const user = Helper.auth.user;
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ height: 600, boxSizing: "border-box" }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: "100%", marginLeft: "10px" }), []);
  const [rowData, setRowData] = useState();
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [reportData] = useState([]);
  const onGridReady = (params) => { };
  const state_name = stateList?.filter((c) => c.id === stateID);
  const district_name = districtsList?.filter((c) => c.id === districtID);
  const [columnDefs] = useState([
    {
      headerName: `Progress Report `,
      headerClass: "main_header",
      children: [
        {
          headerName: "Particular",
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

  const handleFetchData = () => {
    API.post(
      `api/schools/getreportdt`,
      { state_id: Number(stateID), district_id: Number(districtID) },
      (response) => {
        if (response.status) {
          setRowData(response?.data);
        }
      }
    );
  };
  useEffect(() => {
    handleFetchData();
  }, [stateID, districtID]);
  const onCellValueChanged = (params) => {
    // Access edited values in params
    API.post(`api/schools/update`, {}, (response) => {
      if (response.status) {
      }
    });
  };
  const gridOptions = {
    onCellValueChanged: onCellValueChanged,
    excelStyles: [
      {
        id: "report_header",
        font: {
          bold: true,
        },
      },
    ],
    domLayout: "autoWidth",
    processHeaderCallback: (params) => {
      return {
        text: "params.column.getColDef().headerName", // use the column header name
        styleId: "report_header", // apply the 'header' style defined above
      };
    },
  };
  const defaultColDef = useMemo(() => {
    return {
      flex: 2,
      editable: false,
      sortable: true,
      resizable: true,
      minWidth: 130,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      floatingFilter: true,
    };
  }, []);
  useEffect(() => {
    const allColumnIds = [];
    columnDefs.forEach((column) => {
      allColumnIds.push(column.field);
    });
  }, []);

  const onBtExport = useCallback(() => {
    const fileName = `Progress_Report (${state_name?.length > 0 ? state_name[0]?.name : ''})_` + Date.now().toString();
    gridRef.current.api.exportDataAsExcel({ fileName });
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "athlete",
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);

  const handleCellClicked = (params) => {
    const clickedColumnName = params.column.colDef.field;
    params.node.setSelected(!params.node.isSelected());

    const selectedNodes = gridRef.current.api.getSelectedNodes();
    selectedNodes.map((node) => ({
      row: node.rowIndex,
      col: node.data.udise_sch_code,
      field: clickedColumnName,
    }));
  };
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
    getDistrictsList("find", e.target.value);
  };

  const fetchReportData = (e) => {
    setDistrictID(e.target.value || 0);
  };

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

  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const handleGeneratePdf = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/annualreport`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          state_id: stateID,
          district_id: districtID,
          state_name:
            state_name?.length === 0 ? "--Select State--" : state_name[0].name,
          district_name:
            district_name?.length === 0
              ? "All District"
              : district_name[0].district_name,
          report_type: "Progress Report",
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`
          },
        }
      );
      setPdfbtnStatus(false);
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
      link.setAttribute(
        "download",
        `ProgressPreviousReport_${state_name[0]?.name === undefined
          ? "--Select State--"
          : state_name[0]?.name
        }_${district_name[0]?.district_name === undefined
          ? "All District"
          : district_name[0]?.district_name
        }_2024-2025_${datetime}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  return (
    <>
      <div className="row p-3">
        <div
          className="dashboard-main-content-info mb-2"
          id="search"
          style={{ backgroundColor: "#456fbd" }}
        >
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-select"
                name="state-list"
                value={stateID}
                onChange={updateDistrictsList}
              >
                <option value="0">--Select State--</option>
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
                onChange={fetchReportData}
                value={districtID}
              >
                <option value={0}>All District</option>
                {districtsList &&
                  districtsList?.length > 0 &&
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
      <div style={containerStyle}>
        <div className="test-container">
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              gridOptions={gridOptions}
              enableRangeSelection={true}
              suppressColumnSelectAll={true}
              autoGroupColumnDef={autoGroupColumnDef}
              rowSelection={"multiple"}
              suppressAggFuncInHeader={true}
              onCellClicked={handleCellClicked}
              excelStyles={excelStyles}
              groupRowRenderer={"agGroupCellRenderer"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressReportPrev;
