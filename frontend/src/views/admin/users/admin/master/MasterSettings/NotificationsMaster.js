import React, { useState, useEffect } from "react";
import { API, Column } from "../../../../../../apps";
import NotificationsModal from "./Modals/NotificationsModal";

const NotificationsMaster = () => {
    const [notifications, setNotifications] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [modalTitle, setModalTitle] = useState(null)
    const [selectedNotificationType, setSelectedNotificationType] = useState('0')
    const [selectedState, setSelectedState] = useState(0)
    const [selectedDistrict, setSelectedDistrict] = useState(0)
    const [selectedNotificationMessage, setSelectedNotificationMessage] = useState(null)
    const [selectedNotificationId, setSelectedNotificationId] = useState(0)
    const [refresh, setRefresh] = useState(Date.now())
    const [refreshPage, setRefreshPage] = useState(Date.now())

    useEffect(() => {
        API.post(
            "api/master-settings/get-notifications",
            {},
            (result) => {
                if (result.status) {
                    setNotifications(result?.data);
                }
            }
        );
    }, [refreshPage]);

    const handleModal = (modalAction = 'add', modalInfoObj = null) => {
        if (modalAction === 'add') {
            setModalTitle('Add Notification')
            setSelectedNotificationType(0)
            setSelectedState(0)
            setSelectedDistrict(0)
            setSelectedNotificationMessage(null)
            setSelectedNotificationId(0)
        }
        else {
            if (modalInfoObj !== null) {
                setModalTitle('Edit Notification')
                setSelectedNotificationType(modalInfoObj?.type)
                setSelectedState(+modalInfoObj?.state_id !== 0 ? modalInfoObj?.state_id : 0)
                setSelectedDistrict(+modalInfoObj?.district_id !== 0 ? modalInfoObj?.district_id : 0)
                setSelectedNotificationMessage(modalInfoObj?.message)
                setSelectedNotificationId(modalInfoObj?.id)
            }
        }
        setRefresh(Date.now());
        setShowModal(true);
    }

    const reloadPage = (refreshData) => {
        setRefreshPage(refreshData);
    }

    return (
        <div className="dashboard-main-content">
            <div className='d-flex justify-content-between'>
                <h2 className="master_settings_heading">Notification Master</h2>
                <button className="btn btn-primary float-end mb-2"
                    onClick={(e) => { handleModal() }}>Add Notification</button>
            </div>
            <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                {(notifications.length > 0)
                    && <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.notificationsMaster().map((itm, idx) => {
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
                            {notifications.map((itm, idx) => {
                                return (<>
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{itm.id}</td>
                                        <td>{itm.message}</td>
                                        <td>{itm.type}</td>
                                        <td>{+itm.status === 1 ? 'Read' : 'Un-read'}</td>
                                        <td className="text-center">
                                            <button className="btn btn-primary" title="Edit Notification" onClick={(e) => { handleModal('edit', itm) }}><i className="bi bi-pencil-square"></i></button>
                                        </td>
                                    </tr>
                                </>)
                            }
                            )}
                        </tbody>
                    </table>}
            </div>
            {showModal == true && <NotificationsModal
                object={{
                    showModal: showModal,
                    setShowModal: setShowModal,
                    title: modalTitle,
                    notificationType: selectedNotificationType,
                    selectedState: selectedState,
                    selectedDistrict: selectedDistrict,
                    selectedNotificationMessage: selectedNotificationMessage,
                    selectedNotificationId: selectedNotificationId,
                    refresh: refresh,
                }}
                reloadPage={reloadPage}
            />}
        </div>
    );
};

export default NotificationsMaster;
