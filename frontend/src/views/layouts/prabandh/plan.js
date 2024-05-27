import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Features from "../../../redux/features";
import "../../../App.css";
import api from "../../../apps/utilities/api";
import { Modal } from "../../../apps/components/elements";
import { Helper } from "../../../apps";
import $ from "jquery";
import ConfirmationDialog from "../../../apps/components/form/ConfirmationDialog";
import sweetAlert from "../../../apps/utilities/sweetalert";

const Plan = (props) => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const [scheme, setScheme] = useState("");
  const [, setMajorComponenet] = useState("");
  const [majorComponenetLabel, setMajorComponenetLabel] = useState("");
  const [isPlanApproved, setIsPlanApproved] = useState(false);
  const { year } = useSelector((state) => state.year);
  const { version } = useSelector((state) => state.version);
  const [activeSC, setActiveSC] = useState({
    global_code: null,
    id: null,
    major_component_id: null,
    major_component_name: null,
    prb_major_component_id: null,
    scheme_id: null,
    scheme_name: null,
    serial_order: null,
    status: null,
    sub_component_id: null,
    sub_title: "",
    subcomponentuniqueid: null,
    title: "",
    unique_code: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeAM, setActiveAM] = useState(0);
  const [fieldsArray, setFieldsArray] = useState([]);
  const [,setUpdateStatus] = useState({ id: null, type: null });
  const [checkFinalSubmit, setCheckFinalSubmit] = useState(0);
  const [subComponentList, setSubComponenetList] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    data: [],
  });
  const [activityMasterList, setActivityMasterList] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    subcomponentid: 0,
    data: [],
  });
  const [activityMasterDetailsList, setActivityMasterDetailsList] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    subcomponentid: 0,
    activitymasterid: 0,
    data: [],
  });
  const [selected, setSelected] = useState();
  const not_selected_plans =
    activityMasterDetailsList &&
    activityMasterDetailsList?.data?.filter((v) => v.final_submit !== 2);
  const btn_dis =
    activityMasterDetailsList &&
    activityMasterDetailsList?.data?.length - not_selected_plans.length <
    selected;
  useEffect(() => {
    dispatch(Features.hideModal());
    setMajorComponenet(props?.subComponent?.prb_major_component_id);
    if (props?.schemeId !== undefined) {
      api.post(
        "api/prabandh/sub-components",
        {
          schemeid: props?.schemeId,
          majorcomponentid: props?.subComponent?.prb_major_component_id,
        },
        (res) => {
          setScheme(res.data[0].scheme_name);
          setMajorComponenetLabel(res.data[0].major_component_name);
          setSubComponenetList({
            schemeid: props?.schemeId,
            majorcomponentid: props?.subComponent?.prb_major_component_id,
            data: res.data,
          });
          if (res.data.length > 0) {
            activeSubComponent(res.data[0], 0);
          }
          setActiveTab(0);
          setActiveAM(0);
          setFieldsArray([]);
          setUpdateStatus({ id: null, type: null });
          setCheckFinalSubmit(0);
        }
      );
    } else {
      const dt = JSON.parse(localStorage.getItem("subcomponent_config"));
      api.post(
        "api/prabandh/sub-components",
        {
          schemeid: dt?.schemeId,
          majorcomponentid: dt?.subComponent?.prb_major_component_id,
        },
        (res) => {
          setScheme(res?.data[0].scheme_name);
          setMajorComponenetLabel(res.data[0].major_component_name);
          setSubComponenetList({
            schemeid: dt?.schemeId,
            majorcomponentid: dt?.subComponent?.prb_major_component_id,
            data: res.data,
          });
          if (res.data.length > 0) {
            activeSubComponent(res?.data[0], 0);
          }
          setActiveTab(0);
          setActiveAM(0);
          setFieldsArray([]);
          setUpdateStatus({ id: null, type: null });
          setCheckFinalSubmit(0);
        }
      );
    }
  }, [props]);

  const activeSubComponent = (s, i) => {
    setActiveSC(s);
    setActiveTab(i);
    const dt = JSON.parse(localStorage.getItem("subcomponent_config"));
    api.post(
      "api/prabandh/activity-master",
      {
        schemeid: props?.schemeId || dt?.schemeId,
        majorcomponentid:
          props?.subComponent?.prb_major_component_id ||
          dt.subComponent?.prb_major_component_id,
        subcomponentid: s?.subcomponentuniqueid,
        year: year,
        version: version,
        state_id: user.user_state_id,
        district_id: user.user_district_id,
      },
      (res) => {
        setIsPlanApproved(res.is_approved);
        setActivityMasterList({
          schemeid: props?.schemeId || dt.schemeId,
          majorcomponentid:
            props?.subComponent?.prb_major_component_id ||
            dt.subComponent?.prb_major_component_id,
          subcomponentid: s?.subcomponentuniqueid,
          data: res.data,
        });
      }
    );
  };

  const activeityMasterDetails = (amObj) => {
    api.post(
      "api/prabandh/activity-master-details",
      {
        schemeid: amObj.scheme_id,
        majorcomponentid: amObj.major_component_id,
        subcomponentid: amObj.sub_component_id,
        activitymasterid: amObj.activity_master_id,
        year: year,
        version: version,
        state_id: user.user_state_id,
        district_id: user.user_district_id,
        role: user.user_role_id,
      },
      (res) => {
        const rr = res.data
          .filter((r) => r.final_submit !== 0)
          .map((r) => {
            return {
              id: r.amdid,
              type: "add",
              scheme_id: amObj.scheme_id,
              major_component_id: amObj.major_component_id,
              sub_component_id: amObj.sub_component_id,
              activity_master_id: amObj.activity_master_id,
              activity_master_detail_id: r.activity_detail_id,
            };
          });
        const ss = res.data.filter((s) => s.final_submit === 2);
        setCheckFinalSubmit(ss.length);
        setFieldsArray(rr);
        setSelected(rr.length);

        setActivityMasterDetailsList({
          schemeid: amObj.scheme_id,
          majorcomponentid: amObj.major_component_id,
          subcomponentid: amObj.sub_component_id,
          activitymasterid: amObj.activity_master_id,
          data: res.data,
        });
      }
    );
  };

  const openModal = (amObj) => {
    setActivityMasterDetailsList({
      schemeid: 0,
      majorcomponentid: 0,
      subcomponentid: 0,
      activitymasterid: 0,
      data: [],
    });

    setActiveAM(amObj);
    setFieldsArray([]);
    setCheckFinalSubmit(0);
    activeityMasterDetails(amObj);
    dispatch(
      Features.showModal({
        title: `${amObj.activity_master_name !== ""
          ? amObj.activity_master_name
          : "Activity Master Details"
          }`,
        btntext: "Select",
      })
    );
  };

  const saveCampaignFields = (e, type) => {
    if (fieldsArray.length > 0) {
      let updated_by = null;
      if (Helper.simulationData() !== null) {
        updated_by =
          Helper.simulationData().local?.userData?.user_state_id || null;
      }
      api.post(
        "api/prabandh/set-plan",
        {
          fields: fieldsArray,
          year: year,
          version: version,
          status: 0,
          created_by: user.id,
          updated_by: updated_by,
          state_id: user.user_state_id,
          district_id: user.user_district_id,
          type: type,
        },
        (res) => {
          if (res.message) {
            dispatch(
              Features.showToast({
                message: `${type === "FS"
                  ? "Plan Saved Successfully"
                  : "Draft Saved Successfully"
                  }`,
                flag: `${type === "FS" ? "bg-success" : "bg-success"}`,
              })
            );
            dispatch(Features.hideModal());
            setTimeout(() => {
              setUpdateStatus({ id: activeAM, type: type });
              activeSubComponent(activeSC, activeTab);
            }, 500);
          } else {
            dispatch(
              Features.showToast({
                message: "Data not saved.",
                flag: "bg-danger",
              })
            );
          }
        }
      );
    } else {
      dispatch(
        Features.showToast({
          message: "Kindly select at least one field",
          flag: "bg-danger",
        })
      );
    }
  };

  const pushValues = (evt, obj) => {
    let defaultObj = {
      id: obj.amdid,
      type: "add",
      scheme_id: obj.scheme_id,
      major_component_id: obj.major_component_id,
      sub_component_id: obj.sub_component_id,
      activity_master_id: obj.activity_master_id,
      activity_master_detail_id: obj.activity_detail_id,
    };
    const index = fieldsArray.findIndex((c) => c.id === obj.amdid);
    if (index === -1) {
      defaultObj.type = "add";
      setFieldsArray([...fieldsArray, defaultObj]);
      setSelected(selected + 1);
    } else {
      if (fieldsArray[index]["type"] === "add") {
        setSelected(selected - 1);
        defaultObj.type = "delete";
        const data = [...fieldsArray]
        data.splice(index, 1, defaultObj);
        setFieldsArray(data);
      } else {
        setSelected(selected + 1);
        const data = [...fieldsArray]
        data.splice(index, 1, defaultObj);
        setFieldsArray(data);
      }
    }
    // if (evt.target.checked) {
    //   defaultObj.type = "add";
    //   setFieldsArray([...fieldsArray, defaultObj]);
    //   setSelected(selected + 1);
    // } else {
    //   setSelected(selected - 1);
    //   const array = fieldsArray.filter((item) => item.id !== obj.unique_code);
    //   defaultObj.type = "delete";

    //   setFieldsArray([...array, defaultObj]);
    // }
  };
  const doReset = () => {
    const updated = fieldsArray.map(c => { return { ...c, type: "delete" } })
    setFieldsArray(updated);
    $("input[type='checkbox']").each(function ($this) {
      $("input[type='checkbox']")[$this].checked = false;
    });
  };

  const setStatus = (arr) => {
    return arr.final_submit === 3 ? (
      <button className="t-status-btn approved">Approved</button>
    ) : arr.final_submit === 2 ? (
      <button className="t-status-btn waiting">Finalized</button>
    ) : arr.final_submit === 1 ? (
      <button className="t-status-btn in-progress">In Progress</button>
    ) : (
      <button className="t-status-btn not-initiated">Not Initiated</button>
    );
  };
  return (
    <div className="dashboard-main-content position-relative">
      {scheme ? (
        <>
          <div className="row">
            <div className="">
              <div className="dashboard-main-content__header ">
                <h1>Integrated Scheme of School Education</h1>
              </div>

              <nav aria-label="breadcrumb" className="mt-1">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">{scheme}</a>
                  </li>
                  <li className="breadcrumb-item">{majorComponenetLabel}</li>
                </ol>
              </nav>

              <span className="plan-status">
                {isPlanApproved && "APPROVED"}
              </span>

              <div className="dashboard-main-content-info">
                <div className="row">
                  <div className="col-sm-3 col-lg-4 col-xl-3">
                    <div
                      className="nav flex-column nav-pills me-2 mb-3 left-section-pc"
                      id="v-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      {subComponentList?.data?.map((sc, idx) => {
                        return (
                          <button
                            key={`scl_${idx + 1}`}
                            className={`nav-link ${idx === 0 && "activre active"
                              }`}
                            style={{
                              border: "1px solid #ccc",
                              height: "65px",
                              borderRadius: "unset",
                            }}
                            id={`v-pills-${sc.subcomponentuniqueid}-tab`}
                            data-bs-toggle="pill"
                            data-bs-target={`#v-pills-${sc.subcomponentuniqueid}`}
                            type="button"
                            role="tab"
                            aria-controls={`v-pills-${sc.subcomponentuniqueid}`}
                            aria-selected="true"
                            onClick={() => {
                              if (sc?.for_state === 0) {
                                sweetAlert.warning(
                                  "Access denied, for District User"
                                );
                              }
                              activeSubComponent(sc, idx);
                            }}
                          >
                            ({idx + 1}) {sc.sub_title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-sm-9 col-lg-8 col-xl-9">
                    <div
                      className="tab-content"
                      id="v-pills-tabContent"
                      style={{ width: "100%" }}
                    >
                      {/* {subComponentList?.data?.map((sc, idx) => {
                        return ( */}
                      <div
                        className="tab-pane fade active show"
                        // id={`v-pills-${sc.subcomponentuniqueid}`}
                        role="tabpanel"
                      // aria-labelledby={`v-pills-${sc.subcomponentuniqueid}-tab`}
                      >
                        <div className="table-responsive">
                          <table className="table table-bordered tableb table-sm table-hover">
                            <thead>
                              <tr rowSpan="1">
                                <th
                                  colSpan="5"
                                  className="text-center font-size-16"
                                >
                                  {activeSC.sub_title}
                                </th>
                              </tr>
                              <tr>
                                <th>S.No</th>
                                <th>Activity</th>
                                <th className="d-none">Applicable</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityMasterList?.data?.map((aml, idxx) => {
                                return (
                                  <tr key={`aml_${idxx}`}>
                                    <td>{idxx + 1}</td>
                                    <td>{aml.activity_master_name}</td>
                                    <td className="d-none">Yes</td>
                                    <td>{setStatus(aml)}</td>
                                    <td>
                                      {!isPlanApproved ? (
                                        <span onClick={() => openModal(aml)}>
                                          <i className="bi bi-pencil-square"></i>
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* ); */}
                      {/* })} */}
                    </div>
                  </div>
                </div>
                {/* <div className="d-flex align-items-start">
                  
                  
                </div> */}
              </div>
            </div>
          </div>
          {!!activeAM && (
            <Modal close={() => setActiveAM(0)}>
              <div className="row p-3 modal-scroll">
                <table className="table table-compact table-bordered">
                  <tbody>
                    {activityMasterDetailsList?.data?.map((amd, idx) => {
                      return (
                        <Fragment>
                          <tr key={`amd_${idx}`}>
                            <td style={{ textAlign: "left" }} width="80%">
                              <strong>{`${idx + 1} - `}</strong>
                              {amd.activity_master_details_name ||
                                "Not Defined"}
                            </td>
                            <td width="20%">
                              <input
                                type="checkbox"
                                id={`amd_${amd.activity_master_id}`}
                                value={amd.activity_master_id}
                                defaultChecked={amd.final_submit !== 0}
                                /* disabled={checkFinalSubmit !== 0} */
                                disabled={amd.final_submit === 2 ? true : false}
                                onChange={(e) => pushValues(e, amd)}
                              />
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="row p-3 cfr">
                {checkFinalSubmit === 0 && (
                  <Fragment>
                    <button className="btn btn-danger cbr" onClick={doReset}>
                      Reset
                    </button>

                    <button
                      className="btn btn-success cbsd cbr"
                      onClick={(e) => saveCampaignFields(e, "S")}
                    >
                      Save Draft
                    </button>
                  </Fragment>
                )}
                {isPlanApproved === false && (
                  <button
                    className="btn btn-success cbfs cbr"
                    onClick={(e) => setIsOpen(true)}
                    disabled={btn_dis ? false : true}
                  >
                    Submit
                  </button>
                )}
              </div>

              {isOpen && (
                <ConfirmationDialog
                  onConfirm={(e) => {
                    setIsOpen(false);
                    saveCampaignFields(e, "FS");
                  }}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  title={"Confirmation"}
                  text={
                    "Your selected plan configuration is ready for saving.<br/><br/>Are you sure you wish to proceed and finalize the submission?"
                  }
                />
              )}
            </Modal>
          )}
        </>
      ) : (
        <div className="dashboard-main-content__header mb-3 w-100">
          <h1>Select Any Scheme</h1>
        </div>
      )}
    </div>
  );
};
export default Plan;
