import { useEffect, useState, lazy, Fragment } from "react";
import { Helper, Settings, Model, API } from "../../../apps";
import Features from "../../../redux/features";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../../../apps/components/elements";
import PlanConfirmationDialog from "../../../apps/components/form/ConfirmPlanSubmissionDialog";
import sweetAlert from "../../../apps/utilities/sweetalert";
import { APP_ENVIRONMENT } from "../../../env";
import exportToExcel from "../reports/ExportReports/ExcelReports";

const View = lazy(() => import("../reports/viewReport"));

const Simulate = (props) => {
  const user = Helper.auth.user;
  const [usersList, setUsersList] = useState(0);
  const [loadstate, setLoadstate] = useState(false);
  const dispatch = useDispatch();
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState();
  const reduxObj = useSelector((state) => state.modal);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [saveAction, setSaveAction] = useState(0);
  const [setDisplayAction] = useState(0);
  const [modal_header_name, setModal_header_name] = useState("");
  const [localUserObj, setLocalUserObj] = useState(() => JSON.parse(localStorage.getItem("userData")).user?.state_ids?.map((s) => s.id) || []);
  const planStatusObj = Model.planStatus;

  useEffect(() => {
    getDistrictsList(user?.user_state_id || 0);
  }, [refresh]);

  useEffect(() => {
    if (Object.keys(props).length > 0) {
      if (props?.reportType?.report === "excel") {
        exportDistrictProgressReportToExcel();
      }
    }
  }, [props]);

  const getDistrictsList = (state_id = 0) => {
    setLoadstate(true)
    API.post(
      `api/admin-users/find-user-by-role`,
      {
        user_role_id: 8,
        user_state_id: user.user_state_id,
        role: user?.user_role_id,
        user_id: user?.id
      },
      (res) => {
        setLoadstate(false);
        setUsersList(res.data);
      }
    );
  };

  // const allowEqualityCheck = (obj1, obj2) => {
  //   const keys1 = Object.keys(obj1);
  //   const keys2 = Object.keys(obj2);
  //   if (keys1.length !== keys2.length) {
  //     return false;
  //   }
  //   for (const key of keys1) {
  //     if (obj1[key] !== obj2[key]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  const simulateAction = (userObject = {}) => {
    const currentUserJSON = {
      local: {
        userData: user,
      },
      session: {
        token: Helper.token(),
      },
    };
    userObject.type = "mobile";
    userObject.flag = "admin";
    API.post("auth/user/simulate", userObject, (res) => {
      Helper.storeToken(res);
      localStorage.setItem(
        "impersonate",
        window.btoa(JSON.stringify(currentUserJSON))
      );
      // window.alert("Simulation Activated");
      // window.location.href = "/auth/admin";
      sweetAlert.simulate({
        msg: "Simulation Activated",
        yesBtnText: "Ok",
        noBtnText: "",
        url: "",
        callback: "",
        redirect:
          (APP_ENVIRONMENT === "testing" ? "/testing" : "") + "/auth/admin",
      });
    });
  };

  const handleSave = (e) => {
    API.post(
      "api/prabandh/save-plan-status-details",
      {
        state_id: stateID,
        district_id: districtID,
        user_id: user.id,
        user_role_id: user.user_role_id,
        plan_status_id: saveAction,
        plan_session_id: 1,
        plan_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1
          }`,
        user_remarks: e,
      },
      (res) => {
        API.post(
          "api/prabandh/submit-plan",
          {
            district_id: districtID,
            status: saveAction,
            plan_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1
              }`,
            user_state_id: user?.user_state_id,
          },
          (res) => {
            setRefresh(new Date().getMilliseconds());
          }
        );
      }
    );
  };

  const exportDistrictProgressReportToExcel = async () => {
    exportToExcel("progressReport", {
      reportData: usersList,
      planStatusObj: planStatusObj,
      fileName: "State_district_wise_progress",
      sheetName: "Sheet 1",
    });
  };

  return (
    <div className={Object.keys(props).length > 0 ? "" : "dashboard-main-content"}>
      {Object.keys(props).length === 0 && (
        <div className="dashboard-main-content__header mb-3">
          <h1>District Plan Submission Status</h1>
        </div>
      )}

      <div className="dashboard-main-content-info scroll-Y margin-top-55 dashboard-main-content-info-max-height">
        {/* {auth?.user?.user_role_id===1 ?  */}
        <div className="accordion contribute-page" id="accordionExample">
          {loadstate ?
            <div className="text-center">
              <h5>Loading... </h5>
            </div> : usersList && usersList.length > 0 ? (
              usersList.map((d, idx) => {
                return (
                  <Fragment>
                    {Settings.isNotNationalUser() ? (
                      <div className="accordion-item" key={idx}>
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed d-flex justify-content-between" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne${idx}`}
                            aria-expanded="true" aria-controls={`collapseOne${idx}`}
                          >
                            {d.state_name && (
                              <>
                                STATE:{" "}
                                <span style={{ color: "blue" }}>
                                  {" "}
                                  {d.state_name?.toUpperCase()} &nbsp;
                                </span>{" "}
                              </>
                            )}
                            {d.districts && (<> | DISTRICTS: {d.districts.length}</>)}{" "}
                            (Approved: {d.districts.filter((district) => district?.status === 6 || district?.status === 9).length}
                            , Pending: {d.districts.filter((district) => district?.status < 6).length}
                            )
                            {d.min && (
                              <>
                                {" "}
                                | STATUS:{" "}
                                <span style={{ color: "blue" }}>
                                  {+d.min === 6
                                    ? "STATE Coordinator APPROVED"
                                    : "STATE PENDING"}{" "}
                                </span>
                              </>
                            )}
                          </button>
                        </h2>

                        <div id={`collapseOne${idx}`} className={`accordion-collapse collapse ${usersList.length === 1 && "show"}`} data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <div className="table-responsive">
                              <table className="table table-bordered text-start mb-4" id="demoDT">
                                <tbody>
                                  {d.districts.map((district, dId) => {
                                    return (
                                      <tr key={dId}>
                                        <td width="60px" className="text-start">
                                          <h6 className="mb-0">{dId + 1}</h6>
                                        </td>
                                        <td className="text-start">
                                          <h6 className="mb-0">
                                            {district.district_name}{" "}
                                          </h6>
                                        </td>
                                        <td className="text-end">
                                          {planStatusObj[district?.status]}
                                        </td>
                                        {Settings.isStateApproverUser() && (
                                          <td className="text-end">
                                            {district?.status === 3 && (
                                              <small>
                                                <button
                                                  className="btn btn-sm btn-success"
                                                  onClick={(e) => {
                                                    setModal_header_name("Approve District Plan");
                                                    setIsOpen(true);
                                                    setStateID(district.district_state_id);
                                                    setDistrictID(district.district_id);
                                                    setSaveAction(6);
                                                    setDisplayAction(6);
                                                  }}
                                                >
                                                  <i data-bs-toggle="tooltip" title="Approve District Plan" className="bi bi-check2"></i>
                                                </button>
                                              </small>
                                            )}{" "}
                                            {district?.status === 3 && (
                                              <small>
                                                <button
                                                  className="btn btn-sm btn-danger"
                                                  onClick={(e) => {
                                                    setModal_header_name(
                                                      "Reject District Plan"
                                                    );
                                                    setIsOpen(true);
                                                    setStateID(
                                                      district.district_state_id
                                                    );
                                                    setDistrictID(
                                                      district.district_id
                                                    );
                                                    setSaveAction(2);
                                                    setDisplayAction(5);
                                                  }}
                                                >
                                                  <i
                                                    data-bs-toggle="tooltip"
                                                    title="Reject District Plan"
                                                    className="bi bi-x-circle"
                                                  ></i>
                                                </button>
                                              </small>
                                            )}{" "}
                                            &nbsp;
                                            {(district?.status === 2 ||
                                              district?.status === 3) && (
                                                <small>
                                                  <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => {
                                                      setStateID(
                                                        district.district_state_id
                                                      );
                                                      setDistrictID(
                                                        district.district_id
                                                      );
                                                      dispatch(
                                                        Features.showModal({
                                                          title: "District Report",
                                                          size: "xl",
                                                        })
                                                      );
                                                    }}
                                                  >
                                                    <i
                                                      data-bs-toggle="tooltip"
                                                      title="View District Plan"
                                                      className="bi bi-eye"
                                                    ></i>
                                                  </button>
                                                </small>
                                              )}
                                          </td>
                                        )}
                                        {Settings.isStateApproverUser() && (
                                          <td className="text-end">
                                            {Settings.districtStatus(
                                              district?.status
                                            ) &&
                                              district?.user_object != null && (
                                                <small>
                                                  <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() =>
                                                      simulateAction(
                                                        district?.user_object
                                                      )
                                                    }
                                                  >
                                                    Simulate
                                                  </button>
                                                </small>
                                              )}
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ((+user?.user_role_id === 1 || +user?.user_role_id === 2 || +user?.user_role_id === 3 || +user?.user_role_id === 15) ||
                        (localUserObj && Settings.checkStateId(localUserObj, d.state_id))) && (
                        <div className="accordion-item ps-0 pe-0" style={{ overflow: "hidden" }} key={idx}>
                          <h2 className="accordion-header">
                            <button className="accordion-button progress_status_accordion collapsed"
                              style={{backgroundColor: `${+d.min === 6 ? "#f2fff2" : "#fff9e7"}`}}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapseOne${idx}`}
                              aria-expanded="true"
                              aria-controls={`collapseOne${idx}`}
                            >
                              <div className="d-flex justify-content-between w-100">
                                <div>
                                  {d.state_name && (
                                    <>
                                    STATE:{" "}<span style={{ color: "blue" }}>{" "}{d.state_name?.toUpperCase()} &nbsp;</span>{" "}
                                    </>
                                  )}
                                  {d.districts && (<> | DISTRICTS: {d.districts.length}</>)}{" "}
                                  (Approved: {d.districts.filter((district) => district?.status === 6 || district?.status === 9).length}
                                  , Pending: {d.districts.filter((district) => district?.status < 6).length})
                                </div>

                                <div>
                                  {d.min && (
                                    <>
                                      <span className="progress_Status">
                                        {" "}
                                        STATUS:{" "}
                                        <label>
                                          {+d?.min === 6
                                            ? <><span className="progress_status_color_approved">STATE APPROVED</span> | <span className={+d?.pab_minute_status===1 ? "progress_status_color_approved" : "progress_status_color_pending"}>{+d?.pab_minute_status===1 ? "STATE Coordinator APPROVED" : "STATE Coordinator PENDING"}</span></>
                                            : <span className={"progress_status_color_pending"}>STATE PENDING</span>}
                                        </label>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </button>
                          </h2>

                          <div id={`collapseOne${idx}`} className={`accordion-collapse collapse ${usersList.length === 1 && "show"}`} data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                              <div className="table-responsive">
                                <table className="table table-bordered text-start mb-4" id="demoDT">
                                  <tbody>
                                    {d.districts.map((district, dId) => {
                                      return (
                                        <tr key={dId}>
                                          <td width="60px" className="text-start">
                                            <h6 className="mb-0">{dId + 1}</h6>
                                          </td>
                                          <td className="text-start">
                                            <h6 className="mb-0">
                                              {district.district_name}{" "}
                                            </h6>
                                          </td>
                                          <td className="text-end">
                                            {planStatusObj[district?.status]}
                                          </td>
                                          {Settings.isStateApproverUser() && (
                                            <td className="text-end">
                                              {district?.status === 3 && (
                                                <small>
                                                  <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={(e) => {
                                                      setModal_header_name("Approve District Plan");
                                                      setIsOpen(true);
                                                      setStateID(district.district_state_id);
                                                      setDistrictID(district.district_id);
                                                      setSaveAction(6);
                                                      setDisplayAction(6);
                                                    }}
                                                  >
                                                    <i data-bs-toggle="tooltip" title="Approve District Plan" className="bi bi-check2"></i>
                                                  </button>
                                                </small>
                                              )}{" "}
                                              {district?.status === 3 && (
                                                <small>
                                                  <button className="btn btn-sm btn-danger"
                                                    onClick={(e) => {
                                                      setModal_header_name("Reject District Plan");
                                                      setIsOpen(true);
                                                      setStateID(district.district_state_id);
                                                      setDistrictID(district.district_id);
                                                      setSaveAction(2);
                                                      setDisplayAction(5);
                                                    }}
                                                  >
                                                    <i data-bs-toggle="tooltip" title="Reject District Plan" className="bi bi-x-circle"></i>
                                                  </button>
                                                </small>
                                              )}{" "}
                                              &nbsp;
                                              {(district?.status === 2 || district?.status === 3) && (
                                                  <small>
                                                    <button className="btn btn-sm btn-primary" 
                                                    onClick={() => {
                                                        setStateID(district.district_state_id);
                                                        setDistrictID(district.district_id);
                                                        dispatch(
                                                          Features.showModal({
                                                            title: "District Report",
                                                            size: "xl",
                                                          })
                                                        );
                                                      }}
                                                    >
                                                      <i data-bs-toggle="tooltip" title="View District Plan" className="bi bi-eye"></i>
                                                    </button>
                                                  </small>
                                                )}
                                            </td>
                                          )}
                                          {Settings.isDistrictApproverUser() && (
                                            <td className="text-end">
                                              {Settings.districtStatus(district?.status) &&
                                                district?.user_object != null && (
                                                  <small>
                                                    <button className="btn btn-sm btn-primary"
                                                      onClick={() =>
                                                        simulateAction(district?.user_object)
                                                      }
                                                    >
                                                      Simulate
                                                    </button>
                                                  </small>
                                                )}
                                            </td>
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* <div className="accordion" id={`accordionExample1${idx}`}>

                      {d.districts.map((district, dId)=>{
                        return <div className="accordion-item" key={dId}>
                          <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne1_dist${dId}`} aria-expanded="true" aria-controls={`collapseOne1_dist${dId}`}>
                              DISTRICT: {district.district_name}
                            </button>
                          </h2>
                          <div id={`collapseOne1_dist${dId}`} className="accordion-collapse collapse" data-bs-parent={`#accordionExample1${idx}`}>
                            <div className="accordion-body p-3 pt-1">
                              <table className="table table-bordered text-start mb-0" id="demoDT">
                                <tbody>
                                  {district.district_users.map((user, uId)=>{
                                    return <tr key={uId}>
                                      <td className="text-start"><h6 className="mb-0">USER: {user.user_name} | STATUS: {user.user_status ? 'Approved' : 'Pending'} </h6></td>
                                       <td className="text-end">
                                        <small>
                                          <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => simulateAction(user)}
                                          >
                                            Simulate
                                          </button>
                                        </small>
                                      </td>
                                    </tr>
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      })}
                      
                    </div> */}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </Fragment>
                );
              })
            ) : (
              <div className="text-center">
                <h5>No data found</h5>
              </div>
            )}
        </div>
        {/* : 

        <div className="list-group">
          {usersList.length > 0 ?
            usersList.map((d, idx) => {
              return (
                <a
                  key={`usersList_${idx + 1}`}
                  href="#"
                  className="list-group-item list-group-item-action"
                  aria-current="true"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">
                      USER: {d.user_name} | DISTRICT: [
                      <span style={{ color: "blue" }}>
                        {d.district_name}
                      </span>
                      ]
                    </h6>
                    <small>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => simulateAction(d)}
                      >
                        Simulate
                      </button>
                    </small>
                  </div>
                </a>
              );
            }) : <div className="text-center"><h5>No data found</h5></div>}
        </div>} */}
        {reduxObj.view && stateID && (
          <Modal close={() => { dispatch(Features.hideModal()); }}>
            <View user_state_id={stateID} user_district_id={districtID} user_role_id={user.user_role_id} />
          </Modal>
        )}

        {isOpen && (
          <PlanConfirmationDialog
           onConfirm={(e) => {
              setIsOpen(false);
              setStateID(null);
              handleSave(e);
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={modal_header_name}
          />
        )}
      </div>
    </div>
  );
};

export default Simulate;
