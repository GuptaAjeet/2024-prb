const BulkUploadSummary = ({ data: { successList, failedList } }) => {
  return (
    (successList?.length !== 0 || failedList?.length !== 0) && (
      <table className="table table-sm" width="100%">
        <caption>Upload Data Summary</caption>
        <thead>
          <tr>
            <th>Successfully Inserted ({successList?.length} Schools)</th>
            <th>Not Inserted ({failedList?.length} Schools)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "top" }} width="50%">
              <ul
                className="list-group"
                style={{ height: "250px", overflow: "scroll" }}
              >
                {successList?.map((s, idx) => (
                  <li
                    key={`s_${idx}`}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {s}
                    <span className="badge bg-success rounded-pill">
                      <i className="bi bi-check-lg"></i>
                    </span>
                  </li>
                ))}
              </ul>
            </td>
            <td style={{ verticalAlign: "top" }} width="50%">
              <ul
                className="list-group"
                style={{ height: "250px", overflow: "scroll" }}
              >
                {failedList?.map((f, idx) => (
                  <li
                    key={`f_${idx}`}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {f}
                    <span className="badge bg-danger rounded-pill">
                      <i className="bi bi-x-lg"></i>
                    </span>
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    )
  );
};

export default BulkUploadSummary;
