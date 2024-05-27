import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from "../../../../../../../apps";

const ModalEdit = (props) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(props?.object?.itm?.name);
  const [namemsg, setfmsgname] = useState("Activity field is required");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRefresh = () => {
    props?.reloadPage(Date.now());
  }

  const handleSubmit = () => {
    if (!title) {
      return setfmsgname("Activity field is required")
    }

    API.post(props.url, { id: props?.object?.id, title: title },
      (res) => {
        if (+res.data === 1) {
          handleRefresh();
          sweetAlert.done({ msg: AlertMessages.saveDataMsg });
          handleClose()
        } else {
          sweetAlert.warning(AlertMessages.errorMsg);
        }
        handleClose()
      }
    );
  }

  return (
    <>
      <Button variant="primary" className='btn-sm' title='Edit Activity' onClick={handleShow}><i className="bi bi-pencil-square"></i></Button>

      <Modal dialogClassName={'modal-dialog-centered'} show={show} onHide={handleClose}>
        <Modal.Header closeButton className='text-primary'>
          <Modal.Title className='text-white'>Edit Activity</Modal.Title>
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
            <label for="selected-sub-component" className="form-label">Sub Component</label>
            <input type="text" className="form-control ps-3" value={props?.object.selectedSubComponent[0]?.name} id="selected-sub-component" readOnly={true} />
          </div>

          <div className="mb-3">
            <label for="activity-name" className="form-label">Activity</label>
            <input type="text" className="form-control ps-3" value={title} onChange={e => setTitle(e.target.value)} id="activity-name" required />
            <div id="activity-name-validation" className="form-text fw-bold">{title ? null : namemsg}</div>
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

export default ModalEdit