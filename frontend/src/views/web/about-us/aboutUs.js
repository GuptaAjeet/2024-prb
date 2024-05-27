import React, { Fragment, useEffect } from "react";
// import AboutImg from "../../../public/web/images/Volunteering-bro.png";
import InnerBanner from "../../layouts/web/inner-header";
import axios from "axios";
import { useState } from "react";

const Objective = () => {
  const [, setAboutImg] = useState();
  const [content, setcontent] = useState();
  useEffect(() => {
    // POST request using axios inside useEffect React hook
    const data = { cid: 8 };
    axios
      .post("http://localhost:4000/api/cms/cmsFindBYId", data)
      .then((response) => {
        setAboutImg(response?.data?.TimelineImage[0].img_icon);
        setcontent(response?.data?.TimelineImage[0].description);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  return (
    <Fragment>
      <div>
        <InnerBanner attr={{ h2: "About Us", label: "Prabandh" }} />
        {/* <img src={`http://localhost:4000/${AboutImg?AboutImg:null}`} style={{height:"600px",width:"100%"}}/> */}
        <div id="content">
          <div className="container">
            <div className="about pt-4 pb-4">
              <h2 className="inner-title">About Us</h2>
              <p>{content ? content : null}</p>
              <p>
                In a significant step towards leveraging technology to enhance
                efficiency and manage the implementation of newly launched
                Centrally Sponsored Integrated Scheme for School Education,
                Samagra Shiksha, a PRABANDH System has enabled, 
                in which States and UTs may view the Status of GoI
                Releases, approved outlays, coverage as per UDISE, school wise
                list of approvals, school wise gaps, cancellations in approvals
                etc. under Samagra Shiksha. In addition, on line submission of
                Monthly Progress Reports, physical as well as financial, can
                also be made by the respective State/UTs in the PRABANDH System.{" "}
                {/* <a href="#">Know More</a> */}
              </p>

              <div className="core-section bg-light mt-4 mb-2">
                <h2 className="inner-title">
                  Core Objective for Implementation
                </h2>
                <ul className="list-1">
                  <li>
                    <a href="#">
                      To obviate the need for submitting hard copies, except
                      where it is mandated otherwise.
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      To have transparency and accuracy in the System w.r.t
                      Approvals, Releases, Financial Status.
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      To streamline the Financial Management System, to enable
                      more accurate assessment of actual requirement of funds
                      for implementation.
                    </a>
                  </li>
                  <li>
                    <a href="#">For efficient decision- making.</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Objective;
