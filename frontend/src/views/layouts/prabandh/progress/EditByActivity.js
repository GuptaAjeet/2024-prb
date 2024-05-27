import { useState, useEffect } from "react";
import { Helper, Hook, Settings, sweetAlert, API } from "../../../../apps";
//import Spinner from "../../../../apps/components/elements/Spinner";
//import $ from "jquery";
import Features from "../../../../redux/features";
import { useDispatch } from "react-redux";
import modelFun from "../../../../apps/utilities/model";
import { Link, useLocation } from "react-router-dom";
import NumberInputAll from "../../../../apps/components/form/NumberInput";
import $ from "jquery";

const NumberInput = ({ defaultValue, currentValue, disabled, onChange, name, decimal }) => {

  const [value, setValue] = useState(Helper.numberFormat(defaultValue || 0, decimal !== false ? 5 : 0));

  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (parseFloat(inputValue) <= 9999999999.99999 || !inputValue) {
      let roundedValue;
      if (inputValue.includes(".") && inputValue.split(".")[1].length > 5) {
        roundedValue = parseFloat(inputValue).toFixed(decimal !== false ? 5 : 0);
      }
      else if (inputValue.includes(".") && inputValue.split(".")[1].length === 0) {
        roundedValue = parseFloat(inputValue) + ".";
      }
      else {
        roundedValue = isNaN(parseFloat(inputValue)) ? "" : parseFloat(inputValue);
      }
      setValue(roundedValue);
      event.target.value = roundedValue;
      onChange && onChange(event);
    }
  };

  return (
    <input type="text" className="form-control text-right-input input-width90" value={currentValue || value} name={name}
      onFocus={(e) => { setValue(e.target.value.replace(/[₹,]/g, "")); }} onChange={handleChange}
      onBlur={(e) => { setValue(Helper.numberFormat(e.target.value, decimal !== false ? 5 : 0)); }} placeholder="" disabled={disabled}
    />
  );
};

const EditByActivity = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const selectMonth = localStorage.getItem("progress_month");
  const user = Helper.auth.user;
  const [stateID, setStateID] = useState(location?.state?.state_id || 0);
  const [districtID, setDistrictID] = useState(location?.state?.district_id || 0);
  const [schemesList, setSchemesList] = useState([]);
  const [userPer, setUserPer] = useState([]);
  const [scheme, setScheme] = useState(location?.state?.scheme_id || 0);
  const [majorComponenetList, setMajorComponenetList] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [activities, setActivities] = useState([]);
  const [subCompList, setSubCompList] = useState([]);
  const [actMasterList, setActMasterList] = useState([]);
  const [actMasterDetailList, setActMasterDetailList] = useState([]);
  const [model, setModel] = useState(false);
  const [additionalParms, setAdditionalParms] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState({});

  let backLink = "/auth/progress/admin/tracking-school-activity";
  if ([8, 9, 10, 11].includes(user?.user_role_id)) {
    backLink = "/auth/progress/district/tracking-school-activity";
  }

  const [filter, setFilter] = useState({
    state: location?.state?.state_id || "0",
    district: location?.state?.district_id || "0",
    scheme_id: location?.state?.scheme_id || "0",
    major_component_id: location?.state?.major_component_id || "0",
    sub_component_id: location?.state?.sub_component_id || "0",
    activity_master_id: location?.state?.activity_master_id || "0",
    activity_master_details_id: location?.state?.activity_master_details_id || "0",
    allDistricts: false,
  });

  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        state: user?.user_state_id,
        district: user?.user_district_id,
      };
    });
  }, []);

  useEffect(() => {
    getSchemesList();
    let st = 0;
    let dt = 0;
    if (Settings.isStateUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      setStateID(+st);
      getDistrictsList("find", +st);
      setTimeout(() => {
        if (districtID !== 0) {
          setDistrictID(districtID);
        } else {
          setDistrictID(+dt);
        }
      }, 1000);
    }

    if (user?.user_state_id) {
      setStateID(user?.user_state_id);
      getDistrictsList("find", user?.user_state_id);
    }
    setDistrictID(user?.user_district_id ? user?.user_district_id : 0);
    getUserPer();
  }, [user]);

  useEffect(() => {
    if (location?.state) {
      getDistrictsList("find", location?.state?.state_id);
      getMajorComponenetList(location?.state?.scheme_id);
      getSubCompList(location?.state?.major_component_id);
      getActMasterList(location?.state?.sub_component_id);
      getActMasterDetailList(location?.state?.activity_master_id);
      setDistrictID(location?.state?.district_id);
      getActivityList();
    }
  }, [location]);

  useEffect(() => {
    if(model){
      API.post("api/proposal-after-approval/activity-additional-params",
        {
          activity_master_details_id: filter?.activity_master_details_id
        },
        (res) => {
          if (res.status) {
            setAdditionalParms([...res.data]);
          }
        }
      );
    }
  }, [model]);

  const getSubCompList = (value) => {
    API.post("api/proposal-after-approval/activity-sub-components",
      {
        scheme_id: scheme,
        major_component_id: value,
        state_id: stateID,
        district_id: districtID,
      },
      (res) => {
        if (res.status) {
          if (res.data.length === 0) dispatch(
            Features.showToast({
              message: "No Data Found",
              flag: "bg-danger",
            })
          );
          setSubCompList(res.data);
        }
      }
    );
  };

  const getActMasterList = (value) => {
    API.post("api/proposal-after-approval/allo-active-master-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: value,
        state_id: stateID,
        district_id: districtID,
      },
      (res) => {
        if (res.data.length === 0) dispatch(
          Features.showToast({
            message: "No Data Found",
            flag: "bg-danger",
          })
        );
        setActMasterList(res.data);
      }
    );
  };

  const getActMasterDetailList = (value) => {
    API.post("api/proposal-after-approval/activity-master-detail-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: filter?.sub_component_id,
        activity_master_id: value,
        state_id: stateID,
        district_id: districtID,
      },
      (res) => {
        if (res.data.length === 0) dispatch(
          Features.showToast({
            message: "No Data Found",
            flag: "bg-danger",
          })
        );
        setActMasterDetailList(res.data);
      }
    );
  };

  const onChangeAdditionalValue = (e,additionalParmIndex) => {
    setAdditionalParms(prevState=>{
      prevState[additionalParmIndex][e.target.name] = e.target.value;
      return [...prevState];
    })
  }

  const getInput =(additionalParm, additionalParmIndex)=>{
    switch (additionalParm.column_type) {
      case "numeric":
        return <input value={additionalParm?.additional_parameter_value} name="additional_parameter_value" type="text" className="form-control" 
          onChange={(e)=>onChangeAdditionalValue(e,additionalParmIndex)}
        />

      case "text":
        return <NumberInputAll currentValue={additionalParm?.additional_parameter_value} name="additional_parameter_value"  
          onChange={(e)=>onChangeAdditionalValue(e,additionalParmIndex)}
        />
        
      case "boolean":
        return <select value={additionalParm?.additional_parameter_value} className="form-control" name="additional_parameter_value"  
          onChange={(e)=>onChangeAdditionalValue(e,additionalParmIndex)}
        >
          <option>Yes</option>
          <option>No</option>
        </select>
        
      default:
        break;
    }
  }

  const getUserPer = () => {
    API.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  const getSchemesList = () => {
    API.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
    });
  };

  const getActivityList = () => {
    API.post(`api/proposal-after-approval/activity-school`,
      {
        district_id: districtID,
        state_id: stateID,
        activity_master_details_id: filter?.activity_master_details_id,
        month: selectMonth,
        activity_group_code: user?.activity_group_code
      },
      (res) => {
        setActivities(res.data);
      }
    );
  };

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    API[method === "list" ? "get" : "post"](`api/districts/${endpoint}`, data,
      (res) => {
        setDistrictsList(res.data);
      }
    );
  };

  const getMajorComponenetList = (value) => {
    API.post("api/proposal-after-approval/activity-major-components", { scheme_id: value, state_id: stateID, district_id: districtID },
      (res) => {
        if (res.data.length === 0) dispatch(
          Features.showToast({
            message: "No Data Found",
            flag: "bg-danger",
          })
        );
        setMajorComponenetList(res.data);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivities([])
    if (name === "state-list") {
      getDistrictsList("find", value);
      setStateID(+value);
    }
    if (name === "districts-list") {
      setDistrictID(+value);
    }
    if (name === "scheme_id") {
      setScheme(+value);
      getMajorComponenetList(+value);
    }

    setFilter((prevState) => {
      return { ...prevState, [name]: value };
    });

    if (name === "scheme_id" && +value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          scheme_id: 0,
          major_component_id: 0,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "major_component_id" && +value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "sub_component_id" && +value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "activity_master_id" && +value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_details_id: 0,
        };
      });
    }
  };

  const handleInput = (e, r) => {
    setActivities((prevState) => {
      prevState = prevState.map((item) => {
        if (
          item.prb_ann_wrk_pln_bdgt_data_progress_asset_id ===
          r.prb_ann_wrk_pln_bdgt_data_progress_asset_id
        ) {
          item[e.target.name] =
            e.target.name === "financial_expenditure"
              ? e.target.value
              : parseInt(e.target.value);
          return item;
        } else {
          return item;
        }
      });
      return [...prevState];
    });
  };

  const saveAdditionalParams = () => {
    let dataTosave = additionalParms;
    $(".modal-body").find("tbody").find("tr").each(function (index) {
        dataTosave[index]['asset_code']= selectedSchool?.asset_code;
        dataTosave[index]['additional_parameter_value'] = $(this).find("input, select").val();
        dataTosave[index]['prb_ann_wrk_pln_bdgt_data_progress_asset_id']= selectedSchool?.prb_ann_wrk_pln_bdgt_data_progress_asset_id;
    })

    setAdditionalParms([...dataTosave]);
    API.post("api/proposal-after-approval/save-additional-params", { data: dataTosave },
      (res) => {
        if (res.status) {
          console.log("res", res)
          setModel(false)
        }
      }
    );
  }

  const saveProgressActivity = () => {
    let checkValidation = true;
    for (let i = 0; i < activities.length; i++) {
      const item = activities[i];
      if (parseInt(item.physical_progress_yet_to_start) + parseInt(item.physical_progress_in_progress) + parseInt(item.physical_progress_completed) > item.allocated_physical_quantity) {
        checkValidation = false;
      }
    }
    if (!checkValidation) {
      sweetAlert.warning("Sum of Not Started, In Progress, and Completed cannot exceed the Allotted Physical quantity.");
    }
    else {
      const act = JSON.parse(JSON.stringify(activities));
      delete act[0].cumulative_financial_expenditure;
      delete act[0].cumulative_physical_progress_completed;

      act.forEach((element) => {
        delete element.cumulative_financial_expenditure;
        delete element.cumulative_physical_progress_completed;
      });

      API.post("api/proposal-after-approval/save-activity",
        {
          data: act,
          type: "activity",
          state_id: stateID,
          district_id: districtID,
          user: user,
        },
        (res) => {
          dispatch(Features.showToast({ message: res.message }));
          getActivityList();
        }
      );
    }
  };

  const lockByActivity = (activity_master_details_id, prb_ann_wrk_pln_bdgt_data_progress_asset_id) =>{
    API.post("api/proposal-after-approval/lock-by-activity", { activity_master_details_id, district_id: districtID, prb_ann_wrk_pln_bdgt_data_progress_asset_id },
      (res) => {
        if (res.status) {
          console.log("res->",res)
          getActivityList();
        }
      }
    );
  }

  const style = { whiteSpace: "noWrap" };
  return (
    <div className="dashboard-main-content">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></div>
      {props && props.viewMode !== "read-only" && (
        <div className="dashboard-main-content__header d-flex justify-content-between">
          <h1>Edit By Activity </h1>
          {location.state && (
            <Link to={backLink}
              state={{
                filter: {
                  state: location?.state?.state_id,
                  district: location?.state?.district_id,
                  scheme_id: location?.state?.scheme_id,
                  major_component_id: location?.state?.major_component_id,
                  sub_component_id: location?.state?.sub_component_id,
                  activity_master_id: location?.state?.activity_master_id,
                  activity_master_details_id:
                    location?.state?.activity_master_details_id,
                },
                activityDetails: location?.state?.activityDetails,
                state_name: location?.state?.state_name,
              }}
            >
              {" "}
              <button className="btn btn-primary">
                <i className="bi bi-arrow-left" /> Back
              </button>
            </Link>
          )}
          {/* <Link to={"/auth/progress/admin/tracking-school-activity"} className="bi bi-arrow-left font-size-16 btn ps-2 pe-2 pt-1 pb-1 btn-primary" > Back</Link> */}
        </div>
      )}
      {props && props.viewMode !== "read-only" && (
        <div className="dashboard-main-content-info mb-3 mt-3" id="search" style={{ backgroundColor: "rgb(43 74 145)" }}>
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-4">
                  <select className="form-select" name="state-list" value={stateID} onChange={handleChange}
                    disabled={stateList?.find((state) => +state.id === user.user_state_id)}
                  >
                    <option value={0}>State (All)</option>
                    {userPer?.length ? userPer.reduce((uniqueStates, currentItem) => {
                      if (!uniqueStates.some((item) => item.state_id === currentItem.state_id)) {
                        uniqueStates.push(currentItem);
                      }
                      return uniqueStates;
                    }, [])
                      ?.map((st, stidx) => (
                        <option key={`st_${stidx}`} value={st.state_id}>
                          {st.state_name}
                        </option>
                      ))
                      : stateList?.map((st, stidx) => (
                        <option key={`st_${stidx}`} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <select className="form-select" name="districts-list" value={districtID} onChange={handleChange}
                    disabled={districtsList.find((district) => +district.id === +user.user_district_id)}
                  >
                    <option value={0}>District (All)</option>
                    {districtsList?.length > 0 && districtsList?.map((ds, dsidx) => (
                      <option key={`ds_${dsidx}`} value={ds.id}>
                        {ds.district_name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </div>

          <div className="row mt-3" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white ">INDICATOR FILTER</h6>
              <div className="row">
                <div className="col-md-2">
                  <select className="form-select" name="scheme_id" value={scheme}
                    onChange={(e) => {
                      handleChange(e);
                      setFilter((prevSate) => {
                        return {
                          ...prevSate,
                          major_component_id: "0",
                          sub_component_id: "0",
                          activity_master_id: "0",
                          activity_master_details_id: "0",
                          allDistricts: false,
                        };
                      });
                    }}
                  >
                    <option value={0}>Scheme (All)</option>
                    {userPer?.length ? userPer.filter((usep) => usep.state_id === stateID).reduce((uniqueStates, currentItem) => {
                      if (!uniqueStates.some((item) => item.scheme_id === currentItem.scheme_id)) {
                        uniqueStates.push(currentItem);
                      }
                      return uniqueStates;
                    }, [])
                      ?.map((s, idx) => {
                        return (
                          <option key={`sl_${idx + 1}`} value={s.scheme_id}>
                            {s.scheme_name}
                          </option>
                        );
                      })
                      : schemesList?.map((s, idx) => (
                        <option key={`sl_${idx + 1}`} value={s.id}>
                          {s.scheme_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select className="form-select" name="major_component_id" value={filter?.major_component_id}
                    onChange={(e) => {
                      handleChange(e);
                      getSubCompList(e.target.value);
                      setFilter((prevSate) => {
                        return {
                          ...prevSate,
                          sub_component_id: "0",
                          activity_master_id: "0",
                          activity_master_details_id: "0",
                          allDistricts: false,
                        };
                      });
                    }}
                  >
                    <option value={0}>Major Component (All)</option>
                    {userPer?.length ? userPer.filter((usep) => usep.state_id === stateID)?.map((s, idx) => {
                      if (scheme === s.scheme_id) {
                        return (
                          <option key={`sl_${idx + 1}`} value={s.activity_id}>
                            {s.activity_name}
                          </option>
                        );
                      }
                    })
                      : majorComponenetList?.map((m, idx) => (
                        <option key={`mc_${idx + 1}`} value={m.prb_major_component_id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select className="form-select" name="sub_component_id" value={filter?.sub_component_id}
                    onChange={(e) => {
                      handleChange(e);
                      getActMasterList(e.target.value);
                      setFilter((prevSate) => {
                        return {
                          ...prevSate,
                          activity_master_id: "0",
                          activity_master_details_id: "0",
                          allDistricts: false,
                        };
                      });
                    }}
                  >
                    <option value={0}>Sub Component (All)</option>
                    {subCompList && subCompList?.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.sub_component_id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <select className="form-select" name="activity_master_id" value={filter?.activity_master_id}
                    onChange={(e) => {
                      handleChange(e);
                      getActMasterDetailList(e.target.value);
                      setFilter((prevSate) => {
                        return {
                          ...prevSate,
                          activity_master_details_id: "0",
                          allDistricts: false,
                        };
                      });
                    }}
                  >
                    <option value={0}>Activity (All)</option>
                    {actMasterList?.map((m, idx) => (
                        <option key={`mc_${idx + 1}`} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select className="form-select" name="activity_master_details_id" value={filter?.activity_master_details_id} onChange={(e) => { handleChange(e) }}>

                    <option value={0}>Sub Activity (All)</option>
                    {actMasterDetailList?.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.id}>
                        {m.activity_master_details_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-1">
                  <button type="button" className="btn btn-success"
                    onClick={() => {
                      if (
                        !districtID ||
                        districtID === "0" ||
                        !stateID ||
                        stateID === "0" ||
                        filter?.scheme_id === "0" ||
                        filter?.major_component_id === "0" ||
                        filter?.sub_component_id === "0" ||
                        filter?.activity_master_id === "0" ||
                        filter?.activity_master_details_id === "0"
                      ) {
                        dispatch(Features.showToast({ message: "Please select all filters", flag: "bg-danger" }));
                      } else {
                        getActivityList();
                      }
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activities?.length > 0 ? (
        <>
          <div className="dashboard-main-content-info mb-0">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "22px",
                }}
              >
                <h6 className="year-info-1">
                  <span>
                    {modelFun.monthsOfYear?.find((item) => item.value === selectMonth)?.name}
                  </span>
                </h6>
                <h6 className="text-end" style={{ color: "#2b4a91" }}>
                  {" "}
                  All (₹) In Lakhs
                </h6>
              </div>
              <div className="table-scroll-section progress-tracking">
                {/* <table className="table table-bordered text-start table-scroll">  */}
                <table className="text-start table-scroll"> 
                  <thead className="thead-bg">
                    <tr>
                      <th rowSpan={2}>S.No.</th>
                      <th rowSpan={2}>School</th>
                      <th rowSpan={2} style={style}>Udise Code</th>
                      <th colSpan={2} className="txt-cntr">Allotted</th>
                      <th colSpan={4} className="txt-cntr">Current Status</th>
                      <th rowSpan={2} className="txt-cntr"> Cumulative Expenditure <br/> (Up to this month)</th>
                      <th rowSpan={2} className="txt-cntr"> </th>
                      {/* <th rowSpan={2} className="txt-cntr"> Additional <br/> Parameter</th> */}
                    </tr>
                    <tr>
                      <th>Physical</th>
                      <th>Financial</th>
                      <th>Not Started</th>
                      <th>Inprogress</th>
                      <th>Completed</th>
                      <th>Expenditure <br/> (In this month)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities?.map((r, idx) => (
                      <tr key={`rr_${idx + 1}`}>
                        <td>{idx + 1}</td>
                        <td>{r.school_name}</td>
                        <td className="text-end">{r.asset_code}</td>
                        <td className="text-end">{Helper.numberFormat(r.allocated_physical_quantity)}</td>
                        <td className="text-end">{Helper.numberFormat(r.allocated_financial_amount, 5)}</td>
                        <td>
                          <NumberInput className="input-width90" name="physical_progress_yet_to_start"
                            defaultValue={r["physical_progress_yet_to_start"] || 0}
                            currentValue={r["physical_progress_yet_to_start"] || 0}
                            disabled={((user.user_district_id && +r.status>2) || (!user.user_district_id && +r.status>5))}
                            decimal={false} onChange={(e) => { handleInput(e, r); }}
                          />
                          
                        </td>
                        <td>
                          <NumberInput className="input-width90" name="physical_progress_in_progress"
                            defaultValue={r["physical_progress_in_progress"] || 0}
                            currentValue={r["physical_progress_in_progress"] || 0}
                            disabled={((user.user_district_id && +r.status>2) || (!user.user_district_id && +r.status>5))}
                            decimal={false} onChange={(e) => { handleInput(e, r); }}
                          />
                        </td>
                        <td>
                          <NumberInput className="input-width90" name="physical_progress_completed" defaultValue={r["physical_progress_completed"] || 0}
                            currentValue={r["physical_progress_completed"] || 0}
                            disabled={((user.user_district_id && +r.status>2) || (!user.user_district_id && +r.status>5))}
                            decimal={false} onChange={(e) => { handleInput(e, r); }}
                          />
                        </td>
                        <td>
                          <NumberInput className="input-width90" name="financial_expenditure" defaultValue={r["financial_expenditure"] || 0}
                            currentValue={r["financial_expenditure"] || 0}
                            disabled={((user.user_district_id && +r.status>2) || (!user.user_district_id && +r.status>5))}
                            // decimal={false}
                            onChange={(e) => { handleInput(e, r); }}
                          />
                        </td>
                        <td className="text-end">{Helper.numberFormat(r.cumulative_financial_expenditure, 5)}</td>
                        {/* <td className="text-center">
                          <button type="button" 
                            className="btn btn-primary bi bi-eye p-2" 
                            data-toggle="modal" 
                            data-target="#exampleModal"
                            onClick={()=>{
                              setModel(true);
                              setSelectedSchool(r);
                            }}
                            ></button>
                        </td> */}
                        <td>
                          {((user.user_district_id && +r.status<3) || (!user.user_district_id && +r.status<6)) &&  <button type="button" className="btn btn-primary bi bi-lock" 
                            onClick={()=>{
                              lockByActivity(r.activity_master_details_id, r?.prb_ann_wrk_pln_bdgt_data_progress_asset_id)
                            }}
                          />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {activities.length > 0 && (
                    <tfoot>
                      <tr>
                        <th colSpan={3}>Total</th>
                        <th>
                          {Helper.numberFormat(
                            activities.reduce((accumulator, currentValue) => {
                              return (accumulator + parseFloat(currentValue?.allocated_physical_quantity || 0));
                            }, 0)
                          )}
                        </th>
                        <th>
                          {Helper.accountFormat(
                            activities.reduce((accumulator, currentValue) => {
                              return (accumulator + parseFloat(currentValue?.allocated_financial_amount || 0));
                            }, 0).toFixed(5)
                          )}
                        </th>
                        <th colSpan={6}></th>
                        {/* <th colSpan={6}></th> */}
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
            <div className="text-end mt-2">
              <button className="btn btn-success" onClick={() => saveProgressActivity()}>
                Save
              </button>
            </div>
          </div>

          <div class="modal show" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" style={{display: model ? "block" : "none"}}>
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header w-100">
                  <div className="d-flex justify-content-between w-100">
                    <h5 class="modal-title">Additional Parameter for {$("select[name='activity_master_details_id'] option:selected").text()}</h5>
                    <button type="button" class="btn btn-primary" 
                      onClick={()=>setModel(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
                <div class="modal-body">
                  <div>
                    <h6>{selectedSchool.school_name}</h6>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Parameter  Name</th>
                        <th width="190">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalParms?.map((additionalParm, additionalParmIndex)=><tr>
                        <td>{additionalParm.parameter_name}</td>
                        <td>
                          {getInput(additionalParm, additionalParmIndex)}
                        </td>
                      </tr>)}
                      
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary text-dark" data-dismiss="modal" 
                            onClick={()=>setModel(false)}
                  >Close</button>
                  <button type="button" class="btn btn-success" 
                    onClick={saveAdditionalParams}
                    >Save</button>
                </div>
              </div>
            </div>
          </div>

        </>
      )
        :
        (
          <div className="dashboard-main-content-info mb-0">
            <h3 className="text-center">No Data Found</h3>
          </div>
        )}
    </div>
  );
};

export default EditByActivity;