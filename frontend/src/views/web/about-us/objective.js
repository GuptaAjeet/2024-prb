import React, { Fragment } from "react";
import InnerBanner from "../../layouts/web/inner-header";
import ComingSoon from "../../../public/assets/img/coming-soon.png"

const Objective = () => {
    return (
        <Fragment>
            <div>
                <InnerBanner attr={{ 'h2': 'PRABANDH', 'label': 'About Prabandh' }} />
                <div id="content">
                    <div className="container">
                        <div className="about pt-4 pb-4">
                            <h2 className="inner-title">PRABANDH</h2>
                            <div>
                                <img src={ComingSoon} alt="coming soon"></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Objective