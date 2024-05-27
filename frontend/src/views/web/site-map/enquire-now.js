import React, { useEffect, useRef, useState } from "react";
import InnerBanner from "../../layouts/web/inner-header";
//import enquireImg from "../../../public/web/images/paper-plain.svg";
import { Hook } from "../../../apps";
//import { useDispatch } from "react-redux";
//import Features from "../../../redux/features";
//import { Alert } from "../../../apps/components/elements";
import "./enquire.css";
import ComingSoon from "../../../public/assets/img/coming-soon.png";

const Index = () => {
  const name = useRef();
  const mobile = useRef();
  const email = useRef();
  const captcha = useRef();
  const message = useRef();
  //const [reloadCap, setReloadCap] = useState(null);
  //const [fSubmit, setFSubmit] = useState(false);
  const [fInputs, SetFInputs] = useState([ name, mobile, email, captcha, message ]);
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);
  /*   const [alerts, setAlerts] = useState({
    message: "",
    class: "danger",
    onboard: false,
  }); */
  //const dispatch = useDispatch();

  useEffect(() => {
    //  if(errors.email.message ==='Please enter valid email.'){
    //  }
  }, [values, errors, form]);

  /*   const submitHandle = (e) => {
    setAlerts({ ...alerts, message: "", class: "" });
    dispatch(Features.showLoader({ show: "show", display: "block" }));
    setFSubmit(true);

    const data = { ...values, otc: captcha.current.otc, flag: 1 };

    API.post("auth/feedback-contacts", data, (response) => {
      if (response.status) {
        name.current.value = "";
        email.current.value = "";
        message.current.value = "";
        mobile.current.value = "";
        captcha.current.value = "";
        setAlerts({ ...alerts, message: response.message, class: "success" });
      } else {
        captcha.current.value = "";
        setReloadCap(new Date().getTime());
        setAlerts({ ...alerts, message: response.message, class: "danger" });
      }
      setTimeout(() => {
        setFSubmit(false);
        dispatch(Features.hideLoader({ show: "", display: "none" }));
      }, 1000);
    });
  }; */

  return (
    <div>
      <InnerBanner attr={{ h2: "Sitemap", label: "Enquire Now" }} />
      {/* <div id="content" className="inner-bg">
                <div className=" pt-3 pb-3">
                    <div className="container">
                        <h2 className="sec-title">Enquire Now</h2>
                       
                            <div className="row">
                                <h1>Coming soon</h1>
                                \\*** <div className="col-md-9 text-start mb-4 position-relative">
                                    <div className="card-custom ">
                                    <Alert alert={alerts} />
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <Form.Text attr={{ ref:name, 'id': 'name', 'name': 'name', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': 50 }} label="Name" error={errors.name} mandatory="true" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <Form.Mobile attr={{ ref: mobile,  'id': 'mobile', 'name': 'mobile', 'onChange': handleChange, 'onFocus': handleChange}} label="Mobile" error={errors.mobile} mandatory="true" />
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <Form.Email attr={{ ref: email,  'id': 'email', 'name': 'email', 'onChange': handleChange, 'onFocus': handleChange}} label="Email" error={errors.email} mandatory="true" />
                                        </div> 
                                        <div className="col-md-12 mb-4">
                                            <Form.Textarea attr={{ ref: message,  'id': 'message', 'name': 'message', 'onChange': handleChange, 'onFocus': handleChange,'maxlength':500}} label="Message" error={errors.message} mandatory="true" />
                                        </div> 
                                        <div className="col-md-6 mb-4">
                                            <Form.Captcha attr={{ref:captcha,'id':'captcha','name':'captcha','onChange':handleChange,'onFocus':handleChange,'otc':''}} reloadCap={reloadCap} error={errors.captcha} />
                                        </div>
                                        <div className="col-md-6 pt-3">
                                            <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick':submitHandle,'onChange':handleChange, 'onFocus': handleChange}} className="btn btn-primary float-end " fSubmit={fSubmit} >Save</Form.Button>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="contact-img"><img src={enquireImg} /></div> 
                                </div> ***\\
                               
                            </div>
                      
                    </div>
                </div>
            </div> */}

      <div id="content">
        <div className="container">
          <div className="about pt-4 pb-4">
            <h2 className="inner-title">Sitemap</h2>
            <div>
              <img src={ComingSoon} alt="Coming soon"></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
