import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Helper, Hook } from "../../../apps";
import "./ReportStyle.css";
import api from "../../../apps/utilities/api";
import "./ReportStyle.css";
import axios from "axios";
// import { REACT_APP_URL } from "../../../env";
import Btnloader from "../../../apps/components/elements/Btnloader";
// import customNoRowsOverlay from "../../admin/users/admin/master/reports/childrens/customNoRowsOverlay";
import exportToExcel from "./ExportReports/ExcelReports";
import store from "../../../redux/app/store";

const Spilloversecond = () => {
    const user = Helper.auth.user;
    const gridRef = useRef();
    const gridStyle = useMemo(
        () => ({ height: 600, width: "100%", marginLeft: "10px" }),
        []
    );
    const [rowData, setRowData] = useState();
    const stateList = Hook.useStates();
    // const [, setDistrictsList] = useState([]);
    const [stateID, setStateID] = useState(0);
    // const [, setDistrictID] = useState(0);
    // const [reportData] = useState([]);

    const state_name = stateList?.filter((c) => c.id === stateID);
    const [pagesize, setpagesize] = useState(10);
    // const [columnDefs] = useState([
    //     {
    //         headerName: `Expenditure Report`,
    //         headerClass: "main_header",
    //         children: [
    //             {
    //                 headerName: "Particular",
    //                 rowSpan: 2,
    //                 headerClass: "subheader",
    //                 children: [
    //                     {
    //                         headerName: "Scheme",
    //                         field: "scheme_name",
    //                         headerClass: "report_header",
    //                     },
    //                     {
    //                         headerName: "Major Component",
    //                         field: "major_component_name",
    //                         chartDataType: "category",
    //                         headerClass: "report_header",
    //                     },
    //                     {
    //                         headerName: "Sub Component",
    //                         field: "sub_component_name",
    //                         headerClass: "report_header",
    //                         chartDataType: "series",
    //                         headerClass: "report_header",
    //                     },
    //                     {
    //                         headerName: "Activity Master",
    //                         field: "activity_master_name",
    //                         headerClass: "report_header",
    //                         headerClass: "report_header",
    //                     },
    //                     {
    //                         headerName: "Activity Detail",
    //                         field: "activity_master_details_name",
    //                         headerClass: "report_header",
    //                     },
    //                 ],
    //             },
    //             {
    //                 headerName: "Proposal",
    //                 headerClass: "subheader",
    //                 children: [
    //                     {
    //                         headerName: "Physical",
    //                         field: "physical_quantity",
    //                         headerClass: "report_header",
    //                     },
    //                     {
    //                         headerName: "Unit Cost",
    //                         field: "udise_sch_code",
    //                         headerClass: "report_header",
    //                         headerClass: "report_header",
    //                     },
    //                     {
    //                         headerName: "Financial",
    //                         field: "financial_amount",
    //                         headerClass: "report_header",
    //                         headerClass: "report_header",
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    // ]);

    const getSavedData = () => {
        if (stateID !== 0 || null) {
            api.post(
                `api/reports/get-spillover-second-data`,
                {
                    state_id: stateID
                },
                (res) => {
                    if (res?.data?.length > 0) {
                        if (res?.data?.length === 0 || res?.data?.length === 1) {
                            setRowData([]);
                            return gridRef?.current?.api?.showNoRowsOverlay();
                        } else {
                            setRowData(res.data);
                            gridRef?.current?.api?.hideOverlay();
                        }
                    }
                }
            );
        }
    };

    useEffect(() => {
        if (stateID === 0) {
            setRowData([]);
        } else {
            getSavedData();
        }
    }, [stateID]);

    const getRowStyle = (params) => {
        if (params.data.scheme_id === 555555) {
            return { background: "#ff9696" };
        } else if (params.data.major_component_id === 666666) {
            return { background: "#f799ff" };
        } else if (params.data.sub_component_id === 777777) {
            return { background: "#8cf0ff" };
        } else if (params.data.activity_master_id === 888888) {
            return { background: "#f5df98" };
        } else if (params.data.activity_master_details_id === 999999) {
            return { background: "#8cffa1" }; // Change the background color based on your condition
        }
        return null; // Default styling if no condition is met
    };

    const headerRows = [
        {
            headerName: `Spill Over Report ${state_name?.length > 0 && state_name[0].name}`,
            headerClass: "main_header",
            children: [
                {
                    headerName: "S. No.",
                    field: "index",
                    headerClass: "report_header",
                    width: 20,
                    valueGetter: (params) => params.node.rowIndex + 1,
                },
                {
                    headerName: "Major Component",
                    field: "major_component_name",
                    chartDataType: "category",
                    headerClass: "report_header",
                    width: 250,
                    valueGetter: (params) =>
                        params.data.major_component_id === 666666 &&
                            params.data.scheme_id !== 555555
                            ? `Grand Total: `
                            : params.data.major_component_name,
                    colSpan: (params) =>
                        params.data.major_component_id === 666666 ? 4 : 1,
                },
                {
                    headerName: "Sub Component",
                    field: "sub_component_name",
                    headerClass: "report_header",
                    chartDataType: "series",
                    headerClass: "report_header",
                    width: 250,
                    valueGetter: (params) =>
                        params.data.sub_component_id === 777777 &&
                            params.data.major_component_id !== 666666
                            ? `Subtotal: `
                            : params.data.sub_component_name,
                    colSpan: (params) => (params.data.sub_component_id === 777777 ? 3 : 1),
                },
                {
                    headerName: "Activity Master",
                    field: "activity_master_name",
                    headerClass: "report_header",
                    headerClass: "report_header",
                    width: 250,
                    valueGetter: (params) =>
                        params.data.activity_master_id === 888888 &&
                            params.data.sub_component_id !== 777777
                            ? `Subtotal: `
                            : params.data.activity_master_name,
                    colSpan: (params) =>
                        params.data.activity_master_id === 888888 ? 2 : 1,
                },
                {
                    headerName: "Sub Activity ",
                    field: "activity_master_details_name",
                    headerClass: "report_header",
                    width: 250,
                    valueGetter: (params) =>
                        params.data.activity_master_details_id === 999999 &&
                            params.data.activity_master_id !== 888888
                            ? `Subtotal: `
                            : params.data.activity_master_details_name,
                },
                {
                    headerName: "Budget Approved",
                    headerClass: "report_header",
                    children: [
                        {
                            headerName: "Physical",
                            field: "total_physical_budget_approved",
                            headerClass: "report_header",
                            cellStyle: (params) => ({ textAlign: "right" }),
                            valueGetter: (params) =>
                                params.data["total_physical_budget_approved"] == null
                                    ? 0
                                    : params.data["total_physical_budget_approved"],
                        },
                        {
                            headerName: "Financial Amount",
                            headerClass: "report_header",
                            valueGetter: (params) =>
                                params.data["total_financial_budget_approved"] == null
                                    ? 0
                                    : params.data["total_financial_budget_approved"],
                            cellStyle: (params) => ({ textAlign: "right" }),
                        },
                    ],
                },
                {
                    headerName: " Cummulative Progress   (Since Inception)",
                    field: "activity_master_details_name",
                    headerClass: "report_header",
                    children: [
                        {
                            headerName: "Physical",
                            field: "physical_quantity_progress_complete_inception",
                            headerClass: "report_header",
                            children: [
                                {
                                    headerName: "Complete",
                                    field: "physical_quantity_progress_complete_inception",
                                    headerClass: "report_header",
                                    valueGetter: (params) =>
                                        params.data["physical_quantity_progress_complete_inception"] == null
                                            ? 0
                                            : params.data["physical_quantity_progress_complete_inception"],
                                    cellStyle: (params) => ({ textAlign: "right" }),
                                },
                                {
                                    headerName: "In Progress",
                                    field: "physical_quantity_progress_progress_inception",
                                    headerClass: "report_header",
                                    valueGetter: (params) =>
                                        params.data["physical_quantity_progress_progress_inception"] == null
                                            ? 0
                                            : params.data["physical_quantity_progress_progress_inception"],
                                    cellStyle: (params) => ({ textAlign: "right" }),
                                },
                            ],
                        },
                        {
                            headerName: "Financial Amount",
                            field: "financial_amount_progress_inception",
                            headerClass: "report_header",
                            valueGetter: (params) =>
                                params.data["financial_amount_progress_inception"] == null
                                    ? 0
                                    : params.data["financial_amount_progress_inception"],
                            cellStyle: (params) => ({ textAlign: "right" }),
                        },
                    ],
                },
                {
                    headerName: "Spill Over",
                    field: "activity_master_details_name",
                    headerClass: "report_header",
                    children: [
                        {
                            headerName: "Physical",
                            field: "progress_quantity",
                            headerClass: "report_header",
                            children: [
                                {
                                    headerName: "In Progress",
                                    field: "physical_quantity_progress_progress_inception",
                                    headerClass: "report_header",
                                    valueGetter: (params) =>
                                        params.data["physical_quantity_progress_progress_inception"] == null
                                            ? 0
                                            : params.data["physical_quantity_progress_progress_inception"],
                                    cellStyle: (params) => ({ textAlign: "right" }),
                                },
                                {
                                    headerName: "Not Started",
                                    field: "physical_quantity_not_started",
                                    headerClass: "report_header",
                                    valueGetter: (params) =>
                                        params.data["physical_quantity_not_started"] == null
                                            ? 0
                                            : params.data["physical_quantity_not_started"],
                                    cellStyle: (params) => ({ textAlign: "right" }),
                                },
                                {
                                    headerName: "Total",
                                    field: "physical_quantity_spill_over",
                                    headerClass: "report_header",
                                    valueGetter: (params) =>
                                        params.data["physical_quantity_spill_over"] == null
                                            ? 0
                                            : params.data["physical_quantity_spill_over"],
                                    cellStyle: (params) => ({ textAlign: "right" }),
                                },
                            ],
                        },
                        {
                            headerName: "Financial Amount",
                            field: "financial_amount_spill_over",
                            headerClass: "report_header",
                            valueGetter: (params) =>
                                params.data["financial_amount_spill_over"] == null
                                    ? 0
                                    : params.data["financial_amount_spill_over"],
                            cellStyle: (params) => ({ textAlign: "right" }),
                        },
                    ],
                },
            ],
        },
    ];

    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            resizable: true,
            minWidth: 100,
            filter: true,
            enableRowGroup: true,
            // enablePivot: true,
            enableValue: true,
            floatingFilter: false,
            wrapHeaderText: false,
            resizable: true,
            pagination: true,
        };
    }, []);

    const onBtExport = useCallback(() => {
        const apiYear = store.getState().year.year;
        const prevYear = apiYear === '2025-2026' ? '2024-2025' : apiYear === '2024-2025' ? '2023-2024' : '2022-2023'
        exportToExcel("spilloversecond", {
            reportData: rowData,
            headers: headerRows,
            scheme: "scheme",
            fileName: "Spillover Second",
            sheetName: "Sheet 1",
            report_header: `Spillover: ${state_name?.length > 0 && state_name[0]?.name
                }, Year: ${prevYear}`,
        });
    }, [rowData]);

    useEffect(() => {
        setStateID(user.user_state_id || 0);
    }, []);

    const updateDistrictsList = (e) => {
        setStateID(e.target.value || 0);
    };

    const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

    const handleGeneratePdf = async () => {
        const apiYear = store.getState().year.year;

        const prevYear = apiYear === '2025-2026' ? '2024-2025' : apiYear === '2024-2025' ? '2023-2024' : '2022-2023'
        const pdfUrl = `https://prabandh.education.gov.in/prabandh-reports/api/spillover/${stateID}/${prevYear}`;
        try {
            setPdfbtnStatus(true);
            const response = await axios.get(pdfUrl, {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/pdf",
                    Authorization: `Bearer ${Helper.token()}`
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            var currentdate = new Date();
            link.setAttribute(
                "download",
                `SpilloversecondReport${prevYear + "_" + currentdate}.pdf`
            );
            document.body.appendChild(link);
            link.click();
            setPdfbtnStatus(false);
        } catch (error) {
            console.error("Error:", error.message);
            setPdfbtnStatus(false);
        }
    };

    const handleChangePageSize = (e) => {
        setpagesize(e.target.value);
    };

    return (
        <>
            <div className="row p-3">
                <div
                    className="dashboard-main-content-info mb-2"
                    id="search"
                    style={{ backgroundColor: "#456fbd" }}>
                    <div className="row">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                name="state-list"
                                value={stateID}
                                disabled={user.user_role_id < 4 ? false : +user.user_role_id === 15 ? false : true}
                                onChange={updateDistrictsList}
                            >
                                <option value={0}>--Select State--</option>
                                {stateList &&
                                    stateList?.length > 0 &&
                                    stateList?.map((st, stidx) => {
                                        return (
                                            <option key={`st_${stidx}`} value={st.id}>
                                                {st.name}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>

                        <div className="col-md-3"></div>

                        <div className="col-md-6 text-end">
                            <button
                                type="button"
                                className="btn btn-success float-end"
                                disabled={rowData && rowData.length > 0 ? false : true}
                                onClick={onBtExport}
                            >
                                <i className="bi bi-file-earmark-excel"></i>{" "}
                                <span className="mobile-hide">Export To</span> Excel
                            </button>
                            <button
                                type="button"
                                style={{ marginRight: "1rem" }}
                                className="btn btn-danger float-end"
                                disabled={
                                    rowData && rowData.length > 0
                                        ? pdfbtnStatus
                                            ? true
                                            : false
                                        : true
                                }
                                onClick={handleGeneratePdf}
                            >
                                {pdfbtnStatus ? <Btnloader /> : ""}{" "}
                                <i className="bi bi-file-earmark-pdf"></i>{" "}
                                <span className="mobile-hide">Export To</span> PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {+stateID && +stateID !== 0 ? (
                <div className="dashboard-main-content">
                    <div className="row">
                        <div style={gridStyle} className={"ag-theme-alpine AS"}>
                            <AgGridReact
                                ref={gridRef}
                                columnDefs={headerRows}
                                rowData={rowData}
                                animateRows={true}
                                defaultColDef={defaultColDef}
                                checkboxSelection={true}
                                suppressRowClickSelection={true}
                                rowSelection={"single"}
                                getRowStyle={getRowStyle}
                                pagination={true}
                                paginationPageSize={pagesize ? pagesize : 10}
                                paginationPageSizeSelector={[pagesize ? pagesize : 10, 20, 50, 100]}
                                paginationAutoPageSize={false}
                                viewportRowModelPageSize={1}
                            />

                            <div
                                className="mx-2"
                                style={{
                                    position: "absolute",
                                    marginTop: "-33px",
                                    width: "200px",
                                    height: "50px",
                                }}>
                                Page Size :
                                <select
                                    name="pagination"
                                    id="pet-select"
                                    className="mx-2"
                                    style={{
                                        position: "absolute",
                                        marginTop: "-3px",
                                        width: "130px",
                                        height: "25px",
                                    }}
                                    onClick={handleChangePageSize}
                                >
                                    <option value="10">10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value={rowData ? rowData.length : null}>All</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h3 style={{ textAlign: "center", height: "600px" }}>No Data Found</h3>
            )}
        </>
    );
};

export default Spilloversecond;







 