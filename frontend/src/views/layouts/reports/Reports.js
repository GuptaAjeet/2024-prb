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

const Reports = () => {
  const user = Helper.auth.user;
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ height: 600, boxSizing: "border-box" }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: "100%", marginLeft: "10px" }), []);
  const [rowData, setRowData] = useState();
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [stateID, setStateID] = useState(0);
  const [,districtID, setDistrictID] = useState(0);
  const [,reportData] = useState([]);

  const onGridReady = (params) => {};

  const [columnDefs] = useState([
    {
      headerName: "Repot List 2023-24",
      children: [
        {
          headerName: "Particular",
          children: [
            {
              headerName: "Scheme",
              field: "scheme_name",
              headerClass: "Udise-header",
            },
            {
              headerName: "Major Component",
              field: "major_component_name",
              headerClass: "Udise-header",
              chartDataType: "category",
              type: "number",
              rowSpan: (params) => params.data.major_component_name === "Access & Retention" ? 3 : 3,
            },
            {
              headerName: "Sub Component",
              field: "sub_component_name",
              headerClass: "Udise-header",
              chartDataType: "series",
            },
            {
              headerName: "Activity Master",
              field: "activity_master_name",
              headerClass: "Udise-header",
            },
            {
              headerName: "Activity Detail",
              field: "activity_master_details_name",
              headerClass: "Udise-header",
            },
          ],
        },
        {
          headerName: "Proposal",
          children: [
            {
              headerName: "Physical",
              field: "physical_quantity",
              headerClass: "Udise-header",
            },
            {
              headerName: "Unit Cost",
              field: "udise_sch_code",
              headerClass: "Udise-header",
            },
            {
              headerName: "Financial",
              field: "financial_amount",
              headerClass: "Udise-header",
            },
          ],
        },
        {
          headerName: "Final Approved Outlay",
          children: [
            {
              headerName: "Physical",
              field: "financial_amount",
              headerClass: "Udise-header",
              chartDataType: "category",
              type: "number",
            },
            {
              headerName: "Unit Cost",
              field: "financial_amount",
              headerClass: "Udise-header",
              chartDataType: "series",
            },
            {
              headerName: "Financial",
              field: "financial_amount",
              headerClass: "Udise-header",
            },
            {
              headerName: "Remark",
              field: "financial_amount",
              headerClass: "Udise-header",
            },
          ],
        },
      ],
    },
  ]);
  const handleFetchData = () => {
    API.post(`api/schools/getreportdt`, {}, (response) => {
      if (response.status) {
        setRowData(response?.data);
      }
    });
  };
  useEffect(() => {
    handleFetchData();
  }, [districtID]);

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
      editable: true,
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
  const getParams = () => ({
    prependContent: true ? getRows() : undefined,
    appendContent: true ? getRows() : undefined,
  });
  const getRows = () => [
    {
      cells: [
        {
          data: {
            value: "School Report Excel",
            type: "String",
          },
          number: 11,
          cellStyle: () => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }),
          mergeAcross: 5,
          id: "darkGreyBackground",
        },
      ],
    },
    {
      cells: [
        {
          data: {
            id: "darkGreyBackground",
            value: "Here is first header.",
            type: "String",
          },
          headerClass: "Udise-header",
          color: "red",
        },
      ],
    },
    {
      cells: [
        {
          data: {
            value:
              "They are visible when the downloaded file is opened in Excel because custom content is properly escaped.",
            type: "String",
          },
          id: "darkGreyBackground",
          size: 7,
        },
      ],
    },
    {
      cells: [
        {
          data: { value: "this cell:", type: "String" },
          backgourd: "green",
          mergeAcross: 1,
        },
        {
          data: {
            value: "is empty because the first cell has mergeAcross=1",
            type: "String",
          },
          backgourdColor: "red",
        },
      ],
    },
    { cells: [] },
  ];
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel(getParams());
  }, [getParams]);
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
    const selectedCells = selectedNodes.map((node) => ({
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
  const suppressRowTransform = true;
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
                onClick={onBtExport}
              >
                <i className="bi bi-file-earmark-excel"></i>{" "}
                <span className="mobile-hide">Export To</span> Excel
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
              enableCharts={true}
              suppressColumnSelectAll={"true"}
              autoGroupColumnDef={autoGroupColumnDef}
              rowSelection={"multiple"}
              suppressAggFuncInHeader={true}
              onCellClicked={handleCellClicked}
              suppressRowTransform={suppressRowTransform}
              groupDisplayType={"groupRows"}
              groupRowRenderer={"agGroupCellRenderer"}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
