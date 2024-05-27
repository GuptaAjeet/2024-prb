import React, { useEffect, useState } from "react";
import ComingSoon from "../../../../../src/public/assets/img/coming-soon.png"

const Dashboard = () => {

    return (
        <div id="content">
            <div className="container">
                <div className="about pt-4 pb-4">
                    <h2 className="inner-title">Allocation Dashboard</h2>
                    <div>
                        <img src={ComingSoon}></img>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
