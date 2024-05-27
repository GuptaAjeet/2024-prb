import { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import Features from "../../../redux/features";
import { Modal } from "../../../apps/components/elements";
import { Helper, Hook, Settings, API } from "../../../apps";
import Spinner from "../../../apps/components/elements/Spinner";
import AGGridSchoolConfigurator from "./School/AGGridSchoolConfigurator";
import "./spill.css";
import Btnloader from "../../../apps/components/elements/Btnloader";
import $ from "jquery";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import ConfirmationDialog from "../../../apps/components/form/ConfirmationDialog";
import exportToExcel from "./PrabandhReports/ExcelReports";
import store from "../../../redux/app/store";

const ViewEditFormState = (props) => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  // const [stateID, setStateID] = useState(0);
  const states = Hook.useStates();
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [schemesList, setSchemesList] = useState([]);
  const [userPer, setUserPer] = useState([]);
  const [approvedBtn, setApprovedBtn] = useState({});
  const [scheme, setScheme] = useState(0);
  const [majorComponenetList, setMajorComponenetList] = useState([]);
  //const [blockID, setBlockID] = useState(0);
  //const [formData, setFormData] = useState([{ key: null, value: {} }]);
  //const [blocksList, setBlocksList] = useState([]);
  //const [schoolsList, setSchoolsList] = useState([]);
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  const [districtsList, setDistrictsList] = useState([]);
  const district_name = districtsList.filter((v) => v.id == districtID);
  //const [summaryData, setSummaryData] = useState([]);
  //const [activeUDISE, setActiveUDISE] = useState("");
  //const [dataEntryLevel, setDataEntryLevel] = useState("");
  const [rowList, setRowList] = useState([]);
  //const [gridColumns, setGridColumns] = useState([]);
  //const [gridRows, setGridRows] = useState([]);
  const [activeRowID, setActiveRowID] = useState(0);
  const [actJSN, setActJSN] = useState({ s: 0, d: 0, n: false });
  const [spin, setSpin] = useState(false);
  const [activeAMD, setActiveAMD] = useState(0);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [subCompList, setSubCompList] = useState([]);
  const [actMasterList, setActMasterList] = useState([]);
  const [actMasterDetailList, setActMasterDetailList] = useState([]);
  const [confrmData, setConfrmData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState({
    state: "0",
    district: "0",
    scheme_id: "0",
    major_component_id: "0",
    sub_component_id: "0",
    activity_master_id: "0",
    activity_master_details_id: "0",
    allDistricts: false,
  });
  const [rowListBackup, setRowListBackup] = useState([]);

  const reset = () => {
    setDistrictID(0);
    setScheme(0);
    setFilter({
      ...filter,
      scheme_id: "0",
      major_component_id: "0",
      sub_component_id: "0",
      activity_master_id: "0",
      activity_master_details_id: "0",
      allDistricts: false,
    });
    search();
  };

  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        state: user?.user_state_id,
        district: user?.user_district_id,
      };
    });
  }, []);

  useEffect(() => {
    if (props.stateRowsParent) {
      props.stateRowsParent(rowList);
    }
  }, [rowList]);

  useEffect(() => {
    getSchemesList();
    let st = 0;
    let dt = 0;
    if (Settings.isStateUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      setStateID(+st);
      getDistrictsList("find", +st);
      setTimeout(() => {
        if (districtID !== 0) {
          setDistrictID(districtID);
        } else {
          setDistrictID(+dt);
        }
      }, 1000);
    }
    setSpin(true);
    dispatch(Features.showLoader({ show: "show", display: "block" }));

    API.post(`api/prabandh/view-edit-form-state_edit-by-district`, { user: user, state_id: st, district_id: dt, scheme_id: 0, major_component_id: "0" },
      (res) => {
        setRowList(res.data);
        setRowListBackup(res.data);
        setSpin(false);
        dispatch(Features.hideLoader({ show: "", display: "none" }));
      }
    );

    API.post(`api/prabandh/get-apr-btn-status`, { state_id: stateID, district_id: districtID },
      (res) => {
        setApprovedBtn({});
      }
    );
    if (user?.user_state_id) {
      setStateID(user?.user_state_id);
      getDistrictsList("find", user?.user_state_id);
    }
    setDistrictID(user?.user_district_id ? user?.user_district_id : 0);
    getUserPer();
  }, [user]);

  useEffect(() => {
    const district_id = $("select[name=districts-list]").val();
    if (district_id) {
      const scheme_id = $("select[name=scheme_id]").val();
      const major_component_id = $("select[name=major_component_id]").val();
      const sub_component_id = $("select[name=sub_component_id]").val();
      const activity_master_id = $("select[name=activity_master_id]").val();
      const activity_master_details_id = $(
        "select[name=activity_master_details_id]"
      ).val();

      API.post(`api/prabandh/view-edit-form-state_edit-by-district`,
        {
          user: user,
          state_id: user?.user_state_id,
          district_id: district_id,
          scheme_id: scheme_id || "0",
          major_component_id: major_component_id || "0",
          sub_component_id: sub_component_id || "0",
          activity_master_id: activity_master_id || "0",
          activity_master_details_id: activity_master_details_id || "0",
        },
        (res) => {
          setRowList(res.data);
          setRowListBackup(res.data);
          setSpin(false);
        }
      );
    }
  }, [refresh]);

  const getUserPer = () => {
    API.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  const getSchemesList = () => {
    setSpin(true);
    API.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
      setSpin(false);
    });
  };

  /*   const getStateList = () => {
    setSpin(true);
    API.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    setSpin(true);
    API[method === "list" ? "get" : "post"](`api/districts/${endpoint}`, data,
      (res) => {
        setDistrictsList(res.data);
        setSpin(false);
      }
    );
  };

  const getMajorComponenetList = (value) => {
    setSpin(true);
    API.post("api/prabandh/major-components", { schemeid: value }, (res) => {
      setMajorComponenetList(res.data);
      setSpin(false);
    });
  };

  /*   const getBlocksList = (method, district_id = 0) => {
    const endpoint = district_id === 0 ? "list" : "find";
    const data = district_id === 0 ? null : { block_district_id: district_id };

    API[district_id === 0 ? "get" : "post"](
      `api/blocks/${endpoint}`,
      data,
      (res) => {
        setBlocksList(res.data);
      }
    );
  }; */

  /*   const getSchoolsList = (block_id = 0, formGlobalCode = 0, summary = null) => {
    API.post(`api/schools/find`, { block_id: block_id }, (res) => {
      setSchoolsList(res.data);
      //setActiveUDISE("");
    });
  }; */

  /*   const makeRequiredRowsAndColumns = (data) => {
    const includedFields = [
      "scheme_name",
      "major_component_name",
      "sub_component_name",
      "activity_master_name",
      "activity_master_details_name",
    ];

    const columns = includedFields.map((columnId) => ({
      columnId,
      resizable: true,
    }));

    const rows = [
      {
        rowId: "headerRow",
        cells: columns.map(({ columnId }) => ({
          type: "header",
          text: columnId,
        })),
      },
      ...data.map((item, idx) => ({
        rowId: idx,
        cells: columns.map(({ columnId }) => ({
          type: "text",
          text: item[columnId],
        })),
      })),
    ];


    setGridColumns(columns);
    setGridRows(rows);
  }; */

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sVal = $("select[name=state-list]").val();
    if (name === "state-list") {
      +value === 0 ? setActJSN({ n: false, d: 0, s: 0 }) : setActJSN({ n: true, d: 0, s: +value });
      getDistrictsList("find", value);
      setStateID(+value);
    }
    if (name === "districts-list") {
      setActJSN({ n: true, s: +sVal, d: +value });
      setDistrictID(+value);
    }
    if (name === "scheme_id") {
      setScheme(+value);
      getMajorComponenetList(+value);
    }

    setFilter((prevState) => { return { ...prevState, [name]: value } });

    if (name == "scheme_id" && value == 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          scheme_id: 0,
          major_component_id: 0,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name == "major_component_id" && value == 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name == "sub_component_id" && value == 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name == "activity_master_id" && value == 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_details_id: 0,
        };
      });
    }

    search();
  };

  const getStatus = (type) => {
    if (user.user_role_id < type) {
      return false;
    } else {
      return true;
    }
  };

  const search = () => {
    setSpin(true);
    setTimeout(() => {
      const state_id = $("select[name=state-list]").val();
      const district_id = $("select[name=districts-list]").val();
      const scheme_id = $("select[name=scheme_id]").val();
      const major_component_id = $("select[name=major_component_id]").val();
      const sub_component_id = $("select[name=sub_component_id]").val();
      const activity_master_id = $("select[name=activity_master_id]").val();
      const activity_master_details_id = $("select[name=activity_master_details_id]").val();

      API.post(`api/prabandh/view-edit-form-state_edit-by-district`,
        {
          user: user,
          state_id: user?.user_state_id,
          district_id: district_id,
          scheme_id: scheme_id || "0",
          major_component_id: major_component_id || "0",
          sub_component_id: sub_component_id || "0",
          activity_master_id: activity_master_id || "0",
          activity_master_details_id: activity_master_details_id || "0",
        },
        (res) => {
          setRowList(res.data);
          setRowListBackup(res.data);
          setSpin(false);
        }
      );
    }, 1000);
  };

  const editThis = (e, row) => {
    setRowListBackup(rowList);
    setActiveRowID(row.id);
  };

  const saveThis = (e, row) => {
    const id = row.id;
    const pq = $(`#pq_${row.id}`).val();
    const fa = $(`#fa_${row.id}`).val();
    const uo = $(`#uom_${row.id}`).val();
    const uc = $(`#uc_${row.id}`).val();
    const ppq = $(`#proposed_physical_quantity_${row.id}`).val();
    const pfa = $(`#proposed_financial_amount_${row.id}`).val();
    const puc = $(`#proposed_unit_cost_${row.id}`).val();
    const state_id = $("select[name=state-list]").val();
    const district_id = $("select[name=districts-list]").val();

    API.post(`api/prabandh/modifydata`,
      {
        id: id,
        physical_quantity: pq || 0,
        financial_amount: +pq * +uc || 0,
        uom: uo || "",
        unit_cost: uc || "",
        proposed_physical_quantity: ppq || 0,
        proposed_financial_amount: pfa || 0,
        proposed_unit_cost: puc || 0,
        state_id: state_id,
        district_id: district_id,
      },
      (res) => {
        dispatch(
          Features.showToast({
            message: "Data updated successfully.",
            flag: "info",
          })
        );
        setActiveRowID(0);
      }
    );
  };

  const resetThis = (e, row) => {
    setRowList(rowListBackup);
    setActiveRowID(0);
  };

  var final_amount = null;

  const handleInput = (e, index, keyName) => {
    if (keyName === "unit_cost") {
      setRowList((prevState) => {
        prevState[index].unit_cost = Helper.numberFormatter(e.target.value, 5);
        prevState[index].financial_amount = Helper.numberFormatter(+e.target.value * +prevState[index].physical_quantity, 5);
        return [...prevState];
      });
    } else {
      setRowList((prevState) => {
        prevState[index][e.target.name] = Helper.numberFormatter(e.target.value, 5);
        return [...prevState];
      });
    }

    // const getMainID = e.target.id.split("_")[1];
    // let copiedData = JSON.parse(JSON.stringify(rowList));

    // if (keyName === "unit_cost") {
    //   const getpqVal = $(`#pq_${getMainID}`).val();
    //   const getucVal = $(`#uc_${getMainID}`).val();
    //   $(`#fa_${getMainID}`).val(
    //     (parseFloat(getpqVal) * parseFloat(getucVal)).toFixed(5)
    //   );
    // }

    // if (
    //   copiedData[index].physical_quantity !== null &&
    //   copiedData[index].financial_amount !== null
    // ) {
    //   copiedData[index].unit_cost = Helper.numberFormatter(
    //     Helper.unitCostCalculator(
    //       copiedData[index].physical_quantity,
    //       copiedData[index].financial_amount,
    //       1
    //     ),
    //     5
    //   );
    //   setRowList(copiedData);
    // }
  };

  const [pdfStatus, setPdfStatus] = useState(false);

  const openSchoolModal = (e, itm) => {
    setActiveAMD(itm);
    dispatch(
      Features.showModal({
        title: "Block-Schools Selection",
        size: "fullscreen",
        btntext: "Select",
      })
    );
  };

  const getSubCompList = (value) => {
    setSpin(true);
    API.post("api/prabandh/sub-components-list", { schemeid: scheme, major_component_id: value },
      (res) => {
        if (res.status) {
          setSubCompList(res.data.rows);
        }
        setSpin(false);
      }
    );
  };

  const getActMasterList = (value) => {
    setSpin(true);
    API.post("api/prabandh/active-master-list", { schemeid: filter?.scheme_id, major_component_id: filter?.major_component_id, sub_component_id: value },
      (res) => {
        setActMasterList(res.data);
        setSpin(false);
      }
    );
  };

  const getActMasterDetailList = (value) => {
    setSpin(true);
    API.post("api/prabandh/active-master-detail-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: filter?.sub_component_id,
        activity_master_id: value,
      },
      (res) => {
        setActMasterDetailList(res.data);
        setSpin(false);
      }
    );
  };

  const exportTableToExcel = async (fileName = "view_edit_form_state") => {
    let headers = [
      { srl: "S.No." },
      { scheme_name: "SCHEME" },
      { major_component_name: "MAJOR COMPONENT" },
      { sub_component_name: "SUB COMPONENT" },
      { activity_master_name: "ACTIVITY" },
      { activity_master_details_name: "SUB ACTIVITY" },
      { physical_quantity: "PHYSICAL QUANTITY" },
      { unit_cost: "UNIT COST (₹ In Lakhs)" },
      { financial_amount: "FINANCIAL AMOUNT (₹ In Lakhs)" },
    ];

    exportToExcel("vieweditformstate", {
      reportData: rowList,
      headers: headers,
      fileName: fileName,
      sheetName: "Sheet 1",
    });
  };

  const handleGeneratePdf = async (fileName) => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/submitstateplan`;
    const state_id = $("select[name=state-list]").val();
    const district_id = $("select[name=districts-list]").val();
    const scheme_id = $("select[name=scheme_id]").val();
    const major_component_id = $("select[name=major_component_id]").val();
    const sub_component_id = $("select[name=sub_component_id]").val();
    const activity_master_id = $("select[name=activity_master_id]").val();
    const activity_master_details_id = $("select[name=activity_master_details_id]").val();
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    const d = district_name[0] && district_name[0]["district_name"];
    const capitalizedD = d && d.toLowerCase().charAt(0).toUpperCase() + d.slice(1).toLowerCase();

    try {
      setPdfStatus(true);
      const response = await axios.post(pdfUrl,
        {
          user: user,
          state_id: user?.user_state_id,
          district_id: +district_id || 0,
          scheme_id: scheme_id || "0",
          major_component_id: major_component_id || "0",
          sub_component_id: sub_component_id || "0",
          activity_master_id: activity_master_id || "0",
          activity_master_details_id: activity_master_details_id || "0",
          report_type: "State Plan Report",
          state_name: user?.state_name,
          district_name: user?.district_name || capitalizedD === undefined ? null : capitalizedD && capitalizedD,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            API_Year: apiYear,
            API_Version: apiVersion,
            Authorization: `Bearer ${Helper.token()}`
          },
        }
      );

      var currentdate = new Date();
      var datetime = `${currentdate.getDate()}/${(currentdate.getMonth() + 1)}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
      setPdfStatus(false);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + "_" + datetime + ".pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
      setPdfStatus(false);
    }
  };

  const district = $("select[name=districts-list]").val();

  const handleSchoolsDownload = (e, obj) => {
    try {
      const district_id = $("select[name=districts-list]").val();

      API.download("api/prabandh/state-view-edit-formstate",
        {
          state_id: user?.user_state_id || null,
          activityObj: obj,
          district_id: district_id,
          scheme_id: obj?.scheme_id || "0",
          major_component_id: obj?.major_component_id || "0",
          sub_component_id: obj?.sub_component_id || "0",
          activity_master_id: obj?.activity_master_id || "0",
          activity_master_details_id: obj?.activity_master_details_id || "0",
        },
        (res) => { }
      );
    } catch (error) { }
  };
  return (
    <div className="dashboard-main-content">
      {isOpen && (
        <ConfirmationDialog onConfirm={(e) => {
            setIsOpen(false);
            confrmData.callBack();
          }}
          isOpen={isOpen} setIsOpen={setIsOpen} title={confrmData.title} text={confrmData.text}
        />
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}></div>

      {props && props.viewMode != "read-only" && (
        <div className="dashboard-main-content__header d-flex justify-content-between">
          <h1>View/Edit Form District</h1>
          <div>
            <button className="btn btn-success cfr float-end ms-2" disabled={rowList?.length === 0 ? true : false} onClick={(e) => exportTableToExcel("State_plan")}>
              <i className="bi bi-file-earmark-excel"></i>{" "}
              <span className="mobile-hide">Export To</span> Excel
            </button>
            <button type="button" className="btn btn-danger cfr float-end ms-2" disabled={rowList?.length === 0 ? true : pdfStatus} onClick={(e) => handleGeneratePdf("State_plan")}>
              {pdfStatus ? <Btnloader /> : ""}{" "}
              <i className="bi bi-file-earmark-pdf"></i>{" "}
              <span className="mobile-hide">Export To</span> PDF
            </button>
          </div>
        </div>
      )}
      {props && props.viewMode != "read-only" && (
        <div className="dashboard-main-content-info mb-3 mt-3" id="search" style={{ backgroundColor: "rgb(43 74 145)" }}>
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                <div className="col-md-6">
                  <select className="form-select" name="state-list" value={stateID} onChange={handleChange}
                    disabled={stateList?.find((state) => +state.id === user.user_state_id)}
                  >
                    <option value={0}>State (All)</option>
                    {userPer?.length ? userPer.reduce((uniqueStates, currentItem) => {
                      if (!uniqueStates.some((item) => item.state_id === currentItem.state_id)) {
                        uniqueStates.push(currentItem);
                      }
                      return uniqueStates;
                    }, [])
                      .map((st, stidx) => (
                        <option key={`st_${stidx}`} value={st.state_id}>
                          {st.state_name}
                        </option>
                      ))
                      : stateList?.map((st, stidx) => (
                        <option key={`st_${stidx}`} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <select className="form-select" name="districts-list" value={districtID} onChange={handleChange}
                    disabled={districtsList.find((district) => +district.id === +user.user_district_id)}
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

                {/*               <div className="col-md-4">
                <select
                  className="form-select"
                  name="blocks-list"
                  disabled={getStatus(11)}
                  onChange={updateSchoolList}
                >
                  <option value={0}>Block (All)</option>
                  {blocksList &&
                    blocksList.length > 0 &&
                    blocksList.map((b, idx) => {
                      return (
                        <option key={`bl_${idx}`} value={b.id}>
                          {b.name}
                        </option>
                      );
                    })}
                </select>
              </div> */}

                {/*               <div className="col-md-3">
                <select
                  className="form-select"
                  name="schools-list"
                  disabled={getStatus(12)}
                  value={activeUDISE}
                  onChange={(e) => {
                    setActiveUDISE(e.target.value);
                  }}
                >
                  <option value={0}>Select School (All)</option>
                  {schoolsList &&
                    schoolsList.length > 0 &&
                    schoolsList.map((s, sidx) => {
                      return (
                        <option key={`sc_${sidx}`} value={s.school_id}>
                          {s.school_name}
                        </option>
                      );
                    })}
                </select>
              </div> */}

                {/*               <div className="col-md-1">
                <button className="btn btn-secondry" onClick={search}>
                  <i className="bi bi-search" />
                </button>
              </div> */}
              </div>
            </div>
          </div>
          <div className="row mt-3" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">INDICATOR FILTER</h6>
              <div className="row">
                <div className="col-md-2">
                  <select className="form-select" name="scheme_id" value={scheme} onChange={handleChange}>
                    <option value={0}>Scheme (All)</option>
                    {userPer?.length ? userPer.filter((usep) => usep.state_id === stateID).reduce((uniqueStates, currentItem) => {
                      if (!uniqueStates.some((item) => item.scheme_id === currentItem.scheme_id)) {
                        uniqueStates.push(currentItem);
                      }
                      return uniqueStates;
                    }, [])
                      .map((s, idx) => {
                        return (
                          <option key={`sl_${idx + 1}`} value={s.scheme_id}>
                            {s.scheme_name}
                          </option>
                        );
                      })
                      : schemesList.map((s, idx) => (
                        <option key={`sl_${idx + 1}`} value={s.id}>
                          {s.scheme_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select className="form-select" name="major_component_id" value={filter?.major_component_id}
                    onChange={(e) => {
                      handleChange(e);
                      getSubCompList(e.target.value);
                    }}
                  >
                    <option value={0}>Major Component (All)</option>
                    {userPer?.length ? userPer.filter((usep) => usep.state_id === stateID).map((s, idx) => {
                      if (scheme === s.scheme_id) {
                        return (
                          <option key={`sl_${idx + 1}`} value={s.activity_id}>
                            {s.activity_name}
                          </option>
                        );
                      }
                    })
                      : majorComponenetList.map((m, idx) => (
                        <option key={`mc_${idx + 1}`} value={m.prb_major_component_id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select className="form-select" name="sub_component_id" value={filter?.sub_component_id}
                    onChange={(e) => {
                      handleChange(e);
                      getActMasterList(e.target.value);
                    }}
                  >
                    <option value={0}>Sub Component (All)</option>
                    {subCompList && subCompList.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.sub_component_id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <select className="form-select" name="activity_master_id" value={filter?.activity_master_id}
                    onChange={(e) => {
                      handleChange(e);
                      getActMasterDetailList(e.target.value);
                    }}
                  >
                    <option value={0}>Activity (All)</option>
                    {actMasterList?.filter((objFirst) => !rowList.some((objSecond) => objSecond.activity_master_details_id === objFirst.id)).map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <select className="form-select" name="activity_master_details_id" value={filter?.activity_master_details_id} onChange={(e) => { handleChange(e); }}>
                    <option value={0}>Sub Activity (All)</option>
                    {actMasterDetailList?.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.id}>
                        {m.activity_master_details_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-1">
                  <button className="btn btn-danger"
                    onClick={(e) => {
                      if (+filter.state) {
                        // sweetAlert.confirmation({title:"Are you sure?",msg:"You want to Reset this, It will remove all data for this state.", yesBtnText: "Yes", noBtnText: "No", url: '', callback: reset, redirect: ''})
                        setConfrmData({
                          callBack: reset,
                          title: "Confirmation",
                          text: "Are you sure ?, <br/> you want to Reset Filter, It will Reset all data for your state.",
                        });
                        setIsOpen(true);
                      }
                    }}
                  >
                    Reset{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-content-info">
        <div className="table-scroll-section" style={{ textAlign: "center" }}>
          {props && props.viewMode == "read-only" && (
            <div className="row mb-2">
              <div className="col-xl-8 col-lg-8 col-sm-8"></div>

              <div className="col-xl-4 col-lg-4 col-sm-4">
                <button type="button" className="btn btn-danger cfr" disabled={pdfStatus} onClick={(e) => handleGeneratePdf("Approved_state_plan")}>
                  {pdfStatus ? <Btnloader /> : ""}{" "}
                  <i className="bi bi-file-earmark-pdf"></i>{" "}
                  <span className="mobile-hide">Export To</span> PDF
                </button>

                <button className="btn btn-success cfr mx-2" onClick={(e) => exportTableToExcel("Approved_state_plan")}>
                  <i className="bi bi-file-earmark-excel"></i>{" "}
                  <span className="mobile-hide">Export To</span> Excel
                </button>
              </div>
            </div>
          )}
          {spin ? (
            <Spinner />
          ) : rowList?.length === 0 ? (
            <h3>No Data Found</h3>
          ) : (
            <div className="table-scroll-section">
              <table className="table-scroll table-sm">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>SCHEME</th>
                    <th>MAJOR COMPONENT</th>
                    <th>SUB COMPONENT</th>
                    <th>ACTIVITY</th>
                    <th>SUB ACTIVITY</th>
                    {Settings.isStateDataEntryUser() && districtID > 0 && (<th>SCHOOLS</th>)}
                    <th>PHY. QTY.</th>
                    <th>UNIT COST <br /> (₹ In Lakhs)</th>
                    <th>FIN. AMT. <br /> (₹ In Lakhs)</th>
                    {/* <th>UOM</th>   */}
                    {props && props.viewMode != "read-only" && Settings.isStateDataEntryUser() && districtID > 0 && rowList && rowList[0]["status"] < 6 && <th>ACTION</th>}
                  </tr>
                </thead>
                <tbody>
                  {rowList?.length > 0 && rowList.map((r, idx) => {
                    return (
                      <tr key={`rr_${idx + 1}`} style={{ backgroundColor: `${r.scheme_id === "1" ? "#bedef4" : r.scheme_id === "2" ? "#c1f1d5" : "#fce2b6"}` }}>
                        <td>{idx + 1}</td>
                        <td>{r.scheme_name}</td>
                        <td>{r.major_component_name}</td>
                        <td>{r.sub_component_name}</td>
                        <td>{r.activity_master_name}</td>
                        <td>{r.activity_master_details_name}</td>
                        {Settings.isStateDataEntryUser() &&
                          districtID > 0 && (
                            <td className="text-end">
                              {r.status < 6 ? (+r.dd_school && districtID > 0 ? (
                                <button className="btn btn-sm btn-dark" onClick={(e) => openSchoolModal(e, r)}>
                                  <i className="bi bi-building" /> {"  "}
                                  <i className="bi bi-gear-fill" />
                                </button>
                              ) : ("")) : r.schoolcount == 0 ? ("") : (r.schoolcount)}
                            </td>
                          )}
                        <td className="text-end">
                          {+activeRowID === +r.id && actJSN.d !== null && districtID ?
                            <input className="form-control form-control-sm text-right-input" type="number" name="physical_quantity" id={`pq_${r.id}`}
                              onInput={(e) => handleInput(e, idx, "physical_quantity")}
                              readOnly={+r.dd_school && districtID > 0 ? true : false}
                              style={{ minWidth: "100px" }}
                              onKeyDown={(e) => Helper.validateNumberInput(e, 8, 0)}
                              value={r.physical_quantity}
                            ></input>
                            : (
                              <>
                                {+r.dd_school && districtID > 0 ? (
                                  <button className={`btn badge rounded-pill w-100 pe-auto ${+r.status > 1 ? " text-bg-secondary" : " text-bg-dark"}`}
                                    style={{ fontSize: "15px", padding: "2px 10px", width: "100px", cursor: "pointer" }}
                                    disabled={parseInt(r?.physical_quantity) > 0 ? false : true} onClick={(e) => handleSchoolsDownload(e, r)}
                                  >
                                    <i className="bi bi-download"></i>
                                    {"  "}({parseInt(r?.physical_quantity)?.toFixed(0) || 0})
                                  </button>
                                ) : (parseInt(r?.physical_quantity)?.toFixed(0) || 0)}
                              </>
                            )}
                        </td>
            
                        <td className="text-end">
                          {+activeRowID === +r.id &&
                            actJSN.d !== null &&
                            districtID ? (
                            <input className="form-control form-control-sm text-right-input" type="number" name="unit_cost" id={`uc_${r.id}`}
                              defaultValue={parseFloat(r?.unit_cost).toFixed(5)} style={{ minWidth: "100px" }}
                              onInput={(e) => handleInput(e, idx, "unit_cost")}
                              onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                            ></input>
                          ) : (parseFloat(r?.unit_cost || 0).toFixed(5))}
                        </td>

                        <td className="text-end">
                          {+activeRowID === +r.id && actJSN.d !== null && districtID ? (
                            <input className="form-control form-control-sm text-right-input" type="number" disabled name="financial_amount" id={`fa_${r.id}`}
                              onInput={(e) => handleInput(e, idx, "financial_amount")} style={{ minWidth: "100px" }}
                              onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)} value={(r.unit_cost * r.physical_quantity).toString()}
                            ></input>
                          ) : (parseFloat(r.financial_amount || 0).toFixed(5))}
                        </td>

                        {props && props.viewMode != "read-only" &&
                          Settings.isStateDataEntryUser() && districtID > 0 && +r?.status < 6 && (
                            <td>
                              {+activeRowID === +r.id ? (
                                <Fragment>
                                  <button className="btn btn-outline-primary btn-sm" onClick={(e) => saveThis(e, r)}>
                                    <i className="bi bi-check-lg" />
                                  </button>
                                  <button className="btn btn-outline-danger btn-sm mt-1" onClick={(e) => resetThis(e, r)}>
                                    <i className="bi bi-x-circle" />
                                  </button>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  {actJSN.n && ((actJSN.s !== 0 && +r.component_type === 2) ||
                                    (actJSN.d !== 0 && +r.component_type === 3)) && (
                                      <button className="btn btn-outline-primary btn-sm" onClick={(e) => editThis(e, r)}>
                                        <i className="bi bi-pencil" />
                                      </button>
                                    )}
                                </Fragment>
                              )}
                            </td>
                          )}
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={Settings.isStateDataEntryUser() && districtID > 0 ? 7 : 6} className="text-end">Total (₹ In Lakhs)</th>
                    <th className="text-end">{rowList?.reduce((accumulator, itm) => parseFloat(accumulator) + parseFloat(itm.physical_quantity), 0)}</th>
                    <th className="text-end"></th>
                    <th className="text-end">{Helper.accountFormat(rowList?.reduce((accumulator, itm) => parseFloat(accumulator) + parseFloat(itm.financial_amount), 0), 5)}</th>
                    {Settings.isStateDataEntryUser() && districtID > 0 && (<th className="text-end"></th>)}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {!!activeAMD && (
        <Modal close={() => setActiveAMD(0)}>
          <div className="row" style={{ maxHeight: "400px", "--bs-gutter-x": "unset" }}>

            <AGGridSchoolConfigurator pg={"vieweditstate"} amdObj={activeAMD} district={districtID} reloader={setRefresh} district_setter={setDistrictID} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewEditFormState;