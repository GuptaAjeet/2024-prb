import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helper } from "../../../apps";
import { useDispatch } from "react-redux";
import Features from "../../../redux/features";
import api from "../../../apps/utilities/api";
//import settings from "../../../apps/utilities/settings";
import { Modal } from "../../../apps/components/elements";
import SchoolList from "./School/SchoolList";
import sweetAlert from "../../../apps/utilities/sweetalert";

// const CurrencyInput = ({ defaultValue, disabled, onChange, name }) => {
//   const [value, setValue] = useState(
//     Helper.accountFormat(defaultValue || 0, 5)
//   );
//   // const [value, setValue] = useState(defaultValue);

//   const handleChange = (event) => {
//     const inputValue = event.target.value;

//     if (parseFloat(inputValue) <= 9999999999.99999 || !inputValue) {
//       let roundedValue;
//       if (inputValue.includes(".") && inputValue.split(".")[1].length > 5) {
//         roundedValue = parseFloat(inputValue).toFixed(5);
//       } else if (
//         inputValue.includes(".") &&
//         inputValue.split(".")[1].length == 0
//       ) {
//         roundedValue = parseFloat(inputValue) + ".";
//       } else {
//         roundedValue = isNaN(parseFloat(inputValue))
//           ? ""
//           : parseFloat(inputValue);
//       }
//       setValue(roundedValue);
//       event.target.value = roundedValue;
//       onChange(event);
//     }
//   };

//   return (
//     <input
//       type="text"
//       className="form-control text-right-input"
//       value={value}
//       name={name}
//       onFocus={(e) => {
//         setValue(e.target.value.replace(/[₹,]/g, ""));
//       }}
//       onChange={handleChange}
//       onBlur={(e) => {
//         setValue(Helper.accountFormat(e.target.value, 5));
//       }}
//       placeholder=""
//       disabled={disabled}
//     />
//   );
// };

const NumberInput = ({ defaultValue, disabled, onChange, name, decimal }) => {
  const [value, setValue] = useState(
    Helper.numberFormat(defaultValue || 0, decimal !== false ? 5 : 0)
  );
  const handleChange = (event) => {
    const inputValue = event.target.value;

    if (parseFloat(inputValue) <= 9999999999.99999 || !inputValue) {
      let roundedValue;
      if (inputValue.includes(".") && inputValue.split(".")[1].length > 5) {
        roundedValue = parseFloat(inputValue).toFixed(5);
      } else if (
        inputValue.includes(".") &&
        inputValue.split(".")[1].length === 0
      ) {
        if (!decimal && decimal !== undefined) {
          roundedValue = parseFloat(inputValue);
        } else {
          roundedValue = parseFloat(inputValue) + ".";
        }
      } else {
        roundedValue = isNaN(parseFloat(inputValue)) ? "" : inputValue;
      }
      setValue(roundedValue);
      event.target.value = parseFloat(roundedValue);
      onChange(event);
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

const Allocation = () => {
  const user = Helper.auth.user;

  //const [filter, setFilter] = useState({scheme_id:"", major_component_id: "", sub_component_id: "", activity_id : ""});
  //const [schemesList, setSchemesList] = useState([]);
  //const [majorCompList, SetMajorCompList] = useState([]);
  //const [subCompList, SetSubCompList] = useState([]);
  //const [activities, setActivities] = useState([]);
  //const [activitiesDetail, setActivitiesDetail] = useState([]);
  const [approvedData, setApprovedData] = useState({});
  const [allocationList, setAllocationList] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const [initialParams, setInitialParams] = useState({
    activity: null,
    activityDetails: null,
  });
  const [schoolMode, setSchoolMode] = useState(null);
  const [stateId, setStateId] = useState(0);
  const [viewSchools, setViewSchools] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const [checkLocked, setCheckLocked] = useState(false);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [totalValueObject, setTotalValueObject] = useState({});
  const [allowStateToEnterData, setAllowStateToEnterData] = useState(false);

  useEffect(() => {
    setInitialParams(location.state);
    const activityDetailsId = +location?.state?.activityDetails.id;
    if (activityDetailsId) {
      getAllocationList(activityDetailsId, location.state.state_id);
      setSchoolMode(+location.state.activityDetails.dd_school);
      setStateId(location.state.state_id);
    }
    setTimeout(() => {
      const a = document.getElementById("state_edit_check")?.checked;
      if (document.getElementById("state_edit_check")?.checked)
        setAllowStateToEnterData(true);
    }, 200);
  }, [refresh]);
  const getAllocationList = (activity_master_details_id, state) => {
    setAllocationList([]);
    api.post( 
      "api/prabandh/allocation-list",
      {
        state_id: state === 0 ? user.user_state_id : state,
        activity_master_details_id,
      },
      (res) => {
        setApprovedData(res.data.approved[0]);
        setAllocationList(res.data.data);
        setTotalValueObject(res?.data?.total);

        setCheckLocked(() => {
          return +res?.data?.data[0]?.status === 6 ? true : false;
        });
      }
    );
  };
  const updateAllocationListState = () => {
    let totalFinancila = allocationList.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.allocated_financial_amount || 0),
      0
    );
    let totalPhysicalQuantity = allocationList.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.allocated_physical_quantity || 0),
      0
    );
    if (
      +totalFinancila.toFixed(5) ===
        +(+approvedData?.proposed_financial_amount).toFixed(5) &&
      +totalPhysicalQuantity === +approvedData?.proposed_physical_quantity
    ) {
      api.post(
        "api/prabandh/update-allocation-list-state",
        {
          state_id: stateId === 0 ? user.user_state_id : stateId,
          allocationList,
        },
        (res) => {
          dispatch(
            Features.showToast({
              message: res?.message,
              flag: "bg-success",
            })
          );
          setRefresh(new Date().getMilliseconds());
        }
      );
    } else if (
      +totalPhysicalQuantity !== +approvedData.proposed_physical_quantity
    ) {
      dispatch(
        Features.showToast({
          message: `Allocated Physical Quantity Should be equal to Approved Quantity.`,
          flag: "bg-danger",
        })
      );
    } else {
      dispatch(
        Features.showToast({
          message: `Financial Amount should be equal to Budget Approved Amount.`,
          flag: "bg-danger",
        })
      );
    }
  };

  /*   const copyProposedData = () => {
    setAllocationList([]);
    setTimeout(() => {
      setAllocationList(
        allocationList.map((a) => ({
          ...a,
          allocated_physical_quantity: +a.proposed_physical_quantity,
          allocated_financial_amount: +a.proposed_financial_amount,
        }))
      );
    }, 100);
  }; */

  const getAllocationSchoolList = (data) => {
    setSchoolList([]);
    api.post(
      "api/prabandh/allocation-schools-list",
      {
        state_id: stateId === 0 ? user?.user_state_id : stateId,
        dataObj: data,
      },
      (res) => {
        setSchoolList(res?.data);
        setViewSchools(true);
        dispatch(
          Features.showModal({
            title: "View Schools",
            size: "lg",
          })
        );
      }
    );
  };

  const openSchoolList = (data) => {
    getAllocationSchoolList(data);
  };

  const lockThisActivity = () => {
    const apq_calculated = allocationList
      .reduce(
        (accumulator, currentValue) =>
          accumulator +
          parseFloat(currentValue.allocated_physical_quantity || 0),
        0
      )
      .toFixed(5);

    const afa_calculated = allocationList
      .reduce(
        (accumulator, currentValue) =>
          accumulator +
          parseFloat(currentValue.allocated_financial_amount || 0),
        0
      )
      .toFixed(5);
    let totalPhysicalQuantity = allocationList.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.allocated_physical_quantity || 0),
      0
    );
    const apq_fetched = (+approvedData.proposed_physical_quantity).toFixed(5);
    const pfa_fetched = (+approvedData.proposed_financial_amount).toFixed(5);
    if (+apq_calculated === +apq_fetched && +afa_calculated === +pfa_fetched) {
      api.post(
        "api/prabandh/allocation-form-lock",
        {
          state_id: stateId === 0 ? user?.user_state_id : stateId,
          dataObj: initialParams,
          allocationList,
        },
        (res) => {
          setRefresh(new Date().getMilliseconds());
          sweetAlert.done({ msg: `Locked Successfully.` });
        }
      );
    } else if (
      +totalPhysicalQuantity !== +approvedData.proposed_physical_quantity
    ) {
      sweetAlert.warning(
        `Allocated Physical Quantity & Approved Quantity Must Be Exact Equal`
      );
    } else {
      sweetAlert.warning(
        `Financial Amount should be equal to Approved Amount.`
      );
    }
  };

  const handleStateChkBK = (event, data) => {
    if (event.target.checked) {
      sweetAlert.confirmation({
        title: "Are you sure?",
        msg: `You want to ${
          event.target.checked ? "enter state data." : "not enter state date."
        }`,
        yesBtnText: "Yes",
        noBtnText: "No",
        url: "",
        callback: () => setAllowStateToEnterData(true),
        cancelCallback: () => {
          setAllowStateToEnterData(false);
          const a = document.getElementById("state_edit_check");
          a.checked = false;
        },
        redirect: "",
      });
    } else {
      setAllowStateToEnterData(false);
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>ALLOCATION ({allocationList.length>0 && allocationList.find(itm=>+itm.district_id===0)?.district_name})</h1>

        <div className="dashboard-main-content-info table-container mt-3">
          <div className="d-flex justify-content-between m-d-block">
            <h5>
              <strong>
                {initialParams?.activityDetails?.activity_master_details_name ??
                  ""}
              </strong>
            </h5>

            {approvedData?.eligible_for_allocation === "0" && (
              <span
                className="text-danger"
                style={{ fontSize: "16px", fontWeight: "600" }}
              >
                State Coordinator Not Freezed This Activity Detail Yet.
              </span>
            )}

            <div>
              <button className="btn btn-primary">
                <Link
                  to="/auth/allocation/admin"
                  className="bi bi-arrow-left text-white font-size-16"
                  state={{
                    backParams: initialParams,
                  }}
                >
                  {" "}
                  Back
                </Link>
              </button>
            </div>
          </div>

          <div className="table-responsive mb-3">
            <table
              cellPadding={5}
              cellSpacing={5}
              className={`table table-bordered mt-3 mb-0 ${
                approvedData?.eligible_for_allocation === "0" ? "opac3" : ""
              }`}
            >
              <tbody>
                <tr>
                  <td className="bg-light">Scheme : </td>
                  <td>{initialParams?.activityDetails?.scheme_name ?? ""}</td>
                  <td className="bg-light">Major Component :</td>
                  <td>
                    {initialParams?.activityDetails?.major_component_name ?? ""}
                  </td>
                </tr>
                <tr>
                  <td className="bg-light">Sub Component :</td>
                  <td>
                    {initialParams?.activityDetails?.sub_component_name ?? ""}
                  </td>
                  <td className="bg-light">Activity Master :</td>
                  <td>
                    {initialParams?.activityDetails?.activity_master_name ?? ""}
                  </td>
                </tr>
                <tr>
                  <td className="bg-light">Approved Quantity :</td>
                  <td>
                    {/* <span className="text-danger">Physical Quantity</span> 📦 :{" "} */}
                    {(+approvedData?.proposed_physical_quantity).toFixed(0) || 0}
                  </td>
                  <td className="bg-light">
                    <span className="text-success">Approved Amount ✅</span> :{" "}
                    {/* {Helper.accountFormat(
                      approvedData?.proposed_financial_amount || 0
                    )} */}
                  </td>
                  <td>
                    {(+approvedData?.proposed_financial_amount)?.toFixed(5) || 0}{" "}
                    (₹ in Lakh)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-responsive mb-3">
            <table className="table allocation-table mb-0">
              <thead>
                <tr>
                  <th rowSpan={2}>S. No.</th>
                  <th rowSpan={2}>District</th>
                  <th
                    colSpan={2}
                    className="th-text-center"
                    style={{ textAlign: "center" }}
                  >
                    Proposed
                  </th>
                  <th
                    colSpan={2}
                    className="th-text-center"
                    style={{ textAlign: "center" }}
                  >
                    Allocation
                  </th>
                  {schoolMode ? <th rowSpan={2}>School</th> : ""}
                </tr>
                <tr>
                  <th>Physical Quantity</th>
                  <th style={{ textAlign: "center" }}>Financial Amount</th>
                  <th>Physical Quantity</th>
                  <th>
                    Financial Amount
                    {/* {allocationList?.length > 0 &&
                      approvedData?.eligible_for_allocation !== "0" && (
                        <button
                          className="btn btn-dark btn-sm"
                          style={{ float: "right" }}
                          onClick={copyProposedData}
                          disabled={checkLocked}
                        >
                          Copy 📋
                        </button>
                      )} */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allocationList?.length > 0 ? (
                  allocationList?.map((item, i) => (
                    <tr key={i}>
                      <td
                        className={`${
                          +item.district_id === 0 ? "lightblue" : ""
                        }`}
                      >
                        {i + 1}{" "}
                        {+item.district_id === 0 && +item["status"] !== 6 && (
                          <input
                            type="checkbox"
                            id="state_edit_check"
                            disabled={
                              +approvedData?.eligible_for_allocation === 0 ||
                              +item["status"] === 6 ||
                              schoolMode
                                ? true
                                : false
                            }
                            defaultChecked={
                              +item["allocated_physical_quantity"] ||
                              +item["allocated_financial_amount"]
                            }
                            onChange={(e) => handleStateChkBK(e, item)}
                          />
                        )}
                      </td>
                      <td
                        className={`${
                          +item.district_id === 0 ? "lightblue" : ""
                        }`}
                      >
                        {/* {`${item.district_name} ${
                          +item.district_id === 0 ? "(State)" : ""
                        }`} */}

                        {+item.district_id === 0 ? "State-level Allocation (if any)" : item.district_name}
                      </td>
                      <td
                        className={`${
                          +item.district_id === 0 ? "lightblue" : ""
                        }`}
                      >
                        <NumberInput
                          defaultValue={item["proposed_physical_quantity"] || 0}
                          disabled
                          decimal={false}
                        />
                      </td>
                      <td
                        className={`${
                          +item.district_id === 0 ? "lightblue" : ""
                        }`}
                      >
                        <NumberInput
                          defaultValue={item["proposed_financial_amount"]}
                          disabled
                        />
                      </td>
                      <td
                        className={`${
                          +item.district_id === 0 ? "lightblue" : ""
                        }`}
                      >
                        {+item.district_id === 0 ? (
                          allowStateToEnterData ? (
                            <NumberInput
                              defaultValue={item["allocated_physical_quantity"]}
                              name="allocated_physical_quantity"
                              onChange={(e) => {
                                setAllocationList((prevState) => {
                                  prevState[i][e.target.name] = +e.target.value;
                                  return [...prevState];
                                });
                              }}
                              disabled={
                                +approvedData?.eligible_for_allocation === 0 ||
                                +item["status"] === 6 ||
                                schoolMode
                                  ? true
                                  : false
                              }
                              decimal={false}
                            />
                          ) : (
                            <NumberInput
                              defaultValue={item["allocated_physical_quantity"]}
                              name="allocated_physical_quantity"
                              onChange={(e) => {
                                setAllocationList((prevState) => {
                                  prevState[i][e.target.name] = +e.target.value;
                                  return [...prevState];
                                });
                              }}
                              decimal={false}
                              disabled={
                                +approvedData?.eligible_for_allocation === 0 ||
                                schoolMode ||
                                !allowStateToEnterData
                                  ? true
                                  : false
                              }
                            />
                          )
                        ) : (
                          <NumberInput
                            defaultValue={item["allocated_physical_quantity"]}
                            name="allocated_physical_quantity"
                            onChange={(e) => {
                              setAllocationList((prevState) => {
                                prevState[i][e.target.name] = +e.target.value;
                                return [...prevState];
                              });
                            }}
                            disabled={
                              +approvedData?.eligible_for_allocation === 0 ||
                              +item["status"] === 6 ||
                              schoolMode
                                ? true
                                : false
                            }
                            decimal={false}
                          />
                        )}
                      </td>
                      <td
                        className={`${
                          +item.district_id === 0 ? "lightblue" : ""
                        }`}
                      >
                        {+item.district_id === 0 ? (
                          allowStateToEnterData ? (
                            <NumberInput
                              defaultValue={item["allocated_financial_amount"]}
                              name="allocated_financial_amount"
                              onChange={(e) => {
                                setAllocationList((prevState) => {
                                  prevState[i][e.target.name] = +e.target.value;
                                  return [...prevState];
                                });
                              }}
                              disabled={
                                +approvedData?.eligible_for_allocation === 0 ||
                                +item["status"] === 6 ||
                                schoolMode
                                  ? true
                                  : false
                              }
                            />
                          ) : (
                            <NumberInput
                              defaultValue={item["allocated_financial_amount"]}
                              name="allocated_financial_amount"
                              onChange={(e) => {
                                setAllocationList((prevState) => {
                                  prevState[i][e.target.name] = +e.target.value;
                                  return [...prevState];
                                });
                              }}
                              disabled={
                                +approvedData?.eligible_for_allocation === 0 ||
                                schoolMode ||
                                (!allowStateToEnterData ? true : false)
                              }
                            />
                          )
                        ) : (
                          <NumberInput
                            defaultValue={item["allocated_financial_amount"]}
                            name="allocated_financial_amount"
                            onChange={(e) => {
                              setAllocationList((prevState) => {
                                prevState[i][e.target.name] = +e.target.value;
                                return [...prevState];
                              });
                            }}
                            disabled={
                              +approvedData?.eligible_for_allocation === 0 ||
                              +item["status"] === 6 ||
                              schoolMode
                                ? true
                                : false
                            }
                          />
                        )}
                      </td>
                      {schoolMode ? (
                        <td
                          className={`${
                            +item.district_id === 0 ? "lightblue" : ""
                          }`}
                        >
                          <button
                            className="btn btn-sm btn-light"
                            onClick={() => openSchoolList(item)}
                          >
                            👁️‍🗨️ View
                          </button>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="norecords">
                      No Recors
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3}>
                    Total (
                    {allocationList.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        parseFloat(currentValue.proposed_physical_quantity || 0),
                      0
                    )}
                    )
                  </th>
                  <th>
                    Total (
                    {allocationList
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          parseFloat(currentValue.proposed_financial_amount || 0),
                        0
                      )
                      .toFixed(5)}
                    )
                  </th>
                  <th className={`${+approvedData?.proposed_physical_quantity<allocationList.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        parseFloat(currentValue.allocated_physical_quantity || 0),
                      0
                    ) ? "text-danger" : "" } `}>
                    {allocationList.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        parseFloat(currentValue.allocated_physical_quantity || 0),
                      0
                    )}
                  </th>
                  <th className={`${+approvedData?.proposed_financial_amount<allocationList
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          parseFloat(
                            currentValue.allocated_financial_amount || 0
                          ),
                        0
                      ) ? "text-danger" : "" } `}>
                    {allocationList
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          parseFloat(
                            currentValue.allocated_financial_amount || 0
                          ),
                        0
                      )
                      .toFixed(5)}
                  </th>
                  {schoolMode ? <th></th> : ""}
                </tr>
              </tfoot>
            </table>
          </div>

          {allocationList.length > 0 && !checkLocked && (
            <div className="text-end">
              <button
                className="btn btn-primary lock-span"
                disabled={+approvedData?.eligible_for_allocation === 0}
                onClick={lockThisActivity}
              >
                <i className="fa-solid fa-lock lock-icon"></i>
              </button>
              {initialParams.activityDetails.dd_school !== "1" && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={updateAllocationListState}
                  disabled={
                    schoolMode || approvedData?.eligible_for_allocation === "0"
                  }
                >
                  Save
                </button>
              )}
            </div>
          )}

          {viewSchools && (
            <Modal close={() => setViewSchools(false)} size="lg">
              <div
                className="row"
                style={{ maxHeight: "400px", "--bs-gutter-x": "unset" }}
              >
                <SchoolList schoolList={schoolList} />
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};
export default Allocation;
