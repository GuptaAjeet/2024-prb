import React, { useEffect, useRef, useState } from "react";
import InnerBanner from "../../layouts/web/inner-header";
import { useDispatch } from 'react-redux';
import Features from "../../../redux/features";
import enquireImg from "../../../public/web/images/paper-plain.svg";
import { API, Form, Hook } from "../../../apps";
import { Alert } from "../../../apps/components/elements";
import "../contact-us/enquire.css";

const Index = () => {

    const name = useRef();
    const mobile = useRef();
    const email = useRef();
    const captcha = useRef();
    const message = useRef();
    const subject = useRef();
    const feedback = useRef();
    const [reloadCap, setReloadCap] = useState(null);
    const [fSubmit, setFSubmit] = useState(false);
    const [fInputs, SetFInputs] = useState([name, captcha, message, subject, feedback]);
    const [alerts, setAlerts] = useState({ 'message': '', 'class': 'danger', 'onboard': false });
    const dispatch = useDispatch();
    const { handleChange, values, errors, form } = Hook.useForm(fInputs);

    /**
     {id:"Complain",'name':'Content on Website'},
        {id:"Suggestion",'name':'Suggestion'},
        {id:"UI/UX",'name':'UI / UX'},
        {id:"User Journey",'name':'User Journey'},
        {id:"Others",'name':'Others'}
     */

    const Options = [
        { id: "School", 'name': 'School' },
        { id: "Volunteer", 'name': 'Volunteer' },
        { id: "Website", 'name': 'Website' },
        { id: "Activities/Services", 'name': 'Activities/Services' },
        { id: "Assets/Material/Equipment", 'name': 'Assets/Material/Equipment' },
        { id: "Helpline No. and email", 'name': 'Helpline No. and email' },
        { id: "Guidelines/Policy matter", 'name': 'Guidelines/Policy matter' },
        { id: "State/UT specific", 'name': 'State/UT specific' },
        { id: "Others", 'name': 'Others' }
    ]

    useEffect(() => {

    }, [values, reloadCap, errors, form])
    const submitHandle = (e) => {
        setAlerts({ ...alerts, 'message': '', 'class': '' });
        dispatch(Features.showLoader({ show: "show", display: 'block' }));
        setFSubmit(true);

        const data = { ...values, 'otc': captcha.current.otc, 'flag': 2 };

        API.post("auth/feedback-contacts", data, (response) => {
            if (response.status) {
                name.current.value = '';
                email.current.value = '';
                message.current.value = '';
                subject.current.value = '';
                mobile.current.value = '';
                feedback.current.value = '';
                captcha.current.value = '';
                setAlerts({ ...alerts, 'message': response.message, 'class': 'success' });
            } else {
                captcha.current.value = '';
                setReloadCap((new Date()).getTime());
                setAlerts({ ...alerts, 'message': response.message, 'class': 'danger' });
            }
            setTimeout(() => {
                setFSubmit(false);
                dispatch(Features.hideLoader({ show: "", display: 'none' }));
            }, 1000);
        });
    }

    return (
        <div>
            <InnerBanner attr={{ 'h2': 'Feedback', 'label': 'Feedback' }} />
            <div id="content" className="inner-bg">
                <div className="pt-3 pb-3">
                    <div className="container">
                        <h2 className="sec-title">Feedback</h2>
                        <div className="row">
                            <div className="col-md-9 text-start">
                                Complete the below form to send us your complaint and suggestion. Your complaint and suggestions will be very much appreciated. If you provide us with your contact information, we will be able to answer your questions.
                            </div>
                        </div>
                        <div className="row pt-5 p-0">
                            <div className="col-md-9 text-start mb-4 position-relative">
                                <div className="row card-custom p-3 mb-5 ms-2 pt-4">
                                    <Alert alert={alerts} />
                                    <div className="col-md-6 mb-4">
                                        <Form.Text attr={{ ref: name, 'id': 'name', 'name': 'name', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': 100 }} label="Name" error={errors.name} mandatory="true" />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Email attr={{ ref: email, 'id': 'email', 'name': 'email' }} label="Email" error={errors.email} mandatory={false} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Mobile attr={{ ref: mobile, 'id': 'mobile', 'name': 'mobile' }} label="Mobile" error={errors.mobile} mandatory={false} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Select options={Options} attr={{ ref: feedback, 'id': 'feedback', 'name': 'feedback', 'onChange': handleChange, 'onFocus': handleChange }} label="Feedback for" default="Select Feedback for" error={errors.feedback} mandatory="true" />
                                    </div>
                                    <div className="col-md-12 mb-4">
                                        <Form.Text attr={{ ref: subject, 'id': 'subject', 'name': 'subject', 'onChange': handleChange, 'onFocus': handleChange }} label="Subject" error={errors.subject} mandatory="true" />
                                    </div>
                                    {/* <div className="col-md-6 mb-4">
                                        <Form.Text attr={{ ref: email,  'id': 'rating', 'name': 'rating', 'onChange': handleChange, 'onFocus': handleChange}} label="Rating" error={errors.email} mandatory="true" />
                                    </div>  */}
                                    <div className="col-md-12 mb-4">
                                        <Form.Textarea attr={{ ref: message, 'id': 'message', 'name': 'message', 'onChange': handleChange, 'onFocus': handleChange, 'maxlength': 500 }} label="Message" error={errors.message} mandatory="true" />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Captcha attr={{ ref: captcha, 'id': 'captcha', 'name': 'captcha', 'onChange': handleChange, 'onFocus': handleChange, 'otc': '' }} reloadCap={reloadCap} error={errors.captcha} />
                                    </div>
                                    <div className="col-md-6 pt-3">
                                        <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick': submitHandle, 'onChange': handleChange, 'onFocus': handleChange }} className="btn btn-success float-end" fSubmit={fSubmit} >Submit</Form.Button>
                                    </div>
                                </div>
                                <div className="contact-img"><img src={enquireImg} /></div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;