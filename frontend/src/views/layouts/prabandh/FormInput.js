import { useState, useEffect, Fragment } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Features from "../../../redux/features";
import { Modal } from "../../../apps/components/elements";
import api from "../../../apps/utilities/api";
import { Helper, Settings, Hook } from "../../../apps";
import $ from "jquery";
import AGGridSchoolConfigurator from "./School/AGGridSchoolConfigurator";

const FormInput = () => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const { year } = useSelector((state) => state.year);
  const { version } = useSelector((state) => state.version);
  const [isPlanApproved, setIsPlanApproved] = useState(false);

  const location = useLocation();
  const [initialParams, setInitialParams] = useState(() => location.state);

  const [refresh, setRefresh] = useState(new Date().getMilliseconds());

  const [activityMasterDetailsList, setActivityMasterDetailsList] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    subcomponentid: 0,
    activitymasterid: 0,
    data: [],
  });
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [blockID, setBlockID] = useState(0);
  const [formData, setFormData] = useState([{ key: null, value: {} }]);
  const [, setBlocksList] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [, setFormGlobalCode] = useState(0);
  const [activeUDISE, setActiveUDISE] = useState("");
  const [dataEntryLevel, setDataEntryLevel] = useState("");
  const [activeAMD, setActiveAMD] = useState(0);
  const [latestUpdated, setLatestUpdated] = useState("");
  useEffect(() => {
    setStateID(user.user_state_id || 0);
    setDistrictID(user.user_district_id || 0);
    //setSchoolFlag(+initialParams.ddsc);

    api.post(
      "api/prabandh/amdbdgt",
      {
        schemeid: initialParams?.sid,
        majorcomponentid: initialParams?.mcid,
        subcomponentid: initialParams?.scid,
        activitymasterid: initialParams?.amid,
        year: year,
        version: version,
        state_id: user?.user_state_id,
        district_id: user?.user_district_id,
        role: user?.user_role_id,
        type: "finalized",
      },
      (res) => {
        if (res.status) {
          setIsPlanApproved(res.is_approved);
          setLatestUpdated(res.latest_updated_at);
          setFormGlobalCode((res?.data && res?.data[0]?.form_global_code) || 0);
          setActivityMasterDetailsList({
            schemeid: initialParams?.sid,
            majorcomponentid: initialParams?.mcid,
            subcomponentid: initialParams?.scid,
            activitymasterid: initialParams?.amid,
            data: res?.data?.map((ite) => {
              // ite.unit_cost = Helper.numberFormatter(ite.unit_cost, 5);
              return ite;
            }),
          });
        }
      }
    );
    //getStateList();
    getDistrictsList("find", user?.user_state_id || 0);
    getBlocksList("find", user?.user_district_id || 0);
    setActiveUDISE("");
    setBlockID(0);

    setTimeout(() => {
      checkAutoFill();
    }, 5000);
  }, [refresh]);

  /*   useEffect(()=>{
    console.log("checking autofill");
    checkAutoFill();
  },[activityMasterDetailsList]) */

  const checkAutoFill = () => {
    let inputArray = [];
    $(".form-control-sm").each(function () {
      let val = $(this).val();
      if (val !== "") {
        //let obj = { key: "", value: {} };
        let activity_detail_id = $(this).attr("data-activity_detail_id");
        let bdgt_id = $(this).attr("data-bdgt_id");
        let id_name = $(this).attr("data-id");
        inputArray.push({
          key: activity_detail_id,
          [id_name]: val,
          id: bdgt_id,
        });
      }
    });

    const result = inputArray.reduce((acc, item) => {
      const key = item.key;
      if (!acc[key]) {
        acc[key] = {
          key: key,
          /* id: item.id, */
          value: {
            udise: activeUDISE,
            state: user.user_state_id,
            district: user.user_district_id,
            block: 0,
            activity_master_details_id: key,
            scheme_id: initialParams?.sid,
            sub_component_id: initialParams?.scid,
            major_component_id: initialParams?.mcid,
            activity_master_id: initialParams.amid,
          },
        };
      }
      Object.entries(item).forEach(([property, value]) => {
        if (property !== "key") {
          acc[key].value[property] = value;
        }
      });
      return acc;
    }, {});

    const resultArray = Object.values(result);
    setFormData(resultArray);
  };

  /*   const getStateList = () => {
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
    });
  }; */

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        setDistrictsList(res.data);
      }
    );
  };

  const getBlocksList = (method, district_id = 0) => {
    const endpoint = district_id === 0 ? "list" : "find";
    const data = district_id === 0 ? null : { block_district_id: district_id };

    api[district_id === 0 ? "get" : "post"](
      `api/blocks/${endpoint}`,
      data,
      (res) => {
        setBlocksList(res.data);
      }
    );
  };

  /*   const getSchoolsList = (block_id = 0, formGlobalCode = 0, summary = null) => {
    api.post(
      `api/schools/filter`,
      { block_id: block_id, form_global_code: formGlobalCode },
      (res) => {
        //setSchoolsList(res.data);
        //setActiveUDISE("");
      }
    );
  }; */

  const handleInput = (e, obj, index) => {
    if (e.target.maxLength > 0 && e.target.value.length > +e.target.maxLength)
      return;

    if (e.target.name === "unit_cost") {
      if (+e.target.value.split(".")[0].length > 10) {
        e.target.value = 0;
      }
    }

    let copiedData = JSON.parse(JSON.stringify(activityMasterDetailsList));

    copiedData.data[index][e.target.name] = e.target.value;

    let objIndex = formData.findIndex(
      (x) => x.key === obj.activity_master_details_id
    );

    formData[objIndex] = {
      key: obj.activity_master_details_id,
      id: obj.pawpbd_id,
      value: {
        udise: activeUDISE,
        state: user.user_state_id,
        district: user.user_district_id,
        block: blockID,
        activity_master_details_id: obj.activity_master_details_id,
        scheme_id: obj.scheme_id,
        sub_component_id: obj.sub_component_id,
        major_component_id: obj.major_component_id,
        activity_master_id: obj.activity_master_id,
        physical_quantity:
          e.target.name === "physical_quantity"
            ? e.target.value
            : copiedData?.data[index].physical_quantity
              ? copiedData?.data[index].physical_quantity
              : null,
        unit_cost:
          e.target.name === "unit_cost"
            ? e.target.value
            : copiedData?.data[index].unit_cost
              ? copiedData?.data[index].unit_cost
              : null,
        financial_amount:
          e.target.name === "financial_amount"
            ? e.target.value
            : copiedData?.data[index].financial_amount
              ? copiedData?.data[index].financial_amount
              : null,
        spillover_quantity:
          e.target.name === "spillover_quantity"
            ? e.target.value
            : copiedData?.data[index].spillover_quantity
              ? copiedData?.data[index].spillover_quantity
              : null,
        spillover_amount:
          e.target.name === "spillover_amount"
            ? e.target.value
            : copiedData?.data[index].spillover_amount
              ? copiedData?.data[index].spillover_amount
              : null,
      },
    };

    if (
      formData[objIndex].value.physical_quantity !== null &&
      formData[objIndex].value.unit_cost !== null &&
      (e.target.name === "physical_quantity" || e.target.name === "unit_cost")
    ) {
      copiedData.data[index].financial_amount = Helper.numberFormatter(
        Helper.unitCostCalculator(
          formData[objIndex].value.physical_quantity,
          formData[objIndex].value.unit_cost
        ),
        3
      );
      // setActivityMasterDetailsList(copiedData);
      formData[objIndex].value.unit_cost = copiedData.data[index].unit_cost;
    }

    setActivityMasterDetailsList(copiedData);
  };

  const saveForm = () => {
    const formDataNew = formData.map((fd) => {
      fd.value.udise = activeUDISE;
      fd.value.state = stateID;
      fd.value.district = districtID;
      fd.value.block = blockID;
      return fd;
    });

    const finalObj = formDataNew.filter((fd) => {
      fd.value.financial_amount = Helper.numberFormatter(
        fd.value.physical_quantity * fd.value.unit_cost,
        5
      );

      return fd.key !== null;
    });

    if (dataEntryLevel === "udise" && activeUDISE === "") {
      alert("kindly select school to proceed");
    } else if (dataEntryLevel === "block" && blockID === 0) {
      alert("kindly select block to proceed");
    } else if (dataEntryLevel === "district" && districtID === 0) {
      alert("kindly select district to proceed");
    } else if (dataEntryLevel === "state" && stateID === 0) {
      alert("kindly select state to proceed");
    } else {
      api.post(
        "api/prabandh/saveform",
        { data: finalObj, level: dataEntryLevel },
        (res) => {
          dispatch(
            Features.showToast({
              message: "Data saved successfully.",
              flag: "info",
            })
          );
          setTimeout(() => {
            setRefresh(new Date().getMilliseconds());
          }, 500);
        }
      );
    }
  };

  const updateDistrictsList = (e) => {
    getDistrictsList("find", e.target.value);
  };

  const updateBlockList = (e) => {
    getBlocksList("find", e.target.value);
  };

  /*   const updateSchoolList = (e) => {
    setBlockID(e.target.value);
    getSchoolsList(e.target.value, formGlobalCode);
  }; */

  const getStatus = (type) => user.user_role_id >= type;

  const openSchoolModal = (e, itm) => {
    setActiveAMD(itm);
    dispatch(
      Features.showModal({
        title: `${itm?.activity_master_name}: ${itm?.activity_master_details_name}`,
        size: "fullscreen",
        btntext: "Select",
      })
    );
  };

  /*   const searchValue = (row, key, label) => {
    const data = row;
    for (const item of data.data) {
      if (item.key === key) {
        for (const entry of item.value) {
          if (entry.label === label) {
            return entry.value;
          }
        }
      }
    }
  }; */

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <table width="100%">
          <tbody>
            <tr>
              <td width="80%">
                <h1>{initialParams?.amn}</h1>
              </td>
              <td width="20%">
                <Link
                  to="/auth/prabandh/plan/input"
                  className="btn btn-primary btn-sm"
                  style={{ display: "inline", float: "right" }}
                >
                  <i className="bi bi-arrow-left" />
                  <span className="m-2">Back</span>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="dashboard-main-content-info mb-2 mt-3"
        id="search"
        style={{ backgroundColor: "#456fbd" }}
      >
        <div className="row" style={{ width: "100%" }}>
          {activityMasterDetailsList.data &&
            +activityMasterDetailsList.data[0]?.drill_down_state === 1 && (
              <div className="col-md-2">
                <select
                  className="form-select"
                  name="state-list"
                  value={stateID}
                  onChange={updateDistrictsList}
                  disabled={getStatus(2)}
                >
                  <option value="0">Select State</option>
                  {stateList?.map((st, stidx) => (
                    <option key={`st_${stidx}`} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          {activityMasterDetailsList.data &&
            +activityMasterDetailsList.data[0]?.drill_down_district === 1 && (
              <div className="col-md-3">
                <select
                  className="form-select"
                  name="districts-list"
                  value={districtID}
                  onChange={updateBlockList}
                  disabled={getStatus(3)}
                >
                  <option value={null}>Select District</option>
                  {districtsList?.map((ds, dsidx) => (
                    <option key={`ds_${dsidx}`} value={ds.id}>
                      {ds.district_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>
      </div>

      <div
        className="dashboard-main-content-info"
        style={{ overflow: "hidden" }}
      >
        <div className="table-responsive">
          {activityMasterDetailsList?.data?.length === 0 ? (
            <h5>No Data Found: Please Check State Configuration Or Year</h5>
          ) : (
            <Fragment>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th width="3%">S.No</th>
                    <th width="57%">Sub Activity</th>
                    <th width="10%">Physical Quantity</th>
                    <th width="15%">
                      Unit Cost
                      <br />
                      (₹ In Lakhs)
                    </th>
                    <th width="15%">
                      Financial Amount
                      <br />
                      (₹ In Lakhs)
                    </th>
                    <th width="15%" className="d-none">
                      UOM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activityMasterDetailsList?.data?.map((itm, idx) => {
                    return (
                      <tr key={`amdl_${idx}`}>
                        <td>{idx + 1}</td>
                        <td>
                          <span className="cfl">
                            {itm.activity_master_details_name || "N/A"}
                          </span>
                          <span className="cfr">
                            {+itm.dd_school === 1 &&
                              (itm.scheme_name === "Teacher Education"
                                ? +itm.dd_school === 1
                                : true) && (
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={(e) => openSchoolModal(e, itm)}
                                  disabled={isPlanApproved}
                                >
                                  {+itm.number_of_school > 0 &&
                                    `(${itm.number_of_school}) `}
                                  {Settings.isNationalOrStateUser()
                                    ? "Select"
                                    : "Select Schools"}
                                </button>
                              )}
                          </span>
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm text-right-input"
                            type="text"
                            data-id="physical_quantity"
                            maxLength={9}
                            name="physical_quantity"
                            id="physical_quantity"
                            data-activity_detail_id={
                              itm.activity_master_details_id
                            }
                            data-bdgt_id={itm.id}
                            onChange={(e) => handleInput(e, itm, idx)}
                            /* onFocus={handleFocusInput} */
                            onKeyDown={(e) =>
                              Helper.validateNumberInput(e, 5, 0)
                            }
                            readOnly={
                              +itm.dd_school === 1 || isPlanApproved
                                ? true
                                : false
                            }
                            value={Math.trunc(itm.physical_quantity)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm text-right-input"
                            type="text"
                            data-id="unit_cost"
                            name="unit_cost"
                            id="unit_cost"
                            data-activity_detail_id={
                              itm.activity_master_details_id
                            }
                            data-bdgt_id={itm.id}
                            onChange={(e) => handleInput(e, itm, idx)}
                            /* onFocus={handleFocusInput} */
                            onKeyDown={(e) =>
                              Helper.validateUnitCostInput(e, 5, 5)
                            }
                            readOnly={isPlanApproved}
                            defaultValue={itm.unit_cost}
                            value={itm.unit_cost}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm text-right-input"
                            type="text"
                            data-id="financial_amount"
                            name="financial_amount"
                            data-activity_detail_id={
                              itm.activity_master_details_id
                            }
                            data-bdgt_id={itm.id}
                            readOnly={true}
                            onInput={(e) => handleInput(e, itm, idx)}
                            value={Helper.numberFormatter(
                              itm.physical_quantity * itm.unit_cost,
                              5
                            )}
                            defaultValue={Helper.numberFormatter(
                              itm.physical_quantity * itm.unit_cost,
                              5
                            )}
                          />
                        </td>
                        <td className="d-none">
                          <input
                            className="form-control form-control-sm text-right-input"
                            type="text"
                            data-id="uom"
                            name="uom"
                            data-activity_detail_id={
                              itm.activity_master_details_id
                            }
                            data-bdgt_id={itm.id}
                            onInput={(e) => handleInput(e, itm, idx)}
                            readOnly={true}
                            defaultValue={itm.uom}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={2}>Total (₹ In Lakhs)</th>
                    <th colSpan={2}></th>
                    <th>
                      {Helper.accountFormat(
                        activityMasterDetailsList?.data?.reduce(
                          (accumulator, itm) =>
                            accumulator + itm.physical_quantity * itm.unit_cost,
                          0
                        ), 5
                      )}
                    </th>
                  </tr>
                </tfoot>
              </table>
              <div>
                {latestUpdated !== "" && (
                  <div
                    className="alert alert-light"
                    role="alert"
                    style={{ display: "inline", float: "left", padding: "5px" }}
                  >
                    <i className="bi bi-clock-history" /> Last Updated:{" "}
                    {latestUpdated}
                  </div>
                )}
                {
                  /* Settings.isNotTeacher() && */ !isPlanApproved && (
                    <div className="float-end">
                      <a
                        type="button"
                        className="btn btn-success"
                        onClick={saveForm}
                      >
                        Save
                      </a>
                    </div>
                  )
                }
              </div>
            </Fragment>
          )}
        </div>
      </div>
      {!!activeAMD && (
        <Modal
          close={() => {
            setActiveAMD(0);
            /*             if (+activeAMD.number_of_school === 0) {
              sweetAlert.confirmation({
                msg: "You have not selected any school do you want to proceed.",
                yesBtnText: "OK",
                noBtnText: "Cancle",
                url: "",
                callback: () => {
                  if (+activeAMD.number_of_school === 0) {
                    return false;
                  } else {
                    setActiveAMD(0);
                    return true;
                  }
                },
                cancelCallback: () => {
                  setActiveAMD(0);
                  return true;
                },
                redirect: "",
              });
            } else {
              setActiveAMD(0);
              return true;
            }
            return true; */
          }}
        >
          <div
            className="row"
            style={{ maxHeight: "700px", "--bs-gutter-x": "unset" }}
          >
            <AGGridSchoolConfigurator
              pg={"forminput"}
              amdObj={activeAMD}
              district={0}
              reloader={setRefresh}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
export default FormInput;
