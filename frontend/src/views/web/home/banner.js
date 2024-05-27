import React from "react";
import Carousel from "react-owl-carousel";
import images from "../../../public/web/images/banner-bg1.svg";
import Bimages from "../../../public/web/images/banner-img1.svg";
//import { Link } from "react-router-dom";
const Banner = (props) => {
  return (
    <div className="banner d-block position-relative">
      <div className="owl-demo1 owl-carousel1 owl-theme">
        <Carousel
          autoPlay={true}
          items={1}
          loop={true}
          autoplay={true}
          nav
          dots={false}
        >
          <div className="item" key="carousel1">
            {" "}
            <img src={images} alt="" />
            <div className="banner-layer position-absolute">
              <div className="container position-relative">
                <div className="banner-text w-auto">
                  <p>
                    Project Appraisal, Budgeting, Achievements and
                    <br /> Data Handling System
                  </p>
                  <h1>PRABANDH</h1>
                </div>
                <img className="banner-img" src={Bimages} alt="" />
              </div>
            </div>
          </div>
          <div className="item" key="carousel2">
            {" "}
            <img src={images} alt="" />
            <div className="banner-layer position-absolute">
              <div className="container position-relative">
                <div className="banner-text w-auto">
                  <p>
                    Project Appraisal, Budgeting, Achievements and
                    <br /> Data Handling System
                  </p>
                  <h1>PRABANDH</h1>
                </div>
                <img className="banner-img" src={Bimages} alt="" />
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
