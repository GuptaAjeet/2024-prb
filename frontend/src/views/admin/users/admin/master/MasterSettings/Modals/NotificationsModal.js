import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { Hook, API, Model, AlertMessages, sweetAlert } from '../../../../../../../apps';

const NotificationsModal = (props) => {
    const SOption = Hook.useStates();
    const DOption = Hook.useDistricts();
    const notificationType = Model.notificationType();

    const [type, setType] = useState('0');
    const [selectedState, setSelectedState] = useState(0);
    const [selectedDistrict, setSelectedDistrict] = useState(0);
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [notificationId, setNotificationId] = useState(0);

    useEffect(() => {
        setType(props?.object?.notificationType);
        setSelectedState(props?.object?.selectedState);
        setSelectedDistrict(props?.object?.selectedDistrict);
        setNotificationMessage(props?.object?.selectedNotificationMessage);
        setNotificationId(props?.object?.selectedNotificationId);
    }, [props]);

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    const handleClose = () => props?.object?.setShowModal(false);

    const handleSubmit = () => {
        if (type === '0') {
            sweetAlert.warning(`Please select Notification type.`);
        }
        else if (notificationMessage === null) {
            sweetAlert.warning(`Please enter Notification message.`);
        }
        else if (type === 'STATE' && selectedState === 0) {
            sweetAlert.warning(`Please select State.`);
        }
        else if (type === 'DISTRICT' && (selectedState === 0 || selectedDistrict === 0)) {
            sweetAlert.warning(`Please select State/District.`);
        }
        else {
            API.post(
                "api/master-settings/handle-notifications",
                { flag: props?.object?.title === "Add Notification" ? 'add' : 'edit', id: notificationId, data: { state_id: selectedState, type: type, district_id: selectedDistrict, message: notificationMessage } },
                (res) => {
                    if (res?.message === "success") {
                        handleRefresh();
                        sweetAlert.done({ msg: AlertMessages.saveDataMsg });
                        handleClose();
                    } else {
                        sweetAlert.warning(AlertMessages.errorMsg);
                    }
                    handleClose();
                }
            );
        }
    }

    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered'} show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={type} onChange={e => setType(e.target.value)} aria-label="Select notification type">
                            <option value="0">--Select Notification Type--</option>
                            {(notificationType && notificationType.length > 0) && notificationType.map((itm, idx) =>
                                <option key={idx} value={itm.value}>{itm.name}</option>
                            )}
                        </select>
                    </div>

                    {(type === "STATE" || type === "DISTRICT") && <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={selectedState} onChange={e => setSelectedState(e.target.value)} aria-label="Select state">
                            <option value="0">--Select State--</option>
                            {(SOption && SOption.length > 0) && SOption.map((itm, idx) =>
                                <option key={idx} value={+itm.id}>{itm.name}</option>
                            )}
                        </select>
                    </div>}

                    {(type === "DISTRICT") && <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} aria-label="Select district">
                            <option value="0">--Select District--</option>
                            {(selectedState > 0 && DOption && DOption.length > 0)
                                && DOption.filter(x => x.district_state_id === +selectedState).map((itm, idx) =>
                                    <option key={idx} value={+itm.id}>{itm.district_name}</option>
                                )}
                        </select>
                    </div>}

                    <div className="mb-3">
                        <label>
                            Notification Message:
                            <textarea name="notification-message" value={notificationMessage} placeholder='Type notification message here...' onChange={e => setNotificationMessage(e.target.value)} rows={4} cols={60} />
                        </label>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                    <Button variant="success" onClick={handleSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NotificationsModal