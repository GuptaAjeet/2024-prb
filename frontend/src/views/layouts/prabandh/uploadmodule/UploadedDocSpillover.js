import { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import "./spill.css";
// import axios from "axios";
import { Helper} from "../../../../apps";
import api from "../../../../apps/utilities/api";
// import Features from "../../../../redux/features";
// import store from "../../../../redux/app/store";
// import { REACT_APP_URL } from "../../../../env";
// import Btnloader from "../../../../apps/components/elements/Btnloader";
// import exportToExcel from "../PrabandhReports/ExcelReports";
// import { Modal } from "../../../../apps/components/elements";
import ComingSoon from "../../../../../src/public/assets/img/coming-soon.png"

const UploadedDocSpillover = () => {
  // const dispatch = useDispatch();
  const user = Helper.auth.user;
  // const { year } = useSelector((state) => state.year);
  // const { version } = useSelector((state) => state.version);
  const [setPlanData] = useState(null);
  // const [managedData, setManagedData] = useState([]);
  // const [activeAM, setActiveAM] = useState({});
  // const [showPopoverWindow, setShowPopoverWindow] = useState(false);
  // const [activePopover, setActivePopover] = useState("");
  // const [spillOverData, setSpillOverData] = useState([]);
  // const [modalNumber, setModalNumber] = useState(0);
  // const [setDetails] = useState(null);
  // const [tableData, setTableData] = useState([
  //   { id: 1, value: "", remarks: "" },
  // ]);
  // const [inputFormData, setInputFormData] = useState([]);
  const [,setUserPer] = useState([]);
  //const [stateList, setStateList] = useState([]);
  // const stateList = Hook.useStates();
  // const [spin, setSpin] = useState([]);
  const [, setFilter] = useState({
    state: "0",
    type: "",
    year: "0",
  });
  // const [pdfbtnStatus, setPdfbtnStatus] = useState(false);
  // const [activityMasterDetailsList, setActivityMasterDetailsList] = useState({
  //   schemeid: 0,
  //   majorcomponentid: 0,
  //   subcomponentid: 0,
  //   activitymasterid: 0,
  //   data: [],
  // });
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setFilter({
        state: location.state.stateid,
        type: location.state.type,
        year: location.state.year,
      });
      handleFetchData(location.state.year, location.state.stateid);
    } else {
      setFilter((prevState) => {
        return {
          ...prevState,
          state: user?.user_state_id || 0,
        };
      });
    }
    getUserPer();
    //getStateList();
  }, [location.state, user]);
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilter((prevState) => {
  //     return { ...prevState, [name]: value };
  //   });
  //   setPlanData(null);
  // };
  const getUserPer = () => {
    api.post("api/admin-users/user-per", { user_id: user?.id }, (res) => {
      setUserPer(res.data);
    });
  };
  /*   const getStateList = () => {
    setSpin(true);
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */
  // useEffect(() => {
  // setFilter((prevState) => {
  //   return {
  //     ...prevState,
  //     state: user?.user_state_id || 0,
  //   };
  // });
  // getUserPer();
  // getStateList();
  // }, [user]);
  const handleFetchData = (year, state) => {
    api.post(
      "api/prabandh/fetch-activity-list-doc",
      {
        year: year,
        stateid: state,
      },
      (res) => {
        setPlanData(res.data);
      }
    );
  };
  // const handleMouseEnter = (activity_master_id) => {
  //   api.post(
  //     "api/prabandh/fetch-doc-activity-detail-list",
  //     {
  //       activity_master_id: activity_master_id,
  //       year: year,
  //       stateid: filter?.state,
  //     },
  //     (res) => {
  //       if (res.status) setDetails(res.data);
  //       else {
  //       }
  //     }
  //   );
  // };
  return (
    <><div className="dashboard-main-content">
      <div className="col-md-12 pb-2">
        <div
          className="dashboard-main-content__header mb-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1>Upload School List As Per Approved Spillover</h1>
        </div>
        <div id="content">
          <div className="container">
            <div className="about pt-4 pb-4">
              <h2 className="inner-title"></h2>
              <div>
                <img src={ComingSoon}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    // <div className="dashboard-main-content">
    //   <div className="col-md-12 pb-2">
    //     <div
    //       className="dashboard-main-content__header mb-3"
    //       style={{ display: "flex", justifyContent: "space-between" }}
    //     >
    //       <h1>Upload School List As Per Approved Spillover</h1>
    //     </div>
    //     <div className="dashboard-main-content-info ">
    //       <div className="row">
    //         <div className="col-md-3">
    //           <select
    //             className="form-select"
    //             name="state"
    //             value={filter?.state}
    //             onChange={handleChange}
    //             disabled={stateList?.find(
    //               (state) => +state.id === +user.user_state_id
    //             )}
    //           >
    //             <option value={0}>Select State</option>
    //             {userPer?.length
    //               ? userPer
    //                 .reduce((uniqueStates, currentItem) => {
    //                   if (
    //                     !uniqueStates.some(
    //                       (item) => item.state_id === currentItem.state_id
    //                     )
    //                   ) {
    //                     uniqueStates.push(currentItem);
    //                   }
    //                   return uniqueStates;
    //                 }, [])
    //                 .map((st, stidx) => (
    //                   <option key={`st_${stidx}`} value={st.state_id}>
    //                     {st.state_name}
    //                   </option>
    //                 ))
    //               : stateList?.map((st, stidx) => (
    //                 <option key={`st_${stidx}`} value={st.id}>
    //                   {st.name}
    //                 </option>
    //               ))}
    //           </select>
    //         </div>
    //         <div className="col-md-3">
    //           <select
    //             className="form-select"
    //             name="type"
    //             value={filter?.type}
    //             onChange={(e) => {
    //               handleChange(e);
    //             }}
    //           >
    //             <option value={0}>Select Plan Type</option>
    //             {/* <option value="spill_over">Spill Over</option> */}
    //             <option value="other">Plan</option>
    //           </select>
    //         </div>
    //         <div className="col-md-3">
    //           <select
    //             className="form-select"
    //             name="year"
    //             value={filter?.year}
    //             onChange={(e) => {
    //               handleChange(e);
    //             }}
    //           >
    //             <option value={0}>Select Plan Year</option>
    //             {/* <option value="2023-2024">2023-2024</option> */}
    //             <option value="2024-2025">2024-2025</option>
    //           </select>
    //         </div>

    //         <div className="col-md-2">
    //           <button
    //             className="btn btn-danger"
    //             style={{ marginLeft: "10px" }}
    //             disabled={
    //               +filter.type === 0 ||
    //               +filter.year === 0 ||
    //               +filter.state === 0
    //             }
    //             onClick={() => handleFetchData(filter.year, filter.state)}
    //           >
    //             Show
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //     <div className=" table-scroll-section m-0">
    //       {planData && (
    //         <table className="table-scroll table-sm">
    //           <thead>
    //             <tr>
    //               <th>S. No.</th>
    //               <th>Scheme</th>
    //               <th>Major Component</th>
    //               <th>Sub Component</th>
    //               <th>Activity</th>
    //               <th>Action</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {
    //               // +filter.type === 0 || +filter.year === 0 || +filter.state === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", fontSize: "25px" }}>Please Select All Filters</td></tr> :
    //               planData && planData?.length === 0 ? (
    //                 <tr>
    //                   <td
    //                     colSpan={6}
    //                     style={{ textAlign: "center", fontSize: "25px" }}
    //                   >
    //                     No Data Found
    //                   </td>
    //                 </tr>
    //               ) : (
    //                 planData?.length > 0 &&
    //                 planData?.map((p, idx) => {
    //                   return (
    //                     <tr
    //                       key={`plandata_${idx}`}
    //                       style={{
    //                         backgroundColor: `${p.scheme_id === "1"
    //                             ? "#bedef4"
    //                             : p.scheme_id === "2"
    //                               ? "#c1f1d5"
    //                               : "#fce2b6"
    //                           }`,
    //                       }}
    //                     >
    //                       <td>{idx + 1}</td>
    //                       <td>{p.scheme_name}</td>
    //                       <td>{p.major_component_name}</td>
    //                       <td>{p.sub_component_name}</td>
    //                       <td>{p.activity_master_name}</td>
    //                       <td className="d-flex gap-3">
    //                         <Link
    //                           to="/auth/prabandh/uploadadd"
    //                           state={{
    //                             sid: p.scheme_id,
    //                             mcid: p.major_component_id,
    //                             scid: p.sub_component_id,
    //                             amid: p.activity_master_id,
    //                             stateid: filter?.state,
    //                             type: filter?.type,
    //                             year: filter?.year,
    //                             scheme_name: p.scheme_name,
    //                             major_component_name: p.major_component_name,
    //                             sub_component_name: p.sub_component_name,
    //                             activity_master_name: p.activity_master_name,
    //                           }}
    //                         >
    //                           <div className="fill_plan_edit_icon">
    //                             <i className="bi bi-pencil-square text-primary fill_plan_edit_hover"></i>
    //                           </div>
    //                         </Link>
    //                         {/* <button type="button" className="btn btn-success"
    //                           data-bs-toggle="tooltip" data-bs-placement="top"
    //                           data-bs-custom-class="custom-tooltip"
    //                           data-bs-title="This top tooltip is themed via CSS variables.">
    //                           <i
    //                             data-bs-toggle="tooltip"
    //                             title="Reject District Plan"
    //                             className="bi bi-x-circle"
    //                           ></i>
    //                         </button>
    //                         <button
    //                           className="btn btn-sm btn-success"
    //                           data-bs-toggle="tooltip" data-bs-placement="top"
    //                           data-bs-custom-class="custom-tooltip"
    //                           data-bs-title="This top tooltip is themed via CSS variables."
    //                         // onClick={(e) => {
    //                         //   setModal_header_name("Reject District Plan")
    //                         //   setIsOpen(true);
    //                         //   setStateID(
    //                         //     district.district_state_id
    //                         //   );
    //                         //   setDistrictID(
    //                         //     district.district_id
    //                         //   );
    //                         //   setSaveAction(2);
    //                         //   setDisplayAction(5);
    //                         // }}
    //                         >
    //                           <i
    //                             data-bs-toggle="tooltip"
    //                             title="Submitted Activity"
    //                             className="bi bi-check-circle"
    //                           ></i>
    //                         </button> */}
    //                         <div
    //                           className="btn_hover_div"
    //                           onMouseEnter={() =>
    //                             handleMouseEnter(p.activity_master_id)
    //                           }
    //                         >
    //                           <button className="btn btn-success cutom_tooltip_btn">
    //                             <i
    //                               data-bs-toggle="tooltip"
    //                               title="Submitted Activity"
    //                               className="bi bi-check-circle"
    //                             ></i>
    //                           </button>
    //                           <div className="cutom_tooltip_show">
    //                             <i className="bi bi-caret-right-fill arraow_icon"></i>
    //                             {/* <i className="bi bi-caret-up-fill arraow_icon"></i> */}
    //                             <table
    //                               cellPadding={5}
    //                               cellSpacing={5}
    //                               className="table table-bordered mt-3"
    //                             >
    //                               <tr>
    //                                 <td
    //                                   colSpan={4}
    //                                   style={{ fontWeight: "bold" }}
    //                                 >
    //                                   Sub Activity{" "}
    //                                 </td>
    //                               </tr>
    //                               <tr>
    //                                 <td>
    //                                   <b>Name</b>
    //                                 </td>
    //                                 <td>
    //                                   <b>Quantity</b>
    //                                 </td>
    //                                 <td>
    //                                   <b>Status</b>
    //                                 </td>
    //                               </tr>
    //                               <tbody>
    //                                 {details?.map((c) => (
    //                                   <tr>
    //                                     <td>
    //                                       <i
    //                                         data-bs-toggle="tooltip"
    //                                         title="Submitted Activity"
    //                                         className="bi bi-check-circle bg-success"
    //                                         style={{
    //                                           borderRadius: "5px",
    //                                           marginRight: "3px",
    //                                           padding: "2px 4px",
    //                                         }}
    //                                       ></i>
    //                                       <span style={{ fontSize: "12px" }}>
    //                                         {c?.activity_master_details_name}
    //                                       </span>
    //                                     </td>
    //                                     <td className="bg-light">
    //                                       {c?.proposed_physical_quantity}
    //                                     </td>
    //                                     <td className="bg-light">
    //                                       {+c?.eligible_for_allocation === 1
    //                                         ? "Approved"
    //                                         : "Pending"}
    //                                     </td>
    //                                   </tr>
    //                                 ))}
    //                               </tbody>
    //                             </table>
    //                           </div>
    //                         </div>
    //                         {/* <button
    //                           data-bs-toggle="tooltip"
    //                           title="Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity Submitted Activity v" className="btn btn-sm btn-success">submitted</button> */}
    //                       </td>
    //                     </tr>
    //                   );
    //                 })
    //               )
    //             }
    //           </tbody>
    //         </table>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};
export default UploadedDocSpillover;
