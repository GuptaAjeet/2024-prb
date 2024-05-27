import React from "react";
import chart1 from "../../../public/web/images/chart-1.svg";
import chart2 from "../../../public/web/images/chart-2.svg";
import chart3 from "../../../public/web/images/chart-3.png";
//import Carousel from "react-owl-carousel";

const Testimonials = () => {
  return (
    <div className="w-100 d-flex  chart-section" data-aos="fade-up" data-aos-duration="3000">
      <div className="container">
        <div className="chart-inner-box">
          <h2 className="sec-title mb-3">Visualized Data</h2>
          <p>
            States and UTs streamline their budgeting process through an online
            portal for District Wise Annual Work Plans and Budget proposals,
            promoting decentralized planning. The system, appraised by the
            Project Approval Board, ensures transparency. Additionally,
            States/UTs submit detailed progress reports for all components of
            Samagra Shiksha, including fund transfer delays and unspent
            balances. Visualizing this data through charts enhances
            understanding and aids in strategic decision-making..
          </p>
          <div className="row">
            <div className="col-sm-6">
              <div className="chart-card">
                <img src={chart1} alt="chart1" />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="chart-card">
                <img src={chart2} alt="chart2"/>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="chart-card">
                <img src={chart3} alt="chart3"/>
              </div>
            </div>
          </div>

          <ul className="mt-5">
            <li>States/UTs streamline budgeting via online portal.</li>
            <li>Project Approval Board ensures transparent approvals</li>
            <li>Detailed progress reports for Samagra Shiksha components submitted</li>
            <li>Visualized data through charts aids strategic decision-making</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
