import React, { useEffect, useState } from 'react'
//import Spinner from '../../../../apps/components/elements/Spinner';
import { Column, Helper, Hook, Table, API } from '../../../../apps';
import { useDispatch, useSelector } from 'react-redux';
import $ from "jquery";
import features from '../../../../redux/features';

export default function ProgressTrackinglevel() {
    const [alldata, setAlldata] = useState([]);
    const [schemesList, setSchemesList] = useState([]);
    const [majorComponenetList, setMajorComponenetList] = useState([]);
    const [checked, setChecked] = useState([]);
    const [prevchecked, setPrevchecked] = useState([])
    const [filter, setFilter] = useState({ state_id: 0, scheme_id: 0, major_component_id: 0 });
    const [disablecheck, setDisablecheck] = useState(0)

    const dispatch = useDispatch();
    const handler = useSelector((state) => state.handler);
    const stateList = Hook.useStates();
    const user = Helper.auth.user;

    const getSchemesList = () => {
        // setSpin(true);
        API.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
            setSchemesList(res.data);
        });
    };

    const getMajorComponenetList = () => {
        API.post("api/prabandh/major-components", { schemeid: filter.scheme_id }, (res) => {
            setMajorComponenetList(res.data);
        });
    };
    const getData = () => {
        API.post("api/prabandh/get-progress-tracking-level-data", { scheme_id: filter.scheme_id, state_id: filter.state_id, major_component_id: filter.major_component_id, activity_group_code: user?.activity_group_code }, (res) => {
            if (res.status) {
                const a = res.data.map(c => { return { id: c.prb_activity_detail_execution_level_id, financial_level_of_execution: c.financial_level_of_execution } })
                setPrevchecked(a)
                setDisablecheck(res?.data[0]?.status)
                setAlldata(res.data)
            }
        });
    };

    useEffect(() => {
        setFilter((prev) => { return { ...prev, state_id: user.user_state_id } })
    }, [])

    useEffect(() => {
        getSchemesList();
        if (filter.scheme_id) getMajorComponenetList();
        if (+filter.state_id !== 0 && +filter.scheme_id !== 0 && +filter.major_component_id !== 0) {
            getData();
        }
    }, [filter])

    useEffect(() => {
        $(".need_hide_footer").hide();
    }, [alldata])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
        if (+value === 0) {
            setAlldata([]);
        }
    }
    
    let rows = []
    const handleCheckbox = (e, row, level, status) => {
        if (+status === 6) {
            return null
        }
        const data = {
            id: row?.prb_activity_detail_execution_level_id,
            state_id: filter?.state_id,
            physical_level_of_execution: level,
            financial_level_of_execution: level,
            plan_year: row?.year_code
        }
        const prevUpdated = [...prevchecked]
        setPrevchecked(prevUpdated)
        const index = checked?.findIndex(item => item.id === row?.prb_activity_detail_execution_level_id);
        if (index === -1) {
            setChecked((prevState) => {
                return [...prevState, data];
            })
        } else {
            const Updated = [...checked]
            setChecked(Updated);
        }
    }
    if (alldata) {
        rows = alldata && alldata &&
            alldata?.map((row, i) => {
                return ({
                    srl: Helper.counter(++i, handler.limit, handler.page),
                    sub_component_name: row.sub_component_name,
                    activity_master: row.activity_master_name,
                    activity_master_detail: row.activity_master_details_name,
                    state: (<div className="text-center" ><input name={`tlevel${i}`} checked={prevchecked && prevchecked?.filter(c => +c.id === +row.prb_activity_detail_execution_level_id)[0]?.financial_level_of_execution === 2} className="form-check-input" style={{ border: "1px solid black" }} type="radio" value="" id="flexCheckChecked" onChange={(e) => handleCheckbox(e, row, 2, row.status)} /></div>),
                    district: (<div className="text-center" ><input name={`tlevel${i}`} checked={prevchecked && prevchecked?.filter(c => +c.id === +row.prb_activity_detail_execution_level_id)[0]?.financial_level_of_execution === 3} className="form-check-input" style={{ border: "1px solid black" }} type="radio" value="" id="flexCheckChecked" onChange={(e) => handleCheckbox(e, row, 3, row.status)} /></div>),
                    // block: (<div className="text-center"><input name={`tlevel${i}`} className="form-check-input" style={{ border: "1px solid black" }} type="radio" value="" id="flexCheckChecked" onChange={(e) => handleCheckbox(e, row, 4)} /></div>),
                    school: (<div className="text-center"><input name={`tlevel${i}`} checked={prevchecked && prevchecked?.filter(c => +c.id === +row.prb_activity_detail_execution_level_id)[0]?.financial_level_of_execution === 5} className="form-check-input" style={{ border: "1px solid black" }} type="radio" value="" id="flexCheckChecked" onChange={(e) => handleCheckbox(e, row, 5, row.status)} /></div>),
                });
            });

    }

    const handleSave = () => {
        API.post("api/prabandh/update-progress-tracking-level-data", checked, (res) => {
            if (res.status) {
                getData()
                setChecked([])
                dispatch(features.showToast({ message: res.message }));
            }
        });
    }

    const handleFinalize = () => {
        API.post("api/prabandh/finalize-progress-tracking-level-data", filter?.state_id, (res) => {
            if (res.status) {
                getData()
                dispatch(features.showToast({ message: res.message }));
            }
        });
    }

    return (
        <div className='dashboard-main-content'>
            <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
                <h1>Progress Tracking Level</h1>
            </div>
            <div className="dashboard-main-content-info mb-3 mt-3 mobile-search" id="search" style={{ backgroundColor: "rgb(43 74 145)" }}>
                <div className="row">
                    <div className="col-md-3">
                        <select className="form-select" name="state_id" value={filter.state_id} onChange={handleChange}
                            disabled={+user.user_role_id >= 4 ? +user.user_role_id !== 12 ? true : false : false}
                        >
                            <option value={0}>State (All)</option>
                            {stateList && stateList?.map((st, stidx) => (
                                <option key={`st_${stidx}`} value={st.id}>
                                    {st.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select className="form-select" name="scheme_id" value={filter.scheme_id} onChange={handleChange}>

                            <option value={0}>Scheme (All)</option>
                            {schemesList?.map((s, idx) => (
                                <option key={`sl_${idx + 1}`} value={s.id}>
                                    {s.scheme_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <select className="form-select" name="major_component_id" value={filter.major_component_id} onChange={handleChange}>

                            <option value={0}>Major Component (All)</option>
                            {majorComponenetList.map((m, idx) => (
                                <option key={`mc_${idx + 1}`} value={m.prb_major_component_id}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {alldata && alldata && alldata.length === 0 ? <h1 className='text-center'>No Data Found</h1> :
                    <div className="dashboard-main-content-info">
                        {+disablecheck !== 6 && <button className='btn btn-danger float-end' disabled={+disablecheck === 6} onClick={handleFinalize}>Finalize</button>}
                        {+disablecheck === 6 && <h4 style={{ color: "green", textAlign: "center" }}>Already Finalized Tracking Level</h4>}
                        {+disablecheck !== 6 && <button className='btn btn-success float-end' style={{ marginRight: "5px" }} disabled={+disablecheck === 6} onClick={handleSave}>Submit</button>}
                        <div className="col-xl-12 col-lg-12 col-sm-12 ">
                            {rows && (
                                <Table
                                    object={{
                                        columns: Column.progressTrackinglevel(),
                                        data: rows,
                                        count: alldata?.length,
                                        create: false,
                                        search: false,
                                        // handleCheckboxAll: handleCheckboxAll,
                                        // checkbox_action: true,
                                        // deletes: deletes,
                                        // status: status
                                    }}
                                />
                            )}
                        </div>
                    </div>
            }
        </div>
    )
}
