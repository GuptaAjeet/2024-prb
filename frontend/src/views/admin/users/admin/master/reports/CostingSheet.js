// import React, {
//   useCallback,
//   useMemo,
//   useRef,
//   useState,
//   useEffect,
// } from "react";
// import { createRoot } from "react-dom/client";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { API, Helper, Hook } from "../../../../../../apps";
// import "./ReportStyle.css";
// import { useDispatch } from "react-redux";
// import features from "../../../../../../redux/features";
// import api from "../../../../../../apps/utilities/api";
// import Report from "./Report";
// import { useLocation } from "react-router-dom";

// import "./ReportStyle.css";
// import axios from "axios";
// import { REACT_APP_URL } from "../../../../../../env";
// import Btnloader from "../../../../../../apps/components/elements/Btnloader";

// const CostingSheet = () => {
//   const user = Helper.auth.user;
//   const gridRef = useRef();
//   const containerStyle = useMemo(
//     () => ({ height: 600, boxSizing: "border-box" }),
//     []
//   );
//   const gridStyle = useMemo(
//     () => ({ height: 600, width: "100%", marginLeft: "10px" }),
//     []
//   );
//   const [rowData, setRowData] = useState();
//   const [editedData, setEditedData] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [districtsList, setDistrictsList] = useState([]);
//   const [stateID, setStateID] = useState(0);
//   const [districtID, setDistrictID] = useState(0);
//   const [reportData, setReportData] = useState([]);
//   const dispatch = useDispatch();
//   const location = useLocation();
//   // const objects = Hook.usePost({
//   //     url: "api/schools/schoolmaster"
//   // });
//   const onGridReady = (params) => {
//     // API.post(
//     //     `api/schools/schoolmaster`,
//     //     {},
//     //     (response) => {
//     //         if (response.status) {
//     //             setRowData(response?.data);
//     //         }
//     //     })
//   };
//   const calculateRowSpan = (params) => {
//     const currentValue = params.value;
//     const previousRowData = params.api.getDisplayedRowAtIndex(
//       params.rowIndex - 1
//     )?.data;
//     const previousValue = previousRowData ? previousRowData.columnB : null;
//     //console.log(currentValue, previousValue, params.api.getDisplayedRowAtIndex(params.rowIndex - 1))
//     return currentValue === previousValue ? "0" : "0";
//     // Logic to calculate rowSpan based on the content of the cell
//     // const currentValue = params.value;
//     // const previousValue = params.previousRow ? params.previousRow.data.columnB : null;
//     // console.log(params.data.activity_master_name, params, currentValue)
//     // return currentValue == previousValue ? 0 : 1; // Set rowSpan to 0 for cells with the same value
//   };
//   const state_name = stateList?.filter((c) => c.id == stateID);
//   const district_name = districtsList?.filter((c) => c.id == districtID);
//   const [columnDefs, setColumnDefs] = useState([
//     {
//       headerName: `Costing Sheet Report `,
//       headerClass: "main_header",
//       children: [
//         {
//           headerName: "Particular",
//           headerClass: "subheader",
//           children: [
//             {
//               headerName: "Scheme",
//               field: "scheme_name",
//               headerClass: "report_header",
//               // rowGroup: true, hide: false
//             },
//             {
//               headerName: "Major Component",
//               field: "major_component_name",
//               chartDataType: "category",
//               headerClass: "report_header",
//               // rowGroup: true, hide: false
//             },
//             {
//               headerName: "Sub Component",
//               field: "sub_component_name",
//               headerClass: "report_header",
//               chartDataType: "series",
//               headerClass: "report_header",
//             },
//             {
//               headerName: "Activity Master",
//               field: "activity_master_name",
//               headerClass: "report_header",
//               headerClass: "report_header",
//               // colSpan: (params) => {
//               //     const school_id = params.data.activity_master_name;
//               //     if (school_id === 'Opening of New Schools  - NR (Elementary)') {
//               //         return 3;
//               //     } else if (school_id === 'United States') {
//               //         return 1;
//               //     } else {
//               //         return 1;
//               //     }
//               // },
//             },
//             {
//               headerName: "Activity Detail",
//               field: "activity_master_details_name",
//               headerClass: "report_header",
//             },
//           ],
//         },
//         {
//           headerName: "Proposal",
//           headerClass: "subheader",
//           children: [
//             {
//               headerName: "Physical",
//               field: "physical_quantity",
//               headerClass: "report_header",
//             },
//             {
//               headerName: "Unit Cost",
//               field: "udise_sch_code",
//               headerClass: "report_header",
//               headerClass: "report_header",
//             },
//             {
//               headerName: "Financial",
//               field: "financial_amount",
//               headerClass: "report_header",
//               headerClass: "report_header",
//             },
//           ],
//         },
//       ],
//     },
//   ]);
//   // useEffect(() => {
//   //     setColumnDefs([{
//   //         headerName: `Costing Sheet Report ${state_name.length === 0 ? "( All State" : `( ${state_name[0]?.name}`} & ${district_name.length === 0 ? "All District" : district_name[0]?.district_name} )`, headerClass: 'main_header',
//   //         children: [
//   //             {
//   //                 headerName: 'Particular', headerClass: 'subheader',
//   //                 children: [{
//   //                     headerName: 'Scheme', field: 'scheme_name', headerClass: 'header',
//   //                 },
//   //                 {
//   //                     headerName: 'Major Component', field: 'major_component_name', chartDataType: 'category', headerClass: 'header', cellDataType: 'number',
//   //                 },
//   //                 { headerName: 'Sub Component', field: 'sub_component_name', headerClass: 'header', chartDataType: 'series', headerClass: 'header', },
//   //                 {
//   //                     headerName: 'Activity Master', field: 'activity_master_name', headerClass: 'header', headerClass: 'header',
//   //                 },
//   //                 { headerName: 'Activity Detail', field: 'activity_master_details_name', headerClass: 'header' },
//   //                 ]
//   //             }, {
//   //                 headerName: "Proposal", headerClass: 'subheader',
//   //                 children: [
//   //                     { headerName: 'Physical', field: 'recuring_nonrecuring', headerClass: 'header', },
//   //                     { headerName: 'Unit Cost', field: 'udise_sch_code', headerClass: 'header', headerClass: 'header', },
//   //                     { headerName: 'Financial', field: 'financial_amount', headerClass: 'header', headerClass: 'header', },
//   //                 ]
//   //             },
//   //         ]
//   //     }
//   //     ])
//   // }, [state_name, district_name])
//   const handleFetchData = () => {
//     API.post(
//       `api/schools/getreportdt`,
//       { state_id: Number(stateID), district_id: Number(districtID) },
//       (response) => {
//         if (response.status) {
//           setRowData(response?.data);
//         }
//       }
//     );
//   };
//   useEffect(() => {
//     handleFetchData();
//   }, [stateID, districtID]);
//   const onCellValueChanged = (params) => {
//     // Access edited values in params
//     // const oldValue = params.oldValue;
//     const newValue = params.newValue;
//     const column = params.column.colId;
//     const row = params.node.data;
//     API.post(`api/schools/update`, {}, (response) => {
//       if (response.status) {
//         //console.log(response);
//         // dispatch(
//         //     features.makeHandler({
//         //         reload: new Date().getTime(),
//         //         where: Helper.whereMasterObjSelector(),
//         //     })
//         // )
//         // dispatch(features.showToast({ message: response.message }));
//         // onGridReady()
//       }
//       //console.log(response);
//     });
//     // setEditedData(prev => [...prev, row]);
//   };
//   const gridOptions = {
//     onCellValueChanged: onCellValueChanged,
//     excelStyles: [
//       {
//         id: "report_header",
//         font: {
//           bold: true,
//         },
//       },
//     ],
//     domLayout: "autoWidth",
//     processHeaderCallback: (params) => {
//       return {
//         text: "params.column.getColDef().headerName", // use the column header name
//         styleId: "report_header", // apply the 'header' style defined above
//       };
//     },
//     // header: ExcelHeaderFooterContent[];

//     // interface ExcelHeaderFooterContent {
//     //     // The value of the text to be included in the header.
//     //     value: "string";
//     //     // Configures where the text should be added: `Left`, `Center` or `Right`.
//     //     // Default: `Left`
//     //     position?: 'Left' | 'Center' | 'Right';
//     //     // The font style of the header/footer value.
//     //     font?: ExcelFont;
//   };
//   const defaultColDef = useMemo(() => {
//     return {
//       flex: 2,
//       editable: false,
//       sortable: true,
//       resizable: true,
//       minWidth: 130,
//       filter: true,
//       enableRowGroup: true,
//       enablePivot: true,
//       enableValue: true,
//       floatingFilter: true,
//       // cellStyle: () => ({
//       //     // display: "flex",
//       //     alignItems: "center",
//       //     justifyContent: "left"
//       // })
//       // cellClassRules: {
//       //     darkGreyBackground: (params) => {
//       //         return (params.node.rowIndex || 0) % 2 == 0;
//       //     },
//       // },
//     };
//   }, []);
//   useEffect(() => {
//     const allColumnIds = [];
//     columnDefs.forEach((column) => {
//       allColumnIds.push(column.field);
//     });
//   }, []);
//   // const getParams = () => ({
//   //     // prependContent: getBoolean('#prependContent') ? getRows() : undefined,
//   //     // appendContent: getBoolean('#appendContent') ? getRows() : undefined,
//   //     prependContent: true ? getRows() : undefined,
//   //     appendContent: true ? getRows() : undefined,
//   // });
//   // const getRows = () => [
//   //     {
//   //         cells: [{
//   //             data: {
//   //                 value: 'School Report Excel',
//   //                 type: 'String',
//   //             },
//   //             number: 11,
//   //             cellStyle: () => ({
//   //                 display: "flex",
//   //                 alignItems: "center",
//   //                 justifyContent: "center"
//   //             }),
//   //             mergeAcross: 5, id: 'darkGreyBackground',
//   //         }]
//   //     },
//   //     {
//   //         cells: [
//   //             {
//   //                 data: {
//   //                     id: 'darkGreyBackground',
//   //                     value: 'Here is first header.',
//   //                     type: 'String',
//   //                 }, headerClass: 'header',
//   //                 color: 'red'
//   //             },
//   //         ],
//   //     },
//   //     {
//   //         cells: [
//   //             {
//   //                 data: {
//   //                     value:
//   //                         'They are visible when the downloaded file is opened in Excel because custom content is properly escaped.',
//   //                     type: 'String',
//   //                 },
//   //                 id: 'darkGreyBackground',
//   //                 size: 7,
//   //             },
//   //         ],
//   //     },
//   //     {
//   //         cells: [
//   //             { data: { value: 'this cell:', type: 'String', }, backgourd: 'green', mergeAcross: 1 },
//   //             {
//   //                 data: {
//   //                     value: 'is empty because the first cell has mergeAcross=1',
//   //                     type: 'String',
//   //                 },
//   //                 backgourdColor: 'red'
//   //             },
//   //         ],
//   //     },
//   //     { cells: [] },
//   // ];
//   const onBtExport = useCallback(() => {
//     gridRef.current.api.exportDataAsExcel();
//   }, []);
//   const autoGroupColumnDef = useMemo(() => {
//     return {
//       // headerCheckboxSelection: true,
//       field: "athlete",
//       // flex: 1,
//       // minWidth: 40,
//       cellRendererParams: {
//         checkbox: true,
//       },
//     };
//   }, []);

//   const handleCellClicked = (params) => {
//     const clickedColumnName = params.column.colDef.field;
//     // setClickedColumnName(clickedColumnName);
//     params.node.setSelected(!params.node.isSelected());

//     const selectedNodes = gridRef.current.api.getSelectedNodes();
//     const selectedCells = selectedNodes.map((node) => ({
//       row: node.rowIndex,
//       col: node.data.udise_sch_code,
//       field: clickedColumnName,
//     }));
//     //console.log("handleCellClicked called", params.column.colDef);
//     // setSelectedCells(selectedCells);
//   };
//   const getStateList = () => {
//     api.get("api/states/list", null, (res) => {
//       setStateList(res.data);
//     });
//   };

//   const getDistrictsList = (method, state_id = 0) => {
//     const endpoint = state_id === 0 ? "list" : "find";
//     const data = state_id === 0 ? null : { district_state_id: state_id };

//     api[method === "list" ? "get" : "post"](
//       `api/districts/${endpoint}`,
//       data,
//       (res) => {
//         setDistrictsList(res.data);
//       }
//     );
//   };
//   useEffect(() => {
//     // calculateRowSpan();
//     setStateID(user.user_state_id || 0);
//     setDistrictID(user.user_district_id || 0);
//     getStateList();
//     getDistrictsList("find", user?.user_state_id || 0);
//   }, [reportData]);
//   const updateDistrictsList = (e) => {
//     setStateID(e.target.value || 0);
//     getDistrictsList("find", e.target.value);
//   };

//   const fetchReportData = (e) => {
//     // if(e.target.value)
//     setDistrictID(e.target.value || 0);
//   };
//   const suppressRowTransform = true;

//   const excelStyles = useMemo(() => {
//     return [
//       {
//         id: "cell",
//         alignment: {
//           vertical: "Center",
//           horizontal: "Left",
//         },
//         // interior: {
//         //     color: '#64e359',
//         //     pattern: 'Solid',
//         //     patternColor: undefined,
//         //     // width
//         // },
//         borders: {
//           borderBottom: {
//             color: "#ffab00",
//             lineStyle: "Continuous",
//             weight: 6,
//           },
//         },
//         font: {
//           // color: '#ffffff',
//           // bold: true,
//           size: 10,
//           // weight: 1,
//         },
//       },
//       {
//         id: "main_header",
//         alignment: {
//           vertical: "Center",
//           horizontal: "Center",
//         },
//         interior: {
//           color: "#64e359",
//           pattern: "Solid",
//           patternColor: undefined,
//           // width
//         },
//         borders: {
//           borderBottom: {
//             color: "#ffab00",
//             lineStyle: "Continuous",
//             weight: 6,
//           },
//         },
//         font: {
//           color: "#ffffff",
//           // bold: true,
//           size: 28,
//           weight: 6,
//         },
//       },
//       {
//         id: "subheader",
//         alignment: {
//           vertical: "Center",
//           horizontal: "Center",
//         },
//         interior: {
//           color: "#8edfe8",
//           pattern: "None",
//           patternColor: "#000000",
//           width: 500,
//         },
//         font: {
//           color: "#0059ff",
//           size: 20,
//         },
//       },
//       {
//         id: "report_header",
//         alignment: {
//           vertical: "Center",
//           horizontal: "Center",
//         },
//         font: {
//           color: "#000000",
//           bold: true,
//           size: 16,
//         },
//         interior: {
//           color: "#ffffff",
//           pattern: "None",
//           patternColor: "#000000",
//         },
//       },
//     ];
//   }, []);
//   /*   console.log(
//     districtID,
//     districtsList,
//     district_name?.length === 0 ? "All District" : district_name.district_name
//   ); */
//   const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
//   const handleGeneratePdf = async () => {
//     const pdfUrl = `${REACT_APP_URL}api/download/pdf/annualreport`;
//     try {
//       setPdfbtnStatus(true);
//       const response = await axios.post(
//         pdfUrl,
//         {
//           state_id: stateID,
//           district_id: districtID,
//           state_name:
//             state_name.length === 0 ? "All State" : state_name[0].name,
//           district_name:
//             district_name?.length === 0
//               ? "All District"
//               : district_name[0].district_name,
//           report_type: "Costing Report",
//         },
//         {
//           responseType: "arraybuffer",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/pdf",
//           },
//         }
//       );
//       setPdfbtnStatus(false);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       var currentdate = new Date();
//       var datetime =
//         currentdate.getDate() +
//         "/" +
//         (currentdate.getMonth() + 1) +
//         "/" +
//         currentdate.getFullYear() +
//         "_" +
//         currentdate.getHours() +
//         ":" +
//         currentdate.getMinutes() +
//         ":" +
//         currentdate.getSeconds();
//       link.setAttribute("download", `CostingsheetReport_${state_name[0]?.name === undefined ? "All State" : state_name[0]?.name}_${district_name[0]?.district_name === undefined ? "All District" : district_name[0]?.district_name}_2024-2025_${datetime}.pdf`); //or any other extension
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error("Error:", error.message);
//     }
//   };
//   return (
//     <>
//       <div className="row p-3">
//         <div
//           className="dashboard-main-content-info mb-2"
//           id="search"
//           style={{ backgroundColor: "#456fbd" }}
//         >
//           <div className="row">
//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 name="state-list"
//                 value={stateID}
//                 // disabled={user.user_role_id >= 4 ? true : false}
//                 onChange={updateDistrictsList}
//               >
//                 <option value="0">All State</option>
//                 {stateList &&
//                   stateList.length > 0 &&
//                   stateList.map((st, stidx) => {
//                     return (
//                       <option key={`st_${stidx}`} value={st.id}>
//                         {st.name}
//                       </option>
//                     );
//                   })}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 name="districts-list"
//                 // disabled={user.user_role_id >= 8 ? true : false}
//                 onChange={fetchReportData}
//                 value={districtID}
//               >
//                 <option value={0}>All District</option>
//                 {districtsList &&
//                   districtsList.length > 0 &&
//                   districtsList.map((ds, dsidx) => {
//                     return (
//                       <option key={`ds_${dsidx}`} value={ds.id}>
//                         {ds.district_name}
//                       </option>
//                     );
//                   })}
//               </select>
//             </div>

//             <div className="col-md-6 text-end">
//               <button
//                 type="button"
//                 className="btn btn-success float-end"
//                 onClick={onBtExport}
//               >
//                 <i className="bi bi-file-earmark-excel"></i> <span className="mobile-hide">Export To</span> Excel
//               </button>
//               <button
//                 type="button"
//                 style={{ marginRight: "1rem" }}
//                 className="btn btn-danger float-end"
//                 disabled={
//                   rowData && rowData.length > 0
//                     ? pdfbtnStatus
//                       ? true
//                       : false
//                     : true
//                 }
//                 onClick={handleGeneratePdf}
//               >
//                 {pdfbtnStatus ? <Btnloader /> : ""}{" "}
//                 <i className="bi bi-file-earmark-pdf"></i> <span className="mobile-hide">Export To</span> PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div style={containerStyle}>
//         <div className="test-container">
//           <div style={gridStyle} className="ag-theme-alpine">
//             <AgGridReact
//               suppressColumnVirtualisation={true}
//               suppressRowVirtualisation={true}
//               ref={gridRef}
//               rowData={rowData}
//               columnDefs={columnDefs}
//               defaultColDef={defaultColDef}
//               onGridReady={onGridReady}
//               gridOptions={gridOptions}
//               enableRangeSelection={true}
//               // enableCharts={true}
//               suppressColumnSelectAll={true}
//               autoGroupColumnDef={autoGroupColumnDef}
//               rowSelection={"multiple"}
//               suppressAggFuncInHeader={true}
//               onCellClicked={handleCellClicked}
//               excelStyles={excelStyles}
//               // suppressRowTransform={suppressRowTransform}
//               // groupDisplayType={'groupRows'}
//               groupRowRenderer={"agGroupCellRenderer"}
//             />
//           </div>
//         </div>
//       </div>
//       {/* <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <Report /> */}
//     </>
//   );
// };

// export default CostingSheet;

import { useState, useEffect, Fragment, useRef, useMemo } from "react";
// import api from "../../../apps/utilities/api";
import { useSelector } from "react-redux";
import "../../../../../layouts/prabandh/spill.css";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import amountValidationFilter from "../../../../../../apps/utilities/amountValidationFilter";
import quantityValidationFilter from "../../../../../../apps/utilities/quantityValidationFilter";
import CustomPinnedRowRenderer from "../../../../../../apps/utilities/customPinnedRow";
import Btnloader from "../../../../../../apps/components/elements/Btnloader";
import sweetAlert from "../../../../../../apps/utilities/sweetalert";
import ConfirmationDialog from "../../../../../../apps/components/form/ConfirmationDialog";
import Spinner from "../../../../../../apps/components/elements/Spinner";
import { REACT_APP_URL } from "../../../../../../env";
import api from "../../../../../../apps/utilities/api";
import { Helper, Hook, Settings } from "../../../../../../apps";

const CostingSheet = () => {
  const menu = useSelector((state) => state.menu);
  const user = Helper.auth.user;
  const [filter, setFilter] = useState({
    state: "0",
    district: "0",
    scheme_id: "0",
    major_component_id: "0",
    sub_component_id: "0",
    activity_master_id: "0",
    activity_master_details_id: "0",
    inception_year: "2022-2023",
  });

  const years = Hook.usePost({
    url: "api/prabandh/years",
  });

  const createData = () => {
    var result = [];
    let sumData = {};

    let dataFields = [
      {
        name: "S.No.",
        key: "key",
      },
      {
        name: "Scheme",
        key: "scheme_name",
      },
      {
        name: "Major Component",
        key: "major_component_name",
      },
      {
        name: "Sub Component",
        key: "sub_component_name",
      },
      {
        name: "Activity Master",
        key: "activity_master_name",
      },
      {
        name: "Sub Activity",
        key: "activity_master_details_name",
      },
      {
        name: "Physical",
        key: "fresh_approval_physical_quantity",
      },
      {
        name: "Financial (In ₹ Lakh)",
        key: "fresh_approval_financial_amount",
      },
      {
        name: "In Progress",
        key: "exp_against_fresh_app_phy_ip",
      },
      {
        name: "Not Started",
        key: "exp_against_fresh_app_phy_ns",
      },
      {
        name: "Completed",
        key: "exp_against_fresh_app_phy_c",
      },
      {
        name: "Total",
        key: "fresh_total",
      },
      {
        name: "Financial (In ₹ Lakh)",
        key: "exp_against_fresh_app_fin",
      },
      {
        name: "Physical",
        key: "physical_quantity_cummu_inception",
      },
      {
        name: "Financial (In ₹ Lakh)",
        key: "financial_amount_cummu_inception",
      },
      {
        name: "In Progress",
        key: "physical_quantity_progress_progress_inception",
      },
      {
        name: "Not Started",
        key: "physical_quantity_progress_notstart_inception",
      },
      {
        name: "Completed",
        key: "physical_quantity_progress_complete_inception",
      },
      {
        name: "Total",
        key: "exp_total",
      },
      {
        name: "Financial (In ₹ Lakh)",
        key: "financial_amount_progress_inception",
      },
    ];

    dataFields.forEach((item, index) => {
      if (
        Settings.isDataNotExistsInArray(
          [
            "key",
            "scheme_name",
            "major_component_name",
            "sub_component_name",
            "activity_master_name",
            "activity_master_details_name",
          ],
          item.key
        )
      ) {
        sumData[item.key] = 0;
        if (rowList != undefined && rowList.length > 0) {
          rowList.forEach((itm, idx) => {
            if (parseFloat(itm[item.key]) > 0) {
              sumData[item.key] += parseFloat(itm[item.key]);
            }
          });
        }
      }

      if (item.key == "activity_master_details_name") {
        sumData[item.key] = "Grand Total";
      }
    });
    result.push(sumData);

    return result;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [confrmData, setConfrmData] = useState({});
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const [schemesList, setSchemesList] = useState([]);
  const [userPer, setUserPer] = useState([]);
  //const [stateList, setStateList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [rowList, setRowList] = useState([]);
  const [spin, setSpin] = useState(false);
  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();
  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const pinnedBottomRowData = useMemo(() => {
    return createData();
  }, [rowList]);

  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        state: user?.user_state_id,
        district: user?.user_district_id,
      };
    });

    //getStateList();
    getSchemesList();
    let st = 0;
    let dt = 0;
    if (Settings.isDistrictUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      getDistrictsList("find", +st);
    } else if (user?.user_state_id) {
      getDistrictsList("find", user?.user_state_id);
    }
    setSpin(true);
    getUserPer();
  }, [user]);

  useEffect(() => {
    if (parseInt(filter.state) != 0) {
      getSavedData();
    }
  }, [filter]);

  useEffect(() => {
    const filters = JSON.parse(localStorage.getItem("filter"));
    filters && setFilter(filters);
  }, []);

  const getSavedData = () => {
    if (filter.state && user.id) {
      let oldFilter = filter;
      oldFilter.district = !!filter.district ? filter.district : "0";
      oldFilter.state_id = user.user_state_id;
      api.post(
        `api/prabandh/get-saved-data-spill`,
        {
          ...oldFilter,
        },
        (res) => {
          if (res.data.length) {
            let parsedData = JSON.parse(
              JSON.stringify(res.data),
              (key, value) => {
                if (!isNaN(value)) {
                  return Number(value);
                }
                return value;
              }
            );
            setRowList([...parsedData]);
            setSpin(false);
          }
        }
      );
    }
  };

  const getUserPer = () => {
    api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  const getSchemesList = () => {
    setSpin(true);
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
      setSpin(false);
    });
  };

  /*   const getStateList = () => {
    setSpin(true);
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    setSpin(true);
    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        setDistrictsList(res.data);
        setSpin(false);
      }
    );
  };

  return (
    <div className="dashboard-main-content">
      <div
        className="dashboard-main-content-info"
        style={{ textAlign: "center", minHeight: "700px" }}
      >
        {rowList?.length > 0 && (
          <Fragment>
            <div style={gridStyle} className={"ag-theme-alpine AS"}>
              <AgGridReact
                ref={gridRef}
                columnDefs={[
                  {
                    headerName: `Expenditure Report `,
                    headerClass: "main_header",
                    children: [
                      {
                        headerName: "S. No.",
                        field: "index",
                        headerClass: "report_header",
                        // rowGroup: true, hide: false
                      },
                      {
                        headerName: "Scheme",
                        field: "scheme_name",
                        headerClass: "report_header",
                        // rowGroup: true, hide: false
                      },
                      {
                        headerName: "Major Component",
                        field: "major_component_name",
                        chartDataType: "category",
                        headerClass: "report_header",
                        // rowGroup: true, hide: false
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
                        headerName: "Sub Activity ",
                        field: "sub_component_name",
                        headerClass: "report_header",
                      },
                      {
                        headerName: "Budget Approved",
                        field: "activity_master_details_name",
                        headerClass: "report_header",
                        children: [
                          {
                            headerName: "Physical",
                            field: "physical_quantity",
                            headerClass: "report_header",
                            valueGetter: (params) => {
                              return params.data[
                                "fresh_approval_physical_quantity"
                              ] == null
                                ? 0
                                : params.data[
                                    "fresh_approval_physical_quantity"
                                  ];
                            },
                            // rowGroup: true, hide: false
                          },
                          {
                            headerName: "Physical",
                            field: "fresh_approval_financial_amount",
                            headerClass: "report_header",
                            valueGetter: (params) => {
                              return params.data[
                                "fresh_approval_financial_amount"
                              ] == null
                                ? 0
                                : params.data[
                                    "fresh_approval_financial_amount"
                                  ];
                            },
                            // rowGroup: true, hide: false
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
                            field: "physical_quantity",
                            headerClass: "report_header",
                            valueGetter: (params) => {
                              return params.data[
                                "physical_quantity_progress_notstart_inception"
                              ] == null
                                ? 0
                                : params.data[
                                    "physical_quantity_progress_notstart_inception"
                                  ];
                            },
                            // rowGroup: true, hide: false
                          },
                          {
                            headerName: "Physical",
                            field: "financial_amount_progress_inception",
                            headerClass: "report_header",
                            valueGetter: (params) => {
                              return params.data[
                                "financial_amount_progress_inception"
                              ] == null
                                ? 0
                                : params.data[
                                    "financial_amount_progress_inception"
                                  ];
                            },
                            // rowGroup: true, hide: false
                          },
                        ],
                      },
                    ],
                  },
                ]}
                rowData={rowList}
                animateRows={true}
                defaultColDef={defaultColDef}
                checkboxSelection={true}
                suppressRowClickSelection={true}
                rowSelection={"single"}
                // onSelectionChanged={handleSelectionChanged}
                // loadingOverlayComponent={loadingOverlayComponent}
                pagination={false}
                // paginationPageSize={10}
                paginationAutoPageSize={false}
                pinnedBottomRowData={pinnedBottomRowData}
              />
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default CostingSheet;
