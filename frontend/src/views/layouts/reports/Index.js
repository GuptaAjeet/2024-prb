import { Link } from "react-router-dom";
import { Hook } from "../../../apps";

const Report = () => {
  const reportsData = Hook.useReports();

  const chunkedReports = (array, chunkSize) => {
    const result = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    }
  };

  const chunkedData = chunkedReports(reportsData, 5);

  const returnView = (report) => {
    // return (
    //   <div key={report.id} className="col-md-3 mb-3">
    //     <div className="card h150">
    //       <div className="card-body">
    //         <h5 className="card-title">{report.report_heading}</h5>
    //         <p className="card-text">{report.report_sub_heading}</p>
    //         <Link to={report.report_url} className="btn btn-info p-1 pe-3 ps-3">
    //           View
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // );

    return <div key={report.id} class="col-sm-6 col-lg-3 col-md-6">
      <div class="report-card">
          <h3>{report.report_heading}</h3>
          <p>{report.report_sub_heading}</p>
          <Link to={report.report_url} className="btn btn-info p-1 pe-3 ps-3">
            View
          </Link>
      </div>
    </div>
  };

  return (
    <div className="dashboard-main-content">
      {/* <div className="dashboard-main-content__header mb-3">
        <h1>Reports</h1>
      </div> */}

      <div class="dashboard-main-content__header">
        <h1>Reports</h1>
      </div>

      {/* <div className="dashboard-main-content-info">
        <div className="row">
          {chunkedData && chunkedData.map((row) =>
            row.map((report) => returnView(report))
          )}
        </div>
      </div> */}

      <div class="accordion reports mt-3" id="accordionExample-1">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingOne-1">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne-1" aria-expanded="true" aria-controls="collapseOne-1">
              AWP & P
            </button>
          </h2>

          <div id="collapseOne-1" class="accordion-collapse collapse show" aria-labelledby="headingOne-1" data-bs-parent="#accordionExample-1">
            <div class="accordion-body">
                <div class="row">
                    
                  {chunkedData && chunkedData.map((row) =>
                    row.map((report) => returnView(report))
                  )}

                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Report;
