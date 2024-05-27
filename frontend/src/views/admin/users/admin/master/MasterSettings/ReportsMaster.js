import React, { useEffect, useState } from "react";
import { API, Helper, Column } from "../../../../../../apps";
import ReportMasterModal from "./Modals/ReportMasterModal";

const ReportsMaster = () => {
    const user = Helper.auth.user;

    const [reportsMaster, setReportsMaster] = useState([]);
    const [refresh, setRefresh] = useState(Date.now());
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [reportObj, setReportObj] = useState({});

    useEffect(() => {
        API.post("api/master-settings/get-reports-master", { id: user?.user_role_id },
            (result) => {
                if (result.status) {
                    setReportsMaster(result?.data);
                }
            }
        );
    }, [refresh]);

    const handleModal = (modalAction = 'add', modalInfoObj = null) => {
        if (modalAction === 'add') {
            setModalTitle('Add Report')
            setReportObj({
                "id": 0,
                "report_url": '',
                "report_heading": '',
                "report_sub_heading": ''
            })
        }
        else {
            if (modalInfoObj !== null) {
                setModalTitle('Edit Report')
                setReportObj({
                    "id": modalInfoObj.id,
                    "report_url": modalInfoObj.report_url,
                    "report_heading": modalInfoObj.report_heading,
                    "report_sub_heading": modalInfoObj.report_sub_heading
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
                <h2 className="master_settings_heading">Reports Master</h2>
                <button className="btn btn-primary float-end mb-2" onClick={(e) => { handleModal('add') }}>Add New Report</button>
            </div>
            {(reportsMaster && reportsMaster.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.reportMaster().map((itm, idx) => {
                                    let data = Object.values(itm)
                                    return (<th width={data[1]} className={data[2]} key={idx} >{data[0]}</th>)
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {reportsMaster?.map((itm, idx) =>
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{itm?.report_heading}</td>
                                    <td>{itm?.report_sub_heading}</td>
                                    <td>{itm?.report_url}</td>
                                    <td>{itm?.id}</td>
                                    <td className="text-center">
                                        <button className="btn btn-primary" title="Edit Report" onClick={(e) => { handleModal('edit', itm) }}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {showModal === true && <ReportMasterModal object={{ showModal: showModal, setShowModal: setShowModal, title: modalTitle, data: reportObj, refresh: refresh }} reloadPage={reloadPage} />}
                </div>}
        </>

    )
}

export default ReportsMaster;