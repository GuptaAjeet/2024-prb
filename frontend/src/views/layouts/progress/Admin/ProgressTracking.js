import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import api from "../../../../apps/utilities/api";
import model from "../../../../apps/utilities/model";
import sweetAlert from "../../../../apps/utilities/sweetalert";
import { Helper } from "../../../../apps";
//import settings from "../../../../apps/utilities/settings";

const ProgressTracking = () => {
  const { month: progressMonth } = useSelector((state) => state.month);
  const location = useLocation();
  const [initialParams, setInitialParams] = useState(null);
  const [districtsList, setDistrictsList] = useState([]);
  const [activeDistrict, setActiveDistrict] = useState({});
  const [physicalProgressCompleted, setPhysicalProgressCompleted] = useState(0);
  const [financialExpenditure, setFinancialExpenditure] = useState(0);
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [monthWiseProgressData, setMonthWiseProgressData] = useState([]);
  const [monthWiseProgressDataState, setMonthWiseProgressDataState] = useState(
    []
  );
  const isEmptyObject = (obj) => Object.keys(obj).length === 0;
  const districtTotal = useRef();

  const activeMonth = useRef();
  const months = model.monthsOfYear;
  useEffect(() => {
    activeMonth.current = months.filter((m) => m.key === +progressMonth)[0];
    setInitialParams(location.state);
    getDistrictsData(location.state, "A");
  }, []);

  const getDistrictsData = (data, mode, active_district_data = null) => {
    api.post(
      "api/prabandh/district-wise-allocation-data",
      {
        data: data,
      },
      (res) => {
        setDistrictsList(res.data);
        districtTotal.current = res.data.reduce(
          (total, itm) => {
            return {
              allocated_financial_amount:
                total.allocated_financial_amount +
                +itm.allocated_financial_amount,
              allocated_physical_quantity:
                total.allocated_physical_quantity +
                +itm.allocated_physical_quantity,
              physical_progress_completed: +total.physical_progress_completed + (+itm.physical_progress_completed),
              financial_expenditure: +total.financial_expenditure + (+itm.financial_expenditure),
            };
          },
          {
            allocated_financial_amount: 0,
            allocated_physical_quantity: 0,
            financial_expenditure: 0,
            physical_progress_completed: 0
          }
        );

        if (mode === "A") {
          if (isEmptyObject(activeDistrict)) {
            setActiveDistrict(res.data[0]);
            monthWiseProgress(data, res.data[0]);
          }
        } else {
          monthWiseProgress(data, active_district_data);
        }
      }
    );
  };
  const saveProgress = () => {
    // if (physicalProgressCompleted < 0) {
    //   return sweetAlert.warning("Please fill corect value of Physical ");
    // } else
    if (+physicalProgressCompleted > +activeDistrict?.allocated_physical_quantity) {
      return sweetAlert.warning("Physical quantity is not greater than alloted physical quantity!");
    } else if (parseFloat(financialExpenditure) > parseFloat(activeDistrict?.allocated_financial_amount)) {
      return sweetAlert.warning(`Financial amount is not greater than alloted Financial amount!`);
    } else {
      const payload = {
        physicalProgressCompleted: physicalProgressCompleted,
        financialExpenditure: financialExpenditure,
        activeMonth: activeMonth.current.value,
        activeDistrict: activeDistrict,
        activityDetails: initialParams.activityDetails,
        status: "3"
      };
      api.post(
        "api/prabandh/save-progress-data",
        { payload: payload },
        (res) => {
          if (res.data === "Inserted Successfully") {
            sweetAlert.done({ msg: `Data saved successfully!` });
          } else {
            sweetAlert.warning({ msg: `Data not saved!` });
          }
          getDistrictsData(location.state, "A");
          monthWiseProgress(location.state, activeDistrict);
          // setPhysicalProgressCompleted(0);
          // setFinancialExpenditure(0);
        }
      );
    }
  };
  const lockProgress = () => {
    
    
    // if (physicalProgressCompleted < 0) {
    //   return sweetAlert.warning("Please fill corect value of Physical ");
    // } else
    if (+physicalProgressCompleted > +activeDistrict?.allocated_physical_quantity) {
      return sweetAlert.warning("Physical quantity is not greater than alloted physical quantity!");
    } else if (parseFloat(financialExpenditure) > parseFloat(activeDistrict?.allocated_financial_amount)) {
      return sweetAlert.warning(`Financial amount is not greater than alloted Financial amount!`);
    } else {

      sweetAlert.confirmation({
        title: "Are you sure?",
        msg: `You want to Freeze it.`,
        yesBtnText: "Yes",
        noBtnText: "No",
        url: "",
        callback: () => {
          const payload = {
            physicalProgressCompleted: physicalProgressCompleted,
            financialExpenditure: financialExpenditure,
            activeMonth: activeMonth.current.value,
            activeDistrict: activeDistrict,
            activityDetails: initialParams.activityDetails,
            status: "6"
          };
          api.post(
            "api/prabandh/lock-progress-data",
            { payload: payload },
            (res) => {
              if (res.data === "Inserted Successfully") {
                sweetAlert.done({ msg: `Your data freeze successfully!` });
              } else {
                sweetAlert.warning({ msg: `Data not saved!` });
              }
              getDistrictsData(location.state, "A");
              monthWiseProgress(location.state, activeDistrict);
              setActiveDistrict((prev) => ({ ...activeDistrict, status: 6 }))
            }
          );
        },
        redirect: "",
      });
      
    }
  };

  const monthWiseProgress = (data, active_district_data) => {
    setMonthWiseProgressData([]);
    const payload = {
      activeDistrict: active_district_data,
      activityDetails: data.activityDetails,
    };
    api.post(
      "api/prabandh/month-wise-progress-data",
      { payload: payload },
      (res) => {
        if (res?.district_data?.length > 0) {
          setMonthWiseProgressData(res.district_data);
        }
        if (res?.state_data?.length > 0) {
          setMonthWiseProgressDataState(res.state_data);
        }
        if (res?.current_month_data?.length > 0) {
          // getActiveMonthSavedData(res.current_month_data);
          let findCurrentMonthData = res.district_data.find(itm=>itm.month_id===activeMonth?.current?.value);
          if(findCurrentMonthData){
            setCurrentMonthData(findCurrentMonthData)
          }else{
            setCurrentMonthData({
              running_financial_expenditure: 0,
              running_physical_progress_completed: 0
            })
          }
        }else{
          setCurrentMonthData({
            running_financial_expenditure: 0,
            running_physical_progress_completed: 0
          })
        }
      }
    );
  };

  const getActiveMonthSavedData = (data) => {
    if (data.length > 0) {
      // setFinancialExpenditure(data[0].financial_expenditure);
      // setPhysicalProgressCompleted(data[0].physical_progress_completed);
    } else {
      setFinancialExpenditure(0);
      setPhysicalProgressCompleted(0);
    }
  };

  const getDataFromMonthWiseProgress = (month, field, mode) => {
    if (mode === "D") {
      const M = monthWiseProgressData.filter(
        (mwpd) => mwpd?.month_id === month.value
      );
      if (M.length > 0) {
        return M[0][field];
      } else {
        return 0;
      }
    } else if (mode === "S") {
      const M = monthWiseProgressDataState.filter(
        (mwpd) => mwpd?.month_id === month.value
      );
      if (M.length > 0) {
        return M[0][field];
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const updateDistrictWiseData = (d) => {
    getDistrictsData(initialParams, "M", d);
    // if (isEmptyObject(activeDistrict)) {
      setFinancialExpenditure(0);
      setPhysicalProgressCompleted(0);
    // }
  };
  
  // const handleChangephysical = (e) => {
  //   if (e.target.value.includes(".")) {
  //     e.preventDefault();
  //   } else if (e.target.value.length > 9) {
  //     e.preventDefault();
  //   } else {
  //     setPhysicalProgressCompleted(e.target.value);
  //   }
  // };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <h5 className="mt-2" style={{ display: "inline-block" }}>
          {`${initialParams?.activityDetails?.activity_master_details_name ?? ""}`}
        </h5>
        <h4 style={{ display: "inline-block", float: "right" }} className="text-success">
          <div style={{ display: "inline-block", float: "right" }}>
            <Link to="/auth/progress/admin" className="bi bi-arrow-left font-size-16 btn ps-2 pe-2 pt-1 pb-1 btn-primary" state={{ backParams: initialParams }}>
              {" "}
              Back
            </Link>
          </div>
        </h4>
      </div>

      <div className="dashboard-main-content-info mt-2 mb-3 " style={{ backgroundColor: "#577dbd" }}>
        <div className="table-responsive">
          <table cellpadding="5" cellspacing="5" className="table table-bordered mb-0 tracking-top-table">
            <tbody>
              <tr>
                <td className="bg-light">Scheme : </td>
                <td>{initialParams?.activityDetails?.scheme_name}</td>
                <td className="bg-light">Major Component :</td>
                <td>{initialParams?.activityDetails?.major_component_name}</td>
              </tr>
              <tr>
                <td className="bg-light">Sub Component :</td>
                <td>{initialParams?.activityDetails?.sub_component_name}</td>
                <td className="bg-light">Activity Master :</td>
                <td>{initialParams?.activityDetails?.activity_master_name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-md-12 pb-2">
        <div className="clear progress-tracking">
          <div className="row ">
            <div className="col-lg-12">
              <div className="dashboard-main-content-info mb-3 ">
                <div className="text-end"><h6>All (₹ In Lakhs)</h6></div>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="thead-bg">
                      <tr>
                        <th rowSpan={2}>DISTRICT</th>
                        <th rowSpan={2}>MONTH</th>
                        <td colSpan={2} className="bg-info text-white fbold f900 text-center" style={{textAlign: "center !important"}}>
                          ALLOTED
                        </td>
                        <td colSpan={2} className="bg-teal text-white fbold f900 text-center" style={{textAlign: "center !important"}}>
                          CUMULATIVE
                        </td>
                        <td colSpan={2} className="bg-warning text-white fbold f900 text-center" style={{textAlign: "center !important"}}>
                          BALANCE
                        </td>
                        <th colSpan={2} className="text-center">Current Progress</th>
                        <th rowSpan={2} className="text-center">ACTION</th>
                      </tr>
                      <tr>
                        <td className="bg-info text-white fbold f900">
                          PHYSICAL
                        </td>
                        <td className="bg-info text-white fbold f900">
                          FINANCIAL
                        </td>
                        <td className="bg-teal text-white fbold f900">
                          PHYSICAL
                        </td>
                        <td className="bg-teal text-white fbold f900">
                          FINANCIAL
                        </td>
                        <td className="bg-warning text-white fbold f900">
                          PHYSICAL
                        </td>
                        <td className="bg-warning text-white fbold f900">
                          FINANCIAL
                        </td>
                        <th>PHYSICAL</th>
                        <th>FINANCIAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-none" key={`data_list_1`}>
                        <td>{activeDistrict?.district_name}</td>
                        <td>{activeMonth?.current?.name}</td>
                        <td>
                          {activeDistrict?.allocated_physical_quantity ?? 0}
                        </td>
                        <td>
                          ₹{activeDistrict?.allocated_financial_amount ?? 0}
                        </td>
                        <td>{currentMonthData?.running_physical_progress_completed}</td>
                        <td>{currentMonthData?.running_financial_expenditure}</td>
                        <td>
                          {isNaN(parseFloat(activeDistrict?.allocated_physical_quantity -
                            physicalProgressCompleted)) ? 0 : parseFloat(activeDistrict?.allocated_physical_quantity -
                              physicalProgressCompleted)}
                        </td>
                        <td>
                          ₹
                          {isNaN(parseFloat(activeDistrict?.allocated_financial_amount -
                            financialExpenditure)) ? 0 : Helper.numberFormat(
                              parseFloat(activeDistrict?.allocated_financial_amount -
                                financialExpenditure), 5
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={+activeDistrict.status === 6}
                            value={physicalProgressCompleted}
                            onKeyDown={(e) =>
                              Helper.validateNumberInput(e, 8, 5)
                            }
                            onChange={(e) => {
                              if (e.target.value.includes(".")) {
                                e.preventDefault();
                              } else if (e.target.value.length > 9) {
                                e.preventDefault();
                              } else {
                                setPhysicalProgressCompleted(e.target.value);
                              }
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            disabled={+activeDistrict.status === 6}
                            onKeyDown={(e) =>
                              Helper.validateNumberInput(e, 8, 5)
                            }
                            value={financialExpenditure}
                            onChange={(e) =>
                              setFinancialExpenditure(e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <div className="text-center">
                            <span className="lock-span" onClick={+activeDistrict.status === 6 ? null : lockProgress}>
                              <i className="fa-solid fa-lock lock-icon"></i>
                            </span>
                            <button
                              disabled={!activeDistrict?.district_name || +activeDistrict.status === 6}
                              type="button"
                              className="btn btn-success"
                              onClick={saveProgress}
                            >
                              Save
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-lg-6 ">
                    <div className="table-responsive">
                      <h6
                        style={{
                          background: "#1c66c5",
                          color: "#fff",
                          padding: "10px",
                        }}
                      >
                        District Progress ({activeMonth?.current?.name})
                      </h6>
                      <table className="table table-sm table-bordered mb-0">
                        <thead>
                          <tr>
                            <th rowSpan={2}>S.NO</th>
                            <th rowSpan={2}>PHYSICAL</th>
                            <th rowSpan={2}>FINANCIAL</th>
                            <th colSpan={2} className="text-center">CUMULATIVE</th>
                          </tr>
                          <tr>
                            <th>PHYSICAL</th>
                            <th>FINANCIAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {months.length > 0 &&
                            months.map((m) => (
                              <tr key={`data_list_${m.key}`}>
                                <td>{m.name}</td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "physical_progress_completed",
                                    "D"
                                  )}
                                </td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "financial_expenditure",
                                    "D"
                                  )}
                                </td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "running_physical_progress_completed",
                                    "D"
                                  )}
                                </td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "running_financial_expenditure",
                                    "D"
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="table-responsive">
                      <h6
                        style={{
                          background: "#1c66c5",
                          color: "#fff",
                          padding: "10px",
                        }}
                      >
                        State Progress ({activeMonth?.current?.name})
                      </h6>
                      <table className="table table-sm table-bordered mb-0">
                        <thead>
                          <tr>
                            <th rowSpan={2}>S.NO</th>
                            <th rowSpan={2}>PHYSICAL</th>
                            <th rowSpan={2}>FINANCIAL</th>
                            <th colSpan={2} className="text-center">CUMULATIVE</th>
                          </tr>
                          <tr>
                            <th>PHYSICAL</th>
                            <th>FINANCIAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {months.length > 0 &&
                            months.map((m) => (
                              <tr key={`data_list_${m.key}`}>
                                <td>{m.name}</td>

                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "physical_progress_completed",
                                    "S"
                                  )}
                                </td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "financial_expenditure",
                                    "S"
                                  )}
                                </td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "running_physical_progress_completed",
                                    "S"
                                  )}
                                </td>
                                <td>
                                  {getDataFromMonthWiseProgress(
                                    m,
                                    "running_financial_expenditure",
                                    "S"
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-main-content-info ">
                <div className="table-responsive table-scroll-section">
                  <table className="table table-sm table-bordered tracking-table">
                    <thead>
                      <tr>
                        <th rowSpan={2}>STATE/DISTRICT</th>
                        <th colSpan={2} className="text-center">ALLOCATED</th>
                        <th colSpan={2} className="text-center">CUMULATIVE ({activeMonth?.current?.name})</th>
                      </tr>
                      <tr>
                        <th>PHYSICAL</th>
                        <th>FINANCIAL</th>
                        <th>
                          PHYSICAL
                          <br />
                          COMPLETED
                        </th>
                        <th>
                          FINANCIAL
                          <br />
                          EXPENDITURE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {districtsList.length > 0 &&
                        districtsList.map((d) => (
                          <tr key={d.id}>
                            <td>
                              <button
                                key={d.id}
                                type="button"
                                className={`btn-district ${+d.id === +activeDistrict ? "activeL" : ""
                                  }`}
                                onClick={() => {
                                  setActiveDistrict(d);
                                  updateDistrictWiseData(d);
                                }}
                              >
                                {d.district_name}
                              </button>
                            </td>
                            <td>{d.allocated_physical_quantity}</td>
                            <td>{d.allocated_financial_amount}</td>
                            <td>{d.physical_progress_completed}</td>
                            <td>{d.financial_expenditure}</td>
                          </tr>
                        ))}
                      <tr key="district_total">
                        <td className="text-end font-weight-bold " style={{fontWeight:800}}>Total</td>
                        <td style={{fontWeight:800}}>
                          {districtTotal.current &&
                            districtTotal.current.allocated_physical_quantity}
                        </td>
                        <td style={{fontWeight:800}}>
                          {districtTotal.current &&
                            (+districtTotal.current
                              .allocated_financial_amount).toFixed(5)}
                        </td>
                        <td style={{fontWeight:800}}>
                          {districtTotal.current &&
                            (+districtTotal.current
                              .physical_progress_completed)}
                        </td>
                        <td style={{fontWeight:800}}>
                          {districtTotal.current &&
                            (+districtTotal.current
                              .financial_expenditure).toFixed(5)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgressTracking;
