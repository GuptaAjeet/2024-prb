import React from "react";

import NLogo from "../../../public/web/images/nic-logo.svg";
import NicText from "../../../apps/components/elements/nictext";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-9 col-md-9 col-sm-9">
                <div className="row">
                  <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
                    <h2>Main</h2>
                    <ul>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/about-us">About Us</Link>
                      </li>
                      {/* <li>
                    <Link to="#">Get UDISE Code</Link>
                  </li>
                  <li>
                    <Link to="#">Data Capture Formats</Link>
                  </li>
                  <li>
                    <Link to="#">Publications & Statistics</Link>
                  </li> */}
                      <li>
                        <Link to="/faqs">FAQ's</Link>
                      </li>
                      <li>
                        <Link to="/enquire-now">Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                    <h2>Other Links</h2>
                    <ul>
                      <li>
                        <Link to="https://www.education.gov.in" target="_blank">
                          Ministry of Education
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="https://sdms.udiseplus.gov.in"
                          target="_blank"
                        >
                          UDISE+
                        </Link>
                      </li>
                      <li>
                        <Link to="https://schoolgis.nic.in" target="_blank">
                          School GIS
                        </Link>
                      </li>
                      <li>
                        <Link to="https://src.udiseplus.gov.in" target="_blank">
                          Know Your School
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="https://dashboard.udiseplus.gov.in/#/home"
                          target="_blank"
                        >
                          Dashboard
                        </Link>
                      </li>
                      {/* <li>
                    <Link to="/about-prabandh" target="_blank">
                      PRABANDH
                    </Link>
                  </li> */}
                    </ul>
                  </div>
                  <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6">
                    <h2>Website Policy</h2>
                    <ul>
                      <li>
                        <Link to="/privacy-policy" target="_blank">
                          Website Policy
                        </Link>
                      </li>
                      <li>
                        <Link to="/sitemap" target="_blank">
                          Site Map
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="browser-info">
                  <span>
                    Portal is Compatible with all major Browsers like Google
                    Chrome Version-119+, Mozilla Firefox Version-119+, Microsoft
                    Edge Version-119+, Opera Version-104+, Brave Version-1.60+
                    etc. Best Viewed in 1440 x 900 resolution
                  </span>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <Link to="https://www.nic.in">
                    <img className="img-fluid mb-2" src={NLogo} alt="nic link"/>
                  </Link>
                  <NicText />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="copyright">
        <div className="container text-center">
          <p className="d-inline-block">
            {" "}
            v22.0711.22{" "}
            <strong className="visitors ms-2">Visited : 45240002</strong>
          </p>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
