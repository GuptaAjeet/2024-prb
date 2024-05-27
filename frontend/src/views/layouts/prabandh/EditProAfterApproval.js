import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Features from "../../../redux/features";
import api from "../../../apps/utilities/api";
import { Helper, Settings } from "../../../apps";
import Spinner from "../../../apps/components/elements/Spinner";
import AGGridSchoolConfigurator from "./School/AGGridSchoolConfigurator";
import { Modal } from "../../../apps/components/elements";

import $ from "jquery";

const NumberInput = ({ defaultValue, currentValue, disabled, onChange, name, decimal }) => {
  const input = useRef();
  const [value, setValue] = useState(
    Helper.numberFormat(currentValue || defaultValue || 0, decimal !== false ? 5 : 0)
  );
  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (parseFloat(inputValue) <= 9999999999.99999 || !inputValue) {
      let roundedValue;
      if (inputValue.includes(".") && inputValue.split(".")[1].length > 5) {
        roundedValue = parseFloat(inputValue).toFixed(decimal !== false ? 5 : 0);
      } else if (
        inputValue.includes(".") &&
        inputValue.split(".")[1].length === 0
      ) {
        roundedValue = parseFloat(inputValue) + ".";
      } else {
        roundedValue = isNaN(parseFloat(inputValue))
          ? ""
          : parseFloat(inputValue);
      }
      setValue(roundedValue);
      event.target.value = roundedValue;
      onChange(event);
    }
  };

  return (
    <input
      ref={input}
      type="text"
      className="form-control text-right-input"
      value={currentValue || value}
      name={name}
      onFocus={(e) => {
        setValue(e.target.value.replace(/[₹,]/g, ""));
      }}
      onChange={handleChange}
      onBlur={(e) => {
        setValue(Helper.numberFormat(e.target.value, decimal !== false ? 5 : 0));
      }}
      placeholder=""
      disabled={disabled}
    />
  );
};

const EditProAfterApproval = (props) => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;

  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [schemesList, setSchemesList] = useState([]);
  const [userPer, setUserPer] = useState([]);
  const [scheme, setScheme] = useState(0);
  const [majorComponenetList, setMajorComponenetList] = useState([]); 
  const [stateList, setStateList] = useState([]);
  const [rowList, setRowList] = useState([]);
  const [initialRowList, setInitialRowList] = useState([]);
  const [spin, setSpin] = useState(false);
  const [subCompList, setSubCompList] = useState([]);
  const [actMasterList, setActMasterList] = useState([]);
  const [actMasterDetailList, setActMasterDetailList] = useState([]);
  const [filter, setFilter] = useState({
    state: "0",
    district: "0",
    scheme_id: "0",
    major_component_id: "0",
    sub_component_id: "0",
    activity_master_id: "0",
    activity_master_details_id: "0",
    allDistricts: false,
  });
  const [activeAMD, setActiveAMD] = useState(0);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());

  useEffect(() => {
    getStateList();
    getSchemesList();
  },[])

  useEffect(() => {
    if(spin){
      setRowList([]);
    }
  },[spin])

  useEffect(() => {
    let st = 0;
    let dt = 0;
    if (Settings.isStateUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      setStateID(+st);
      getDistrictsList("find", +st)
    }
    setSpin(true);
    
    if (user?.user_state_id) {
      setStateID(user?.user_state_id);
      getDistrictsList("find", user?.user_state_id);
    }
    getUserPer();
  }, [user]);
  
  useEffect(()=>{
    const state_id = $("select[name=state-list]").val();
    const scheme_id = $("select[name=scheme_id]").val();
    const major_component_id = $("select[name=major_component_id]").val();
    const activity_master_details_id = $("select[name=activity_master_details_id]").val();
    if(+state_id && +scheme_id && +major_component_id && +activity_master_details_id){
      setSpin(true);
      api.post(
        `api/proposal-after-approval/get-saved-data-activity-by-dist`,
        {
          user: user,
          state_id: state_id,
          district_id: 0,
          scheme_id: scheme_id || 0,
          major_component_id: major_component_id || 0,
          activity_master_details_id: activity_master_details_id || 0,
          type: "activity",
        },
        (res) => {
          setInitialRowList(res.data);
          setSpin(false);
          setRowList(res.data)
        }
      );
    }
  }, [refresh])

  const getUserPer = () => {
    api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  const getSchemesList = () => {
    setSpin(true);
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
      setSpin(false);
    });
  };

  const getStateList = () => {
    setSpin(true);
    api.get("api/proposal-after-approval/state-list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  };

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    setSpin(true);
    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        setSpin(false);
      }
    );
  };

  const getMajorComponenetList = (value) => {
    setSpin(true);
    setFilter();
    api.post("api/proposal-after-approval/major-components", { schemeid: value, state_id: stateID }, (res) => {
      setMajorComponenetList(res.data);
      setSpin(false);
    });
  };

  const onSave = (e) => {
    const state_id = $("select[name=state-list]").val();
    const activity_master_details_id = $("select[name=activity_master_details_id]").val();
    api.post("api/proposal-after-approval/update", { data: initialRowList, state_id, activity_master_details_id }, (res) => {
      dispatch(
        Features.showToast({
          message: res.message,
          flag: "bg-success",
        })
      );
    });
  };

  const handleChange = (e) => {
    setInitialRowList([]);
    const { name, value } = e.target;
    if (name === "state-list") {
      getDistrictsList("find", value);
      setStateID(+value);
    }
    // if (name === "districts-list") {
    //   setDistrictID(+value);
    // }
    if (name === "scheme_id") {
      setScheme(+value);
      getMajorComponenetList(+value);
    }

    setFilter((prevState) => {
      return { ...prevState, [name]: value };
    });

    if (name === "scheme_id" && value === 0) {
      setFilter({
        scheme_id: 0,
        major_component_id: 0,
        sub_component_id: 0,
        activity_master_id: 0,
        activity_master_details_id: 0,
      });
    } else if (name === "major_component_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "sub_component_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "activity_master_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "activity_master_details_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
        };
      });
    } else {
      setFilter((prevState) => {
        return {
          ...prevState,
        };
      });
    }
  };

  const search = () => {
    const state_id = $("select[name=state-list]").val();
    const scheme_id = $("select[name=scheme_id]").val();
    const major_component_id = $("select[name=major_component_id]").val();
    const activity_master_details_id = $(
      "select[name=activity_master_details_id]"
    ).val();
    if (
      +state_id !== 0 &&
      +scheme_id !== 0 &&
      +major_component_id !== 0 &&
      +activity_master_details_id !== 0
    ) {
      setSpin(true);
      setTimeout(() => {
        api.post(
          `api/proposal-after-approval/get-saved-data-activity-by-dist`,
          {
            user: user,
            state_id: state_id,
            district_id: 0,
            scheme_id: scheme_id || 0,
            major_component_id: major_component_id || 0,
            activity_master_details_id: activity_master_details_id || 0,
            type: "activity",
          },
          (res) => {
            setInitialRowList(res.data);
            setSpin(false);
            setRowList(res.data)
          }
        );
      }, 1000);
    } else {
      dispatch(
        Features.showToast({
          message: "Please select all Filters.",
          flag: "bg-danger",
        })
      );
    }
  };

  const handleInput = (e, index, keyName) => {
    setInitialRowList((prevState) => {
      prevState[index][e.target.name] = e.target.value;
      prevState[index]["financial_amount"] = parseFloat(prevState[index]['unit_cost']) * parseFloat(prevState[index]['physical_quantity']);
      return [...prevState];
    });

    setRowList((prevState) => {
      prevState[index][e.target.name] = e.target.value;
      prevState[index]["financial_amount"] = parseFloat(parseFloat(prevState[index]['unit_cost']) * parseFloat(prevState[index]['physical_quantity']));
      return [...prevState];
    });
  };

  const getSubCompList = (value) => {
    setSpin(true);
    api.post(
      "api/proposal-after-approval/sub-components",
      { schemeid: scheme, majorcomponentid: value, state_id: stateID },
      (res) => {
        setSubCompList(res.data);
        setSpin(false);
      }
    );
  };

  const getActMasterList = (value) => {
    setSpin(true);
    api.post(
      "api/proposal-after-approval/active-master-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: value,
        state_id: stateID
      },
      (res) => {
        setActMasterList(res.data);
        setSpin(false);
      }
    );
  };

  const getActMasterDetailList = (value) => {
    setSpin(true);
    api.post(
      "api/proposal-after-approval/view-edit-form-activity_activity-master-details",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: filter?.sub_component_id,
        activity_master_id: value,
        state_id: stateID,
      },
      (res) => {
        setActMasterDetailList(res.data);
        setSpin(false);
      }
    );
  };

  const openSchoolModal = (e, itm) => {
    setDistrictID(itm.district_id);
    setActiveAMD(itm);
    dispatch(
      Features.showModal({
        title: "Block-Schools Selection",
        size: "fullscreen",
        btntext: "Select",
      })
    );
  };

  return (
    <div className="dashboard-main-content">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></div>
      {props && props.viewMode !== "read-only" && (
        <div className="dashboard-main-content__header px-2 d-flex justify-content-between">
          <h1>Edit Proposal After Approval</h1>
        </div>
      )}
      
      {props && props.viewMode !== "read-only" && (
        <div
          className="dashboard-main-content-info mb-3 mt-3 mobile-search"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    name="state-list"
                    value={stateID}
                    onChange={handleChange}
                    disabled={stateList.find(
                      (state) => +state.id === user.user_state_id
                    )}
                  >
                    <option value={0}>State (All)</option>
                    {userPer?.length
                      ? userPer
                          .reduce((uniqueStates, currentItem) => {
                            if (
                              !uniqueStates.some(
                                (item) => item.state_id === currentItem.state_id
                              )
                            ) {
                              uniqueStates.push(currentItem);
                            }
                            return uniqueStates;
                          }, [])
                          .map((st, stidx) => (
                            <option key={`st_${stidx}`} value={st.state_id}>
                              {st.state_name}
                            </option>
                          ))
                      : stateList.map((st, stidx) => (
                          <option key={`st_${stidx}`} value={st.id}>
                            {st.name}
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
                  <select
                    className="form-select"
                    name="scheme_id"
                    value={scheme}
                    onChange={handleChange}
                  >
                    <option value={0}>Scheme (All)</option>
                    {userPer.length
                      ? userPer
                          .filter((usep) => usep.state_id === stateID)
                          .reduce((uniqueStates, currentItem) => {
                            if (
                              !uniqueStates.some(
                                (item) =>
                                  item.scheme_id === currentItem.scheme_id
                              )
                            ) {
                              uniqueStates.push(currentItem);
                            }
                            return uniqueStates;
                          }, [])
                          .map((s, idx) => {
                            return (
                              <option key={`sl_${idx + 1}`} value={s.scheme_id}>
                                {s.scheme_name}
                              </option>
                            );
                          })
                      : schemesList.map((s, idx) => (
                          <option key={`sl_${idx + 1}`} value={s.id}>
                            {s.scheme_name}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select"
                    name="major_component_id"
                    onChange={(e) => {
                      handleChange(e);
                      getSubCompList(e.target.value);
                    }}
                  >
                    <option value={0}>Major Component (All)</option>
                    {userPer.length
                      ? userPer
                          .filter((usep) => usep.state_id === stateID)
                          .map((s, idx) => {
                            if (scheme === s.scheme_id) {
                              return (
                                <option
                                  key={`sl_${idx + 1}`}
                                  value={s.activity_id}
                                >
                                  {s.activity_name}
                                </option>
                              );
                            }
                          })
                      : majorComponenetList.map((m, idx) => (
                          <option
                            key={`mc_${idx + 1}`}
                            value={m.prb_major_component_id}
                          >
                            {m.title}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select"
                    name="sub_component_id"
                    value={filter?.sub_component_id}
                    onChange={(e) => {
                      handleChange(e);
                      getActMasterList(e.target.value);
                    }}
                  >
                    <option value={0}>Sub Component (All)</option>
                    {subCompList.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.sub_component_id}>
                        {m.sub_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select"
                    name="activity_master_id"
                    value={filter?.activity_master_id}
                    onChange={(e) => {
                      handleChange(e);
                      getActMasterDetailList(e.target.value);
                    }}
                  >
                    <option value={0}>Activity (All)</option>
                    {actMasterList
                      ?.filter(
                        (objFirst) =>
                          !rowList.some(
                            (objSecond) =>
                              objSecond.activity_master_details_id ===
                              objFirst.id
                          )
                      )
                      .map((m, idx) => (
                        <option key={`mc_${idx + 1}`} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="activity_master_details_id"
                    value={filter?.activity_master_details_id}
                    onChange={(e) => {
                      handleChange(e);
                      setRowList([]);
                    }}
                  >
                    <option value={0}>Sub Activity (All)</option>
                    {actMasterDetailList?.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.id}>
                        {m.activity_master_details_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-1">
                  <button className="btn btn-sm btn-light" onClick={search}>
                    Show
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-content-info">
        <div className="table-scroll-section" style={{ textAlign: "center" }}>

          {spin ? (
            <Spinner />
          ) : rowList?.length === 0 ? (
            <h3>No Data Found</h3>
          ) : (
            <div className="table-scroll-section">
              <table className="table-scroll table-sm">
                <thead>
                  <tr>
                    <th style={{ width: "4%" }}>S.No.</th>
                    <th>DISTRICT</th>
                    {actMasterDetailList.find((i=>i.id === filter.activity_master_details_id)).dd_school==="1" && <th>SCHOOLS</th>}
                    <th>PHY. QTY.</th>
                    <th>Unit Cost</th>
                    <th>
                      FIN. AMT. <br />
                      (₹ In Lakhs)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowList?.map((r, idx) => <tr key={`rr_${idx + 1}`}>
                      <td>{idx + 1}</td>
                      <td>{r.district_name}</td>
                      {actMasterDetailList.find((i=>i.id === filter.activity_master_details_id)).dd_school==="1" && 
                        <td className="text-center">
                          <button
                            // className="btn btn-sm btn-dark"
                            className="btn btn-outline-primary"
                            onClick={(e) => openSchoolModal(e, r)}
                          >
                            Select School {r.schoolcount}
                            {/* <i className="bi bi-building" /> {"  "}
                            <i className="bi bi-gear-fill" /> */}
                          </button>
                      </td>}
                      <td className="text-end">
                        <NumberInput
                          defaultValue={r?.physical_quantity}
                          name="physical_quantity"
                          onChange={(e) => {
                            handleInput(e, idx, "physical_quantity")
                          }}
                          decimal={false}
                          disabled={actMasterDetailList.find((i=>i.id === filter.activity_master_details_id)).dd_school==="1"}
                        />
                      </td>
                      <td className="text-end">
                        <NumberInput
                          defaultValue={r?.unit_cost}
                          // currentValue={r?.unit_cost}
                          name="unit_cost"
                          onChange={(e) => {
                            handleInput(e, idx, "unit_cost")
                          }}
                        />
                      </td>
                      <td className="text-end">
                        <input
                          className="form-control text-right-input"
                          value={r?.financial_amount}
                          // currentValue={r?.financial_amount}
                          // name="financial_amount"
                          //   onChange={(e) => {
                          //      handleInput(e, idx, "financial_amount")
                          // }}
                          disabled={true}
                        />
                      </td>
                    </tr>
                  )}

                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={actMasterDetailList.find((i=>i.id === filter.activity_master_details_id)).dd_school==="1" ? 3 : 2} className="text-end">Total</th>
                    <th className="text-end">{Helper.numberFormat(rowList.reduce((acc, curr) => acc + parseInt(curr.physical_quantity || 0), 0))}</th>
                    <th className="text-end">{Helper.numberFormat(rowList.reduce((acc, curr) => acc + parseFloat(curr.unit_cost || 0), 0))}</th>
                    <th className="text-end">{Helper.numberFormat(rowList.reduce((acc, curr) => acc + parseFloat(curr.financial_amount || 0), 0), 5)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        <div className="text-end">
          {rowList?.length>0 && <button type="button" className="btn btn-success mt-2" onClick={(e)=>{onSave(e)}}>Save</button>}
        </div>
      </div>
      {!!activeAMD && (
        <Modal close={() => setActiveAMD(0)}>
          <div
            className="row"
            style={{ maxHeight: "400px", "--bs-gutter-x": "unset" }}
          >
            <AGGridSchoolConfigurator
              pg={"vieweditstate"}
              amdObj={activeAMD}
              district={districtID}
              reloader={setRefresh}
              district_setter={setDistrictID}
              state_id={stateID}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditProAfterApproval;
