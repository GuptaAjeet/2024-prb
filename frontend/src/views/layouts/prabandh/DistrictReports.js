import { useEffect, useRef, useMemo, useState } from "react";
import { Helper, Settings, Hook } from "../../../apps";
import { AgGridReact } from "ag-grid-react";
import "./spill.css";
import api from "../../../apps/utilities/api";
import Spinner from "../../../apps/components/elements/Spinner";
import exportToExcel from "./PrabandhReports/ExcelReports";

const DistrictReports = () => {
  let userData = Helper.auth?.user;

  const stateList = Hook.useStates();
  const [spin, setSpin] = useState(false);
  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [object, setObject] = useState();

  const scheme = {
    1: "Primary Education",
    2: "Secondary Education",
    3: "Teacher's Eductaion",
  };

  const getStateMatrixData = () => {
    setSpin(true);
    api.post(
      "api/prabandh/district-report-data",
      { state_id: stateID },
      (res) => {
        setObject(res ? res : null);
        setSpin(false);
      }
    );
  };

  const [headerRows, setHeaderRows] = useState([]);

  const formatHeader = (key) => {
    return Helper.ucfirst(key.toLowerCase().split("_").join(" "));
  };

  const configGridHeader = () => {
    let columns = [];
    if (object !== null && object?.data?.fields !== undefined) {
      object?.data?.fields?.forEach((itm) => {
        let rowObj = {};

        rowObj["headerName"] =
          itm.name === "id" ? "S.No." : formatHeader(itm.name);
        rowObj["field"] = itm.name === "id" ? "serial_number" : itm.name;
        rowObj["valueGetter"] = (params) => {
          return itm.name === "id"
            ? params.node.rowIndex + 1
            : itm.name === "scheme"
            ? scheme[params.data[itm.name]]
            : params.data[itm.name] == null
            ? 0
            : params.data[itm.name];
        };
        rowObj["width"] = itm.name === "id" ? 91 : null;
        rowObj["cellStyle"] = (params) => {
          return Settings.isDataNotExistsInArray(
            [
              "id",
              "major_component_name",
              "recurring_nonrecurring",
              "scheme_name",
              "sub_component_name",
              "activity_master_name",
              "activity_master_details_name",
            ],
            itm.name
          )
            ? { textAlign: "right" }
            : { textAlign: "left" };
        };
        columns.push(rowObj);
      });
    }
    setHeaderRows(columns);
  };

  useEffect(() => {
    getStateMatrixData();
  }, [stateID]);

  useEffect(() => {
    if (object !== undefined && object?.data?.fields?.length > 0) {
      configGridHeader();
    }
  }, [object]);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: false,
      sortable: true,
      resizable: true,
    };
  }, []);

  const exportTableToExcel = async () => {
    exportToExcel("districtReport", {
      reportData: object.data.rows,
      headers: headerRows,
      scheme: scheme,
      fileName: "Major_component_district_matrix",
      sheetName: "Sheet 1",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state-list") {
      setStateID(+value);
    }
  };

  const createData = () => {
    let sumData = {};
    if (headerRows.length) {
      let dataFields = headerRows;

      dataFields.forEach((item, index) => {
        if (index > 3) {
          sumData[item.field] = Helper.accountFormat(
            parseFloat(sumData[item.field] ? sumData[item.field] : 0) +
              object?.data.rows.reduce(
                (accumulator, d) =>
                  parseFloat(accumulator ? accumulator : 0) +
                  parseFloat(d[item.field] ? d[item.field] : 0),
                0
              )
          );
        } else {
          sumData[item.field] = "";
        }
        if (index === 3) {
          sumData[item.field] = "Grand Total (₹ In Lakhs)";
        }
      });
      return [sumData];
    }
  };

  const pinnedBottomRowData = useMemo(() => {
    return createData();
  }, [object?.data, headerRows]);

  const renderAGGrid = () => {
    return (
      <div style={gridStyle} className={"ag-theme-alpine AS"}>
        <AgGridReact
          ref={gridRef}
          columnDefs={headerRows}
          rowData={object?.data?.rows}
          animateRows={true}
          defaultColDef={defaultColDef}
          checkboxSelection={false}
          rowSelection={"single"}
          pagination={true}
          paginationPageSize={12}
          paginationAutoPageSize={false}
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    );
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>District Report</h1>

        <button
          type="button"
          className="btn btn-success float-end mx-2"
          onClick={exportTableToExcel}
          disabled={object === undefined || object?.data?.length === 0}
        >
          {" "}
          <i className="bi bi-file-earmark-excel"></i>{" "}
          <span className="mobile-hide">Export To</span> Excel
        </button>
      </div>

      {userData.user_role_id === 1 && (
        <div
          className="dashboard-main-content-info mb-3 mt-3"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-5">
                  <select
                    className="form-select"
                    name="state-list"
                    value={stateID}
                    onChange={handleChange}
                    disabled={stateList?.find(
                      (state) => state.id === userData.user_state_id
                    )}
                  >
                    <option value={0}>--Select State--</option>
                    {stateList?.map((st, stidx) => (
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
          ) : object === undefined || object?.data.length === 0 ? (
            <h3 className="text-center">No Data Found</h3>
          ) : (
            renderAGGrid()
          )}
        </div>
      </div>
    </div>
  );
};
export default DistrictReports;
