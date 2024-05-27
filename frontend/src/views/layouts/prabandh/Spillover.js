import { useState, useEffect, Fragment, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { REACT_APP_URL } from "../../../env";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { Helper, Settings } from "../../../apps";
import ConfirmationDialog from "../../../apps/components/form/ConfirmationDialog";
import Spinner from "../../../apps/components/elements/Spinner";
import sweetAlert from "../../../apps/utilities/sweetalert";
import Btnloader from "../../../apps/components/elements/Btnloader";
import api from "../../../apps/utilities/api";
import exportToExcel from "./PrabandhReports/ExcelReports/index.js";
import { SpillOverGrid } from "../../../apps/utilities/GridHeaderColumns";
import { SpillOverHeaders } from "./PrabandhReports/ExcelReports/ExcelHeaders";
import { SpillOverPDFHeaders } from "./PrabandhReports/PDFReports/PDFHeaders";

const Spillover = () => {
  // const menu = useSelector((state) => state.menu);
  const user = Helper.auth.user;
  const [filter, setFilter] = useState({
    state: "0",
    district: "0",
    scheme_id: "0",
    major_component_id: "0",
    sub_component_id: "0",
    activity_master_id: "0",
    activity_master_details_id: "0",
  });

  // const years = Hook.usePost({
  //   url: "api/prabandh/years",
  // });

  const createData = () => {
    var result = [];
    let sumData = {};

    let dataFields = SpillOverGrid.pinnedRow();

    dataFields.forEach((item, index) => {
      let data = [
        "key",
        "scheme_name",
        "major_component_name",
        "sub_component_name",
        "activity_master_name",
        "activity_master_details_name",
      ];
      if (Settings.isDataNotExistsInArray(data, item.key)) {
        sumData[item.key] = 0;
        if (rowList !== undefined && rowList?.length > 0) {
          rowList?.forEach((itm, idx) => {
            if (parseFloat(itm[item.key]) > 0) {
              sumData[item.key] += parseFloat(itm[item.key]);
            }
          });
        }
      }

      if (item.key === "activity_master_details_name") {
        sumData[item.key] = "Grand Total";
      }
    });
    result.push(sumData);

    return result;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [confrmData, setConfrmData] = useState({});
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const [, setSchemesList] = useState([]);
  // const [,setUserPer] = useState([]);
  // const [,setDistrictsList] = useState([]);
  const [rowList, setRowList] = useState([]);
  const [savedRowList, setSavedRowList] = useState([]);
  const [spin, setSpin] = useState(false);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const pinnedBottomRowData = useMemo(() => {
    return createData();
  }, [rowList]);

  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        state: user?.user_state_id,
        district: user?.user_district_id,
      };
    });

    getSchemesList();
    let st = 0;
    let dt = 0;
    if (Settings.isDistrictUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      // getDistrictsList("find", +st);
    } else if (user?.user_state_id) {
      // getDistrictsList("find", user?.user_state_id);
    }
    setSpin(true);
    // getUserPer();
  }, [user]);

  useEffect(() => {
    if (parseInt(filter.state) != 0) {
      getSavedData();
    }
  }, [filter]);

  useEffect(() => {
    const filters = JSON.parse(localStorage.getItem("filter"));
    filters && setFilter(filters);
  }, []);

  const getSavedData = () => {
    if (filter.state && user.id) {
      let oldFilter = filter;
      oldFilter.district = !!filter.district ? filter.district : "0";
      oldFilter.state_id = user.user_state_id;
      api.post(
        `api/prabandh/get-saved-data-spill`,
        {
          ...oldFilter,
        },
        (res) => {
          if (res.data.length) {
            let parsedData = JSON.parse(
              JSON.stringify(res.data),
              (key, value) => {
                if (!isNaN(value)) {
                  return Number(value);
                }
                return value;
              }
            );
            setRowList([...parsedData]);
            setSavedRowList(JSON.parse(JSON.stringify(parsedData)));
            setSpin(false);
          }
        }
      );
    }
  };

  // const getUserPer = () => {
  //   api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
  //     // setUserPer(res.data);
  //   });
  // };

  const getSchemesList = () => {
    setSpin(true);
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      // setSchemesList(res.data);
      setSpin(false);
    });
  };

  // const getDistrictsList = (method, state_id = 0) => {
  //   const endpoint = state_id === 0 ? "list" : "find";
  //   const data = state_id === 0 ? null : { district_state_id: state_id };

  //   setSpin(true);
  //   api[method === "list" ? "get" : "post"](
  //     `api/districts/${endpoint}`,
  //     data,
  //     (res) => {
  //       // setDistrictsList(res.data);
  //       setSpin(false);
  //     }
  //   );
  // };

  const exportTableToExcel = () => {
    let reportRelatedData = {
      columns: SpillOverHeaders.spillOverExcelHeadersArray(),
      reportData: savedRowList,
      fileName: "Spillover",
      sheetName: "Sheet 1",
    };
    exportToExcel("spillOverReport", reportRelatedData);
  };

  const undoValues = (val1, val2) => {
    if (val1 != val2) {
      return val2;
    } else {
      return val1;
    }
  };

  const saveRow = (obj, idx) => {
    let tempData = JSON.parse(JSON.stringify(savedRowList));
    if (
      +obj?.fresh_approval_physical_quantity <
      +obj?.exp_against_fresh_app_phy_ip +
        +obj?.exp_against_fresh_app_phy_ns +
        +obj?.exp_against_fresh_app_phy_c
    ) {
      obj.fresh_approval_physical_quantity = undoValues(
        +obj?.fresh_approval_physical_quantity,
        +savedRowList[idx]?.fresh_approval_physical_quantity
      );
      obj.exp_against_fresh_app_phy_ip = undoValues(
        +obj?.exp_against_fresh_app_phy_ip,
        +savedRowList[idx]?.exp_against_fresh_app_phy_ip
      );
      obj.exp_against_fresh_app_phy_ns = undoValues(
        +obj?.exp_against_fresh_app_phy_ns,
        +savedRowList[idx]?.exp_against_fresh_app_phy_ns
      );
      obj.exp_against_fresh_app_phy_c = undoValues(
        +obj?.exp_against_fresh_app_phy_c,
        +savedRowList[idx]?.exp_against_fresh_app_phy_c
      );
      tempData[idx] = obj;

      setRowList(tempData);
      sweetAlert.warning(
        `The physical expenditure quantity should not be exceed the approved physical quantity.`
      );
    } else if (
      +obj?.fresh_approval_financial_amount < +obj?.exp_against_fresh_app_fin
    ) {
      obj.fresh_approval_financial_amount = undoValues(
        +obj?.fresh_approval_financial_amount,
        +savedRowList[idx]?.fresh_approval_financial_amount
      );
      obj.exp_against_fresh_app_fin = undoValues(
        +obj?.exp_against_fresh_app_fin,
        +savedRowList[idx]?.exp_against_fresh_app_fin
      );

      tempData[idx] = obj;

      setRowList(tempData);
      sweetAlert.warning(
        `The amount of financial expenditure should not exceed the approved fiancial amount.`
      );
    } else if (
      +obj?.physical_quantity_cummu_inception <
      +obj?.physical_quantity_progress_progress_inception +
        +obj?.physical_quantity_progress_notstart_inception +
        +obj?.physical_quantity_progress_complete_inception
    ) {
      obj.physical_quantity_cummu_inception = undoValues(
        +obj?.physical_quantity_cummu_inception,
        +savedRowList[idx]?.physical_quantity_cummu_inception
      );
      obj.physical_quantity_progress_progress_inception = undoValues(
        +obj?.physical_quantity_progress_progress_inception,
        +savedRowList[idx]?.physical_quantity_progress_progress_inception
      );
      obj.physical_quantity_progress_notstart_inception = undoValues(
        +obj?.physical_quantity_progress_notstart_inception,
        +savedRowList[idx]?.physical_quantity_progress_notstart_inception
      );
      obj.physical_quantity_progress_complete_inception = undoValues(
        +obj?.physical_quantity_progress_complete_inception,
        +savedRowList[idx]?.physical_quantity_progress_complete_inception
      );
      tempData[idx] = obj;

      setRowList(tempData);

      sweetAlert.warning(
        `The physical spillover expenditure quantity should not be exceed the approved cumulative spillover physical quantity.`
      );
    } else if (
      +obj?.financial_amount_cummu_inception <
      +obj?.financial_amount_progress_inception
    ) {
      obj.financial_amount_cummu_inception = undoValues(
        +obj?.financial_amount_cummu_inception,
        +savedRowList[idx]?.financial_amount_cummu_inception
      );
      obj.financial_amount_progress_inception = undoValues(
        +obj?.financial_amount_progress_inception,
        +savedRowList[idx]?.financial_amount_progress_inception
      );

      tempData[idx] = obj;

      setRowList(tempData);
      sweetAlert.warning(
        `The amount of financial spillover expenditure should not exceed the approved cumulative fiancial spillover amount.`
      );
    } else {
      setSpin(true);
      api.post("api/prabandh/saveform-spill", obj, (res) => {
        setRowList((prevState) => {
          delete prevState[idx].edit;
          sweetAlert.done({ msg: `Data saved successfully.` });
          getSavedData();
          //  return [...prevState];
        });
        setSpin(false);
      });
    }
  };

  const [gridHeaders, setGridHeaders] = useState([]);

  useEffect(() => {
    if (rowList && rowList?.length > 0) {
      SpillOverGrid.headers(
        saveRow,
        rowList[0]?.status !== 1 ? true : false
      ).then((res) => setGridHeaders(res));
    }
  }, [rowList]);

  const handleGeneratePdf = async () => {
    let thead = SpillOverPDFHeaders.headers();
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        `${REACT_APP_URL}api/download/pdf/report`,
        {
          filter: { state_id: filter.state, ...filter },
          name: "spillover",
          heading: "Spillover",
          thead,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`,
          },
        }
      );
      setPdfbtnStatus(false);
      if (response) {
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
        link.setAttribute("download", `Spillover_2024-2025_${datetime}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const freezeAll = () => {
    setSpin(true);
    api.post(
      "api/prabandh/freeze-spillover-data",
      { state_id: user?.user_state_id },
      (res) => {
        sweetAlert.done({ msg: `Data frozen successfully.` });
        getSavedData();
        setSpin(false);
      }
    );
  };

  return (
    <div className="dashboard-main-content">
      {isOpen && (
        <ConfirmationDialog
          onConfirm={(e) => {
            setIsOpen(false);
            confrmData.callBack();
          }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={confrmData.title}
          text={confrmData.text}
        />
      )}
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>Spill Over</h1>
        <button
          type="button"
          className="btn btn-danger float-end"
          disabled={rowList?.length ? (pdfbtnStatus ? true : false) : true}
          onClick={handleGeneratePdf}
        >
          {pdfbtnStatus ? <Btnloader /> : ""}{" "}
          <i className="bi bi-file-earmark-pdf"></i>{" "}
          <span className="mobile-hide">Export To</span> PDF
        </button>
        <button
          type="button"
          className="btn btn-success float-end mx-2"
          onClick={exportTableToExcel}
        >
          <i className="bi bi-file-earmark-excel"></i>{" "}
          <span className="mobile-hide">Export To</span> Excel
        </button>
      </div>

      <div
        className="dashboard-main-content-info"
        style={{ textAlign: "center", minHeight: "700px" }}
      >
        {spin ? (
          <Spinner />
        ) : rowList?.length === 0 ? (
          <h3>No Data Found</h3>
        ) : (
          <>
            {rowList?.length > 0 && (
              <Fragment>
                <div style={gridStyle} className={"ag-theme-alpine AS"}>
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={gridHeaders}
                    rowData={rowList}
                    animateRows={true}
                    defaultColDef={defaultColDef}
                    checkboxSelection={true}
                    suppressRowClickSelection={true}
                    rowSelection={"single"}
                    pagination={false}
                    paginationAutoPageSize={false}
                    pinnedBottomRowData={pinnedBottomRowData}
                  />
                </div>
              </Fragment>
            )}

            <div className="row mt-3">
              <div className="col-8"></div>
              <div className="col-4">
                {rowList && +rowList[0].status < 2 && (
                  <button
                    type="button"
                    className="btn btn-success float-end"
                    onClick={freezeAll}
                  >
                    Freeze All
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Spillover;
