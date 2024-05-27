import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from '../../../../../../../apps';

const SystemPermissionModal = (props) => {
    const [menuPermissionObj, setMenuPermissionObj] = useState({
        "id": 0,
        "role_id": 0,
        "menu_id": 0,
        "parent_id": 0
    })
    const [ROptions, setROptions] = useState([]);
    const [smenu, setMenu] = useState([]);
    const [selectedMenus, setSelectedMenus] = useState([]);

    useEffect(() => {
        setMenuPermissionObj(props?.object?.data);
        setROptions(props?.object?.roles);
        setMenu(props?.object?.smenu)
        setSelectedMenus(props?.object?.allSavedData?.filter(itm=>itm.role_id===props?.object?.data?.role_id))
    }, [props]);

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    const handleClose = () => props?.object?.setShowModal(false);

    const saveData = () => {
        let bodyData = {
            flag: props?.object?.title === "Add New Permission" ? 'add' : 'edit',
            id: menuPermissionObj.id,
            parent_id: menuPermissionObj.parent_id,
            data: {
                role_id: menuPermissionObj.role_id,
                menu_id: menuPermissionObj.menu_id,
            }
        }
        API.post(
            "api/master-settings/handle-system-permission",
            bodyData,
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
        if (menuPermissionObj.role_id === 0) {
            sweetAlert.warning(`Please select Role.`);
        }
        else if (menuPermissionObj.menu_id === 0) {
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

    function groupBy(array, key) {
        return array.reduce((result, obj) => {
            // Get the value of the key for the current object
            const keyValue = obj[key];
            
            // Find the index of the group in the result array
            const groupIndex = result.findIndex(group => group.key === keyValue);
            
            // If the group doesn't exist, create a new one
            if (groupIndex === -1) {
                result.push({ key: keyValue, values: [obj] });
            } else {
                // Otherwise, push the current object to the existing group
                result[groupIndex].values.push(obj);
            }
            
            return result;
        }, []);
    }
    



    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered'} show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {(ROptions && ROptions.length > 0) && <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={menuPermissionObj?.role_id}
                            onChange={e => setMenuPermissionObj({ ...menuPermissionObj, role_id: e.target.value })}
                            aria-label="Default role">
                            <option value="0">--Select Role--</option>
                            {(ROptions && ROptions.length > 0) && ROptions.map((itm, idx) =>
                                <option key={idx} value={+itm.id}>
                                    {itm.name}
                                </option>
                            )}
                        </select>
                    </div>}

                    {(smenu && smenu.length > 0) && <div className="mb-3">
                        <select className="form-select ps-3" defaultValue={menuPermissionObj?.menu_id}
                            onChange={e => setMenuPermissionObj({ ...menuPermissionObj, menu_id: +smenu[e.target.value].id, parent_id: +smenu[e.target.value].parent_id })}
                            aria-label="Default menu">
                            <option value="0">--Select Menu--</option>
                            {(smenu && smenu.length > 0) && smenu.map((itm, idx) =>
                                <option key={idx} value={idx}> 
                                    {itm.name}
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

export default SystemPermissionModal