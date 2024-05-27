import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, Column, sweetAlert, Hook } from '../../../../../../../apps';
import MultiSelect from '../../../../../../../apps/components/form/MultiSelect';

const LocationGroupMappingModal = (props) => {
    const grpActData = props?.object?.data?.grpActData || [];
    const regionData = props?.object?.data?.regionData || [];

    const SOption = props?.object?.data?.SOption || [];
    const DOption = props?.object?.data?.DOption || [];
    const BOption = Hook.useBlocks();

    const [group_code, setGroupCode] = useState(props?.object?.data?.group_code || '0');
    const [location_type, setLocationTypeID] = useState(+props?.object?.data?.location_type || 0);
    const [activity_level_id, setActivityLevelID] = useState(+props?.object?.data?.activity_level_id || 0);
    const [tblData, setTblData] = useState([]);
    const [tblDataToInsert, setTblDataToInsert] = useState([]);
    const [dataStatus, setDataStatus] = useState(1);
    const [editPage, setEditPage] = useState(Date.now());
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [backUpRow, setBackUpRow] = useState([]);
    const [stateID, setStateID] = useState([]);
    const [districtID, setDistrictID] = useState([]);
    const [blockID, setBlockID] = useState([]);

    useEffect(() => {
        API.post("api/master-settings/get-location-group-mapping-details", { group_code: group_code },
            (result) => {
                if (result?.data.length > 0) {
                    let tableData = [];
                    result?.data.forEach((itm, idx) => {
                        tableData[idx] = itm;

                        if (+itm?.location_type === 2 && SOption.length > 0) {
                            tableData[idx]['state_name'] = SOption.filter(x => +x.id === itm.location_id)[0].name
                        }
                        else if (+itm?.location_type === 3 && SOption.length > 0 && DOption.length > 0) {
                            let filteredData = DOption.filter(x => +x.district_id === itm.location_id)[0];
                            tableData[idx]['state_name'] = SOption.filter(x => +x.id === filteredData.district_state_id)[0].name;
                            tableData[idx]['district_name'] = filteredData?.district_name
                        }
                        else {
                            if (SOption.length > 0 && DOption.length > 0 && BOption.length > 0) {
                                let filteredData = BOption.filter(x => +x.id === itm.location_id)[0];
                                tableData[idx]['state_name'] = SOption.filter(x => +x.id === filteredData.block_state_id)[0].name;
                                tableData[idx]['district_name'] = DOption.filter(x => +x.district_id === filteredData.district_id)[0].district_name
                                tableData[idx]['block_name'] = filteredData?.name
                            }
                        }
                    })
                    if (result?.data[0].location_type === 2)
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
        } else if (!location_type) {
            return AlertMessages.regionFieldRequired;
        } else {
            return false;
        }
    }

    const saveData = () => {
        let bodyData = {
            flag: props?.object?.title === "Add Mapping" || +selectedIndex === -1 ? 'add' : 'edit',
            id: +selectedIndex > -1 ? backUpRow?.location_group_mapping_id : selectedIndex,
            data: tblDataToInsert
        }

        API.post("api/master-settings/handle-location-group-mapping", bodyData,
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

    useEffect(() => {
        setStateID([]);
        setDistrictID([]);
        setBlockID([]);
    }, [location_type])

    const handleMultiSelect = (e, fieldName) => {
        if (fieldName === 'state_id') {
            setStateID(e);
            setDistrictID([]);
            setBlockID([]);

            setDataStatus(+location_type === 2 ? 2 : dataStatus);
        }
        else if (fieldName === 'district_id') {
            setDistrictID(e);
            setBlockID([]);

            setDataStatus(+location_type === 3 ? 2 : dataStatus);
        }
        else {
            setBlockID(e);
            setDataStatus(+location_type === 4 ? 2 : dataStatus);
        }
    }

    const createTableData = () => {
        let isValid = validateFields();
        if (isValid) {
            sweetAlert.warning(isValid);
        }
        else {
            let processableDataLength;

            switch (+location_type) {
                case 2: processableDataLength = stateID.length; break;
                case 3: processableDataLength = districtID.length; break;
                case 4: processableDataLength = blockID.length; break;
            }
            let localData = [];

            for (let i = 0; i < processableDataLength; i++) {
                let dataObj = {};

                dataObj['newIndex'] = 'new_' + (i + 1);
                dataObj['group_code'] = group_code;
                dataObj['location_type'] = location_type;
                dataObj['state_name'] = +location_type === 2 ? stateID[i]?.name : stateID[0]?.name;
                dataObj['district_name'] = +location_type === 3 ? districtID[i]?.district_name : districtID[0]?.district_name;
                dataObj['block_name'] = +location_type === 4 ? blockID[i]?.name : blockID[0]?.name;
                dataObj['state_id'] = +location_type === 2 ? stateID[i]?.id : stateID[0]?.id;
                dataObj['district_id'] = +location_type === 3 ? districtID[i]?.district_id : districtID[0]?.district_id;
                dataObj['block_id'] = +location_type === 4 ? blockID[i]?.id : blockID[0]?.id;
                dataObj['location_id'] = +location_type === 2 ? stateID[i]?.id : +location_type === 3 ? districtID[i]?.district_id : blockID[i]?.id;

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
                API.post("api/master-settings/delete-location-group-mapping", { id: row?.id },
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
            setLocationTypeID(row?.location_type)
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
        setLocationTypeID(0);
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
                                <label>Select Location Group's Name</label>
                                <select className="form-select ps-3" value={group_code} disabled={props?.object?.title !== "Add Mapping"}
                                    onChange={e => setGroupCode(e.target.value)} aria-label="Select group name">

                                    <option value={0}>--Select Group--</option>
                                    {(grpActData && grpActData.length > 0) && grpActData.filter(x => +x.group_type === 2).map((itm, idx) => <option key={idx} value={itm.group_code}>{itm.group_name}</option>)}
                                </select>
                            </div>}

                            {(regionData && regionData.length > 0) && <div className="col-md-6 mb-3">
                                <label>Select Group's Location Type</label>
                                <select className="form-select ps-3" value={location_type} disabled={props?.object?.title !== "Add Mapping"}
                                    onChange={e => setLocationTypeID(e.target.value)} aria-label="Select activity region type">

                                    <option value={0}>--Select Location Type--</option>
                                    {(regionData && regionData.length > 0) && regionData.map((itm, idx) => <option key={idx} value={+itm.id}>{itm.name}</option>)}
                                </select>
                            </div>}

                            <div className='row'>
                                {(+location_type > 1) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={SOption} displayValues="name" singleSelect={+location_type !== 2 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-state-list`, name: `state-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'state_id'),
                                            onRemove: (e) => handleMultiSelect(e, 'state_id'),
                                        }}
                                        label="Select Location Group's State" default="Select Location Group's State" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}

                                {(+location_type > 2 && stateID.length > 0) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={DOption.filter(x => +x.district_state_id === +stateID[0].id)} displayValues="district_name" singleSelect={+location_type !== 3 || +selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-district-list`, name: `district-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'district_id'),
                                            onRemove: (e) => handleMultiSelect(e, 'district_id'),
                                        }}
                                        label="Select Location Group's District" default="Select Location Group's District" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}

                                {(+location_type > 3 && districtID.length > 0) && <div className="col-md-4 mb-3">
                                    <MultiSelect options={BOption.filter(x => +x.block_district_id === +districtID[0].district_id)} displayValues="name" singleSelect={+selectedIndex > -1 ? 'true' : 'false'}
                                        attr={{
                                            id: `select-block-list`, name: `block-list`,
                                            onSelect: (e) => handleMultiSelect(e, 'block_id'),
                                            onRemove: (e) => handleMultiSelect(e, 'block_id'),
                                        }}
                                        label="Select Location Group's State" default="Select Location Group's State" mandatory="true" disable={props?.object?.readOnly} />
                                </div>}
                            </div>

                            <div className={props?.object?.readOnly ? "col-md-8" : "col-md-8 mt-3"}>
                                <h5>Location Mapping Details</h5>
                            </div>
                            <div className={props?.object?.readOnly ? "col-md-4" : "col-md-4 mt-3"}>
                                <Button variant="primary" className='cfr' disabled={+dataStatus !== 2} onClick={createTableData}><i className="bi bi-plus-circle"></i> &nbsp; Add Row</Button>
                            </div>
                        </>}
                        {(tblData.length > 0) && <div className='col-md-12' style={{ zIndex: 1 }}>
                            <table className="table-scroll">
                                <thead>
                                    <tr>
                                        {Column.locationGroupMappingDetails().map((itm, idx) => {
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
                                                <td>{regionData.find(x => +x.id === +itm.location_type).name}</td>
                                                <td>{itm.state_name}</td>
                                                <td>{itm.district_name}</td>
                                                <td>{itm.block_name}</td>
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

export default LocationGroupMappingModal