import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap';
import MultiSelect from '../../../../../../../apps/components/form/MultiSelect';
import { API, Model, AlertMessages, sweetAlert } from '../../../../../../../apps';

const MenuMasterModal = (props) => {
  const [url, seturl] = useState(props?.object?.data?.url);
  const [active_url, setactive_url] = useState(props?.object?.data?.active_url);
  const [menu_img, setmenu_img] = useState(props?.object?.data?.menu_img);
  const [name, setname] = useState(props?.object?.data?.name);
  const [order_no, setorder_no] = useState(props?.object?.data?.order_no);
  const [parent_id, setparent_id] = useState(props?.object?.data?.parent_id);
  const [selectedModuleList, setSelectedModuleList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [menu_url, setmenu_url] = useState("Menu Url is required");
  const [acturl, setfmsg] = useState("Active Url is required");
  const [namemsg, setfmsgname] = useState("Name is required");
  const [orderno, setfmsgact] = useState("Order No. is required");
  const [img, setimgc] = useState("Image is required");
  const [parentIdMsg, setparentIdMsg] = useState("Parent ID is required");
  const [moduleListMsg, setModuleListMsg] = useState("Module List is required");
  const menuList = props?.object?.data?.menu_list;

  const handleClose = () => props?.object?.setShowModal(false);

  const handleRefresh = () => {
    props?.reloadPage(Date.now());
  }

  useEffect(() => {
    if (props?.object?.data?.module_group) {
      setSelectedModuleList((JSON.parse(props?.object?.data?.module_group)).map(x => { return { name: x.toUpperCase(), value: x } }))
      setModuleList((JSON.parse(props?.object?.data?.module_group)).map(x => { return { name: x.toUpperCase(), value: x } }))
    }
    else {
      setSelectedModuleList([{ name: "PLAN", value: "plan" }])
      setModuleList([{ name: "PLAN", value: "plan" }])
    }
  }, [props])

  const saveData = () => {
    let module_group = JSON.stringify(moduleList.map(x => x.value));

    API.post("api/master-settings/add-update-menu", { id: props?.object?.data?.id || 0, active_url, menu_img, order_no, url, name, parent_id, module_group, status: 1 },
      (res) => {
        if (res.message === 'success') {
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

  const handleSubmit = () => {
    console.log(isNaN(parent_id), moduleList.length)
    if (!url) {
      return setmenu_url("Menu Url is required")
    }
    if (!active_url) {
      return setfmsg("Active Url is required")
    }
    if (!name) {
      return setfmsgname("Name is required")
    }
    if (!order_no) {
      return setfmsgact("Order No. is required")
    }
    if (!menu_img) {
      return setimgc("Image is required")
    }
    if (isNaN(parent_id)) {
      return setparentIdMsg("Parent ID is required")
    }
    if (moduleList.length === 0) {
      return setModuleListMsg("Module List is required")
    }

    sweetAlert.confirmation({
      title: 'Confirmation',
      msg: AlertMessages.saveDataConfirmationMsg,
      noBtnText: 'No',
      yesBtnText: 'Yes',
      callback: saveData
    })
  }

  return (
    <>
      <Modal dialogClassName={'modal-dialog-centered'} show={props?.object?.showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-white'>{props?.object?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className={'modal-scroll-2'}>
          <div className="mb-3">
            <label for="active-url" className="form-label">Menu Url</label>

            <input type="text" className="form-control ps-3" value={url} onChange={e => seturl(e.target.value)} id="menu-url" required />
            <div id="menu-url-validation" className="form-text fw-bold">{url ? null : menu_url}</div>
          </div>

          <div className="mb-3">
            <label for="active-url" className="form-label">Active Url</label>

            <input type="text" className="form-control ps-3" value={active_url} onChange={e => setactive_url(e.target.value)} id="active-url" required />
            <div id="active-url-validation" className="form-text fw-bold">{active_url ? null : acturl}</div>
          </div>

          <div className="mb-3">
            <label for="menu-image" className="form-label">Menu Image</label>

            <input type="text" className="form-control ps-3" id="menu-image" value={menu_img} onChange={e => setmenu_img(e.target.value)} required />
            <div id="menu-image-validation" className="form-text fw-bold">{menu_img ? null : img}</div>
          </div>

          <div className="mb-3">
            <label for="menu-name" className="form-label">Menu Name</label>

            <input type="text" className="form-control ps-3" id="menu-name" value={name} onChange={e => setname(e.target.value)} required />
            <div id="menu-name-validation" className="form-text fw-bold">{name ? null : namemsg}</div>
          </div>

          <div className="mb-3">
            <label for="order-number" className="form-label">Order Number</label>

            <input type="number" className="form-control ps-3" id="order-number" value={order_no} onChange={e => setorder_no(e.target.value)} required />
            <div id="order-number-validation" className="form-text fw-bold">{order_no ? null : orderno}</div>
          </div>

          <div className="mb-3">
            <select className="form-select ps-3" name="state-list" value={parent_id} onChange={(e) => setparent_id(e.target.value)}>

              <option value={0}>--No Parent--</option>
              {menuList && menuList?.length > 0 && menuList?.map((st, stidx) => {
                  return (<option key={`menu_${stidx}`} value={st.id}>{st.name}</option>);
                })}
            </select>
            <div id="parent-id-validation" className="form-text fw-bold">{isNaN(parent_id) ? parentIdMsg : null}</div>
          </div>

          <div className="mb-3">
            <MultiSelect options={Model.modulesOfMenu} selectedValues={selectedModuleList} displayValues="name"
              attr={{
                id: `select-module-list`, name: `module-list`,
                onSelect: (e) => setModuleList(e),
                onRemove: (e) => setModuleList(e)
              }}
              label="Select Module(s)" default="Select Module(s)" mandatory="true" />
            <div id="select-module-list-validation" className="form-text fw-bold">{moduleList ? null : moduleListMsg}</div>
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

export default MenuMasterModal