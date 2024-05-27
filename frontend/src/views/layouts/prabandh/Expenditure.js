import { useState, useEffect } from "react";
import { Table } from "react-virtualized";
//import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Features from "../../../redux/features";
import api from "../../../apps/utilities/api";
import { Helper, Hook, Settings } from "../../../apps";
import Spinner from "../../../apps/components/elements/Spinner";
import ConfirmationDialog from "../../../apps/components/form/ConfirmationDialog";
import "./spill.css";
import sweetAlert from "../../../apps/utilities/sweetalert";
import Btnloader from "../../../apps/components/elements/Btnloader";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import { Modal } from "../../../apps/components/elements";
import $ from "jquery";
//import settings from "../../../apps/utilities/settings";

const Expenditure = () => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const [filter, setFilter] = useState({
    state: "0",
    district: "0",
    scheme_id: "0",
    major_component_id: "0",
    sub_component_id: "0",
    activity_master_id: "0",
    activity_master_details_id: "0",
  });
  // const years = Hook.usePost({
  //   url: "api/prabandh/years",
  // });
  const [isOpen, setIsOpen] = useState(false);
  const [confrmData, setConfrmData] = useState({});
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  const [oldRow, setOldRow] = useState({});
  const [stateID, setStateID] = useState(0);
  const [schemesList, setSchemesList] = useState([]);
  const [userPer, setUserPer] = useState([]);
  const [majorComponenetList, setMajorComponenetList] = useState([]);
  const [subCompList, setSubCompList] = useState([]);
  const [actMasterList, setActMasterList] = useState([]);
  const [actMasterDetailList, setActMasterDetailList] = useState([]);
  const stateList = Hook.useStates();
  const [, setDistrictsList] = useState([]);
  const [rowList, setRowList] = useState([]);
  const [, setSpin] = useState(false);
  const [table_loader, setTable_loader] = useState(false);
  // const [tableCols, setTableCols] = useState({
  //   budget: true,
  //   cummulative: false,
  //   spillover: true,
  // });
  const [freezeDataEntry, setFreezeDataEntry] = useState(false);

  useEffect(() => {
    setFilter((prevState) => {
      return {
        ...prevState,
        state: user?.user_state_id || 0,
        district: user?.user_district_id || 0,
      };
    });

    getSchemesList();
    let st = 0;
    let dt = 0;
    if (Settings.isDistrictUser()) {
      st = user?.user_state_id;
      dt = user?.user_district_id;
      getDistrictsList("find", +st);
    } else if (user?.user_state_id) {
      getDistrictsList("find", user?.user_state_id);
    }
    setSpin(true);
    getUserPer();
  }, [user]);

  useEffect(() => {
    viewFilterData();
  }, [filter]);

  const viewFilterData = () => {
    getSavedData();
  };

  const viewAllData = () => {
    if (filter.state !== null) {
      setTable_loader(true);
      api.post(
        `api/prabandh/expenditures`,
        {
          state_id: filter.state,
          state: "0",
          district: "0",
          scheme_id: "0",
          major_component_id: "0",
          sub_component_id: "0",
          activity_master_id: "0",
          activity_master_details_id: "0",
          activity_group_code: user?.activity_group_code
        },
        (res) => {
          if (res?.data) {
            setRowList(res.data);
            setFreezeDataEntry(res.data[0]?.status == 2 ? true : false);
            setTable_loader(false);
            setSpin(false);
          }
        }
      );
    }
  };

  // const returnSum = (arr, fieldName) => {
  //   let result = 0;

  //   arr.forEach((itm) => {
  //     if (isNaN(itm[fieldName]) == true) {
  //       result += 0;
  //     } else {
  //       result += +itm[fieldName];
  //     }
  //   });

  //   if (fieldName == "budget_amount" || fieldName == "progress_amount") {
  //     return Helper.numberFormatter(result, 5);
  //   } else {
  //     return result;
  //   }
  // };

  const getSavedData = () => {
    if (filter.state !== null) {
      setTable_loader(true);
      api.post(
        `api/prabandh/expenditures`,
        {
          state_id: filter.state,
          ...filter,
          activity_group_code: user?.activity_group_code
        },
        (res) => {
          if (res?.data) {
            setRowList(res.data);
            setFreezeDataEntry(res.data[0]?.status == 2 ? true : false);
            setTable_loader(false);
            setSpin(false);
          }
        }
      );
    }
  };

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

  const getDistrictsList = (method, state_id = 0) => {
    const endpoint = state_id === 0 ? "list" : "find";
    const data = state_id === 0 ? null : { district_state_id: state_id };

    setSpin(true);
    api[method === "list" ? "get" : "post"](
      `api/districts/${endpoint}`,
      data,
      (res) => {
        setDistrictsList(res.data);
        setSpin(false);
      }
    );
  };

  const getMajorComponenetList = (value) => {
    setSpin(true);
    api.post("api/prabandh/major-components", { schemeid: value }, (res) => {
      setMajorComponenetList(res.data);
      setSpin(false);
      setFilter((prevState) => {
        return {
          ...prevState,
          major_component_id: 0,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    });
  };

  const getSubCompList = (value) => {
    setSpin(true);
    api.post(
      "api/prabandh/sub-components-list",
      { schemeid: filter?.scheme_id, major_component_id: value },
      (res) => {
        setSubCompList(res.data.rows);
        setSpin(false);
        setFilter((prevState) => {
          return {
            ...prevState,
            sub_component_id: 0,
            activity_master_id: 0,
            activity_master_details_id: 0,
          };
        });
      }
    );
  };

  const getActMasterList = (value) => {
    setSpin(true);
    api.post(
      "api/prabandh/expenditure_activity-master-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: value,
        state_id: user?.user_state_id || 0,
      },
      (res) => {
        setActMasterList(res.data);
        setSpin(false);
        setFilter((prevState) => {
          return {
            ...prevState,
            activity_master_id: 0,
            activity_master_details_id: 0,
          };
        });
      }
    );
  };

  const getActMasterDetailList = (value) => {
    setSpin(true);
    api.post(
      "api/prabandh/expenditure_activity-master-list-details",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: filter?.sub_component_id,
        activity_master_id: value,
        state_id: user?.user_state_id || 0,
      },
      (res) => {
        setActMasterDetailList(res.data);
        setSpin(false);
        setFilter((prevState) => {
          return { ...prevState, activity_master_details_id: 0 };
        });
      }
    );
  };

  function triggerNextSelect(currentSelect) {
    const nextElement =
      currentSelect.parentElement.nextElementSibling.querySelector(
        "select, input"
      );
    if (nextElement) {
      nextElement.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  const handleChange = (e) => {
    setRowList([]);
    const { name, value } = e.target;
    setFilter((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleChangeInput = (e, index) => {
    setRowList((prevState) => {
      prevState[index][e.target.name] = e.target.value;
      return [...prevState];
    });
  };

  const saveRow = (obj, idx) => {
    obj = rowList[idx];
    if (+obj?.progress_quantity > +obj?.budget_quantity) {
      sweetAlert.warning(
        `The quantity of Progress should not exceed the approved budgeted quantity.`
      );
    } else if (+obj?.progress_amount > +obj?.budget_amount) {
      sweetAlert.warning(
        `The amount of Progress should not exceed the approved budgeted amount.`
      );
    } else {
      setSpin(true);
      api.post("api/prabandh/saveform-expend", rowList[idx], (res) => {
        setRowList((prevState) => {
          delete prevState[idx].edit;
          return [...prevState];
        });
        setSpin(false);
        dispatch(
          Features.hideModal({
            title: "",
            size: "lg",
          })
        );
      });
    }
  };

  /*   const freezeAll = () => {
    console.log("Data frozen successfully.");
    setSpin(true);
    api.post(
      "api/prabandh/freeze-expenditure-data",
      { state_id: user?.user_state_id },
      (res) => {
        sweetAlert.done({ msg: `Data frozen successfully.` });
        getSavedData();
        setSpin(false);
      }
    );
  }; */

  const handleGeneratePdf = async () => {
    let thead = [
      [
        {
          name: "S.NO.",
          rowSpan: 2,
        },
        {
          name: "SCHEME",
          rowSpan: 2,
        },
        {
          name: "MAJOR COMPONENT",
          rowSpan: 2,
        },
        {
          name: "SUB COMPONENT",
          rowSpan: 2,
        },
        {
          name: "ACTIVITY MASTER",
          rowSpan: 2,
        },
        {
          name: "SUB ACTIVITY",
          rowSpan: 2,
        },
        {
          name: "Budget Approved",
          colSpan: 2,
        },
        {
          name: "Progress",
          colSpan: 2,
        },
      ],
      [
        {
          name: "Physical",
        },
        {
          name: "Financial (₹ In Lakhs)",
        },
        {
          name: "Physical",
        },
        {
          name: "Financial (₹ In Lakhs)",
        },
      ],
    ];
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        `${REACT_APP_URL}api/download/pdf/report`,
        {
          filter: { state_id: filter.state, ...filter },
          name: "expenditure",
          heading: "Expenditure",
          thead,
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`,
          },
        }
      );
      setPdfbtnStatus(false);
      if (response) {
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
        link.setAttribute("download", `Expenditure_2024-2025_${datetime}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const VirtualizedTable = ({
    rowList,
    handleChangeInput,
    saveRow,
    freezeDataEntry,
    sweetAlert,
    setRowList,
    setOldRow,
    oldRow,
    setConfrmData,
    setIsOpen,
  }) => {
    const screenWidth = $(".table-container")[0].clientWidth - 40;
    const columnWidths = {
      col1: 50,
      col2: 150,
      col3: 150,
      col4: 200,
      col5: 300,
      col6: 300,
      col7: 200,
      col8: 200,
      col9: 100,
      col10: 100,
      col11: 100,
      colXX: 400,
    };

    const rowRenderer = ({ key, index, style }) => {
      const r = rowList[index];
      return (
        <tr key={key} style={style}>
          <td style={{ width: columnWidths.col1 }}>{index + 1}</td>
          <td style={{ width: columnWidths.col2 }}>{r.scheme_name}</td>
          <td style={{ width: columnWidths.col3 }}>{r.major_component_name}</td>
          <td style={{ width: columnWidths.col4 }}>{r.sub_component_name}</td>
          <td style={{ width: columnWidths.col5 }}>{r.activity_master_name}</td>
          <td style={{ width: columnWidths.col6 }}>
            {r.activity_master_details_name}
          </td>
          <td style={{ width: columnWidths.col7 }}>{r?.budget_quantity}</td>
          <td style={{ width: columnWidths.col7 }}>{r?.budget_amount}</td>
          <td style={{ width: columnWidths.col8 }}>{r?.progress_quantity}</td>
          <td style={{ width: columnWidths.col8 }}>{r?.progress_amount}</td>
          <td>
            {!r.edit ? (
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={freezeDataEntry}
                onClick={() => {
                  if (rowList.filter((item) => item.edit).length) {
                    sweetAlert.confirmation({
                      title: "Are you sure?",
                      msg: "You want to discard your previous changes.",
                      noBtnText: "No",
                      yesBtnText: "Yes",
                      callback: () => {
                        setRowList((prevState) => {
                          prevState[oldRow.index] = {
                            ...oldRow,
                          };
                          return [...prevState];
                        });
                        setOldRow({ ...r, index: index });
                        setRowList((prevState) => {
                          prevState[index]["edit"] = true;
                          return [...prevState];
                        });
                      },
                    });
                  } else {
                    setOldRow({ ...r, index: index });
                    setRowList((prevState) => {
                      prevState[index]["edit"] = true;
                      return [...prevState];
                    });
                  }

                  dispatch(
                    Features.showModal({
                      title: r.activity_master_details_name,
                      size: "lg",
                    })
                  );
                }}
              >
                <i className="bi bi-pencil"></i>
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => saveRow(r, index)}
                >
                  <i className="bi bi-save"></i>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm mt-1"
                  onClick={() => {
                    setConfrmData({
                      callBack: () => {
                        setRowList((prevState) => {
                          prevState[index]["edit"] = false;
                          prevState[oldRow.index] = {
                            ...oldRow,
                          };
                          return [...prevState];
                        });
                      },
                      title: "Confirmation",
                      text: "Are you sure?, <br/>you want to Cancel this row.",
                    });
                    setOldRow({});
                    setIsOpen(true);
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              </>
            )}
          </td>
        </tr>
      );
    };

    const headerRowRenderer = ({ key, index, style }) => {
      return (
        <>
          <tr key={key} style={style}>
            <th
              className="border"
              rowSpan={2}
              style={{ width: columnWidths.col1 }}
            >
              S.No.
            </th>
            <th
              className="border"
              rowSpan={2}
              style={{ width: columnWidths.col2 }}
            >
              Scheme
            </th>
            <th
              className="border"
              rowSpan={2}
              style={{ width: columnWidths.col3 }}
            >
              Major Component
            </th>
            <th
              className="border"
              rowSpan={2}
              style={{ width: columnWidths.col4 }}
            >
              Sub Component
            </th>
            <th
              className="border"
              rowSpan={2}
              style={{ width: columnWidths.col5 }}
            >
              Activity Master
            </th>
            <th
              className="border"
              rowSpan={2}
              style={{ width: columnWidths.col6 }}
            >
              Sub Activity
            </th>
            <th
              colSpan={2}
              className="border"
              style={{ width: columnWidths.colXX }}
            >
              Budget Approved
            </th>
            <th
              colSpan={2}
              className="border"
              style={{ width: columnWidths.colXX }}
            >
              Progress Up To 31st March 2024{" "}
            </th>
            <th className="border">Action</th>
          </tr>
          <tr key={`S${key}`} style={{ width: columnWidths.col6 }}>
            <th className="border" style={{ width: columnWidths.col7 }}>
              Physical
            </th>
            <th className="border" style={{ width: columnWidths.col7 }}>
              Financial (₹ In Lakhs)
            </th>
            <th className="border" style={{ width: columnWidths.col8 }}>
              Physical
            </th>
            <th className="border" style={{ width: columnWidths.col8 }}>
              Financial (₹ In Lakhs)
            </th>
            <th className="border"></th>
          </tr>
        </>
      );
    };

    return (
      <Table
        rowCount={rowList.length}
        rowHeight={150}
        rowGetter={({ index }) => rowList[index]}
        headerRowRenderer={headerRowRenderer}
        rowRenderer={rowRenderer}
        width={screenWidth}
        height={600}
        headerHeight={50}
        className="table table-sm"
        wrap
      />
    );
  };

  return (
    <div className="dashboard-main-content">
      {isOpen && (
        <ConfirmationDialog
          onConfirm={(e) => {
            setIsOpen(false);
            // callback
            confrmData.callBack();
          }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={confrmData.title}
          text={confrmData.text}
        />
      )}
      <div className="dashboard-main-content__header">
        <h1 style={{ display: "inline-block" }}>Expenditure</h1>
        <button
          type="button"
          style={{ marginRight: "1rem" }}
          className="btn btn-danger float-end"
          disabled={rowList?.length ? (pdfbtnStatus ? true : false) : true}
          onClick={handleGeneratePdf}
        >
          {pdfbtnStatus ? <Btnloader /> : ""}{" "}
          <i className="bi bi-file-earmark-pdf"></i>{" "}
          <span className="mobile-hide">Export To</span> PDF
        </button>
      </div>
      <div
        className="dashboard-main-content-info mb-3 mt-3"
        id="search"
        style={{ backgroundColor: "rgb(43 74 145)" }}
      >
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12">
            <h6 className="text-white">LOCATION FILTER</h6>
            <div className="row">
              <div className="col-md-6">
                <select
                  className="form-select"
                  name="state"
                  value={filter?.state}
                  onChange={handleChange}
                  disabled={stateList?.find(
                    (state) => +state.id === +user.user_state_id
                  )}
                >
                  <option value={0}>State (All)</option>
                  {userPer?.length
                    ? userPer
                        .reduce((uniqueStates, currentItem) => {
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

              <div className="col-md-2">
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: "10px" }}
                  onClick={viewAllData}
                >
                  Show All
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3" style={{ width: "100%" }}>
          <div className="col-md-12">
            <h6 className="text-white mb-0">INDICATOR FILTER</h6>
            <ul className="ListUl">
              <li>
                <select
                  className="form-select"
                  name="scheme_id"
                  value={filter?.scheme_id}
                  onChange={(e) => {
                    handleChange(e);
                    getMajorComponenetList(e.target.value);
                  }}
                >
                  <option value={0}>Scheme (All)</option>
                  {userPer.length
                    ? userPer
                        .filter((usep) => usep.state_id === stateID)
                        .reduce((uniqueStates, currentItem) => {
                          if (
                            !uniqueStates.some(
                              (item) => item.scheme_id === currentItem.scheme_id
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
              </li>

              <li>
                <select
                  className="form-select"
                  name="major_component_id"
                  value={filter?.major_component_id}
                  onChange={(e) => {
                    handleChange(e);
                    getSubCompList(e.target.value);
                  }}
                >
                  <option value={0}>Major Component (All)</option>
                  {userPer.length
                    ? userPer
                        .filter((usep) => usep.state_id === stateID)
                        .map((s, idx) => {
                          return (
                            <option key={`sl_${idx + 1}`} value={s.activity_id}>
                              {s.activity_name}
                            </option>
                          );
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
              </li>

              <li>
                <select
                  className="form-select"
                  name="sub_component_id"
                  value={filter?.sub_component_id}
                  onChange={(e) => {
                    handleChange(e);
                    getActMasterList(e.target.value);
                  }}
                >
                  <option value={0}>Sub Component (All)</option>
                  {subCompList.map((m, idx) => (
                    <option key={`mc_${idx + 1}`} value={m.sub_component_id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </li>

              <li>
                <select
                  className="form-select"
                  name="activity_master_id"
                  value={filter?.activity_master_id}
                  onChange={(e) => {
                    handleChange(e);
                    getActMasterDetailList(e.target.value);
                  }}
                >
                  <option value={0}>Activity Master (All)</option>
                  {actMasterList
                    .filter(
                      (objFirst) =>
                        !rowList.some(
                          (objSecond) =>
                            objSecond.activity_master_details_id === objFirst.id
                        )
                    )
                    .map((m, idx) => (
                      <option key={`mc_${idx + 1}`} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                </select>
              </li>

              <li>
                <select
                  className="form-select"
                  name="activity_master_details_id"
                  value={filter?.activity_master_details_id}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                >
                  <option value={0}>Activity Master Detail (All)</option>
                  {actMasterDetailList.map((m, idx) => (
                    <option key={`mc_${idx + 1}`} value={m.id}>
                      {m.activity_master_details_name}
                    </option>
                  ))}
                </select>
              </li>

              <li className="d-none">
                <button
                  className="btn btn-warning me-2 d-none"
                  onClick={() => {
                    if (
                      filter?.state &&
                      filter?.scheme_id &&
                      filter?.major_component_id &&
                      filter?.sub_component_id &&
                      filter?.activity_master_id &&
                      filter?.activity_master_details_id &&
                      rowList.length === 0
                    ) {
                      setRowList((prevState) => {
                        return [
                          {
                            ...filter,
                            edit: true,
                            status: 1,
                            budget_quantity: "",
                            budget_amount: "",
                            progress_quantity: "",
                            progress_amount: "",
                          },
                          ...prevState,
                        ];
                      });
                    } else {
                      dispatch(
                        Features.showToast({
                          message: "This record has already been created.",
                          flag: "danger",
                        })
                      );
                    }
                  }}
                >
                  Add New
                </button>
              </li>
              <li>
                <button className="btn btn-info" onClick={viewFilterData}>
                  Search
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="dashboard-main-content-info table-container"
        style={{ textAlign: "center" }}
      >
        {table_loader ? (
          <Spinner />
        ) : rowList?.length === 0 ? (
          <h3>No Data Found</h3>
        ) : (
          <>
            <VirtualizedTable
              handleChangeInput={handleChangeInput}
              rowList={rowList}
              saveRow={saveRow}
              freezeDataEntry={freezeDataEntry}
              sweetAlert={sweetAlert}
              setRowList={setRowList}
              setOldRow={setOldRow}
              oldRow={oldRow}
              setConfrmData={setConfrmData}
              setIsOpen={setIsOpen}
            />
          </>
        )}
      </div>

      {oldRow?.activity_master_details_name && (
        <Modal
          key={oldRow.activity_master_details_id}
          close={() => {
            setRowList((prevState) => {
              delete prevState[+oldRow.index]?.edit;
              return [...prevState];
            });
            dispatch(
              Features.hideModal({
                title: "",
                size: "lg",
              })
            );
          }}
          size={"xl"}
        >
          <div
            className="row"
            style={{ maxHeight: "400px", "--bs-gutter-x": "unset" }}
          >
            <table className="table table-bordered table-sm">
              <tr>
                <td>
                  <em>SCHEME:</em>
                </td>
                <td className="text-black table-light">{oldRow.scheme_name}</td>
                <td>
                  <em>MAJOR COMPONENT</em>
                </td>
                <td>{oldRow.major_component_name}</td>
              </tr>
              <tr>
                <td>
                  <em>SUB COMPONENT</em>
                </td>
                <td>{oldRow.sub_component_name}</td>
                <td>
                  <em>ACTIVITY</em>
                </td>
                <td>{oldRow.activity_master_name}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <em>ACTIVITY DETAIL</em>
                </td>
                <td colSpan={2}>{oldRow.activity_master_details_name}</td>
              </tr>
              <tr>
                <td>
                  <em>Budget Approved (PHYSICAL)</em>
                </td>
                <td>
                  <input
                    onKeyDown={(e) => Helper.validateNumberInput(e, 8, 0)}
                    /* readOnly={!oldRow.edit} */
                    className="form-control text-right-input border border-dark"
                    type="number"
                    onChange={(e) => handleChangeInput(e, +oldRow.index)}
                    defaultValue={oldRow?.budget_quantity ?? ""}
                    data-id="budget_quantity"
                    name="budget_quantity"
                    data-activity_detail_id=""
                    data-bdgt_id=""
                  />
                </td>
                <td>
                  <em>Budget Approved Financial (₹ In Lakhs)</em>
                </td>
                <td>
                  <input
                    onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                    /* readOnly={!oldRow.edit} */
                    className="form-control text-right-input border border-dark"
                    type="number"
                    onChange={(e) => handleChangeInput(e, +oldRow.index)}
                    defaultValue={oldRow?.budget_amount ?? ""}
                    data-id="budget_amount"
                    name="budget_amount"
                    data-activity_detail_id=""
                    data-bdgt_id=""
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <em>Progress Up To 31st March 2024 Physical</em>
                </td>
                <td>
                  <input
                    onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                    /* readOnly={!oldRow.edit} */
                    className="form-control text-right-input border border-dark"
                    type="number"
                    onChange={(e) => handleChangeInput(e, +oldRow.index)}
                    defaultValue={oldRow?.progress_quantity ?? ""}
                    data-id="progress_quantity"
                    name="progress_quantity"
                    data-activity_detail_id=""
                    data-bdgt_id=""
                  />
                </td>
                <td>
                  <em>Progress Up To 31st March 2024 Financial (₹ In Lakhs)</em>
                </td>
                <td>
                  <input
                    onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                    /* readOnly={!oldRow.edit} */
                    className="form-control text-right-input border border-dark"
                    type="number"
                    onChange={(e) => handleChangeInput(e, +oldRow.index)}
                    defaultValue={oldRow?.progress_amount ?? ""}
                    data-id="progress_amount"
                    name="progress_amount"
                    data-activity_detail_id=""
                    data-bdgt_id=""
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <button
                    className="btn btn-success"
                    style={{ background: "green" }}
                    onClick={() => saveRow(oldRow, +oldRow.index)}
                  >
                    Save
                  </button>
                </td>
                <td colSpan={2}>
                  <button
                    className="btn btn-danger"
                    style={{ background: "red", float: "right" }}
                    onClick={() => {
                      setRowList((prevState) => {
                        delete prevState[+oldRow.index].edit;
                        return [...prevState];
                      });
                      dispatch(
                        Features.hideModal({
                          title: "",
                          size: "lg",
                        })
                      );
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Expenditure;
