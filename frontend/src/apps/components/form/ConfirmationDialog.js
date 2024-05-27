import React, { useEffect, useState } from 'react';

const ConfirmationDialog = ({ message, onConfirm, isOpen, setIsOpen, title, text }) => {
  const [show, setShow] = useState(isOpen);

  const closeDialog = () => {
    setIsOpen(false);
    setShow(false)
  };

  const handleConfirm = () => {
    onConfirm();
  };
  
  useEffect(()=>{
    setShow(isOpen)
  },[isOpen])

  return (
    <>
      {show && <>
        <div className="modal fade show confirm-overlay" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{display: "block"}}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h5 className="modal-title" id="exampleModalLongTitle">{title}</h5>
                <button type="button" className="btn btn-warning" data-dismiss="modal" aria-label="Close" onClick={closeDialog}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h6 dangerouslySetInnerHTML={{__html:text}}></h6>
              </div>
              <div className="modal-footer no-header">
                <button type="button" className="btn btn-primary" onClick={closeDialog} >No</button>
                <button type="button" className="btn btn-primary" onClick={handleConfirm}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      </>}
    </>
  );
};

export default ConfirmationDialog;