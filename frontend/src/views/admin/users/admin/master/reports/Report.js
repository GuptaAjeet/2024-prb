
// import React, {
//     useCallback,
//     useMemo,
//     useRef,
//     useState,
//     StrictMode,
// } from 'react';
// import { createRoot } from 'react-dom/client';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// // import 'ag-grid-community/styles/ag-theme-quartz.css';
// // import './styles.css';

// var cellClassRules = {
//     'header-cell': 'data.section === "big-title"',
//     'quarters-cell': 'data.section === "quarters"',
// };

// const isHeaderRow = (params) => {
//     return params.data.section === 'big-title';
// };

// const isQuarterRow = (params) => {
//     return params.data.section === 'quarters';
// };

// const Report = () => {
//     const containerStyle = useMemo(() => ({ width: '100%', height: 600 }), []);
//     const gridStyle = useMemo(() => ({ height: 600, width: '100%' }), []);
//     const [rowData, setRowData] = useState([
//         { section: 'big-title', jan: 'Warehouse 1' },
//         { section: 'quarters', jan: 'Q1', apr: 'Q2' },
//         { jan: 534, feb: 612, mar: 243, apr: 231, may: 428, jun: 231 },
//         { jan: 765, feb: 146, mar: 243, apr: 231, may: 428, jun: 231 },
//         { jan: 335, feb: 122, mar: 243, apr: 231, may: 428, jun: 231 },
//         { jan: 35, feb: 342, mar: 243, apr: 231, may: 428, jun: 231 },
//         { jan: 568, feb: 531, mar: 243, apr: 231, may: 428, jun: 231 },
//         { jan: 365, feb: 361, mar: 243, apr: 231, may: 428, jun: 231 },
//         { section: 'big-title', jan: 'Warehouse 2' },
//         { section: 'quarters', jan: 'Q1', apr: 'Q2', may: '' },
//         { jan: 21, feb: 12, mar: 24, apr: 31, may: 28, jun: 31 },
//         { jan: 21, feb: 12, mar: 24, apr: 31, may: 28, jun: 31 },
//         { jan: 21, feb: 12, mar: 24, apr: 31, may: 28, jun: 31 },
//         { jan: 21, feb: 12, mar: 24, apr: 31, may: 28, jun: 31 },
//         { jan: 2, feb: 32, mar: 24, apr: 31, may: 48, jun: 21 },
//         { jan: 21, feb: 12, mar: 24, apr: 31, may: 28, jun: 31 },
//     ]);
//     const [columnDefs, setColumnDefs] = useState([
//         {
//             headerName: 'Jan',
//             field: 'jan',
//             colSpan: (params) => {
//                 if (isHeaderRow(params)) {
//                     return 6;
//                 } else if (isQuarterRow(params)) {
//                     return 3;
//                 } else {
//                     return 1;
//                 }
//             },
//             cellClassRules: cellClassRules,
//         },
//         { headerName: 'Feb', field: 'feb' },
//         { headerName: 'Mar', field: 'mar' },
//         {
//             headerName: 'Apr',
//             field: 'apr',
//             colSpan: (params) => {
//                 if (isQuarterRow(params)) {
//                     return 3;
//                 } else {
//                     return 1;
//                 }
//             },
//             cellClassRules: cellClassRules,
//         },
//         { headerName: 'May', field: 'may' },
//         { headerName: 'Jun', field: 'jun' },
//     ]);
//     const getRowHeight = useCallback((params) => {
//         if (isHeaderRow(params)) {
//             return 60;
//         }
//     }, []);
//     const defaultColDef = useMemo(() => {
//         return {
//             width: 100,
//         };
//     }, []);
//     const autoSizeStrategy = useMemo(() => {
//         return {
//             type: 'fitGridWidth',
//         };
//     }, []);

//     return (
//         <div style={containerStyle}>
//             <div
//                 style={gridStyle}
//                 className={
//             /** DARK MODE START **/ document.documentElement.dataset
//                         .defaultTheme || 'ag-theme-alpine' /** DARK MODE END **/
//                 }
//             >
//                 <AgGridReact
//                     rowData={rowData}
//                     columnDefs={columnDefs}
//                     getRowHeight={getRowHeight}
//                     defaultColDef={defaultColDef}
//                     autoSizeStrategy={autoSizeStrategy}
//                 />
//             </div>
//         </div>
//     );
// };

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//   import './styles.css';

const Report = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: 600 }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete' },
    { field: 'sport', minWidth: 150 },
    {
      headerName: 'Medals',
      children: [
        { field: 'gold', headerClass: 'gold-header' },
        { field: 'silver', headerClass: 'silver-header' },
        { field: 'bronze', headerClass: 'bronze-header' },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const defaultExcelExportParams = useMemo(() => {
    return {
      headerRowHeight: 30,
    };
  }, []);
  const excelStyles = useMemo(() => {
    return [
      {
        id: 'header',
        alignment: {
          vertical: 'Center',
        },
        interior: {
          color: '#f8f8f8',
          pattern: 'Solid',
          patternColor: undefined,
        },
        borders: {
          borderBottom: {
            color: '#ffab00',
            lineStyle: 'Continuous',
            weight: 1,
          },
        },
      },
      {
        id: 'headerGroup',
        font: {
          bold: true,
        },
      },
      {
        id: 'gold-header',
        interior: {
          color: '#E4AB11',
          pattern: 'Solid',
        },
      },
      {
        id: 'silver-header',
        interior: {
          color: '#bbb4bb',
          pattern: 'Solid',
        },
      },
      {
        id: 'bronze-header',
        interior: {
          color: '#be9088',
          pattern: 'Solid',
        },
      },
    ];
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtnExportDataAsExcel = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="page-wrapper">
        <div>
          <button
            onClick={onBtnExportDataAsExcel}
            style={{ marginBottom: '5px', fontWeight: 'bold' }}
          >
            <span className="mobile-hide">Export To</span> Excel
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              defaultExcelExportParams={defaultExcelExportParams}
              excelStyles={excelStyles}
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;  