import React, { Fragment } from "react";
import Image from "../../../public/web/images/participation_school.svg";
import InnerBanner from "../../layouts/web/inner-header";

const Index = () => {
    return (
        <Fragment>
            <div>
                <InnerBanner attr={{ 'h2': 'School - How to participate', 'label': 'School - How to participate' }} />
                <div id="content">
                    <div className="about-wrap pt-3 pb-3">
                        <div className="container">
                            <h2 className="sec-title text-center">The process of participation of schools is described below</h2>
                            <div id="content">
                                <img src={Image} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Index