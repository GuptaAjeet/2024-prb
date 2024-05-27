import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Hook, API, Helper, Settings, sweetAlert } from "../../../apps";
import features from "../../../redux/features";
//import Logo from "../../../apps/components/elements/logo";
import { useSelector, useDispatch } from "react-redux";
import Features from "../../../redux/features";
//import Accordion from "react-bootstrap/Accordion";
//import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { APP_ENVIRONMENT } from "../../../env";
// import Accordion from 'react-bootstrap/Accordion';
//import Button from "react-bootstrap/Button";
//import { AccordionEventKey } from "react-bootstrap/AccordionContext";

const SideBar = (props) => {
  const navigator = useNavigate();
  const years = Hook.useYears();
  // const [data, setdata] = useState("1");
  const [smenu, setMemu] = useState([]);
  const [currentPath, setCurrentPath] = useState();
  const [currentUniqueCode, setCurrentUniqueCode] = useState("");
  const { year: defaultYear } = useSelector((state) => state.year);
  const { module } = useSelector((state) => state.module);
  //const [accordionId, setAccodionId] = useState(null);
  // const [userRole, setUserRole] = useState(() => {
  //   return Helper.auth?.user?.user_role_id;
  // });
  const user = Helper.auth.user;
  // var userId = "";
  // if(user === undefined){
  //   userId = localStorage.getItem("")
  // }
  // const [userId, setUserId] = useState((user && user.id) ? user.id : 0);

  const dispatch = useDispatch();
  const location = useLocation();
  const [majorComponentCondition, setMajorComponentCondition] = useState(["Elementary Education", "Secondary Education"]);
  const [moduleOf, setModuleOf] = useState([]);

  //  useEffect(() => {
  // if([1,2,3,4].includes(user?.user_role_id)){
  //   setModuleOf([{id:1, module_name: "Allocation"}, {id:2, module_name: "Plan"}, {id:3, module_name: "Progress"}])
  // }else if([5,6,7,8].includes(user?.user_role_id)){
  //   setModuleOf([{id:1, module_name: "Allocation"}, {id:2, module_name: "Plan"}, {id:3, module_name: "Progress"}])
  // }else if([9,10,11,12].includes(user?.user_role_id)){
  //   setModuleOf([{id:2, module_name: "Plan"}, {id:3, module_name: "Progress"}])
  // }
  // }, []);

  useEffect(() => {
    API.post("api/prabandhdata/component-saidbar", { id: user?.user_role_id },
      (result) => {
        if (result.status) {
          // setMemu(result?.data);
          // dispatch(Features.setMenu({ payload: result?.data }));

          const moduleGroupsArray = result.data.flatMap((item) => item.module_group && JSON.parse(item.module_group));

          const moduleGroupsSet = new Set(moduleGroupsArray);
          setModuleOf([...moduleGroupsSet]);

          if (moduleGroupsSet.length === 1) {
            dispatch(features.setModule({ module: moduleGroupsSet[0] }));
          }
          // if(module){
          setMemu(result?.data?.filter((item) => item.module_group.includes(!module ? "plan" : module)));

          dispatch(
            Features.setMenu({
              payload: result?.data?.filter((item) =>
                item.module_group.includes(!module ? "plan" : module)
              ),
            })
          );
          // }else{
          //   setMemu(result?.data);
          //   dispatch(Features.setMenu({ payload: result?.data }));
          // }
        }
      }
    );

    // let x = window.matchMedia("(max-width: 1366px)");
    // if (x.matches) {
    //   const dashboardSideBar = document.querySelector(".sidebar");
    //   dashboardSideBar.style.marginLeft = "-320px";
    //   const button = document.querySelector(".dashboard-chevron-left");
    //   button.classList.remove("bi-chevron-left");
    //   button.classList.add("bi-chevron-right");
    // }
  }, [user?.id, module]);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [window.location.pathname]);

  const onCLickMenu = () => {
    const accountBtn = document.getElementsByClassName("accordion-button");
    for (let i = 0; i < accountBtn.length; i++) {
      if (!accountBtn[i].classList.contains("collapsed")) {
        accountBtn[i].click();
      }
    }
  };

  const changeBaseYear = (e) => {
    const yr = e.target.value;
    sweetAlert.confirmation({
      title: "Are you sure?",
      msg: `Do you really want to change year to ${yr}`,
      yesBtnText: "Yes",
      noBtnText: "No",
      url: "",
      callback: () => {
        dispatch(features.setYear({ year: yr }));
        localStorage.setItem("selected_year", yr);
        setTimeout(() => {
          navigator(`/auth/admin`);
        }, 200);
      },
      redirect: "",
    });
  };

  const changeBaseModule = (e) => {
    const moduleN = e.target.value;
    sweetAlert.confirmation({
      title: "Are you sure?",
      msg: `Do you really want to switch to ${(
        moduleN || "plan"
      ).toUpperCase()} Module ?`,
      yesBtnText: "Yes",
      noBtnText: "No",
      url: "",
      callback: () => {
        dispatch(features.setModule({ module: moduleN }));
        setTimeout(() => {
          // if (moduleN === "") {
          navigator(`/auth/admin`);
          // } else if (moduleN === "allocation") {
          //   navigator(`/auth/allocation/admin`);
          // } else if (moduleN === "progress") {
          //   navigator(`/auth/progress/admin`);
          // }
        }, 200);
      },
      redirect: "",
    });
  };

  return (
    <>
      <div className="sidebar" style={APP_ENVIRONMENT === "testing" ? { backgroundColor: "red" } : {}}>
        <div className="sidebar-logo" style={APP_ENVIRONMENT === "testing" ? { backgroundColor: "red" } : {}}>
          <h2 className="text-white">
            <Link to="/auth/admin"> PRABANDH</Link>
          </h2>
          <p className="text-white">
            Project Appraisal, Budgeting, Achievements and Data Handling System
          </p>
        </div>
        <div className="sidebar-inner" style={APP_ENVIRONMENT === "testing" ? { backgroundColor: "red" } : {}}>
          <div className="yeardiv">
            <i className="bi bi-calendar3 me-2 mr-2 bcal" />
            PRABANDH OF
            <select className="yearsel me-2 wth-100 ml-2" value={defaultYear} onChange={(e) => changeBaseYear(e)}>
              {years?.map((year) => (
                <option key={year.id} value={year.year_name}>
                  {year.year_name}
                </option>
              ))}
            </select>
          </div>

          {Object.keys(moduleOf).length > 1 && (
            <div className="yeardiv">
              <i className="bi bi-calendar3 me-2 mr-2 bcal" />
              MODULE :
              <select className="yearsel me-2 wth-100 ml-2" value={module || ""} onChange={(e) => changeBaseModule(e)}>
                {moduleOf?.map((key, i) => (
                  <option key={i} value={key !== "plan" ? key : ""}>
                    {key.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ul className="list">
            <li className={`${currentPath === "/auth/admin" ? "active" : ""} `} onClick={onCLickMenu}>
              {/* <Link to={`${!module ? (!!user?.id ? '/auth/admin' : '/auth/school') : '/auth/' + module + '/admin'}`}> */}
              <Link to={`/auth/admin`}>
                <i className="bi bi-speedometer2 me-2"></i>
                &nbsp; DASHBOARD
              </Link>
            </li>
            {console.log("smenu", smenu, module)}
            {smenu &&
              smenu.map((m, index) => {
                if (m.name.toUpperCase() === "PLAN CONFIGURATOR") {
                  return (
                    <li key={index}>
                      <div className="accordion" id="accordionExampl2e">
                        <div className="accordion-item">
                          <h2 className="accordion-header mb-1">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMain"
                              aria-expanded="true" aria-controls="collapseMain"
                            /* onClick={() =>
                      navigate("/auth/prabandh/plan/step-1")
                    } */
                            >
                              <i className="bi bi-sliders2 me-2"></i>PLAN CONFIGURATOR
                            </button>
                          </h2>
                          {/* code start */}
                          <div id="collapseMain" className="accordion-collapse collapse pt-0 p-2" data-bs-parent="#accordionExample">
                            <div className="accordion" id="accordionExample-inner">
                              {props.sl &&
                                props.sl.length > 0 &&
                                props.sl.map((s, i) => {
                                  return (
                                    <div className="accordion-item " key={`s_${i}`}>
                                      {Settings.isDataExistsInArray(majorComponentCondition, s.scheme_name) && (
                                        <h2 className="accordion-header mb-1">
                                          <button className={`accordion-button collapsed`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${i}`}
                                            aria-expanded="false" aria-controls={`collapse${i}`} onClick={() => { props.smc(s.unique_code); }}>

                                            {s.scheme_name === "Elementary Education" && (
                                              <i className="bi bi-pencil me-2"></i>
                                            )}
                                            {s.scheme_name === "Secondary Education" && (
                                              <i className="bi bi-book me-2"></i>
                                            )}
                                            {s.scheme_name === "Teacher Education" && (
                                              <i className="bi bi-person-video3 me-2"></i>
                                            )}
                                            {s.scheme_name}
                                          </button>
                                        </h2>
                                      )}
                                      <div id={`collapse${i}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body p-0 pt-3 pb-3">
                                          <ul className="master_list">
                                            {props.mcl.data?.length > 0 &&
                                              props.mcl.schemeid ===
                                              s.unique_code &&
                                              props.mcl.data.map((mc, i) => {
                                                return (
                                                  <li key={`mcl_${i}`} className={`${currentUniqueCode === mc.title ? "activeUniqueCode" : ""}`}>
                                                    <NavLink to="/auth/prabandh/plan/step-1" className={({ isActive }) => isActive ? "active" : ""}
                                                      onClick={() => {
                                                        props.sasc(mc, s.unique_code);
                                                        setCurrentUniqueCode(mc.title);
                                                      }}>
                                                      <i className="bi bi-dot"></i>
                                                      {mc.title}
                                                    </NavLink>
                                                  </li>
                                                );
                                              })}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          {/* code end */}
                        </div>
                      </div>
                    </li>
                  );
                } else if (m.name === "Select Schools") {
                  return (
                    <li key={index}>
                      <div className="accordion" id="accordionExampl3e">
                        <div className="accordion-item">
                          <h2 className="accordion-header mb-1">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMainSC"
                              aria-expanded="true" aria-controls="collapseMainSC"
                            >
                              <i className="bi bi-sliders2 me-2"></i>SCHOOL
                              CONFIGURATOR
                            </button>
                          </h2>
                          {/* code start */}
                          <div id="collapseMainSC" className="accordion-collapse collapse pt-0 p-2" data-bs-parent="#accordionExampleSC">
                            <div className="accordion" id="accordionExampleSC-inner">
                              <div className="accordion-item " key={`sc_1`}>
                                <h2 className="accordion-header mb-1">
                                  <Link to="/auth/prabandh/schools/configurator?p=1">
                                    <i className="bi bi-bar-chart-steps" />{" "}
                                    Major Component
                                  </Link>
                                </h2>
                              </div>
                              {/* kgbv start  */}
                              <div className="accordion-item " key={`sc_2`}>
                                <h2 className="accordion-header mb-1">
                                  <NavLink to="/auth/prabandh/schools/configurator?p=2" className={({ isActive }) => isActive ? "active" : ""}>
                                    <i className="bi bi-building" /> KGBV
                                  </NavLink>
                                </h2>
                              </div>
                              {/* netaji subhas*/}
                              <div className="accordion-item " key={`sc_3`}>
                                <h2 className="accordion-header mb-1">
                                  <NavLink to="/auth/prabandh/schools/configurator?p=3" className={({ isActive }) => isActive ? "active" : ""}>
                                    <i className="bi bi-house-door" /> Netaji
                                    Subhas
                                  </NavLink>
                                </h2>
                              </div>
                            </div>
                          </div>
                          {/* code end */}
                        </div>
                      </div>
                    </li>
                  );
                } else if (m.name === "REPORTS") {
                  return (
                    <li onClick={onCLickMenu} key={index} className={`${location?.pathname.includes("report") ? "active" : ""}`}>
                      <NavLink to={m.url} className={({ isActive }) => (isActive ? "active" : "")}>
                        <i className={m.menu_img}></i> {m.name}
                      </NavLink>
                    </li>
                  );
                } else if (!m?.parent_sm && m.url) {
                  return (
                    <li onClick={onCLickMenu} key={index} className={`${location?.pathname === m.active_url ? "active" : ""}`}>
                      <NavLink to={m.url} className={({ isActive }) => (isActive ? "active" : "")}>
                        <i className={m.menu_img}></i> {m.name}
                      </NavLink>
                    </li>
                  );
                } else {
                  // show diet menu only for plan Year 2023-2024
                  // || m.name === "Diet Fund Management" || m.name === "DIET OF Excellence Progress"
                  if(m.name === "DIET PLAN"){
                    if("2023-2024"===defaultYear){
                      return (
                        <li key={index}
                        >
                          <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed sidebar_accodion_btn" style={{ textTransform: "uppercase" }} type="button"
                                  data-bs-toggle="collapse" data-bs-target={`#collapseThree_${m.id}`} aria-expanded="false" aria-controls={m.id}
                                >
                                  <i className="bi bi-list-task" style={{ marginRight: "10px" }}></i>
                                  {m.name}
                                </button>
                              </h2>
                              <div id={`collapseThree_${m.id}`} className="accordion-collapse collapse" data-bs-parent={m.id}>
                                <div className="accordion-body">
                                  <ul className="master_list">
                                    {m.parent_sm &&
                                      m.parent_sm.map((v, iv) => (
                                        <li key={iv}>
                                          <Link to={v.smp_url}>
                                            <i className="bi bi-dot"></i>
                                            {v.smp_name}
                                          </Link>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  }else{
                    return (
                      <li key={index}
                      >
                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button className="accordion-button collapsed sidebar_accodion_btn" style={{ textTransform: "uppercase" }} type="button"
                                data-bs-toggle="collapse" data-bs-target={`#collapseThree_${m.id}`} aria-expanded="false" aria-controls={m.id}
                              >
                                <i className="bi bi-list-task" style={{ marginRight: "10px" }}></i>
                                {m.name}
                              </button>
                            </h2>
                            <div id={`collapseThree_${m.id}`} className="accordion-collapse collapse" data-bs-parent={m.id}>
                              <div className="accordion-body">
                                <ul className="master_list">
                                  {m.parent_sm &&
                                    m.parent_sm.map((v, iv) => (
                                      <li key={iv}>
                                        <Link to={v.smp_url}>
                                          <i className="bi bi-dot"></i>
                                          {v.smp_name}
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  
                }
              })}
              
          </ul>

          <div className="support yeardiv mt-3 p-3">
            <i className="bi bi-patch-question bcal me-2"></i>
            <span key={11111111111}>
              <Link to={"/auth/prabandh/ticket"}>SUPPORT</Link>{" "}
            </span>
          </div>
        </div>
        <div className="dashboard-icon" title="Close Sidebar">
          <i className="bi bi-chevron-left dashboard-chevron-left"></i>
        </div>
      </div>
    </>
  );
};

export default SideBar;