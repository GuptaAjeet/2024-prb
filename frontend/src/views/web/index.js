import React, { Fragment, lazy, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Download from "./download";

const Home = lazy(() => import('./home'));
const NodalOfficers = lazy(() => import('./contact-us/nodal-officers'));
const EnquireNow = lazy(() => import('./contact-us/enquire-now'));
// const Feedback              =   lazy(() => import('./feedback'));
const FAQs = lazy(() => import('./faqs'));
const StateInitiatives = lazy(() => import('./state-initiatives'));
const PrivacyAndPolicy = lazy(() => import('./privacy-and-policy'));
const TermsAndConditions = lazy(() => import('./term-and-conditions'));
// const ContributeStepOne     =   lazy(() => import('./contribute/step-one'));
// const ContributeStepTwo     =   lazy(() => import('./contribute/step-two'));
// const ContributeStepThree   =   lazy(() => import('./contribute/step-three'));
const Videos = lazy(() => import('./documents/videos'));
const Objective = lazy(() => import('./about-us/objective'));
// const VolunteerParticipate  =   lazy(() => import('./about-us/volunteer-participate'));
// const SchoolParticipate     =   lazy(() => import('./about-us/school-participate'));
// const SchoolLogin           =   lazy(() => import("../auth/school/login"));
// const VolunteerLogin        =   lazy(() => import("../auth/volunteer/login"));
const AdminLogin = lazy(() => import("../auth/admin/login"));
// const SchoolRegister        =   lazy(() => import("../auth/school/register"));
// const VolunteerRegister     =   lazy(() => import("../auth/volunteer/register"));
const ForgotPassword = lazy(() => import("../auth/password/forgot-password"));
const ResetPassword = lazy(() => import("../auth/password/reset-password"));

const Layout = () => {
    const handler = useSelector((state) => state.label);
    const [active, setActive] = useState('Home');

    useEffect(() => {
        setActive((handler.title).replace(/[\s]/g, ''))
    }, [handler])

    return (
        <Fragment>
            {/* {(active === 'SchoolLogin') && <SchoolLogin />} */}
            {/* {(active === 'VolunteerLogin') && <VolunteerLogin />} */}
            {(active === 'AdminLogin') && <AdminLogin />}
            {/* {(active === 'RegisterSchool') && <SchoolRegister />} */}
            {/* {(active === 'RegisterVolunteer') && <VolunteerRegister />} */}
            {(active === 'ForgotPassword') && <ForgotPassword optional={handler.optional} />}
            {(active === 'ResetPassword') && <ResetPassword optional={handler.optional} />}
            {(active === 'Home') && <Home />}
            {(active === 'NodalOfficers') && <NodalOfficers />}
            {(active === 'EnquireNow') && <EnquireNow />}
            {(active === 'Objective') && <Objective />}
            {(active === 'download') && <Download />}
            {(active === 'Videos') && <Videos />}
            {/* {(active === 'ContributeStepOne') && <ContributeStepOne />} */}
            {/* {(active === 'ContributeStepTwo') && <ContributeStepTwo />} */}
            {/* {(active === 'ContributeStepThree') && <ContributeStepThree />} */}
            {/* {(active === 'Feedback') && <Feedback />} */}
            {(active === 'PrivacyAndPolicy') && <PrivacyAndPolicy />}
            {(active === 'TermsAndCondition') && <TermsAndConditions />}
            {(active === 'StateInitiatives') && <StateInitiatives />}
            {/* {(active === 'VolunteerParticipate') && <VolunteerParticipate />} */}
            {/* {(active === 'SchoolParticipate') && <SchoolParticipate />} */}
            {(active === 'FAQs') && <FAQs />}
        </Fragment>
    );
}

export default Layout;