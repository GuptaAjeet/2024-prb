import React, {useEffect, useRef, useState } from "react";
import { Helper, Settings, API, Hook, Column } from "../../../apps";
import "../prabandh/spill.css";
import sweetAlert from "../../../apps/utilities/sweetalert";
import { format } from "date-fns";
import { REACT_APP_URL } from "../../../env";
import axios from "axios";
import store from "../../../redux/app/store";
import SelectedYear from "./SelectedYear";

const FundReceipt = () => {
    let userData = Helper.auth?.user;
    const stateList = Hook.useStates();
    const [approvedBudgetData, setApprovedBudgetData] = useState({
        approvedAmount: 100000000.00000,
        centerShare: 70000000.00000,
        stateShare: 30000000.00000
    });
    const [spin, setSpin] = useState(false);
    const [displayAllotmentData, setDisplayAllotmentData] = useState(false);
    const [districtID, setDistrictID] = useState(userData?.user_district_id || 0);
    const [allotmentData, setAllotmentData] = useState([]);
    const [allotedStateData, setAllotedStateData] = useState([]);
    const [allocatedAmount, setAllocatedAmount] = useState(0);
    const [installmentNumber, setInstallmentNumber] = useState(allotmentData?.length + 1 || 1);
    const [recurringNonRecurring, setRecurringNonRecurring] = useState(1);
    const [allocatedDate, setAllocatedDate] = useState('');
    const [sensionOrderDate, setSensionOrderDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [totalAllotedAmountFromCenter, setTotalAllotedAmountFromCenter] = useState(0);
    const [totalAllotedAmountFromState, setTotalAllotedAmountFromState] = useState(0);
    const [refresh, setRefresh] = useState(Date.now())
    const inputFile = useRef();
    const [file, setFile] = useState("")
    const [sessionNumber, setSessionNumber] = useState();
    const [stateApprovedList, setStateApprovedList] = useState([]);
    const [sactionorminDate, setSanctionorminDate] = useState();

    const stateID = userData?.user_state_id || 0;
    const stateName = stateList?.filter((c) => +c.id === +stateID);
    // const installmentsArray = [
    //     { installment_number: 1, value: 1 },
    //     { installment_number: 2, value: 2 },
    //     { installment_number: 3, value: 3 },
    //     { installment_number: 4, value: 4 },
    //     { installment_number: 5, value: 5 },
    // ]

    useEffect(() => {
        if (Settings.isStateApproverUser()) {
            API.post("api/budget/get-allocations", { state_id: stateID, alloted_to: 'State' }, (res) => {
                setAllotmentData(res.data ? res.data.filter(x => x.alloted_from === 'Center') : []);

                const maxDate = (res.data ? res.data.filter(x => x.alloted_from === 'Center') : [])?.reduce((max, obj) => {
                    const currentDate = new Date(obj.sension_order_date);
                    return currentDate > max ? currentDate : max; 
                }, new Date(res.data[0]?.sension_order_date));
                if (maxDate instanceof Date && !isNaN(maxDate)) {
                    setSanctionorminDate(maxDate?.toISOString()?.slice(0, 10));
                }

                setAllotedStateData(res.data ? res.data.filter(x => x.alloted_from === 'State') : []);
                setDisplayAllotmentData(approvedBudgetData.approvedAmount && stateID !== 0 ? true : false);
                setSpin(false);
                setInstallmentNumber((res.data ? res.data.filter(x => x.alloted_from === 'State') : []).length + 1 || 1);
            });

            // API.post("api/budget/get-state-alloted-budget", { state_id: stateID }, (res) => {
            //     setApprovedBudgetData(res.data);
            //     setSpin(false);
            // });

            API.post("api/budget/get-state-approved-budget", { state_id: +stateID, year_id: 9 }, (res) => {
                setApprovedBudgetData(res.data);
                setSpin(false);
            });
        }
    }, [stateID, refresh])

    useEffect(() => {
        if (Settings.isDistrictApproverUser()) {
            API.post("api/budget/get-allocations", { district_id: districtID, alloted_to: 'District' }, (res) => {
                setAllotmentData(res.data ? res.data : []);
                setDisplayAllotmentData(approvedBudgetData.approvedAmount && districtID != 0 ? true : false);
                setSpin(false);
            });
        }
    }, [districtID, refresh])

    useEffect(() => {
        setTotalAllotedAmountFromCenter(allotmentData.reduce((prev, next) => +prev + +next.released_amount, 0))
        setTotalAllotedAmountFromState(allotedStateData.reduce((prev, next) => +prev + +next.released_amount, 0))
    }, [allotmentData, allotedStateData])


    useEffect(() => {
        getStateApprovedList()
    }, [])

    const getStateApprovedList = () => {
        API.post("api/budget/state-approved-list", { state_id: userData?.user_state_id }, (res) => {
            setStateApprovedList(res.data);
        });
    }

    const approveAllocatedAmount = (id) => {
        API.post("api/budget/approve",
            {
                id: id,
                data: {
                    is_approved: true,
                    approved_by: userData.id,
                    transaction_type: Settings.isStateUser() ? 1 : 2,
                    approved_date: format(new Date(), 'yyyy-MM-dd')
                }
            }, (res) => {
                sweetAlert.done({ msg: "Data saved successfully." });
                setRefresh(Date.now());
            });
    }

    const saveAllocatedAmount = () => {
        if (Settings.isStateApproverUser() && +approvedBudgetData[0]?.state_share < (+totalAllotedAmountFromState + +allocatedAmount)) {
            sweetAlert.warning("Allocated amount sum should not exceed the State Share.");
        } else if (allotedStateData.length > 0 && installmentNumber <= allotedStateData[allotedStateData.length - 1].installment_number) {
            sweetAlert.warning("Installment number should be greater than previous installment number.");
        } else {
            const formData = new FormData();

            formData.append("alloted_to", 'State');
            formData.append("transaction_type", 1);
            formData.append("alloted_by", userData.id);
            formData.append("state_id", stateID);
            formData.append("district_id", districtID);
            formData.append("approved_amount", approvedBudgetData?.length && approvedBudgetData[0].total_approved);
            formData.append("released_amount", allocatedAmount);
            formData.append("sension_number", sessionNumber);
            formData.append("file", inputFile.current.files[0]);
            formData.append("installment_number", installmentNumber);
            formData.append("recurring_non_recurring", recurringNonRecurring);
            formData.append("release_date", allocatedDate);
            formData.append("sension_order_date", sensionOrderDate);
            formData.append("is_approved", true);
            formData.append("approved_by", userData.id);
            formData.append("approved_date", allocatedDate);
            formData.append("remarks", remarks);
            formData.append("alloted_from", 'State');

            
            axios.post(`${REACT_APP_URL}api/budget/allot`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        API_Year: store.getState().year.year,
                        Authorization: `Bearer ${Helper.token()}`
                    },
                })
                .then(function (response) {
                    if (response?.status === 200) {
                        setAllocatedAmount('');
                        setSessionNumber('');
                        setSensionOrderDate('');
                        setFile('');
                        setRemarks('');
                        sweetAlert.done({ msg: "Data saved successfully." });
                        setRefresh(Date.now());
                        resetForm();
                    }
                })
                .catch(function (error) { });
            // API.post("api/budget/allot",
            //     {
            //         alloted_to: 'State',
            //         alloted_by: userData.id,
            //         state_id: stateID,
            //         district_id: districtID,
            //         approved_amount: approvedBudgetData.approvedAmount,
            //         released_amount: allocatedAmount,
            //         installment_number: installmentNumber,
            //         release_date: allocatedDate,
            //         is_approved: true,
            //         approved_by: userData.id,
            //         approved_date: allocatedDate,
            //         remarks: remarks,
            //         alloted_from: 'State'
            //     }, (res) => {
            //         sweetAlert.done({ msg: "Data saved successfully." });
            //         setRefresh(Date.now());
            //         resetForm();
            //     });
        }
    }

    const resetForm = () => {
        setAllocatedAmount(0);
        // setInstallmentNumber(allotmentData?.length+1 || 1);
        setAllocatedDate('');
        setSensionOrderDate('');
        setRemarks('');
    }
    const validateFileType = (file) => {
        // Define the allowed file types
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png'
        ];
        // Check if the file type is allowed
        return allowedTypes.includes(file.type);
    };
    const fileChange = (e) => {
        if (e.target.files[0]) {
            if (!validateFileType(e.target.files[0])) {
                sweetAlert.warning("Invalid file type. Please upload a valid file.");
            } else {
                setFile(e.target.files[0])
            }
        }
    }
    const isDisabled = () => {
        if (allocatedAmount === 0 || installmentNumber === 0 || remarks === '' || !sessionNumber || !file?.name || sensionOrderDate === '') {
            return true;
        } else {
            return false;
        }
    }

    const handleDownloadFile = async (tr) => {
        const name = tr.installment_doc.split("/").pop();
        const pdfUrl = `${REACT_APP_URL}api/budget/downloadfile/${tr?.id}`;

        try {
            const response = await axios.get(pdfUrl, {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/pdf/xlsx",
                    Authorization: `Bearer ${Helper.token()}`
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

    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
                <h1 style={{ display: "inline-block" }}>Fund Receipt</h1>
                <SelectedYear />
            </div>

            <div className="dashboard-main-content-info">
                <h6 className="text-end" style={{ color: "#2b4a91" }}>
                    {" "}
                    All (₹ In Lakhs)
                </h6>
                {Settings.isStateUser() && <div className="table-scroll-section mb-5">
                    <table className="table-scroll padding-y-5">
                        <thead>
                            <tr>
                                <th rowSpan={2}>State</th>
                                <th colSpan={5}>Approved</th>
                                <th colSpan={2}>Center Receipt</th>
                                <th colSpan={2}>State Receipt</th>
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
                            {stateApprovedList.map(item => {
                                return <tr>
                                    <td>{item?.state_name}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.recurring_financial, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.nonrecurring_financial, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.total_approved, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.central_share, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.state_share, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.recurring_receipt_from_center, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.non_recurring_receipt_from_center, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.recurring_receipt_from_own_state, 5)}</td>
                                    <td className="text-end">{Helper.numberFormat(item?.non_recurring_receipt_from_own_state, 5)}</td>
                                </tr>
                            })}

                        </tbody>
                    </table>
                </div>}

                {/* {Settings.isStateApproverUser() && <div className="row mb-3 mx-1">
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

                {Settings.isNotNationalUser() && allotmentData.length > 0 &&
                    <div className="row mb-3">
                        <div className="table-scroll-section">
                            <table className="table-scroll">
                                <thead>
                                    <tr>
                                        <th colSpan={10}>Received Fund From {Settings.isStateUser() ? 'Center' : 'State'}</th>
                                    </tr>
                                    <tr>
                                        {Column.allotedBudget().map((itm, idx) => {
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
                                    {allotmentData.map((itm, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1}.</td>
                                                {/* <td className="text-end">₹ {itm?.approved_amount}</td> */}
                                                <td className="text-center">{itm?.sension_number}</td>
                                                <td className="text-center">{itm?.sension_order_date?.split('-').reverse().join('-')}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-success btn-sm" title={itm?.installment_doc?.split("/").pop()} onClick={() => handleDownloadFile(itm)}>
                                                        <i className="bi bi-file-earmark-arrow-down"></i> Download
                                                    </button>
                                                </td>
                                                <td className="text-center">{itm?.installment_number}</td>
                                                <td>
                                                    {itm?.recurring_non_recurring === 1 ? "Recurring" : "Non Recurring"}
                                                </td>
                                                <td className="text-end">{Helper.accountFormat(itm?.released_amount, 5)}</td>

                                                {/* <td className="text-center">{itm?.release_date?.split('-').reverse().join('-')}</td> */}
                                                {/* <td>{itm?.is_approved === true ? Model.approve[Settings.isStateApproverUser() ? 'state' : 'district'] : "Pending"}</td>
                                                <td>{itm?.is_approved !== true && <button className="btn btn-success btn-sm me-2" onClick={e => approveAllocatedAmount(itm?.id)}>Accept</button>}</td> */}
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="fw-bold text-end" colSpan={6}>Total</td>
                                        <td className="text-end fw-bold">{Helper.accountFormat(totalAllotedAmountFromCenter, 5)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                }

                {Settings.isStateApproverUser() && <div className="row">
                    <div className="table-scroll-section">
                        <table className="table-scroll">
                            <thead>
                                <tr>
                                    <th colSpan={10}>Receive Fund From {stateName && stateName.length > 0 ? `State (${stateName[0].name})` : ''}</th>
                                </tr>
                                <tr>
                                    {Column.receivedAllotment().map((itm, idx) => {
                                        let data = Object.values(itm)
                                        return (
                                            <th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {allotedStateData.length > 0 && <>
                                    {allotedStateData.map((itm, idx) => {
                                        return (
                                            <tr>
                                                <td>{idx + 1}.</td>
                                                <td className="text-center">{itm?.sension_number}</td>
                                                <td className="text-center">{Helper.dateFormate(itm?.sension_order_date)}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-success btn-sm" title={itm?.installment_doc?.split("/").pop()} onClick={() => handleDownloadFile(itm)}>
                                                        <i className="bi bi-file-earmark-arrow-down"></i>
                                                    </button>
                                                </td>
                                                <td className="text-end"> {itm?.installment_number}</td>
                                                <td>
                                                    {itm?.recurring_non_recurring === 1 ? "Recurring" : "Non Recurring"}
                                                </td>
                                                {/* <td className="text-center">
                                                    {itm?.release_date
                                                        ?.split("-")
                                                        .reverse()
                                                        .join("-")}
                                                </td> */}
                                                <td className="text-end">{Helper.accountFormat(itm?.released_amount, 5)}</td>
                                                <td>{itm?.remarks}</td>
                                                <td></td>
                                            </tr>
                                        )
                                    })
                                    }
                                </>}
                                <tr>
                                    <td>{allotedStateData.length > 0 ? allotedStateData.length + 1 : 1}.</td>
                                    
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

                                            onKeyDown={e=>e.preventDefault()}
                                            min={
                                                sactionorminDate
                                                // allotmentData.length > 0 ? format(new Date(allotmentData[allotmentData.length - 1]?.release_date), 'yyyy-MM-dd') : format(subDays(new Date(), 30), 'yyyy-MM-dd')
                                            }
                                            max={format(new Date(), 'yyyy-MM-dd')}
                                            value={sensionOrderDate}
                                            onChange={(e) => setSensionOrderDate(e.target.value)}
                                            data-id="Sanction-order-date"
                                            name="sension_order_date"
                                            style={{ minWidth: "80px" }}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <label htmlFor={`file_0`} className="btn btn-primary btn-sm" title="Upload Document(s)">
                                            <i className="bi bi-file-earmark-arrow-up"></i>  {file.length !== 0 ? "selected" : "Upload"}
                                        </label>
                                        <input type="file" id={`file_0`} style={{ display: "none" }} ref={inputFile} onChange={fileChange} />
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
                                    </td>
                                    <td className="text-end">
                                        <select
                                            className="form-select"
                                            name="installment-type"
                                            value={recurringNonRecurring}
                                            onChange={e => setRecurringNonRecurring(e.target.value)}
                                        >
                                            <option value={1}>Recurring</option>
                                            <option value={2}>Non Recurring</option>
                                        </select>
                                    </td>
                                    {/* <td className="text-end">
                                        <input
                                            className="form-control form-control-sm"
                                            type="date"
                                            min={allotedStateData.length > 0 ? format(new Date(allotedStateData[allotedStateData.length - 1]?.release_date), 'yyyy-MM-dd') : format(subDays(new Date(), 30), 'yyyy-MM-dd')}
                                            max={format(new Date(), 'yyyy-MM-dd')}
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
                                        <button className="btn btn-danger btn-sm me-1" title="Cancel" disabled={isDisabled()} onClick={resetForm}>
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                        <button className="btn btn-success btn-sm" title="Save Record(s)" disabled={isDisabled()} onClick={saveAllocatedAmount}>
                                            <i className="bi bi-save"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="fw-bold text-end" colSpan={6}>Total</td>
                                    <td className="fw-bold text-end">{Helper.accountFormat(totalAllotedAmountFromState, 5)}</td>
                                    <td className="text-end fw-bold" colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default FundReceipt;