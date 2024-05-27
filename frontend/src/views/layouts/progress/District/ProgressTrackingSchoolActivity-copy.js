import React, { useEffect, Fragment, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import api from "../../../../apps/utilities/api";
import model from "../../../../apps/utilities/model";
import sweetAlert from "../../../../apps/utilities/sweetalert";
import { Helper } from "../../../../apps";
//import settings from "../../../../apps/utilities/settings";

const ProgressTrackingSchoolActivity = () => {
  const { month: progressMonth } = useSelector((state) => state.month);
  const location = useLocation();
  const [initialParams, setInitialParams] = useState(null);
  const [districtsList, setDistrictsList] = useState([]);
  const [activeDistrict, setActiveDistrict] = useState({});

  const [physicalProgressCompleted, setPhysicalProgressCompleted] = useState(0);
  const [financialExpenditure, setFinancialExpenditure] = useState(0);
  const [monthWiseProgressData, setMonthWiseProgressData] = useState([]);
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
            };
          },
          {
            allocated_financial_amount: 0,
            allocated_physical_quantity: 0,
          }
        );

        if (mode === "A") {
          setActiveDistrict(res.data[0]);
          monthWiseProgress(data, res.data[0]);
        } else {
          monthWiseProgress(data, active_district_data);
        }
      }
    );
  };

  // const saveProgress = () => {
  //   const payload = {
  //     physicalProgressCompleted: physicalProgressCompleted,
  //     financialExpenditure: financialExpenditure,
  //     activeMonth: activeMonth.current.value,
  //     activeDistrict: activeDistrict,
  //     activityDetails: initialParams.activityDetails,
  //   };
  //   api.post("api/prabandh/save-progress-data", { payload: payload }, (res) => {
  //     if (res.data === "Inserted Successfully") {
  //       sweetAlert.done({ msg: `Data saved successfully!` });
  //     } else {
  //       sweetAlert.warning({ msg: `Data not saved!` });
  //     }
  //   });
  // };

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
        if (res?.data?.length > 0) {
          setMonthWiseProgressData(res.data);
        }
      }
    );
  };

  const getDataFromMonthWiseProgress = (month, field) => {
    const M = monthWiseProgressData.filter(
      (mwpd) => mwpd?.month_id === month.value
    );
    if (M.length > 0) {
      return M[0][field];
    } else {
      return 0;
    }
  };

  const updateDistrictWiseData = (d) => {
    getDistrictsData(initialParams, "M", d);
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <h5 className="mt-2" style={{ display: "inline-block" }}>
          {`${
            initialParams?.activityDetails?.activity_master_details_name ?? ""
          }`}
        </h5>
        <h4
          style={{ display: "inline-block", float: "right" }}
          className="text-success"
        >
          <div style={{ display: "inline-block", float: "right" }}>
            <Link
              to="/auth/progress/admin"
              className="bi bi-arrow-left font-size-16 btn ps-2 pe-2 pt-1 pb-1 btn-primary"
              state={{
                backParams: initialParams,
              }}
            >
              {" "}
              Back
            </Link>
          </div>
        </h4>
      </div>

      <div
        className="dashboard-main-content-info mt-2 mb-3 "
        style={{ backgroundColor: "#577dbd" }}
      >
        <div className="table-responsive">
          <table
            cellpadding="5"
            cellspacing="5"
            className="table table-bordered mb-0 tracking-top-table"
          >
            <tbody>
              <tr>
                <td className="bg-light">Scheme : </td>
                <td>{location?.state?.activityDetails?.scheme_name}</td>
                <td className="bg-light">Major Component :</td>
                <td>
                  {location?.state?.activityDetails?.major_component_name}
                </td>
              </tr>
              <tr>
                <td className="bg-light">Sub Component :</td>
                <td>{location?.state?.activityDetails?.sub_component_name}</td>
                <td className="bg-light">Activity Master :</td>
                <td>
                  {location?.state?.activityDetails?.activity_master_name}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-main-content-info mb-3 ">
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="thead-bg">
              <tr>
                <th>DISTRICT</th>
                <th>MONTH</th>
                <td className="bg-info text-white fbold f900">
                  ALLOTED <br /> PHYSICAL
                </td>
                <td className="bg-info text-white fbold f900">
                  ALLOTED <br /> FINANCIAL
                </td>
                <td className="bg-teal text-white fbold f900">
                  CUMULATIVE <br /> PHYSICAL
                </td>
                <td className="bg-teal text-white fbold f900">
                  CUMULATIVE <br /> FINANCIAL
                </td>

                <th>Not Started</th>
                <th>Inprogress</th>
                <th>Completed</th>
                <th>FINANCIAL</th>

                {/* <th>PHYSICAL</th>
                <th>FINANCIAL</th> */}
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-none" key={`data_list_1`}>
                <td>{activeDistrict?.district_name}</td>
                <td>{activeMonth?.current?.name}</td>
                <td>₹{activeDistrict?.allocated_physical_quantity ?? 0}</td>
                <td>₹{activeDistrict?.allocated_financial_amount ?? 0}</td>
                <td>₹12345</td>
                <td>₹12345</td>
                <td>₹12345</td>
                <td>₹12345</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={physicalProgressCompleted}
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
                    onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                    value={financialExpenditure}
                    onChange={(e) => setFinancialExpenditure(e.target.value)}
                  />
                </td>

                <td>
                  <div className="text-center">
                    <span className="lock-span">
                      <i className="fa-solid fa-lock lock-icon"></i>
                    </span>

                    <button
                      type="button"
                      className="btn btn-success"
                      // onClick={saveProgress}
                    >
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-md-12 pb-2">
        <div className="clear progress-tracking">
          <div className="row ">
            <div className="col-lg-8">
              <Fragment>
                {/* <div className="dashboard-main-content-info mb-3 ">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 className="mb-2" style={{textDecoration:"underline"}}><b>State: {location?.state?.state_name}</b></h6>
                    <h6 className="mb-2 text-end">
                      <b>All (₹ In Lakhs)</b>
                    </h6>
                  </div>
                  <div className="row ">
                    <div className="col-sm-3 mb-3 mb-sm-0">
                      <div className="card bg-c-blue">
                        <div className="card-body">
                          <p className="card-title">ALLOTED</p>

                          <span className="card-text float-start ms-0">
                            {activeDistrict?.allocated_physical_quantity ?? 0}
                          </span>
                          <span className="card-text">
                            <i className="bi bi-currency-rupee me-1"></i>
                            {activeDistrict?.allocated_financial_amount ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="card bg-c-green">
                        <div className="card-body">
                          <p className="card-title">CUMULATIVE</p>

                          <span className="card-text">
                            <i className="bi bi-currency-rupee me-1"></i>23541
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="card bg-c-yellow">
                        <div className="card-body">
                          <p className="card-title">CURRENT</p>
                          <span className="card-text">
                            <i className="bi bi-currency-rupee me-1"></i>23541
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <div className="card bg-c-pink">
                        <div className="card-body">
                          <p className="card-title w-100">REMAINS </p>
                          <span className="card-text">
                            <i className="bi bi-currency-rupee me-1"></i>23541
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="dashboard-main-content-info mb-3 ">
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                      <thead className="thead-bg">
                        <tr>
                          <th>DISTRICT</th>
                          <th>MONTH</th>
                          <th>Not Started</th>
                          <th>Inprogress</th>
                          <th>Completed</th>
                          <th>FINANCIAL</th>
                          <th
                            className="text-center"
                            style={{ width: "138px" }}
                          >
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-none" key={`data_list_1`}>
                          <td>{activeDistrict?.district_name}</td>
                          <td>{activeMonth?.current?.name}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={financialExpenditure}
                              disabled={true}
                              onInput={(e) =>
                                setFinancialExpenditure(e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={physicalProgressCompleted}
                              disabled={true}
                              onInput={(e) =>
                                setPhysicalProgressCompleted(e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={physicalProgressCompleted}
                              disabled={true}
                              onInput={(e) =>
                                setPhysicalProgressCompleted(e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={physicalProgressCompleted}
                              disabled={true}
                              onInput={(e) =>
                                setPhysicalProgressCompleted(e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <div className="text-center">
                              {/* <span className="lock-span">
                                <i className="fa-solid fa-lock lock-icon"></i>
                              </span> */}
                              <Link
                                to={`/auth/progress/edit-by-activity`}
                                className="btn btn-primary"
                                state={{
                                  scheme_id:
                                    location?.state?.activityDetails?.scheme_id,
                                  major_component_id:
                                    location?.state?.activityDetails
                                      ?.major_component_id,
                                  sub_component_id:
                                    location?.state?.activityDetails
                                      ?.sub_component_id,
                                  activity_master_id:
                                    location?.state?.activityDetails
                                      ?.activity_master_id,
                                  activity_master_details_id:
                                    location?.state?.activityDetails?.id,
                                  state_id: location?.state?.filter?.state,
                                  district_id: activeDistrict?.district_id,
                                }}
                              >
                                {" "}
                                Edit{" "}
                              </Link>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead>
                        <tr>
                          <th>S.NO</th>

                          <th>Not Started</th>
                          <th>Inprogress</th>
                          <th>Completed</th>

                          <th>FINANCIAL</th>
                          <th>RUNNING FINANCIAL</th>
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
                                  "physical_progress_completed"
                                )}
                              </td>
                              <td>
                                {getDataFromMonthWiseProgress(
                                  m,
                                  "financial_expenditure"
                                )}
                              </td>
                              <td>
                                {getDataFromMonthWiseProgress(
                                  m,
                                  "running_physical_progress_completed"
                                )}
                              </td>
                              <td>
                                {getDataFromMonthWiseProgress(
                                  m,
                                  "running_financial_expenditure"
                                )}
                              </td>
                              <td>
                                {getDataFromMonthWiseProgress(
                                  m,
                                  "running_financial_expenditure"
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Fragment>
            </div>
            <div className="col-lg-4">
              <div className="dashboard-main-content-info ">
                <div className="table-responsive">
                  <table className="table table-sm table-bordered tracking-table">
                    <thead>
                      <tr>
                        <th>STATE/DISTRICT</th>
                        <th>PHYSICAL</th>
                        <th>FINANCIAL</th>
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
                                className={`btn-district ${
                                  +d.id === +activeDistrict ? "activeL" : ""
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
                          </tr>
                        ))}
                      <tr key="district_total">
                        <td>Total</td>
                        <td>
                          {districtTotal.current &&
                            districtTotal.current.allocated_physical_quantity}
                        </td>
                        <td>
                          {districtTotal.current &&
                            (+districtTotal.current
                              .allocated_financial_amount).toFixed(5)}
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
export default ProgressTrackingSchoolActivity;
