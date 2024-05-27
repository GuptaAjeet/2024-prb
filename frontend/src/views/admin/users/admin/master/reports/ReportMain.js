import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { API, Helper, Hook } from "../../../../../../apps";
import "./ReportStyle.css";
import { useDispatch } from "react-redux";
import features from "../../../../../../redux/features";
// import Report from './Report';

const ReportMain = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(
    () => ({ height: 600, boxSizing: "border-box" }),
    []
  );
  const gridStyle = useMemo(
    () => ({ height: 600, width: "100%", marginLeft: "10px" }),
    []
  );
  const [rowData, setRowData] = useState();
  const [editedData, setEditedData] = useState([]);
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
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "School Name",
      field: "school_name",
      headerClass: "Udise-header",
      resizable: true,
      filter: "agTextColumnFilter",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      // filterParams: {
      //     buttons: ['apply'],
      // },
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
        // {
        //     headerName: 'Boys Toilet',
        //     columnGroupShow: 'open',
        //     field: 'ele_boys_toilet',
        //     width: 100,
        //     filter: 'agNumberColumnFilter', chartDataType: 'series'
        // },
        // {
        //     headerName: 'Girls Toilet',
        //     columnGroupShow: 'open',
        //     field: 'ele_girls_toilet',
        //     width: 100,
        //     filter: 'agNumberColumnFilter', chartDataType: 'series'
        // },
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

  const [excelStyles, setExcelStyles] = useMemo(() => {
    return [
      // The base style, red font.
      {
        id: "redFont",
        font: {
          color: "#ff0000",
        },
      },
      // The cellClassStyle: background is green and font color is light green,
      // note that since this excel style it's defined after redFont
      // it will override the red font color obtained through cellClass:'red'
      {
        id: "greenBackground",
        alignment: {
          horizontal: "Right",
          vertical: "Bottom",
        },
        font: { color: "#e0ffc1" },
        interior: {
          color: "#008000",
          pattern: "Solid",
        },
      },
      {
        id: "cell",
        alignment: {
          vertical: "Center",
        },
      },
    ];
  }, []);
  // const gridOptions = {
  //     domLayout: 'autoWidth',
  // };

  const onCellValueChanged = (params) => {
    // Access edited values in params
    // const oldValue = params.oldValue;
    const newValue = params.newValue;
    const column = params.column.colId;
    const row = params.node.data;
    API.post(
      `api/schools/update`,
      { [column]: newValue, school_id: String(row.school_id) },
      (response) => {
        if (response.status) {
          // dispatch(
          //     features.makeHandler({
          //         reload: new Date().getTime(),
          //         where: Helper.whereMasterObjSelector(),
          //     })
          // )
          dispatch(features.showToast({ message: response.message }));
          onGridReady();
        }
      }
    );
    // setEditedData(prev => [...prev, row]);
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
    // header: ExcelHeaderFooterContent[];

    // interface ExcelHeaderFooterContent {
    //     // The value of the text to be included in the header.
    //     value: "string";
    //     // Configures where the text should be added: `Left`, `Center` or `Right`.
    //     // Default: `Left`
    //     position?: 'Left' | 'Center' | 'Right';
    //     // The font style of the header/footer value.
    //     font?: ExcelFont;
  };
  // };
  // const gridOptions = {
  //     // other AG Grid options...

  //     processExcelHeader: params => {
  //         return {
  //             header: [
  //                 // array of header lines
  //                 'Your Custom Header Line 1',
  //                 'Your Custom Header Line 2',
  //             ],
  //             skipHeader: false, // set to true to skip default header
  //         };
  //     },

  //     processExcelFooter: params => {
  //         return {
  //             footer: [
  //                 // array of footer lines
  //                 'Your Custom Footer Line 1',
  //                 'Your Custom Footer Line 2',
  //             ],
  //             skipFooter: false, // set to true to skip default footer
  //         };
  //     },
  // };
  const defaultColDef = useMemo(() => {
    return {
      // flex: 1,
      editable: true,
      sortable: true,
      resizable: true,
      minWidth: 130,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      floatingFilter: true,
      // cellStyle: () => ({
      //     // display: "flex",
      //     alignItems: "center",
      //     justifyContent: "left"
      // })
      // cellClassRules: {
      //     darkGreyBackground: (params) => {
      //         return (params.node.rowIndex || 0) % 2 == 0;
      //     },
      // },
    };
  }, []);

  const onBtSortOn = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "age", sort: "desc" },
        { colId: "athlete", sort: "asc" },
      ],
    });
  }, []);

  const onBtSortOff = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      defaultState: { sort: null },
    });
  }, []);

  const onBtWidthNarrow = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "age", width: 100 },
        { colId: "athlete", width: 100 },
      ],
    });
  }, []);

  const onBtWidthNormal = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "age", width: 200 },
        { colId: "athlete", width: 200 },
      ],
    });
  }, []);

  const onBtHide = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "age", hide: true },
        { colId: "athlete", hide: true },
      ],
    });
  }, []);

  const onBtShow = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      defaultState: { hide: false },
    });
  }, []);

  const onBtPivotOn = useCallback(() => {
    gridRef.current.columnApi.setPivotMode(true);
    gridRef.current.columnApi.applyColumnState({
      state: [{ colId: "country", pivot: true }],
    });
  }, []);

  const onBtPivotOff = useCallback(() => {
    gridRef.current.columnApi.setPivotMode(false);
    gridRef.current.columnApi.applyColumnState({
      defaultState: { pivot: false },
    });
  }, []);

  const onBtRowGroupOn = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [{ colId: "sport", rowGroup: true }],
    });
  }, []);

  const onBtRowGroupOff = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      defaultState: { rowGroup: false },
    });
  }, []);

  const onBtAggFuncOn = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "gold", aggFunc: "sum" },
        { colId: "silver", aggFunc: "sum" },
        { colId: "bronze", aggFunc: "sum" },
      ],
    });
  }, []);

  const onBtAggFuncOff = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      defaultState: { aggFunc: null },
    });
  }, []);

  const onBtNormalOrder = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "gold" },
        { colId: "silver" },
        { colId: "bronze" },
      ],
      applyOrder: true,
    });
  }, []);

  const onBtReverseOrder = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "athlete" },
        { colId: "age" },
        { colId: "country" },
        { colId: "sport" },
        { colId: "bronze" },
        { colId: "silver" },
        { colId: "gold" },
      ],
      applyOrder: true,
    });
  }, []);

  const onBtPinnedOn = useCallback((e) => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "athlete", pinned: "left" },
        { colId: "age", pinned: "right" },
      ],
    });
  }, []);

  const onBtPinnedOff = useCallback(() => {
    gridRef.current.columnApi.applyColumnState({
      defaultState: { pinned: null },
    });
  }, []);

  const onBtnExportDataAsExcel = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);
  useEffect(() => {
    const allColumnIds = [];
    columnDefs.forEach((column) => {
      allColumnIds.push(column.field);
    });
  }, []);
  const getParams = () => ({
    // prependContent: getBoolean('#prependContent') ? getRows() : undefined,
    // appendContent: getBoolean('#appendContent') ? getRows() : undefined,
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
      // flex: 1,
      // minWidth: 40,
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);

  const handleCellClicked = (params) => {
    const clickedColumnName = params.column.colDef.field;
    // setClickedColumnName(clickedColumnName);
    params.node.setSelected(!params.node.isSelected());

    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedCells = selectedNodes.map((node) => ({
      row: node.rowIndex,
      col: node.data.udise_sch_code,
      field: clickedColumnName,
    }));
    // setSelectedCells(selectedCells);
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
            {/* <div className="test-button-row">
                        <div className="test-button-group">
                            <button onClick={onBtSortOn}>Sort On</button>
                            <br />
                            <button onClick={onBtSortOff}>Sort Off</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtWidthNarrow}>Width Narrow</button>
                            <br />
                            <button onClick={onBtWidthNormal}>Width Normal</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtHide}>Hide Cols</button>
                            <br />
                            <button onClick={onBtShow}>Show Cols</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtReverseOrder}>Reverse Medal Order</button>
                            <br />
                            <button onClick={onBtNormalOrder}>Normal Medal Order</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtRowGroupOn}>Row Group On</button>
                            <br />
                            <button onClick={onBtRowGroupOff}>Row Group Off</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtAggFuncOn}>Agg Func On</button>
                            <br />
                            <button onClick={onBtAggFuncOff}>Agg Func Off</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtPivotOn}>Pivot On</button>
                            <br />
                            <button onClick={onBtPivotOff}>Pivot Off</button>
                        </div>
                        <div className="test-button-group">
                            <button onClick={onBtPinnedOn}>Pinned On</button>
                            <br />
                            <button onClick={onBtPinnedOff}>Pinned Off</button>
                        </div>
                    </div> */}
          </div>
          {/* 
                <div>
                    <button
                        onClick={onBtnExportDataAsExcel}
                        style={{ marginBottom: '5px', fontWeight: 'bold' }}
                    >
                        <span className="mobile-hide">Export To</span> Excel
                    </button>
                </div> */}
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              // suppressColumnVirtualisation={true}
              // suppressRowVirtualisation={true}
              ref={gridRef}
              rowData={objects?.data}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              // onSortChanged={onSortChanged}
              // onColumnResized={onColumnResized}
              // onColumnVisible={onColumnVisible}
              // onColumnPivotChanged={onColumnPivotChanged}
              // onColumnRowGroupChanged={onColumnRowGroupChanged}
              // onColumnValueChanged={onColumnValueChanged}
              // onColumnMoved={onColumnMoved}
              // onColumnPinned={onColumnPinned}
              gridOptions={gridOptions}
              enableRangeSelection={true}
              enableCharts={true}
              suppressColumnSelectAll={"true"}
              autoGroupColumnDef={autoGroupColumnDef}
              rowGroupPanelShow={"always"}
              // rowModelType={'serverSide'}
              rowSelection={"multiple"}
              // suppressRowClickSelection={true}
              suppressAggFuncInHeader={true}
              onCellClicked={handleCellClicked}
            />
          </div>
        </div>
      </div>
      {/* <br />
            <br />
            <br />
            <br />
            <br />
            <Report /> */}
    </>
  );
};

export default ReportMain;
