import { useEffect, useState } from "react";
import { Helper, Hook } from "../../../apps";
import api from "../../../apps/utilities/api";
import { REACT_APP_URL } from "../../../env";
import axios from "axios";
import Btnloader from "../../../apps/components/elements/Btnloader";
import "../prabandh/spill.css";
import exportToExcel from "../reports/ExportReports/ExcelReports";

const ViewReport = (props) => {
  const user = Helper.auth.user;
  const [reportData, setReportData] = useState([]);
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const [,refresh] = useState(new Date().getMilliseconds());
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [schemeNameRowSpan, setSchemeNameRowSpan] = useState([]);
  const [majorComponentRowSpan, setMajorComponentRowSpan] = useState([]);
  const [subComponentRowSpan, setSubComponentRowSpan] = useState([]);
  const [activityMasterRowSpan, setActivityMasterRowSpan] = useState([]);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const state_name = stateList?.filter((c) => c.id === stateID);


  const district_name = districtsList?.filter((c) => c.id === districtID);
  useEffect(() => {
    if (user.user_role_id >= 8 || props.user_role_id >= 4) {
      api.post(
        "api/prabandh/report",
        {
          report_id: 123,
          user: user,
          state_id: props?.user_state_id
            ? props?.user_state_id
            : user.user_state_id,
          district_id: props?.user_district_id
            ? props?.user_district_id
            : user.user_district_id,
          year: new Date().getFullYear(),
        },
        (res) => {
          setReportData(res.data.rows);
        }
      );
    }

    setStateID(user.user_state_id || 0);
    setDistrictID(user.user_district_id || 0);
    //getStateList();
    getDistrictsList("find", user?.user_state_id || 0);
  }, [refresh]);

  useEffect(() => {
    calculateRowSpan();
  }, [reportData]);
  useEffect(() => {
    dependencyHandler(schemeNameRowSpan, "major_component_name");
  }, [schemeNameRowSpan]);
  useEffect(() => {
    dependencyHandler(majorComponentRowSpan, "sub_component_name");
  }, [majorComponentRowSpan]);
  useEffect(() => {
    dependencyHandler(subComponentRowSpan, "activity_master_name");
  }, [subComponentRowSpan]);

  /*   const getStateList = () => {
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
    });
  }; */

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        setDistrictsList(res.data);
      }
    );
  };

  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);
    getDistrictsList("find", e.target.value);
  };

  const calculateRowSpan = () => {
    if (reportData != null && reportData.length > 0) {
      let namesArr = {};
      setSchemeNameRowSpan(
        reportData.reduce((result, item, key) => {
          if (namesArr[item.scheme_name] === undefined) {
            namesArr[item.scheme_name] = key;
            result[key] = 1;
          } else {
            const firstIndex = namesArr[item.scheme_name];
            if (firstIndex === key - 1 || (item.scheme_name === reportData[key - 1].scheme_name && result[key - 1] === 0)) {
              result[firstIndex]++;
              result[key] = 0;
            } else {
              result[key] = 1;
              namesArr[item.scheme_name] = key;
            }
          }
          return result;
        }, [])
      );
    }
  };

  const dependencyHandler = (parentCol, childCol) => {
    if (reportData != null && reportData.length > 0 && parentCol != null && parentCol.length > 0) {
      switch (childCol) {
        case "major_component_name":
          setMajorComponentRowSpan(calculateDependentRowSpan(parentCol, childCol));
          break;

        case "sub_component_name":
          setSubComponentRowSpan(calculateDependentRowSpan(parentCol, childCol));
          break;

        case "activity_master_name":
          setActivityMasterRowSpan(calculateDependentRowSpan(parentCol, childCol));
          break;
      }
    }
  };

  const calculateDependentRowSpan = (parentCol, childCol) => {
    if (reportData != null && reportData.length > 0 && parentCol != null && parentCol.length > 0) {
      let rowSpan = [];
      parentCol.forEach((item, index) => {
        let items = {};
        let itemCounter = {};

        if (item > 1) {
          for (let i = index; i < index + item; i++) {
            if (items[reportData[i][childCol]] === undefined) {
              items[reportData[i][childCol]] = i;
              itemCounter[reportData[i][childCol]] = 1;
            }
            if (i - 1 >= index && reportData[i][childCol] === reportData[i - 1][childCol]) {
              itemCounter[reportData[i][childCol]]++;
            } else {
              itemCounter[reportData[i][childCol]] = 1;
            }
          }

          Object.values(items).forEach((item, index) => {
            rowSpan[item] = itemCounter[Object.keys(items)[index]];
          });
        }

        if (item === 1) {
          rowSpan[index] = item;
        }

        if (rowSpan[index] === undefined) {
          rowSpan[index] = 0;
        }
      });
      return rowSpan;
    }
  };

  const fetchReportData = (e) => {
    setDistrictID(e.target.value || 0);
    if (e.target.value > 0) {
      api.post(
        "api/prabandh/report",
        {
          report_id: 123,
          user: user,
          state_id: stateID,
          district_id: e.target.value,
          year: new Date().getFullYear(),
        },
        (res) => {
          setReportData(res.data.rows);
        }
      );
    }
  };

  const exportTableToExcel = () => {
    exportToExcel("viewReport", {
      reportData: reportData,
      schemeNameRowSpan: schemeNameRowSpan,
      majorComponentRowSpan: majorComponentRowSpan,
      activityMasterRowSpan: activityMasterRowSpan,
      sheetName: "Sheet 1",
      fileName: "Filled_plan",
    });
  };

  const handleGeneratePdf = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/snodistrictreport`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          state_id: stateID,
          district_id: +districtID,
          state_name:
            state_name?.length === 0 ? "--Select State--" : state_name[0].name,
          district_name:
            district_name?.length === 0
              ? "All District"
              : district_name[0].district_name,
          report_type: "District Report",
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`
          },
        }
      );
      setPdfbtnStatus(false);
      if (response) {
      }

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
        "_" +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      link.setAttribute(
        "download",
        `ViewReport_${
          state_name[0]?.name === undefined
            ? "--Select State--"
            : state_name[0]?.name
        }_${
          district_name[0]?.district_name === undefined
            ? "All District"
            : district_name[0]?.district_name
        }_2024-2025_${datetime}.pdf`
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
      {!props.user_role_id && (
        <div className="dashboard-main-content__header px-2">
          <h1>View Reports</h1>
        </div>
      )}

      {!props.user_role_id && (
        <div className="row p-3">
          <div
            className="dashboard-main-content-info mb-2"
            id="search"
            style={{ backgroundColor: "rgb(5 43 96)" }}
          >
            <div className="row">
              <div className="col-md-3">
                <select
                  className="form-select"
                  name="state-list"
                  value={stateID}
                  disabled={user.user_role_id >= 4 ? true : false}
                  onChange={updateDistrictsList}
                >
                  <option value="0">Select State</option>
                  {stateList &&
                    stateList.length > 0 &&
                    stateList.map((st, stidx) => {
                      return (
                        <option key={`st_${stidx}`} value={st.id}>
                          {st.name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  name="districts-list"
                  disabled={user.user_role_id >= 8 ? true : false}
                  onChange={fetchReportData}
                  value={districtID}
                >
                  <option value={null}>All District</option>
                  {districtsList &&
                    districtsList.length > 0 &&
                    districtsList.map((ds, dsidx) => {
                      return (
                        <option key={`ds_${dsidx}`} value={ds.id}>
                          {ds.district_name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="col-md-6 text-end ml-1">
                <button
                  type="button"
                  style={{ marginLeft: "1rem" }}
                  className="btn btn-danger float-end"
                  disabled={pdfbtnStatus || reportData?.length === 0}
                  onClick={handleGeneratePdf}
                >
                  {pdfbtnStatus ? <Btnloader /> : ""}{" "}
                  <i className="bi bi-file-earmark-pdf"></i>{" "}
                  <span className="mobile-hide">Export To</span> PDF
                </button>
                <button
                  type="button"
                  className="btn btn-success float-end"
                  onClick={exportTableToExcel}
                >
                  <i className="bi bi-file-earmark-excel"></i>{" "}
                  <span className="mobile-hide">Export To</span> Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-content-info">
        <div className="table-scroll-section">
          <table className="table-scroll">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Scheme</th>
                <th>Major Component</th>
                <th>Sub Component</th>
                <th>Activity</th>
                <th>Sub Activity</th>
                <th>Physical Quantity</th>
                <th>
                  Financial Amount <br /> (₹ In Lakhs)
                </th>
                <th className="d-none">UOM</th>
                <th>
                  Unit Cost <br /> (₹ In Lakhs)
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData &&
                reportData.length > 0 &&
                reportData.map((d, idx) => {
                  return (
                    <tr key={`row_${idx + 1}`}>
                      <td>{idx + 1}</td>
                      {schemeNameRowSpan[idx] > 0 && (<td rowSpan={schemeNameRowSpan[idx]}>{d.scheme_name}</td>)}
                      {majorComponentRowSpan[idx] > 0 && (<td rowSpan={majorComponentRowSpan[idx]}>{d.major_component_name}</td>)}
                      {subComponentRowSpan[idx] > 0 && (<td rowSpan={subComponentRowSpan[idx]}>{d.sub_component_name}</td>)}
                      {activityMasterRowSpan[idx] > 0 && (<td rowSpan={activityMasterRowSpan[idx]}>{d.activity_master_name}</td>)}
                      <td>{d.activity_master_details_name}</td>
                      <td className="text-end">{d.physical_quantity}</td>
                      <td className="text-end">
                        {Helper.numberFormatter(d.financial_amount, 5)}
                      </td>
                      <td className="d-none">{d.uom}</td>
                      <td className="text-end">
                        {Helper.numberFormatter(d.unit_cost, 5)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
