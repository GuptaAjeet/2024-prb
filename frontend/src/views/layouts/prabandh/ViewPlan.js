import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { Hook, Helper, API } from "../../../apps";
import Features from "../../../redux/features";
import { useSelector, useDispatch } from "react-redux";
import Btnloader from "../../../apps/components/elements/Btnloader";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";

/* ag-grid integration */
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-balham.css";
//import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import store from "../../../redux/app/store";

const ViewPlan = () => {
  const user = Helper.auth.user;
  const gridRef = useRef();
  const dispatch = useDispatch();
  const [columnDefs, setColumnDefs] = useState();

  const handler = useSelector((state) => state.handler);
  const { year } = useSelector((state) => state.year);
  const { version } = useSelector((state) => state.version);

  // const state_name = stateList?.filter((c) => c.id == user_state_id);
  // const district_name = districtsList?.filter((c) => c.id == user_district_id);
  const object = Hook.usePost({
    url: "api/prabandh/fetch-district-saved-plan-activity-list",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      districtid: user.user_district_id,
      year: year,
      version: version,
      stateid: user.user_state_id,
      get: "all",
      activity_group_code: user?.activity_group_code
    },
  });
  useEffect(() => {
    dispatch(
      Features.makeHandler({
        page: 1,
        limit: 10,
        reload: 0,
      })
    );

    setColumnDefs([
      {
        headerName: "S.No.",
        field: "row_number",
        width: 100,
      },
      {
        headerName: "Scheme",
        field: "scheme_name",
        filter: "agMultiColumnFilter",
      },
      {
        headerName: "Major Component",
        field: "major_component_name",
        filter: "agMultiColumnFilter",
      },
      {
        headerName: "Sub Component",
        field: "sub_component_name",
        filter: "agMultiColumnFilter",
      },
      {
        headerName: "Activity Master",
        field: "activity_master_name",
        filter: "agMultiColumnFilter",
      },
      {
        headerName: "Sub Activity",
        field: "activity_master_details_name",
        filter: "agMultiColumnFilter",
        flex: 1,
      },
      {
        headerName: "Recurring Type",
        field: "recuring_nonrecuring",
        filter: "agMultiColumnFilter",
      },
    ]);
  }, []);

  const downloadCSV = async () => {
    try {
      API.download(
        "api/prabandh/generate-csv",
        {
          s: user.user_state_id,
          d: user.user_district_id,
          y: year,
          filename: "plan_data",
        },
        (res) => {}
      );
    } catch (error) {}
  };

  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const handleGeneratePdf = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/fillplan`;
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          state_id: user.user_state_id,
          district_id: user.user_district_id,
          state_name: user.state_name === null ? "--Select State--" : user?.state_name,
          district_name:
            user.district_name === null ? "All District" : user?.district_name,
          report_type: "View Plan",
          get: "all",
          role: user.user_role_id,
          year:apiYear,
          apiVersion:apiVersion
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            API_Year: apiYear,
            API_Version: apiVersion,
            Authorization: `Bearer ${Helper.token()}`
          },
        }
      );
      if (response) {
        setPdfbtnStatus(false);
      }
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
      link.setAttribute("download", `ViewPlans_2024-2025_${datetime}.pdf`); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 w-100 float-start">
        <h1 className="float-start">View Plan</h1>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ float: "right" }}
          onClick={downloadCSV}
        >
          <i className="bi bi-download"></i>{" "}
          <span className="mobile-hide">Export To</span> CSV
        </button>

        <button
          type="button"
          style={{ marginRight: "1rem" }}
          className="btn btn-danger float-end  btn-sm"
          disabled={
            object && object?.data?.count && object?.data?.count > 0
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

      <div className="col-md-12 pb-2">
        <div className="dashboard-main-content-info clear">
          <div className="row p-3">
            <div
              className="ag-theme-alpine"
              style={{ height: "600px", width: "100%" }}
            >
              {object && (
                <Fragment>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs}
                    rowData={object.data.data}
                    animateRows={true}
                    defaultColDef={defaultColDef}
                    rowSelection="multiple"
                    suppressRowClickSelection={true}
                    pagination={true}
                    paginationAutoPageSize={true}
                  />
                  {/* <Table
                    preference={{
                      size: "table-sm",
                    }}
                    object={{
                      columns: Column.viewPlan(),
                      data: object.data.data,
                      count: object.data.count,
                    }}
                  /> */}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewPlan;
