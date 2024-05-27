import React, { useMemo, useEffect, useState, Fragment, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Helper } from "../../../../apps";
import CustomLoadingOverlay from "../../prabandh/School/customLoadingOverlay";
import Spinner from "../../../../apps/components/elements/Spinner";

const SchoolList = ({ schoolList }) => {
  const user = Helper.auth.user;
  const [schoolData, setSchoolData] = useState(() => schoolList);
  const [columnDefs, setColumnDefs] = useState();
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const gridRef = useRef();
  const [grower, setGrower] = useState(false);
  const loadingOverlayComponent = useMemo(() => CustomLoadingOverlay, []);

  useEffect(() => {
    setGrower(false);

    setColumnDefs([
      {
        headerName: "UDISE",
        field: "asset_code",
        filter: "agMultiColumnFilter",
      },
      {
        headerName: "SCHOOL NAME",
        field: "school_name",
        filter: "agMultiColumnFilter",
        flex: 1,
      },
      {
        headerName: "Quantity",
        field: "allocated_physical_quantity",
        filter: "agMultiColumnFilter",
        flex: 1,
      },
      {
        headerName: "Financial",
        field: "allocated_financial_amount",
        filter: "agMultiColumnFilter",
        flex: 1,
      },
      
    ]);
  }, [user]);

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const NoSchoolFind = () => {
    return (
      <div className="container text-center">
        {grower && <Spinner />}
        <h4 className="mt-5">No School Found</h4>
      </div>
    );
  };

  return (
    <div className="dashboard-main-content" style={{ padding: "unset" }}>
      <div className="dashboard-main-content-info">
        {schoolData && schoolData?.length === 0 ? (
          <NoSchoolFind />
        ) : (
          <div
            className="ag-theme-alpine"
            style={{ height: "400px", width: "100%" }}
          >
            <Fragment>
              <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                  ref={gridRef}
                  columnDefs={columnDefs}
                  rowData={schoolData}
                  animateRows={true}
                  defaultColDef={defaultColDef}
                  loadingOverlayComponent={loadingOverlayComponent}
                  pagination={true}
                  paginationAutoPageSize={true}
                />
              </div>
            </Fragment>
          </div>
        )}
      </div>
    </div>
  );
};
export default SchoolList;
