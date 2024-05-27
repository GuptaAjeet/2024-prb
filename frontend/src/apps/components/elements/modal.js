import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideModal } from "../../../redux/features/modal";

const Modal = (props) => {
  const dispatch = useDispatch();
  const object = useSelector((state) => state.modal);

  const closeHandler = () => {
    if (props.levelHandler !== undefined && props.levelHandler.level > 0) {
      props.levelHandler.handler(+props.levelHandler.level - 1);
    } else {
      if (props?.close) {
        props?.close();
      } else {
        dispatch(hideModal());
      }
    }
  };

  const cleanupFunction = () => {
    const box = document.getElementsByClassName("overlay");
    if (box.length) {
      box[0].style.display = "none";
    }
  };

  useEffect(() => {
    if (object.show) {
      const box = document.getElementsByClassName("overlay");
      if (box.length) {
        box[0].style.display = "block";
      }
    } else {
      const box = document.getElementsByClassName("overlay");
      box[0].style.display = "none";
    }
    return cleanupFunction;
  }, [object.show]);

  return (
    <Fragment>
      {/* <div className={`overlay ${object.show}`}></div> */}
      <div className={`shadow modal animated zoomInUp custo-zoomInUp fade ${object.show}`} style={{ display: object.display }}>
        <div className={`modal-dialog ${object.size === "modal-fullscreen" ? object.size : props.size === 'default' ? "modal-dialog-centered modal" : props.size?.trim().length !== 0 ? "modal-dialog-centered modal-" + props.size : "modal-dialog-centered modal-" + object.size}`}>
          <div className="modal-content">
            <div className="modal-header shadow-sm justify-content-between">
              <h5 className="modal-title">{object.title}</h5>
              {props.dismissable !== 'false' && <button type="button" className="btn btn-warning" onClick={closeHandler}>
                <i className="fa-solid fa-xmark text-white"></i>
              </button>}
            </div>
            <div className={`modal-body ${object.size === "fullscreen" ? "large-modal" : "normal-modal"}`}>{props.children}</div>
            {object.footer && (
              <div className="modal-footer md-button bg-light">
                <button className="btn bg-danger text-white" onClick={closeHandler}>
                  Close
                </button>
                <button type="button" className="btn btn-success" onClick={props.clickHandler} >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;
