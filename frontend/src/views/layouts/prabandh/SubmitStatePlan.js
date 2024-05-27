import { useState, useEffect, useMemo, useRef } from "react";
import { Helper, Settings, API } from "../../../apps";
import PlanConfirmationDialog from "../../../apps/components/form/ConfirmPlanSubmissionDialog";
// import Btnloader from "../../../apps/components/elements/Btnloader";
// import axios from "axios";
// import $ from "jquery";
// import { REACT_APP_URL } from "../../../env";
// import useAuth from "../../../apps/hooks/auth/useAuth";
import Features from "../../../redux/features";
import { useDispatch } from "react-redux";

//const ViewEditFormState = lazy(() => import("./ViewEditFormState"));

/* aggrid */
import { AgGridReact } from "ag-grid-react";

const SubmitStatePlan = (props) => {
  const user = Helper.auth.user;
  const userData = Helper.auth.user;
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [isOpen, setIsOpen] = useState(false);
  const [disableButton, setdisableButton] = useState(false);
  const [showApprovalMsg, setShowApprovalMsg] = useState(false);
  const [showDistrictApprovalMsg, setShowDistrictApprovalMsg] = useState(false);
  const [hideButton, setHideButton] = useState(true);
  const [saveAction, setSaveAction] = useState(0);
  const [stateTentPrpsd, stateStateTentPrpsd] = useState({});
  const dispatch = useDispatch();

  /* aggrid code start */
  const [stateID,] = useState(userData?.user_state_id || 0);
  const [object, setObject] = useState({});
  const [pagesize,] = useState(12);
  const getRowStyle = (params) => {
    if (+params.data.scheme_id === 555555) {
      return { background: "#ff9696" };
    } else if (+params.data.major_component_id === 666666) {
      return { background: "#f799ff" };
    } else if (+params.data.sub_component_id === 777777) {
      return { background: "#8cf0ff" };
    } else if (+params.data.activity_master_id === 888888) {
      return { background: "#f5df98" };
    } else if (+params.data.activity_master_details_id === 999999) {
      return { background: "#8cffa1" };
    }
    return null;
  };

  const [headerRows, setHeaderRows] = useState([]);
  const formatHeader = (key) => { return Helper.ucfirst(key.toLowerCase().split("_").join(" ")); };

  const configGridHeader = (dataObj) => {
    if (dataObj !== null && dataObj?.data?.fields !== undefined) {
      dataObj?.data?.fields?.forEach((itm) => {
        if (Settings.isDataNotExistsInArray(["activity_master_details_id", "scheme_id", "major_component_id", "sub_component_id", "activity_master_id"], itm.name)) {
          let rowObj = {};

          rowObj["headerName"] = itm.name === "id" ? "S.No." : formatHeader(itm.name);
          rowObj["field"] = itm.name === "id" ? null : itm.name;
          rowObj["valueGetter"] = (params) => {
            if (Settings.isDataExistsInArray(["id","scheme_name","major_component_name","sub_component_name","activity_master_name","activity_master_details_name"],itm.name)) {
              if (itm.name === "major_component_name") {
                if (+params.data.major_component_id === 666666) {
                  return `Major Component Subtotal: `;
                }
              }
              if (itm.name === "sub_component_name") {
                if (+params.data.sub_component_id === 777777) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "activity_master_name") {
                if (+params.data.activity_master_id === 888888) {
                  return `Subtotal: `;
                }
              }
              if (itm.name === "activity_master_details_name") {
                if (+params.data.activity_master_details_id === 999999) {
                  return `Subtotal: `;
                }
              }

              if (+params.data.scheme_id === 555555) {
                return `Grand Subtotal: `;
              } else {
                return params.data[itm.name];
              }
            } else {
              return params.data[itm.name];
            }
          };
          rowObj["colSpan"] = (params) => {
            if (itm.name === "scheme_name") {
              if (+params.data.scheme_id === 555555) {
                return 5;
              } else {
                return 1;
              }
            } else if (itm.name === "major_component_name") {
              if (+params.data.major_component_id === 666666) {
                return 4;
              } else {
                return 1;
              }
            } else if (itm.name === "sub_component_name") {
              if (+params.data.sub_component_id === 777777) {
                return 3;
              } else {
                return 1;
              }
            } else if (itm.name === "activity_master_name") {
              if (+params.data.activity_master_id === 888888) {
                return 2;
              } else {
                return 1;
              }
            } else {
              return 1;
            }
          };
          rowObj["width"] = itm.name === "id" ? 91 : null;
          rowObj["cellStyle"] = (params) => {
            return Settings.isDataNotExistsInArray(["id","scheme_name","major_component_name","sub_component_name","activity_master_name"], itm.name)
              ? { textAlign: "right" }
              : { textAlign: "left" };
          };
          setHeaderRows((prev) => [...prev, rowObj]);
        }
      });
    }
  };

  useEffect(() => {
    setObject({});
    API.post("api/prabandh/submit-state-plan_state-costing-sheet", { state_id: stateID, activity_group_code: user?.activity_group_code },
      (res) => {
        setObject(res);
        configGridHeader(res);
      }
    );
  }, []);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      // flex: 1,
      floatingFilter: false,
      sortable: true,
      resizable: true,
      filter: true,
    };
  }, []);

  const renderAGGrid = () => {
    if (object?.data) {
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
            pagination={false}
            paginationAutoPageSize={false}
            paginationPageSize={pagesize ? pagesize : 10}
            viewportRowModelPageSize={1}
            getRowStyle={getRowStyle}
          />
        </div>
      );
    }
  };
  /* agrid code end */

  useEffect(() => {
    getDistrictsList();
  }, [refresh]);

  useEffect(() => {
    stateTentativeProposedDetails();
  }, [user]);

  const getDistrictsList = () => {
    API.post(`api/prabandh/get-state-plan-status`,
      {
        user_role_id: 9,
        user_state_id: user?.user_state_id,
        role: user?.user_role_id,
      },
      (res) => {
        // setUsersList(res.data);

        switch (parseInt(res.data[0].get_district_status_count)) {
          case 1:
            setShowApprovalMsg(false); //  "Status : Already Approved";
            setdisableButton(true); // Button Disabled
            setShowDistrictApprovalMsg(true);
            break;

          case 2:
          case 0:
            setShowApprovalMsg(true);
            setShowDistrictApprovalMsg(false); // Status : All Districts Aren't Approved
            setdisableButton(true); // Button Disabled
            break;

          case 3:
            setShowApprovalMsg(false);
            setdisableButton(false);
            setShowDistrictApprovalMsg(false);
            break;
        }

        if (Settings.isStateApproverUser()) {
          setHideButton(false);
        } else {
          setHideButton(true);
        }
      }
    );
  };

  const stateTentativeProposedDetails = () => {
    API.post(`api/prabandh/state-tentative-proposed/${user.user_state_id}`,
      {
        user_role_id: 9,
        user_state_id: user?.user_state_id,
        role: user?.user_role_id,
      },
      (res) => {
        stateStateTentPrpsd(res.data);
      }
    );
  };

  const handleSave = (e) => {
    API.upload("api/prabandh/save-plan-status-details",
      e.district_document,
      {
        state_id: user.user_state_id,
        user_id: user.id,
        user_role_id: user.user_role_id,
        plan_status_id: saveAction,
        plan_session_id: 1,
        plan_year: `${new Date().getFullYear()}-${
          new Date().getFullYear() + 1
        }`,
        user_remarks: e.comment,
      },
      (res) => {
        API.post("api/prabandh/submit-plan",
          {
            state_id: user.user_state_id,
            status: saveAction,
            user_state_id: user?.user_state_id,
          },
          (res) => {
            setRefresh(new Date().getMilliseconds());
          }
        );
      }
    );
  };

  const percentageExceedsLimit = (stateTentPrpsd.plan_total / +stateTentPrpsd.tentative_total_estimates) * 100;
  const exceedsLimit = percentageExceedsLimit > 125;

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header row px-2 mb-3">
        <div className="col-xl-4 col-lg-4 col-sm-4">
          <h1>Submit State Plan</h1>
        </div>
        <div className="col-xl-4 col-lg-4 col-sm-4">
          {showApprovalMsg && (<h6 style={{ fontWeight: "bold" }}>Status : Already Approved</h6>)}
          {showDistrictApprovalMsg && (
            <h6 style={{ fontWeight: "bold" }}>
              Kindly approve all district plans to approve the state plan.
            </h6>
          )}
        </div>

        {/* <div className="col-xl-4 col-lg-4 col-sm-4">
          {!hideButton && !disableButton && (
            <button
              className="btn btn-success cfr"
              onClick={(e) => {
                setSaveAction(6);
                setIsOpen(true);
              }}
            >
              <i className="bi bi-save"></i> Approve
            </button>
          )} */}

        {/* {!hideButton && !disableButton && (
            <button
              className="btn btn-danger cfr mx-2"
              onClick={(e) => {
                setSaveAction(5);
                setIsOpen(true);
              }}
            >
              <i className="bi bi-x-circle"></i> Reject
            </button>
          )} */}
        {/* </div> */}

        {/* <div className="col-xl-3 col-lg-3 col-sm-3 text-end">
          <button
            type="button"
            style={{ marginRight: "1rem" }}
            className="btn btn-danger"
            disabled={pdfStatus}
            // onClick={handleGeneratePdf}
          >
            {pdfStatus ? <Btnloader /> : ''}  <i className="bi bi-file-earmark-pdf"></i> <span className="mobile-hide">Export To</span> PDFs
          </button>
        </div> */}
      </div>

      <div className="dashboard-main-content-info">
        <div className="row">
          <div className="col-12 mb-2">
            <table className="table">
              <tbody>
                <tr>
                  <th className="border" colSpan={3} style={{ textAlign: "center" }}>Tentative Proposed Release</th>
                  <th className="border" colSpan={3} style={{ textAlign: "center" }}>State Proposed Plan</th>
                  <th className="border" style={{ textAlign: "center" }}>Difference</th>
                </tr>
                <tr>
                  <td className="border">
                    <b>Central Share</b> :{" "}
                    {Helper.accountFormat(stateTentPrpsd.tentative_central_share)}
                  </td>
                  <td className="border">
                    <b>State Share</b> :{" "}
                    {Helper.accountFormat(stateTentPrpsd.tentative_state_share)}
                  </td>
                  <td className="border">
                    <b>Total</b> :{" "}
                    {Helper.accountFormat(stateTentPrpsd.tentative_central_share + stateTentPrpsd.tentative_state_share)}
                  </td>

                  <td className="border">
                    <b>Central Share</b> :{" "}
                    {Helper.accountFormat((stateTentPrpsd.plan_total * stateTentPrpsd.center_share_percent) / 100)}
                  </td>

                  <td className="border">
                    <b>State Share</b> :{" "}
                    {Helper.accountFormat((stateTentPrpsd.plan_total * (100 - stateTentPrpsd.center_share_percent)) / 100)}
                  </td>

                  <td className="border">
                    <b>Total</b> :{" "}
                    {Helper.accountFormat(stateTentPrpsd.plan_total)}
                  </td>

                  <td className="border">
                    <span style={{ fontWeight: 600 }}
                      className={`${
                        (stateTentPrpsd.plan_total /
                          (stateTentPrpsd.tentative_central_share +
                            stateTentPrpsd.tentative_state_share)) *
                          100 >
                          125 &&
                        (+userData?.user_state_id !== 113 ||
                          +userData?.user_state_id !== 117)
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {Helper.accountFormat(Math.abs(stateTentPrpsd.plan_total - (stateTentPrpsd.tentative_central_share + stateTentPrpsd.tentative_state_share)))}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {renderAGGrid()}

          {/*           <ViewEditFormState
            viewMode="read-only"
            stateRowsParent={stateRows}
          ></ViewEditFormState> */}

          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            {!hideButton && !disableButton && (
              <button className="btn btn-success cfr"
                onClick={(e) => {
                  const year =
                    document.getElementsByClassName("yearsel")[0].value;
                  if (exceedsLimit && (+userData?.user_state_id !== 113 || +userData?.user_state_id !== 117)) {
                    dispatch(
                      Features.showToast({
                        message: `Proposed demand should not exceed 1.25 times the tentative release ${year}.`,
                        flag: "bg-danger",
                      })
                    );
                  } else {
                    setSaveAction(6);
                    setIsOpen(true);
                  }
                }}
              >
                <i className="bi bi-save"></i> Approve
              </button>
            )}

            {/* {!hideButton && !disableButton && (
                <button
                  className="btn btn-danger cfr mx-2"
                  onClick={(e) => {
                    setSaveAction(5);
                    setIsOpen(true);
                  }}
                >
                  <i className="bi bi-x-circle"></i> Reject
                </button>
              )} */}

            {isOpen && (
              <PlanConfirmationDialog
                onConfirm={(e) => {
                  setIsOpen(false);
                  handleSave(e);
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={"Remarks"}
                file={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitStatePlan;