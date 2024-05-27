import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helper } from "../../../apps";
import { useSelector } from "react-redux";

const NavBar = (props) => {
  const [refresh, setRefresh] = useState(null);
  const location = useLocation();
  const path = location.pathname;
  const redux = useSelector((state) => state.loader);
  const { module } = useSelector((state) => state.module);
  const isLoggedIn = Helper.isLoggedIn;
  useEffect(() => {
    setTimeout(() => {
      const header = document.getElementById("myHeader");
      if (header !== null) {
        window.onscroll = function () {
          myFunction();
        };
        const sticky = header.offsetTop;

        function myFunction() {
          if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
          } else {
            header.classList.remove("sticky");
          }
        }
      }
    }, 3000);
    setRefresh(Helper.random());
  }, [redux, path]);

  const handleDownload = () => {
    // Replace the file path with your actual file path
    const filePath = '/Samagra Siksha Norms Elementary Secondary and Teacher Education for NIC.xls';

    // Create an anchor element
    const anchor = document.createElement('a');

    // Set the href attribute to the file path
    anchor.href = filePath;

    // Set the download attribute with the desired file name
    anchor.download = 'Samagra Siksha Norms Elementary Secondary and Teacher Education for NIC.xls';

    // Append the anchor to the document body
    document.body.appendChild(anchor);

    // Trigger a click on the anchor to start the download
    anchor.click();

    // Remove the anchor from the document body
    document.body.removeChild(anchor);
  };



  return (
    <nav className="navbar navbar-expand-lg" id="myHeader" key={refresh}>
      <div
        className={`${props.size ? "container" : "container-fluid"} ps-0`}
        id="MainContent"
      >
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item" key={1}>
              <Link className={`nav-link ${path === "/" && "active"}`} to="/">
                <i className="fa fa-home" aria-hidden="true" />
              </Link>
            </li> */}
            <li className="nav-item" key={2}>
              <Link
                className={`nav-link ${(path === "/" || path === "/" || path === "/") && "active"
                  }`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item" key={3}>
              <Link
                className={`nav-link ${path === "/about-us" && "active"}`}
                to="/about-us"
              >
                About Us
              </Link>
            </li>
            <li className="nav-item" key={4}>
              <Link
                className={`nav-link ${path === "/about-prabandh" && "active"}`}
                to="/about-prabandh"
              >
                PRABANDH
              </Link>
            </li>
            <li className="nav-item" key={5}>
              <Link
                className={`nav-link ${path === "/achievement-of-system" && "active"
                  }`}
                to="/achievement-of-system"
              >
                Achievement of the System
              </Link>
            </li>
            <li className="nav-item" key={6}>
              <Link
                className={`nav-link ${path === "/download"}`}
                onClick={handleDownload}
                to="#"
              >Download
              </Link>
            </li>
            <li className="nav-item pab-minute" key={7}>
              <Link
                className={`nav-link active border-0`}
                to="https://dsel.education.gov.in/pab-minutes"
                target="_blank"
              >PAB Minutes
              </Link>
            </li>
            {/* <li className="nav-item" key={6}>
              <Link
                className={`nav-link ${path === "/enquire-now" && "active"}`}
                to="/enquire-now"
              >
                View Data
              </Link>
            </li> */}
            <li className="nav-item" key={8}>
              <Link
                className={`nav-link ${path === "/enquire-now" && "active"}`}
                to="/enquire-now"
              >
                Contact Us
              </Link>
            </li>
             <li className="nav-item" key={9}>
              <Link
                className={`nav-link ${path === "https://prabandh.education.gov.in/testing/" && "active"}`}
                to="https://prabandh.education.gov.in/testing/"
                target="_blank"
              >
                <strong>Training Application</strong>
              </Link>
            </li> 
            <li className="nav-item" key={9}>
              <Link
                className={`nav-link ${path === "https://prabandh.education.gov.in/pmshri/" && "active"}`}
                to="https://prabandh.education.gov.in/pmshri/"
                target="_blank"
              >
                <strong>PM SHRI</strong>
              </Link>
            </li> 
          </ul>
        </div>

        <form className="d-flex">
          {isLoggedIn !== "true" && (
            <Link className="pointer" to="/admin-login">
              <button className="btn btn-login" type="submit">
                Login Here
              </button>
            </Link>
          )}
          {isLoggedIn === "true" && (
            // <Link className="pointer" to={`/auth${module ? `/${module}` : ''}/admin`}>
            <Link className="pointer" to={`/auth/admin`}>
              <button className="btn btn-login" type="submit">
                Go to Dashboard
              </button>
            </Link>
          )}
        </form>
      </div>
    </nav>
  );
};

export default NavBar;