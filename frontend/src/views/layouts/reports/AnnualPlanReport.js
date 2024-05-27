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
import { API, Helper, Settings, Hook } from "../../../apps";
import "./ReportStyle.css";
import api from "../../../apps/utilities/api";
import "./ReportStyle.css";
import { AnnualPlanGrid } from "../../../apps/utilities/GridHeaderColumns";
import { AnnualPlanHeaders } from "./ExportReports/ExcelReports/ExcelHeaders";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../apps/components/elements/Spinner";

const AnnualReports = () => {
  const user = Helper.auth.user;
  const gridRef = useRef();
  const navigate = useNavigate();

  const [rowData, setRowData] = useState();
  const [loadState, setLoadState] = useState(false);
  const [filteredRowData, setfilteredRowData] = useState();
  const stateList = Hook.useStates();
  const [stateID, setStateID] = useState(0);
  const [districtID] = useState(0);
  const [reportData] = useState([]);
  const [pagesize, setpagesize] = useState(10);
  const [, setGridApi] = useState(null);
  const [columnDefs, setColumnDefs] = useState([]);

  const state_name = stateList?.filter((c) => c.id === stateID);
  const defaultColDef = useMemo(() => {
    return AnnualPlanGrid.defaultCols();
  }, []);
  const containerStyle = useMemo(
    () => ({ height: 600, boxSizing: "border-box" }),
    []
  );
  const gridStyle = useMemo(
    () => ({ height: 600, width: "100%", marginLeft: "10px" }),
    []
  );

  const onGridReady = (params) => {
    setGridApi(params?.api);
    gridRef.current.api = params.api;
  };

  useEffect(() => {
    setColumnDefs(AnnualPlanGrid.headers(rowData, state_name && state_name[0]?.["name"]));
  }, [rowData]);

  const handleFetchData = () => {
    setLoadState(true);
    API.post(
      `api/reports/getannualreportdt`,
      { state_id: Number(stateID), district_id: Number(districtID) },
      (response) => {
        if (response.status) {
          const newList =
            response?.data &&
            response?.data?.map((item, i) => {
              item.recuring_nonrecuring == 1
                ? (item.recuring_nonrecuring = "Recurring")
                : (item.recuring_nonrecuring = "Non Recurring");
              return { ...item, serial_number: i + 1 };
            });

          const sortdata = newList?.sort((a, b) => {
            return (
              a.scheme_name.localeCompare(b.scheme_name) ||
              a.major_component_name.localeCompare(b.major_component_name) ||
              a.sub_component_name.localeCompare(b.sub_component_name)
            );
          });

          sortdata?.map((s) => s.scheme_name);
          setRowData(sortdata && sortdata);
          setfilteredRowData(sortdata && sortdata);
        }
        setLoadState(false);
      }
    );
  };

  useEffect(() => {
    handleFetchData();
    setLoadState(true);
    const sortdata = rowData?.sort((a, b) => {
      return (
        a.scheme_name.localeCompare(b.scheme_name) ||
        a.major_component_name.localeCompare(b.major_component_name) ||
        a.sub_component_name.localeCompare(b.sub_component_name)
      );
    });
    setRowData(sortdata && sortdata);
    setfilteredRowData(sortdata && sortdata);
    // setLoadState(false);
  }, [stateID, districtID]);

  const onBtExport = useCallback(() => {
    const fileName = `State_Matrix_Report (${state_name?.length > 0 ? state_name[0]?.name : ''})_` + Date.now().toString();
    gridRef?.current?.api?.exportDataAsExcel({ fileName });
  }, []);

  const handleCellClicked = (params) => {
    const clickedColumnName = params.column.colDef.field;
    params.node.setSelected(!params.node.isSelected());

    const selectedNodes = gridRef.current.api.getSelectedNodes();
    selectedNodes.map((node) => ({
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

  useEffect(() => {
    setStateID(user.user_state_id || 0);
    //getStateList();
  }, [reportData]);

  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);
  };

  const onFilterChanged = (e) => {
    const a = gridRef?.current?.api;
    const c = a?.rowModel?.rowsToDisplay;
    const data = c?.map((v, i) => v.data);
    setfilteredRowData(data);
  };

  const excelStyles = useMemo(() => {
    return AnnualPlanHeaders.headers();
  }, []);

  const createData = () => {
    let sumData = {};
    if (columnDefs?.length) {
      let dataFields = columnDefs[0]["children"];
      dataFields?.forEach((item, index) => {
        if (index > 5) {
          if (Settings.isDataExistsInArray(item?.field, "quantity")) {
            sumData[item.field] =
              parseFloat(sumData[item?.field] ? sumData[item?.field] : 0) +
              filteredRowData?.reduce(
                (accumulator, d) =>
                  parseFloat(accumulator ? accumulator : 0) +
                  parseFloat(d[item?.field] ? d[item?.field] : 0),
                0
              );
          } else {
            sumData[item.field] = Helper.accountFormat(
              parseFloat(sumData[item.field] ? sumData[item.field] : 0) +
              filteredRowData?.reduce(
                (accumulator, d) =>
                  parseFloat(accumulator ? accumulator : 0) +
                  parseFloat(d[item.field] ? d[item.field] : 0),
                0
              )
            );
          }
        } else {
          sumData[item.field] = "";
        }
        if (index === 5) {
          sumData[item.field] = "Grand Total (₹ In Lakhs)";
        }
      });
      return [sumData];
    }
  };

  const pinnedBottomRowData = useMemo(() => {
    return createData();
  }, [rowData, columnDefs, filteredRowData]);

  return (
    <>
      <div className="dashboard-main-content">
        <div className="dashboard-main-content__header mb-3">
          <h1 style={{ display: "inline-block" }}>State Matrix Report</h1>
          <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate("/auth/prabandh/report")}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>
          <button
            type="button"
            className="btn btn-success float-end mx-2"
            disabled={rowData?.length === 0 ? true : false}
            onClick={onBtExport}
          >
            <i className="bi bi-file-earmark-excel"></i>{" "}
            <span className="mobile-hide">Export To</span> Excel
          </button>
        </div>

        {[1, 2, 3, 12, 15, 25].includes(user.user_role_id) && (
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
                      onChange={updateDistrictsList}
                      disabled={stateList?.find(
                        (state) => state.id === user.user_state_id
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
        <div className="row">
          <div style={containerStyle}>
            <div className="test-container">
              {loadState ? <Spinner /> :
                rowData?.length !== 0 ? (
                  <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                      ref={gridRef}
                      rowData={rowData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      onGridReady={onGridReady}
                      enableRangeSelection={true}
                      suppressColumnSelectAll={true}
                      onCellClicked={handleCellClicked}
                      excelStyles={excelStyles}
                      checkboxSelection={false}
                      rowSelection={"single"}
                      pagination={true}
                      onFilterChanged={onFilterChanged}
                      paginationPageSize={pagesize ? pagesize : 10}
                      paginationPageSizeSelector={[pagesize ? pagesize : 10, 20, 50, 100]}
                      paginationAutoPageSize={false}
                      viewportRowModelPageSize={1}
                      pinnedBottomRowData={pinnedBottomRowData}
                    />
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
                        onClick={(e) => setpagesize(e.target.value)}
                      >
                        <option value="10">10</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value={rowData ? rowData?.length : null}>
                          All
                        </option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <h3 style={{ textAlign: "center" }}>NO DATA FOUND</h3>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnualReports;
