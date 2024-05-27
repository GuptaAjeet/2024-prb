import React from "react";

const TopBar = (props) => {
  return (
    <div className="header-top">
      <div className="container d-flex align-items-center justify-content-between">
        <ul className="list-unstyled d-flex align-items-center mb-0 left-list mob-header">
          <li>
            <a href="https://www.india.gov.in"  target="_blank" rel="noreferrer">
              भारत सरकार <span>Government of India</span>
            </a>
          </li>
          <li>
            <a href="https://www.education.gov.in/" target="_blank" rel="noreferrer">
              शिक्षा मंत्रालय<span>Ministry of Education</span>
            </a>
          </li>
        </ul>
        <ul className="list-unstyled d-flex align-items-center mb-0 me-3">
          <li className="d-none d-lg-block">
              <i className="bi bi-arrow-down"></i>Skip To Navigation
          </li>

          <li className="d-none d-lg-block">
              <i className="bi bi-arrow-down"></i>Skip To Main Content
          </li>

          <li className="d-none d-lg-block">
              <i className="bi bi-volume-down"></i>
              Screen Reader Access
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
