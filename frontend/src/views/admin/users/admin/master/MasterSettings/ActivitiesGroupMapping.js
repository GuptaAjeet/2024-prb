import React, { useState, useEffect } from "react";
import { API, Column, Model } from "../../../../../../apps";
import ActivityGroupMappingModal from "./Modals/ActivityGroupMappingModal";

const ActivitiesGroupMapping = (props) => {
    const activityLevel = Model.activityLevel();
    const regionData = Model.activityRegionType();

    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [refresh, setRefresh] = useState(Date.now());
    const [refreshPage, setRefreshPage] = useState(Date.now());
    const [grpActMappingData, setGrpActMappingData] = useState([]);
    const [grpActData, setGrpActData] = useState([]);
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        API.get("api/master-settings/get-activity-group-mapping", null,
            (result) => {
                if (result.status)
                    setGrpActMappingData(result?.data);
            }
        );

        API.get("api/group/list", null, (response) => {
            if (response.data !== undefined && response.data !== null)
                setGrpActData(response.data);
        });
    }, [refreshPage]);


    const handleModal = (modalAction = 'Add', modalInfoObj = null) => {
        setModalTitle(modalAction + ' Mapping');
        setReadOnly(modalAction === 'View' ? true : false);

        if (modalAction === 'Add') {
            setModalData({
                "schemes": props?.object?.schemes,
                "activityLevel": activityLevel,
                "regionData": regionData,
                "grpActData": grpActData.filter(item => !grpActMappingData.some(itm => itm.group_code === item.group_code))
            })

            setRefresh(Date.now());
            setShowModal(true);
        }
        else {
            if (modalInfoObj !== null) {
                setModalData({
                    "schemes": props?.object?.schemes,
                    "activityLevel": activityLevel,
                    "regionData": regionData,
                    "grpActData": grpActData,
                    "group_code": modalInfoObj.group_code,
                    "region_type_id": modalInfoObj.region_type_id
                })
            }
            setRefresh(Date.now());
            setShowModal(true);
        }
    }

    const reloadPage = (refreshData) => {
        setRefreshPage(refreshData);
    }

    return (
        <div className="dashboard-main-content">
            <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
            <div className='d-flex justify-content-between'>
                <h2 className="master_settings_heading">Activity Group Mapping</h2>
                    <button className="btn btn-primary float-end mb-2" onClick={(e) => { handleModal('Add') }}>Add New Mapping</button>
                </div>
                {(grpActMappingData.length > 0)
                    && <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.groupActivityMapping().map((itm, idx) => {
                                    let data = Object.values(itm)
                                    return (<th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>)
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {grpActMappingData.map((itm, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        {/* <td>{itm.id}</td> */}
                                        <td>{itm.group_code}</td>
                                        <td>{itm.group_name}</td>
                                        <td>{activityLevel.filter(x => +x.id === +itm?.activity_level_id)[0].name}</td>
                                        <td>{regionData.filter(x => +x.id === +itm?.region_type_id)[0].name}</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary me-1" title="Edit Mapping" onClick={(e) => { handleModal('Edit', itm) }}><i className="bi bi-pencil-square"></i></button>
                                            <button className="btn btn-success me-1" title="View Details" onClick={(e) => { handleModal('View', itm) }}><i className="bi bi-eye"></i></button>
                                        </td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>}
            </div>

            {showModal === true && <ActivityGroupMappingModal object={{ showModal: showModal, setShowModal: setShowModal, title: modalTitle, data: modalData, refresh: refresh, readOnly: readOnly }} reloadPage={reloadPage} />}
        </div>
    );
};

export default ActivitiesGroupMapping;
