import { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Features from "../../../../redux/features";
import { Helper, Settings, sweetAlert, API } from "../../../../apps";
import Spinner from "../../../../apps/components/elements/Spinner";
import "../spill.css";
import $ from "jquery";
import { Modal } from "../../../../apps/components/elements";
import Papa from "papaparse";

const NationalProposalForm = (props) => {
  const dispatch = useDispatch();
  const user = Helper.auth.user;
  const location = useLocation();
  const [proposalFrmParams] = useState(() => location.state);

  const [notInserted, setNotInserted] = useState([]);

  const [rowList, setRowList] = useState([]);
  const [activeRowID, setActiveRowID] = useState(0);
  const [spin, setSpin] = useState(false);
  const [rowListBackup, setRowListBackup] = useState([]);
  const [modalObj, setModalObj] = useState({ behavior: false, data: null });
  const [processBTN, setProcessBTN] = useState(true);
  var chkFreeze = false;

  useEffect(() => {
    API.post(`api/prabandh/get-national-saved-data`,
      {
        user: user,
        state_id: proposalFrmParams?.stateObject.id || 0,
        activity_master_id: proposalFrmParams?.data?.activity_master_id || 0,
      },
      (res) => {
        if (!!res.status) {
          setRowList(res.data);
          setRowListBackup(res.data);
        }
      }
    );
  }, []);

  const search = (item) => {
    setSpin(true);
    setTimeout(() => {
      const state_id = proposalFrmParams?.stateObject.id;
      API.post(`api/prabandh/get-national-saved-data`,
        {
          user: user,
          state_id: state_id || 0,
          activity_master_id: proposalFrmParams?.data?.activity_master_id || 0,
        },
        (res) => {
          if (!!res.status) {
            setRowList(res.data);
            setRowListBackup(res.data);
          }
          setSpin(false);
        }
      );
    }, 1000);
  };

  const editThis = (e, row) => {
    setRowListBackup(rowList);
    setActiveRowID(row.prb_state_ann_wrk_pln_bdgt_data_id);
  };

  const saveThis = (e, row) => {
    const { physical_quantity, proposed_physical_quantity, proposed_unit_cost, coordinator_remarks } = row;

    if (+physical_quantity > 0 || +proposed_physical_quantity > 0 || +proposed_unit_cost > 0) {
      if (!coordinator_remarks) {
        dispatch(
          Features.showToast({
            message: "Remarks Required",
            flag: "bg-danger",
          })
        );
      } else {
        const id = row.prb_state_ann_wrk_pln_bdgt_data_id;
        let remarks = $(`.rmk_${id}`).val().trim();

        API.post(`api/prabandh/modifynationaldata`,
          {
            id: id,
            physical_quantity: +row.physical_quantity || 0,
            financial_amount: +row.financial_amount * 100000 || 0,
            uom: row.uom || "",
            unit_cost: row.unit_cost,
            proposed_physical_quantity: row.proposed_physical_quantity,
            proposed_financial_amount: row.proposed_financial_amount,
            proposed_unit_cost: row.proposed_unit_cost,
            state_id: row.state || 0,
            coordinator_remarks: remarks,
          },
          (res) => {
            dispatch(
              Features.showToast({
                message: "Data updated successfully.",
                flag: "bg-info",
              })
            );
            setActiveRowID(0);
          }
        );
      }
    }
  };

  const resetThis = (e, row) => {
    setRowList(rowListBackup);
    setActiveRowID(0);
  };

  const handleInput = (e, index, keyName) => {
    let copiedData = JSON.parse(JSON.stringify(rowList));

    copiedData[index][keyName] = e.target.value;

    if (
      copiedData[index].proposed_unit_cost !== null &&
      copiedData[index].proposed_physical_quantity !== null
    ) {
      copiedData[index].proposed_financial_amount = Helper.numberFormatter(
        +copiedData[index].proposed_unit_cost *
          +copiedData[index].proposed_physical_quantity,
        5
      );
    }

    setRowList(copiedData);
  };

  const DUAction = (e, obj, mode) => {
    try {
      const state_id = proposalFrmParams?.stateObject.id;

      if (mode === "D" || mode === "DD") {
        API.download("api/prabandh/national-coordinator-school-list-csv",
          {
            s: state_id,
            activityObj: obj,
            mode: mode,
          },
          (res) => {}
        );
      } else if (mode === "U") {
        setModalObj({ data: obj, behavior: true });
        dispatch(
          Features.showModal({
            title: `Upload School: (${
              obj?.activity_master_details_name || ""
            })`,
            size: "lg",
          })
        );
      }
    } catch (error) {}
  };

  const handleFileChange = async (e) => {
    let flN = e.target.files[0]?.name?.split(".");
    if (Settings?.isDataExistsInArray(["csv", "CSV"], flN?.pop())) {
      const selectedFile = e.target.files[0];
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          const requiredFields = ["UDISE", "SCHOOL NAME", "PHYSICAL QUANTITY"];

          // Check if the CSV file contains the required fields
          const hasRequiredFields = requiredFields.every((field) => { return results.meta.fields.includes(field) });

          if (!hasRequiredFields) {
            sweetAlert.warning("Error: CSV file is missing some required fields.");
          } else {
            sweetAlert.confirmation({
              msg: "Are you sure you want to upload this file?",
              yesBtnText: "Yes",
              noBtnText: "No",
              url: "",
              callback: async () => {
                //setFile(selectedFile);
                const url = "api/prabandh/upload";
                try {
                  await API.upload(url, selectedFile,
                    {
                      amd: modalObj.data,
                      district_id: 0,
                      state_id: 0,
                      uploadFrom: "national",
                    },
                    (data) => {
                      if (data.status === 200) {
                        dispatch(
                          Features.showToast({
                            message: "File Uploaded Successfully.",
                            flag: "bg-success",
                          })
                        );
                        setProcessBTN(false);
                        setNotInserted(data.notinserted);
                      }
                      if (data.status === 400) {
                        dispatch(
                          Features.showToast({
                            message: `Error: ${data.message}.`,
                            flag: "bg-danger",
                          })
                        );
                        setProcessBTN(false);
                      }
                    }
                  );
                } catch (error) {
                  dispatch(
                    Features.showToast({
                      message: "Error: File Not Uploaded.",
                      flag: "bg-danger",
                    })
                  );
                }
              },
              redirect: "",
            });
          }
        },
      });
    } else {
      sweetAlert.warning(`Invalid File Format: The selected file does not adhere to the expected CSV format.`);
    }
  };

  const processFileUpload = () => {
    setProcessBTN(true);
    const state_id = proposalFrmParams?.stateObject.id;
    API.post(`api/prabandh/save-national-school-configuration`,
      {
        district_id: 0,
        state_id: state_id,
        process: true,
        data: { rows: [], amd: modalObj.data },
      },
      (res) => {
        dispatch(Features.hideModal());
        setTimeout(() => {
          search();
        }, 500);
      }
    );
  };

  const handleApproveOrReject = (e, object, mode) => {
    const state_id = proposalFrmParams?.stateObject.id;
    if (!+object.proposed_financial_amount && !+object.proposed_physical_quantity && !+object.proposed_unit_cost) {
      API.post(`api/prabandh/update-intervention-status`,
        {
          state_id: state_id,
          prb_state_ann_wrk_pln_bdgt_data_id: object.prb_state_ann_wrk_pln_bdgt_data_id,
          mode: mode,
          user: user,
        },
        (res) => {
          setTimeout(() => {
            search();
          }, 500);
        }
      );
    } else {
      if (+object.dd_school === 1 && user?.user_role_id === 15 && +object.school_list_quantity === 0) {
        sweetAlert.warning("Error: Schools List Required.");
      } else {
        API.post(`api/prabandh/update-intervention-status`,
          {
            state_id: state_id,
            prb_state_ann_wrk_pln_bdgt_data_id: object.prb_state_ann_wrk_pln_bdgt_data_id,
            mode: mode,
            user: user,
          },
          (res) => {
            setTimeout(() => {
              search();
            }, 500);
          }
        );
      }
    }
  };

  const freezeAll = () => {
    const state_id = proposalFrmParams?.stateObject.id;
    const ids = [];
    var ddSchoolQuantityCheck = 0;

    $(".frzz").each(function () {
      var elementId = $(this).attr("id");
      var quantities = $(this).attr("schoollistquantity");
      var ddSchool = $(this).attr("ddschool");
      ids.push(elementId.split("_")[1]);
      if (+ddSchool === 1 && +quantities === 0 && user?.user_role_id === 15) {
        ddSchoolQuantityCheck = 1;
      }
    });
    if (ddSchoolQuantityCheck === 1) {
      sweetAlert.warning("Error: Schools list not uploaded for one of the Sub-activities. Kindly upload it first.");
      return false;
    } else {
      for (let i = 0; i < ids.length; i++) {
        API.post(`api/prabandh/update-intervention-status`,
          {
            state_id: state_id,
            prb_state_ann_wrk_pln_bdgt_data_id: ids[i],
            mode: "A",
            user: user,
          },
          (res) => {}
        );
      }

      setTimeout(() => {
        search();
      }, 500);
    }
  };

  const editControlState = (r, type) => {
    const role = +user?.user_role_id;
    const status = +r?.status;
    const state_submission_status = +r?.state_submission_status;
    let canApprove = "N";
    let canReject = "N";
    let isEditable = "N";

    if (role === 3 && state_submission_status === 6 && (status === 1 || status === 2)) {
      isEditable = "Y";
      canApprove = "Y";
      canReject = "N";
    } else if (role === 2 && status === 3) {
      isEditable = "N";
      canApprove = "Y";
      canReject = "Y";
    } else if (role === 15 && status === 4) {
      isEditable = "Y";
      canApprove = "Y";
      canReject = "N";
    } else {
      canApprove = "N";
      canReject = "N";
      isEditable = "N";
    }

    if (type === "R") {
      return canReject;
    }
    if (type === "A") {
      return canApprove;
    }
    if (type === "E") {
      return isEditable;
    }
  };

  const getCurrentStatus = (currentStatus, state_submission_status) => {
    if (currentStatus === 5) {
      return (
        <span className="badge text-bg-success">
          Approved By
          <br />
          State Coordinator
        </span>
      );
    } else if (currentStatus === 4) {
      return (
        <span className="badge text-bg-primary">
          Pending With
          <br />
          State Coordinator
        </span>
      );
    } else if (currentStatus === 3) {
      return (
        <span className="badge text-bg-danger">
          Pending With
          <br />
          Financial Consultant
        </span>
      );
    } else if (state_submission_status !== "6") {
      return (
        <span className="badge text-bg-dark">
          Not approved
          <br />
          by state
        </span>
      );
    } else {
      return (
        <span className="badge text-bg-warning">
          Pending With
          <br />
          Intervention Consultant
        </span>
      );
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <div className="d-flex justify-content-between">
          <h1>Proposal Form Of {proposalFrmParams?.stateObject?.name}</h1>
          <Link to="/auth/prabandh/plan/national/activity-list" state={{ proposal_form_params: proposalFrmParams }}>
            <button type="button" className="float-end btn btn-primary">
              <i className="bi bi-arrow-left" /> Back
            </button>
          </Link>
        </div>
      </div>

      <div className="dashboard-main-content-info table-container mt-5" style={{ textAlign: "center" }}>
        <table cellPadding={5} cellSpacing={5} style={{ textAlign: "left" }} className="text-black mt-2 mb-2">
          <tbody>
            <tr>
              <td style={{ background: "#ffdb4d" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <em>Pending With Intervention Consultant</em>
              </td>
              <td style={{ background: "#ff944d" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <em>Pending With Financial Consultant</em>
              </td>
              <td style={{ background: "#4e94fd" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <em>Pending With State Coordinator</em>
              </td>
              <td style={{ background: "#68e3aa" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <em>Approved By State Coordinator</em>
              </td>
              <td style={{ background: "#ff0000" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <em>Recommendation Is Greater Than State Proposal</em>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />

        {spin ? (<Spinner />) : rowList.length === 0 ? (<h3>No Data Found</h3>) : (
          <>
            <table className="table">
              <tbody>
                <tr key={0}>
                  <td>
                    <b>Scheme</b>:<br /> {proposalFrmParams?.data.scheme_name}
                  </td>
                  <td>
                    <b>Major Component</b>:<br />{" "}
                    {proposalFrmParams?.data.major_component_name}
                  </td>
                  <td>
                    <b>Sub Component</b>:<br />
                    {proposalFrmParams?.data.sub_component_name}
                  </td>
                  <td>
                    <b>Activity</b>:<br />
                    {proposalFrmParams?.data.activity_master_name}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="table-scroll-section">
              <table className="table-scroll table-sm">
                <thead>
                  <tr>
                    <th>
                      S. <br /> No.
                    </th>
                    <th width="10%">Sub Activity</th>
                    <th>
                      Page. <br /> No.
                    </th>
                    <th>
                      🏫 <br /> Download
                    </th>
                    <th>Phy. Qty.</th>
                    <th>
                      Unit Cost <br /> (In Lakhs)
                    </th>
                    <th>
                      Fin. Amt. <br /> (In Lakhs)
                    </th>
                    {/* <th>UOM</th> */}
                    <th>
                      🏫 <br /> Upload
                    </th>
                    <th>
                      Prop. Phy. <br /> Qty.
                    </th>
                    <th>
                      Prop. Unit Cost <br /> (In Lakhs)
                    </th>
                    <th>
                      Prop. Fin. Amt. <br /> (In Lakhs)
                    </th>
                    <th>
                      Remarks <br /> (Max 1000 Characters)
                    </th>
                    {props && props.viewMode !== "read-only" && +user.user_role_id !== 12 && <th>Edit</th>}
                    <th>
                      Current <br /> Status
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowList?.length > 0 &&
                    rowList.map((r, idx) => {
                      return (
                        <Fragment key={`rrf_${idx + 1}`}>
                          {(+r?.no_of_school > 0 ||
                            +r?.physical_quantity > 0 ||
                            +r?.unit_cost > 0 ||
                            +r?.financial_amount > 0) && (
                            <tr
                              key={`rr_${idx + 1}`}
                              style={{
                                backgroundColor: `${
                                  +r.financial_amount <
                                  r.proposed_financial_amount
                                    ? "#ff0000"
                                    : r.status === 1 &&
                                      r.state_submission_status === "6"
                                    ? "#ffdb4d"
                                    : r.status === 3 &&
                                      r.state_submission_status === "6"
                                    ? "#ff944d"
                                    : r.status === 4 &&
                                      r.state_submission_status === "6"
                                    ? "#4e94fd"
                                    : r.status === 5 &&
                                      r.state_submission_status === "6"
                                    ? "#68e3aa"
                                    : "#fff"
                                }`,
                              }}
                            >
                              <td>{idx + 1}</td>
                              <td>
                                <strong>
                                  {r.activity_master_details_name}
                                </strong>
                              </td>
                              <td>{r.page_number}</td>
                              <td className="text-center">
                                {r.dd_school === "1" && (
                                  <span
                                    className={`badge rounded-pill w-100 pe-auto`}
                                    /*  className={`badge rounded-pill w-100 pe-auto ${
                                          +r.status > 1
                                            ? "disabled text-bg-secondary"
                                            : " text-bg-dark"
                                        }`} */
                                    style={{
                                      fontSize: "15px",
                                      padding: "2px 10px",
                                      width: "100px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => DUAction(e, r, "D")}
                                  >
                                    <i className="bi bi-download"></i>
                                    {"  "}({r?.no_of_school || 0})
                                  </span>
                                )}
                              </td>
                              <td className="text-end">
                                {parseInt(r.physical_quantity)}
                              </td>
                              <td className="text-end">
                                {Helper.numberFormatter(r.unit_cost, 5)}
                              </td>
                              <td className="text-end">
                                {Helper.numberFormatter(r.financial_amount, 5)}
                              </td>
                              <td className="text-center">
                                {r.dd_school === "1" && (
                                  <span
                                    className={`${
                                      +r.status === 5 ||
                                      +activeRowID !==
                                        +r.prb_state_ann_wrk_pln_bdgt_data_id
                                        ? "no_badge disabled"
                                        : "badge"
                                    } rounded-pill w-100 pe-auto`}
                                    /* className={`badge rounded-pill w-100 pe-auto ${
                                          +user?.user_role_id !== 3
                                            ? "disabled text-bg-secondary"
                                            : +r.status > 1
                                            ? "disabled text-bg-secondary"
                                            : " text-bg-dark"
                                        }`} */
                                    style={{
                                      fontSize: "15px",
                                      padding: "2px 10px",
                                      width: "100px",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => DUAction(e, r, "U")}
                                  >
                                    <i className="bi bi-upload"></i>{" "}
                                  </span>
                                )}
                              </td>
                              <td className="text-end">
                                {+activeRowID ===
                                  +r.prb_state_ann_wrk_pln_bdgt_data_id &&
                                Settings.isNationalUser() ? (
                                  <input
                                    className="form-control form-control-sm"
                                    type="text"
                                    id={`proposed_physical_quantity_${r.prb_state_ann_wrk_pln_bdgt_data_id}`}
                                    onInput={(e) =>
                                      handleInput(
                                        e,
                                        idx,
                                        "proposed_physical_quantity"
                                      )
                                    }
                                    disabled={
                                      r.dd_school === "1" ? true : false
                                    }
                                    style={{ minWidth: "100px" }}
                                    onKeyDown={(e) =>
                                      Helper.validateNumberInput(e, 8, 5)
                                    }
                                    defaultValue={r.proposed_physical_quantity}
                                  ></input>
                                ) : isNaN(r.proposed_physical_quantity) ? (
                                  0
                                ) : (
                                  r.proposed_physical_quantity
                                )}
                              </td>
                              <td className="text-end">
                                {+activeRowID ===
                                  +r.prb_state_ann_wrk_pln_bdgt_data_id &&
                                Settings.isNationalUser ? (
                                  <input
                                    className="form-control form-control-sm"
                                    type="text"
                                    id={`proposed_unit_cost_${r.prb_state_ann_wrk_pln_bdgt_data_id}`}
                                    onInput={(e) =>
                                      handleInput(e, idx, "proposed_unit_cost")
                                    }
                                    // style={{ minWidth: "100px" }}
                                    onKeyDown={(e) =>
                                      Helper.validateNumberInput(e, 8, 5)
                                    }
                                    defaultValue={r.proposed_unit_cost}
                                  ></input>
                                ) : (
                                  Helper.numberFormatter(
                                    r.proposed_unit_cost,
                                    5
                                  )
                                )}
                              </td>
                              <td className="text-end">
                                {+activeRowID ===
                                  +r.prb_state_ann_wrk_pln_bdgt_data_id &&
                                Settings.isNationalUser ? (
                                  <input
                                    className="form-control form-control-sm"
                                    type="text"
                                    id={`proposed_financial_amount_${r.prb_state_ann_wrk_pln_bdgt_data_id}`}
                                    value={r.proposed_financial_amount}
                                    // style={{ minWidth: "100px" }}
                                    onInput={(e) =>
                                      handleInput(
                                        e,
                                        idx,
                                        "proposed_financial_amount"
                                      )
                                    }
                                    onKeyDown={(e) =>
                                      Helper.validateNumberInput(e, 8, 5)
                                    }
                                    defaultValue={r.proposed_financial_amount}
                                  ></input>
                                ) : (
                                  Helper.numberFormatter(
                                    r.proposed_financial_amount,
                                    5
                                  )
                                )}
                              </td>
                              <td>
                                {+activeRowID ===
                                  +r.prb_state_ann_wrk_pln_bdgt_data_id &&
                                Settings.isNationalUser() &&
                                (editControlState(r, "E") === "Y" ||
                                  (+user?.user_role_id === 17 &&
                                    +r.status !== 3)) ? (
                                  <textarea
                                    cols="30"
                                    rows="4"
                                    maxLength={1000}
                                    onInput={(e) =>
                                      handleInput(e, idx, "coordinator_remarks")
                                    }
                                    style={{
                                      fontSize: "12px",
                                      border: "1px solid #ccc",
                                      borderRadius: "5px",
                                    }}
                                    className={` rmk_${r.prb_state_ann_wrk_pln_bdgt_data_id}`}
                                    name={`coordinator_rmk_${r.prb_state_ann_wrk_pln_bdgt_data_id}`}
                                    defaultValue={r.coordinator_remarks}
                                  ></textarea>
                                ) : (
                                  <span>{r.coordinator_remarks}</span>
                                )}
                              </td>
                              <td>
                                {+activeRowID ===
                                +r.prb_state_ann_wrk_pln_bdgt_data_id ? (
                                  <Fragment>
                                    <div
                                      className="btn-group"
                                      role="group"
                                      aria-label="Basic mixed styles example"
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-success btn-sm"
                                        onClick={(e) => saveThis(e, r)}
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={(e) => resetThis(e, r)}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    {(editControlState(r, "E") === "Y" ||
                                      (+user?.user_role_id === 17 &&
                                        +r.status !== 3)) && (
                                      <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={(e) => editThis(e, r)}
                                      >
                                        <i className="bi bi-pencil" />
                                      </button>
                                    )}
                                  </Fragment>
                                )}
                              </td>
                              <td>
                                {getCurrentStatus(
                                  r.status,
                                  r.state_submission_status
                                )}
                              </td>
                              <td>
                                {editControlState(r, "A") === "Y" && (
                                  <button
                                    className={`btn btn-sm btn-primary m-2 frzz`}
                                    schoollistquantity={r.school_list_quantity}
                                    ddschool={r.dd_school}
                                    id={`frz_${r.prb_state_ann_wrk_pln_bdgt_data_id}`}
                                    // disabled={
                                    //   +r.proposed_financial_amount > 0 &&
                                    //     +r.proposed_physical_quantity > 0 &&
                                    //     +r.proposed_unit_cost > 0 &&
                                    //     (+activeRowID ===
                                    //       +r.prb_state_ann_wrk_pln_bdgt_data_id
                                    //       ? +rowListBackup.proposed_financial_amount >
                                    //       0 &&
                                    //       +rowListBackup.proposed_physical_quantity >
                                    //       0 &&
                                    //       +rowListBackup.proposed_unit_cost > 0
                                    //       : true)
                                    //     ? false
                                    //     : true
                                    // }
                                    disabled={
                                      +activeRowID ===
                                      +r.prb_state_ann_wrk_pln_bdgt_data_id
                                    }
                                    onClick={(e) => {
                                      // handleApproveOrReject(e, r, "A");

                                      if (
                                        !+r.proposed_financial_amount &&
                                        !+r.proposed_physical_quantity &&
                                        !+r.proposed_unit_cost
                                      ) {
                                        sweetAlert.confirmation({
                                          title: "Are you sure?",
                                          msg: `Do you want to freeze this activity having 0 financial approval.`,
                                          yesBtnText: "Yes",
                                          noBtnText: "No",
                                          url: "",
                                          callback: () =>
                                            handleApproveOrReject(e, r, "A"),
                                          redirect: "",
                                        });
                                      } else {
                                        handleApproveOrReject(e, r, "A");
                                      }
                                    }}
                                  >
                                    Freeze
                                    {
                                      (chkFreeze =
                                        +r.proposed_financial_amount > 0 &&
                                        +r.proposed_physical_quantity > 0 &&
                                        +r.proposed_unit_cost > 0
                                          ? true
                                          : chkFreeze === true
                                          ? true
                                          : false)
                                    }
                                  </button>
                                )}
                                {editControlState(r, "R") === "Y" && (
                                  <button
                                    className="btn btn-sm btn-danger m-2"
                                    onClick={(e) =>
                                      handleApproveOrReject(e, r, "R")
                                    }
                                  >
                                    Reject
                                  </button>
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                </tbody>
              </table>

              {/* {Settings.isNFCNICSC() && chkFreeze && ( */}
              {Settings.isNFCNICSC() && (
                <table width="100%">
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "right" }}>
                        <button className={`btn btn-sm btn-primary m-2`} onClick={freezeAll}
                          disabled={rowList.filter((item) => !parseFloat(item.proposed_financial_amount) && parseFloat(item.unit_cost) > 0).length ? true : activeRowID}
                        >
                          Freeze All
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
      
      {modalObj.behavior && (
        <Modal close={() => {
            dispatch(Features.hideModal());
            setModalObj({ behavior: false, data: null });
          }}
        >
          <table width="100%">
            <tr>
              <td align="left">
                <button className="btn btn-info" onClick={(e) => DUAction(e, modalObj.data, "DD")}>
                  <i className="bi bi-cloud-arrow-down" /> Download CSV File
                </button>
              </td>
              <td align="right">
                <input className="form-control" type="file" accept=".csv" onChange={handleFileChange} id="formFile" />
              </td>
              <td align="right">
                {!processBTN && (
                  <button className="btn btn-success" onClick={processFileUpload}>
                    <i className="bi bi-cpu" /> Process Uploaded
                  </button>
                )}
              </td>
            </tr>
          </table>
          {notInserted.length > 0 && (
            <>
              <h6 className="p2 mt-3">UDISE CODE NOT FOUND</h6>
              <ul className="list-group">
                {notInserted.map((i) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    {i.udise}
                    <span className="badge badge-danger badge-pill">X</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default NationalProposalForm;