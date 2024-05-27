import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from "../../../../../../../apps";

const ModalYearAdd = (props) => {
  const yearName = props?.years.map(x => x.year_name);
  const yearCode = props?.years.map(x => x.year_code);

  const [show, setShow] = useState(false);
  const [year_code, setyear_code] = useState();
  const [year_name, setyear_name] = useState();
  const [status, setStatus] = useState();
  const [codemsg, setfmsg] = useState("Year Code is required");
  const [namemsg, setfmsgname] = useState("Year Name is required");
  const [actmsg, setfmsgact] = useState("Year Status is required");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRefresh = () => {
    props.reloadPage(Date.now());
  }

  const checkInvalidYear = () => {
    const years = yearName.flatMap(range => {
      const [start, end] = range.split('-').map(Number);
      return Array.from({ length: end - start +  1 }, (_, i) => start + i);
    });
  
    let minYear = Math.min(...years);

    let duplicateYear = yearName.includes(year_name) || yearCode.includes(+year_code) ? true :  false;

    let lessThanLowestYear = minYear > +year_name.split("-")[0] ? true : false;

    if(duplicateYear === true){
      return "Duplicate year entered."
    }
    else if(lessThanLowestYear === true){
      return "You can't enter year before " + minYear;
    }
    else{
      return false;
    }
  }

  

  const handleSubmit = () => {
    if (!year_name) {
      return setfmsgname("Year Name is required")
    }
    if (!year_code) {
      return setfmsg("Year Code is required")
    }
    if (!status) {
      return setfmsgact("Status is required")
    }

    let checkInvalidYearFlag = checkInvalidYear();

    if(checkInvalidYearFlag === false){
      API.post("api/master-settings/add-master-year", { year_code: year_code, year_name: year_name, status: status },
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
    else{
      sweetAlert.warning(checkInvalidYearFlag);
    }
  }

  return (
    <>
      <Button variant="primary" className='btn-sm' onClick={handleShow}>Add</Button>

      <Modal dialogClassName={'modal-dialog-centered'} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-white'>Add Master Year</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label for="year-name" className="form-label">Year Name</label>

            <input type="text" className="form-control ps-3" value={year_name} onChange={e => setyear_name(e.target.value)} id="year-name" required />
            <div id="year-name-validation" className="form-text fw-bold">{year_name ? null : namemsg}</div>
          </div>

          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">Year Code</label>

            <input type="number" className="form-control ps-3" id="year-code" value={year_code} onChange={e => setyear_code(e.target.value.substring(0,8))} required />
            <div id="year-code-validation" className="form-text fw-bold">{year_code ? null : codemsg}</div>
          </div>

          <div className="mb-3">
            <select className="form-select ps-3" value={status} onChange={e => setStatus(e.target.value)} aria-label="Year status selection">

              <option selected>Select Status</option>
              <option value="1">Active</option>
              <option value="0">Pending</option>
            </select>
            <div id="year-status-validation" className="form-text fw-bold">{actmsg ? null : actmsg}</div>
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

export default ModalYearAdd