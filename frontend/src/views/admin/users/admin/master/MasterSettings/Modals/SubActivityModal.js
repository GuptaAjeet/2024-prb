import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from '../../../../../../../apps';

const SubActivityModal = (props) => {
    const [subActivityObj, setSubActivityObj] = useState({})

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    useEffect(() => {
        console.log(props.object.data)
        setSubActivityObj({ ...props?.object?.data })
    }, [props]);

    const handleClose = () => props?.object?.setShowModal(false);

    const saveData = (maxID) => {
        let bodyData = {
            flag: props?.object?.title === "Add Sub Activity" ? 'add' : 'edit',
            id: subActivityObj.id || 0,
            data: {
                id: props?.object?.title === "Add Sub Activity" ? maxID : subActivityObj.id,
                scheme_id: props?.object?.selectedScheme[0].id,
                scheme_name: props?.object?.selectedScheme[0].name,
                major_component_id: props?.object?.selectedMajorComponent[0].id,
                major_component_name: props?.object?.selectedMajorComponent[0].name,
                sub_component_id: props?.object?.selectedSubComponent[0].id,
                sub_component_name: props?.object?.selectedSubComponent[0].name,
                activity_master_id: props.object?.selectedActivity[0].id,
                activity_master_name: props.object?.selectedActivity[0].name,
                activity_master_details_name: subActivityObj.activity_master_details_name              
            }
        }
        API.post("api/master-settings/handle-sub-activity", bodyData,
            (res) => {
                if (res?.message === "success") {
                    handleRefresh();
                    sweetAlert.done({ msg: AlertMessages.saveDataMsg });
                } else {
                    sweetAlert.warning(AlertMessages.errorMsg);
                }
                handleClose();
            }
        );
    }

    const handleSubmit = () => {
        API.get("api/master-settings/get-max-activity-details-id", null,
            (res) => {
                if (subActivityObj.activity_master_details_name.trim().length === 0) {
                    sweetAlert.warning(`Please enter Sub Activity Name.`);
                } else {
                    let newID = 1;
                    if (!isNaN(res?.data?.last_id)) {
                        newID = +res.data.last_id + 1;
                    }
                    sweetAlert.confirmation({
                        title: 'Confirmation',
                        msg: AlertMessages.saveDataConfirmationMsg,
                        noBtnText: 'No',
                        yesBtnText: 'Yes',
                        callback: () => saveData(newID)
                    })
                }
            })
    }

    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered'} show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <label for="selected-scheme" className="form-label">Scheme</label>
                        <input type="text" className="form-control ps-3" value={props?.object.selectedScheme[0]?.name} id="selected-scheme" readOnly={true} />
                    </div>

                    <div className="mb-3">
                        <label for="selected-major-component" className="form-label">Major Component</label>
                        <input type="text" className="form-control ps-3" value={props?.object.selectedMajorComponent[0]?.name} id="selected-major-component" readOnly={true} />
                    </div>

                    <div className="mb-3">
                        <label for="selected-major-component" className="form-label">Sub Component</label>
                        <input type="text" className="form-control ps-3" value={props?.object.selectedSubComponent[0]?.name} id="selected-sub-component" readOnly={true} />
                    </div>

                    <div className="mb-3">
                        <label for="selected-major-component" className="form-label">Activity</label>
                        <input type="text" className="form-control ps-3" value={props?.object.selectedActivity[0]?.name} id="selected-activity" readOnly={true} />
                    </div>

                    <div className="mb-3">
                        <label for="sub_component_name" className="form-label">Sub Activity</label>
                        <input type="text" className="form-control ps-3" id="sub_component_name" value={subActivityObj.activity_master_details_name} placeholder='Enter sub activity name'
                            onChange={e => setSubActivityObj({ ...subActivityObj, activity_master_details_name: e.target.value })} aria-describedby="Sub Activity Title" />
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

export default SubActivityModal