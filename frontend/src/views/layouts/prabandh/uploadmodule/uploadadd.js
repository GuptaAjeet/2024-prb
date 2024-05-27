import React, { useState, useEffect } from 'react'
import { API, Column, Helper, Hook, Table } from '../../../../apps';
import api from '../../../../apps/utilities/api';
import $, { data } from "jquery";
import { Settings } from "../../../../apps";
import axios from 'axios';
import { REACT_APP_URL } from '../../../../env';
import features from '../../../../redux/features';
import { useDispatch, useSelector } from 'react-redux';
import Papa from "papaparse";
import sweetAlert from '../../../../apps/utilities/sweetalert';
import { Link, useLocation } from 'react-router-dom';
import Btnloader from '../../../../apps/components/elements/Btnloader';
import BulkUploadSummary from '../School/BulkUpload/BulkUploadSummary';
import SuccessStatus from './status/SuccessStatus';
import MastercommondataOperate from '../../../admin/users/admin/master/MastercommondataOperate';
import ConfirmationDialog from '../../../../apps/components/form/ConfirmationDialog';
import Spinner from '../../../../apps/components/elements/Spinner';
import exportToExcel from '../PrabandhReports/ExcelReports';

const fileUploadOptions = [
    // {
    //   id: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application/vnd.ms-excel",
    //   name: "Excel (XLS/XLSX)",
    // },
    // { id: "application/pdf", name: "PDF" },
    // {
    //   id: "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed",
    //   name: "Zip",
    // },

    /*   { id: "text/csv", name: "CSV" },
    { id: "image/png|image/jpeg", name: "Image (JPEG/JPG/PNG)" }, */
];
export default function Uploadadd() {
    const [stateID, setStateID] = useState(0);
    const [stateList, setStateList] = useState([]);
    const [actMasterDetailList, setActMasterDetailList] = useState([]);
    const [scheme, setScheme] = useState(0);
    const [error, setError] = useState({})
    const [files, setFiles] = useState("");
    const [deletes, setDeletes] = useState([]);
    const [proposedDetail, setProposedDetail] = useState(null);
    const [btnLoader, setBtnLoader] = useState(false)
    const [successList, setSuccessList] = useState([])
    const [failedList, setFailedList] = useState([])
    const [status, setStatus] = useState(0);
    const [uploaded_by_state, setUploaded_by_state] = useState(false);
    const [confrmData, setConfrmData] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alldata, setAlldata] = useState(null)
    const [filter, setFilter] = useState({
        state: "0",
        district: "0",
        scheme_id: "0",
        major_component_id: "0",
        sub_component_id: "0",
        activity_master_id: "0",
        activity_master_details_id: "0",
        allDistricts: false,
    });

    let userData = Helper.auth?.user;
    const handler = useSelector((state) => state.handler);

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        getActMasterDetailList(location.state.amid)
        setFilter({
            ...filter,
            state: location.state.stateid,
            scheme_id: location.state.sid,
            type: location.state.type,
            major_component_id: location.state.mcid,
            sub_component_id: location.state.scid,
            activity_master_id: location.state.amid
        });
        setScheme(location?.state.sid)
        getStateList();
        setStateID(location.state.stateid);
        getActMasterDetailList(location.state.amid)
    }, [])
    const exportToExcels = () => {
        const newData = alldata.map(({ action, ...rest }) => rest);
        const header = [
            { srl: "S. No." },
            { udise_code: "Udise" },
            { school_name: "Name" },
            { district_name: "District" },
            { physical_quantity: "Physical Quantity" },
            { financial_amount: "Financial Amount" },
        ]
        exportToExcel("genericReport", { reportData: newData, headers: header, sheeName: "Sheet 1", fileName: "uploaded_School_list" })
    }
    const generateCSV = () => {
        const data = [
            { "UDISE": 1, "PHYSICAL QUANTITY": 45, "FINANCIAL AMOUNT": 125 },
        ];
        const header = Object.keys(data[0]).join(',');
        const csvContent = `${header}\n${data.map(row => Object.values(row).join(',')).join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'upload_school_list_sample_template.csv';
        link.click();
    };
    const handleDeleteById = (id, activity_master_details_id) => {
        API.delete("api/prabandh/delete-state-upload-document", id, (data) => {
            if (data.status) {
                getAlldata(activity_master_details_id)
                dispatch(features.showToast({ message: data.message }));
                dispatch(
                    features.makeHandler({
                        reload: new Date().getTime(),
                        where: "",
                    })
                );
            } else {
                dispatch(features.showToast({ message: data.message }));
            }
        });
    };
    const handleCheckbox = (e, id, master_activity_detail_id) => {
        if (e.target.checked) {
            setDeletes((prevState) => {
                return [...prevState, id];
            })
        } else {
            setDeletes((prevState) => {
                return prevState.filter(p => p !== id);
            })
        }
    }
    const bulkDelete = () => {
        if (deletes.length === 0) {
            sweetAlert.warning("Please Select Some Records to Delete!")
        } else {
            sweetAlert.confirmation({
                callback: () => {
                    api.post("api/prabandh/bulkdelete-state-upload-document", { deletes }, (res) => {
                        if (res.status === 200) {
                            setDeletes([]);
                            dispatch(features.showToast({ message: res.message }));
                            getAlldata(filter?.activity_master_details_id)
                        } else {
                            setDeletes([]);
                            dispatch(features.showToast({ message: res.message, flag: "bg-danger" }));
                        }
                    });
                },
                title: "Are You Sure?",
                msg: "You really want to delete these records",
                noBtnText: "No",
                yesBtnText: "Yes"
            })
        }
    }
    const getAlldata = (value) => {
        setLoading(true)
        api.post("api/prabandh/get-state-upload-document", {
            state_id: location.state.stateid,
            user_id: +userData?.id,
            activity_master_detail_id: value,
            year: location.state.year
        }, (res) => {
            if (res.status) {
                setStatus(res.data[0]?.status);
                setLoading(false)
                setUploaded_by_state(res.uploaded_by_state)
                setAlldata(res.data)
            }
            else {
                setLoading(false)
                dispatch(features.showToast({ message: res.message, flag: "bg-danger" }));
            }
        });
    };
    let rows = []
    useEffect(() => {
        $(".pb-2").hide();
    }, [alldata])
    if (alldata !== null && alldata !== undefined) {
        alldata &&
            alldata?.map((row, i) => {
                return (rows[i] = {
                    srl: (<div className='d-flex gap-2'>
                        {Helper.counter(++i, handler.limit, handler.page)}
                        <input className="form-check-input" disabled={+status === 6} checked={deletes?.includes(row.id)} style={{ border: "1px solid black" }} type="checkbox" value="" id="flexCheckChecked" onChange={(e) => handleCheckbox(e, row.id, row.activity_master_details_id)} />
                    </div>),
                    udise_code: row.udise_code,
                    school_name: row.school_name,
                    district_name: row.district_name,
                    physical_quantity: row.physical_quantity,
                    financial_amount: row.financial_amount,
                    action: (
                        <div
                            className="text-center"
                        >
                            {Settings.isNotViewer() && (
                                <i
                                    key={i}
                                    className="bi bi-trash3 text-danger"
                                    style={{ fontSize: "1.2rem", cursor: (+row.status === 6) || (deletes?.length !== 0) ? "not-allowed" : 'pointer' }}
                                    onClick={() => (+row.status === 6) || (deletes?.length !== 0) ? "" : handleDeleteById(row.id, row.activity_master_details_id)}
                                    data-id={row.id}
                                ></i>
                            )}
                        </div>
                    ),
                });
            });
    }
    const handleDeleteData = () => {
        api.post("api/prabandh/delete-activity-list-doc", { state_id: stateID, master_activity_detail_id: filter.activity_master_details_id }, (res) => {
            if (res.status === 200) {
                getAlldata(filter?.activity_master_details_id)
                dispatch(features.hideModal());
            }
            else {
                setLoading(false)
                dispatch(features.showToast({ message: res.message, flag: "bg-danger" }));
            }
        });
    }
    const getStateList = () => {

        api.get("api/states/list", null, (res) => {
            setStateList(res.data);

        });
    };
    useEffect(() => {
        if (filter?.activity_master_details_id != 0) { getAlldata(filter?.activity_master_details_id) }
        getStateList();
    }, [])
    const getActMasterDetailList = (value) => {

        api.post(
            "api/prabandh/upload-nr-physical-assets-recommendation",
            {
                activity_master_id: location.state.amid,
                state_id: location.state.stateid,
                year: location.state.year
            },
            (res) => {
                if (res.status) {
                    setActMasterDetailList(res.data);
                } else {
                    dispatch(features.showToast({ message: res.message, flag: "bg-danger" }));
                }

            }
        );
    };
    const handlegetProposeDetail = (value) => {

        api.post(
            "api/prabandh/get-proposed-detail-by-activity",
            {
                state_id: location.state.stateid,
                activity_master_detail_id: value,
                year: location.state.year
            },
            (res) => {
                if (res.status) {
                    setProposedDetail(res.data);
                }
                else {
                    dispatch(features.showToast({ message: res.message, flag: "bg-danger" }));
                }

            }
        );
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, activity_master_details_id: value })
        if (value != 0) {
            getAlldata(value)
            handlegetProposeDetail(value);
            if (name === "activity_master_details_id") {
                setError({ ...error, activity_master_details_id: "" })
            }
        } else {
            setProposedDetail(null);
            setAlldata(null);
        }
    };
    const handleUploadfile = (e) => {
        const file = e.target.files[0]
        if (file) {
            let flN = e.target.files[0]?.name?.split(".");
            let data = ["csv", "CSV"];


            Papa.parse(file, {
                header: true,
                complete: function (results) {
                    const requiredFields = [
                        "UDISE",
                        "PHYSICAL QUANTITY",
                        "FINANCIAL AMOUNT",
                    ];

                    // Check if the CSV file contains the required fields
                    const hasRequiredFields = requiredFields.every((field) => {
                        return results.meta.fields.includes(field);
                    });

                    if (!hasRequiredFields) {
                        setFiles("")
                        sweetAlert.warning(
                            "Error: CSV file is missing some required fields."
                        );
                    } else {

                        if (Settings.isDataExistsInArray(data, flN.pop())) {
                            setFiles(file)
                            setError({ ...error, file: "" })
                            // sweetAlert.confirmation({
                            //     callback: () => { setFiles(file) },
                            //     cancelCallback: () => { setFiles("") },
                            //     msg: "Are you sure you want to upload this file?",
                            //     yesBtnText: "Yes",
                            //     noBtnText: "No",
                            //     url: "",
                            //     redirect: "",
                            // });
                        } else {
                            setFiles("")
                            sweetAlert.warning(
                                `Invalid File Format: The selected file does not adhere to the expected CSV format.`
                            );
                        }
                    }
                },
                error: function (error) {
                    alert("Error parsing CSV file.");
                    setFiles("")
                    console.error(error);
                },
            });
        } else {
            setFiles("")
        }
    };
    const handleFilesDetails = async () => {
        setBtnLoader(true)
        const dt =
        {
            scheme_id: scheme,
            major_component_id: filter?.major_component_id,
            sub_component_id: filter.sub_component_id,
            activity_id: filter.activity_master_id,
            activity_master_details_id: filter.activity_master_details_id,
            state_id: stateID,
            user_id: userData?.id,
            role_id: userData?.user_role_id,
            year: location.state.year
            // file_id: id
        }
        const url = "api/prabandh/file/state-file-uploaded-detail";
        try {
            await api.upload(
                url,
                files,
                dt,
                (data) => {
                    if (data.status == 200) {
                        // setFiles('')
                        const a = data?.data?.filter(c => (+c?.valid_assset === 1));
                        const b = data?.data?.filter(c => (+c?.valid_assset === 0));
                        setSuccessList(a?.map(v => (v?.school_name)));
                        setFailedList(b?.map(c => (c?.udise_code)));
                        dispatch(features.showModal({ title: "Added Data Overview List", btntext: "" }));
                        dispatch(
                            features.makeHandler({
                                reload: new Date().getTime(),
                                where: "",
                            })
                        );
                        dispatch(
                            features.showToast({
                                message: "File Uploaded Successfully.",
                                flag: "bg-success",
                            })
                        );
                        setBtnLoader(false)
                    }
                    if (data.status == 400) {
                        dispatch(
                            features.showToast({
                                message: `Error: ${data.message}.`,
                                flag: "bg-danger",
                            })
                        );
                    }
                }
            );
        } catch (error) {
            setBtnLoader(false)
            dispatch(
                features.showToast({
                    message: "Error: File Not Uploaded.",
                    flag: "bg-danger",
                })
            );
        }
    };
    const handleSubmit = () => {
        let er = {}
        if (filter?.activity_master_details_id == 0) {
            er.activity_master_details_id = "Please Select Activity Master Detail"
        }
        if (files?.length === 0) {
            er.file = "Please Select a File"
        }
        setError(er)
        if (Object.keys(er).length === 0) {
            handleFilesDetails()
        }
    };
    const total_quantity = alldata?.map(c => (+c.physical_quantity));
    const quantity = total_quantity?.reduce((a, b) => a + b, 0);
    const SubmitApprove = () => {
        // const amount = total_amount?.reduce((a, b) => a + b, 0);
        if (proposedDetail && +proposedDetail[0]?.proposed_physical_quantity !== +quantity) {
            sweetAlert.warning(`Physical Quantity is should be equal to Proposed Physical Quantity`);
            // } else if (proposedDetail && proposedDetail[0]?.proposed_financial_amount < amount) {
            //     sweetAlert.warning(`Amount is not greater than Proposed Amount`);
        } else {
            setIsOpen(true)
            setConfrmData({
                callBack: () => {
                    api.post("api/prabandh/update-activity-list-doc", { year: location?.state?.year, state_id: stateID, activity_master_detail_id: filter.activity_master_details_id }, (res) => {
                        if (res.status = 200) {
                            getAlldata(filter?.activity_master_details_id)
                            dispatch(
                                features.showToast({
                                    message: res.message,
                                    flag: "bg-success",
                                }));
                        }
                        else {
                            dispatch(features.showToast({ message: res.message, flag: "bg-danger" }));
                        }
                    });
                },
                title: "Confirmation",
                text: "Are you sure you want to Approve this Plan?",
            });
        }
    }
    const handleCheckboxAll = (e,) => {
        if (e.target.checked) {
            const ids = alldata?.map(c => c.id)
            setDeletes(ids)
        } else {
            setDeletes([])
        }
    }
    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
                <h1>Upload Data</h1>
                <Link to="/auth/prabandh/uploadeddoclist-plan"
                    state={{
                        stateid: location.state?.stateid,
                        type: location.state?.type,
                        year: location.state.year
                    }}>  <button className='btn btn-primary'><i className="bi bi-arrow-left" /> Back</button></Link>
            </div>
            <table
                cellPadding={5}
                cellSpacing={5}
                className="table table-bordered mt-3"
            >
                <tbody>
                    <tr>
                        <td className="bg-light">Scheme : </td>
                        <td>{location?.state?.scheme_name ?? ""}</td>
                        <td className="bg-light">Major Component :</td>
                        <td>
                            {location.state.sub_component_name ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="bg-light">Sub Component :</td>
                        <td>
                            {location.state.sub_component_name ?? ""}
                        </td>
                        <td className="bg-light">Activity Master :</td>
                        <td>
                            {location.state?.activity_master_name ?? ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="bg-light">Approved Quantity :</td>
                        <td>
                            {/* <span className="text-danger">Physical</span> : */}
                            {Helper.numberFormat(
                                proposedDetail && proposedDetail[0]?.proposed_physical_quantity
                            ) || "----"}
                        </td>
                        <td className="bg-light">
                            <span className="text-success">Approved Amount ✅</span> :
                        </td>
                        <td>  {Helper.accountFormat(
                            proposedDetail && proposedDetail[0]?.proposed_financial_amount
                        ) || "----"} ( in Lakh)</td>
                    </tr>
                </tbody>
            </table>
            <div className="dashboard-main-content-info mb-3">
                <div className="row ">
                    <div className="mb-1 col-md-2">
                        <label >State</label>
                        <select
                            className="form-select"
                            name="state-list"
                            value={stateID}
                            onChange={handleChange}
                            disabled
                        // disabled={stateList.find(
                        //     (state) => +state.id === user.user_state_id
                        // )}   
                        >
                            <option value={0}>State</option>
                            {stateList.map((st, stidx) => (
                                <option key={`st_${stidx}`} value={st.id}>
                                    {st.name}
                                </option>
                            ))}
                        </select>
                        <label className="upload_add_label_font_size"> {error?.state}</label>

                    </div>
                    <div className="col-md-3">
                        <label >Select Activity Master Detail</label>
                        <select
                            className="form-select"
                            name="activity_master_details_id"
                            value={filter?.activity_master_details_id}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                            disabled={btnLoader}
                        >
                            <option value={0}>Select Activity Master Detail</option>
                            {actMasterDetailList?.map((m, idx) => (
                                <option key={`mc_${idx + 1}`} value={m.id}>
                                    {m.activity_master_details_name}
                                </option>
                            ))}
                        </select>
                        <label className="upload_add_label_font_size"> {error?.activity_master_details_id}</label>
                    </div>
                    <div
                        className="mb-1 col-md-3">
                        <div
                            style={{
                                padding: "auto",
                                margin: "1.4rem 0rem 0rem 0rem",
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #dbdbdb",
                                paddingLeft: "10px"
                            }}
                        >
                            <label htmlFor="upload-2" style={{ fontSize: "1rem", cursor: +status === 6 ? "not-allowed" : btnLoader ? "not-allowed" : "pointer" }}>
                                <i
                                    className="bi bi-upload"
                                    style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}
                                ></i>{" "}
                                {files?.name === undefined
                                    ? "Choose a File"
                                    : files?.name.length >= 5
                                        ? `${files?.name?.substring(0, 15)}....`
                                        : files?.name}
                            </label>
                            <input
                                type="file"
                                hidden
                                disabled={+status === 6 ? true : btnLoader}
                                onChange={handleUploadfile}
                                id="upload-2"
                                accept=".csv"
                            />
                        </div>
                        <label className="upload_add_label_font_size" style={{ marginLeft: "1rem" }}> {error?.file}</label>
                    </div>

                    <div className="col-md-2" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <button type="submit" disabled={+status === 6 ? true : btnLoader} onClick={handleSubmit} className="btn btn-success"> {btnLoader && <Btnloader />} Submit</button>
                    </div>
                    <div className="col-md-2" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}> <button className="btn btn-info" onClick={generateCSV}>
                        <i className="bi bi-cloud-arrow-down" /> Download Template
                    </button>
                    </div>
                </div>
            </div>
            {loading ? (
                <div style={{ textAlign: "center" }}>
                    <Spinner />
                </div>
            ) :
                alldata &&
                <div className="dashboard-main-content-info">
                    {Settings.isNotViewer() && (
                        <div className="dashboard-main-content__header mb-0 d-flex justify-content-between">
                            <div>
                                <h4>Uploaded Data</h4>
                                <p><u>Total Uploaded:</u>   {Helper.numberFormat(rows?.length)}, <u style={{ color: proposedDetail && +proposedDetail[0]?.proposed_physical_quantity === +quantity ? "green" : "red" }}>Total Physical Quantity:</u><span style={{ color: proposedDetail && +proposedDetail[0]?.proposed_physical_quantity === +quantity ? "green" : "red" }}> {Helper.numberFormat(quantity)}</span> </p>
                            </div>
                            {(data.length !== 0 && uploaded_by_state) && <h6 style={{ color: "", background: "rgb(226, 160, 63)", margin: "auto", padding: "5px 10px", color: "white", fontSize: "18px", borderRadius: "5px" }}>List of School uploaded by State</h6>}
                            <div>
                                <button className='btn btn-danger' style={{ cursor: +status === 6 ? "not-allowed" : "pointer", marginRight: "5px" }} onClick={bulkDelete} disabled={data.length === 0 || +status === 6}>Delete Selected</button>
                                <button className='btn btn-success' style={{ cursor: +status === 6 ? "not-allowed" : "pointer", marginRight: "5px" }} onClick={SubmitApprove} disabled={data.length === 0 || +status === 6}>Final Approve</button>
                                <button className='btn btn-success' style={{ cursor: "pointer" }} onClick={exportToExcels} disabled={data.length === 0}>Export to Excel</button>
                            </div>
                        </div>
                    )}
                    <div className="col-xl-12 col-lg-12 col-sm-12 ">
                        {rows && (
                            <Table
                                object={{
                                    columns: Column.UploadAddDocument(),
                                    data: rows,
                                    count: alldata?.length,
                                    create: false,
                                    search: false,
                                    handleCheckboxAll: handleCheckboxAll,
                                    checkbox: true,
                                    deletes: deletes,
                                    status: status
                                }}
                            />
                        )}
                    </div>
                </div>
            }
            <SuccessStatus data={{ successList, failedList }} handleDeleteData={handleDeleteData} />
            {isOpen && (<ConfirmationDialog
                onConfirm={(e) => {
                    setIsOpen(false);
                    confrmData.callBack();
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={confrmData.title}
                text={confrmData.text}
            />)}
        </div>
    )
}
