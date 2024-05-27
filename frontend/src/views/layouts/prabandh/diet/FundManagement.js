import React, { useState, useEffect } from "react";
import { Helper, Hook, sweetAlert } from "../../../../apps";
import api from "../../../../apps/utilities/api";
import NumberInput from "../../../../apps/components/form/NumberInput";
import axios from "axios";
import { REACT_APP_URL } from "../../../../env";
import store from "../../../../redux/app/store";
import $ from "jquery";
import InputDate from "../../../../apps/components/form/InputDate";

export default function FundManagement() {
    let user = Helper.auth?.user;
    const [stateID, setStateID] = useState(user.user_state_id || 0);
    const [diet_id, setDiet_id] = useState(user?.diet_id || 0);
    const [alldata, setAllData] = useState(null);
    const [dietList, setDietList] = useState(null);
    const stateList = Hook.useStates();
    const stateName = stateList?.find((c) => +c.id === +stateID);
    const [sanctionNumber, setSanctionNumber] = useState();
    const [sanctionDate, setSanctionDate] = useState();
    const [amtReceved, setAmtReceved] = useState(0);

    const getDietList = () => {
        api.post(
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
        if(diet_id){
            api.post(
                "api/prabandh/diet-fund-list",
                { diet_id, state_id:  (user?.user_state_id || stateID) },
                (res) => {
                    if (res.status) {
                        setAllData(res.data)
                    }
                }
            );
        }
    }

    useEffect(() => {
        (+stateID || user.user_state_id) && getDietList();
        if(user?.diet_id){
            api.post(
                "api/prabandh/diet-fund-list",
                { diet_id: user?.diet_id, state_id: user?.user_state_id },
                (res) => {
                    if (res.status) {
                        setAllData(res.data)
                    }
                }
            );
        }
    }, [stateID])

    const updateState = (e) => {
        setAllData(null)
        setStateID(e.target.value || 0);
    };
    const handleUpdateDiet = (e) => {
        setAllData(null)
        setDiet_id(e.target.value || 0);
    };

    const saveHandler = ( ) =>{
        if(parseInt($("select[name='state-list']").val()) && parseInt($("select[name='diet-list']").val())){
            if(sanctionDate && amtReceved){
                const formData = new FormData();
                // formData.append("file", inputFile.current.files[0]);
                formData.append("received_date", sanctionDate);
                // formData.append("file_number", sanctionNumber);
                formData.append("received_amount", amtReceved);
                formData.append("state_id", stateID);
                formData.append("diet_id", diet_id);
        
                axios.post(`${REACT_APP_URL}api/budget/save-diet-budget-allot`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        API_Year: store.getState().year.year,
                        Authorization: `Bearer ${Helper.token()}`
                    },
                })
                .then(function (response) {
                    if (response?.status === 200) {
                        getDietAtivity();
                        setAmtReceved('');
                        setSanctionDate('');
                    }
                })
            }else{
                sweetAlert.warning("Please fill all mandatory fields.")
            }
            
        }else{
            sweetAlert.warning("Please Select State and Diet.")
        }
    }

    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
                <h1>Fund Management (DIET Centre of Excellence)</h1>
            </div>
            <div className="dashboard-main-content-info mb-3">
                <div className="row ">
                    <div className="col-md-3">
                        <label>Select State</label>
                        <select
                            className="form-select"
                            name="state-list"
                            value={user?.user_state_id || stateID}
                            disabled={!!user?.user_state_id}
                            onChange={updateState}
                        >
                            <option value="0">--Select State--</option>
                            {stateList?.map((st, stidx) => {
                                return (
                                    <option key={`st_${stidx}`} value={st.id}>
                                        {st.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>Select DIET</label>
                        <select
                            className="form-select"
                            name="diet-list"
                            value={user?.diet_id || diet_id}
                            disabled={!!user?.diet_id}
                            onChange={handleUpdateDiet}
                        >
                            <option value="0">--Select DIET--</option>
                            {dietList?.map((st, stidx) => {
                                return (
                                    <option key={`st_${stidx}`} value={st.diet_id}>
                                        {st.diet_name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-1" style={{ display: "flex", alignItems: "flex-end" }}>
                        <button className="btn btn-primary" 
                            // disabled={!+stateID || !+diet_id} 
                            onClick={getDietAtivity}>Show</button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6">
                    <div className="dashboard-main-content-info" >
                        
                            <h6 className="text-end" style={{ color: "#2b4a91" }}>
                                All (₹ In Lakhs)
                            </h6>
                            <div className="table-scroll-section">
                                <table className="table-scroll">
                                    <thead>
                                        <tr>
                                            <th colSpan={6} className="text-center">Receipt Fund from State : {stateName?.name}, DIET : {dietList?.find((c) => +c.diet_id === +diet_id)?.diet_name}</th>
                                        </tr>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Received Amount</th>
                                            {/* <th>File Number</th> */}
                                            <th style={{width:"220px"}}>Received Date</th>
                                            {/* <th>Documents</th> */}
                                            <th style={{width:"124px"}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alldata?.length>0 && alldata?.map((item, i)=><tr key={i}>
                                            <td>{i+1}</td>
                                            <td className="text-end">{item.received_amount}</td>
                                            {/* <td className="text-end">{item.file_number}</td> */}
                                            <td className="text-center">{Helper.dateFormate(item.received_date)}</td>
                                            {/* <td className="text-center">
                                                <label
                                                    className="btn btn-success btn-sm"
                                                    title={item?.document?.split("/")?.pop()}
                                                    onClick={() => handleDownloadFile(item)}
                                                >
                                                    <i className="bi bi-file-earmark-arrow-down"></i>{" "}
                                                    Download
                                                </label>
                                            </td> */}
                                            <td></td>
                                        </tr>)}
                                        {alldata?.length===0 && <tr className="text-center">
                                            <td colSpan={4} className="text-center">No data found</td>    
                                        </tr>}
                                        {/* {settings.isDietUser() && <tr> */}
                                        {+user.user_role_id===27 && <tr>
                                            <td>{(alldata?.length || 0)+1}</td>
                                            <td><NumberInput value={amtReceved} onChange={(e)=>setAmtReceved(e.target.value)}/></td>
                                            {/* <td><NumberInput decimal={false} onChange={(e)=>setSanctionNumber(e.target.value)}/></td> */}
                                            {/* <td><input type="date" className="form-control" value={sanctionDate} onChange={(e)=>setSanctionDate(e.target.value)} /></td> */}
                                            
                                            <td>
                                                <InputDate 
                                                    // minDate={new Date("2024-05-15")}
                                                    // maxDate={new Date("2024-05-19")}
                                                    onChange={(value)=>{
                                                        setSanctionDate(value);
                                                    }}
                                                />
                                            </td>
                                            
                                            {/* <td className="text-center">
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
                                                    onChange={(e)=>{
                                                        if (e.target.files[0]) {
                                                            if (!validateFileType(e.target.files[0])) {
                                                            sweetAlert.warning("Invalid file type. Please upload a valid file.");
                                                            } else {
                                                            setFile(e.target.files[0]);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </td> */}
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm me-1"
                                                    title="Cancel"
                                                    // onClick={resetForm}
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    title="Save Record(s)"
                                                    // disabled={saved}
                                                    onClick={(e) =>saveHandler()}
                                                >
                                                    <i className="bi bi-save"></i>
                                                </button>    
                                            </td>
                                        </tr>}
                                    </tbody>
                                    {alldata?.length>0 && <tfoot>
                                        <tr>
                                            <td className="fw-bold text-end">Total</td>
                                            <td className="fw-bold text-end">
                                                {Helper.numberFormat(
                                                    alldata?.reduce((accumulator, currentValue) => {
                                                    return (accumulator + parseFloat(currentValue?.received_amount || 0));
                                                    }, 0)
                                                )}
                                            </td>
                                            <td colSpan={8} className="text-end fw-bold"></td>
                                        </tr>
                                    </tfoot>}
                                </table>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
