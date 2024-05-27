import React, { useState, useEffect } from "react";
import {
  Helper,
  Hook,
  AlertMessages,
  API,
  sweetAlert,
  Column,
} from "../../../../apps";
import Features from "../../../../redux/features";
import { useDispatch } from "react-redux";
import model from "../../../../apps/utilities/model";

const DynamicTable = ({ data, columns, handleInput, schoolID }) => {
  const renderCell = (item, column, rowIndex) => {
    if (column.rowSpan) {
      const rowSpanCount = getRowSpanCount(data, column.field, rowIndex);
      return rowSpanCount > 1 ? (
        <td rowSpan={rowSpanCount}>{item[column.field]}</td>
      ) : rowSpanCount === 0 ? (
        []
      ) : (
        <td>{item[column.field]}</td>
      );
    }
    return (
      <td>
        {column.field === "index" ? (
          rowIndex + 1
        ) : !column.edit ? (
          item[column.field]
        ) : (
          <NumberInput
            name={column.field}
            defaultValue={item[column.field] || 0}
            currentValue={item[column.field] || 0}
            decimal={column.type === "amount"}
            onChange={(e) => {
              handleInput(e, item);
            }}
          />
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

  return (
    <table className="aaa table table-bordered text-start mb-4 progress-tracking">
      <thead>
        <tr>
          {Column.schoolProgressParentHeader(schoolID).map((itm, idx) => {
            return (
              <th
                className={itm?.className}
                key={idx}
                rowSpan={itm?.rowSpan}
                colSpan={itm?.colSpan}
              >
                {" "}
                {itm?.name}{" "}
              </th>
            );
          })}
        </tr>
        <tr>
          {Column.schoolProgressChildHeader(schoolID).map((itm, idx) => {
            return (
              <th
                className={itm?.className}
                key={idx}
                rowSpan={itm?.rowSpan}
                colSpan={itm?.colSpan}
              >
                {" "}
                {itm?.name}{" "}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={item.id}>
            {columns.map((column) => renderCell(item, column, rowIndex))}
          </tr>
        ))}
      </tbody>
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

const SchoolProgress = () => {
  const dispatch = useDispatch();
  const selectMonth = localStorage.getItem("progress_month");
  const user = Helper.auth.user;
  const schoolID = user?.udise_sch_code;
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let st = user?.state_id;
    let dt = user?.district_id;

    setStateID(+st);
    getDistrictsList(+st);
    getSchoolsList(st, dt);
    setTimeout(() => {
      if (districtID !== 0) {
        setDistrictID(districtID);
      } else {
        setDistrictID(+dt);
      }
    }, 1000);

  }, [user]);

  useEffect(() => {
    getActivityList(schoolID);
  }, [schoolID, districtID, schoolID]);

  const getSchoolsList = (state_id, district_id) => {
    API.post(
      `api/proposal-after-approval/school-list`,
      { district_id, state_id: state_id },
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

  const getActivityList = (asset_code) => {
    API.post(
      `api/proposal-after-approval/school-activity`,
      {
        district_id: districtID,
        state_id: stateID,
        asset_code,
        month: selectMonth,
      },
      (res) => {
        setActivities(res.data);
      }
    );
  };

  const getDistrictsList = (state_id = 0) => {
    const data = state_id === 0 ? null : { district_state_id: state_id };

    API.post(`api/districts/find`, data, (res) => {
      setDistrictsList(res.data);
    });
  };

  const handleInput = (e, r) => {
    setActivities((prevState) => {
      prevState = prevState.map((item) => {
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
      sweetAlert.warning(AlertMessages.dataExceedsTotal);
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

  return (
    <div className="dashboard-main-content">
      <div style={{ display: "flex", justifyContent: "flex-end" }}></div>

      <div className="dashboard-main-content__header d-flex justify-content-between">
        <h1>
          Progress By Activity (
          {model.monthsOfYear.find((item) => item.value === selectMonth)?.name})
        </h1>
      </div>

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
                  disabled={true}
                >
                  <option value={0}>State (All)</option>
                  {stateList?.map((st, stidx) => (
                    <option key={`st_${stidx}`} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  name="districts-list"
                  value={districtID}
                  disabled={true}
                >
                  <option value={0}>District (All)</option>
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
                  disabled={true}
                >
                  <option value={0}>School (All)</option>
                  {schoolsList?.length > 0 &&
                    schoolsList.map((ds, dsidx) => (
                      <option key={`ds_${dsidx}`} value={ds.id}>
                        {ds.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content-info">
        {activities.length > 0 ? (
          <>
            <div className="accordion contribute-page" id="accordionExample">
              {Object?.entries(
                activities?.reduce((result, currentItem) => {
                  const { scheme_name, ...rest } = currentItem;
                  if (result[scheme_name]) {
                    result[scheme_name].push(rest);
                  } else {
                    result[scheme_name] = [rest];
                  }
                  return result;
                }, {}) || {}
              ).map(([scheme, data]) => (
                <div className="accordion-item" key={scheme + "aaaa"}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapseOne${scheme.replace(" ", "")}`}
                      aria-expanded="true"
                      aria-controls={`collapseOne${scheme.replace(" ", "")}`}
                    >
                      {scheme} ({data?.length} Activities)
                    </button>
                  </h2>

                  <div
                    id={`collapseOne${scheme.replace(" ", "")}`}
                    className={`accordion-collapse collapse ${
                      activities.length === 1 ? "show" : ""
                    }`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body" style={{ padding: "5px" }}>
                      <div className="table-responsive">
                        {data.length > 0 && (
                          <>
                            <DynamicTable
                              data={data}
                              columns={Column.schoolProgressData(schoolID)}
                              handleInput={handleInput}
                              schoolID={schoolID}
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
                className="btn btn-success"
                onClick={() => saveProgressActivity()}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h4>No Data Found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolProgress;
