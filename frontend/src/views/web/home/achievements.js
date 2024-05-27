import React from "react";
import survey1 from "../../../public/web/images/online-survey-1.svg";
import survey2 from "../../../public/web/images/online-survey-2.svg";
import financial from "../../../public/web/images/financial-report.svg";
import approved from "../../../public/web/images/approved.svg";
import login from "../../../public/web/images/login.svg";
import migration from "../../../public/web/images/migration.svg";

const achievements = () => {
  return (
    <div className="w-100 d-flex  achievements-section">
      <div className="container">
        <h2 className="sec-title">Achievements</h2>
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
            <div
              className="achieve-card"
              data-aos="zoom-in"
              data-aos-duration="2000"
              style={{ height: "95%" }}
            >
              <img src={survey1} className="mb-3" alt="survey 1" />
              <h4>Online submission of Annual Work Plan & Budget</h4>
              <p>
                States and UTs are submitting District Wise Annual Work Plan and
                Budget proposals through the portal enabling decentralized
                planning. These proposals are also appraised online through the
                system and final approvals given by Project Approval Board are
                fed back into the system.
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
            <div
              className="achieve-card"
              data-aos="zoom-in"
              data-aos-duration="2000"
              style={{ height: "95%" }}
            >
              <img src={survey2} className="mb-3" alt="survey 2" />
              <h4>Online Generation of Sanction Order for Central Releases</h4>
              <p>
                All the sanction orders issued under the scheme are generated
                online after necessary approvals. Auto-generated mails to the
                States helps in real time flow of information regarding the
                funds released by Government of India.
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
            <div
              className="achieve-card"
              data-aos="zoom-in"
              data-aos-duration="2000"
              style={{ height: "95%" }}
            >
              <img src={financial} className="mb-3" alt="financial" />
              <h4>
                Online Monthly activity wise Progress Reports (Physical and
                Financial)
              </h4>
              <p>
                States/UTs are submitting activity wise progress (Physical and
                Financial) for all components of Samagra Shiksha The system can
                generate the delay statement on transfer of funds, Status of
                pending State Share, Unspent balances, Spill-over and Committed
                liability etc.
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
            <div
              className="achieve-card"
              data-aos="zoom-in"
              data-aos-duration="2000"
              style={{ height: "95%" }}
            >
              <img src={approved} className="mb-3" alt="approved" />
              <h4>Online Submission of School wise Progress</h4>
              <p>
                Detailed school-wise Functional and construction status under
                various components of Samagra Shiksha i.e. New Schools,
                Strengthening of Schools, KGBV, Residential, Schools/ Hostels ,
                ICT@School, Toilets and Vocational Education are being submitted
                online alongwith the Photographs.
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
            <div
              className="achieve-card"
              data-aos="zoom-in"
              data-aos-duration="2000"
              style={{ height: "95%" }}
            >
              <img src={login} className="mb-3" alt="login" />
              <h4>Activated Logins</h4>
              <p>
                District logins have been created and activated across all
                States and UTs having 740 Districts, 8100 Blocks and 12 Lakhs
                School users.
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
            <div
              className="achieve-card"
              data-aos="zoom-in"
              data-aos-duration="2000"
              style={{ height: "95%" }}
            >
              <img src={migration} className="mb-3" alt="migration" />
              <h4>Activation of Web Services with DBT Mission portal</h4>
              <p>
                The Web services have been developed and initiated in
                collaboration with
                <a href="http://www.dbtbharat.gov.in">
                  http://www.dbtbharat.gov.in
                </a>{" "}
                team. On the 20th day of every month, the DBT mission portal
                fetches the Physical and Financial Expenditure from the PRABANDH
                portal on Expenditure incurred under DBT activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default achievements;
