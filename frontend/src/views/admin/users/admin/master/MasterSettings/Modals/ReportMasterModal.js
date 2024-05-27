import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from '../../../../../../../apps';

const ReportMasterModal = (props) => {
    const [report_url, set_report_url] = useState(props?.object?.data?.report_url);
    const [report_heading, set_report_heading] = useState(props?.object?.data?.report_heading);
    const [report_sub_heading, set_report_sub_heading] = useState(props?.object?.data?.report_sub_heading);
    const report_url_msg = "Report Url is required";
    const report_heading_msg = "Report Heading is required";
    const report_sub_heading_msg = "Report Sub Heading is required";

    const handleClose = () => props?.object?.setShowModal(false);

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    const saveData = () => {
        API.post("api/master-settings/add-update-report-master", { id: props?.object?.data?.id || 0, report_url, report_heading, report_sub_heading },
            (res) => {
                if (res.message === 'success') {
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

    const handleSubmit = () => {

        if (!report_url) {
            return;
        }
        if (!report_heading) {
            return;
        }
        if (!report_sub_heading) {
            return;
        }

        sweetAlert.confirmation({
            title: 'Confirmation',
            msg: AlertMessages.saveDataConfirmationMsg,
            noBtnText: 'No',
            yesBtnText: 'Yes',
            callback: saveData
        })
    }

    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered'} show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className={'modal-scroll-2'}>
                    <div className="mb-3">
                        <label for="report-url" className="form-label">Report Url</label>

                        <input type="text" className="form-control ps-3" id="report-url" value={report_url} onChange={e => set_report_url(e.target.value)} required />
                        <div id="report-url-validation" className="form-text fw-bold">{report_url ? null : report_url_msg}</div>
                    </div>

                    <div className="mb-3">
                        <label for="report-heading" className="form-label">Report Heading</label>

                        <input type="text" className="form-control ps-3" id="report-heading" value={report_heading} onChange={e => set_report_heading(e.target.value)} required />
                        <div id="report-heading-validation" className="form-text fw-bold">{report_heading ? null : report_heading_msg}</div>
                    </div>

                    <div className="mb-3">
                        <label for="report-sub-heading" className="form-label">Report Sub Heading</label>

                        <input type="text" className="form-control ps-3" id="report-sub-heading" value={report_sub_heading} onChange={e => set_report_sub_heading(e.target.value)} required />
                        <div id="report-sub-heading-validation" className="form-text fw-bold">{report_sub_heading ? null : report_sub_heading_msg}</div>
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

export default ReportMasterModal;