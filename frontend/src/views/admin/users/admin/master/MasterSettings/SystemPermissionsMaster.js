import React, { useState, useEffect } from "react";
import { Helper, Hook, API, Column, AlertMessages, sweetAlert } from "../../../../../../apps";
import SystemPermissionModal from "./Modals/SystemPermissionModal";
import SystemPermissionEditModal from "./Modals/SystemPermissionEditModal";

const SystemPermissionsMaster = () => {
  const user = Helper.auth.user;
  const ROptions = Hook.useRoles();

  const [smenu, setMenu] = useState([]);
  const [smenuPermissions, setSMenuPermissions] = useState([]);
  const [menuPermissionObj, setMenuPermissionObj] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editShowModal, setEditShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [refresh, setRefresh] = useState(Date.now());
  const [refreshPage, setRefreshPage] = useState(Date.now());
  const [selectedObj, setSelectedObj] = useState({});

  useEffect(() => {
    API.post("api/master-settings/get-menus-system", { id: user?.user_role_id },
      (result) => {
        if (result.status) {
          setMenu(result?.data);
        }
      }
    );

    API.post("api/master-settings/get-system-permission", { id: user?.user_role_id },
      (result) => {
        if (result.status) {
          setSMenuPermissions(result?.data);
        }
      }
    );
  }, [refreshPage]);

  const handleModal = (modalAction = "add", modalInfoObj = null) => {
    if (modalAction === "add") {
      setModalTitle("Add New Permission");
      setMenuPermissionObj({
        id: 0,
        role_id: 0,
        menu_id: 0,
      });

      
    setRefresh(Date.now());
    setShowModal(true);

    } else {
      if (modalInfoObj !== null) {
        setModalTitle("Edit Permission");
        setMenuPermissionObj({
          id: modalInfoObj.id,
          role_id: modalInfoObj.role_id,
          menu_id: modalInfoObj.menu_id,
        });
      }
      setEditShowModal(true)
    }
  };

  const reloadPage = (refreshData) => {
    setRefreshPage(refreshData);
  };

  const handleDelete = (id) => {
    API.post("api/master-settings/delete-system-permission", { id: id }, (res) => {
      if (res?.message === "success") {
        reloadPage(Date.now());
        sweetAlert.done({ msg: AlertMessages.deleteDataMsg });
      } else {
        sweetAlert.warning(AlertMessages.errorMsg);
      }
    });
  };

  const confirmDeletion = (dataObj) => {
    setSelectedObj(dataObj);
    sweetAlert.confirmation({
      title: "Confirmation",
      msg: AlertMessages.deleteDataConfirmationMsg,
      noBtnText: "No",
      yesBtnText: "Yes",
      callback: () => handleDelete(dataObj?.id),
    });
  };

  return (
    <div className="dashboard-main-content">
      <div className='d-flex justify-content-between'>
        <h2 className="master_settings_heading">System Permissions</h2>
        {/* <button className="btn btn-primary float-end mb-2" onClick={(e) => { handleModal("add") }}> Add New Permission </button> */}
      </div>
      <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
        {smenu.length > 0 && smenuPermissions.length > 0 && (
          <table className="table-scroll">
            <thead>
              <tr>
                {Column.systemPermissionsMaster().map((itm, idx) => {
                  let data = Object.values(itm);
                  return (<th width={data[1]} style={{textAlign:"left"}} key={idx}>{data[0]}</th>);
                })}
              </tr>
            </thead>
            <tbody>
              {/* {smenuPermissions.map((itm, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{ROptions.filter((x) => +x.id === +itm?.role_id)[0]?.name}</td>
                    <td>{smenu.filter((x) => +x.id === +itm?.menu_id)[0]?.name}</td>
                    <td className="text-center">
                      <button className="btn btn-primary me-1" title="Edit Permission" onClick={(e) => { handleModal("edit", itm) }}>
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button className="btn btn-danger" title="Delete Permission" onClick={() => confirmDeletion(itm)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })} */}
              {
                ROptions.map((itm, idx)=>{
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{itm?.name}</td>
                      {/* <td>{smenu.filter((x) => +x.id === +itm?.menu_id)[0]?.name}</td> */}
                      <td className="text-center">
                        <button className="btn btn-primary me-1" title="Edit Permission" onClick={(e) => { handleModal("edit", {...itm, role_id: itm?.id}) }}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
  
                        {/* <button className="btn btn-danger" title="Delete Permission" onClick={() => confirmDeletion(itm)}>
                          <i className="bi bi-trash"></i>
                        </button> */}
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        )}
      </div>

      {showModal === true && (
        <SystemPermissionModal
          object={{ showModal: showModal, setShowModal: setShowModal, title: modalTitle, data: menuPermissionObj, roles: ROptions, smenu: smenu, refresh: refresh, allSavedData:smenuPermissions }}
          reloadPage={reloadPage} />
      )}

      {editShowModal === true && (
        <SystemPermissionEditModal
          object={{ showModal: editShowModal, setShowModal: setEditShowModal  , title: modalTitle, data: menuPermissionObj, roles: ROptions, smenu: smenu, refresh: refresh, allSavedData:smenuPermissions }}
          reloadPage={reloadPage} />
      )}
    </div>
  );
};

export default SystemPermissionsMaster;
