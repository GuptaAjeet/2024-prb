import React, { useState, useRef, useEffect } from "react";
import { Hook, Model } from "../../../../apps";
import api from "../../../../apps/utilities/api";
import sweetAlert from "../../../../apps/utilities/sweetalert";
import { subDays, format } from "date-fns";
// import $ from "jquery";

const ProgressMonth = ({diet}) => {
  const [activeState, setActiveState] = useState(0);
  // const [state, setState] = useState();
  const [month, setMonth] = useState();
  const [monthFrom, setMonthFrom] = useState('');
  const [monthTo, setMonthTo] = useState();
  
  const [monthFromDist, setMonthFromDist] = useState('');
  const [monthToDist, setMonthToDist] = useState();

  const [savedData, setSavedData] = useState([]);
  const handleDatesFrom = useRef();
  const handleDatesTo = useRef();
  const handleDatesFromDist = useRef();
  const handleDatesToDist = useRef();
  // const stateList = Hook.useStates();

  // const minMaxDates = {
  //   1: {
  //     min: `${new Date().getFullYear()}-05-01`,
  //     max: `${new Date().getFullYear()}-05-31`,
  //   },
  //   2: {
  //     min: `${new Date().getFullYear()}-06-01`,
  //     max: `${new Date().getFullYear()}-06-30`,
  //   },
  //   3: {
  //     min: `${new Date().getFullYear()}-07-01`,
  //     max: `${new Date().getFullYear()}-07-31`,
  //   },
  //   4: {
  //     min: `${new Date().getFullYear()}-08-01`,
  //     max: `${new Date().getFullYear()}-08-31`,
  //   },
  //   5: {
  //     min: `${new Date().getFullYear()}-09-01`,
  //     max: `${new Date().getFullYear()}-09-30`,
  //   },
  //   6: {
  //     min: `${new Date().getFullYear()}-10-01`,
  //     max: `${new Date().getFullYear()}-10-31`,
  //   },
  //   7: {
  //     min: `${new Date().getFullYear()}-11-01`,
  //     max: `${new Date().getFullYear()}-11-30`,
  //   },
  //   8: {
  //     min: `${new Date().getFullYear()}-12-01`,
  //     max: `${new Date().getFullYear()}-12-31`,
  //   },
  //   9: {
  //     min: `${new Date().getFullYear()}-01-01`,
  //     max: `${new Date().getFullYear()}-01-31`,
  //   },
  //   10: {
  //     min: `${new Date().getFullYear()}-02-01`,
  //     max: `${new Date().getFullYear()}-02-29`,
  //   },
  //   11: {
  //     min: `${new Date().getFullYear()}-03-01`,
  //     max: `${new Date().getFullYear()}-03-31`,
  //   },
  //   12: {
  //     min: `${new Date().getFullYear()}-04-01`,
  //     max: `${new Date().getFullYear()}-04-30`,
  //   },
  // };

  useEffect(() => {
    if(!diet){
      api.get("api/prabandh/progress-month-data", null, (res) => {
        setSavedData(res.data);
      });
    }else{
      api.get("api/prabandh/diet-progress-month-data", null, (res) => {
        setSavedData(res.data);
      });
    }
  }, [activeState, diet]);

  /*   const fetchSavedData = (state) => {
    api.post(
      "api/prabandh/progress-active-month-data",
      { state: state },
      (res) => {
        setSavedData(res.data);
      }
    );
  }; */

  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1
      }-${date.getFullYear()}`;
    return formattedDate;
  };


  
  const handleActiveProgressMonth = () => {
    if (diet ? (activeState && month && monthFrom && monthTo) : (activeState && month && monthFrom && monthTo && monthFromDist && monthToDist)) {
      api.post(
        "api/prabandh/configure-progress-active-month",
        { payload: { activeState, month, monthFrom, monthTo, monthFromDist, monthToDist, diet } },
        (res) => {
          if (res.data === "Inserted Successfully") {
            setMonthFrom("");
            setMonthTo("");
            setMonthFromDist("");
            setMonthToDist("");
            setMonth("");
            setActiveState(0);
            sweetAlert.done({ msg: `Data saved successfully!` });
          } else {
            setMonthFrom("");
            setMonthTo("");
            setMonthFromDist("");
            setMonthToDist("");
            setMonth("");
            sweetAlert.warning({ msg: `Data not saved!` });
          }
        }
      );
    } else {
      sweetAlert.warning("All fields are mandatory!!");
    }
  };
  // const lebel_style = { color: "white" };

  const calculateDates = (e) => {
    setMonthFrom("");
    setMonthTo("");
    setMonthFromDist("");
    setMonthToDist("");
    handleDatesFrom.current.value = "";
    handleDatesTo.current.value = "";
    if(!diet){
      handleDatesFromDist.current.value = "";
      handleDatesToDist.current.value = "";
    }
    setMonth(e.target.value);
  };

  const MonthSelection = () => {
    return (
      <select
        className="form-select border border-warning-subtle "
        name="month"
        defaultValue={month}
        onChange={(e) => calculateDates(e)}
      >
        <option value={0}>State Month</option>
        {Model.monthsOfYear.map((itm) => (
          <option key={+itm.key} value={itm.value}>
            {itm.name}
          </option>
        ))}
      </select>
    );
  };

  const FromDate = () => {
    return (
      <input
        ref={handleDatesFrom}
        type="date"
        id="from"
        min={format(new Date(), 'yyyy-MM-dd')}
        value={monthFrom}
        className="form-select border border-warning-subtle"
        onChange={(e) => setMonthFrom(e.target.value)}
        onKeyDown={(e) => e.preventDefault()}
      /* min={month ? minMaxDates[month].min : null}
      max={month ? minMaxDates[month].max : null} */
      />
    );
  };

  const ToDate = () => {
    return (
      <div style={{ position: "relative" }}>
        <input
          ref={handleDatesTo}
          type="date"
          id="to"
          // style={{ cursor: monthFrom?.length === 0 ? "not-allowed" : "pointer" }}
          disabled={monthFrom?.length === 0}
          value={monthTo}
          className="form-select border border-warning-subtle"
          onChange={monthFrom?.length === 0 ? (e) => setMonthTo("") : (e) => setMonthTo(e.target.value)}
          /* max={month ? minMaxDates[month].max : null} */
          min={monthFrom}
        />
        <i className={`bi bi-calendar-fill ${monthFrom?.length === 0 ? "" : "d-none"}`} style={{ position: "absolute", top: "8px", right: "12px" }}></i>
      </div>
    );
  };

  const FromDateDist = () => {
    return (
      <input
        ref={handleDatesFromDist}
        type="date"
        id="from"
        min={format(new Date(), 'yyyy-MM-dd')}
        value={monthFromDist}
        className="form-select border border-warning-subtle"
        onChange={(e) => setMonthFromDist(e.target.value)}
        onKeyDown={(e) => e.preventDefault()}
      /* min={month ? minMaxDates[month].min : null}
      max={month ? minMaxDates[month].max : null} */
      />
    );
  };

  const ToDateDist = () => {
    return (
      <div style={{ position: "relative" }}>
        <input
          ref={handleDatesToDist}
          type="date"
          id="to"
          // style={{ cursor: monthFrom?.length === 0 ? "not-allowed" : "pointer" }}
          disabled={monthFrom?.length === 0}
          value={monthToDist}
          className="form-select border border-warning-subtle"
          onChange={monthFrom?.length === 0 ? (e) => setMonthToDist("") : (e) => setMonthToDist(e.target.value)}
          /* max={month ? minMaxDates[month].max : null} */
          min={monthFrom}
        />
        <i className={`bi bi-calendar-fill ${monthFrom?.length === 0 ? "" : "d-none"}`} style={{ position: "absolute", top: "8px", right: "12px" }}></i>
      </div>
    );
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <h1 style={{ display: "inline-block" }}>Configure {diet && "DIET"} Progress Month</h1>
      </div>

      <div className="col-md-12 pb-2 mt-2">
        <div className="dashboard-main-content-info clear">
          <div className="row">
            <div className="col-lg-12 table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>STATE NAME</th>
                    <th>MONTH</th>
                    
                    {diet ? <>
                      <th>ACTIVE FROM</th>
                      <th>ACTIVE TO</th>
                    </> :
                    <>
                      <th>ACTIVE State FROM</th>
                      <th>ACTIVE State TO</th>
                      <th>ACTIVE District FROM</th>
                      <th>ACTIVE District TO</th>
                    </>}

                    <th>PLAN YEAR</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {savedData.length > 0 ? (
                    savedData.map((s, idx) => {
                      return (
                        <tr
                          key={`S_${s.state_progress_active_month_id}`}
                          className="alert alert-light fLarger text-black"
                          role="alert"
                        >
                          <td className="bg-light text-black">{idx + 1}</td>
                          <td>{s.state_name}</td>
                          <td>
                            {activeState === s.state_id ? (
                              <MonthSelection
                                key={s.state_progress_active_month_id}
                              />
                            ) : (
                              <span
                                className={`badge fLarger`}
                                style={{ color: "#28a745" }}
                              >
                                {Model.monthsOfYear.filter(
                                  (t) => t.value === s?.month_id
                                )[0].name ?? ""}
                              </span>
                            )}
                          </td>
                          {diet ? <>
                            <td>
                              {activeState === s.state_id ? (
                                <FromDate
                                  key={`FD_${s.state_progress_active_month_id}`}
                                />
                              ) : (
                                convertDateFormat(s.progress_from_date)
                              )}
                            </td>
                            <td>
                              {activeState === s.state_id ? (
                                <ToDate
                                  key={`TD_${s.state_progress_active_month_id}`}
                                />
                              ) : (
                                convertDateFormat(s.progress_to_date)
                              )}
                            </td>
                          </> : 
                          <>
                            <td>
                              {activeState === s.state_id ? (
                                <FromDate
                                  key={`FD_${s.state_progress_active_month_id}`}
                                />
                              ) : (
                                convertDateFormat(s.progress_from_date)
                              )}
                            </td>
                            <td>
                              {activeState === s.state_id ? (
                                <ToDate
                                  key={`TD_${s.state_progress_active_month_id}`}
                                />
                              ) : (
                                convertDateFormat(s.progress_to_date)
                              )}
                            </td>
                            <td>
                              {activeState === s.state_id ? (
                                <FromDateDist
                                  key={`FD_${s.state_progress_active_month_id}`}
                                />
                              ) : (
                                convertDateFormat(s.progress_from_date)
                              )}
                            </td>
                            <td>
                              {activeState === s.state_id ? (
                                <ToDateDist
                                  key={`TD_${s.state_progress_active_month_id}`}
                                />
                              ) : (
                                convertDateFormat(s.progress_to_date)
                              )}
                            </td>
                          </>}

                          <td>{s.plan_year}</td>
                          <td>
                            {activeState === s.state_id ? (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={handleActiveProgressMonth}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setActiveState(s.state_id)}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <h6 className="">
                          No saved entry found!!! / Kindly select any state!!!
                        </h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressMonth;
