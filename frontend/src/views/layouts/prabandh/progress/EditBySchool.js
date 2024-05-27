import React, { useState, useEffect } from "react";
import { Helper, Hook, Settings, sweetAlert, API } from "../../../../apps";
//import Spinner from "../../../../apps/components/elements/Spinner";
import $ from "jquery";
import Features from "../../../../redux/features";
import { useDispatch } from "react-redux";
import model from "../../../../apps/utilities/model";
import NumberInputComp from "../../../../apps/components/form/NumberInput";

const DynamicTable = ({ data, columns, handleInput, lockByActivity }) => {
  const user = Helper.auth.user;

  const renderCell = (item, column, rowIndex) => {
    if (column.rowSpan) {
      const rowSpanCount = getRowSpanCount(data, column.field, rowIndex);
      return rowSpanCount > 1 ? (
        <td rowSpan={rowSpanCount}>{item[column.field] === null ? 0 : item[column.field]}</td>
      ) : rowSpanCount === 0 ? (
        []
      ) : (
        <td>{item[column.field] === null ? 0 : item[column.field]}</td>
      );
    }
    return (
      <td>
        {column.field === "index" ? (
          rowIndex + 1
        ) : !column.edit ? (
          item[column.field]
        ) : (
          <NumberInputComp name={column.field} defaultValue={item[column.field] || 0} currentValue={item[column.field] || 0}
            disabled={((user.user_district_id && +item.status>2) || (!user.user_district_id && +item.status>5))}
            decimal={column.type === "amount"} onChange={(e) => { handleInput(e, item); }}
          />
        )}
      </td>
    );
  };

  const getRowSpanCount = (data, field, rowIndex) => {
    const johnIndex = data.indexOf(data.find((item) => item[field] === data[rowIndex][field]));
    if (johnIndex < rowIndex) {
      return 0;
    }

    let rowSpanCount = 1;
    rowSpanCount = data.filter((item) => item[field] === data[rowIndex][field])?.length;
    return rowSpanCount;
  };

  return (
    <table className="aaa table table-bordered text-start mb-4 ">
      <thead className="thead-bg">
        <tr>
          <th rowSpan={2}>S.No.</th>
          <th rowSpan={2}>Major Comp</th>
          <th rowSpan={2}>Sub Comp</th>
          <th rowSpan={2}>Activity</th>
          <th rowSpan={2}>Sub Activity</th>
          <th colSpan={2} className="text-center">Allotted</th>
          <th rowSpan={2}>Not Started</th>
          <th rowSpan={2}>Inprogress</th>
          <th rowSpan={2}>Completed</th>
          <th rowSpan={2}>Expenditure</th>
          {data?.length>0 && data[0]['prb_ann_wrk_pln_bdgt_data_progress_asset_id'] && <th rowSpan={2}></th>}
        </tr>
        <tr>
          <th>Physical</th>
          <th>Financial</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={item.id}>
            {columns.map((column) => renderCell(item, column, rowIndex))}
            {data?.length>0 && data[0]['prb_ann_wrk_pln_bdgt_data_progress_asset_id'] && <td>
              {((user.user_district_id && +item.status<3) || (!user.user_district_id && +item.status<6)) &&  <button type="button" className="btn btn-primary bi bi-lock" 
                onClick={()=>{
                  lockByActivity(item.activity_master_details_id, item?.prb_ann_wrk_pln_bdgt_data_progress_asset_id)
                }}
              />}
            </td>}
          </tr>
        ))}
        
      </tbody>
    </table>
  );
};

const NumberInput = ({defaultValue, currentValue, disabled, onChange, name, decimal}) => {

  const [value, setValue] = useState(Helper.numberFormat(defaultValue || 0, decimal !== false ? 5 : 0));
  // const [value, setValue] = useState(defaultValue);

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
    <input type="text" className="form-control text-right-input" value={value} name={name} onFocus={(e) => { setValue(e.target.value.replace(/[₹,]/g, "")); }}
     onChange={handleChange} onBlur={(e) => { setValue(Helper.numberFormat(e.target.value, decimal !== false ? 5 : 0)); }} placeholder="" disabled={disabled} />
  );
};

const EditBySchool = (props) => {
  const dispatch = useDispatch();
  const selectMonth = localStorage.getItem("progress_month");
  const user = Helper.auth.user;
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [userPer, setUserPer] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);
  const [schoolID, setSchoolID] = useState(0);
  const [activities, setActivities] = useState(null);

  let userData = Helper.auth?.user;

  useEffect(() => {
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
    getSchoolsList(user?.user_district_id);
    getUserPer();
    // search();
  }, [user, user?.user_district_id]);

  const getUserPer = () => {
    API.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  const getSchoolsList = (district_id) => {
    let state_id = stateID;
    if (Settings.isDistrictUser(user?.user_role_id)) {
      state_id = user?.user_state_id;
    }

    API.post(`api/proposal-after-approval/school-list`,
      { district_id, state_id },
      (res) => {
        setSchoolsList(
          res.data?.map((v) => ({
            name: `${v?.school_name} (${v?.udise_sch_code})`,
            id: v.udise_sch_code,
          }))
        );
      }
    );
  };

  const lockByActivity = (activity_master_details_id, prb_ann_wrk_pln_bdgt_data_progress_asset_id) =>{
    API.post("api/proposal-after-approval/lock-by-activity", { activity_master_details_id, district_id: districtID, prb_ann_wrk_pln_bdgt_data_progress_asset_id  },
      (res) => {
        if (res.status) {
          console.log("res->",res)
          getActivityList(schoolID);
        }
      }
    );
  }

  const getActivityList = (asset_code) => {
    API.post(`api/proposal-after-approval/school-activity`,
      {
        district_id: districtID,
        state_id: stateID,
        asset_code,
        month: selectMonth,
        activity_group_code: userData?.activity_group_code
      },
      (res) => {
        setActivities(res.data);
      }
    );
  };

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    API[method === "list" ? "get" : "post"](`api/districts/${endpoint}`,
      data,
      (res) => {
        setDistrictsList(res.data);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state-list") {
      getDistrictsList("find", value);
      setDistrictID(0);
      setSchoolID(0);
      setStateID(+value);
    }
    if (name === "districts-list") {
      setDistrictID(+value);
      setSchoolID(0);
      getSchoolsList(value);
    }
    if (name === "school-list") {
      setSchoolID(value);
    }
    setActivities(null);
  };

  const handleInput = (e, r) => {
    setActivities((prevState) => {
      prevState = prevState.map((item) => {
       
        if (item.activity_master_details_id === r.activity_master_details_id) {
          item[e.target.name] = e.target.name === "financial_expenditure" ? e.target.value : parseInt(e.target.value);
          return item;
        } else {
          return item;
        }
      });
      return [...prevState];
    });
  };

  const saveProgressActivity = () => {
    let checkValidation = true;
    for (let i = 0; i < activities.length; i++) {
      const item = activities[i];
      if (
        parseInt(item.physical_progress_yet_to_start) +
        parseInt(item.physical_progress_in_progress) +
        parseInt(item.physical_progress_completed) >
        item.allocated_physical_quantity
      ) {
        checkValidation = false;
      }
    }
    if (!checkValidation) {
      sweetAlert.warning(
        "Sum of Not Started, In Progress, and Completed cannot exceed the Allotted Physical quantity."
      );
    } else {
      API.post(
        "api/proposal-after-approval/save-activity",
        { data: activities, type: "school", user: user },
        (res) => {
          dispatch(Features.showToast({ message: res.message }));
          getActivityList(schoolID);
        }
      );
    }
  };
  useEffect(() => {
    const element = document.getElementById("accorion-button");
    if (element) {
      console.log(element.className);
    }
  }, [document.getElementById("accorion-button")?.className]);
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
          <h1>
            Edit By School (
            {
              model.monthsOfYear.find((item) => item.value === selectMonth)
                ?.name
            }
            )
          </h1>
        </div>
      )}
      {props && props.viewMode !== "read-only" && (
        <div
          className="dashboard-main-content-info mb-3 mt-3"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-4">
                  <select
                    className="form-select"
                    name="state-list"
                    value={stateID}
                    onChange={handleChange}
                    disabled={stateList?.find(
                      (state) => +state.id === user.user_state_id
                    )}
                  >
                    <option value={0}>Select State</option>
                    {userPer?.length
                      ? userPer
                        ?.reduce((uniqueStates, currentItem) => {
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
                      : stateList?.map((st, stidx) => (
                        <option key={`st_${stidx}`} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="districts-list"
                    value={districtID}
                    onChange={handleChange}
                    disabled={districtsList.find(
                      (district) => +district.id === +user.user_district_id
                    )}
                  >
                    <option value={0}>Select District</option>
                    {districtsList?.length > 0 &&
                      districtsList.map((ds, dsidx) => (
                        <option key={`ds_${dsidx}`} value={ds.id}>
                          {ds.district_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-select"
                    name="school-list"
                    value={schoolID}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value={0}>Select School</option>
                    {schoolsList?.length > 0 &&
                      schoolsList.map((ds, dsidx) => (
                        <option key={`ds_${dsidx}`} value={ds.id}>
                          {ds.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      if (
                        !districtID ||
                        +districtID === 0 ||
                        !stateID ||
                        +stateID === 0 ||
                        !schoolID ||
                        +schoolID === 0
                      ) {
                        dispatch(
                          Features.showToast({
                            message: "Please select all filters",
                            flag: "bg-danger",
                          })
                        );
                      } else {
                        getActivityList(schoolID);
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

      {activities && activities.length === 0 ? 
      <div className="dashboard-main-content-info">
        <h3 className="text-center">No Data Found</h3></div>
         : activities?.length > 0 && (
        <div className="dashboard-main-content-info">
          <div className="accordion contribute-page" id="accordionExample">
            <h6 className="text-end" style={{ color: "#2b4a91" }}>
              {" "}
              All (₹) In Lakhs
            </h6>
            {Object?.entries(activities?.reduce((result, currentItem) => {
                const { scheme_name, ...rest } = currentItem;
                if (result[scheme_name]) {
                  result[scheme_name].push(rest);
                } else {
                  result[scheme_name] = [rest];
                }
                return result;
              }, {}) || {}
            )?.map(([scheme, data]) => (
              <div className="accordion-item" key={scheme + "aaaa"}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    id="accorion-button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapseOne${scheme.replace(" ", "")}`}
                    aria-expanded="true"
                    aria-controls={`collapseOne${scheme.replace(" ", "")}`}
                    onClick={(e) => {
                      let hasClass = false;
                      $(".accordion-button").each(function () {
                        if (!$(this).hasClass("collapsed")) {
                          hasClass = true;
                        }
                      })
                      if (hasClass) {
                        $(".saveBtn").show()
                      } else {
                        $(".saveBtn").hide()
                      }
                    }}
                  >
                    {scheme} ({data?.length} Activities)
                  </button>
                </h2>
                <div
                  id={`collapseOne${scheme.replace(" ", "")}`}
                  className={`accordion-collapse collapse ${activities.length === 1 ? "show" : ""
                    }`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body" style={{ padding: "5px" }}>
                    <div className="table-responsive progress-tracking">
                      {data.length > 0 && (
                        <>
                          <DynamicTable
                            data={data}
                            columns={[
                              { field: "index", rowSpan: false },
                              { field: "major_component_name", rowSpan: true },
                              { field: "sub_component_name", rowSpan: true },
                              { field: "activity_master_name", rowSpan: true },
                              {
                                field: "activity_master_details_name",
                                rowSpan: false,
                              },
                              {
                                field: "allocated_physical_quantity",
                                rowSpan: false,
                              },
                              {
                                field: "allocated_financial_amount",
                                rowSpan: false,
                              },
                              {
                                field: "physical_progress_yet_to_start",
                                rowSpan: false,
                                edit: true,
                                type: "number",
                              },
                              {
                                field: "physical_progress_in_progress",
                                rowSpan: false,
                                edit: true,
                                type: "number",
                              },
                              {
                                field: "physical_progress_completed",
                                rowSpan: false,
                                edit: true,
                                type: "number",
                              },
                              {
                                field: "financial_expenditure",
                                rowSpan: false,
                                edit: true,
                                type: "amount",
                              },
                            ]}
                            handleInput={handleInput}
                            lockByActivity={lockByActivity}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-end">
            <button
              className={`btn btn-success saveBtn`}
              onClick={() => saveProgressActivity()}
            >
              Save
            </button>
          </div>
        </div>)

      }
    </div>
  );
};

export default EditBySchool;
