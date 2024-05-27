import React, { useEffect, useState } from "react";
import { API, Helper, Column } from "../../../../../../apps";
import MenuMasterModal from "./Modals/MenuMasterModal";

const MasterMenus = () => {
  const user = Helper.auth.user;

  const [smenu, setMenu] = useState([]);
  const [refresh, setRefresh] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [menuObj, setMenuObj] = useState({});

  useEffect(() => {
    API.post("api/master-settings/get-menus-system", { id: user?.user_role_id },
      (result) => {
        if (result.status) {
          setMenu(result?.data);
        }
      }
    );
  }, [refresh]);

  const handleModal = (modalAction = 'add', modalInfoObj = null) => {
    if (modalAction === 'add') {
      setModalTitle('Add Menu')
      setMenuObj({
        "id": 0,
        "url": '',
        "active_url": '',
        "name": '',
        "order_no": '',
        "menu_img": '',
        "parent_id": 0,
        "menu_list": smenu.filter(x => +x.parent_id === 0)
      })
    }
    else {
      if (modalInfoObj !== null) {
        setModalTitle('Edit Menu')
        setMenuObj({
          "id": modalInfoObj.id,
          "url": modalInfoObj.url,
          "active_url": modalInfoObj.active_url,
          "name": modalInfoObj.name,
          "order_no": modalInfoObj.order_no,
          "menu_img": modalInfoObj.menu_img,
          "parent_id": modalInfoObj.parent_id,
          "module_group": modalInfoObj.module_group,
          "menu_list": smenu.filter(x => +x.parent_id === 0)
        })
      }
    }
    setRefresh(Date.now());
    setShowModal(true);
  }

  const reloadPage = (refreshData) => {
    setRefresh(refreshData);
  }

  return (
    <>
      <div className='d-flex justify-content-between'>
        <h2 className="master_settings_heading">System Menus</h2>
        <button className="btn btn-primary float-end mb-2" onClick={(e) => { handleModal('add') }}>Add New Menu</button>
      </div>
      {(smenu && smenu.length > 0) &&
        <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
          <table className="table-scroll">
            <thead>
              <tr>
                {Column.masterMenus().map((itm, idx) => {
                  let data = Object.values(itm)
                  return (<th width={data[1]} className={data[2]} key={idx} >{data[0]}</th>)
                })
                }
              </tr>
            </thead>
            <tbody>
              {smenu?.map((itm, idx) =>
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{itm?.name}</td>
                  <td>{itm?.id}</td>
                  <td>{itm?.order_no}</td>
                  <td>{itm?.url}</td>
                  <td>{itm?.active_url}</td>
                  <td>{itm?.menu_img}</td>
                  <td className="text-center">
                    <button className="btn btn-primary" title="Edit Menu" onClick={(e) => { handleModal('edit', itm) }}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {showModal === true && <MenuMasterModal object={{ showModal: showModal, setShowModal: setShowModal, title: modalTitle, data: menuObj, refresh: refresh }} reloadPage={reloadPage} />}
        </div>}
    </>

  )
}

export default MasterMenus