import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../apps/utilities/api";
import { Helper, Hook } from "../../../apps";
import Spinner from "../../../apps/components/elements/Spinner";
import { AccordianLayout, Accordian } from "../../../apps/components/elements/Accordian";
const AllocationDashboard = () => {
  const user = Helper.auth.user;
  const location = useLocation();

  //const [schemesList, setSchemesList] = useState([]);
  const [majorComponenetList, setMajorComponenetList] = useState([]);
  const [subCompList, setSubCompList] = useState([]);
  const [actMasterList, setActMasterList] = useState([]);
  const [actMasterDetailList, setActMasterDetailList] = useState([]);
  //const [stateList, setStateList] = useState([]);
  const [spin, setSpin] = useState(false);
  const { list: schemesList, fetchList: fetchSchemesList } = Hook.useSchemes();
  const stateList = Hook.useStates();

  const [filter, setFilter] = useState({
    month: "0",
    state: user?.user_state_id || 0,
    district: "0",
    scheme_id: "0",
    major_component_id: "0",
    sub_component_id: "0",
    activity_master_id: "0",
    activity_master_details_id: "0",
  });

  useEffect(() => {
    //getStateList();
    fetchSchemesList();
    backButtonAction(location.state);
  }, []);

  const backButtonAction = async (backState) => {
    if (backState !== null) {
      api.post(
        "api/prabandh/major-components",
        { schemeid: backState?.backParams?.activityDetails?.scheme_id },
        (res) => {
          setMajorComponenetList(res.data);
          api.post(
            "api/prabandh/allocation-sub-components-list",
            {
              schemeid: backState?.backParams?.activityDetails?.scheme_id,
              major_component_id:
                backState?.backParams?.activityDetails?.major_component_id,
              state_id: backState?.backParams?.state_id,
            },
            (res) => {
              setSubCompList(res.data);
              api.post(
                "api/prabandh/allocation_activity-master-list",
                {
                  schemeid: backState?.backParams?.activityDetails?.scheme_id,
                  major_component_id:
                    backState?.backParams?.activityDetails?.major_component_id,
                  sub_component_id:
                    backState?.backParams?.activityDetails?.sub_component_id,
                  state_id: backState?.backParams?.state_id,
                },
                (res) => {
                  setActMasterList(res.data);
                  setFilter((prevState) => {
                    return {
                      ...prevState,
                      month: "0",
                      state: backState?.backParams?.state_id,
                      district: "0",
                      scheme_id:
                        backState?.backParams?.activityDetails?.scheme_id,
                      major_component_id:
                        backState?.backParams?.activityDetails
                          ?.major_component_id,
                      sub_component_id:
                        backState?.backParams?.activityDetails
                          ?.sub_component_id,
                      activity_master_id:
                        backState?.backParams?.activityDetails
                          ?.activity_master_id,
                      activity_master_details_id:
                        backState?.backParams?.activityDetails?.id,
                    };
                  });
                }
              );
            }
          );
        }
      );
    }
  };

  /*   const getStateList = () => {
    setSpin(true);
    api.get("api/states/list", null, (res) => {
      setStateList(res.data);
      setSpin(false);
    });
  }; */

  /*   const getSchemesList = () => {
    setActMasterList([]);
    setSpin(true);
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
      setSpin(false);
    });
  }; */

  const getActMasterList = (value) => {
    setActMasterList([]);
    // setSpin(true);
    api.post(
      "api/prabandh/allocation_activity-master-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: value,
        state_id: filter?.state || 0,
      },
      (res) => {
        setActMasterList(res.data);
        setSpin(false);
        setFilter((prevState) => {
          return {
            ...prevState,
            activity_master_id: 0,
            activity_master_details_id: 0,
          };
        });
      }
    );
  };

  const getSubCompList = (value) => {
    setActMasterList([]);
    // setSpin(true);
    api.post(
      "api/prabandh/allocation-sub-components-list",
      {
        schemeid: filter?.scheme_id,
        major_component_id: value,
        state_id: filter?.state || 0,
      },
      (res) => {
        setSubCompList(res.data);
        setSpin(false);
        setFilter((prevState) => {
          return {
            ...prevState,
            sub_component_id: 0,
            activity_master_id: 0,
            activity_master_details_id: 0,
          };
        });
      }
    );
  };

  const getMajorComponenetList = (value) => {
    setActMasterList([]);
    // setSpin(true);
    api.post("api/prabandh/major-components", { schemeid: value }, (res) => {
      setMajorComponenetList(res.data);
      setSpin(false);
      setFilter((prevState) => {
        return {
          ...prevState,
          major_component_id: 0,
          sub_component_id: 0,
          activity_master_id: 0,
          activity_master_details_id: 0,
        };
      });
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilter((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleAccordianBody = (e, activity) => {
    // setSpin(true);
    api.post(
      "api/prabandh/allocation_activity-master-list-details",
      {
        schemeid: filter?.scheme_id,
        major_component_id: filter?.major_component_id,
        sub_component_id: filter?.sub_component_id,
        activity_master_id: activity.id,
        state_id: filter?.state || 0,
        activity_group_code: user?.activity_group_code
      },
      (res) => {
        setActMasterDetailList(res.data);
        setFilter((prevState) => {
          return { ...prevState, activity_master_details_id: 0 };
        });
        setSpin(false);
      }
    );
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header">
        <h1 style={{ display: "inline-block" }}>Allocation Activity List</h1>
      </div>
      {spin && <Spinner size={20} />}
      <div className="dashboard-main-content-info mb-3 mt-3 app-bg" id="search">
        <div className="row mt-3">
          <div className="col-md-4">
            <select
              className="form-select"
              name="state"
              value={filter.state}
              onChange={(e) => handleChange(e)}
              disabled={
                stateList &&
                stateList.find((state) => +state.id === user?.user_state_id)
              }
            >
              <option value={0}>State (All)</option>
              {stateList &&
                stateList.map((st, stidx) => (
                  <option key={`st_${stidx}`} value={st.id}>
                    {st.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4">
            <select
              className="form-select"
              name="scheme_id"
              value={filter?.scheme_id}
              onChange={(e) => {
                handleChange(e);
                getMajorComponenetList(e.target.value);
              }}
            >
              <option value={0}>Scheme (All)</option>
              {([25, 26].includes(user.user_role_id) ? schemesList.filter((schm)=>schm.id===3) : schemesList).map((s, idx) => (
                <option key={`sl_${idx + 1}`} value={s.id}>
                  {s.scheme_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              name="major_component_id"
              value={filter?.major_component_id}
              onChange={(e) => {
                handleChange(e);
                getSubCompList(e.target.value);
              }}
            >
              <option value={0}>Major Component (All)</option>
              {majorComponenetList.map((m, idx) => (
                <option key={`mc_${idx + 1}`} value={m.prb_major_component_id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              name="sub_component_id"
              value={filter?.sub_component_id}
              onChange={(e) => {
                handleChange(e);
                getActMasterList(e.target.value);
              }}
            >
              <option value={0}>Sub Component (All)</option>
              {(+user.user_role_id===25 ? subCompList.filter((schm)=>schm.sub_component_id===222) : subCompList).map((m, idx) => (
                <option key={`mc_${idx + 1}`} value={m.sub_component_id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="col-md-12 pb-2">
        <div className="dashboard-main-content-info clear">
          <div className="row p-3">
            <div className="col-lg-12 mob-padding-0">
              <div className="card">
                <div className="card-body">
                  {actMasterList.length > 0 ? (
                    <div className="alert alert-primary bg-primary text-light border-0 show font-size-16">
                      Activity Master List
                    </div>
                  ) : (
                    <div className="alert alert-light bg-light text-dark border-0 show font-size-16">
                      <span className="font60">🛠️📝</span>
                      <strong>Kindly Select Activity</strong>
                    </div>
                  )}
                  <AccordianLayout>
                    {actMasterList?.length > 0 &&
                      actMasterList?.map((activity, index) => (
                        <Accordian
                          key={index}
                          id={activity.id}
                          title={`${index + 1}) ${activity.title}`}
                          onClick={(e) => handleAccordianBody(e, activity)}
                        >
                          {spin && <Spinner size={2} />}
                          <div
                            className={`alert text-light border-0 show font-size-16 ${actMasterDetailList.length > 0
                              ? "alert-success bg-success"
                              : "alert-danger bg-danger"
                              }`}
                          >
                            Activity Master Details:{" "}
                            {actMasterDetailList.length} Found
                          </div>
                          <ul className="list-group">
                            {actMasterDetailList?.length > 0 &&
                              actMasterDetailList[0].activity_master_id ===
                              activity.id &&
                              actMasterDetailList.map((d, didx) => (
                                <li
                                  key={`${index}${didx}`}
                                  className="list-group-item"
                                >
                                  <Link
                                    to="/auth/allocation/activity"
                                    className="text-black"
                                    state={{
                                      activity: activity,
                                      activityDetails: d,
                                      state_id: filter.state,
                                    }}
                                  >
                                    {didx + 1}) {d.activity_master_details_name}
                                    <i className="bi bi-pencil me-1 text-success cfr" />
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </Accordian>
                      ))}
                  </AccordianLayout>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllocationDashboard;
