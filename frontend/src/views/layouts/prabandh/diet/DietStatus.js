import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { Column, Helper, Hook, Table, API, sweetAlert } from "../../../../apps";
import features from "../../../../redux/features";
import { Spinner } from "react-bootstrap";
import Btnloader from "../../../../apps/components/elements/Btnloader";
import exportToExcel from "../PrabandhReports/ExcelReports";
import NumberInput from "../../../../apps/components/form/NumberInput";
import { AgGridReact } from "ag-grid-react";

export default function DietStatus() {
  const user = Helper.auth.user;
  const [stateID, setStateID] = useState(user?.user_state_id || 0);
  const [dietList, setDietList] = useState([]);
  const gridRef = useRef();

  const getDietList = () => {
    API.post("api/prabandh/diet-status", { state_id: stateID }, (res) => {
      if (res.status) {
        setDietList(res.data);
      }
    });
  };

  useEffect(() => {
    getDietList();
  }, []);

  const onBtExport = useCallback(() => {
    const fileName = `DIET_Status_Report_` + Date.now().toString();
    const sheetName = 'Sheet 1'
    gridRef.current.api.exportDataAsExcel({
      processCellCallback: function (params) {
        if (params.column.colId === 'initiated') {
          const originalValue = params.value;
          return +originalValue === 1 ? "Yes" : "No"
        } else if (params.column.colId === 'recomended') {
          const originalValue = params.value;
          return +originalValue === 6 ? "Yes" : "No"
        } else {
          return params.value;
        }
      },
      fileName, sheetName
    });
  }, []);

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


  return (
    <div className="dashboard-main-content">
      <div className="row">
        <div className="dashboard-main-content__header d-flex justify-content-between col-md-10">
          <h1 className="mb-2">DIET - CoE - STATUS OF STATE / UT WISE PLAN UPLOADING</h1>
        </div>

        <div className="col-md-2 text-end mb-2">
          <button type="button" className="btn btn-success float-end" disabled={dietList && dietList.length > 0 ? false : true} onClick={onBtExport} >
            <i className="bi bi-file-earmark-excel"></i>{" "}
            <span className="mobile-hide">Export To</span> Excel
          </button>
        </div>
      </div>
      {/* <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
        <h1>DIET - CoE - STATUS OF STATE / UT WISE PLAN UPLOADING</h1> */}
      {/* <div>
                    <button
                        type="button"
                        className="btn btn-success float-end mx-2"
                        onClick={exportTableToExcel}
                        disabled={!alldata?.data?.length}
                        >
                        <i className="bi bi-file-earmark-excel"></i>{" "}
                        <span className="mobile-hide">Export To</span> Excel
                    </button>
                </div> */}
      {/* </div> */}
      <div className="dashboard-main-content-info mb-3">

        <div style={{ height: "70vh", width: "100%" }} className={"ag-theme-alpine AS"} >
          {/* state_name
diet_name
initiated
recomended */}
          <AgGridReact
            columnDefs={[
              {
                headerName: "S. No.",
                width: 92,
                valueGetter: (params) => {
                  return params.node.rowIndex + 1;
                },
                headerClass: "report_header",
              },
              {
                headerName: "Name of State/UT",
                field: "state_name",
                filter: "agMultiColumnFilter",
                headerClass: "report_header",
              },
              {
                headerName: "Name of DIET",
                field: "diet_name",
                filter: "agMultiColumnFilter",
                width: 150,
                headerClass: "report_header",
              },
              {
                headerName: "Plan Configure (Yes/No)",
                field: "initiated",
                filter: "agMultiColumnFilter",
                cellRenderer: function StatusRenderer(params) { return params.data.initiated === 1 ? "Yes" : "No" },
                headerClass: "report_header",
              },
              {
                headerName: "Plan Approved (Yes/No)",
                field: "recomended",
                filter: "agMultiColumnFilter",
                cellRenderer: function StatusRenderer(params) { return +params.data.recomended === 6 ? "Yes" : "No" },
                headerClass: "report_header",

              }]}
            ref={gridRef}
            rowData={dietList}
            onGridReady={(params) => {
              setTimeout(() => {
                params.api.sizeColumnsToFit();
              }, 300)
            }}
            animateRows={true}
            defaultColDef={{
              floatingFilter: true,
              sortable: true,
              resizable: true,
            }}
            rowSelection="multiple"
            checkboxSelection={true}
            suppressRowClickSelection={true}
            // overlayLoadingTemplate={gridRef.current?.api?.showNoRowsOverlay()}
            // overlayNoRowsTemplate={gridRef.current?.api?.showNoRowsOverlay()}
            pagination={true}
            excelStyles={excelStyles}
          // paginationPageSize={pagesize}
          // onFilterChanged={onRowResized}
          // noRowsOverlayComponent={noRowsOverlayComponent}
          />
        </div>

        {/* <div className="row ">
          <div class="col-xl-12 col-lg-12 col-sm-12 ">
            <div class="dataTables_wrapper p-0">
              <div
                class="table-scroll-section"
                style={{
                  height: "476px",
                  borderBottom: "1px solid rgb(210, 210, 210)",
                }}
              >
                <table class=" table-scroll">
                  <thead>
                    <tr>
                      <th style={{textAlign:"left"}}>S No.</th>
                      <th style={{textAlign:"left"}}>Name of State/UT</th>
                      <th style={{textAlign:"left"}}>Name of DIET</th>
                      <th style={{textAlign:"left"}}>
                        Plan Configure
                        <br />
                        (Yes/No)
                      </th>
                      <th style={{textAlign:"left"}}>
                        Plan Approved
                        <br />
                        (Yes/No)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dietList?.map((item, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.state_name}</td>
                          <td>
                            {item.diet_name} ({item.diet_code})
                          </td>
                          <td className="text-center">
                            {item.initiated === 1 ? "Yes" : "No"}
                          </td>
                          <td className="text-center">
                            {+item.recomended === 6 ? "Yes" : "No"}
                          </td>
                        </tr>
                      );
                    })}

                    {dietList?.length===0 && <tr><td className="text-center" colSpan={5}>No records found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}
