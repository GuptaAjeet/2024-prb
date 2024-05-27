import React, { Fragment } from "react";

const SLoader = () => {
    return (
        <Fragment>
            <div className={`overlay show`}></div>
            <div className={`modal fade show`} style={{ 'display': 'block' }} >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <div className="loader mx-auto"></div>
                            <h5 className="modal-heading mt-3 text-primary">Please wait, system proccessing your request.</h5>
                       </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SLoader;