import React, { Fragment, useEffect, useState } from "react";
import Banner from "./banner";
import About from "./about";
import Achievements from "./achievements";
import Testimonials from "./testimonials";

import ExternalSliderLinks from "./extranl-slider-links";

import Features from "../../../redux/features";
import { useDispatch } from "react-redux";
// import { Modal } from "../../../apps/components/elements";
import AOS from "aos";
import "aos/dist/aos.css";

const Index = (props) => {
  const dispatch = useDispatch();
  // const [actMod,setActMod]    =   useState({'id':0,'show':false,'type':null});
  const [, setShow] = useState({ id: null, status: false, flag: null });

  const loadPage = (e) => {
    const label = e.nativeEvent.target.getAttribute("menu");
    const title = label !== "" ? label : "Home";
    localStorage.setItem("label", title);
    dispatch(Features.setLabel({ title: title, optional: "" }));
  };

  const viewOnYoutube = (e) => {
    setShow({
      id: e.target.getAttribute("data-code"),
      status: true,
      flag: "video",
    });
    dispatch(
      Features.showModal({ title: e.target.getAttribute("alt"), size: "xl" })
    );
  };

  useEffect(() => {
    AOS.init({ duration: 2000 });
  });

  /*   const viewDetails = (e) => {
    const id = e.target.getAttribute("data-id");
    const flag = e.target.getAttribute("data-flag");
    setShow({ id: id, flag: flag, status: true });
    dispatch(Features.showModal({ title: "Activities Details" }));
  }; */

  // const [action, setAction] = useState({
  //   gender: null,
  //   specialization: null,
  //   id: null,
  //   box: false,
  // });
  //const model = useSelector((state) => state.modal);

  /*   const activityViewHandler = (e) => {
    setAction({
      gender: e.currentTarget.getAttribute("gender"),
      specialization: e.currentTarget.getAttribute("specialization"),
      id: e.currentTarget.getAttribute("data-id"),
      box: true,
    });
    dispatch(
      Features.showModal({ title: "Activities Details", btntext: "view" })
    );
    setShow({ id: null, status: true, flag: "ongoing" });
  }; */

  return (
    <Fragment>
      <Banner loadPage={loadPage} />
      <About loadPage={loadPage} viewOnYoutube={viewOnYoutube} />
      <Achievements />
      <Testimonials />
      <ExternalSliderLinks />
    </Fragment>
  );
};

export default Index;
