import React, { Fragment } from "react";
import { useSelector } from "react-redux";

const Loader = () => {
  const object = useSelector((state) => state.loader);
  return (
    <Fragment>
      <div className={`overlay ${object.show}`}></div>
      <div className={`modal fade ${object.show}`} style={{ display: object.display, zIndex: "1056" }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body text-center">
              <div className="loader mx-auto"></div>
              <h5 className="modal-heading mt-3 text-primary">
                Please wait, system processing your request.
              </h5>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Loader;
