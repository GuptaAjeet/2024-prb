import React, { Fragment, useEffect, useState } from "react";
import { Column, Helper, Hook, Table, Settings } from "../../../apps";
import api from "../../../apps/utilities/api";
//import { Charts } from "../../../apps/components/elements";
import ReactECharts from "echarts-for-react";
import { useDispatch, useSelector } from "react-redux";
import features from "../../../redux/features";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import store from "../../../redux/app/store";
import exportToExcel from "../../layouts/prabandh/PrabandhReports/ExcelReports";

const PlanDashboard = () => {
  Hook.useStates();
  Hook.useDistricts();
  Hook.useBlocks();
  Hook.useRoles();
  Hook.useDesignations();
  Hook.useMajorComponents();
  Hook.useSubComponents();
  //Hook.useActivityCategories();
  //Hook.useActivitySubCategories();
  //Hook.useAssetCategories();
  //Hook.useAssetSubCategories();
  //Hook.useSchoolManagement();

  const user = Helper.auth.user;
  const dispatch = useDispatch();
  const [dashboard, setDashboard] = useState({});
  const [userType, setuserType] = useState("National");
  const [chartType, setChartType] = useState("1");
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const handler = useSelector((state) => state.handler);
  const { year: defaultYear } = useSelector((state) => state.year);
  const apiYear = store.getState().year.year;

  const object = Hook.usePost({
    url: "api/admin-users/dashboard",
    data: {
      state_id: user?.user_state_id || null,
      district_id: user?.user_district_id || null,
      role: user?.user_role_id || null,
      activity_group_code: user?.activity_group_code || null,
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

  let FRows = [];
  if (fobject !== null && fobject?.data?.financialStatus !== undefined) {
    fobject &&
      fobject?.data?.financialStatus.map((row, i) => {
        return (FRows[i] = {
          srl: Helper.counter(++i, handler.limit, handler.page),
          district_name:
            row.district_name === null ? "Grand Total:" : row.district_name,
          financial_amount_elementary_recuring: Helper.numberFormatter(
            row.financial_amount_elementary_recuring,
            5
          ),
          financial_amount_elementary_nonrecuring: Helper.numberFormatter(
            row.financial_amount_elementary_nonrecuring,
            5
          ),
          financial_amount_elementary: Helper.numberFormatter(
            row.financial_amount_elementary,
            5
          ),
          financial_amount_secondary_recuring: Helper.numberFormatter(
            row.financial_amount_secondary_recuring,
            5
          ),
          financial_amount_secondary_nonrecuring: Helper.numberFormatter(
            row.financial_amount_secondary_nonrecuring,
            5
          ),
          financial_amount_secondary: Helper.numberFormatter(
            row.financial_amount_secondary,
            5
          ),
          financial_amount_teacher_recuring: Helper.numberFormatter(
            row.financial_amount_teacher_recuring,
            5
          ),
          financial_amount_teacher_nonrecuring: Helper.numberFormatter(
            row.financial_amount_teacher_nonrecuring,
            5
          ),
          financial_amount_teacher: Helper.numberFormatter(
            row.financial_amount_teacher,
            5
          ),
          financial_amount: Helper.numberFormatter(row.financial_amount, 5),
          // district_type: row.district_type,
        });
      });
  }

  const chartData = object?.data?.users?.map((v) => ({
    value: +v.financial_amount_recuring + +v.financial_amount_nonrecuring,
    name: v.scheme_name.substring(0, 10) + " " + v.major_component_name,
    // +" (₹ In Lakhs)",
  }));
  let option = {
    title: {
      text: "Major Components ",
      left: "center",
      subtext: "",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // Customize the tooltip content with a div and set its width
        return `<div style="max-width: 300px; white-space: normal; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">
        Major Component <br /> ${params.name}
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
  // const baroption = {
  //   xAxis: {
  //     type: 'category',
  //     // data: chartData?.map(v => (v.name))
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   // series: [
  //   //   {
  //   //     data: chartData?.map(v => (v.value.toFixed())),
  //   //     type: 'bar'
  //   //   }
  //   // ],
  //   series: [
  //     {
  //       name: 'Direct',
  //       type: 'bar',
  //       barWidth: '60%',
  //       data: [10, 52, 200, 334, 390, 330, 220]
  //     }
  //   ]
  // };

  useEffect(() => {
    // try {
    //   api.post(
    //     "api/admin-users/dashboard",
    //     {
    //       state_id: user?.user_state_id || null,
    //       district_id: user?.user_district_id || null,
    //       page: handler.page,
    //       limit: handler.limit,
    //       reload: handler.reload,
    //       where: handler.where,
    //     },
    //     (res) => {
    //       // setDashboard(res.data);
    //       setObject(res);
    //     }
    //   );
    // } catch (er) {
    //   console.log(er);
    // }
    var userDashboardData = {};
    if (
      user?.user_role_id === 1 ||
      user?.user_role_id === 2 ||
      user?.user_role_id === 3
    ) {
      userDashboardData["number_of_national_officers"] = 3;
      userDashboardData["number_of_state_nodal_officers"] = 8;
      userDashboardData["number_of_district_nodal_officers"] = 16;
      userDashboardData["inprogress_elementary_education_activites"] = 20;
      userDashboardData["inprogress_secondary_education_activites"] = 12;
      userDashboardData["inprogress_teacher_education_activites"] = 3;
      userDashboardData["approved_elementary_education_activites"] = 15;
      userDashboardData["approved_secondary_education_activites"] = 10;
      userDashboardData["approved_teacher_education_activites"] = 5;
      userDashboardData["elementary_education_activites"] = 91;
      userDashboardData["secondary_education_activites"] = 50;
      userDashboardData["teacher_education_activites"] = 13;
      setDashboard(userDashboardData);
      setuserType("National");
    } else if (
      user?.user_role_id === 4 ||
      user?.user_role_id === 5 ||
      user?.user_role_id === 6 ||
      user?.user_role_id === 7
    ) {
      userDashboardData["number_of_national_officers"] = 3;
      userDashboardData["number_of_state_nodal_officers"] = 4;
      userDashboardData["number_of_district_nodal_officers"] = 16;
      userDashboardData["inprogress_elementary_education_activites"] = 20;
      userDashboardData["inprogress_secondary_education_activites"] = 12;
      userDashboardData["inprogress_teacher_education_activites"] = 3;
      userDashboardData["approved_elementary_education_activites"] = 15;
      userDashboardData["approved_secondary_education_activites"] = 10;
      userDashboardData["approved_teacher_education_activites"] = 5;
      userDashboardData["elementary_education_activites"] = 91;
      userDashboardData["secondary_education_activites"] = 50;
      userDashboardData["teacher_education_activites"] = 13;
      setDashboard(userDashboardData);
      setuserType("State");
    } else if (
      user?.user_role_id === 8 ||
      user?.user_role_id === 8 ||
      user?.user_role_id === 10 ||
      user?.user_role_id === 11
    ) {
      userDashboardData["number_of_national_officers"] = 3;
      userDashboardData["number_of_state_nodal_officers"] = 1;
      userDashboardData["number_of_district_nodal_officers"] = 4;
      userDashboardData["inprogress_elementary_education_activites"] = 10;
      userDashboardData["inprogress_secondary_education_activites"] = 6;
      userDashboardData["inprogress_teacher_education_activites"] = 2;
      userDashboardData["approved_elementary_education_activites"] = 8;
      userDashboardData["approved_secondary_education_activites"] = 7;
      userDashboardData["approved_teacher_education_activites"] = 5;
      userDashboardData["elementary_education_activites"] = 91;
      userDashboardData["secondary_education_activites"] = 50;
      userDashboardData["teacher_education_activites"] = 13;
      setDashboard(userDashboardData);
      setuserType("District");
    } else {
      userDashboardData["number_of_national_officers"] = 3;
      userDashboardData["number_of_state_nodal_officers"] = 1;
      userDashboardData["number_of_district_nodal_officers"] = 4;
      userDashboardData["inprogress_elementary_education_activites"] = 20;
      userDashboardData["inprogress_secondary_education_activites"] = 12;
      userDashboardData["inprogress_teacher_education_activites"] = 3;
      userDashboardData["approved_elementary_education_activites"] = 15;
      userDashboardData["approved_secondary_education_activites"] = 10;
      userDashboardData["approved_teacher_education_activites"] = 5;
      userDashboardData["elementary_education_activites"] = 91;
      userDashboardData["secondary_education_activites"] = 50;
      userDashboardData["teacher_education_activites"] = 13;
      setDashboard(userDashboardData);
    }

    dispatch(
      features.makeHandler({
        reload: new Date().getTime(),
      })
    );
  }, [defaultYear]);

  const tempDistrictConfig = () => {
    api.post(
      "api/prabandh/tempconfig",
      {
        districtid: user?.user_district_id,
        stateid: user?.user_state_id,
        type: "district",
      },
      (res) => {
        alert("Done");
      }
    );
  };

  const tempStateConfig = () => {
    api.post(
      "api/prabandh/tempconfig",
      {
        districtid: user?.user_district_id,
        stateid: user?.user_state_id,
        type: "state",
      },
      (res) => {
        alert("Done");
      }
    );
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
    setChartType(id);
  };
  const searchData = (e) => {
    dispatch(
      features.makeHandler({
        reload: new Date().getTime(),
        where: Helper.dashboardFilter(e.target.value),
      })
    );
  };

  const exportTableToExcel = async () => {
    api.post(
      `api/admin-users/dashboard`,
      {
        state_id: user?.user_state_id || null,
        district_id: user?.user_district_id || null,
        role: user?.user_role_id || null,
        page: handler.page,
        limit: object?.data?.count,
        reload: handler.reload,
        where: { value: "" },
      },
      (res) => {
        if (res.status) {
          const dataa = res?.data?.users?.map((row) => ({
            ...row,
            financial_amount_recuring: parseFloat(row.financial_amount_recuring)
              ? Helper.numberFormatter(row.financial_amount_recuring, 5)
              : +row?.financial_amount_recuring,
            financial_amount_nonrecuring: parseFloat(
              row.financial_amount_nonrecuring
            )
              ? Helper.numberFormatter(row.financial_amount_nonrecuring, 5)
              : +row?.financial_amount_nonrecuring,
          }));
          console.log("dataa", dataa);
          exportToExcel("genericReport", {
            reportData: dataa,
            headers: Column.dashboard(),
            sheeName: "Sheet 1",
            fileName: "Dashboard_data",
          });
        }
        // setRowList(res.data);
        // setRowListBackup(res.data);
        // setSpin(false);
        // dispatch(Features.hideLoader({ show: "", display: "none" }));
      }
    );
    //  Helper.exportTableToExcel(rows, Column.dashboard(), "Dashboard_data");
  };

  const handleGeneratePdf = async () => {
    const apiVersion = store.getState().version.version;
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/financialpdf`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          state_id: user?.user_state_id || null,
          district_id: user?.user_district_id || null,
          report_type: `Dashboard Data Report`,
          state_name: user.state_name || null,
          district_name: user.district_name || null,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`,
            API_Year: apiYear,
            API_Version: apiVersion,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      setPdfbtnStatus(false);
      link.setAttribute(
        "download",
        `DashboardDataReport_${apiYear}_${datetime}.pdf`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 row" style={{}}>
        {/*         <div
          style={{
            background: "#fff",
            fontSize: "90px",
            color: "#042a61",
            textAlign: "center",
          }}
        >
          <i className="bi bi-clipboard-check"></i>
          <i className="bi bi-currency-rupee"></i>
          <br />
          <i className="bi bi-trophy"></i>
          <i className="bi bi-database"></i>
        </div> */}

        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
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
            <div
              className="row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {apiYear !== "2023-2024" && (
                <div
                  className="col-xl-12"
                  style={{ cursor: "pointer" }}
                  onClick={tempStateConfig}
                >
                  {Settings.isDataExistsInArray(
                    [4, 5, 6, 7, 13, 14],
                    user?.user_role_id
                  ) && (
                    <div className="widget widget-card-four ">
                      <div className="widget-content">
                        <div className="w-content">
                          <div className="w-info mt-2">
                            {/* <h6 className="value">&nbsp;</h6> */}
                            <p>State Config</p>
                          </div>
                          <div className="w-icon">
                            <i className="bi bi-sliders2"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {apiYear !== "2023-2024" && (
                <div
                  className="col-xl-12"
                  // className=" layout-spacing"
                  style={{ cursor: "pointer" }}
                  onClick={tempDistrictConfig}
                >
                  {Settings.isDistrictUser() && (
                    <div className="widget widget-card-four ">
                      <div className="widget-content">
                        <div className="w-content">
                          <div className="w-info mt-2">
                            {/* <h6 className="value">&nbsp;</h6> */}
                            <p>District Config</p>
                          </div>
                          <div className="w-icon">
                            <i className="bi bi-card-list"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 ">
          <div className="dashboard-main-content-info">
            {/* <button
            type="button"
            style={{ marginRight: '1rem' }}
            className="btn btn-danger float-end"
            disabled={(reportData &&
              reportData.length > 0) ? pdfbtnStatus ? true : false : true}
          // onClick={exportToExcel}
          // onClick={handleGeneratePdf}
          >{pdfbtnStatus ? <Btnloader /> : ''} <i className="bi bi-file-earmark-pdf"></i> <span className="mobile-hide">Export To</span>Export To PDF
            </button> */}
            {object && (
              <Fragment>
                <Table
                  object={{
                    columns: Column.dashboard(),
                    data: rows,
                    count: object?.data?.count,
                    create: false,
                    search: false,
                    handleChange: searchData,
                    pdf: true,
                    excel: true,
                    amountType: "All (₹ In Lakhs)",
                    pdfbtnStatus: pdfbtnStatus,
                    exportToExcel: exportTableToExcel,
                    handleGeneratePdf: handleGeneratePdf,
                  }}
                />
              </Fragment>
            )}
          </div>
        </div>
        {/* <div >
          {(data) && <Charts object={{ 'data': data ? data : [], 'options': options, 'height': 730 }} />}
        </div> */}

        {/* <div className="row layout-top-spacing"> */}
        {/* {userType === "National" && <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.number_of_national_officers}
                    </h6>
                    <p>Number of National Officers</p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-speedometer2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>} */}
        {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.number_of_state_nodal_officers}
                    </h6>
                    <p>Number of State Nodal Officers</p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.number_of_district_nodal_officers}
                    </h6>
                    <p>Number of District Nodal Officers</p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div  */}
        {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    
                    <h6 className="value">
                      {dashboard.inprogress_secondary_education_activites}
                    </h6>
                    <p>Inprogress Secondary Education Activites</p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    
                    <h6 className="value">
                      {dashboard.inprogress_teacher_education_activites}
                    </h6>
                    <p>Inprogress Teacher Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    
                    <h6 className="value">
                      {dashboard.approved_elementary_education_activites}
                    </h6>
                    <p>Approved Elementary Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-card-list"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    
                    <h6 className="value">
                      {dashboard.approved_secondary_education_activites}
                    </h6>
                    <p>Approved Secondary Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-sliders2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.approved_teacher_education_activites}
                    </h6>
                    <p>Approved Teacher Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.elementary_education_activites}
                    </h6>
                    <p>Number of Elementary Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.secondary_education_activites}
                    </h6>
                    <p>Number Secondary Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">
                      {dashboard.teacher_education_activites}
                    </h6>
                    <p>Number of Teacher Education Activites </p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-person-gear"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div
            className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing"
            style={{ cursor: "pointer" }}
            onClick={tempStateConfig}
          >
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">&nbsp;</h6>
                    <p>State Config</p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-sliders2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing"
            style={{ cursor: "pointer" }}
            onClick={tempDistrictConfig}
          >
            <div className="widget widget-card-four h200">
              <div className="widget-content">
                <div className="w-content">
                  <div className="w-info">
                    <h6 className="value">&nbsp;</h6>
                    <p>District Config</p>
                  </div>
                  <div className="w-icon">
                    <i className="bi bi-card-list"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        {/* </div> */}
      </div>
      <div className="dashboard-main-content__header mb-3 row">
        <div
          className={`col-xl-12 col-lg-12 col-md-12 col-sm-12 ${
            Settings.isStateUser() ? "" : "d-none"
          }`}
        >
          <div className="dashboard-main-content-info">
            {fobject && fobject?.data?.financialStatus && (
              <Fragment>
                <div style={{ color: "#000", fontSize: "16px" }}>
                  <span className="m-2">
                    <strong>FA</strong> : <em>Financial Amount</em>
                  </span>
                  <span className="m-2">
                    <strong>R</strong> : <em>Recurring</em>
                  </span>
                  <span className="m-2">
                    <strong>NR</strong> : <em>Non Recurring</em>
                  </span>
                </div>
                <div className=" p-0 br-6">
                  <div className=" ">
                    <div className="dataTables_wrapper p-0">
                      <div
                        className="table-scroll-section"
                        style={{ height: "474px" }}
                      >
                        <table className="table-scroll hlc">
                          <thead>
                            <tr>
                              <th>S. No.</th>
                              <th>District Name</th>
                              <th>FA Elementary (R)</th>
                              <th>FA Elementary (NR)</th>
                              <th>FA Elementary</th>
                              <th>FA Secondary (R)</th>
                              <th>FA Secondary (NR)</th>
                              <th>FA Secondary</th>
                              <th>FA Teacher (R)</th>
                              <th>FA Teacher (NR)</th>
                              <th>FA Teacher</th>
                              <th>FA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {FRows.map((fr, idx) => {
                              return (
                                <tr
                                  key={`frow_${idx + 1}`}
                                  className={`${
                                    FRows.length === idx + 1 ? "hlc" : ""
                                  } `}
                                >
                                  <td>{idx + 1}</td>
                                  <td>
                                    {idx === 0
                                      ? "State Component"
                                      : fr.district_name}
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {fr.financial_amount_elementary_recuring}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {
                                        fr.financial_amount_elementary_nonrecuring
                                      }
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {isNaN(fr.financial_amount_elementary)
                                        ? 0
                                        : fr.financial_amount_elementary}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {isNaN(
                                        fr.financial_amount_secondary_recuring
                                      )
                                        ? 0
                                        : fr.financial_amount_secondary_recuring}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {
                                        fr.financial_amount_secondary_nonrecuring
                                      }
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {fr.financial_amount_secondary}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {fr.financial_amount_teacher_recuring}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {fr.financial_amount_teacher_nonrecuring}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {fr.financial_amount_teacher}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="cfr">
                                      {fr.financial_amount}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/*                 <Table
                  object={{
                    columns: Column.financialStatus(),
                    data: FRows,
                    count: fobject?.data?.count,
                    create: false,
                    search: false,
                    handleChange: searchData,
                    pdf: false,
                    excel: false,
                    amountType: "All (₹ In Lakhs)",
                    pdfbtnStatus: pdfbtnStatus,
                    exportToExcel: exportToExcel,
                    handleGeneratePdf: handleGeneratePdf,
                  }}
                /> */}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDashboard;
