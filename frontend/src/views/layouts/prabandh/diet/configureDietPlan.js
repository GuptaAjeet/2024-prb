import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { Column, Helper, Hook, Table, API, sweetAlert } from "../../../../apps";
import features from "../../../../redux/features";
import { Spinner } from "react-bootstrap";
import Btnloader from "../../../../apps/components/elements/Btnloader";
import exportToExcel from "../PrabandhReports/ExcelReports";
import NumberInput from "../../../../apps/components/form/NumberInput";

export default function ConfigureDietPlan() {
    const user = Helper.auth.user;
    const [deletes, setDeletes] = useState([]);
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);
    const [stateID, setStateID] = useState(0);
    const [diet_id, setDiet_id] = useState(user?.diet_id || 0);
    const [alldata, setAllData] = useState(null);
    const [dietList, setDietList] = useState(null);
    const [saveLoader, setSaveLoader] = useState(false)
    const [approveLoader, setApproveLoader] = useState(false)
    const stateList = Hook.useStates();
    const handler = useSelector((state) => state.handler);
    const dispatch = useDispatch();

    let rows = [];
    const handleCheckbox = (e, row) => {
        if (e.target.checked) {
            setDeletes((prevState) => {
                return [...prevState, { prb_ann_wrk_pln_bdgt_data_physical_asset_id: row.prb_ann_wrk_pln_bdgt_data_physical_asset_id, quantity: 0, financial_quantity: 0, unit_cost: 0 }];
            });
        } else {
            setDeletes((prevState) => {
                return prevState.filter((p) => p.prb_ann_wrk_pln_bdgt_data_physical_asset_id !== row.prb_ann_wrk_pln_bdgt_data_physical_asset_id);
            });
        }
    };
    const getDietList = () => {
        API.post(
            "api/prabandh/diet-list",
            { state_id: stateID },
            (res) => {
                if (res.status) {
                    setAllData(null)
                    setDietList(res.data)
                }
            }
        );
    }
    const getDietAtivity = () => {
        setLoading(true)
        API.post(
            "api/prabandh/diet-activity-list",
            { state_id: stateID, diet_id },
            (res) => {
                if (res.status) {
                    setAllData(res)
                    setStatus(res.activity_status)
                }
                setLoading(false)
            }
        );
    }
    const handleChange = (e) => {
        const { id, name, value } = e.target;
        let updated = deletes.filter(c => c.prb_ann_wrk_pln_bdgt_data_physical_asset_id === id);
        const index = deletes.findIndex(c => +c.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +id);
        if (name === "quantity") {
            updated = { prb_ann_wrk_pln_bdgt_data_physical_asset_id: updated[0]?.prb_ann_wrk_pln_bdgt_data_physical_asset_id, financial_quantity: (updated[0]?.unit_cost * value)?.toFixed(5), quantity: (value||0), unit_cost: updated[0]?.unit_cost }
        } else if (name === "unit_cost") {
            updated = { prb_ann_wrk_pln_bdgt_data_physical_asset_id: updated[0].prb_ann_wrk_pln_bdgt_data_physical_asset_id, financial_quantity: (updated[0].quantity * value)?.toFixed(5), unit_cost: (value||0), quantity: updated[0].quantity }
        } else {
            updated = { prb_ann_wrk_pln_bdgt_data_physical_asset_id: updated[0]?.prb_ann_wrk_pln_bdgt_data_physical_asset_id, financial_quantity: value, quantity: updated[0]?.quantity, unit_cost: updated[0]?.unit_cost }
        }
        const updates = [...deletes];
        updates.splice(index, 1);
        updates.push(updated);
        setDeletes(updates);
    }
    useEffect(() => {
        +stateID && getDietList();
    }, [stateID])
    useEffect(() => {
        $(".need_hide_footer").hide();
        if (alldata) {
            const ids = alldata && alldata?.data && alldata?.data?.filter((c) => +c?.applicable_yn === 1);
            const prb_ann_wrk_pln_bdgt_data_physical_asset_id = ids?.map((c) => ({ prb_ann_wrk_pln_bdgt_data_physical_asset_id: c.prb_ann_wrk_pln_bdgt_data_physical_asset_id, quantity: c.quantity, financial_quantity: c.financial_quantity, unit_cost: c.unit_cost }));
            setDeletes(prb_ann_wrk_pln_bdgt_data_physical_asset_id);
        }
    }, [alldata]);
    useEffect(() => {
        if (user?.user_state_id) {
            setStateID(user?.user_state_id)
        }
        if (user?.diet_id) {
            setDiet_id(user?.diet_id)
            API.post(
                "api/prabandh/diet-activity-list",
                { state_id: user?.user_state_id, diet_id: user?.diet_id },
                (res) => {
                    if (res.status) {
                        setAllData(res)
                        setStatus(res.activity_status)
                    }
                    setLoading(false)
                }
            );
        }
    }, [])
    
    if (alldata) {
        rows = alldata && alldata?.data && alldata?.data?.map((row, i) => {
            return {
                srl: Helper.counter(++i, handler.limit, handler.page),
                sub_component_name: row.sub_component_name,
                activity_master_name: row.activity_master_name,
                activity_master_details_name: row.activity_master_details_name,
                quantity: <div className="text-center">
                    <div className="text-center">

                        <NumberInput
                            decimal={false}
                            defaultValue={row?.quantity === null ? 0 : row?.quantity}
                            placeholder="Enter quantity"
                            id={row.prb_ann_wrk_pln_bdgt_data_physical_asset_id}
                            currentValue={deletes?.some(item => +item.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id) ? deletes.find(c => +c.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id)?.quantity : 0}
                            name="quantity"
                            onChange={handleChange}
                            disabled={!deletes?.some(item => item?.prb_ann_wrk_pln_bdgt_data_physical_asset_id === row?.prb_ann_wrk_pln_bdgt_data_physical_asset_id) || alldata?.activity_status === 6}
                        />
                    </div>
                </div>,
                unit_cost: <div className="text-center">
                    <div className="text-center">
                        <NumberInput
                            decimal={true}
                            id={row.prb_ann_wrk_pln_bdgt_data_physical_asset_id}
                            name="unit_cost"
                            aria-describedby="unit_cost"
                            disabled={!deletes?.some(item => item.prb_ann_wrk_pln_bdgt_data_physical_asset_id === row.prb_ann_wrk_pln_bdgt_data_physical_asset_id) || alldata?.activity_status === 6}
                            currentValue={deletes?.some(item => +item.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id) ? (deletes.find(c => +c.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id)?.unit_cost) : 0}
                            placeholder="Enter unit quantity"
                            defaultValue={row?.unit_cost === null ? 0 : row?.unit_cost}
                            onChange={handleChange}
                        />
                    </div>
                </div>,
                financial_quantity: <div className="text-center">
                    <div className="text-center">
                        <input type="number"
                            className="form-control text-end"
                            id={row.prb_ann_wrk_pln_bdgt_data_physical_asset_id}
                            name="financial_quantity"
                            aria-describedby="financial_quantity"
                            value={
                                deletes?.some(item => +item.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id) ? 
                                deletes.find(c => +c.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id)?.financial_quantity : 
                                0}
                            disabled
                            placeholder="Enter Financial quantity"
                        />
                        
                    </div>
                </div>,
                action: (
                    <div className="text-center">
                        <div className="text-center">
                            <input className="form-check-input" disabled={+alldata?.activity_status === 6}
                                checked={deletes?.some(item => +item.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id)}
                                style={{ border: "1px solid black" }} type="checkbox" value="" id="flexCheckChecked"
                                defaultChecked={deletes?.some(item => +item.prb_ann_wrk_pln_bdgt_data_physical_asset_id === +row.prb_ann_wrk_pln_bdgt_data_physical_asset_id)}
                                onChange={(e) => handleCheckbox(e, row)}
                            />
                        </div>
                    </div>
                ),
            };
        });
    }
    const handleCheckboxAll = (e) => {
        if (e.target.checked) {
            const ids = alldata?.data.map((c) => ({ prb_ann_wrk_pln_bdgt_data_physical_asset_id: c.prb_ann_wrk_pln_bdgt_data_physical_asset_id, quantity: c.quantity, financial_quantity: c.financial_quantity, unit_cost: c.unit_cost }));
            setDeletes(ids);
        } else {
            setDeletes([]);
        }
    };

    const handleSave = () => {
        if(deletes.find(ite=> parseFloat(ite.financial_quantity||0)===0)){
            sweetAlert.confirmation({
                title: "Are you sure?",
                msg: `You want to save these records. Some of them have no values.`,
                yesBtnText: "Yes",
                noBtnText: "No",
                url: "",
                callback: () => afterConfirmHandleSave(),
                redirect: "",
            });
        }else{
            afterConfirmHandleSave();
        }
    }
    

    const afterConfirmHandleSave = (callback) => {
        setSaveLoader(true)
        API.post(
            "api/prabandh/update-diet-activity-list",
            { update: deletes, diet_id },
            (data) => {
                setSaveLoader(false)
                if (data.status) {
                    getDietAtivity()
                    dispatch(features.showToast({ message: data.message }));
                    if(callback){
                        callback()
                    }
                }
                dispatch(
                    features.makeHandler({
                        reload: new Date().getTime(),
                        where: "",
                    })
                );
            }
        );
    };

    const handleApprove = () => {
        sweetAlert.confirmation({
            title: "Are you sure?",
            msg: `You want to approve it.`,
            yesBtnText: "Yes",
            noBtnText: "No",
            url: "",
            callback: () => afterConfirmHandleSave(afterConfirmHandleApprove()),
            redirect: "",
        });
    }
    const afterConfirmHandleApprove = () => {
        setApproveLoader(true)
        API.post("api/prabandh/approve-diet-configuration-list",
            { diet_id: diet_id },
            (res) => {
                setApproveLoader(false);
                if (res.status) {
                    getDietAtivity();
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
    const updateState = (e) => {
        setAllData(null)
        setStateID(e.target.value || 0);
    };
    const handleUpdateDiet = (e) => {
        setAllData(null)
        setDiet_id(e.target.value || 0);
    };
    const handleShowData = () => {
        getDietAtivity();
    }

    const exportTableToExcel = async () => {
        exportToExcel("byTableHtml", {
            skipColumn: [],
            reportData: rows,
            table: $(".table-scroll"),
            fileName: `Proposal_DIET_Plan`,
            sheetName: "Sheet 1",
            report_header: `Proposa DIET Plan, State: ${$("select[name='state-list']").find("option:selected").text()},  Diet: ${$("select[name='diet-list']").find("option:selected").text()}`,
        });
    };

    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
                <h1>Proposal DIET Plan</h1> 
                <div>
                    <button
                        type="button"
                        className="btn btn-success float-end mx-2"
                        onClick={exportTableToExcel}
                        disabled={!alldata?.data?.length}
                        >
                        <i className="bi bi-file-earmark-excel"></i>{" "}
                        <span className="mobile-hide">Export To</span> Excel
                    </button>
                </div>
            </div>
            <div className="dashboard-main-content-info mb-3">
                <div className="row ">
                    <div className="col-md-3">
                        <label>Select State</label>
                        <select className="form-select" name="state-list"
                            value={stateID}
                            disabled={user.user_state_id}
                            onChange={updateState}
                        >
                            <option value="0">--Select State--</option>
                            {stateList && stateList?.length > 0 &&
                                stateList?.map((st, stidx) => {
                                    return (
                                        <option key={`st_${stidx}`} value={st.id}> {st.name} </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>Select Diet</label>
                        <select className="form-select" name="diet-list" value={diet_id} disabled={!+stateID || +user?.user_role_id === 27} onChange={handleUpdateDiet}>
                            <option value="0">--Select Diet--</option>

                            {dietList && dietList?.length > 0 &&
                                dietList?.map((st, stidx) => {
                                    return (
                                        <option key={`st_${stidx}`} value={st.diet_id}> {st.diet_name} </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="col-md-1" style={{ display: "flex", alignItems: "flex-end" }}>
                        <button className="btn btn-primary" disabled={!+stateID || !+diet_id} onClick={handleShowData}>Show</button>
                    </div>
                </div>
            </div>
            {loading ? (
                <div style={{ textAlign: "center" }}>
                    <Spinner />
                </div>
            ) :
                (
                    alldata && (
                        <div className="dashboard-main-content-info ">
                            <div className="row">
                                <div className="col-4">
                                </div>
                                <div className="col-4 text-center">
                                    {+alldata?.activity_status === 6 && <h6 className="bg-warning p-2 border rounded" >DIET Plan Approved</h6>}
                                </div>
                                <div className="col-4">
                                    <h6 className="text-end" style={{ color: "#2b4a91" }}>{" "} (All ₹ In Lakhs)</h6>
                                </div>

                                <div className="col-xl-12 col-lg-12 col-sm-12 ">
                                    {rows && (
                                        <Table
                                            object={{
                                                columns: Column.dietConfigurePlan(),
                                                data: rows,
                                                // count: alldata?.data?.length,
                                                create: false,
                                                search: false,
                                                handleCheckboxAll: handleCheckboxAll,
                                                checkbox_action: true,
                                                deletes: deletes,
                                                status: status,
                                                count: rows.length,
                                                tfoot: {
                                                    colSpanAtStart: 4,
                                                    colSpanAtEnd: 1,
                                                    column : {
                                                        quantity: alldata?.data.reduce(
                                                            (accumulator, currentValue) =>
                                                                accumulator +
                                                                parseFloat(currentValue.quantity || 0),
                                                            0
                                                        ),
                                                        unit_cost: false,
                                                        financial_quantity: alldata?.data.reduce(
                                                            (accumulator, currentValue) =>
                                                                accumulator +
                                                                parseFloat(currentValue.financial_quantity || 0),
                                                            0
                                                        ).toFixed(5)
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                                {+alldata?.activity_status !== 6 && <div className="text-end">
                                    <button className="btn btn-success float-end mt-3" disabled={+alldata?.activity_status === 6} onClick={handleSave} style={{ marginRight: "5px", width: "90px" }}>
                                        {saveLoader ? <Btnloader /> : "Save"}
                                    </button>

                                    <button className="btn btn-primary float-end ms-3 mt-3" disabled={+alldata?.activity_status === 6} onClick={handleApprove} style={{ marginRight: "5px", width: "100px" }}>
                                        {approveLoader ? <Btnloader /> : "Approve"}
                                    </button>
                                </div>}
                            </div>
                        </div>
                    )
                )
            }
        </div>
    );
}
