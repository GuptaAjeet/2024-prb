import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from '../../../../../../../apps';

const SubComponentModal = (props) => {
    const [subComponentObj, setSubComponentObj] = useState({
        sub_component_id: 0,
        scheme_id: 0,
        major_component_id: 0,
        title: null,
        serial_order: 0,
        max_sub_component_id: 0,
        max_serial_order: 0
    })

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    useEffect(() => {
        setSubComponentObj(props?.object?.data)
        console.log(props?.object?.data)
    }, [props]);

    const handleClose = () => props?.object?.setShowModal(false);

    const handleSubmit = () => {
        if (subComponentObj.title === null) {
            sweetAlert.warning(`Please enter Sub Component Name.`);
        }
        else {
            let bodyData = {
                flag: props?.object?.title === "Add Sub Component" ? 'add' : 'edit',
                sub_component_id: subComponentObj.sub_component_id,
                data: {
                    sub_component_id: +subComponentObj.sub_component_id,
                    scheme_id: props?.object?.selectedScheme[0]?.id,
                    major_component_id: props?.object?.selectedMajorComponent[0]?.id,
                    title: subComponentObj.title,
                }
            }
            API.post("api/master-settings/handle-sub-component", bodyData,
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
                        <label for="sub_component_name" className="form-label">Sub Component</label>
                        <input type="text" className="form-control ps-3" id="sub_component_name" value={subComponentObj.title} placeholder='Enter sub component name'
                            onChange={e => setSubComponentObj({ ...subComponentObj, title: e.target.value })} aria-describedby="Sub Component Title" />
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

export default SubComponentModal;