import React, { useState } from "react";
import { Column } from "../../../../../../apps";
import SubActivityModal from "./Modals/SubActivityModal";

const SubActivitiesMaster = (props) => {
    const subActivities = props?.object?.subActivities || [];

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [subActivityDetailsObj, setSubActivityDetailsObj] = useState({});
    const [refresh, setRefresh] = useState(Date.now());

    const reloadPage = (refreshData) => {
        props?.reloadPage(refreshData, 'Sub Activities Master');
        setShowModal(false)
    }

    const handleModal = (modalAction = 'add', modalInfoObj = null) => {
        if (modalAction === 'add') {
            setModalTitle('Add Sub Activity')
            setSubActivityDetailsObj(modalInfoObj)
        }

        if (modalAction === 'edit') {
            setModalTitle('Edit Sub Activity')
            setSubActivityDetailsObj(modalInfoObj)
        }

        setRefresh(Date.now());
        setShowModal(true);
    }

    return (
        <div className="dashboard-main-content">
            <div className='d-flex justify-content-between'>
                <h2 className="master_settings_heading">Sub Activity Master</h2>
                <button className="btn btn-primary float-end mb-2" disabled={+props.object?.selectedActivity.length === 0} onClick={(e) => { handleModal('add', subActivities[0]) }}>Add Sub Activity</button>
            </div>
            <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                <table className="table-scroll">
                    <thead>
                        <tr>
                            {Column.subActivityMaster().map((itm, idx) => {
                                let data = Object.values(itm)
                                return (<th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>)
                            })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {subActivities.map((itm, idx) => {
                            return (<>
                                <tr key={idx}>
                                    <td>{idx + 1}.</td>
                                    <td>{itm.scheme_id}</td>
                                    <td>{itm.major_component_id}</td>
                                    <td>{itm.sub_component_id}</td>
                                    <td>{itm.activity_master_id}</td>
                                    <td>{itm.id}</td>
                                    <td>{itm.activity_master_details_name}</td>
                                    <td className="text-center">
                                        <button className="btn btn-primary" title="Edit Sub Activity" onClick={(e) => { handleModal('edit', itm) }}><i className="bi bi-pencil-square"></i></button>
                                    </td>
                                </tr>
                            </>)
                        }
                        )}
                    </tbody>
                </table>
            </div>

            {showModal === true && <SubActivityModal
                object={{
                    showModal: showModal,
                    setShowModal: setShowModal,
                    title: modalTitle,
                    data: subActivityDetailsObj,
                    selectedScheme: props?.object?.selectedScheme,
                    selectedMajorComponent: props?.object?.selectedMajorComponent,
                    selectedSubComponent: props?.object?.selectedSubComponent,
                    selectedActivity: props.object?.selectedActivity,
                    refresh: refresh
                }}
                reloadPage={reloadPage}
            />}
        </div>
    );
};

export default SubActivitiesMaster;
