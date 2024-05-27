
import React, { useState, useEffect } from 'react'
import { Helper, Hook } from '../../../apps';
import Btnloader from '../../../apps/components/elements/Btnloader';
import store from '../../../redux/app/store';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import api from "../../../apps/utilities/api";
import exportToExcel from "./ExportReports/ExcelReports/index";


export default function DraftPABminutesReport() {

  const user = Helper.auth.user;
  const [stateID, setStateID] = useState(0);
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const [object, setObject] = useState();
  const [, setSpin] = useState(false);
  const stateList = Hook.useStates();
  const [stateName, setStateName] = useState();
  const [newdata, setNewdata] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const scheme = {
    1: "Primary Education",
    2: "Secondary Education",
    3: "Teacher's Eductaion",
  };
  const updateDistrictsList = (e) => {
    setStateID(e.target.value || 0);

  };
  const navigate = useNavigate();

  const exportTableToExcel = async () => {
    const name = stateList.filter(state => +state.id === +stateID);

    exportToExcel("pabReport", {
      reportData: object?.data,
      scheme: scheme,
      fileName: "Draft_PAB_Minutes",
      sheetName: "Sheet 1",
      stateName: name[0]?.name,

    });
  };

  const getStateCostingProposedData = () => {
    setSpin(true);
    api.post(
      "api/prabandh/draft-pab-report",
      { state_id: stateID },
      (res) => {
        setObject(res);
        setSpin(false);
      }
    );
  };


  const handleGeneratePdf = async () => {
    const apiYear = store.getState().year.year;
    const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/draft-PAB-details/${stateID}/${apiYear}`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          Authorization: `Bearer ${Helper.token()}`
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      link.setAttribute(
        "download",
        `DraftPABmenutesReport${apiYear + "_" + currentdate}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      setPdfbtnStatus(false);
    } catch (error) {
      console.error("Error:", error.message);
      setPdfbtnStatus(false);
    }
  };

  useEffect(() => {
    if (stateID !== 0) {
      getStateCostingProposedData();

    } else {
      setObject([]);
    }
  }, [stateID]);

  useEffect(() => {
    console.log(object, "000000000000000000",object?.data);

    if (object != undefined && object?.data) {
      const newdata1 = merger(object?.data)
      console.log(object, "11111111111110");

      setNewdata(newdata1);
    }
  }, [object])

  const merger = (data1) => {
    console.log(data1, "$$$$$$$$$$$$$$")
    let data = data1
    // if (data != undefined) {
    let prev = 0, prev1 = 0, prev2 = 0, prev3 = 0;
    let prev_major = data[0]?.majorcomponentname;
    let prev_sub = data[0]?.subcomponentname;
    let prev_activity = data[0]?.activitymastername;
    let prev_subactivity = data[0]?.activitymasterdetailname;

    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
      data[i].amount = 0;
      data[i].amount1 = 0;
      data[i].state_id = stateID;

      if (prev_major != data[i].majorcomponentname) {
        data[prev].major_colspan = (i - prev);
        prev = i;
        prev_major = data[i].majorcomponentname;
      }
      if (prev_sub != data[i].subcomponentname) {
        if (data[i].subcomponentname === null) {
          data[i].activitymastername = "null1";
        }
        data[prev1].sub_colspan = (i - prev1);
        prev1 = i;
        prev_sub = data[i].subcomponentname;
      }
      if (prev_activity != data[i].activitymastername) {
        data[prev2].activity_colspan = (i - prev2);
        prev2 = i;
        prev_activity = data[i].activitymastername;
      }


    }
    // }
    return data;
  }

  const removeKeysFromArrayObjects = (arr, ...keysToRemove) => {
    return arr.map(item => {
      const newItem = { ...item };
      keysToRemove.forEach(key => delete newItem[key]);
      return newItem;
    });
  };

  const onDataChange = (idx, value) => {
    console.log(idx, "@@@@@@", value)


    const updatedItems = newdata.map(item => {
      if (item.id === idx) {
        return { ...item, amount: value };
      }
      return item;
    });
    setNewdata(updatedItems);

  };
  const onDataChange1 = (idx, value) => {
    console.log(idx, "@@@@@@", value)

    const updatedItems = newdata.map(item => {
      if (item.id === idx) {
        return { ...item, amount1: value };
      }
      return item;
    });
    setNewdata(updatedItems);

  }


  const print = () => {
    const newArray = removeKeysFromArrayObjects(newdata, 'major_colspan', 'sub_colspan', 'activity_colspan');
    console.log(newArray, "final");
    // setSpin(true);
    // api.post(
    //   "api/prabandh/upload-pab-report",
    //   { value: newArray },
    //   (res) => {
    //     console.log(res, "new api")
    //     // setObject(res?.data);
    //     setSpin(false);
    //   }
    // );


  }


  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block", }} className='m3'>Draft PAB Minutes Report</h1>
        <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate("/auth/prabandh/report")}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>
      </div>

      <div
        className="dashboard-main-content-info "
        id="search"
        style={{ backgroundColor: "rgb(43 74 145)" }}
      >
        <div className="row">
          <div className="col-md-3">
            <select
              className="form-select"
              name="state-list"
              value={stateID}
              disabled={user.state_id}
              onChange={updateDistrictsList}
            >
              <option value="0">--Select State--</option>
              {stateList &&
                stateList?.length > 0 &&
                stateList?.map((st, stidx) => {

                  return (
                    <option key={`st_${stidx}`} value={st.id}>
                      {st.name}
                    </option>

                  );
                })}
            </select>
          </div>

          <div className="col-md-9 text-end">
            <button
              type="button"
              style={{ marginRight: "1rem" }}
              className="btn btn-danger float-end "
              disabled={+stateID === 0 || pdfbtnStatus}
              onClick={handleGeneratePdf}
            >
              {pdfbtnStatus ? <Btnloader /> : ""}{" "}
              <i className="bi bi-file-earmark-pdf"></i>{" "}
              <span className="mobile-hide">Export To</span> PDF
            </button>
            <button
              type="button"
              disabled={+stateID === 0 || pdfbtnStatus}
              className="btn btn-success float-end mx-2 d-none"
              onClick={exportTableToExcel}

            >
              <i className="bi bi-file-earmark-excel"></i>{" "}
              <span className="mobile-hide">Export To</span> Excel
            </button>
            <button onClick={print} className='btn btn-danger float-end d-none'>Save </button>
          </div>
        </div>

      </div>
      <div className=' dashboard-main-content-info mt-2 '>
        <div className="table-scroll-section">
          <table className="table-scroll">
            <thead>
              {/* Add headers if needed */}
            </thead>
            <tbody>
              <tr>
                <th rowSpan={2}>#</th>
                <th rowSpan={2}>Major component</th>
                <th rowSpan={2}>Sub component</th>
                <th rowSpan={2}>Activity</th>
                <th rowSpan={2}>Sub Activity</th>
                <th rowSpan={2}>R/NR</th>
                <th colSpan={3}>Proposed By State</th>
                <th colSpan={3}>Recommended by DoSEL</th>
                <th rowSpan={2}>field 1</th>
                <th rowSpan={2}>field 2</th>
                <th rowSpan={2}>Cordinator Remarks</th>
              </tr>
              <tr>
                <th>quantity</th>
                <th>Unit Cost</th>
                <th>Amount</th>
                <th>quantity</th>
                <th>Unit Cost</th>
                <th>Amount</th>
              </tr>
              {/* {console.log(object?.data,"$$$$$$$$$$$$$$$$$$$$$$")} */}
              {newdata?.map((itm, idx) => {
                return <tr key={idx}>
                  <td>{idx + 1}</td>
                  {itm?.majorcomponentname === null ? <td className="fw-bold table-success" colSpan={4}> Total </td> : itm?.major_colspan && itm?.major_colspan > 0 && <td rowSpan={itm?.major_colspan}>{itm?.majorcomponentname}</td>}

                  {itm?.majorcomponentname !== null && (itm?.subcomponentname === null ? <td className="fw-bold table-success" colSpan={3}> Total {itm?.majorcomponentname}</td> : itm?.sub_colspan && itm?.sub_colspan > 0 && <td rowSpan={itm?.sub_colspan}>{itm?.subcomponentname}</td>)}

                  {itm?.subcomponentname !== null && (itm?.activitymastername === null ? <td className="fw-bold table-success" colSpan={2}>Total {itm?.subcomponentname}</td> : itm?.activity_colspan && itm?.activity_colspan > 0 && <td rowSpan={itm?.activity_colspan}>{itm?.activitymasterdetailname}</td>)}

                  {itm?.activitymastername !== null && itm?.subcomponentname !== null && (itm?.activitymasterdetailname === null ? <td className="fw-bold table-success">Total</td> : <td>{itm?.activitymasterdetailname}</td>)}
                  <td>{itm?.recuringnonrecuring}</td>
                  <td>{itm?.physicalquantity}</td>
                  <td>{itm?.proposedunitcost}</td>
                  <td>{itm?.financialamount}</td>
                  <td>{itm?.physicalquantity}</td>
                  <td>{itm?.proposedunitcost}</td>
                  <td>{itm?.financialamount}</td>
                  <td>
                    <input
                      type="number"
                      value={itm.amount}
                      onChange={(e) => { onDataChange(idx, parseFloat(e.target.value, 10)) }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={itm.amount1}
                      onChange={(e) => { onDataChange1(idx, parseFloat(e.target.value, 10)) }}
                    />
                  </td>
                  <td>{itm?.coordinatorremarks}</td>
                </tr>
              }
              )}
            </tbody>
          </table>

        </div>
      </div>

    </div>
  )
}
