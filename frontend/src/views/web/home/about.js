import React from "react";
//import play from "../../../public/web/images/play.png";
//import pmpic from "../../../public/web/images/pm-pic.png";
//import { Link } from "react-router-dom";

const About = (props) => {
  const PAB = [
    { id: 135, value: "Andaman & Nicobar Islands" },
    { id: 128, value: "Andhra Pradesh" },
    { id: 112, value: "Arunachal Pradesh" },
    { id: 118, value: "Assam" },
    { id: 110, value: "Bihar" },
    { id: 104, value: "Chandigarh" },
    { id: 122, value: "Chhattisgarh" },
    { id: 130, value: "Goa" },
    { id: 106, value: "Haryana" },
    { id: 102, value: "Himachal Pradesh" },
    { id: 101, value: "Jammu & Kashmir" },
    { id: 120, value: "Jharkhand" },
    { id: 129, value: "Karnataka" },
    { id: 131, value: "Lakshadweep" },
    { id: 123, value: "Madhya Pradesh" },
    { id: 127, value: "Maharashtra" },
    { id: 114, value: "Manipur" },
    { id: 117, value: "Meghalaya" },
    { id: 115, value: "Mizoram" },
    { id: 113, value: "Nagaland" },
    { id: 134, value: "Puducherry" },
    { id: 103, value: "Punjab" },
    { id: 108, value: "Rajasthan" },
    { id: 111, value: "Sikkim" },
    { id: 133, value: "Tamilnadu" },
    { id: 136, value: "Telangana" },
    { id: 116, value: "Tripura" },
    { id: 105, value: "Uttarakhand" },
    { id: 109, value: "Uttar Pradesh" },
    { id: 119, value: "West Bengal" },
    { id: 138, value: "Dadra & Nagar Haveli and Daman & Diu" },
    { id: 107, value: "Delhi" },
    { id: 124, value: "Gujarat" },
    { id: 132, value: "Kerala" },
    { id: 137, value: "Ladakh" },
    { id: 121, value: "Odisha" },
  ];

  return (
    <div id="content">
      <div className="w-100 d-flex pb-4 pt-4 welcome-section text-center">
        <div className="container">
          <div className="row">
            <div
              className=" col-sm-12"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              <h2 className="sec-title">Overview</h2>
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
              </p>
            </div>
            {/* <div className="w-100 d-flex pb-4 pt-4 welcome-section ">
              <div className="container">
                <div className="row">
                  <div className=" col-sm-12 ">
                    <h5>PAB Minutes</h5>
                    <p>
                      <div className="list-group">
                        {PAB.map((p, idx) => (
                          <a
                            key={p.id}
                            href={`/pab_minute/${p.id}/PAB.pdf`}
                            className="list-group-item list-group-item-action list-group-item-light"
                            download
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <span>
                                ({idx + 1}) {p.value}
                              </span>
                              <i className="bi bi-cloud-arrow-down"></i>
                            </div>
                          </a>
                        ))}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
