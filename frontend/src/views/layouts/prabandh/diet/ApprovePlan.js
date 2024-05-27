import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { Helper, Hook, API } from "../../../../apps";
import features from "../../../../redux/features";
import NumberInput from "../../../../apps/components/form/NumberInput";
import Btnloader from "../../../../apps/components/elements/Btnloader";
import exportToExcel from "../PrabandhReports/ExcelReports";

export default function ApprovePlan() {
    const user = Helper.auth.user;
    const [deletes, setDeletes] = useState([]);
    const [stateID, setStateID] = useState(user?.user_state_id || 0);
    const [diet_id, setDiet_id] = useState(0);
    const [alldata, setAllData] = useState(null);
    const [activity_status, setActivity_status] = useState(0);
    const [dietList, setDietList] = useState(null);
    const [workingRow, setWorkingRow] = useState({});
    const [prevData, setPrevData] = useState({})
    const [approveLoader, setApproveLoader] = useState(false)
    const stateList = Hook.useStates();
    const handler = useSelector((state) => state.handler);

    const dispatch = useDispatch();

    let rows = [];
    const handleCheckbox = (e, id) => {
        if (e.target.checked) {
            setDeletes((prevState) => {
                return [...prevState, id];
            });
        } else {
            setDeletes((prevState) => {
                return prevState.filter((p) => p !== id);
            });
        }
    };

    const getDietList = () => {
        API.post(
            "api/prabandh/approved-diet-list",
            { state_id: stateID },
            (res) => {
                if (res.status) {
                    setAllData(null)
                    setDietList(res.data)
                }
            }
        );
    }
    const getDIETActivity = () => {
        API.post(
            "api/prabandh/approved-diet-activity-list",
            { diet_id },
            (res) => {
                if (res.status) {
                    setAllData(res.data)
                    setActivity_status(res.activity_status)
                }
                setWorkingRow({ id: 0 });
            }
        );
    }
    useEffect(() => {
        +stateID && getDietList();
    }, [stateID])
    useEffect(() => {
        $(".need_hide_footer").hide();
        if (alldata) {
            const ids =
                alldata &&
                alldata?.data &&
                alldata?.data?.filter((c) => +c?.approved_plan_asset_selection === 1);
            const id = ids?.map((c) => c.id);
            setDeletes(id);
        }
    }, [alldata]);
    if (alldata) {
        rows =
            alldata &&
            alldata?.data &&
            alldata?.data?.map((row, i) => {
                return {
                    srl: Helper.counter(++i, handler.limit, handler.page),
                    scheme_name: row.scheme_name,
                    school_name: row.major_component_name,
                    district_name: row.sub_component_name,
                    physical_quantity: row.activity_master_name,
                    financial_amount: row.activity_master_details_name,
                    action: (
                        <div className="text-center">
                            <div className="text-center">
                                <input
                                    className="form-check-input"
                                    // disabled={+status === 6}
                                    checked={deletes?.includes(row.id)}
                                    style={{ border: "1px solid black" }}
                                    type="checkbox"
                                    value=""
                                    id="flexCheckChecked"
                                    onChange={(e) => handleCheckbox(e, row.id)}
                                />
                            </div>
                        </div>
                    ),
                };
            });
    }
    // const handleCheckboxAll = (e) => {
    //     if (e.target.checked) {
    //         const ids = alldata?.data.map((c) => c.id);
    //         setDeletes(ids);
    //     } else {
    //         setDeletes([]);
    //     }
    // };

    const updateState = (e) => {
        setAllData(null)
        setStateID(e.target.value || 0);
    };
    const handleUpdateDiet = (e) => {
        setAllData(null)
        setDiet_id(e.target.value || 0);
    };
    const handleShowData = () => {
        getDIETActivity();
    }

    const saveHandler = () => {
        API.post(
            "api/prabandh/update-diet-approve-plan",
            { ...workingRow, diet_id: diet_id },
            (data) => {
                if (data.status) {
                    dispatch(features.showToast({ message: data.message }));
                    setWorkingRow({ id: 0 });
                }
            }
        );
    }

    const handleApprove = () => {
        setApproveLoader(true)
        API.post("api/prabandh/submit-approved-diet-plan",
            { diet_id: diet_id , state_id: stateID},
            (res) => {
                setApproveLoader(false)
                if (res.status) {
                    getDIETActivity();
                    dispatch(features.showToast({ message: res.message }));
                }
                dispatch(
                    features.makeHandler({
                        reload: new Date().getTime(),
                        where: "",
                    })
                );
            }
        );
    }

    const exportTableToExcel = async () => {
        exportToExcel("byTableHtml", {
            skipColumn: [8],
            reportData: alldata,
            table: $(".table-scroll"),
            fileName: "Recommendation_DIET_Plan",
            sheetName: "Sheet 1",
            report_header: `Recommendation DIET Plan, State: ${$("select[name='state-list']").find("option:selected").text()},  Diet: ${$("select[name='diet-list']").find("option:selected").text()}`,
        });
    };

    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
                <h1>Recommendation DIET Plan</h1>
                <button
                    type="button"
                    className="btn btn-success float-end mx-2"
                    onClick={exportTableToExcel}
                    disabled={alldata?.data?.length}
                    >
                    <i className="bi bi-file-earmark-excel"></i>{" "}
                    <span className="mobile-hide">Export To</span> Excel
                </button>
            </div>
            <div className="dashboard-main-content-info mb-3">
                <div className="row ">
                    <div className="col-md-3">
                        <label>Select State</label>
                        <select className="form-select" name="state-list"
                            value={stateID}
                            disabled={user.user_state_id}
                            onChange={updateState}>

                            <option value="0">--Select State--</option>
                            {stateList && stateList?.length > 0 && stateList?.map((st, stidx) => {
                                return (
                                    <option key={`st_${stidx}`} value={st.id}>
                                        {st.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>Select Diet</label>
                        <select className="form-select" name="diet-list" value={diet_id} disabled={!+stateID} onChange={handleUpdateDiet}>

                            <option value="0">--Select Diet--</option>
                            {dietList && dietList?.length > 0 && dietList?.map((st, stidx) => {
                                return (
                                    <option key={`st_${stidx}`} value={st.diet_id}>
                                        {st.diet_name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-1" style={{ display: "flex", alignItems: "flex-end" }}>
                        <button className="btn btn-primary" disabled={!+stateID || !+diet_id} onClick={handleShowData}>Show</button>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-content-info" >
                <div className="row">
                    <div className="col-4">
                    </div>
                    <div className="col-4 text-center">
                        {+activity_status<6 ? <h6 className="bg-warning p-2 border rounded" >DIET plan not Configured or Approved yet</h6>
                        : (alldata?.length > 0 && +alldata[0]?.status === 6 && <h6 className="bg-warning p-2 border rounded" >DIET Plan Approved</h6>)}
                    </div>
                    <div className="col-4">
                        <h6 className="text-end" style={{ color: "#2b4a91" }}>{" "} (All ₹ In Lakhs)</h6>
                    </div>

                    <div className="table-scroll-section">
                        <table className="table-scroll">
                            <thead>
                                <tr>
                                    <th rowSpan={2}>S. No.</th>
                                    <th rowSpan={2}>Activity Master Detail</th>
                                    <th colSpan={3}>Proposed</th>
                                    <th colSpan={3}>Recommended</th>
                                    {+activity_status===6 && <th rowSpan={2} style={{ width: "122px" }}>Action</th>}
                                </tr>
                                <tr>
                                    <th>Physical</th>
                                    <th>Unit Cost</th>
                                    <th>Financial</th>
                                    <th>Physical</th>
                                    <th>Unit Cost </th>
                                    <th>Financial</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alldata === null ? "" : alldata?.length === 0 ? <tr>
                                    <td colSpan={8} style={{ textAlign: "center" }}>No Data Found</td>
                                </tr> : alldata?.map((diet, i) =>
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>{diet.activity_master_details_name}</td>
                                        <td>
                                            <NumberInput defaultValue={diet["proposed_quantity"] || 0} disabled name="proposed_quantity"
                                                decimal={false}
                                            />
                                        </td>
                                        <td>
                                            <NumberInput defaultValue={diet["proposed_unit_cost"] || 0} disabled />
                                        </td>
                                        <td>
                                            <NumberInput defaultValue={diet["proposed_financial_amount"] || 0} disabled />
                                        </td>
                                        <td>
                                            <NumberInput defaultValue={diet["recomended_quantity"] || 0} disabled={workingRow.id !== diet.id} decimal={false}
                                                currentValue={diet["recomended_quantity"] || 0}
                                                name="recomended_quantity"
                                                onChange={(e) => {
                                                    setWorkingRow((prevState) => {
                                                        return {
                                                            ...prevState,
                                                            recomended_financial_amount: (+e.target.value || 0) * (prevState.recomended_unit_cost || 0),
                                                            [e.target.name]: e.target.value || 0
                                                        }
                                                    })
                                                    setAllData((prevState) => {
                                                        prevState[i] = {
                                                            ...prevState[i],
                                                            recomended_financial_amount: ((+e.target.value || 0) * (prevState[i].recomended_unit_cost || 0))?.toFixed(5),
                                                            [e.target.name]: e.target.value
                                                        }
                                                        return [...prevState];
                                                    })
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <NumberInput defaultValue={diet["recomended_unit_cost"] || 0} disabled={workingRow.id !== diet.id}
                                                name="recomended_unit_cost"
                                                currentValue={diet["recomended_unit_cost"] || 0}
                                                onChange={(e) => {
                                                    setWorkingRow((prevState) => {
                                                        return {
                                                            ...prevState,
                                                            recomended_financial_amount: (+e.target.value || 0) * (prevState.recomended_quantity || 0),
                                                            [e.target.name]: e.target.value || 0
                                                        }
                                                    })

                                                    setAllData((prevState) => {
                                                        prevState[i] = {
                                                            ...prevState[i],
                                                            recomended_financial_amount: ((+e.target.value || 0) * (prevState[i].recomended_quantity || 0))?.toFixed(5),
                                                            [e.target.name]: e.target.value
                                                        }
                                                        return [...prevState];
                                                    })
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <NumberInput currentValue={parseFloat(diet["recomended_financial_amount"] || 0)?.toFixed(5)} disabled name="recomended_financial_amount"
                                                value={diet["recomended_financial_amount"] || 0}
                                                onChange={(e) => {
                                                    setWorkingRow((prevState) => {
                                                        return {
                                                            ...prevState,
                                                            [e.target.name]: e.target.value
                                                        }
                                                    })
                                                }}
                                            />
                                        </td>
                                        {+activity_status===6 && <td>
                                            {workingRow.id !== diet.id ? <button className="btn btn-success btn-sm" title="Save Record(s)" disabled={+diet.status === 6}
                                                onClick={() => { setWorkingRow({ ...diet }); setPrevData(diet); }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button> :
                                                <>
                                                    <button className="btn btn-danger btn-sm me-1" title="Cancel"
                                                        onClick={() => {
                                                            setWorkingRow({ id: 0 });
                                                            setAllData(prevAllData => {
                                                                const index = prevAllData.findIndex(c => c.id === diet.id);
                                                                if (index !== -1) {
                                                                    const updatedData = [...prevAllData];
                                                                    updatedData.splice(index, 1, prevData);
                                                                    return updatedData;
                                                                }
                                                                return prevAllData;
                                                            });
                                                        }}>
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                    <button className="btn btn-success btn-sm" title="Save Record(s)"
                                                        onClick={saveHandler}
                                                    >
                                                        <i className="bi bi-save"></i>
                                                    </button>
                                                </>}
                                        </td>}
                                    </tr>)}
                            </tbody>
                            {alldata?.length > 0 && <tfoot>
                                <tr>
                                    <th colSpan={2} className="text-end">Total</th>
                                    <th className="text-end">
                                        {alldata?.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                parseFloat(currentValue.proposed_quantity || 0),
                                            0
                                        )}
                                    </th>
                                    <th className="text-end" colSpan={2}>
                                        {alldata?.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                parseFloat(currentValue.proposed_financial_amount || 0),
                                            0
                                        )}
                                    </th>
                                    <th className="text-end">
                                        {alldata?.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                parseFloat(currentValue.recomended_quantity || 0),
                                            0
                                        )}
                                    </th>
                                    <th className="text-end" colSpan={2}>
                                        {alldata?.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                parseFloat(currentValue.recomended_financial_amount || 0),
                                            0
                                        ).toFixed(5)}
                                    </th>
                                    {+activity_status===6 && <th className="text-end"></th>}
                                </tr>
                            </tfoot>}
                        </table>
                    </div>
                    {+activity_status===6 && alldata?.length > 0 && <div className="text-end">
                        <button className="btn btn-primary float-end ms-3 mt-3" disabled={+alldata[0]?.status === 6} onClick={handleApprove} style={{ marginRight: "5px", width: "100px" }}>
                            {approveLoader ? <Btnloader /> : "Approve"}
                        </button>
                    </div>}
                </div>
            </div>
        </div >
    );
}
