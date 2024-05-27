import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, Column, sweetAlert } from '../../../../../../../apps';
import MultiSelect from '../../../../../../../apps/components/form/MultiSelect';

const ActivityGroupMappingModal = (props) => {
    const grpActData = props?.object?.data?.grpActData || [];
    const regionData = props?.object?.data?.regionData || [];
    const activityLevel = props?.object?.data?.activityLevel || [];
    const schemes = props?.object?.data?.schemes || [0];

    const [majorComponents, setMajorComponents] = useState([]);
    const [subComponents, setSubComponents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [subActivities, setSubActivities] = useState([]);
    const [group_code, setGroupCode] = useState(props?.object?.data?.group_code || '0');
    const [region_type_id, setRegionTypeID] = useState(+props?.object?.data?.region_type_id || 0);
    const [activity_level_id, setActivityLevelID] = useState(+props?.object?.data?.activity_level_id || 0);
    const [scheme_id, setSchemeID] = useState([]);
    const [major_component_id, setMajorComponentID] = useState([]);
    const [sub_component_id, setSubComponentID] = useState([]);
    const [activity_master_id, setActivityMasterID] = useState([]);
    const [activity_master_details_id, setActivityMasterDetailsID] = useState([]);
    const [tblData, setTblData] = useState([]);
    const [tblDataToInsert, setTblDataToInsert] = useState([]);
    const [dataStatus, setDataStatus] = useState(1);
    const [editPage, setEditPage] = useState(Date.now());
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [backUpRow, setBackUpRow] = useState([]);

    useEffect(() => {
        if (props?.object?.title !== "Add Mapping" && +selectedIndex > -1) {
            let selectedSchemes = [tblData[selectedIndex]?.scheme_id];
            let data = [];
            selectedSchemes.forEach((item) => { data.push(schemes.filter(x => +x.id === +item)[0]) });

            setSchemeID(data)
        }
    }, [editPage])

    useEffect(() => {
        if (scheme_id.length > 0 && +scheme_id[0]?.id > 0) {
            API.post("api/prabandh/major-components", { schemeid: +scheme_id[0]?.id },
                (res) => {
                    setMajorComponents(res?.data?.map((d) => ({ id: d.prb_major_component_id, name: d.title })));
                })
        }
    }, [scheme_id]);

    useEffect(() => {
        if (major_component_id.length > 0 && +major_component_id[0]?.id > 0) {
            API.post("api/master-settings/sub-components-list", { schemeid: +scheme_id[0]?.id, major_component_id: +major_component_id[0]?.id },
                (res) => {
                    setSubComponents(res?.data?.rows?.map((d) => ({ id: d.sub_component_id, name: d.title })));
                })
        }
    }, [major_component_id]);

    useEffect(() => {
        if (sub_component_id.length > 0 && +sub_component_id[0]?.id > 0) {
            API.post("api/master-settings/activity-master-list", { schemeid: +scheme_id[0]?.id, major_component_id: +major_component_id[0]?.id, sub_component_id: +sub_component_id[0]?.id },
                (res) => {
                    setActivities(res?.data?.map((d) => ({ id: d.id, name: d.title })));
                })
        }
    }, [sub_component_id]);

    useEffect(() => {
        if (activity_master_id.length > 0 && +activity_master_id[0]?.id > 0) {
            API.post("api/prabandh/active-master-detail-list", { schemeid: +scheme_id[0]?.id, major_component_id: +major_component_id[0]?.id, sub_component_id: +sub_component_id[0]?.id, activity_master_id: +activity_master_id[0]?.id },
                (res) => {
                    setSubActivities(res?.data);
                })
        }
    }, [activity_master_id]);

    
    useEffect(() => {
        if (props?.object?.title !== "Add Mapping" && majorComponents.length > 0) {
            let selectedMajorComponents = [tblData[selectedIndex]?.major_component_id]
            let data = [];
            selectedMajorComponents.forEach((item) => {
                const foundItem = majorComponents.find(x => +x.id === +item);
                if (foundItem) {
                    data.push(foundItem);
                }
            });
            setMajorComponentID(data)
        }
    }, [majorComponents]);

    useEffect(() => {
        if (props?.object?.title !== "Add Mapping" && subComponents.length > 0 && +selectedIndex > -1) {
            let selectedSubComponents = [tblData[selectedIndex]?.sub_component_id];
            let data = [];
            selectedSubComponents.forEach((item) => {
                const foundItem = subComponents.find(x => +x.id === +item);
                if (foundItem) {
                    data.push(foundItem);
                }
            });

            setSubComponentID(data);
        }
    }, [subComponents]);

    useEffect(() => {
        if (props?.object?.title !== "Add Mapping" && activities.length > 0 && +selectedIndex > -1) {
            let selectedActivities = [tblData[selectedIndex]?.activity_master_id];
            let data = [];
            selectedActivities.forEach((item) => {
                const foundItem = activities.find(x => +x.id === +item);
                if (foundItem) {
                    data.push(foundItem);
                }
            });
            setActivityMasterID(data || []);
        }
    }, [activities]);

    useEffect(() => {
        if (props?.object?.title !== "Add Mapping" && subActivities.length > 0 && +selectedIndex > -1) {
            let selectedSubActivities = [tblData[selectedIndex]?.activity_master_details_id];
            let data = [];
            selectedSubActivities.forEach((item) => {
                const foundItem = subActivities.find(x => +x.id === +item);
                if (foundItem) {
                    data.push(foundItem);
                }
            });
            setActivityMasterDetailsID(data);
        }
    }, [subActivities]);

    useEffect(() => {
        API.post("api/master-settings/get-activity-group-mapping-details", { group_code: group_code },
            (result) => {
                if (result.data.length > 0) {
                    setTblData(result.data)
                }
            }
        );
    }, [group_code])

    const handleRefresh = () => { props?.reloadPage(Date.now()) }

    const handleClose = () => props?.object?.setShowModal(false);

    const validateFields = () => {
        if (group_code === '0') {
            return AlertMessages.groupFieldRequired;
        } else if (!region_type_id) {
            return AlertMessages.regionFieldRequired;
        } else if (+activity_level_id === 0) {
            return AlertMessages.activityLevelFieldRequired;
        } else if (+scheme_id.length === 0) {
            return AlertMessages.schemeFieldRequired;
        } else if (+activity_level_id === 2 && +major_component_id.length === 0) {
            return AlertMessages.majorComponentFieldRequired;
        } else if (+activity_level_id === 3 && +sub_component_id.length === 0) {
            return AlertMessages.subComponentFieldRequired;
        } else if (+activity_level_id === 4 && +activity_master_id.length === 0) {
            return AlertMessages.activityFieldRequired;
        } else if (+activity_level_id === 5 && +activity_master_details_id.length === 0) {
            return AlertMessages.subActivityFieldRequired;
        } else {
            return false;
        }
    }

    const saveData = () => {
        let bodyData = {
            flag: props?.object?.title === "Add Mapping" || +selectedIndex === -1 ? 'add' : 'edit',
            id: +selectedIndex > -1 ? backUpRow?.id : selectedIndex,
            data: tblDataToInsert
        }

        API.post("api/master-settings/handle-group-activity-mapping", bodyData,
            (res) => {
                if (res?.message === "success") {
                    handleRefresh();
                    sweetAlert.done({ msg: bodyData.flag === 'add' ? AlertMessages.saveDataMsg : AlertMessages.updateDataMsg });
                    handleClose();
                    setTblDataToInsert([]);
                    setSelectedIndex(-1);
                } else {
                    sweetAlert.warning(AlertMessages.errorMsg);
                }
                handleClose();
            })
    }

    const handleSubmit = () => {
        sweetAlert.confirmation({
            title: 'Confirmation',
            msg: AlertMessages.saveDataConfirmationMsg,
            noBtnText: 'No',
            yesBtnText: 'Yes',
            callback: saveData
        })
    }

    const handleChange = (e) => {
        setActivityLevelID(+e.target.value)
        setSchemeID([]);
        setMajorComponentID([]);
        setSubComponentID([]);
        setActivityMasterID([]);
        setActivityMasterDetailsID([]);
    }

    const handleMultiSelect = (e, fieldName) => {
        if (fieldName === 'scheme_id') {
            setSchemeID(e);
            setMajorComponentID([]);
            setSubComponentID([]);
            setActivityMasterID([]);
            setActivityMasterDetailsID([]);

            setDataStatus(+activity_level_id === 1 ? 2 : dataStatus);
        }
        else if (fieldName === 'major_component_id') {
            setMajorComponentID(e);
            setSubComponentID([]);
            setActivityMasterID([]);
            setActivityMasterDetailsID([]);

            setDataStatus(+activity_level_id === 2 ? 2 : dataStatus);
        }
        else if (fieldName === 'sub_component_id') {
            setSubComponentID(e);
            setActivityMasterID([]);
            setActivityMasterDetailsID([]);

            setDataStatus(+activity_level_id === 3 ? 2 : dataStatus);
        }
        else if (fieldName === 'activity_master_id') {
            setActivityMasterID(e);
            setActivityMasterDetailsID([]);

            setDataStatus(+activity_level_id === 4 ? 2 : dataStatus);
        }
        else {
            setActivityMasterDetailsID(e);

            setDataStatus(+activity_level_id === 5 ? 2 : dataStatus);
        }
    }

    const createTableData = () => {
        let isValid = validateFields();
        if (isValid) {
            sweetAlert.warning(isValid);
        }
        else {
            let processableDataLength;

            switch (+activity_level_id) {
                case 1: processableDataLength = scheme_id.length; break;
                case 2: processableDataLength = major_component_id.length; break;
                case 3: processableDataLength = sub_component_id.length; break;
                case 4: processableDataLength = activity_master_id.length; break;
                default: processableDataLength = activity_master_details_id.length; break;
            }
            let localData = [];

            for (let i = 0; i < processableDataLength; i++) {
                let dataObj = {};

                dataObj['newIndex'] = 'new_' + (i + 1);
                dataObj['group_code'] = group_code;
                dataObj['region_type_id'] = region_type_id;
                dataObj['activity_level_id'] = activity_level_id;
                dataObj['scheme_name'] = +activity_level_id === 1 ? scheme_id[i]?.name : scheme_id[0]?.name;
                dataObj['major_component_name'] = +activity_level_id === 2 ? major_component_id[i]?.name : major_component_id[0]?.name;
                dataObj['sub_component_name'] = +activity_level_id === 3 ? sub_component_id[i]?.name : sub_component_id[0]?.name;
                dataObj['activity_master_name'] = +activity_level_id === 4 ? activity_master_id[i]?.name : activity_master_id[0]?.name;
                dataObj['activity_master_details_name'] = +activity_level_id === 5 ? activity_master_details_id[i]?.activity_master_details_name : activity_master_details_id[i]?.activity_master_details_name;
                dataObj['scheme_id'] = +activity_level_id === 1 ? scheme_id[i]?.id : scheme_id[0]?.id;
                dataObj['major_component_id'] = +activity_level_id === 2 ? major_component_id[i]?.id : major_component_id[0]?.id;
                dataObj['sub_component_id'] = +activity_level_id === 3 ? sub_component_id[i]?.id : sub_component_id[0]?.id;
                dataObj['activity_master_id'] = +activity_level_id === 4 ? activity_master_id[i]?.id : activity_master_id[0]?.id;
                dataObj['activity_master_details_id'] = +activity_level_id === 5 ? activity_master_details_id[i]?.id : activity_master_details_id[i]?.id;

                localData.push(dataObj);
            }
            setTblDataToInsert([...tblDataToInsert, ...localData]);

            if (+selectedIndex > -1) {
                let copyOfTblData = [...tblData];
                copyOfTblData[selectedIndex] = localData[0];

                setTblData([...copyOfTblData]);
                setDataStatus(4);
                resetForm();
            }
            else {
                setTblData([...tblData, ...localData]);
                setDataStatus(3);
                resetForm();
            }
        }
    }

    const deleteRow = (row, index) => {
        let localData = JSON.parse(JSON.stringify(tblData));
        if (props?.object?.title === "Add Mapping") {
            localData.splice(index, 1);
            setTblData([...localData]);
            setTblDataToInsert([...localData]);
            sweetAlert.done({ msg: AlertMessages.deleteDataMsg });
        } else {
            if (row.hasOwnProperty("newIndex") === true) {
                localData.splice(index, 1);
                setTblData([...localData]);

                setTblDataToInsert(tblDataToInsert.filter(x => x?.newIndex !== row?.newIndex))
            } else {
                API.post("api/master-settings/delete-group-activity-mapping", { id: row?.id },
                    (res) => {
                        if (res?.message === "success") {
                            sweetAlert.done({ msg: AlertMessages.deleteDataMsg });
                            localData.splice(index, 1);
                            setTblData([...localData]);
                        } else {
                            sweetAlert.warning(AlertMessages.errorMsg);
                        }
                    })
            }
        }
    }

    const handleDelete = (row, index) => {
        sweetAlert.confirmation({
            title: 'Confirmation',
            msg: AlertMessages.deleteDataConfirmationMsg,
            noBtnText: 'No',
            yesBtnText: 'Yes',
            callback: () => deleteRow(row, index)
        })
    }

    const handleEdit = (row, index) => {
        if (+selectedIndex > -1 && selectedIndex !== index) {
            sweetAlert.warning(AlertMessages.saveBeforeProceedMsg)
        } else {
            setSelectedIndex(index);
            setEditPage(Date.now());
            setRegionTypeID(row?.region_type_id)
            setActivityLevelID(row?.activity_level_id)
            setBackUpRow(row);
        }
    }

    const handleCancel = () => {
        let copyOfData = JSON.parse(JSON.stringify(tblData));
        copyOfData[selectedIndex] = backUpRow;
        setTblData(copyOfData);
    }

    const resetForm = () => {
        if (props?.object?.title === "Add Mapping") {
            setGroupCode('0');
        }
        setRegionTypeID(0);
        setActivityLevelID(0);
        setSchemeID([]);
        setMajorComponentID([]);
        setSubComponentID([]);
        setActivityMasterID([]);
        setActivityMasterDetailsID([]);
    }

    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered'} size='xl' show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className={'modal-scroll-2'}>
                    <div className='row'>
                        {props?.object?.readOnly === false && <>
                            {(grpActData && grpActData.length > 0) && <div className="col-md-6 mb-3">
                                <label>Select Activity Group's Name</label>
                                <select className="form-select ps-3" value={group_code} disabled={props?.object?.title !== "Add Mapping"}
                                    onChange={e => setGroupCode(e.target.value)} aria-label="Select group name">

                                    <option value={0}>--Select Group--</option>
                                    {(grpActData && grpActData.length > 0) && grpActData.filter(x => +x.group_type === 1).map((itm, idx) => <option key={idx} value={itm.group_code}>{itm.group_name}</option>)}
                                </select>
                            </div>}

                            {(regionData && regionData.length > 0) && <div className="col-md-6 mb-3">
                                <label>Select Activity Group's Region Type</label>
                                <select className="form-select ps-3" value={region_type_id} disabled={props?.object?.title !== "Add Mapping"}
                                    onChange={e => setRegionTypeID(e.target.value)} aria-label="Select activity region type">

                                    <option value={0}>--Select Activity Region--</option>
                                    {(regionData && regionData.length > 0) && regionData.map((itm, idx) => <option key={idx} value={+itm.id}>{itm.name}</option>)}
                                </select>
                            </div>}

                            <div className='row'>
                                {(activityLevel && activityLevel.length > 0) && <div className="col-md-4 mb-3">
                                    <label>Select Activity Group's Level Type</label>
                                    <select className="form-select ps-3" value={activity_level_id} disabled={props?.object?.readOnly} name='activity_level_id'
                                        onChange={(e) => handleChange(e)} aria-label="Select activity level">

                                        <option value={0}>--Select Activity Level--</option>
                                        {(activityLevel && activityLevel.length > 0) && activityLevel.map((itm, idx) => <option key={idx} value={+itm.id}>{itm.name}</option>)}
                                    </select>
                                </div>}

                                {(schemes && schemes.length > 0 && activity_level_id > 0) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={schemes} selectedValues={scheme_id} displayValues="name" singleSelect={+activity_level_id !== 1 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-scheme-list`, name: `scheme-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'scheme_id',),
                                            onRemove: (e) => handleMultiSelect(e, 'scheme_id',),
                                        }}
                                        label="Select Activity Group's Scheme" default="Select Activity Group's Scheme" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}

                                {(majorComponents && majorComponents.length > 0 && activity_level_id > 1) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={majorComponents} selectedValues={major_component_id} displayValues="name" singleSelect={+activity_level_id !== 2 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-major-component-list`, name: `major-component-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'major_component_id',),
                                            onRemove: (e) => handleMultiSelect(e, 'major_component_id',),
                                        }}
                                        label="Select Activity Group's Major Component" default="Select Activity Group's Major Component" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}

                                {(subComponents && subComponents.length > 0 && activity_level_id > 2) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={subComponents} selectedValues={sub_component_id} displayValues="name" singleSelect={+activity_level_id !== 3 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-sub-component-list`, name: `sub-component-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'sub_component_id',),
                                            onRemove: (e) => handleMultiSelect(e, 'sub_component_id',),
                                        }}
                                        label="Select Activity Group's Sub Component" default="Select Activity Group's Sub Component" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}

                                {(activities && activities.length > 0 && activity_level_id > 3) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={activities} selectedValues={activity_master_id} displayValues="name" singleSelect={+activity_level_id !== 4 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-activity-master-list`, name: `activity-master-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'activity_master_id',),
                                            onRemove: (e) => handleMultiSelect(e, 'activity_master_id',),
                                        }}
                                        label="Select Activity Group's Master Activity" default="Select Activity Group's Master Activity" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}

                                {(subActivities && subActivities.length > 0 && activity_level_id > 4) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={subActivities} selectedValues={activity_master_details_id} displayValues="activity_master_details_name" singleSelect={+activity_level_id !== 5 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-sub-activity-list`, name: `sub-activity-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'activity_master_details_id',),
                                            onRemove: (e) => handleMultiSelect(e, 'activity_master_details_id',),
                                        }}
                                        label="Select Activity Group's Sub Activity" default="Select Activity Group's Sub Activity" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}
                            </div>

                            <div className={props?.object?.readOnly ? "col-md-8" : "col-md-8 mt-3"}>
                                <h5>Activity Details</h5>
                            </div>
                            <div className={props?.object?.readOnly ? "col-md-4" : "col-md-4 mt-3"}>
                                <Button variant="primary" className='cfr' disabled={+dataStatus !== 2} onClick={createTableData}><i className="bi bi-plus-circle"></i> &nbsp; Add Row</Button>
                            </div>
                        </>}
                        {(tblData.length > 0) && <div className='col-md-12' style={{ zIndex: 1 }}>
                            <table className="table-scroll">
                                <thead>
                                    <tr>
                                        {Column.groupActivityMappingDetails().map((itm, idx) => {
                                            let data = Object.values(itm)
                                            return (<th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>)
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tblData.map((itm, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{grpActData.find(x => x.group_code === itm.group_code).group_name}</td>
                                                <td>{regionData.find(x => +x.id === +itm.region_type_id).name}</td>
                                                <td>{activityLevel.find(x => +x.id === +itm.activity_level_id).name}</td>
                                                <td>{itm.scheme_name}</td>
                                                <td>{itm.major_component_name}</td>
                                                <td>{itm.sub_component_name}</td>
                                                <td>{itm.activity_master_name}</td>
                                                <td>{itm.activity_master_details_name}</td>
                                                {props?.object?.readOnly === false ? <td className="text-center">
                                                    {+selectedIndex !== idx ? <>
                                                        <button style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }} hidden={props?.object?.title === "Add Mapping"} onClick={e => handleEdit(itm, idx)} className="btn btn-primary me-1 btn-sm" title="Edit Data" ><i className="bi bi-pencil-square"></i></button>
                                                        <button style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }} className="btn btn-danger btn-sm" title="Delete Data" onClick={e => handleDelete(itm, idx)}><i className="bi bi-trash"></i></button>
                                                    </>
                                                        :
                                                        <>
                                                            <button style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }} onClick={handleSubmit} disabled={+dataStatus !== 4} className="btn btn-success me-1 btn-sm" title="Save Data" ><i className="bi bi-check-circle"></i></button>
                                                            <button style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }} className="btn btn-danger btn-sm" title="Cancel" onClick={e => handleCancel()}><i className="bi bi-x-circle"></i></button>
                                                        </>}
                                                </td> : <td></td>}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                    <Button variant="success" disabled={props?.object?.readOnly || +dataStatus !== 3 || tblDataToInsert.length === 0} onClick={handleSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ActivityGroupMappingModal