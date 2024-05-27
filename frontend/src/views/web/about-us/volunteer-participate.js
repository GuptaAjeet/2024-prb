import React, { Fragment } from "react";
import SchooImage from "../../../public/web/images/School_Participation.svg";
import VolunteerImage from "../../../public/web/images/Volunter_Participation.svg";
import InnerBanner from "../../layouts/web/inner-header";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Fragment>
      <div>
        <InnerBanner
          attr={{
            h2: "Volunteer - How to participate",
            label: "Volunteer - How to participate",
          }}
        />
        <div id="content">
          <div className="pt-3 pb-3">
            <div className="container">
              <h4 className="mt-5 text-secondary">How to participate</h4>
              <h2 className="sec-title">Volunteer</h2>
              <div id="content text-center">
                <p>
                  Volunteers support for school Service/Activity shall
                  strengthen and enrich the implementation of co-scholastic
                  services/activities. Volunteers would be able to bring diverse
                  talents and skills, thereby making valuable Service/Activities
                  to the learning process at school.
                </p>

                <div className="position-relative">
                  <img src={VolunteerImage} />
                  <Link
                    to="/volunteer-register"
                    className="participate-btn step1-v"
                  >
                    Register
                  </Link>
                  <Link to="/contribute" className="participate-btn step2-v">
                    Contribute
                  </Link>
                  <Link to="/contribute" className="participate-btn step3-v">
                    Participate
                  </Link>
                  <Link
                    to="/auth/volunteer"
                    className="participate-btn step4-v"
                  >
                    View
                  </Link>
                  <Link
                    to="/auth/volunteer"
                    className="participate-btn step5-v"
                  >
                    View
                  </Link>
                  <Link to="/feedback" className="participate-btn step6-v">
                    Feedback
                  </Link>
                </div>
              </div>
              <h4 className="mt-5 text-secondary">How to participate</h4>
              <h2 className="sec-title">School</h2>
              <div id="content text-center">
                <p>
                  School infrastructure provides suitable environment to
                  students for facilitating the education. It is a necessity to
                  ensure access to education. Augmentation and upkeep of
                  Infrastructure requires appropriate capital investments on
                  regular interval. Volunteers may strengthen the school
                  infrastructure by providing the required
                  Assets/Material/Equipment to schools as per the school
                  requirement.
                </p>
                <div className="position-relative">
                  <img className="mt-3" src={SchooImage} />
                  <Link
                    to="/volunteer-register"
                    className="participate-btn step1-s"
                  >
                    Register
                  </Link>
                  <Link to="/auth/school" className="participate-btn step2-s">
                    View
                  </Link>
                  <Link to="/auth/school" className="participate-btn step3-s">
                    View
                  </Link>
                  <Link to="/auth/school" className="participate-btn step4-s">
                    View
                  </Link>
                  <Link to="/auth/school" className="participate-btn step5-s">
                    View
                  </Link>
                  <Link to="/auth/school" className="participate-btn step6-s">
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Index;
