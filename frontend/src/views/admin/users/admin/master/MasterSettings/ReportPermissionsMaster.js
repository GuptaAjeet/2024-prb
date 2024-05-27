import React, { useState, useEffect } from "react";
import { Helper, Hook, API, Column, AlertMessages, sweetAlert } from "../../../../../../apps";
import ReportPermissionsModal from "./Modals/ReportPermissionsModal";

const ReportPermissionsMaster = () => {
  const user = Helper.auth.user;
  const ROptions = Hook.useRoles();

  const [reportMaster, setReportsMaster] = useState([]);
  const [reportPermissions, setReportPermissions] = useState([]);
  const [reportPermissionsObj, setReportPermissionsObj] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [refresh, setRefresh] = useState(Date.now());
  const [refreshPage, setRefreshPage] = useState(Date.now());
  const [selectedObj, setSelectedObj] = useState({});

  useEffect(() => {
    API.post("api/master-settings/get-reports-master", { id: user?.user_role_id },
      (result) => {
        if (result.status) {
          setReportsMaster(result?.data);
        }
      }
    );

    API.post("api/master-settings/get-report-permissions", { id: user?.user_role_id },
      (result) => {
        if (result.status) {
          setReportPermissions(result?.data);
        }
      }
    );
  }, [refreshPage]);

  const handleModal = (modalAction = "add", modalInfoObj = null) => {
    if (modalAction === "add") {
      setModalTitle("Add New Permission");
      setReportPermissionsObj({
        id: 0,
        user_role_id: 0,
        report_id: 0,
      });
    } else {
      if (modalInfoObj !== null) {
        setModalTitle("Edit Permission");
        setReportPermissionsObj({
          id: modalInfoObj.id,
          user_role_id: modalInfoObj.user_role_id,
          report_id: modalInfoObj.report_id,
        });
      }
    }
    setRefresh(Date.now());
    setShowModal(true);
  };

  const reloadPage = (refreshData) => {
    setRefreshPage(refreshData);
  };

  const handleDelete = (id) => {
    API.post("api/master-settings/delete-report-permission", { id: id }, (res) => {
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
        <h2 className="master_settings_heading">Report Permissions</h2>
        <button className="btn btn-primary float-end mb-2" onClick={(e) => { handleModal("add") }}> Add New Permission </button>
      </div>
      <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
        {reportMaster.length > 0 && reportPermissions.length > 0 && (
          <table className="table-scroll">
            <thead>
              <tr>
                {Column.reportPermissionsMaster().map((itm, idx) => {
                  let data = Object.values(itm);
                  return (<th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>);
                })}
              </tr>
            </thead>
            <tbody>
              {reportPermissions.map((itm, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{ROptions.filter((x) => +x.id === +itm?.user_role_id)[0]?.name}</td>
                    <td>{reportMaster.filter((x) => +x.id === +itm?.report_id)[0]?.report_heading}</td>
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
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal === true && (
        <ReportPermissionsModal
          object={{ showModal: showModal, setShowModal: setShowModal, title: modalTitle, data: reportPermissionsObj, roles: ROptions, reportMaster: reportMaster, refresh: refresh, allSavedData: reportPermissions }}
          reloadPage={reloadPage} />
      )}
    </div>
  );
};

export default ReportPermissionsMaster;