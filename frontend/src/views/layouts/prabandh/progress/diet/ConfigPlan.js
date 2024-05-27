import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Helper, Hook, Settings } from "../../../../../apps";
import api from "../../../../../apps/utilities/api";
import Features from "../../../../../redux/features";
import model from "../../../../../apps/utilities/model";

const DynamicTable = ({ data, columns, handleInput, workingRow, setWorkingRow, setActivities }) => {
  const dispatch = useDispatch();

  const renderCell = (item, column, rowIndex) => {
    if (column.rowSpan) {
      const rowSpanCount = getRowSpanCount(data, column.field, rowIndex);
      return rowSpanCount > 1 ? (
        <td rowSpan={rowSpanCount}>{item[column.field] === null ? 0 : item[column.field]}</td>
      ) :  rowSpanCount === 0 ? (
        []
      ) : (
        <td>{item[column.field] === null ? 0 : item[column.field]}</td>
      );
    }
    const returnField =(column,item)=>{
      switch (column.type) {
        case Boolean:
          return <select className="form-control min-width100" defaultValue={item[column.field]} name={column.field}
            disabled={item.activity_master_details_id !== workingRow.activity_master_details_id}    
            onChange={(e)=>{
                setActivities(prevState=>{prevState[rowIndex][column.field]= e.target.value; return [...prevState]})
              }}
            >
            <option value={0}>Select</option>
            <option value={1}>Yes</option>
            <option value={2}>No</option>
            {["dpr_yn", "drawings_yn", "agencies_yn", "noc_yn"].includes(column.field) && <option value={3}>On-going</option>}
          </select>
        case 'date': return <input type="date"  name={column.field} onKeyDown={(e) => e.preventDefault()} className="form-control max-width144" defaultValue={item[column.field]}
          disabled={item.activity_master_details_id !== workingRow.activity_master_details_id}  
          onChange={(e)=>{
            setActivities(prevState=>{prevState[rowIndex][column.field]= e.target.value; return [...prevState]})
          }}
        />
        case 'number': return <NumberInput
          name={column.field}
          defaultValue={item[column.field] || 0}
          currentValue={item[column.field] || 0}
          // disabled
          decimal={column.type === "amount"}
          disabled={item.activity_master_details_id !== workingRow.activity_master_details_id}
          onChange={(e) => {
            handleInput(e, item);
          }}
        /> 

        case 'amount': return <NumberInput
            name={column.field}
            defaultValue={item[column.field] || 0}
            currentValue={item[column.field] || 0}
            disabled={item.activity_master_details_id !== workingRow.activity_master_details_id}
            decimal={column.type === "amount"}
            onChange={(e) => {
              handleInput(e, item);
            }}
          />  
         
        case 'text': return <input type="text" 
            className="form-control"
            style={{width:"150px"}} 
            defaultValue={item[column.field]}
            disabled={item.activity_master_details_id !== workingRow.activity_master_details_id}  
            onChange={(e)=>{
              setActivities(prevState=>{prevState[rowIndex][column.field]= e.target.value; return [...prevState]})
            }}
          />

        default:
          break;
      }
    }
    return (
      <td className={`${column.type==="number" ? "text-end" : ""}`}>
        {column.field === "index" ? (
          rowIndex + 1
        ) : !column.edit ? (
          column.type==="amount" ? parseFloat(item[column.field]).toFixed(5) : item[column.field] 
        ) : (
          returnField(column,item)
        )}
      </td>
    );
  };

  const getRowSpanCount = (data, field, rowIndex) => {
    const johnIndex = data.indexOf(
      data.find((item) => item[field] === data[rowIndex][field])
    );
    if (johnIndex < rowIndex) {
      return 0;
    }

    let rowSpanCount = 1;
    rowSpanCount = data.filter(
      (item) => item[field] === data[rowIndex][field]
    )?.length;
    return rowSpanCount;
  };

  

  const update = (item)=>{
    if (item?.dpr_yn && !item?.dpr_date) {
      dispatch(Features.showToast({ flag: "bg-danger", message: "Preparation of DPR & Estimates Date is required" }));
    } else if (item?.drawings_yn && !item?.drawings_date) {
      dispatch(Features.showToast({ flag: "bg-danger", message: "Preparation of Detailed Drawings Date is required" }));
    } else if (item?.agencies_yn && !item?.agencies_date) {
      dispatch(Features.showToast({ flag: "bg-danger", message: "Selection of Agencies / Completion of Tender Process Date is required" }));
    } else if (item?.noc_yn && !item?.noc_date) {
      dispatch(Features.showToast({ flag: "bg-danger", message: "Obtained NOC after Site investigation etc Date is required" }));
    } else if (item?.construction_yn && !item?.construction_date) {
      dispatch(Features.showToast({ flag: "bg-danger", message: "Start Date of Construction/Procurement is required" }));
    } else {
      api.post(`api/proposal-after-approval/update-config-diet-plan-progress`, { ...item }, (res) => {
        setWorkingRow({});
        dispatch(Features.showToast({ message: res.message, flag: "bg-success" }));
      });
    }
    
  }

  return (
    <table className="aaa table table-bordered text-start mb-4 ">
      <thead className="thead-bg">
        <tr>
          <th rowSpan={2}>S.No.</th>
          <th rowSpan={2}>Activity</th>
          <th rowSpan={2}>Sub Activity</th>
          <th colSpan={2} className="text-center">
            Allotted
          </th>
          <th colSpan={2}>Prepration of DPR & Estimates</th>
          <th colSpan={2}>Prepration of Detailed Drawings</th>
          <th colSpan={2}>Selection of Agencies / Completion of Tender Process</th>
          <th colSpan={2}>Obtained NOC after Site investigation etc.</th>
          <th colSpan={2}>Start Date of Construction/Procurement</th>
          {/* <th colSpan={2}>Start Date of Procurement</th> */}
          <th rowSpan={2}>Remarks</th>
          <th rowSpan={2}>Action</th>
          
        </tr>

        <tr>
          <th>Physical</th>
          <th>Financial</th>
          
          <th>Y/N</th>
          <th>Start/Expected Date</th>
          <th>Y/N</th>
          <th>Start/Expected Date</th>
          <th>Y/N</th>
          <th>Start/Expected Date</th>
          <th>Y/N</th>
          <th>Start/Expected Date</th>
          <th>Y/N</th>
          <th>Start/Expected Date</th>
          {/* <th>Y/N</th>
          <th>Start/Expected Date</th> */}
        </tr>
      </thead>
      <tbody>
        {data?.map((item, rowIndex) => (
          <tr key={item.id}>
            {columns?.map((column) => renderCell(item, column, rowIndex))}
            <td>
              {item.activity_master_details_id!==workingRow.activity_master_details_id ? <button type="button" className="btn btn-primary" onClick={()=>setWorkingRow(item)}>
                <i className="fa fa-pencil" />
              </button> :
              <button type="button" className="btn btn-primary" onClick={()=>{update(item);}}>
                <i className="fa fa-save" />
              </button>}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={3} className="text-end">Total</th>
          <th className="text-end">
            {data?.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  parseFloat(currentValue.allocated_physical_quantity || 0),
                0
              )}
          </th>
          <th className="text-end">
            {data?.reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  parseFloat(currentValue.allocated_financial_amount || 0),
                0
              ).toFixed(5)}
          </th>
          <th colSpan={14}></th>
        </tr>
      </tfoot>
    </table>
  );
};

const NumberInput = ({
  defaultValue,
  currentValue,
  disabled,
  onChange,
  name,
  decimal,
}) => {
  const [value, setValue] = useState(
    Helper.numberFormat(defaultValue || 0, decimal !== false ? 5 : 0)
  );
  // const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (parseFloat(inputValue) <= 9999999999.99999 || !inputValue) {
      let roundedValue;
      if (inputValue.includes(".") && inputValue.split(".")[1].length > 5) {
        roundedValue = parseFloat(inputValue).toFixed(
          decimal !== false ? 5 : 0
        );
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
      onChange && onChange(event);
    }
  };

  return (
    <input
      type="text"
      className="form-control text-right-input"
      value={value}
      name={name}
      onFocus={(e) => {
        setValue(e.target.value.replace(/[₹,]/g, ""));
      }}
      onChange={handleChange}
      onBlur={(e) => {
        setValue(
          Helper.numberFormat(e.target.value, decimal !== false ? 5 : 0)
        );
      }}
      placeholder=""
      disabled={disabled}
    />
  );
};

const ConfigPlan = (props) => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const [diet_id, setDiet_id] = useState(user.diet_id || 0);
  const [stateID, setStateID] = useState(user.user_state_id || 0);
  const [userPer, setUserPer] = useState([]);
  const stateList = Hook.useStates();
  const [activities, setActivities] = useState(null);
  const [workingRow, setWorkingRow] = useState({});
  const [dietList, setDietList] = useState(null);

  let userData = Helper.auth?.user;

  useEffect(() => {
    getUserPer();
  }, [user, user?.user_district_id]);

  useEffect(() => {
    if(user?.diet_id){
      getActivityList()
    }
  }, [user?.diet_id]);


  const getUserPer = () => {
    api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  useEffect(() => {
    +stateID && getDietList();
  }, [stateID])

  const getDietList = () => {
    api.post(
        "api/prabandh/diet-list",
        { state_id: stateID },
        (res) => {
            if (res.status) {
                setActivities(null)
                setDietList(res.data)
                dispatch(Features.setDietMonth({ month: res.diet_progress_month }))
                localStorage.setItem("diet_progress_month", res.diet_progress_month)
            }
        }
    );
  }

  const getActivityList = () => {
    api.post(
      `api/proposal-after-approval/diet-config-activity`,
      {
        state_id: stateID,
        activity_group_code: userData?.activity_group_code,
        diet_id:diet_id
      },
      (res) => {
        setActivities(res.data);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state-list") {
      setStateID(+value);
    }
  };

  const handleInput = (e, r) => {
    setActivities((prevState) => {
      prevState = prevState.map((item) => {
        console.log(
          "item.id === r.id",
          item.activity_master_details_id,
          r.activity_master_details_id
        );
        if (item.activity_master_details_id === r.activity_master_details_id) {
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

  useEffect(() => {
    const element = document.getElementById("accorion-button");
    if (element) {
      console.log(element.className);
    }
  }, [document.getElementById("accorion-button")?.className]);

  const handleUpdateDiet = (e) => {
    setActivities(null)
    setDiet_id(e.target.value || 0);
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
        <div className="dashboard-main-content__header d-flex justify-content-between">
          <h1>
            Premilimnary Activites
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
                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="state-list"
                    value={stateID}
                    onChange={handleChange}
                    disabled={+user.user_state_id}
                  >
                    <option value={0}>State (All)</option>
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
                  <select className="form-select" name="state-list" value={diet_id} disabled={!+stateID || +user?.user_role_id === 27} onChange={handleUpdateDiet}>
                      <option value="0">--Select Diet--</option>

                      {dietList && dietList?.length > 0 &&
                          dietList?.map((st, stidx) => {
                              return (
                                  <option key={`st_${stidx}`} value={st.diet_id}> {st.diet_name} </option>
                              );
                          })}
                  </select>
                </div>

                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      if (
                        !stateID ||
                        +stateID === 0 ||
                        !diet_id ||
                        +diet_id === 0
                      ) {
                        dispatch(
                          Features.showToast({
                            message: "please select all filters",
                            flag: "bg-danger",
                          })
                        );
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
      {activities && activities.length === 0 ? <div className="dashboard-main-content-info"><h3 className="text-center">No Data Found</h3></div> : activities?.length > 0 && (
        <div className="dashboard-main-content-info">
          
          <div className="d-flex justify-content-between" >
            <h6 className="year-info-1">
              <span>
                {
                  model.monthsOfYear.find(
                    (item) => item.value === localStorage.getItem("diet_progress_month")
                  )?.name
                }
              </span>
            </h6>
            <h6 className="text-end" style={{ color: "#2b4a91" }}>
              {Settings.AllRsInLacksLabel}
            </h6>
          </div>

          <div className="table-responsive progress-tracking">
            {activities.length > 0 && (
              <>
                <DynamicTable
                  data={activities}
                  columns={[
                    { field: "index", rowSpan: false },
                    { field: "activity_master_name", rowSpan: true },
                    { field: "activity_master_details_name",rowSpan: true },
                    {
                      field: "allocated_physical_quantity",
                      rowSpan: false,
                      type: "number"
                    },
                    {
                      field: "allocated_financial_amount",
                      rowSpan: false,
                      type: "amount"
                    },
                    {
                      field: "dpr_yn",
                      rowSpan: false,
                      edit: true,
                      type: Boolean
                    },
                    {
                      field: "dpr_date",
                      rowSpan: false,
                      edit: true,
                      type: "date"
                    },
                    {
                      field: "drawings_yn",
                      rowSpan: false,
                      edit: true,
                      type: Boolean
                    },
                    {
                      field: "drawings_date",
                      rowSpan: false,
                      edit: true,
                      type: "date",
                    },
                    {
                      field: "agencies_yn",
                      rowSpan: false,
                      edit: true,
                      type: Boolean
                    },
                    {
                      field: "agencies_date",
                      rowSpan: false,
                      edit: true,
                      type: "date",
                    },
                    {
                      field: "noc_yn",
                      rowSpan: false,
                      edit: true,
                      type: Boolean
                    },
                    {
                      field: "noc_date",
                      rowSpan: false,
                      edit: true,
                      type: "date",
                    },
                    {
                      field: "construction_yn",
                      rowSpan: false,
                      edit: true,
                      type: Boolean
                    },
                    {
                      field: "construction_date",
                      rowSpan: false,
                      edit: true,
                      type: "date",
                    },
                    // {
                    //   field: "procurement_yn",
                    //   rowSpan: false,
                    //   edit: true,
                    //   type: Boolean
                    // },
                    // {
                    //   field: "procurement_date",
                    //   rowSpan: false,
                    //   edit: true,
                    //   type: "date",
                    // },
                    {
                      field: "remarks",
                      rowSpan: false,
                      edit: true,
                      type: "text",
                    },
                  ]}
                  handleInput={handleInput}
                  workingRow={workingRow} 
                  setWorkingRow={setWorkingRow}
                  setActivities={setActivities}
                />
              </>
            )}
          </div>

        </div>)

      }
    </div>
  );
};

export default ConfigPlan;
