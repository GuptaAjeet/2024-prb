import React from "react";
import imgage1 from "../../../public/web/images/india_gov_logo.png";
import imgage2 from "../../../public/web/images/my_gov_logo.png";
import imgage3 from "../../../public/web/images/datagov_logo.png";
import imgage4 from "../../../public/web/images/rti_logo.png";
import imgage5 from "../../../public/web/images/150yrs.png";
import imgage6 from "../../../public/web/images/pmnrf-logo.png";
import imgage7 from "../../../public/web/images/NSP-logo.jpg";
import imgage8 from "../../../public/web/images/cp-grams.png";
import imgage9 from "../../../public/web/images/rti_logo.png";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";

const ExternalSliderLinks = () => {
  const responsive = {
    0: {
      items: 2
    },
    600: {
      items: 3
    },
    1000: {
      items: 6
    }
  }
  return (
    <div
      className="w-100 d-flex pb-5 pt-5 partners-section"
      data-aos="fade-up"
      data-aos-duration={3000}
    >
      <div className="container">
        <div className="owl-demo2 owl-carousel2">
          <OwlCarousel
            className="owl-theme"
            loop={true}
            // items={6}
            autoplay={true}
            responsive={responsive}
            nav
            margin={10}
            dots={false}
          >
            <div className="item" key={0}>
              <div className="partners-img">
                <Link to="https://www.india.gov.in" target="_blank">
                  <img src={imgage1} alt="india gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={1}>
              <div className="partners-img">
                <Link to="https://www.mygov.in" target="_blank">
                  <img src={imgage2} alt="my gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={2}>
              <div className="partners-img">
                <Link to="https://data.gov.in" target="_blank">
                  <img src={imgage3} alt="data gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={3}>
              <div className="partners-img">
                <Link to="https://rti.gov.in" target="_blank">
                  <img src={imgage4} alt="rti gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={4}>
              <div className="partners-img">
                <Link to="https://dsel.education.gov.in/150-years" target="_blank">
                  <img src={imgage5} alt="dsel education gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={5}>
              <div className="partners-img">
                <Link to="https://pmnrf.gov.in/en" target="_blank">
                  <img src={imgage6} alt="pmnrf gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={6}>
              <div className="partners-img">
                <Link to="https://scholarships.gov.in" target="_blank">
                  <img src={imgage7} alt="scholarships gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={7}>
              <div className="partners-img">
                <Link to="https://pgportal.gov.in" target="_blank">
                  <img src={imgage8} alt="pg portal gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={8}>
              <div className="partners-img">
                <Link to="https://rti.gov.in" target="_blank">
                  <img src={imgage9} alt="rti gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={9}>
              <div className="partners-img">
                <Link to="https://www.india.gov.in" target="_blank">
                  <img src={imgage1} alt="india gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={10}>
              <div className="partners-img">
                <Link to="https://www.mygov.in" target="_blank">
                  <img src={imgage2} alt="my gov link" />
                </Link>
              </div>
            </div>
            <div className="item" key={11}>
              <div className="partners-img">
                <Link to="https://data.gov.in" target="_blank">
                  <img src={imgage3} alt="data gov link" />
                </Link>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </div>
    </div>
  );
};

export default ExternalSliderLinks;
