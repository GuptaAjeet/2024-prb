import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { API, AlertMessages, sweetAlert } from "../../../../../../../apps";

const ModalAdd = (props) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRefresh = () => props?.reloadPage(Date.now());

  const handleSubmit = () => {
    const major_component_id = props?.object.selectedMajorComponent[0]?.id;
    const scheme_id = props?.object.selectedScheme[0]?.id;
    const sub_component_id = props?.object.selectedSubComponent[0]?.id;
    let id;

    if (props?.object.act.length > 0) {
      id = +props?.object.act[0]?.max_activity_master_id + 1;
    }

    if (!major_component_id || !sub_component_id || !title) {
      sweetAlert.warning(`Validation failed. Please all the fields.`);
      handleClose();
    } else {
      API.get("api/master-settings/get-max-activity-master-id", null, (res) => {
        if (!isNaN(res?.data?.last_id)) {
          id = +res.data.last_id + 1;
        }
        API.post(
          "api/master-settings/add-activity", { id, major_component_id, scheme_id, sub_component_id, title },
          (res) => {
            if (res?.message === "success") {
              handleRefresh();
              sweetAlert.done({ msg: AlertMessages.saveDataMsg });
              handleClose();
            } else {
              sweetAlert.warning(AlertMessages.errorMsg);
              handleClose();
            }
          }
        );
      });
    }
  };

  return (
    <>
      <Button variant="primary" disabled={props?.object?.selectedSubComponent.length === 0} onClick={handleShow}> Add Activity </Button>

      <Modal dialogClassName={'modal-dialog-centered'} size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">Add Activity</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label for="selected-scheme" className="form-label"> Scheme </label>
            <input type="text" className="form-control ps-3" value={props?.object.selectedScheme[0]?.name} id="selected-scheme" readOnly={true} />
          </div>

          <div className="mb-3">
            <label for="selected-major-component" className="form-label"> Major Component </label>
            <input type="text" className="form-control ps-3" value={props?.object.selectedMajorComponent[0]?.name} id="selected-major-component" readOnly={true} />
          </div>

          <div className="mb-3">
            <label for="selected-sub-component" className="form-label"> Sub Component </label>
            <input type="text" className="form-control ps-3" value={props?.object.selectedSubComponent[0]?.name} id="selected-sub-component" readOnly={true} />
          </div>

          <div className="mb-3">
            <label for="activity-name" className="form-label"> Activity </label>
            <input type="text" className="form-control ps-3" value={title} onChange={(e) => setTitle(e.target.value)} id="activity-name" placeholder="Enter Activity Name" required />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}> Close </Button>
          <Button variant="success" onClick={handleSubmit}> Save Changes </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAdd;
