import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert, Model } from '../../../../../../../apps';

const ModalGroupAdd = (props) => {
    const groupName = props?.group.map(x => x.group_name);
    const groupCode = props?.group.map(x => x.group_code);
    const [show, setShow] = useState(false);
    const [group_code, setGroup_code] = useState();
    const [group_name, setGroup_name] = useState();
    const [group_description, setGroup_description] = useState();
    const [group_type, setGroup_type] = useState(0);
    const [codemsg, setfmsg] = useState(AlertMessages.groupDescriptionRequiredMsg);
    const [namemsg, setfmsgname] = useState(AlertMessages.groupNameRequiredMsg);
    const [actmsg, setfmsgact] = useState(AlertMessages.groupCodeRequiredMsg);
    const [grptypemsg, setgrptypemsg] = useState(AlertMessages.groupTypeRequiredMsg);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRefresh = () => {
        props.reloadPage(Date.now());
    }

    useEffect(() => {
        if (group_name?.trim().length > 0) {
            let groupCode = group_name.split(" ").map(word => word[0] && word[0].trim().length > 0 ? word[0].toUpperCase() : '').join("");
            groupCode += props?.group.length;
            setGroup_code(groupCode)
        }
    }, [group_name])

    const checkInvalidGroup = () => {
        let duplicateName = groupName.includes(group_name) ? true : false;
        let duplicateCode = groupCode.includes(group_code) ? true : false;

        if (duplicateName === true) {
            return AlertMessages.duplicateNameMsg;
        }
        else if (duplicateCode === true) {
            return AlertMessages.duplicateCodeMsg;
        }
        else {
            return false;
        }
    }

    const handleSubmit = () => {
        if (!group_name) {
            return setfmsgname(AlertMessages.groupNameRequiredMsg);
        }
        if (!group_description) {
            return setfmsg(AlertMessages.groupDescriptionRequiredMsg);
        }
        if (!group_code) {
            return setfmsgact(AlertMessages.groupCodeRequiredMsg);
        }
        if (!group_type) {
            return setgrptypemsg(AlertMessages.groupTypeRequiredMsg);
        }

        let checkInvalidGroupFlag = checkInvalidGroup();

        if (checkInvalidGroupFlag === false) {
            API.post("api/master-settings/add-group", { group_code: group_code, group_name: group_name, group_description: group_description, group_type: group_type },
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
        else {
            sweetAlert.warning(checkInvalidGroupFlag);
        }
    }

    return (
        <>
            <Button variant="primary" className='btn-sm' onClick={handleShow}>Add</Button>

            <Modal dialogClassName={'modal-dialog-centered'} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>Add Group User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <label for="group-name" className="form-label">Group Name</label>

                        <input type="text" className="form-control ps-3" value={group_name} onChange={e => setGroup_name(e.target.value)} id="group-name" required />
                        <div id="group-name-validation" className="form-text fw-bold">{group_name ? null : namemsg}</div>
                    </div>

                    <div className="mb-3">
                        <label for="group-description" className="form-label">Group Description</label>

                        <input type="text" className="form-control ps-3" value={group_description} onChange={e => setGroup_description(e.target.value)} id="group-description" required />
                        <div id="group-description-validation" className="form-text fw-bold">{group_description ? null : actmsg}</div>
                    </div>

                    <div className="mb-3">
                        <label for="group-code" className="form-label">Group Code</label>

                        <input type="text" className="form-control ps-3" value={group_code} readOnly={true} id="group-code" />
                        {/* <div id="group-code-validation" className="form-text fw-bold">{group_code ? null : codemsg}</div> */}
                    </div>

                    <div className="mb-3">
                        <label for="group-type" className="form-label">Group Type</label>

                        <select className="form-select ps-3" name="group-type" value={group_type} onChange={(e) => setGroup_type(e.target.value)}>

                            <option value={0}>--Select Group Type--</option>
                            {Model.groupType && Model.groupType?.length > 0 && Model.groupType?.map((st, stidx) => {
                                return (<option key={`menu_${stidx}`} value={st.id}>{st.name}</option>);
                            })}
                        </select>
                        <div id="group-code-validation" className="form-text fw-bold">{group_type ? null : grptypemsg}</div>
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

export default ModalGroupAdd