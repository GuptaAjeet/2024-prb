import React,{ useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from "../../../../../../../apps";

const ModalMSTPEdit = (props) => {
  const [show, setShow] = useState(false);
  const [tentative_central_share, setactive_url] = useState(props?.tentative_central_share);
  const [tentative_state_share, setmenu_img] = useState(props?.tentative_state_share);
  const [tentative_total_estimates, setname] = useState(props?.tentative_total_estimates);
  const [acturl, setfmsg] = useState("Tentative Central Share is required");
  const [namemsg, setfmsgname] = useState("Tentative State Share is required");
  const [orderno, setfmsgact] = useState("Tentative Total Estimates is required");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRefresh = () => {
    props.reloadPage(Date.now());
  }

  const handleSubmit = () => {

    if (!tentative_central_share) {
      return setfmsg("Tentative Central Share is required")
    }
    if (!tentative_state_share) {
      return setfmsgname("Tentative State Share is required")
    }
    if (!tentative_total_estimates) {
      return setfmsgact("Tentative Total Estimates is required")
    }

    API.post("api/master-settings/update-mstp", { id: props?.id, tentative_central_share, tentative_state_share, tentative_total_estimates },
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
          <Modal.Title className='text-white'>Edit Data</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label for="tentative-central-share" className="form-label">Tentative Central Share</label>
            <input type="text" className="form-control ps-3" value={tentative_central_share} onChange={e => setactive_url(e.target.value)} id="tentative-central-share" required />
            <div id="tentative-central-share-validation" className="form-text fw-bold">{tentative_central_share ? null : acturl}</div>
          </div>

          <div className="mb-3">
            <label for="tentative-state-share" className="form-label">Tentative State Share</label>
            <input type="text" className="form-control ps-3" id="tentative-state-share" value={tentative_state_share} onChange={e => setmenu_img(e.target.value)} aria-describedby="tentative-state-share" required />
            <div id="tentative-state-share-validation" className="form-text fw-bold">{tentative_state_share ? null : namemsg}</div>
          </div>

          <div className="mb-3">
            <label for="tentative-total-estimates" className="form-label">Tentative Total Estimates</label>
            <input type="text" className="form-control ps-3" id="tentative-total-estimates" value={tentative_total_estimates} onChange={e => setname(e.target.value)} aria-describedby="tentative-total-estimates" required />
            <div id="tentative-total-estimates-validation" className="form-text fw-bold">{tentative_total_estimates ? null : orderno}</div>
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

export default ModalMSTPEdit