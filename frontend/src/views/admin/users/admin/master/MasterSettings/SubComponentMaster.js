import React, { useState } from "react";
import { Column } from "../../../../../../apps";
import SubComponentModal from "./Modals/SubComponentModal";

const SubComponentMaster = (props) => {
    const subComponent = props.object?.subComponent || [];

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [subComponentDetailsObj, setSubComponentDetailsObj] = useState({
        sub_component_id: 0,
        scheme_id: 0,
        major_component_id: 0,
        title: null,
        serial_order: 0,
        max_sub_component_id: 0,
        max_serial_order: 0
    });
    const [refresh, setRefresh] = useState(Date.now());

    const reloadPage = (refreshData) => {
        props?.reloadPage(refreshData, 'Sub Components Master');
        setShowModal(false)
    }

    const handleModal = (modalAction = 'add', modalInfoObj = null) => {
        if (modalAction === 'add') {
            setModalTitle('Add Sub Component')
            setSubComponentDetailsObj({
                sub_component_id: 0,
                scheme_id: props?.data?.selectedScheme[0]?.id,
                major_component_id: modalInfoObj?.major_component_id,
                title: null,
                serial_order: 0,
                max_sub_component_id: modalInfoObj?.max_sub_component_id,
                max_serial_order: modalInfoObj?.max_serial_order
            })
        }
        else {
            if (modalInfoObj !== null) {
                setModalTitle('Edit Sub Component')
                setSubComponentDetailsObj({
                    sub_component_id: modalInfoObj?.id,
                    scheme_id: modalInfoObj?.scheme_id,
                    major_component_id: modalInfoObj?.major_component_id,
                    title: modalInfoObj?.name,
                    serial_order: modalInfoObj?.serial_order,
                    max_sub_component_id: modalInfoObj?.max_sub_component_id,
                    max_serial_order: modalInfoObj?.max_serial_order
                })
            }
        }
        setRefresh(Date.now());
        setShowModal(true);
    }

    return (
        <div className="dashboard-main-content">
        <div className='d-flex justify-content-between'>
            <h2 className="master_settings_heading">Sub Component Master</h2>
                <button className="btn btn-primary float-end mb-2" disabled={props?.object?.selectedMajorComponent.length === 0 ? true : false} onClick={(e) => { handleModal('add') }}>Add Sub Component</button>
            </div>
            <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                <table className="table-scroll">
                    <thead>
                        <tr>
                            {Column.subComponentMaster().map((itm, idx) => {
                                let data = Object.values(itm)
                                return ( <th width={data[1]} className={data[2]} key={idx}>{data[0]}</th> )
                            })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {subComponent.map((itm, idx) => {
                            return (<>
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{itm.id}</td>
                                    <td>{itm.name}</td>
                                    <td className="text-center">
                                        <button className="btn btn-primary" title="Edit Sub Component" onClick={(e) => { handleModal('edit', itm) }}><i className="bi bi-pencil-square"></i></button>
                                    </td>
                                </tr>
                            </>)
                        }
                        )}
                    </tbody>
                </table>
            </div>

            {showModal === true && <SubComponentModal
                object={{
                    showModal: showModal,
                    setShowModal: setShowModal,
                    title: modalTitle,
                    data: subComponentDetailsObj,
                    selectedScheme: props?.object?.selectedScheme,
                    selectedMajorComponent: props?.object?.selectedMajorComponent,
                    refresh: refresh
                }}
                reloadPage={reloadPage}
            />}
        </div>
    );
};

export default SubComponentMaster;
