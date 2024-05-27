import React, { useEffect, useRef, useState } from "react";
import { Helper, Settings, API, Hook, Column } from "../../../apps";
import "../prabandh/spill.css";
import sweetAlert from "../../../apps/utilities/sweetalert";
import { subDays, format } from "date-fns";
//import Spinner from "../../../apps/components/elements/Spinner";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import store from "../../../redux/app/store";
import Btnloader from "../../../apps/components/elements/Btnloader";
import SelectedYear from "./SelectedYear";

const FundRelease = () => {
  let userData = Helper.auth?.user;

  const stateList = Hook.useStates();
  const districtsList = Hook.useDistricts();

  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [districtID, setDistrictID] = useState(userData?.user_district_id || 0);
  const [allotmentData, setAllotmentData] = useState([]);
  const [approvedBudgetData, setApprovedBudgetData] = useState([]);
  const [spin, setSpin] = useState(false);
  const [allocatedAmount, setAllocatedAmount] = useState();
  const [saved, setSaved] = useState(false);
  const [sessionNumber, setSessionNumber] = useState();
  const [installmentNumber, setInstallmentNumber] = useState(
    allotmentData?.filter((item) => item?.recurring_non_recurring === 1)
      ?.length + 1 || 1
  );
  const [recurringNonRecurring, setRecurringNonRecurring] = useState(1);
  const [allocatedDate, setAllocatedDate] = useState("");
  const [sensionOrderDate, setSensionOrderDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [totalAllotedAmount, setTotalAllotedAmount] = useState(0);
  const [file, setFile] = useState("");
  const [refresh, setRefresh] = useState(Date.now());
  const [stateApprovedList, setStateApprovedList] = useState([]);
  const [districtApprovedList, setDistrictApprovedList] = useState([]);
  const [sactionorminDate, setSanctionorminDate] = useState();
  const [saveloader, setSaveloader] = useState(false)
  const inputFile = useRef();
  const stateName = stateList?.filter((c) => +c.id === +stateID);
  const districtName = districtsList?.filter(
    (c) => +c.district_id === +districtID && +c.district_state_id === +stateID
  );
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSensionOrderDate("");
    setSessionNumber("");
    if (name === "state-list") {
      setStateID(+value);
      setSpin(true);
    }
    if (name === "district-list") {
      setDistrictID(+value);
      setSpin(true);
    }
  };

  useEffect(() => {
    fetchBudgetData();
    setAllocatedAmount(0);
    setSessionNumber();
    // setInstallmentNumber(allotmentData?.length+1);
    setAllocatedDate("");
    setRemarks("");
    getStateApprovedList();
    getDistrictApprovedList();
  }, [stateID, districtID, refresh]);

  const getStateApprovedList = () => {
    API.post(
      "api/budget/state-approved-list",
      { state_id: userData?.user_state_id },
      (res) => {
        const index = res?.data?.findIndex(item => +item.state_id === +stateID)
        if (index === -1) {
          setStateApprovedList(res.data);
        } else {
          const object = res?.data?.splice(index, 1)
          const data = res.data?.unshift(object[0])
          setStateApprovedList(res.data);
        }
      }
    );
  };

  const getDistrictApprovedList = () => {
    API.post(
      "api/budget/district-approved-list",
      { state_id: userData?.user_state_id },
      (res) => {
        setDistrictApprovedList(res.data);
      }
    );
  };
  const fetchBudgetData = () => {
    if (Settings.isNationalUser() && stateID !== 0) {
      API.post(
        "api/budget/get-allocations",
        { state_id: stateID, alloted_to: "State", alloted_from: "Center" },
        (res) => {
          setTotalAllotedAmount(
            res?.data?.reduce((prev, next) => +prev + +next.released_amount, 0)
          );
          setAllotmentData(res.data ? res.data : []);

          const maxDate = res?.data?.reduce((max, obj) => {
            const currentDate = new Date(obj.sension_order_date); // Convert the date string to a Date object
            return currentDate > max ? currentDate : max; // Compare with current max date
          }, new Date(res.data[0]?.sension_order_date)); // Initialize max with the date from the first object
          if (maxDate instanceof Date && !isNaN(maxDate)) {
            setSanctionorminDate(maxDate?.toISOString()?.slice(0, 10));
          } else {
            setSanctionorminDate();
          }
          setSpin(false);
          setInstallmentNumber(
            res?.data?.filter((item) => item?.recurring_non_recurring === 1)
              ?.length + 1
          );
        }
      );

      API.post(
        "api/budget/get-state-approved-budget",
        { state_id: +stateID, year_id: 9 },
        (res) => {
          setApprovedBudgetData(res.data);
          setSpin(false);
        }
      );
    }

    if (Settings.isStateApproverUser() && districtID !== 0) {
      API.post(
        "api/budget/get-allocations",
        {
          district_id: districtID,
          alloted_to: "District",
          alloted_from: "State",
        },
        (res) => {
          setTotalAllotedAmount(
            res?.data?.reduce((prev, next) => +prev + +next.released_amount, 0)
          );
          const maxDate = res.data?.reduce((max, obj) => {
            const currentDate = new Date(obj.sension_order_date); // Convert the date string to a Date object
            return currentDate > max ? currentDate : max; // Compare with current max date
          }, new Date(res.data[0]?.sension_order_date)); // Initialize max with the date from the first object
          // setSanctionorminDate(maxDate?.toISOString()?.slice(0, 10))

          if (maxDate instanceof Date && !isNaN(maxDate)) {
            setSanctionorminDate(maxDate?.toISOString()?.slice(0, 10));
          } else {
            setSanctionorminDate();
          }
          setAllotmentData(res.data ? res.data : []);
          setSpin(false);
          setInstallmentNumber(
            res?.data?.filter((item) => item?.recurring_non_recurring === 1)
              ?.length + 1
          );
        }
      );

      API.post(
        "api/budget/get-state-alloted-budget",
        { state_id: stateID },
        (res) => {
          setApprovedBudgetData(res.data);
          setSpin(false);
        }
      );
    }
  };

  const validateFileType = (file) => {
    // Define the allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
    ];
    // Check if the file type is allowed
    return allowedTypes.includes(file.type);
  };

  const saveAllocatedAmount = (e, allocatedTo) => {
    
    if (
      Settings.isNationalUser() &&
      +approvedBudgetData[0]?.central_share <
      +totalAllotedAmount + +allocatedAmount
    ) {
      sweetAlert.warning(
        "Allocated amount sum should not exceed the Center Share."
      );
    } else if (
      Settings.isStateApproverUser() &&
      // (+approvedBudgetData.length === 1
      //   ? +approvedBudgetData[0]?.total_released_amount < +allocatedAmount
      //   : +approvedBudgetData[1]?.total_released_amount -
      //       +approvedBudgetData[0]?.total_released_amount <
      //     +allocatedAmount)
      ((+stateApprovedList[0]['recurring_receipt_from_center'] +
        +stateApprovedList[0]['non_recurring_receipt_from_center'] +
        +stateApprovedList[0]['recurring_receipt_from_own_state'] +
        +stateApprovedList[0]['non_recurring_receipt_from_own_state']) - allotmentData.reduce((prev, next) => +prev + +next.released_amount, 0) < +allocatedAmount)

    ) {
      sweetAlert.warning(
        "Allocated amount sum should not exceed the available amount."
      );
    }
    //  else if (allotmentData.length > 0 && installmentNumber <= allotmentData[allotmentData.length - 1].installment_number) {
    //     sweetAlert.warning("Installment number should be greater than previous installment number.");
    // }
    else if (!validateFileType(inputFile.current.files[0])) {
      sweetAlert.warning("Invalid file type. Please upload a valid file.");
    } else if (file.length === 0) {
      sweetAlert.warning("Please Upload file.");
    } else {
      setSaved(true);
      const formData = new FormData();

      formData.append("alloted_to", allocatedTo);
      if (Settings.isStateUser()) {
        formData.append("transaction_type", 2);
      } else {
        formData.append("transaction_type", 1);
      }
      formData.append("alloted_by", userData.id);
      formData.append("state_id", stateID);
      formData.append("district_id", districtID);
      formData.append(
        "approved_amount",
        Settings.isNationalOrStateUser()
          ? approvedBudgetData[0]?.total_approved || 0
          : +totalAllotedAmount + +allocatedAmount
      );
      formData.append("released_amount", allocatedAmount);
      formData.append("sension_number", sessionNumber);
      formData.append("file", inputFile.current.files[0]);
      formData.append("installment_number", installmentNumber);
      formData.append("recurring_non_recurring", recurringNonRecurring);
      formData.append("release_date", allocatedDate);
      formData.append("sension_order_date", sensionOrderDate);
      formData.append("remarks", remarks);
      formData.append(
        "alloted_from",
        allocatedTo === "State" ? "Center" : "State"
      );
      // e.target.disabled = true;
      axios
        .post(`${REACT_APP_URL}api/budget/allot`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            API_Year: store.getState().year.year,
            Authorization: `Bearer ${Helper.token()}`,
          },
        })
        .then(function (response) {
          setSaved(false);
          if (response?.status === 200) {
            setRecurringNonRecurring(1);
            setAllocatedAmount("");
            setSessionNumber("");
            setSensionOrderDate("");
            setFile("");
            if (inputFile.current) {
              inputFile.current.value = "";
            }
            setRemarks("");
            sweetAlert.done({ msg: "Data saved successfully." });
            setRefresh(Date.now());
          }
        })
        .catch(function (error) {
          setSaved(false);
          // if (error?.response?.status === 400) {
          //     sweetAlert.error({ msg: error.response?.data?.message });
          // }
        });
    }
  };

  const resetForm = () => {
    setSensionOrderDate("");
    setFile("");
    setAllocatedAmount(0);
    setSessionNumber(0);
    setInstallmentNumber(
      allotmentData?.filter((item) => item?.recurring_non_recurring === 1)
        ?.length + 1 || 1
    );
    setAllocatedDate("");
    setRemarks("");
    inputFile.current.value = "";
  };

  const fileChange = (e) => {
    if (e.target.files[0]) {
      if (!validateFileType(e.target.files[0])) {
        sweetAlert.warning("Invalid file type. Please upload a valid file.");
      } else {
        setFile(e.target.files[0]);
      }
    }
  };
  const isDisabled = () => {
    if (
      allocatedAmount === 0 ||
      installmentNumber === 0 ||
      remarks === "" ||
      !sessionNumber ||
      !inputFile?.current?.value ||
      sensionOrderDate === "" ||
      file?.name?.length === 0
    ) {
      return true;
    } else {
      // setSaved(false);
      return false;
    }
  };

  const handleDownloadFile = async (tr) => {
    const name = tr.installment_doc.split("/").pop();
    const pdfUrl = `${REACT_APP_URL}api/budget/downloadfile/${tr?.id}`;

    try {
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf/xlsx",
          Authorization: `Bearer ${Helper.token()}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const changeDate = (e) => {
    e.preventDefault();
  };
  const renderBudgetAllotmentData = () => {
    return (
      <>
        {/* {Settings.isNationalUser() && <div className="row mb-3 mx-1">
                    <table className="table">
                        <thead>
                            <tr>
                                {Column.approvedBudget().map((itm, idx) => {
                                    let data = Object.values(itm)
                                    return (
                                        <th
                                            width={data[1]}
                                            className={data[2]}
                                            key={idx}
                                        >
                                            {data[0]}
                                        </th>
                                    )
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {approvedBudgetData.length > 0 && <tr>
                                <td className="text-center border">{Helper.accountFormat(approvedBudgetData[0]?.total_approved)}</td>
                                <td className="text-center border">{`${Helper.accountFormat(approvedBudgetData[0]?.central_share)} (${Helper.numberFormatter((approvedBudgetData[0]?.central_share * 100 / approvedBudgetData[0]?.total_approved), 2)}%)`}</td>
                                <td className="text-center border">{`${Helper.accountFormat(approvedBudgetData[0]?.state_share)} (${Helper.numberFormatter((approvedBudgetData[0]?.state_share * 100 / approvedBudgetData[0]?.total_approved), 2)}%)`}</td>
                            </tr>}
                        </tbody>
                    </table>
                </div>} */}

        {/* {Settings.isStateApproverUser() && <div className="row mb-3 mx-1">
                    <table className="table">
                        <thead>
                            <tr>
                                {Column.approvedStateBudget().map((itm, idx) => {
                                    let data = Object.values(itm)
                                    return (
                                        <th
                                            width={data[1]}
                                            className={data[2]}
                                            key={idx}
                                        >
                                            {data[0]}
                                        </th>
                                    )
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {approvedBudgetData.length >= 1 && <tr>
                                <td className="text-center border">{Helper.accountFormat(+approvedBudgetData.length === 1 ? +approvedBudgetData[0]?.total_released_amount : +approvedBudgetData[1]?.total_released_amount)}</td>
                                <td className="text-center border">{Helper.accountFormat(+approvedBudgetData.length === 1 ? 0 : +approvedBudgetData[0]?.total_released_amount)}</td>
                                <td className="text-center border">{Helper.accountFormat(+approvedBudgetData.length === 1 ? +approvedBudgetData[0]?.total_released_amount : (+approvedBudgetData[1]?.total_released_amount - +approvedBudgetData[0]?.total_released_amount))}</td>
                            </tr>}
                        </tbody>
                    </table>
                </div>} */}

        {Settings.isNotDistrictUser() && (
          <div className="row">
            <div className="table-scroll-section">
              <table className="table-scroll">
                <thead>
                  <tr>
                    <th className="text-center" colSpan={10}>
                      Release Fund For
                      {Settings.isNationalUser()
                        ? stateName && stateName.length > 0
                          ? ` State (${stateName[0].name})`
                          : ""
                        : districtName && districtName.length > 0
                          ? ` District (${districtName[0].district_name})`
                          : ""}
                    </th>
                  </tr>
                  <tr>
                    {Column.budgetAllotment().map((itm, idx) => {
                      let data = Object.values(itm);
                      return (
                        <th width={data[1]} className={data[2]} key={idx}>
                          {data[0]}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {allotmentData.length > 0 && (
                    <>
                      {allotmentData.map((itm, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}.</td>
                            <td className="text-center">
                              {itm?.sension_number}
                            </td>
                            <td className="text-center">
                              {itm?.sension_order_date
                                ?.split("-")
                                .reverse()
                                .join("-")}
                            </td>
                            <td className="text-center">
                              <label
                                className="btn btn-success btn-sm"
                                title={itm.installment_doc?.split("/").pop()}
                                onClick={() => handleDownloadFile(itm)}
                              >
                                <i className="bi bi-file-earmark-arrow-down"></i>{" "}
                                Download
                              </label>
                            </td>
                            <td className="text-end">
                              {" "}
                              {itm?.installment_number}
                            </td>
                            <td>
                              {itm?.recurring_non_recurring === 1
                                ? "Recurring"
                                : "Non Recurring"}
                            </td>
                            {/* date of release  */}
                            {/* <td className="text-center">
                              {itm?.release_date
                                ?.split("-")
                                .reverse()
                                .join("-")}
                            </td> */}
                            <td className="text-end">
                              {Helper.accountFormat(itm?.released_amount, 5)}
                            </td>
                            <td>{itm?.remarks}</td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                  <tr>
                    <td>
                      {allotmentData.length > 0 ? allotmentData.length + 1 : 1}.
                    </td>
                    

                    <td className="text-end">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        placeholder="Enter Sanction number"
                        value={sessionNumber}
                        onChange={(e) => setSessionNumber(e.target.value)}
                        data-id="session-number"
                        name="sension_number"
                        style={{ minWidth: "100px" }}
                      />
                    </td>

                    <td className="text-end">
                      <input
                        className="form-control form-control-sm"
                        type="date"
                        min={sactionorminDate}
                        value={sensionOrderDate}
                        max={format(new Date(), 'yyyy-MM-dd')}
                        onInput={(e) => {
                          setSensionOrderDate(e.target.value);
                        }}
                        onKeyDown={(e)=>e.preventDefault()}
                        data-id="Sanction-order-date"
                        name="sension_order_date"
                        style={{ minWidth: "80px" }}
                      />
                    </td>

                    <td className="text-center">
                      <label
                        htmlFor={`file_0`}
                        className="btn btn-primary btn-sm"
                        title="Upload Document(s)"
                      >
                        <i className="bi bi-file-earmark-arrow-up"></i>{" "}
                        {file.length !== 0 ? "selected" : "Upload"}
                      </label>
                      <input
                        type="file"
                        id={`file_0`}
                        style={{ display: "none" }}
                        ref={inputFile}
                        onChange={fileChange}
                      />
                    </td>
                    <td className="text-end">
                      <input
                        className="form-control form-control-sm text-end"
                        type="text"
                        disabled={true}
                        value={installmentNumber}
                        name="state-list"
                        style={{ minWidth: "80px" }}
                      />
                      {/* <select
                                            className="form-select"
                                            name="state-list"
                                            value={installmentNumber}
                                            onChange={e => setInstallmentNumber(e.target.value)}
                                        >
                                            <option value={0}>Installment Number</option>
                                            {installmentsArray?.map((st, stidx) => (
                                                <option key={`st_${stidx}`} value={st.value}>
                                                    {st.installment_number}
                                                </option>
                                            ))}
                                        </select> */}
                    </td>

                    <td className="text-end">
                      <select
                        className="form-select"
                        name="recurring_non_recurring"
                        value={recurringNonRecurring}
                        onChange={(e) => {
                          setRecurringNonRecurring(e.target.value);
                          setInstallmentNumber(
                            allotmentData?.filter(
                              (item) =>
                                +item?.recurring_non_recurring ===
                                +e.target.value
                            )?.length + 1 || 1
                          );
                        }}
                      >
                        <option value={1}>Recurring</option>
                        <option value={2}>Non Recurring</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <input
                        className="form-control form-control-sm text-right-input"
                        type="text"
                        onKeyDown={(e) => Helper.validateNumberInput(e, 8, 5)}
                        placeholder="Enter allotted amount"
                        value={allocatedAmount}
                        onChange={(e) => setAllocatedAmount(e.target.value)}
                        data-id="alloted-amount"
                        name="alloted_amount"
                        style={{ minWidth: "100px" }}
                      />
                    </td>
                    {/* date of release */}
                    {/* <td className="text-end">
                      <input
                        className="form-control form-control-sm"
                        type="date"
                        min={
                          allotmentData.length > 0
                            ? format(
                                new Date(
                                  allotmentData[
                                    allotmentData.length - 1
                                  ]?.release_date
                                ),
                                "yyyy-MM-dd"
                              )
                            : format(subDays(new Date(), 30), "yyyy-MM-dd")
                        }
                        max={format(new Date(), "yyyy-MM-dd")}
                        placeholder="Enter allottment date"
                        value={allocatedDate}
                        onChange={(e) => setAllocatedDate(e.target.value)}
                        data-id="alloted-amount"
                        name="alloted_amount"
                        style={{ minWidth: "80px" }}
                      />
                    </td> */}
                    <td className="text-end">
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        placeholder="Enter remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        data-id="remarks"
                        name="remarks"
                        style={{ minWidth: "100px" }}
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm me-1"
                        title="Cancel"
                        disabled={isDisabled()}
                        onClick={resetForm}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        title="Save Record(s)"
                        disabled={isDisabled() || saved}
                        onClick={(e) =>
                          saveAllocatedAmount(
                            e,
                            Settings.isNationalUser() ? "State" : "District"
                          )
                        }
                      >
                        {saved ? <Btnloader /> :
                          <i className="bi bi-save"></i>}
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="fw-bold text-end" colSpan={6}>Total</td>
                    <td className="fw-bold text-end">
                      {Helper.accountFormat(totalAllotedAmount, 5)}
                    </td>
                    <td className="text-end fw-bold" colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
        <h1 style={{ display: "inline-block" }}>Fund Release</h1>
        <SelectedYear/>
        {/* <button className="btn btn-success float-end mb-2" disabled={!stateID}
          onClick={async() => {
            if(!!stateID){
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
                ); //or any other extension
                document.body.appendChild(link);
                link.click();
                setPdfbtnStatus(false);
              } catch (error) {
                console.error("Error:", error.message);
                setPdfbtnStatus(false);
              }
            }
          }}
        >
          Final PAB
        </button> */}
      </div>

      {Settings.isNotDistrictUser() && (
        <div
          className="dashboard-main-content-info mb-3 mt-3"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-12">
              <h6 className="text-white">LOCATION FILTER</h6>
              <div className="row">
                {Settings.isNationalUser() &&
                  stateList &&
                  stateList.length > 0 && (
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        name="state-list"
                        value={stateID}
                        onChange={handleChange}
                        disabled={stateList.find(
                          (state) => state.id === userData.user_state_id
                        )}
                      >
                        <option value={0}>--Select State--</option>
                        {[23].includes(userData.user_role_id)
                          ? stateList
                            .filter((item1) =>
                              userData?.state_ids?.some(
                                (item2) => item1?.id === item2?.id
                              )
                            )
                            .map((st, stidx) => (
                              <option key={`st_${stidx}`} value={st.id}>
                                {st.name}
                              </option>
                            ))
                          : stateList?.map((st, stidx) => (
                            <option key={`st_${stidx}`} value={st.id}>
                              {st.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                {Settings.isStateUser() &&
                  districtsList &&
                  districtsList.length > 0 && (
                    <div className="col-md-5">
                      <select
                        className="form-select"
                        name="district-list"
                        value={districtID}
                        onChange={handleChange}
                        disabled={districtsList.find(
                          (itm) => itm.district_id === userData.user_district_id
                        )}
                      >
                        <option value={0}>--Select District--</option>
                        {districtsList
                          .filter((x) => +x.district_state_id === +stateID)
                          ?.map((itm, idx) => (
                            <option key={`dt_${idx}`} value={itm.district_id}>
                              {itm.district_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!!stateID && (!!userData?.user_state_id ? !!+districtID : true) && (
        <div className="dashboard-main-content-info clear">
          {renderBudgetAllotmentData()}
        </div>
      )}

      <div className="dashboard-main-content-info mt-3 clear">
        <h6 className="text-end" style={{ color: "#2b4a91" }}>
          {" "}
          All (₹ In Lakhs)
        </h6>
        {Settings.isNationalUser() && (
          <>
            <div className="table-scroll-section">
              <table className="table-scroll padding-y-5m ">
                <thead>
                  <tr>
                    <th rowSpan={2}>State</th>
                    <th colSpan={5}>Approved</th>
                    <th colSpan={2}>Center Release</th>
                    <th colSpan={2}>State Release</th>
                    <th rowSpan={2}>Total Release</th>
                  </tr>
                  <tr>
                    <th>Recurring</th>
                    <th>Non-Recurring</th>
                    <th>Total</th>
                    <th>Center Share</th>
                    <th>State Share</th>
                    <th>Recuring </th>
                    <th>Non-Recuring </th> 
                    <th>Recuring </th>
                    <th>Non-Recuring </th>
                  </tr>
                </thead>
                <tbody>
                  {([23].includes(userData.user_role_id)
                    ? stateApprovedList.filter((item1) =>
                      userData?.state_ids?.some(
                        (item2) => +item1?.state_id === +item2?.id
                      )
                    )
                    : stateApprovedList
                  ).map((item) => {
                    return (
                      <tr className={stateID === item.state_id && "bg-success"}>
                        <td>{item?.state_name}</td>
                        <td className="text-end">
                          ₹{Helper.numberFormat(item?.recurring_financial, 5)}
                        </td>
                        <td className="text-end">
                          ₹
                          {Helper.numberFormat(item?.nonrecurring_financial, 5)}
                        </td>
                        <td className="text-end">
                          ₹{Helper.numberFormat(item?.total_approved, 5)}
                        </td>
                        <td className="text-end">
                          ₹{Helper.numberFormat(item?.central_share, 5)}
                        </td>
                        <td className="text-end">
                          ₹{Helper.numberFormat(item?.state_share, 5)}
                        </td>
                        {/* <td>{item?.recurring_receipt_from_own_state}</td>
                                    <td className="text-end">₹{item?.non_recurring_receipt_from_own_state}</td> */}
                        {/* center Release  */}
                        <td className="text-end">
                          ₹
                          {Helper.numberFormat(
                            item?.recurring_receipt_from_center,
                            5
                          )}
                        </td>
                        <td className="text-end">
                          ₹
                          {Helper.numberFormat(
                            item?.non_recurring_receipt_from_center,
                            5
                          )}
                        </td>
                        {/* state Release  */}
                        <td className="text-end">
                          ₹
                          {Helper.numberFormat(
                            item?.recurring_receipt_from_own_state,
                            5
                          )}
                        </td>
                        <td className="text-end">
                          ₹
                          {Helper.numberFormat(
                            item?.non_recurring_receipt_from_own_state,
                            5
                          )}
                        </td>
                        <td className="text-end">
                          ₹
                          {Helper.numberFormat(
                            +(+item?.non_recurring_receipt_from_own_state) +
                            +(item?.recurring_receipt_from_own_state) +
                            (+item?.non_recurring_receipt_from_center) +
                            (+item.recurring_receipt_from_center),
                            5
                          )}
                        </td>
                        {/* <td>{item?.recurring_release_from_own_state}</td>
                                    <td>{item?.non_recurring_release_from_own_state}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {Settings.isStateUser() && (
          <>
            <div className="table-scroll-section">
              <table className="table-scroll padding-y-5">
                <thead>
                  <tr>
                    <th rowSpan={2}>State</th>
                    <th colSpan={5}>Approved</th>
                    <th colSpan={2}>Center Receipt</th>
                    <th colSpan={2}>State Receipt</th>
                    <th colSpan={2}>State Release</th>
                  </tr>

                  <tr>
                    <th>Recuring</th>
                    <th>Non-Recurring</th>
                    <th>Total </th>
                    <th>Central Share</th>
                    <th>State Share</th>
                    <th>Recuring</th>
                    <th>Non-Recurring</th>
                    <th>Recuring</th>
                    <th>Non-Recurring</th>
                    <th>Recuring</th>
                    <th>Non-Recurring</th>
                  </tr>
                </thead>
                <tbody>
                  {stateApprovedList.map((item) => {
                    return (
                      <tr>
                        <td>{item?.state_name}</td>
                        <td className="text-end">
                          {Helper.numberFormat(item?.recurring_financial)}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(item?.nonrecurring_financial)}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(item?.total_approved)}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(item?.central_share)}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(item?.state_share)}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.recurring_receipt_from_center
                          )}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.non_recurring_receipt_from_center
                          )}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.recurring_receipt_from_own_state
                          )}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.non_recurring_receipt_from_own_state, 5
                          )}
                        </td>

                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.recurring_release_from_own_state
                          )}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.non_recurring_release_from_own_state
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="table-scroll-section mt-5">
              <table className="table-scroll padding-y-5">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>District / State(self) Name </th>
                    <th>District / State(self) Release Recurring </th>
                    <th>District / State(self) Release Non-Recurring </th>
                  </tr>
                </thead>
                <tbody>
                  {districtApprovedList.map((item, i) => {
                    return (
                      <tr
                        className={
                          districtID === item.district_id && "bg-success"
                        }
                      >
                        <td>{i + 1}</td>
                        <td>{item?.district_name}</td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.recurring_release_from_own_state
                          )}
                        </td>
                        <td className="text-end">
                          {Helper.numberFormat(
                            item?.non_recurring_release_from_own_state
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FundRelease;
