import { useState } from "react";
import './spill.css';
import Simulate from "./Simulate";


const ProgressReport = () => {
    const [reportType, setReportType] = useState({
        report: 'none',
        count: 0
    });

    const updateProps = (type) => {
        setReportType({
            report: type,
            count: reportType.count+1
        })
    }

    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3">
                <h1 style={{ display: 'inline-block' }}>Progress Report</h1>

                <button
                    type="button"
                    className="btn btn-success float-end mx-2"
                    onClick={() => updateProps('excel')}
                > <i className="bi bi-file-earmark-excel"></i> <span className="mobile-hide">Export To</span> Excel
                </button>

                {/* <button
          type="button"
          className="btn btn-danger float-end"
          disabled={object?.data && object?.data.length > 0 ? pdfbtnStatus ? true : false : true}
          onClick={handleGeneratePdf}
        >{pdfbtnStatus ? <Btnloader /> : ""}{" "}
          <i className="bi bi-file-earmark-pdf"></i> <span className="mobile-hide">Export To</span> PDF
        </button> */}
            </div>
            <div className="dashboard-main-content-info">
                <Simulate reportType={reportType} />
            </div>
        </div>
    );
};

export default ProgressReport;
