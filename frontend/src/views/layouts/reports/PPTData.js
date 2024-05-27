import { useEffect, useRef, useMemo, useState } from "react";
import { Helper, Settings, Hook } from "../../../apps";
import { AgGridReact } from "ag-grid-react";
import "../prabandh/spill.css";
import api from "../../../apps/utilities/api";
import Spinner from "../../../apps/components/elements/Spinner";
import { useNavigate } from 'react-router-dom';

const PPTData = () => {
  let userData = Helper.auth?.user;

  const [spin, setSpin] = useState(false);
  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [object, setObject] = useState();
  const [pagesize, setpagesize] = useState(12);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const statesList = Hook.useStates();
  const navigate = useNavigate();

  const getRowStyle = (params) => {
    if (params.data.scheme_id === 555555) {
      return { background: "#ff9696" };
    } else if (params.data.major_component_id === 666666) {
      return { background: "#f799ff" };
    } else if (params.data.sub_component_id === 777777) {
      return { background: "#8cf0ff" };
    } else if (params.data.activity_master_id === 888888) {
      return { background: "#f5df98" };
    } else if (params.data.activity_master_details_id === 999999) {
      return { background: "#8cffa1" };
    }
    return null;
  };

  const getStateMatrixData = () => {
    setSpin(true);
    api.post("api/reports/get-ppt-data", { state_id: stateID }, (res) => {
      setObject(res);
      setSpin(false);
    });
  };

  const formatHeader = (key) => {
    return Helper.ucfirst(key.toLowerCase().split("_").join(" "));
  };
  const configGridHeader = () => {
    if (object !== null && object?.data?.fields !== undefined) {
      let headerRows = [];
      object?.data?.fields.forEach((itm, i) => {
        let rowObj = {};
        if (i === 0) {
          rowObj = {
            headerName: "S. No.",
            field: "serial_number",
            headerClass: "report_header",
            suppressSizeToFit: true,
            valueGetter: (params) => params.node.rowIndex + 1,
            maxWidth: 100,
            type: "leftAligned",
          }
        } else {
          rowObj["headerName"] = formatHeader(itm.name);
          rowObj["field"] = itm.name;
          rowObj["headerClass"] = "report_header";
          rowObj["valueGetter"] = (params) => itm.name !== "group_name" ? parseFloat(Helper.numberFormat(params.data[itm.name])) : params.data[itm.name];
          rowObj["cellStyle"] = (params) => itm.name !== "group_name" ? { textAlign: "right" } : { textAlign: "left" };
        }
        headerRows.push(rowObj)
      });

      return headerRows;
    }
  };

  useEffect(() => {
    if (stateID !== 0) {
      getStateMatrixData();
    } else {
      setObject([]);
    }
  }, [stateID]);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: false,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      editable: false,
      minWidth: 250,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      initialWidth: 250,
      wrapHeaderText: true,
    };
  }, []);

  const state_name = statesList?.filter((c) => c.id === stateID);
  const exportTableToExcel = async () => {
    const fileName = `PPT_Data_Report (${state_name?.length > 0 ? state_name[0]?.name : ''})_` + Date.now().toString();
    gridRef.current.api.exportDataAsExcel({ fileName });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state-list") {
      setStateID(+value);
    }
  };

  const handlePagination = (e) => {
    e.preventDefault();
    const value = parseInt(e.target.value);
    setpagesize(+value);
  };

  const renderAGGrid = () => {

    if (object?.data?.rows.length > 0) {
      let stateName = statesList.filter((c) => +c.id === +stateID);
      let repo_head = [
        {
          headerName: `PPT Data ( ${stateName[0].name} )`,
          headerClass: "main_header",
          children: configGridHeader(),
        },
      ];

      return (
        <div style={gridStyle} className={"ag-theme-alpine AS"}>
          <AgGridReact
            ref={gridRef}
            columnDefs={repo_head}
            rowData={object?.data?.rows}
            animateRows={true}
            defaultColDef={defaultColDef}
            checkboxSelection={false}
            rowSelection={"single"}
            pagination={true}
            paginationAutoPageSize={false}
            paginationPageSize={pagesize ? pagesize : 12}
            paginationPageSizeSelector={[pagesize ? pagesize : 12, 20, 50, 100]}
            viewportRowModelPageSize={1}
            getRowStyle={getRowStyle} />

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
              onClick={handlePagination}
            >
              <option value={12}>12</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option
                value={object?.data?.rows ? object?.data?.rows?.length : null}
              >
                All
              </option>
            </select>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>PPT Data</h1>

        <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate("/auth/prabandh/report")}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>

        <button
          type="button"
          className="btn btn-success float-end mx-2"
          onClick={exportTableToExcel}
          disabled={
            object?.length === 0
              ? true
              : object?.data?.length === 0
                ? true
                : pdfbtnStatus
          }
        >
          <i className="bi bi-file-earmark-excel"></i>{" "}
          <span className="mobile-hide">Export To</span> Excel
        </button>
      </div>

      {(Settings.isNationalUser() && statesList && statesList.length > 0) && (
        <div
          className="dashboard-main-content-info mb-3 mt-3"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="state-list"
                    value={stateID}
                    onChange={handleChange}
                    disabled={statesList.find(
                      (state) => state.id === userData.user_state_id
                    )}
                  >
                    <option value={0}>--Select State--</option>
                    {statesList?.map((st, stidx) => (
                      <option key={`st_${stidx}`} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-content-info">
        <div className="row">
          {spin ? (
            <Spinner />
          ) : object === undefined ||
            object.length === 0 ||
            object?.data?.length === 0 ? (
            <h3 className="text-center">No Data Found</h3>
          ) : (
            renderAGGrid()
          )}
        </div>
      </div>
    </div>
  );
};

export default PPTData;
