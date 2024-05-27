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
import { useNavigate } from "react-router-dom";

const SpilloverReport = () => {
  const user = Helper.auth.user;
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);

  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [stateID, setStateID] = useState(0);

  const containerStyle = useMemo(
    () => ({ height: 600, boxSizing: "border-box" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: 630, width: "100%", marginLeft: "0px", overflow: "auto" }), []);

  const onGridReady = (params) => { };
  const navigate = useNavigate();

  const state_name = stateList?.filter((c) => c.id === stateID);
  const [pagesize, setpagesize] = useState(10);
  const [columnDefs] = useState([
    {
      headerName: `Expenditure Reportr`,
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
              tooltipValueGetter: (params) => params.data.major_component_name
            },
            {
              headerName: "Sub Component",
              field: "sub_component_name",
              chartDataType: "series",
              headerClass: "report_header",
              tooltipValueGetter: (params) => params.data.sub_component_name
            },
            {
              headerName: "Activity Master",
              field: "activity_master_name",
              headerClass: "report_header",
              tooltipValueGetter: (params) => params.data.activity_master_name
            },
            {
              headerName: "Activity Detail",
              field: "activity_master_details_name",
              headerClass: "report_header",
              tooltipValueGetter: (params) => params.data.activity_master_details_name
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
        `api/reports/get-saved-data-spill`,
        {
          state_id: stateID,
          state: stateID,
          district: "0",
          scheme_id: "0",
          major_component_id: "0",
          sub_component_id: "0",
          activity_master_id: "0",
          activity_master_details_id: "0",
          inception_year: "2022-2023",
        },
        (res) => {
          if (res?.data?.length > 0) {
            setRowData(res.data);
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

  const onCellValueChanged = (params) => {
    API.post(`api/schools/update`, {}, (response) => {
      if (response.status) {
      }
    });
  };

  const gridOptions = {
    onCellValueChanged: onCellValueChanged,
    // domLayout: "autoWidth", alwaysShowHorizontalScroll: true,
    processHeaderCallback: (params) => {
      return {
        text: "params.column.getColDef().headerName", // use the column header name
        // styleId: "report_header", // apply the 'header' style defined above
      };
    },
  };
  const spillheader = [
    {
      headerName: ` ${state_name?.length}` !== 0
        ? ` Spillover Report( ${state_name && state_name[0]?.name})`
        : "Spillover Report ( All Satate )",
      headerClass: "main_header",
      children: [
        {
          headerName: "S. No.",
          field: "index",
          headerClass: "report_header",
          valueGetter: (params) => {
            return params.node.rowIndex + 1;
          },
          width: 50,
          tooltipValueGetter: (params) => params.data.activity_master_details_name
        },
        {
          headerName: "Scheme",
          field: "scheme_name",
          headerClass: "report_header",
          width: 200,
          cellStyle: (params) => {
            return { textAlign: "left" };
          },
          tooltipValueGetter: (params) => params.data.scheme_name
        },
        {
          headerName: "Major Component",
          field: "major_component_name",
          headerClass: "report_header",
          filter: "agMultiColumnFilter",
          width: 200,
          cellStyle: (params) => {
            return { textAlign: "left" };
          },
          tooltipValueGetter: (params) => params.data.major_component_name
        },
        {
          headerName: "Sub Component",
          field: "sub_component_name",
          headerClass: "report_header",
          width: 250,
          filter: "agMultiColumnFilter",
          cellStyle: (params) => {
            return { textAlign: "left" };
          },
          tooltipValueGetter: (params) => params.data.sub_component_name
        },
        {
          headerName: "Activity Master",
          headerClass: "report_header",
          field: "activity_master_name",
          filter: "agMultiColumnFilter",
          width: 250,
          cellStyle: (params) => {
            return { textAlign: "left" };
          },
          tooltipValueGetter: (params) => params.data.activity_master_name
        },
        {
          headerName: "Sub Activity",
          headerClass: "report_header",
          width: 250,
          field: "activity_master_details_name",
          filter: "agMultiColumnFilter",
          cellStyle: (params) => {
            return { textAlign: "left" };
          },
          tooltipValueGetter: (params) => params.data.activity_master_details_name
        },
        {
          headerName: "Fresh Approval 2023-2024",
          headerTooltip: "Fresh Approval 2023-2024",
          width: 250,
          headerClass: "report_header",
          children: [
            {
              headerName: "Physical",
              headerTooltip: "Physical",
              headerClass: "report_header",
              field: "fresh_approval_physical_quantity",
              type: "rightAligned",
              flex: 1,
              // valueParser: (params) => {
              //   const stringValue = params.newValue;
              //   return stringValue ? parseFloat(stringValue) : 0;
              // },
              // valueGetter: (params) => {
              //   return params.newValue == null
              //     ? 0
              //     : parseFloat(params.newValue);
              // },
              // cellDataType: "number",
              cellStyle: { textAlign: "right" },
            },
            {
              headerName: "Financial (In ₹ Lakh)",
              headerTooltip: "Fiancial (In ₹ Lakh)",
              field: "fresh_approval_financial_amount",
              type: "rightAligned",
              headerClass: "report_header",
              // valueGetter: (params) => {
              //   return params.newValue == null
              //     ? 0
              //     : parseFloat(params.newValue);
              // },
              // // valueParser: (params) => {
              // //   // Convert the string to a number
              // //   const stringValue = params.newValue;
              // //   return stringValue ? parseFloat(stringValue) : 0; // Use parseFloat or parseInt based on your requirement
              // // },
              // cellDataType: "number",
              width: 130,
              cellStyle: { textAlign: "right" },
            },
          ],
        },
        {
          headerName: "Expenditure Against Fresh Approval 2023-2024",
          headerTooltip: "Expenditure Against Fresh Approval 2023-2024",
          headerClass: "report_header",
          children: [
            {
              headerName: "Anticipated 31st March 2024",
              headerTooltip: "Anticipated 31st March 2024",
              headerClass: "report_header",
              children: [
                {
                  headerName: "Physical",
                  headerClass: "report_header",
                  children: [
                    {
                      headerName: "In Progress",
                      headerClass: "report_header",
                      field: "exp_against_fresh_app_phy_ip",
                      type: "rightAligned",
                      width: 130,
                      cellStyle: { textAlign: "right" },
                    },
                    {
                      headerName: "Not Started",
                      headerClass: "report_header",
                      field: "exp_against_fresh_app_phy_ns",
                      type: "rightAligned",
                      width: 130,
                    },
                    {
                      headerName: "Completed",
                      field: "exp_against_fresh_app_phy_c",
                      type: "rightAligned",
                      headerClass: "report_header",
                      width: 130,
                    },
                  ],
                },
                {
                  headerName: "Financial (In ₹ Lakh)",
                  headerClass: "report_header",
                  field: "exp_against_fresh_app_fin",
                  type: "rightAligned",
                  width: 130,
                },
              ],
            },
          ],
        },
        {
          headerName: "Cumulative Spillover Approved As Per Minutes 2023-2024",
          headerTooltip: "Cumulative Spillover Approved As Per Minutes 2023-2024",
          headerClass: "report_header",
          children: [
            {
              headerName: "Physical",
              field: "physical_quantity_cummu_inception",
              headerClass: "report_header",
              type: "rightAligned",
              width: 130,
            },
            {
              headerName: "Financial (In ₹ Lakh)",
              field: "financial_amount_cummu_inception",
              headerClass: "report_header",
              type: "rightAligned",
              width: 130,
            },
          ],
        },
        {
          headerName:
            "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          headerTooltip: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          headerClass: "report_header",
          children: [
            {
              headerName: "Anticipated 31st March 2024",
              headerClass: "report_header",
              children: [
                {
                  headerName: "Physical",
                  headerClass: "report_header",
                  children: [
                    {
                      headerName: "In Progress",
                      headerClass: "report_header",
                      field: "physical_quantity_progress_progress_inception",
                      type: "rightAligned",
                      width: 130,
                    },
                    {
                      headerName: "Not Started",
                      headerClass: "report_header",
                      field: "physical_quantity_progress_notstart_inception",
                      type: "rightAligned",
                      width: 130,
                    },
                    {
                      headerName: "Completed",
                      headerTooltip: "Completed",
                      headerClass: "report_header",
                      field: "physical_quantity_progress_complete_inception",
                      type: "rightAligned",
                      width: 130,
                    },
                  ],
                },
                {
                  headerName: "Financial (In ₹ Lakh)",
                  headerClass: "report_header",
                  field: "financial_amount_progress_inception",
                  type: "rightAligned",
                  width: 130,
                },
              ],
            },
          ],
        },
        {
          headerName: "Spillover Physical",
          field: "spillover_quantity",
          headerClass: "report_header",
          type: "rightAligned",
          width: 130,
        }, {
          headerName: "Spillover Amount",
          field: "spillover_amount",
          type: "rightAligned",
          headerClass: "report_header",
          width: 130,
        },
      ],
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      minWidth: 100,
      filter: true,
      floatingFilter: false,
      wrapHeaderText: false,
      sortable: true,
      resizable: true,
    };
  }, []);

  useEffect(() => {
    const allColumnIds = [];
    columnDefs.forEach((column) => {
      allColumnIds.push(column.field);
    });
  }, []);

  const onBtExport = useCallback(() => {
    const fileName = `Spillover Report (${state_name?.length > 0 ? state_name[0]?.name : ''})_` + Date.now().toString();
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

  /*   const getStateList = () => {
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
    });
  }; */

  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);
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
        numberFormat: {
          format: "0",
        },
        font: {
          color: "#000000",
          bold: false,
          size: 16,
        },
        interior: {
          color: "#ffffff",
          pattern: "None",
          patternColor: "#000000",
          textAlign: "right",
          alignment: {
            vertical: "center",
            horizontal: "right",
          },
        },
      },
    ];
  }, []);

  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const handleGeneratePdf = async () => {
    let thead = [
      [
        {
          name: "S.No.",
          rowSpan: 4,
        },
        {
          name: "Scheme",
          rowSpan: 4,
        },
        {
          name: "Major Component",
          rowSpan: 4,
        },
        {
          name: "Sub Component",
          rowSpan: 4,
        },
        {
          name: "Activity Master",
          rowSpan: 4,
        },
        {
          name: "Sub Activity",
          rowSpan: 4,
        },
        {
          name: "Fresh Approval 2023-2024",
          colSpan: 2,
        },
        {
          name: "Expenditure Against Fresh Approval 2023-2024",
          colSpan: 5,
        },
        {
          name: "Cumulative Spillover Approved As Per Minutes 2023-2024",
          colSpan: 2,
        },
        {
          name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          colSpan: 5,
        },
        {
          name: "Spillover Phsical",
          rowSpan: 4,
        },
        {
          name: "Spillover Amount",
          rowSpan: 4,
        },
      ],
      [
        {
          name: "Physical",
          rowSpan: 3,
        },
        {
          name: "Financial (In ₹ Lakh)",
          rowSpan: 3,
        },
        {
          name: "Anticipated 31st March 2024",
          colSpan: 5,
        },
        {
          name: "Physical",
          rowSpan: 3,
        },
        {
          name: "Financial (In ₹ Lakh)",
          rowSpan: 3,
        },
        {
          name: "Anticipated 31st March 2024",
          colSpan: 5,
        },
      ],
      [
        {
          name: "Physical",
          colSpan: 4,
        },
        {
          name: "Financial (In ₹ Lakh)",
          rowSpan: 2,
        },
        {
          name: "Physical",
          colSpan: 4,
        },
        {
          name: "Financial (In ₹ Lakh)",
          rowSpan: 2,
        },
      ],
      [
        {
          name: "In Progress",
        },
        {
          name: "Not Started",
        },
        {
          name: "Completed",
        },
        {
          name: "In Progress",
        },
        {
          name: "Not Started",
        },
        {
          name: "Completed",
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
            state: stateID,
            district: "0",
            scheme_id: "0",
            major_component_id: "0",
            sub_component_id: "0",
            activity_master_id: "0",
            activity_master_details_id: "0",
            inception_year: "2022-2023",
          },
          name: "spillover",
          heading: `Spillover Report ${state_name?.length === 0
            ? "( All Satate )"
            : `( ${state_name[0]?.name} )`
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
        link.setAttribute("download", `Spillover_2024-2025_${datetime}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const createData = () => {
    let sumData = {};
    if (spillheader?.length) {
      let dataFields = spillheader[0]["children"];
      dataFields?.forEach((item, index) => {
        if (index > 5) {
          sumData["fresh_approval_physical_quantity"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["fresh_approval_physical_quantity"] ? d["fresh_approval_physical_quantity"] : 0),
            0
          ,5)
          sumData["fresh_approval_financial_amount"] = Helper.accountFormat(
            rowData?.reduce(
              (accumulator, d) =>
                parseFloat(accumulator ? accumulator : 0) +
                parseFloat(d["fresh_approval_financial_amount"] ? d["fresh_approval_financial_amount"] : 0),
              0
            )
            ,5);
          sumData["exp_against_fresh_app_phy_ip"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["exp_against_fresh_app_phy_ip"] ? d["exp_against_fresh_app_phy_ip"] : 0),
            0
            ,5)
          sumData["exp_against_fresh_app_phy_ns"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["exp_against_fresh_app_phy_ns"] ? d["exp_against_fresh_app_phy_ns"] : 0),
            0
            ,5)
          sumData["exp_against_fresh_app_phy_c"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["exp_against_fresh_app_phy_c"] ? d["exp_against_fresh_app_phy_c"] : 0),
            0
            ,5)
          sumData["exp_against_fresh_app_fin"] = Helper.accountFormat(
            rowData?.reduce(
              (accumulator, d) =>
                parseFloat(accumulator ? accumulator : 0) +
                parseFloat(d["exp_against_fresh_app_fin"] ? d["exp_against_fresh_app_fin"] : 0),
              0
            )
            ,5);
          sumData["physical_quantity_cummu_inception"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["physical_quantity_cummu_inception"] ? d["physical_quantity_cummu_inception"] : 0),
            0
            ,5)
          sumData["financial_amount_cummu_inception"] = Helper.accountFormat(
            rowData?.reduce(
              (accumulator, d) =>
                parseFloat(accumulator ? accumulator : 0) +
                parseFloat(d["financial_amount_cummu_inception"] ? d["financial_amount_cummu_inception"] : 0),
              0
            )
            ,5);
          sumData["physical_quantity_progress_progress_inception"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["physical_quantity_progress_progress_inception"] ? d["physical_quantity_progress_progress_inception"] : 0),
            0
          )
          sumData["physical_quantity_progress_notstart_inception"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["physical_quantity_progress_notstart_inception"] ? d["physical_quantity_progress_notstart_inception"] : 0),
            0
            ,5)
          sumData["physical_quantity_progress_complete_inception"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["physical_quantity_progress_complete_inception"] ? d["physical_quantity_progress_complete_inception"] : 0),
            0
          )
          sumData["financial_amount_progress_inception"] = Helper.accountFormat(rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["financial_amount_progress_inception"] ? d["financial_amount_progress_inception"] : 0),
            0
          ), 5)

          sumData["spillover_quantity"] = rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["spillover_quantity"] ? d["spillover_quantity"] : 0),
            0
            ,5)
          sumData["spillover_amount"] = Helper.accountFormat(rowData?.reduce(
            (accumulator, d) =>
              parseFloat(accumulator ? accumulator : 0) +
              parseFloat(d["spillover_amount"] ? d["spillover_amount"] : 0),
            0
          ), 5)
        }
        else if (index === 0) {
          // sumData[item.field] = "Grand Total (₹ In Lakhs)";
        } else {
          sumData[item.field] = "";
        }
        if (index === 5) {
          sumData[item.field] = "Grand Total (₹ In Lakhs)";
        }
      });
      return [sumData];
    }
  };
  const pinnedBottomRowData = useMemo(() => {
    return createData();
  }, [rowData, columnDefs]);

  return (

    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-2">
        <h1 style={{ display: "inline-block" }} >Spillover Report</h1>
        <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate("/auth/prabandh/report")}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>
      </div>

      <div className="row p-2">
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

            <div className="col-md-3"></div>

            <div className="col-md-6 text-end">
              <button
                type="button"
                className="btn btn-success float-end"
                disabled={
                  rowData && rowData.length > 0
                    ? pdfbtnStatus
                      ? true
                      : false
                    : true
                }
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

      <div className="dashboard-main-content">
        <div className="row">
          <div style={containerStyle}>
            <div className="test-container">
              {rowData && rowData.length !== 0 ? (
                <div style={gridStyle} className="ag-theme-alpine">
                  <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    animateRows={true}
                    columnDefs={spillheader}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    gridOptions={gridOptions}
                    enableRangeSelection={true}
                    suppressColumnSelectAll={true}
                    autoGroupColumnDef={autoGroupColumnDef}
                    rowSelection={"single"}
                    suppressAggFuncInHeader={true}
                    excelStyles={excelStyles}
                    pagination={true}
                    paginationPageSize={pagesize ? pagesize : 10}
                    paginationPageSizeSelector={[pagesize ? pagesize : 10, 20, 50, 100]}
                    paginationAutoPageSize={false}
                    viewportRowModelPageSize={1}
                    pinnedBottomRowData={pinnedBottomRowData}
                    groupRowRenderer={"agGroupCellRenderer"}
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
                      onClick={(e) => setpagesize(e.target.value)}
                    >
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value={rowData ? rowData.length : null}>
                        All
                      </option>
                    </select>
                  </div>
                </div>
              ) : (
                <h3 style={{ textAlign: "center" }}>No Data Found</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpilloverReport;
