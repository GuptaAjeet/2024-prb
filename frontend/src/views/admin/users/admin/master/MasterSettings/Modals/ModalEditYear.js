import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from "../../../../../../../apps";

const ModalEditYear = (props) => {
  const [show, setShow] = useState(false);
  const [year_code, setyear_code] = useState(props?.year_code);
  const [year_name, setyear_name] = useState(props?.year_name);
  const [codemsg, setfmsg] = useState();
  const [namemsg, setfmsgname] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRefresh = () => {
    props.reloadPage(Date.now());
  }

  const handleSubmit = () => {
    if (!year_name) {
      return setfmsgname("Year Name is required")
    }
    if (!year_code) {
      return setfmsg("Year Code is required")
    }

    API.post(
      props.url,
      { id: props?.id, year_code: year_code, year_name: year_name },
      (res) => {
        if (res.data == 1) {
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
      <Button variant="primary" className='btn-sm' onClick={handleShow}>Edit</Button>

      <Modal dialogClassName={'modal-dialog-centered'} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-white'>Edit Master Year</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label for="year-code" className="form-label">Year Code</label>

            <input type="text" className="form-control ps-3" id="year-code" value={year_code} onChange={e => setyear_code(e.target.value)} aria-describedby="year-code" required />
            <div id="year-code-validation" className="form-text fw-bold">{year_code ? null : codemsg}</div>
          </div>

          <div className="mb-3">
            <label for="year-name" className="form-label">Year Name</label>

            <input type="text" className="form-control ps-3" value={year_name} onChange={e => setyear_name(e.target.value)} id="year-name" required />
            <div id="year-name-validation" className="form-text fw-bold">{year_name ? null : namemsg}</div>
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

export default ModalEditYear