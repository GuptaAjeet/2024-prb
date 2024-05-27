import React, { Fragment, useEffect, useState } from "react";
import { Helper, Hook } from "../../../apps";
import api from "../../../apps/utilities/api";

import ReactECharts from "echarts-for-react";
import { useSelector } from "react-redux";
import $ from "jquery";
import exportToExcel from "../../layouts/prabandh/PrabandhReports/ExcelReports";

const DIETDashboard = () => {
  Hook.useStates();
  Hook.useDistricts();
  Hook.useBlocks();
  Hook.useRoles();
  Hook.useDesignations();
  Hook.useMajorComponents();
  Hook.useSubComponents();

  const user = Helper.auth.user;
  const [chartType, setChartType] = useState("1");
  const handler = useSelector((state) => state.handler);
  const [dietList, setDietList] = useState([]);

  const object = Hook.usePost({
    url: "api/admin-users/dashboard",
    data: {
      state_id: user?.user_state_id || null,
      district_id: user?.user_district_id || null,
      role: user?.user_role_id || null,
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      where: handler.where,
    },
  });

  const fobject = Hook.usePost({
    url: "api/admin-users/financial-status",
    data: {
      state_id: user?.user_state_id || null,
      district_id: user?.user_district_id || null,
      role: user?.user_role_id || null,
      page: handler.page,
      limit: 9999999,
      reload: handler.reload,
      where: handler.where,
    },
  });


  const getDietAtivity = () => {
    api.post(
          "api/prabandh/diet-activity-list-dashboard",
          { state_id: user.user_state_id, diet_id: user.diet_id },
          (res) => {
              if (res.status) {
                setDietList(res.data)
              }
          }
      );
  }

  const chartData = dietList.filter((item)=>+item.financial_quantity)?.map((v) => ({
    value: +v.financial_quantity,
    name: v.activity_master_details_name,
    // +" (₹ In Lakhs)",
  }));

  let option = {
    title: {
      text: "DIET Activity ",
      left: "center",
      subtext: "",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // Customize the tooltip content with a div and set its width
        return `<div style="max-width: 300px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">
        DIET Activity <br /> ${params.name}
          ${params.value} (${params.percent}%)
        </div>`;
      },
      position: "center",
      // formatter: "{a} <br/>{b}: {c} ({d}%)",
      // maxWidth: '100',
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
        data: chartData,
        // [
        //   { value: 30, name: 'Category 1' },
        //   { value: 50, name: 'Category 2' },
        //   { value: 20, name: 'Category 3' },
        // ],
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
  const [chartOption, setChartOption] = useState(option);
  const [mobile, setMobile] = useState(false);
  const [ipad, setIpad] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 541); //|| window.innerWidth>769 && window.innerWidth<1025)
    setIpad(window.innerWidth > 912 && window.innerWidth < 1281);
    getDietAtivity()
  }, []);
  const donutoption = {
    grid: {
      bottom: -20, // Set the bottom margin to 0
      containLabel: true, // Ensure labels are contained within the chart area
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // Customize the tooltip content with a div and set its width and styles
        return `<div style="width: 200px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">Major Component<br>${params.name}: ${params.value} (${params.percent}%)</div>`;
      },
      // Center the tooltip
      position: "center",
    },
    // legend: {
    //   top: "5%",
    //   left: "center",
    // },
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
        // chartData
      },
    ],
  };
  // console.log(mobile,ipad)
  const barlabel = chartData?.map((v) => `${v.name.substring(0, 30)}...`);
  const barData = chartData?.map((v) => v.value.toFixed(5));

  const baroption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        // Customize the tooltip content with a div and set its width and styles
        return `<div style="display:flex;justify-content:center;width: 200px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">Major Component <br />${params[0].name}: ${params[0].value}</div>`;
      },
      // Center the tooltip
      // position: 'right',
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
          // '#e7bcf3',
          "#9d96f5",
          "#8378EA",
          "#96BFFF",
        ],
        barWidth: "60%",
        data: barData,
      },
    ],
  };
  
  let rows = [];
  if (object !== null && object?.data?.users !== undefined) {
    object &&
      object?.data?.users.map((row, i) => {
        return (rows[i] = {
          srl: Helper.counter(++i, handler.limit, handler.page),
          scheme_name: row.scheme_name,
          major_component_name: row.major_component_name,
          financial_amount_recuring: parseFloat(row.financial_amount_recuring)
            ? Helper.numberFormatter(row.financial_amount_recuring, 5)
            : +row?.financial_amount_recuring,
          financial_amount_nonrecuring: parseFloat(
            row.financial_amount_nonrecuring
          )
            ? Helper.numberFormatter(row.financial_amount_nonrecuring, 5)
            : +row?.financial_amount_nonrecuring,
        });
      });
  }

  const handleChartView = (e) => {
    const id = e.target.id;
    if (id === "1") {
      setChartOption(option);
      document.getElementById("pie_chart").className = "";
      document.getElementById("donut_chart").className = "hide_chart";
      document.getElementById("bar_chart").className = "hide_chart";
    } else if (id === "2") {
      setChartOption(donutoption);
      document.getElementById("pie_chart").className = "hide_chart";
      document.getElementById("donut_chart").className = "";
      document.getElementById("bar_chart").className = "hide_chart";
    } else if (id === "3") {
      document.getElementById("pie_chart").className = "hide_chart";
      document.getElementById("donut_chart").className = "hide_chart";
      document.getElementById("bar_chart").className = "";
      setChartOption(baroption);
    }
    console.log(document.getElementById("donut_chart").className);
    setChartType(id);
  };
  
  const exportTableToExcel = async () => {
    exportToExcel("byTableHtml", {
        skipColumn: [],
        reportData: dietList,
        table: $(".table-scroll"),
        fileName: `Configure_DIET_Plan`,
        sheetName: "Sheet 1",
        report_header: `DIET Activity`,
    });
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div
            className="dashboard-main-content-info mb-3"
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
            <div className="" id="pie_chart" style={{ marginTop: "1rem" }}>
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
              className="hide_chart"
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
              className="hide_chart"
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
          </div>
        </div>
        
      </div>
      <div className="dashboard-main-content__header mb-3 row">
        <div
          className={`col-xl-12 col-lg-12 col-md-12 col-sm-12 `}
        >
          <div className="dashboard-main-content-info">
            {fobject && fobject?.data?.financialStatus && (
              <Fragment>
                <div className=" p-0 br-6">
                  <div className="d-flex justify-content-between">
                      
                      <h6 className="float-end d-inlone-block mt-2" >
                        Activity Overview
                      </h6>
                      
                      <span>
                      <h6 className="float-end d-inlone-block mt-2 me-2" style={{ color: "#2b4a91" }}>
                        (All ₹ In Lakhs) 
                      </h6>

                      <button
                        type="button"
                        className="btn btn-success float-end mb-2 me-2"
                        onClick={exportTableToExcel}
                        disabled={!dietList?.length}
                        >
                        <i className="bi bi-file-earmark-excel"></i>{" "}
                        <span className="mobile-hide">Export To</span> Excel
                      </button>
                      </span>

                  </div>
                  <div className=" ">
                    <div className="dataTables_wrapper p-0">

                      

                      
                      
                      <div
                        className="table-scroll-section"
                        style={{ height: "474px" }}
                      >
                        <table className="table-scroll hlc">
                          <thead>
                            <tr>
                              <th rowSpan={2}>S. No.</th>
                              <th rowSpan={2}>Sub Component</th>
                              <th rowSpan={2}>Activity Master</th>
                              <th rowSpan={2}>Activity Master Detail</th>
                              <th colSpan={2}>Proposed</th>
                              <th colSpan={2}>Recommanded</th>
                            </tr>

                            <tr>
                              <th>Physical</th>
                              <th>Financial</th>
                              <th>Physical</th>
                              <th>Financial</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dietList.filter((item)=>+item.financial_quantity).map((fr, idx) => {
                              return (
                                <tr
                                  key={`frow_${idx + 1}`}
                                >
                                  <td>{idx + 1}</td>
                                  <td>
                                    {fr.sub_component_name}
                                  </td>
                                  <td>
                                      {fr.activity_master_name}
                                  </td>
                                  <td>
                                    {fr.activity_master_details_name}
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {isNaN(fr.quantity)
                                        ? 0
                                        : fr.quantity}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {
                                        fr.financial_quantity
                                      }
                                    </span>
                                  </td>
                                  
                                  <td>
                                    <span className="cfr">
                                      {
                                        fr.recomended_quantity
                                      }
                                    </span>
                                  </td>
                                  
                                  <td>
                                    <span className="cfr">
                                      {
                                        fr.recomended_financial_amount
                                      }
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          {dietList?.filter((item)=>+item.financial_quantity)?.length>0 && <tfoot>
                            <tr>
                              <th colSpan={4} className="text-end">
                                Total
                              </th>
                              <th className="text-end">
                                {dietList.filter((item)=>+item.financial_quantity).reduce((accumulator, currentValue) => {
                                  return accumulator + parseFloat(currentValue.quantity);
                                }, 0)}
                              </th>
                              <th className="text-end">
                                {dietList.filter((item)=>+item.financial_quantity).reduce((accumulator, currentValue) => {
                                  return accumulator + parseFloat(currentValue.financial_quantity);
                                }, 0)}
                              </th>
                              
                              <th className="text-end">
                                {dietList.filter((item)=>+item.financial_quantity).reduce((accumulator, currentValue) => {
                                  return accumulator + parseFloat(currentValue.recomended_quantity);
                                }, 0)}
                              </th>
                              <th className="text-end">
                                {dietList.filter((item)=>+item.financial_quantity).reduce((accumulator, currentValue) => {
                                  return accumulator + parseFloat(currentValue.recomended_financial_amount);
                                }, 0)}
                              </th>

                            </tr>
                          </tfoot>}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DIETDashboard;
