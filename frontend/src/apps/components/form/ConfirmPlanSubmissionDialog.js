import React, { useEffect, useState, useRef } from "react";
import { Form, Hook } from "../..";
import api from "../../utilities/api";
import Uploadfiles from "../../../views/admin/users/admin/master/Uploadfiles";

const PlanConfirmationDialog = ({
  message,
  onConfirm,
  isOpen,
  setIsOpen,
  title,
  text,
  file,
}) => {
  const [show, setShow] = useState(isOpen);
  var comment = useRef();
  var fileRef = useRef();
  const [fInputs, SetFInputs] = useState([comment, fileRef]);
  const [fSubmit, setFSubmit] = useState(false);

  const { handleChange, values, errors, form } = Hook.useForm(fInputs);

  const closeDialog = () => {
    setIsOpen(false);
    setShow(false);
    // onConfirm();
  };

  const handleConfirm = () => {
    onConfirm(values);
  };

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  return (
    <>
      {show && (
        <>
          <div
            className="modal fade show confirm-overlay"
            id="exampleModalCenter"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    {title}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-warning"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={closeDialog}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <h6>{text}</h6>

                  {/* {file && <input type="file" name="district_document" ref={fileRef} onChange={handleChange} />} */}

                  <Form.Textarea
                    attr={{
                      ref: comment,
                      id: "comment",
                      name: "comment",
                      onChange: handleChange,
                      onFocus: handleChange,
                      maxLength: 1000,
                      placeholder: "Enter comment",
                      rows: 4,
                    }}
                    error={errors.comment}
                    mandatory="true"
                  />
                  <span className="d-block mb-3 text-end text-danger">
                    <strong>
                      *This field is mandatory. (Minimum length: 3 words)
                    </strong>
                  </span>

                  {file && (
                    <Uploadfiles
                      hideUploaded={true}
                      submit={
                        form.disable ? console.log("none") : handleConfirm
                      }
                    />
                  )}

                  {file && (
                    <span className="text-danger">
                      Please upload all related supporting documents to your
                      state plan. Later it will not be allowed.
                    </span>
                  )}
                </div>

                {!file && (
                  <div className="modal-footer no-header">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <Form.Button
                      button={{
                        type: "submit",
                        disabled: form.disable,
                        onClick: handleConfirm,
                      }}
                      className="btn btn-success float-end"
                      fSubmit={fSubmit}
                    >
                      Done
                    </Form.Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PlanConfirmationDialog;
