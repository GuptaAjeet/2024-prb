import { Fragment } from "react";
import BulkUploadSummary from "./BulkUploadSummary";
import Spinner from "../../../../../apps/components/elements/Spinner";

const BulkUpload = ({
  data: {
    grower,
    onBtnExport,
    handleFileChange,
    processFileUpload,
    processBTN,
    successList,
    failedList,
  },
}) => {
  const ProcessingIndicator = () => {
    return (
      <div>
        <Spinner />
        <br />
        <span
          className="text-black"
          style={{ fontSize: "16px", color: "#000" }}
        >
          🕒 Processing Your Data Please Wait...
        </span>
      </div>
    );
  };
  return (
    <Fragment>
      <table width="100%">
        <tr>
          <td align="left">
            {!grower && (
              <button className="btn btn-info" onClick={onBtnExport}>
                <i className="bi bi-cloud-arrow-down" /> Download CSV File
              </button>
            )}
            {grower && (
              <span
                className="spinner-grow text-dark"
                role="status"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </td>
          <td align="right">
            <input
              className="form-control"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="formFile"
            />
          </td>
          <td align="right">
            <button
              className="btn btn-success"
              onClick={processFileUpload}
              disabled={processBTN}
            >
              <i className="bi bi-cpu" /> Process Upload
            </button>
          </td>
        </tr>
      </table>
      <hr />
      <div style={{ textAlign: "center" }}>
        {grower ? (
          <ProcessingIndicator />
        ) : (
          <BulkUploadSummary data={{ successList, failedList }} />
        )}
      </div>
    </Fragment>
  );
};

export default BulkUpload;
