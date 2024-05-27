import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from '../../../../../../../apps';

const ReportPermissionsModal = (props) => {
    const [reportPermissionsObj, setReportPermissionsObj] = useState({
        "id": 0,
        "report_id": 0,
        "user_role_id": 0,
    })
    const [ROptions, setROptions] = useState([]);
    const [reportMaster, setReportsMaster] = useState([]);

    useEffect(() => {
        setReportPermissionsObj(props?.object?.data);
        setROptions(props?.object?.roles);
        setReportsMaster(props?.object?.reportMaster)
    }, [props]);

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    const handleClose = () => props?.object?.setShowModal(false);

    const saveData = () => {
        let bodyData = {
            flag: props?.object?.title === "Add New Permission" ? 'add' : 'edit',
            id: reportPermissionsObj.id,
            data: {
                user_role_id: reportPermissionsObj.user_role_id,
                report_id: reportPermissionsObj.report_id,
            }
        }
        API.post("api/master-settings/handle-report-permissions", bodyData,
            (res) => {
                if (res?.message === "success") {
                    handleRefresh();
                    sweetAlert.done({ msg: AlertMessages.saveDataMsg });
                    handleClose();
                } else {
                    sweetAlert.warning(res?.message);
                }
                handleClose();
            }
        );
    }

    const handleSubmit = () => {
        if (reportPermissionsObj.user_role_id === 0) {
            sweetAlert.warning(`Please select Role.`);
        }
        else if (reportPermissionsObj.report_id === 0) {
            sweetAlert.warning(`Please select Menu Name.`);
        }
        else {
            sweetAlert.confirmation({
                title: 'Confirmation',
                msg: AlertMessages.saveDataConfirmationMsg,
                noBtnText: 'No',
                yesBtnText: 'Yes',
                callback: saveData
            })
        }
    }

    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered'} show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {(ROptions && ROptions.length > 0) && <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={reportPermissionsObj?.user_role_id}
                            onChange={e => setReportPermissionsObj({ ...reportPermissionsObj, user_role_id: e.target.value })}
                            aria-label="Default role">
                            <option value="0">--Select Role--</option>
                            {(ROptions && ROptions.length > 0) && ROptions.map((itm, idx) =>
                                <option key={idx} value={+itm.id}>
                                    {itm.name}
                                </option>
                            )}
                        </select>
                    </div>}

                    {(reportMaster && reportMaster.length > 0) && <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={+reportPermissionsObj?.report_id}
                            onChange={e => setReportPermissionsObj({ ...reportPermissionsObj, report_id: +e.target.value })}
                            aria-label="Default report">
                            <option value="0">--Select Report--</option>
                            {(reportMaster && reportMaster.length > 0) && reportMaster.map((itm, idx) =>
                                <option key={idx} value={itm.id}>
                                    {itm.report_heading}
                                </option>
                            )}
                        </select>
                    </div>}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                    <Button variant="success" onClick={handleSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ReportPermissionsModal