import { useState, useEffect, Fragment } from "react";
//import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Features from "../../../redux/features";
import { Modal } from "../../../apps/components/elements";
import api from "../../../apps/utilities/api";
import { Helper, Settings, Hook } from "../../../apps";
import Spinner from "../../../apps/components/elements/Spinner";
import AGGridSchoolConfigurator from "./School/AGGridSchoolConfigurator";
import "./spill.css";
import Btnloader from "../../../apps/components/elements/Btnloader";

import $ from "jquery";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import store from "../../../redux/app/store";
import exportToExcel from "./PrabandhReports/ExcelReports";

const ViewEditFormActivity = (props) => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;

  //const states = Hook.useStates();
  const [stateID, setStateID] = useState(0);
  const [districtID, setDistrictID] = useState(0);
  const [schemesList, setSchemesList] = useState([]);
  const [userPer, setUserPer] = useState([]);
  //const [approvedBtn, setApprovedBtn] = useState({});
  const [scheme, setScheme] = useState(0);
  const [majorComponenetList, setMajorComponenetList] = useState([]);
  //const [blockID, setBlockID] = useState(0);
  //const [formData, setFormData] = useState([{ key: null, value: {} }]);
  //const [blocksList, setBlocksList] = useState([]);
  //const [schoolsList, setSchoolsList] = useState([]);
  //const [stateList, setStateList] = useState([]);
  const stateList = Hook.useStates();
  //const [districtsList, setDistrictsList] = useState([]);
  //const [summaryData, setSummaryData] = useState([]);
  //const [activeUDISE, setActiveUDISE] = useState("");
  //const [dataEntryLevel, setDataEntryLevel] = useState("");
  const [rowList, setRowList] = useState([]);
  const [initialRowList, setInitialRowList] = useState([]);
  //const [gridColumns, setGridColumns] = useState([]);
  //const [gridRows, setGridRows] = useState([]);
  const [activeRowID, setActiveRowID] = useState(0);
  //const [proposed, setProposed] = useState(false);
  const [actJSN, setActJSN] = useState({ s: 0, d: 0, n: false });
  const [spin, setSpin] = useState(false);
  //const roles = Hook.useRoles();
  const [activeAMD, setActiveAMD] = useState(0);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [subCompList, setSubCompList] = useState([]);
  const [actMasterList, setActMasterList] = useState([]);
  const [actMasterDetailList, setActMasterDetailList] = useState([]);
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
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    //getStateList();
    getSchemesList();
    let st = 0;
    let dt = 0;
    if (Settings.isStateUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      setStateID(+st);
      getDistrictsList("find", +st);
      setTimeout(() => {
        setDistrictID(+dt);
      }, 1000);
    }
    setSpin(true);

    /*     api.post(
      `api/prabandh/get-saved-data-activity-by-dist`,
      {
        user: user,
        state_id: st,
        district_id: dt,
        scheme_id: 0,
        major_component_id: "0",
      },
      (res) => {
        setRowList(res.data);
        setRowListBackup(res.data);
        setSpin(false);
      }
    ); */

    api.post(
      `api/prabandh/get-apr-btn-status`,
      {
        state_id: stateID,
        district_id: districtID,
      },
      (res) => {
        //setApprovedBtn({});
      }
    );
    if (user?.user_state_id) {
      setStateID(user?.user_state_id);
      getDistrictsList("find", user?.user_state_id);
    }
    setDistrictID(user?.user_district_id ? user?.user_district_id : 0);
    getUserPer();
  }, [user, refresh]);

  useEffect(() => {
    calculateTotal();
  }, [initialRowList]);

  useEffect(() => {
    if ($("select[name=activity_master_details_id]").val() !== "0") {
      search();
    }
  }, [refresh]);

  const getUserPer = () => {
    api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };

  const getSchemesList = () => {
    setSpin(true);
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
      setSpin(false);
    });
  };

  /*   const getStateList = () => {
    setSpin(true);
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    setSpin(true);
    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        //setDistrictsList(res.data);
        setSpin(false);
      }
    );
  };

  const getMajorComponenetList = (value) => {
    setSpin(true);
    setFilter();
    api.post("api/prabandh/major-components", { schemeid: value }, (res) => {
      setMajorComponenetList(res.data);
      setSpin(false);
    });
  };

  /*   const getBlocksList = (method, district_id = 0) => {
    const endpoint = district_id === 0 ? "list" : "find";
    const data = district_id === 0 ? null : { block_district_id: district_id };

    api[district_id === 0 ? "get" : "post"](
      `api/blocks/${endpoint}`,
      data,
      (res) => {
        setBlocksList(res.data);
      }
    );
  }; */

  /*   const getSchoolsList = (block_id = 0, formGlobalCode = 0, summary = null) => {
    api.post(`api/schools/find`, { block_id: block_id }, (res) => {
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
    setInitialRowList([]);
    setActiveRowID(0);
    const { name, value } = e.target;
    const sVal = $("select[name=state-list]").val();
    if (name === "state-list") {
      +value === 0
        ? setActJSN({ n: false, d: 0, s: 0 })
        : setActJSN({ n: true, d: 0, s: +value });
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

    setFilter((prevState) => {
      return { ...prevState, [name]: value };
    });

    if (name === "scheme_id" && value === 0) {
      setFilter({
        scheme_id: 0,
        major_component_id: 0,
        sub_component_id: 0,
        activity_master_id: 0,
        activity_master_details_id: 0,
      });
    } else if (name === "major_component_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "sub_component_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "activity_master_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    } else if (name === "activity_master_details_id" && value === 0) {
      setFilter((prevState) => {
        return {
          ...prevState,
        };
      });
    } else {
      setFilter((prevState) => {
        return {
          ...prevState,
        };
      });
    }
    //search();
  };

  /*   const getStatus = (type) => {
    if (user.user_role_id < type) {
      return false;
    } else {
      return true;
    }
  }; */

  const search = () => {
    const state_id = $("select[name=state-list]").val();
    const scheme_id = $("select[name=scheme_id]").val();
    const major_component_id = $("select[name=major_component_id]").val();
    //const sub_component_id = $("select[name=sub_component_id]").val();
    //const activity_master_id = $("select[name=activity_master_id]").val();
    const activity_master_details_id = $(
      "select[name=activity_master_details_id]"
    ).val();
    if (
      +state_id !== 0 &&
      +scheme_id !== 0 &&
      +major_component_id !== 0 &&
      +activity_master_details_id !== 0
    ) {
      setSpin(true);
      setTimeout(() => {
        api.post(
          `api/prabandh/get-saved-data-activity-by-dist`,
          {
            user: user,
            state_id: state_id,
            district_id: 0,
            scheme_id: scheme_id || 0,
            major_component_id: major_component_id || 0,
            activity_master_details_id: activity_master_details_id || 0,
            type: "activity",
            activity_group_code: user?.activity_group_code
          },
          (res) => {
            //  setRowList(res.data);
            setInitialRowList(res.data);
            setIsApproved(res.is_approved);
            setRowListBackup(res.data);
            setSpin(false);
          }
        );
      }, 1000);
    } else {
      dispatch(
        Features.showToast({
          message: "Please select all Filters.",
          flag: "bg-danger",
        })
      );
    }
  };

  const editThis = (e, row) => {
    if (activeRowID === 0) {
      setRowListBackup(initialRowList);
      setActiveRowID(row.id);
    } else {
      dispatch(
        Features.showToast({
          message: "Kindly save your data before edit another.",
          flag: "bg-danger",
        })
      );
    }
  };

  const saveThis = (e, row, index) => {
    const id = row.activity_master_details_id;
    const pq = $(`#pq_${row.id}`).val();
    //const fa = $(`#fa_${row.id}`).val();
    const uo = $(`#uom_${row.id}`).val();
    const uc = $(`#uc_${row.id}`).val();
    const ppq = $(`#proposed_physical_quantity_${row.id}`).val();
    const pfa = $(`#proposed_financial_amount_${row.id}`).val();
    const puc = $(`#proposed_unit_cost_${row.id}`).val();
    const state_id = $("select[name=state-list]").val();
    // const district_id = $("select[name=districts-list]").val();
    const district_id = row?.district;

    setInitialRowList((prevState) => {
      prevState[index].financial_amount = Helper.numberFormatter(+pq * +uc, 5);
      return [...prevState];
    });

    api.post(
      `api/prabandh/modifydata`,
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
        // window.location.reload();
      }
    );
  };

  const resetThis = (e, row) => {
    search();
    setInitialRowList(rowListBackup);
    setActiveRowID(0);
  };

  const handleInput = (e, index, keyName) => {
    if (keyName === "unit_cost") {
      setInitialRowList((prevState) => {
        prevState[index].unit_cost = Helper.numberFormatter(e.target.value, 5);
        prevState[index].financial_amount = Helper.numberFormatter(
          +e.target.value * +prevState[index].physical_quantity,
          5
        );
        return [...prevState];
      });
    } else if (keyName === "physical_quantity") {
      setInitialRowList((prevState) => {
        prevState[index].physical_quantity = Helper.numberFormatter(
          e.target.value,
          5
        );
        prevState[index].financial_amount = Helper.numberFormatter(
          +e.target.value * +prevState[index].unit_cost,
          5
        );
        return [...prevState];
      });
    } else {
      setInitialRowList((prevState) => {
        prevState[index][e.target.name] = Helper.numberFormatter(
          e.target.value,
          5
        );
        return [...prevState];
      });
    }
  };

  const [pdfStatus, setPdfStatus] = useState(false);

  const openSchoolModal = (e, itm) => {
    if (activeRowID !== 0 && itm.id === activeRowID) {
      setActiveAMD(itm);
      setRowListBackup(initialRowList);
      setActiveRowID(itm.id);
      dispatch(
        Features.showModal({
          title: "Block-Schools Selection",
          size: "fullscreen",
          btntext: "Select",
        })
      );
    }
  };

  const getSubCompList = (value) => {
    setSpin(true);
    api.post(
      "api/prabandh/sub-components",
      { schemeid: scheme, majorcomponentid: value },
      (res) => {
        setSubCompList(res.data);
        setSpin(false);
      }
    );
    /* api.post(
      "api/prabandh/sub-components-list",
      { schemeid: scheme, major_component_id: value },
      (res) => {
        setSubCompList(res.data.rows);
        setSpin(false);
      }
    ); */
  };

  const getActMasterList = (value) => {
    setSpin(true);
    api.post(
      "api/prabandh/active-master-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: value,
      },
      (res) => {
        setActMasterList(res.data);
        setSpin(false);
      }
    );
  };

  const getActMasterDetailList = (value) => {
    setSpin(true);
    api.post(
      "api/prabandh/view-edit-form-activity_activity-master-details",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: filter?.sub_component_id,
        activity_master_id: value,
        state_id: stateID,
      },
      (res) => {
        setActMasterDetailList(res.data);
        setSpin(false);
      }
    );
  };

  const exportTableToExcel = async (fileName = "") => {
    let headers = [
      { srl: "S.No." },
      { district_name: "District" },
      { physical_quantity: "Physical Quantity" },
      { unit_cost: "Unit Cost (₹ In Lakhs)" },
      { financial_amount: "Financial Amount (₹ In Lakhs)" },
    ];
    //  Helper.exportTableToExcel(rowList, headers, fileName);

    exportToExcel("genericReport", {
      reportData: rowList,
      headers: headers,
      sheeName: "Sheet 1",
      fileName: fileName,
    });
  };
  const handleGeneratePdf = async (fileName) => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/submitstateactivity`;
    const state_id = $("select[name=state-list]").val();
    //const district_id = $("select[name=districts-list]").val();
    const scheme_id = $("select[name=scheme_id]").val();
    const major_component_id = $("select[name=major_component_id]").val();
    const activity_master_details_id = $(
      "select[name=activity_master_details_id]"
    ).val();
    const apiYear = store.getState().year.year;
    const apiVersion = store.getState().version.version;
    try {
      setPdfStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          report_type: "View Edit Form Activity",
          state_name: user.state_name || null,
          user: user,
          state_id: state_id || 0,
          district_id: null,
          scheme_id: scheme_id || 0,
          major_component_id: major_component_id || 0,
          activity_master_details_id: activity_master_details_id || 0,
          sub_component_id: filter?.sub_component_id || 0,
          activity_master_id: filter?.activity_master_id || 0,
          type: "activity",
          district_name: user?.district_name || "blank",
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
      setPdfStatus(false);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + ".pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const calculateTotal = () => {
    let totalObj = {
      physical_quantity: 0,
      financial_amount: 0,
      totalRow: true,
    };

    let data = initialRowList;

    if (data.length > 0) {
      if (data[data.length - 1]?.totalRow === true) {
        data.forEach((itm, idx) => {
          if (idx <= data.length - 2) {
            totalObj["physical_quantity"] += +itm.physical_quantity;
            totalObj["financial_amount"] += +itm.financial_amount;
          }
        });
        data[data.length - 1] = totalObj;
      } else {
        data.forEach((itm) => {
          totalObj["physical_quantity"] += +itm.physical_quantity;
          totalObj["financial_amount"] += +itm.financial_amount;
        });
        data.push(totalObj);
      }

      setRowList(data);
    }
  };

  return (
    <div className="dashboard-main-content">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></div>
      {props && props.viewMode !== "read-only" && (
        <div className="dashboard-main-content__header px-2 d-flex justify-content-between">
          <h1>View/Edit Form Activity</h1>
          <div>
            <button
              type="button"
              className="btn btn-danger cfr"
              disabled={rowList.length === 0 ? true : pdfStatus}
              onClick={(e) => handleGeneratePdf("State_plan")}
            >
              {pdfStatus ? <Btnloader /> : ""}{" "}
              <i className="bi bi-file-earmark-pdf"></i>{" "}
              <span className="mobile-hide">Export To</span> PDF
            </button>
            <button
              className="btn btn-success cfr mx-2"
              disabled={rowList.length === 0 ? true : false}
              onClick={(e) => exportTableToExcel("State_plan")}
            >
              <i className="bi bi-file-earmark-excel"></i>{" "}
              <span className="mobile-hide">Export To</span> Excel
            </button>
          </div>
        </div>
      )}
      {props && props.viewMode !== "read-only" && (
        <div className="dashboard-main-content-info mb-3 mt-3 mobile-search" id="search" style={{ backgroundColor: "rgb(43 74 145)" }}>
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
                            if (
                              !uniqueStates.some(
                                (item) => item.state_id === currentItem.state_id
                              )
                            ) {
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
              </div>
            </div>
          </div>
          <div className="row mt-3" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white ">INDICATOR FILTER</h6>
              <div className="row">
                <div className="col-md-2">
                  <select className="form-select" name="scheme_id" value={scheme} onChange={handleChange}>
                    <option value={0}>Scheme (All)</option>
                    {userPer.length ? userPer.filter((usep) => usep.state_id === stateID)
                          .reduce((uniqueStates, currentItem) => {
                            if (
                              !uniqueStates.some(
                                (item) =>
                                  item.scheme_id === currentItem.scheme_id
                              )
                            ) {
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
                  <select className="form-select" name="major_component_id"
                    onChange={(e) => {
                      handleChange(e);
                      getSubCompList(e.target.value);
                    }}
                  >
                    <option value={0}>Major Component (All)</option>
                    {userPer.length ? userPer.filter((usep) => usep.state_id === stateID)
                          .map((s, idx) => {
                            if (scheme === s.scheme_id) {
                              return (
                                <option
                                  key={`sl_${idx + 1}`}
                                  value={s.activity_id}
                                >
                                  {s.activity_name}
                                </option>
                              );
                            }
                          })
                      : majorComponenetList.map((m, idx) => (
                          <option
                            key={`mc_${idx + 1}`}
                            value={m.prb_major_component_id}
                          >
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
                    {subCompList.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.sub_component_id}>
                        {m.sub_title}
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
                    {actMasterList?.filter(
                        (objFirst) =>
                          !rowList.some(
                            (objSecond) =>
                              objSecond.activity_master_details_id ===
                              objFirst.id
                          )
                      )
                      .map((m, idx) => (
                        <option key={`mc_${idx + 1}`} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <select className="form-select" name="activity_master_details_id" value={filter?.activity_master_details_id}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value={0}>Sub Activity (All)</option>
                    {actMasterDetailList?.map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.id}>
                        {m.activity_master_details_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-1">
                  <button className="btn btn-sm btn-light" onClick={search}>
                    Show
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-content-info">
        <div className="table-scroll-section" style={{ textAlign: "center" }}>
          {props && props.viewMode === "read-only" && (
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
                    <th style={{ width: "2%" }}>S.No.</th>
                    <th>DISTRICT</th>
                    {Settings.isStateDataEntryUser() && (<th style={{ width: "5%" }}>Schools</th>)}
                    <th>PHY. QTY.</th>
                    <th>UNIT COST <br /> (₹ In Lakhs)</th>
                    <th>FIN. AMT. <br /> (₹ In Lakhs)</th>
                    {props && props.viewMode !== "read-only" && Settings.isStateDataEntryUser() && (<th style={{ width: "5%" }}>Action</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rowList?.length > 0 &&
                    rowList.map((r, idx) => {
                      return (
                        <tr key={`rr_${idx + 1}`}>
                          {idx < rowList.length - 1 && <td>{idx + 1}</td>}
                          {idx < rowList.length - 1 && (
                            <td>{r.district_name}</td>
                          )}
                          {Settings.isStateDataEntryUser() &&
                            idx < rowList.length - 1 && (
                              <td>
                                {+r?.dd_school === 1 && (
                                  // <button
                                  //   className="btn btn-sm btn-dark"
                                  //   onClick={(e) => {
                                  //     setDistrictID(r.district);
                                  //     openSchoolModal(e, r);
                                  //   }}
                                  //   disabled={
                                  //     r.id === activeRowID ? false : true
                                  //   }
                                  // >
                                  //   SELECT
                                  // </button>
                                  <button className="btn btn-sm btn-dark" style={{ whiteSpace: "nowrap" }}
                                    onClick={(e) => {
                                      setDistrictID(r.district);
                                      openSchoolModal(e, r);
                                    }}
                                    disabled={r.id === activeRowID ? false : true}
                                  >
                                    <i className="bi bi-building" /> {"  "}
                                    <i className="bi bi-gear-fill" />
                                  </button>
                                )}
                              </td>
                            )}
                          {idx === rowList.length - 1 && (
                            <td colSpan={3} className="text-end">
                              Total
                            </td>
                          )}
                          <td className="text-end">
                            {+activeRowID === +r.id && actJSN.d !== null ? (
                              <input className="form-control form-control-sm text-right-input" type="number" id={`pq_${r.id}`} name="physical_quantity"
                                onInput={(e) => handleInput(e, idx, "physical_quantity")}
                                readOnly={+r.dd_school > 0 ? true : false}
                                style={{ minWidth: "100px" }}
                                onKeyDown={(e) => Helper.validateNumberInput(e, 8, 0)}
                                value={r.physical_quantity}
                              ></input>
                            ) : (
                              r.physical_quantity
                            )}
                          </td>
                          <td className="text-end">
                            {+activeRowID === +r.id && actJSN.d !== null ? (
                              <input className="form-control form-control-sm text-right-input" type="number" name="unit_cost" id={`uc_${r.id}`}
                                defaultValue={parseFloat(r.unit_cost).toFixed(5)}
                                style={{ minWidth: "100px" }}
                                onInput={(e) => handleInput(e, idx, "unit_cost")}
                              ></input>
                            ) : idx < rowList.length - 1 ? (
                              parseFloat(r.unit_cost || 0).toFixed(5)
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="text-end">
                            {+activeRowID === +r.id && actJSN.d !== null ? (
                              <input className="form-control form-control-sm text-right-input" type="number" name="financial_amount" id={`fa_${r.id}`}
                                onInput={(e) => handleInput(e, idx, "financial_amount")}
                                style={{ minWidth: "100px" }}
                                onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                                readOnly={true}
                                value={parseFloat(+r.physical_quantity * +r.unit_cost).toFixed(5).toString()}
                              ></input>
                            ) : (
                              parseFloat(r?.financial_amount).toFixed(5).toString()
                            )}
                          </td>
                          {props &&
                            props.viewMode !== "read-only" &&
                            Settings.isStateDataEntryUser() && (
                              <td>
                                {+activeRowID === +r.id ? (
                                  <Fragment>
                                    <button className="btn btn-success btn-sm" style={{ padding: "0.2rem 0.8rem" }} onClick={(e) => saveThis(e, r, idx)}>
                                      &nbsp;&nbsp;Save&nbsp;
                                    </button>
                                    <button className="btn btn-danger btn-sm mt-1" style={{ padding: "0.2rem 0.8rem" }} onClick={(e) => resetThis(e, r)}>
                                      Cancel
                                    </button>
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    {/* {actJSN.n &&
                                      ((actJSN.s !== 0 &&
                                        +r.component_type === 2) ||
                                        (actJSN.d !== 0 &&
                                          +r.component_type === 3)) && ( */}
                                    {idx < rowList.length - 1 &&
                                      !isApproved && (
                                        <button className="btn btn-primary btn-sm" style={{ padding: "0.2rem 0.8rem" }} onClick={(e) => editThis(e, r)}>
                                          Edit
                                        </button>
                                      )}
                                    {/* )} */}
                                  </Fragment>
                                )}
                              </td>
                            )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {!!activeAMD && (
        <Modal close={() => setActiveAMD(0)}>
          <div className="row" style={{ maxHeight: "700px", "--bs-gutter-x": "unset" }}>
            <AGGridSchoolConfigurator amdObj={activeAMD} district={districtID} reloader={setRefresh} pg={"vieweditstate"} district_setter={setDistrictID} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewEditFormActivity;