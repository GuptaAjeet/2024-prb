// import React from 'react'

// export default function AnnexureReport() {
//   return (
//     <div>AnnexureReport</div>
//   )
// }

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useState, useEffect } from "react";
// import { createRoot } from "react-dom/client";
import api from "../../../apps/utilities/api";
import { Helper, Hook } from "../../../apps";
import Btnloader from "../../../apps/components/elements/Btnloader";
import axios from "axios";
import store from "../../../redux/app/store";
import { useNavigate } from "react-router-dom";

const AnnexureReport = () => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "600px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(null);
  const stateList = Hook.useStates();
  const [stateID, setStateID] = useState(0);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const user = Helper.auth.user;
  const navigate = useNavigate();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "test",
      field: "test",
      rowGroup: true,
      hide: true,
      minWidth: 400,
      sortable: true,
      valueGetter: (params) =>
        params?.data?.scheme_name == null
          ? `------- `
          : `${params?.data?.scheme_name}/ ${params?.data?.major_component_name}/ ${params?.data?.sub_component_name}/ ${params?.data?.activity_master_name}/ ${params?.data?.activity_master_details_name} `,
    },
    // { headerName: "Scheme Name", field: "scheme_name" },
    // { headerName: "Major Component Name", field: 'major_component_name', valueGetter: (params) => params?.data?.major_component_name == null ? `------- ` : params?.data?.major_component_name },
    // { headerName: "Sub Component Name", field: 'sub_component_name' },
    // { headerName: "Activity Master Name", field: 'activity_master_name' },
    {
      headerName: "Actiity Master Detail Name",
      field: "activity_master_details_name",
    },
    //  { headerName: "Quantity", field: 'proposed_physical_quantity' },
    // { headerName: "Financial Amount", field: 'proposed_financial_amount' },
    {
      headerName: "School Name",
      field: "school_name",
      valueGetter: (params) =>
        params?.data?.school_name == null
          ? `------- `
          : params?.data?.school_name,
    },
    {
      headerName: "Udise Code",
      field: "udise_sch_code",
      valueGetter: (params) =>
        params?.data?.udise_sch_code == null
          ? `------- `
          : params?.data?.udise_sch_code,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      valueGetter: (params) =>
        params?.data?.quantity == null ? `------- ` : params?.data?.quantity,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 0,
      editable: false,
      sortable: true,
      resizable: true,
      miWidth: 200,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      floatingFilter: false,
      wrapHeaderText: true,
      pagination: true,
      initialWidth: 250,
      // enablePivot: true,
      // enableValue: true,
      // floatingFilter: true,
    };
  }, []);
  useEffect(() => {
    if (+stateID !== 0) {
      api.post(
        `api/reports/get-annexure-report-data`,
        { state_id: stateID },
        (res) => {
          if (res?.data?.length > 0) {
            if (res?.data?.length !== 0) {
              // setRowData(res.data.filter(c => c.asset_code !== null));
              setRowData(res.data);
            }
          }
        }
      );
    }
  }, [stateID]);
  useEffect(() => {
    setStateID(user.user_state_id || 0);
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName:
        "Scheme/ Major Component/ Subcomponent/ Activity/ Activity Detail",
      minWidth: 500,
    };
  }, []);
  const updateDistrictsList = (e) => {
    if (+e.target.value === 0) {
      setRowData(null);
    }
    setStateID(e.target.value || 0);
  };

  const handleGeneratePdf = async () => {
    const apiYear = store.getState().year.year;
    const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/annexure/${stateID}/${apiYear}`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          Authorization: `Bearer ${Helper.token()}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      link.setAttribute(
        "download",
        `DraftPABmenutesReport${apiYear + "_" + currentdate}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
      setPdfbtnStatus(false);
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }} className="mb-2">
          Annexure Report
        </h1>
        <button
          className="btn btn-primary me-1 cfr"
          onClick={(e) => navigate("/auth/prabandh/report")}
        >
          <i className="bi bi-arrow-left">&nbsp;</i>Back
        </button>
      </div>

      <div
        className="dashboard-main-content-info mb-3"
        id="search"
        style={{ backgroundColor: "rgb(43 74 145)", marginBottom: "10px" }}
      >
        <div className="row ">
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
          <div className="col-md-9 text-end">
            <button
              type="button"
              style={{ marginRight: "1rem" }}
              className="btn btn-danger float-end"
              disabled={+stateID === 0 || pdfbtnStatus}
              onClick={handleGeneratePdf}
            >
              {pdfbtnStatus ? <Btnloader /> : ""}{" "}
              <i className="bi bi-file-earmark-pdf"></i>{" "}
              <span className="mobile-hide">Export To</span> PDF
            </button>
          </div>
        </div>
      </div>
      {rowData?.length === 0 || rowData === null ? (
        <h3
          style={{ textAlign: "center", height: "600px", marginTop: "10px" }}
          className="mt-2"
        >
          No Data Found
        </h3>
      ) : (
        <div style={containerStyle}>
          <div style={gridStyle} className={"ag-theme-alpine"}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              viewportRowModelPageSize={1}
              paginationAutoPageSize={false}
              groupDefaultExpanded={1}
              autoGroupColumnDef={autoGroupColumnDef}
              // groupDisplayType={'multipleColumns'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnexureReport;
