import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { API, Helper, Model } from "../../../apps";
import ReactECharts from "echarts-for-react";

const ProgressDistrictDashboard = () => {
  const { month: progressMonth } = useSelector((state) => state.month);
  const location = {
    filter: {
      activity_master_details_id: 0,
      activity_master_id: 0,
      district: "0",
      major_component_id: "12",
      scheme_id: "1",
      state: 106,
      sub_component_id: "5",
    },
    activityDetails: {
      activity_master_component_id: "",
      activity_master_details_global_code: "10079",
      activity_master_details_name: "District Level",
      activity_master_global_code: "1011",
      activity_master_id: "77",
      activity_master_name: "Formation of PMU (Elementary)",
      allocation_asset_selection: "0",
      allocation_component_type: null,
      approved_plan_asset_selection: "0",
      assoc_view_name: null,
      autofill_flag: null,
      autofill_source: null,
      component_type: "3",
      created_at: "2024-03-04T11:13:09.559Z",
      created_by: null,
      criteria_for_appraisal: "",
      dd_block: null,
      dd_child: null,
      dd_district: "1",
      dd_hostel: null,
      dd_national: "1",
      dd_school: "0",
      dd_state: "1",
      drill_down_level: "3",
      finance_yn: "0",
      form_global_code: "1011",
      form_name: null,
      id: "411",
      major_component_global_code: "17",
      major_component_id: "12",
      major_component_name: "Quality Interventions",
      norms: "",
      recuring_nonrecuring: 1,
      scheme_id: "1",
      scheme_name: "Elementary Education",
      serial_order: "934",
      state_specfic_yn: "0",
      sub_component_code_global: "116",
      sub_component_id: "5",
      sub_component_name: "NIPUN Bharat Mission",
      unique_code: "",
      uom: null,
      updated_at: "2024-03-12T05:05:25.000Z",
      updated_by: 756,
      year_code: "2023-2024",
    },
    state_name: "Haryana",
  };
  const [initialParams, setInitialParams] = useState(null);
  const [districtsList, setDistrictsList] = useState([]);
  const [activeDistrict, setActiveDistrict] = useState({});
  const [physicalProgressCompleted, setPhysicalProgressCompleted] = useState(0);
  const [financialExpenditure, setFinancialExpenditure] = useState(0);
  const [monthWiseProgressData, setMonthWiseProgressData] = useState([]);
  const [monthWiseProgressDataState, setMonthWiseProgressDataState] = useState(
    []
  );
  const [chartOption, setChartOption] = useState({});
  const [mobile, setMobile] = useState(false);
  const [ipad, setIpad] = useState(false);
  const [chartType, setChartType] = useState("1");
  const [chartData, setChartData] = useState([]);
  const [option, setOption] = useState({});
  const districtTotal = useRef();
  const activeMonth = useRef();
  const months = Model.monthsOfYear;
  const user = Helper.auth.user;

  useEffect(() => {
    setMobile(window.innerWidth < 541); //|| window.innerWidth>769 && window.innerWidth<1025)
    setIpad(window.innerWidth > 912 && window.innerWidth < 1281);
  }, []);

  const donutoption = {
    grid: {
      bottom: -20, // Set the bottom margin to 0
      containLabel: true, // Ensure labels are contained within the chart area
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return `<div style="width: 200px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">Major Component<br>${params.name}: ${params.value} (${params.percent}%)</div>`;
      },
      position: "center",
    },
    legend: {
      orient: "horizontal",
      left: "left",
    },
    series: [
      {
        name: "Major Component",
        type: "pie",
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF",
        ],
        radius: ["20%", "40%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
          distance: 5,
        },
        data: chartData,
        bottom: mobile ? -220 : ipad ? -250 : -100,
      },
    ],
  };

  const barlabel = chartData?.map((v) => `${v.name.substring(0, 30)}...`);
  const barData = chartData?.map((v) => v.value.toFixed(5));

  const baroption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params) {
        return `<div style="display:flex;justify-content:center;width: 200px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">Major Component <br />${params[0].name}: ${params[0].value}</div>`;
      },
      position: [10, 10],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "0%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: barlabel,
        axisLabel: { rotate: 20 },
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Amount (₹ In Lakhs)",
        type: "bar",
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#9d96f5",
          "#8378EA",
          "#96BFFF",
        ],
        barWidth: "60%",
        data: barData,
      },
    ],
  };

  const handleChartView = (e) => {
    const id = e.target.id;
    if (id === "1") {
      setChartOption(option);
    } else if (id === "2") {
      setChartOption(donutoption);
    } else if (id === "3") {
      setChartOption(baroption);
    }
    setChartType(id);
  };

  useEffect(() => {
    activeMonth.current = months.filter((m) => m.key === +progressMonth)[0];
    setInitialParams(location);
    getDistrictsData(location, "A");
  }, []);

  const getDistrictsData = (data, mode, active_district_data = null) => {
    API.post(
      "api/prabandh/district-wise-allocation-data",
      { data: data },
      (res) => {
        setDistrictsList(res.data);

        let localChartData = res?.data?.map((v) => ({
          value: +v.allocated_physical_quantity,
          name: v.district_name,
        }));

        let localOption = {
          title: {
            text: "Major Components ",
            left: "center",
            subtext: "",
          },

          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `<div style="max-width: 300px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">
                        Major Component <br /> ${params.name}
                          ${params.value} (${params.percent}%)
                        </div>`;
            },
            position: "center",
          },
          series: [
            {
              name: "Scheme",
              type: "pie",
              color: [
                "#37A2DA",
                "#32C5E9",
                "#67E0E3",
                "#9FE6B8",
                "#FFDB5C",
                "#ff9f7f",
                "#fb7293",
                "#E062AE",
                "#E690D1",
                "#e7bcf3",
                "#9d96f5",
                "#8378EA",
                "#96BFFF",
              ],
              radius: "50%",
              data: localChartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };

        setChartOption(option);
        setChartData(localChartData);
        setOption(localOption);

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
          let filteredData = res.data.filter(
            (itm) => +itm.district_id === user?.user_district_id
          );
          setActiveDistrict(filteredData);
          monthWiseProgress(data, filteredData);
        } else {
          monthWiseProgress(data, active_district_data);
        }
      }
    );
  };

  const monthWiseProgress = (data, active_district_data) => {
    setMonthWiseProgressData([]);
    const payload = {
      activeDistrict: active_district_data,
      activityDetails: data.activityDetails,
    };

    API.post(
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
          getActiveMonthSavedData(res.current_month_data);
        }
      }
    );
  };

  const getActiveMonthSavedData = (data) => {
    if (data.length > 0) {
      setFinancialExpenditure(data[0].financial_expenditure || 0);
      setPhysicalProgressCompleted(data[0].physical_progress_completed || 0);
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
    setFinancialExpenditure(0);
    setPhysicalProgressCompleted(0);
  };

  return (
    <div className="dashboard-main-content">
      <div className="col-md-12 pb-2">
        <div className="clear progress-tracking">
          <div className="row">
            <div className="col-lg-6 mb-3">
              <div
                className="dashboard-main-content-info"
                style={{ height: "100%" }}
              >
                <button
                  className={`btn ${
                    chartType === "1" ? "btn-success" : "btn-primary"
                  }`}
                  id="1"
                  onClick={handleChartView}
                >
                  Pie{" "}
                </button>
                <button
                  className={`btn ${
                    chartType === "2" ? "btn-success" : "btn-primary"
                  } mx-2`}
                  id="2"
                  onClick={handleChartView}
                >
                  {" "}
                  Donut{" "}
                </button>
                <button
                  className={`btn ${
                    chartType === "3" ? "btn-success" : "btn-primary"
                  } `}
                  id="3"
                  onClick={handleChartView}
                >
                  Bar
                </button>

                {chartData && chartData.length > 0 && (
                  <>
                    <div
                      className={+chartType !== 1 ? "hide_chart" : ""}
                      id="pie_chart"
                      style={{ marginTop: "1rem" }}
                    >
                      <ReactECharts
                        option={option}
                        style={{
                          minHeight: "400px",
                          width: "100%",
                          paddingTop: "1rem",
                          backgroundColor: "white",
                          marginBottom: "2rem",
                        }}
                      />
                    </div>
                    <div
                      className={+chartType !== 2 ? "hide_chart" : ""}
                      id="donut_chart"
                      style={{ marginTop: "1rem" }}
                    >
                      <ReactECharts
                        option={donutoption}
                        style={{
                          minHeight: "420px",
                          height: "100%",
                          width: "100%",
                          backgroundColor: "white",
                          marginBottom: "0.8rem",
                        }}
                      />
                    </div>
                    <div
                      className={+chartType !== 3 ? "hide_chart" : ""}
                      id="bar_chart"
                      style={{ marginTop: "1rem" }}
                    >
                      <ReactECharts
                        option={baroption}
                        style={{
                          minHeight: "400px",
                          width: "100%",
                          backgroundColor: "white",
                          marginBottom: "2rem",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="dashboard-main-content-info">
                <div className="table-responsive table-scroll-section">
                  <h6
                    style={{
                      background: "#1c66c5",
                      color: "#fff",
                      padding: "10px",
                    }}
                  >
                    Monthly Progress
                  </h6>
                  <table className="table table-sm table-bordered tracking-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>PHYSICAL</th>
                        <th>FINANCIAL</th>
                        <th>CUMULATIVE PHYSICAL</th>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDistrictDashboard;
