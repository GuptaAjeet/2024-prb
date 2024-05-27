import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { API, AlertMessages, sweetAlert } from '../../../../../../../apps';

const SystemPermissionEditModal = (props) => {
    const [menuPermissionObj, setMenuPermissionObj] = useState({
        "id": 0,
        "role_id": 0,
        "menu_id": 0,
        "parent_id": 0
    })
    const [ROptions, setROptions] = useState([]);
    const [smenu, setMenu] = useState([]);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);

    useEffect(() => {
        setMenuPermissionObj(props?.object?.data);
        setROptions(props?.object?.roles);
        setMenu(props?.object?.smenu)
        setSelectedMenus(props?.object?.allSavedData?.filter(itm=>itm.role_id===props?.object?.data?.role_id))
    }, [props]);

    useEffect(()=>{
        API.post(
            "api/master-settings/get-role-permissions",
            {role_id: props?.object?.data?.role_id},
            (res) => {
                if (res?.status) {
                    setRolePermissions(res.data)
                }
            }
        );
    }, [])

    const handleRefresh = () => {
        props?.reloadPage(Date.now());
    }

    const handleClose = () => props?.object?.setShowModal(false);

    const saveData = () => {
        
        API.post(
            "api/master-settings/update-role-permission",
            {
                role_id:  props?.object?.data?.role_id,
                permissions :  rolePermissions
            },
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
        if (rolePermissions.filter(item=>!!item.menu_id).length === 0) {
            sweetAlert.warning(`Please select atleast one Permission.`);
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
    
    const onInputChange = (e, menu) =>{
        setRolePermissions(prevState=>{
            if(e.target.checked){
                prevState = prevState.map(im=>{
                    if(im.id===menu.id){
                        im.menu_id= im.id;
                        return im
                    }
                    return im
                })
            }else{
                prevState = prevState.map(im=>{
                    if(im.id===menu.id){
                        im.menu_id= null;
                        return im
                    }
                    return im
                })
            }
            // console.log("onInputChange", prevState, prevState.filter(item=>!!item.menu_id).length )
            return prevState;
        })
    }


    return (
        <>
            <Modal dialogClassName={'modal-dialog-centered modal-xl'} show={props?.object?.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-white'>Edit Permission - {ROptions.find(itm=>+itm.id===+props?.object?.data?.role_id)?.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{height: "700px", overflowY: "scroll"}}>
                    <div className='row'>
                        <h5 style={{fontWeight:700, padding:"0px"}}>Plan</h5>
                        {rolePermissions.filter((sm)=>!sm.parent_id && sm.module_group==="[\"plan\"]").map((menuItem, mIIndex)=>{
                            return <div className='col-sm-4 p-1'>
                            <label className='fw-normal'>{mIIndex+1}.</label> <input type='checkbox' defaultChecked={menuItem.menu_id} 
                                onChange={(e)=>onInputChange(e, menuItem)} id={menuItem.id}
                            /> <label htmlFor={menuItem.id} > {menuItem.name}</label>

                            {rolePermissions.filter(itm=>+itm.parent_id===+menuItem.id).length>0 && <div className='row' style={{paddingLeft: "20px"}}>
                                {rolePermissions.filter(itm=>+itm.parent_id===+menuItem.id)?.map((subMenu)=><div className='col-sm-12'>
                                    <input type='checkbox' defaultChecked={subMenu.menu_id} 
                                        onChange={(e)=>onInputChange(e, subMenu)} id={subMenu.id}
                                    /> <label htmlFor={subMenu.id} className='fw-normal'>{rolePermissions.filter((x) => +x.id === +subMenu.id)[0]?.name}</label></div>)}
                            </div>}
                        </div>})}

                        <h5 style={{fontWeight:700, padding:"0px", marginTop:"20px"}}>Allocation</h5>
                        {rolePermissions.filter((sm)=>!sm.parent_id && sm.module_group==="[\"allocation\"]").map((menuItem, mIIndex)=>{
                            return <div className='col-sm-4 p-1'>
                            <label className='fw-normal'>{mIIndex+1}.</label> <input type='checkbox' defaultChecked={menuItem.menu_id} 
                                onChange={(e)=>onInputChange(e, menuItem)} id={menuItem.id}
                            /> <label htmlFor={menuItem.id} >{menuItem.name}</label>

                            {rolePermissions.filter(itm=>+itm.parent_id===+menuItem.id).length>0 && <div className='row' style={{paddingLeft: "20px"}}>
                                {rolePermissions.filter(itm=>+itm.parent_id===+menuItem.id)?.map((subMenu)=><div className='col-sm-12'>
                                    <input type='checkbox' defaultChecked={subMenu.menu_id} 
                                        onChange={(e)=>onInputChange(e, subMenu)} id={subMenu.id}
                                    /> <label htmlFor={subMenu.id} className='fw-normal'>{rolePermissions.filter((x) => +x.id === +subMenu.id)[0]?.name}</label></div>)}
                            </div>}
                        </div>})}

                        

                        <h5 style={{fontWeight:700, padding:"0px", marginTop:"20px"}}>Progress</h5>
                        {rolePermissions.filter((sm)=>!sm.parent_id && sm.module_group==="[\"progress\"]").map((menuItem,mIIndex)=>{
                            return <div className='col-sm-4 p-1'>
                             <label className='fw-normal'>{mIIndex+1}.</label> <input type='checkbox' defaultChecked={menuItem.menu_id} 
                                onChange={(e)=>onInputChange(e, menuItem)} id={menuItem.id}
                            /> <label htmlFor={menuItem.id} >{menuItem.name}</label>

                            {rolePermissions.filter(itm=>+itm.parent_id===+menuItem.id).length>0 && <div className='row' style={{paddingLeft: "20px"}}>
                                {rolePermissions.filter(itm=>+itm.parent_id===+menuItem.id)?.map((subMenu)=><div className='col-sm-12'>
                                    <input type='checkbox' defaultChecked={subMenu.menu_id} 
                                        onChange={(e)=>onInputChange(e, subMenu)} id={subMenu.id}
                                    /> <label htmlFor={subMenu.id} className='fw-normal'>{rolePermissions.filter((x) => +x.id === +subMenu.id)[0]?.name}</label></div>)}
                            </div>}
                        </div>})}

                        
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

export default SystemPermissionEditModal