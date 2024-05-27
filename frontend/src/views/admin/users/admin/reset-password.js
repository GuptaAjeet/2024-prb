import React from "react";
import UpdatePassword from "../../../../views/auth/password/update-password";

const ResetPassword = () => {

    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div className="widget-content widget-content-area br-6">
                    <UpdatePassword flag='Admin'/>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;