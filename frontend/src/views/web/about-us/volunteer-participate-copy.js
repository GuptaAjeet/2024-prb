import React, { Fragment } from "react";
import SchooImage from "../../../public/web/images/School_Participation.svg";
import VolunteerImage from "../../../public/web/images/Volunter_Participation.svg";
import InnerBanner from "../../layouts/web/inner-header";
import { Link } from "react-router-dom";

const Index = () => {
    return (
        <Fragment>
            <div>
                <InnerBanner attr={{ 'h2': 'Volunteer - How to participate', 'label': 'Volunteer - How to participate' }} />
                <div id="content">
                    <div className="pt-3 pb-3">
                        <div className="container">
                            <h4 className="mt-5 text-secondary">How to participate</h4>
                            <h2 className="sec-title">Volunteer</h2>
                            <div id="content text-center" className="position-relative">
                                <p>Volunteers support for school Service/Activity shall strengthen and enrich the implementation of co-scholastic services/activities. Volunteers would be able to bring diverse talents and skills, thereby making valuable Service/Activities to the learning process at school.</p>
                                <img src={VolunteerImage} />
                                <Link to="/volunteer-register" className="btn btn-primary btn-step-1">Register</Link>
                                <Link to="/contribute" className="btn btn-primary btn-step-2">Contribute</Link>
                                <Link to="/contribute-listing" className="btn btn-primary btn-step-3">Participate</Link>
                                <Link to="/auth/volunteer" className="btn btn-primary btn-step-4">View</Link>
                                <Link to="/auth/volunteer" className="btn btn-primary btn-step-5">View</Link> 
                                <Link to="/feedback" className="btn btn-primary btn-step-6">Feedback</Link>
                            </div>
                            <h4 className="mt-5 text-secondary">How to participate</h4>
                            <h2 className="sec-title">School</h2>
                            <div id="content text-center" className="position-relative">
                                <p>School infrastructure provides suitable environment to students for facilitating the education. It is a necessity to ensure access to education. Augmentation and upkeep of Infrastructure requires appropriate capital investments on regular interval. Volunteers may strengthen the school infrastructure by providing the required Assets/Material/Equipment to schools as per the school requirement.</p>
                                <img className="mt-3" src={SchooImage} />

                                <Link to="/volunteer-register" className="btn btn-primary btn-step-7">Register</Link>
                                <Link to="/auth/school" className="btn btn-primary btn-step-8">View</Link>
                                <Link to="/auth/school" className="btn btn-primary btn-step-9">View</Link>
                                <Link to="/auth/school" className="btn btn-primary btn-step-10">View</Link>
                                <Link to="/auth/school" className="btn btn-primary btn-step-11">View</Link> 
                                <Link to="/auth/school" className="btn btn-primary btn-step-12">View</Link>
                 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Index