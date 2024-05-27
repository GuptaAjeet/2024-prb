import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Form } from "../../../apps";
import Btnloader from "../elements/Btnloader";

const Header = (props) => {
  const style = { fontSize: "16px", fontWeight: "bold" };
  const model = useSelector((state) => state.label);
  const object = props.object !== null ? props.object : null;
  const name = useRef();

  return (
    <div className="col-sm-12">
      <div className="row">
        {object.search !== undefined && object.search && (
          <div className="col-sm-2 mb-2">
            <Form.Text
              attr={{
                ref: name,
                id: "name",
                name: "name",
                onChange: object.handleChange,
                maxLength: 100,
                placeholder: "Search",
              }}
            />
          </div>
        )}
        {object?.pdf || object?.excel ? (
          <div
            style={{ width: object?.search && object.search ? "" : "100%" }}
            className={
              (object.pdf !== undefined && object.pdf) ||
              (object.excel !== undefined && object.excel)
                ? "col-sm-10 mb-2"
                : "col-sm-12 mb-2"
            }
          >
            {object?.amountType && (
              <span
                className="badge amount-type rounded-pill text-bg-light"
                style={{ fontSize: "15px" }}
              >
                {object?.amountType}
              </span>
            )}
            {object.pdf !== undefined && object.pdf && (
              <button
                type="button"
                className="btn btn-danger float-end"
                disabled={
                  object?.count && +object?.count > 0
                    ? object?.pdfbtnStatus
                      ? true
                      : false
                    : true
                }
                onClick={object?.handleGeneratePdf}
              >
                {object.pdfbtnStatus ? <Btnloader /> : ""}{" "}
                <i className="bi bi-file-earmark-pdf"></i>{" "}
                <span className="mobile-hide">Export To</span> PDF
              </button>
            )}

            {object.excel !== undefined && object.excel && (
              <button
                type="button"
                className="btn btn-success float-end mx-2"
                disabled={
                  object?.count && +object?.count > 0
                    ? object?.pdfbtnStatus
                      ? true
                      : false
                    : true
                }
                onClick={object?.exportToExcel}
              >
                <i className="bi bi-file-earmark-excel"></i>{" "}
                <span className="mobile-hide">Export To</span> Excel
              </button>
            )}

            {/* <h3 className="ps-2">{model.title}</h3> */}
          </div>
        ) : (
          <div
            className={
              object.search !== undefined && object.search
                ? "col-sm-10 mb-2"
                : "col-sm-12 mb-2"
            }
          >
            {object.create !== undefined && object.create && (
              <div
                className="btn btn-primary mb-1 float-end p-1 "
                onClick={object.addHandler}
              >
                <i
                  className={`fa-solid fa-plus text-white mt-1`}
                  style={style}
                ></i>{" "}
                Add
              </div>
            )}
            {/* <h3 className="ps-2">{model.title}</h3> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
