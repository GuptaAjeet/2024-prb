import React, { useEffect, Fragment, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import api from "../../../../apps/utilities/api";
import model from "../../../../apps/utilities/model";
// import sweetAlert from "../../../../apps/utilities/sweetalert";
import { Helper } from "../../../../apps";
//import settings from "../../../../apps/utilities/settings";

const ProgressTrackingSchoolActivity = () => {
  const { month: progressMonth } = useSelector((state) => state.month);
  const location = useLocation();
  const [initialParams, setInitialParams] = useState(null);
  const [districtsList, setDistrictsList] = useState([]);
  const [activeDistrict, setActiveDistrict] = useState({});

  const [monthWiseStateProgressData, setMonthWiseStateProgressData] = useState(
    []
  );
  const [monthWiseDistrictProgressData, setMonthWiseDistrictProgressData] =
    useState([]);
  const [currentmonthWiseProgressData, setCurrentMonthWiseProgressData] =
    useState(null);

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
      "api/prabandh/district-wise-progress-data-byasset",
      {
        data: data,
        active_month: progressMonth,
      },
      (res) => {
        setDistrictsList(res?.data);
        districtTotal.current = res?.data?.reduce(
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
          const disData = res.data.filter(
            (d) => +d.district_id === data.filter.district
          );
          if (disData.length > 0) {
            setActiveDistrict(disData[0]);
            monthWiseProgress(data, disData[0]);
          } else {
            setActiveDistrict(res.data[0]);
            monthWiseProgress(data, res.data[0]);
          }
        } else {
          monthWiseProgress(data, active_district_data);
        }
      }
    );
  };

  const monthWiseProgress = (data, active_district_data) => {
    setMonthWiseStateProgressData([]);
    setMonthWiseDistrictProgressData([]);
    setCurrentMonthWiseProgressData([]);
    const payload = {
      activeDistrict: {
        district_id: data?.filter?.district,
        state_id: data?.filter?.state,
      },
      activityDetails: data.activityDetails,
    };
    api.post(
      "api/prabandh/month-wise-progress-data-byasset",
      { payload: payload },
      (res) => {
        if (res?.state_data?.length > 0) {
          setMonthWiseStateProgressData(res?.state_data);
        }
        if (res?.district_data?.length > 0) {
          setMonthWiseDistrictProgressData(res?.district_data);
        }
        if (res?.current_month_data?.length) {
          setCurrentMonthWiseProgressData(res?.current_month_data);
        }
      }
    );
  };
  const getDataFromMonthWiseProgress = (month, field) => {
    const M = monthWiseStateProgressData.filter(
      (mwpd) => mwpd?.month_id === month.value
    );
    if (M.length > 0) {
      return M[0][field];
    } else {
      return 0;
    }
  };

  const getDataFromMonthWiseProgressDistrict = (month, field) => {
    const M = monthWiseDistrictProgressData.filter(
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
              to="/auth/progress/district"
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

      <div className="col-md-12 pb-2">
        <div className="clear progress-tracking">
          <div className="row ">
            <div className="col-lg-12">
              <Fragment>
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
                              // value={financialExpenditure}
                              defaultValue={
                                currentmonthWiseProgressData &&
                                currentmonthWiseProgressData[0] &&
                                +currentmonthWiseProgressData[0][
                                  "physical_progress_yet_to_start"
                                ]
                              }
                              disabled={true}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              // value={physicalProgressCompleted}
                              disabled={true}
                              defaultValue={
                                currentmonthWiseProgressData &&
                                currentmonthWiseProgressData[0] &&
                                +currentmonthWiseProgressData[0][
                                  "physical_progress_in_progress"
                                ]
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              // value={physicalProgressCompleted}
                              disabled={true}
                              defaultValue={
                                currentmonthWiseProgressData &&
                                currentmonthWiseProgressData[0] &&
                                +currentmonthWiseProgressData[0][
                                  "physical_progress_completed"
                                ]
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              // value={physicalProgressCompleted}
                              disabled={true}
                              defaultValue={
                                currentmonthWiseProgressData &&
                                currentmonthWiseProgressData[0] &&
                                +currentmonthWiseProgressData[0][
                                  "financial_expenditure"
                                ]
                              }
                            />
                          </td>

                          <td>
                            <div className="text-center">
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
                                  state_name: location?.state?.state_name,
                                  activityDetails:
                                    location?.state?.activityDetails,
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
                          District Progress
                        </h6>
                        <table className="table table-sm table-bordered mb-0">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Not Started</th>
                              <th>In Progress</th>
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
                                    {getDataFromMonthWiseProgressDistrict(
                                      m,
                                      "physical_progress_yet_to_start",
                                      "D"
                                    )}
                                  </td>
                                  <td>
                                    {getDataFromMonthWiseProgressDistrict(
                                      m,
                                      "physical_progress_in_progress",
                                      "D"
                                    )}
                                  </td>
                                  <td>
                                    {getDataFromMonthWiseProgressDistrict(
                                      m,
                                      "physical_progress_completed",
                                      "D"
                                    )}
                                  </td>
                                  <td>
                                    {getDataFromMonthWiseProgressDistrict(
                                      m,
                                      "financial_expenditure",
                                      "D"
                                    )}
                                  </td>
                                  <td>
                                    {getDataFromMonthWiseProgressDistrict(
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
                          State Progress
                        </h6>
                        <table className="table table-sm table-bordered mb-0">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Not Started</th>
                              <th>In Progress</th>
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
                                      "physical_progress_yet_to_start",
                                      "S"
                                    )}
                                  </td>
                                  <td>
                                    {getDataFromMonthWiseProgress(
                                      m,
                                      "physical_progress_in_progress",
                                      "S"
                                    )}
                                  </td>
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
                                      "current_financial_expenditure",
                                      "S"
                                    )}
                                  </td>
                                  <td>
                                    {getDataFromMonthWiseProgress(
                                      m,
                                      "cumalative_financial_expenditure",
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
              </Fragment>
            </div>
          </div>
          {/*           <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-main-content-info ">
                <div className="table-responsive">
                  <table className="table table-sm table-bordered tracking-table">
                    <thead>
                      <tr>
                        <th>STATE/DISTRICT</th>
                        <th>PHYSICAL</th>
                        <th>FINANCIAL</th>
                        <th>Not Started</th>
                        <th>IN Progress</th>
                        <th>Completed</th>
                        <th>Current Financial Expenditure</th>
                        <th>Cummalative Financial</th>
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
                            <td>{d.physical_progress_yet_to_start}</td>
                            <td>{d.physical_progress_in_progress}</td>
                            <td>{d.physical_progress_completed}</td>
                            <td>{d.current_financial_expenditure}</td>
                            <td>{d.cumulative_financial_expenditure}</td>
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
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default ProgressTrackingSchoolActivity;
