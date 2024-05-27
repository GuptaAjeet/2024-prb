import React, { useCallback, useMemo, useRef, useState, useEffect} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { API, Hook } from "../../../apps";
import "./ReportStyle.css";
import { useDispatch } from "react-redux";
import features from "../../../redux/features";

const ReportMain = () => {
  const gridRef = useRef();
  const [, setRowData] = useState();
  const containerStyle = useMemo(() => ({ height: 600, boxSizing: "border-box" }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: "100%", marginLeft: "10px" }), []);
  const dispatch = useDispatch();

  const objects = Hook.usePost({
    url: "api/schools/schoolmaster",
  });

  const onGridReady = (params) => {
    API.post(`api/schools/schoolmaster`, {}, (response) => {
      if (response.status) {
        setRowData(response?.data);
      }
    });
  };
  const [columnDefs, ] = useState([
    {
      headerName: "School Name",
      field: "school_name",
      headerClass: "Udise-header",
      resizable: true,
      filter: "agTextColumnFilter",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      chartDataType: "series",
      editable: false,
    },
    {
      headerName: "Extra Info",
      children: [
        {
          headerName: "Udise Code",
          field: "udise_sch_code",
          width: 140,
          filterParams: {
            buttons: ["apply"],
          },
          chartDataType: "category",
        },
        {
          columnGroupShow: "closed",
          field: "state_id",
          width: 100,
          filter: "agNumberColumnFilter",
          chartDataType: "series",
        },
        {
          headerName: "District ID",
          columnGroupShow: "open",
          field: "district_id",
          width: 100,
          filter: "agNumberColumnFilter",
          chartDataType: "series",
        },
      ],
    },
    {
      headerName: "Udise Codes",
      field: "udise_sch_code",
      headerClass: "Udise-header",
      resizable: true,
      filterParams: {
        buttons: ["reset"],
        chartDataType: "series",
      },
      editable: false,
    },
    {
      headerName: "State ID",
      field: "state_id",
      headerClass: "Udise-header",
      chartDataType: "series",
      editable: false,
    },
    {
      headerName: "District ID",
      field: "district_id",
      headerClass: "Udise-header",
      chartDataType: "series",
      editable: false,
    },
    {
      headerName: "Additional Class Room",
      field: "ele_additional_class_room",
      headerClass: "Udise-header",
      chartDataType: "category",
      cellDataType: "number",
    },
    {
      headerName: "Boys Toilet",
      field: "ele_boys_toilet",
      headerClass: "Udise-header",
      chartDataType: "category",
      cellDataType: "number",
    },
    {
      headerName: "Girls Toilet",
      field: "ele_girls_toilet",
      headerClass: "Udise-header",
      chartDataType: "series",
    },
    {
      headerName: "Drinking Water",
      field: "ele_drinking_water",
      headerClass: "Udise-header",
    },
    {
      headerName: "Boundary Wall",
      field: "ele_boundary_wall",
      headerClass: "Udise-header",
    },
    {
      headerName: "Handlrails",
      field: "ele_handrails",
      headerClass: "Udise-header",
    },
    {
      headerName: "CWSN Toilet",
      field: "ele_cwsn_toilet",
      headerClass: "Udise-header",
    },
    {
      headerName: "Major Repair",
      field: "ele_major_repair",
      headerClass: "Udise-header",
    },
    {
      headerName: "Furniture",
      field: "ele_furniture",
      headerClass: "Udise-header",
    },
    {
      headerName: "Rams Handrails",
      field: "ele_ramps_handrails",
      headerClass: "Udise-header",
    },
    {
      headerName: "Sola Panel",
      field: "ele_solar_panel",
      headerClass: "Udise-header",
    },
    {
      headerName: "Encinerator Machine",
      field: "ele_incinerator_machine",
      headerClass: "Udise-header",
    },
    {
      headerName: "Vending Machine",
      field: "ele_vending_machine",
      headerClass: "Udise-header",
    },
    {
      headerName: "Upgrade PS UPS",
      field: "c_ele_upgradation_ps_ups",
      headerClass: "Udise-header",
    },
    {
      headerName: "BuildingLess",
      field: "c_ele_buildingless",
      headerClass: "Udise-header",
    },
    {
      headerName: "Diapidated Building",
      field: "c_ele_dilapidated_building",
      headerClass: "Udise-header",
    },
    {
      headerName: "Smart Class Room",
      field: "c_ele_smart_class_room",
      headerClass: "Udise-header",
    },
    {
      headerName: "Additional ICT Lab",
      field: "c_additional_ict_lab",
      headerClass: "Udise-header",
    },
    {
      headerName: "Digital Hardware Software",
      field: "c_ele_digital_hardware_software",
      headerClass: "Udise-header",
    },
    {
      headerName: "Child Frientdly Furniture",
      field: "c_ele_child_friendly_furniture",
      headerClass: "Udise-header",
    },
    {
      headerName: "Bala Feature",
      field: "c_ele_bala_feature",
      headerClass: "Udise-header",
    },
  ]);

  const onCellValueChanged = (params) => {
    // Access edited values in params
    const newValue = params.newValue;
    const column = params.column.colId;
    const row = params.node.data;

    API.post(
      `api/schools/update`,
      { [column]: newValue, school_id: String(row.school_id) },
      (response) => {
        if (response.status) {
          dispatch(features.showToast({ message: response.message }));
          onGridReady();
        }
      }
    );
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
    }
  };
 
  const defaultColDef = useMemo(() => {
    return {
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
      headerCheckboxSelection: true,
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

  return (
    <>
      <div style={containerStyle}>
        <div className="test-container">
          <div className="test-header">
            <div
              style={{
                textAlign: "right",
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "1rem",
              }}
            >
              <button
                className="btn btn-primary d-flex justify-content-end"
                onClick={onBtExport}
                style={{
                  margin: "5px 0px",
                  marginRight: "0px",
                  textAlign: "right",
                }}
              >
                <span className="mobile-hide">Export To</span> Excel
              </button>
            </div>
          </div>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={objects?.data}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              gridOptions={gridOptions}
              enableRangeSelection={true}
              enableCharts={true}
              suppressColumnSelectAll={"true"}
              autoGroupColumnDef={autoGroupColumnDef}
              rowGroupPanelShow={"always"}
              rowSelection={"multiple"}
              suppressAggFuncInHeader={true}
              onCellClicked={handleCellClicked}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportMain;
