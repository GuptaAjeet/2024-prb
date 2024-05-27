import { useState, useEffect,Fragment } from "react";
//import Layout from "../../../layouts/school/layout";
//import { api, masters, helper } from "../../../utilities/helper";
import api from "../../../apps/utilities/api";
//import { DownloadLoader } from "../../../utilities/ui";
import s from "./internal-assessment.module.css";
//import { Button } from "../../../utilities/form";
//import { Profile } from "../profile";

const Index = () => {
  const [schemesList, setSchemesList] = useState([]);
  const [majorComponentList, setMajorComponenetList] = useState({
    schemeid: 0,
    data: [],
  });
  const [subComponentList, setSubComponenetList] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    data: [],
  });
  const [activityMasterList, setActivityMasterList] = useState({
    schemeid: 0,
    majorcomponentid: 0,
    subcomponentid: 0,
    data: [],
  });
  const [levelOne, setLevelOne] = useState(0);

  useEffect(() => {
    api.post("api/prabandh/schemes", { data: "ABCD" }, (res) => {
      setSchemesList(res.data);
    });
  }, []);

  const levelOneDrill = (i) => {
    api.post("api/prabandh/major-components", { schemeid: i }, (res) => {
      setMajorComponenetList({ schemeid: i, data: res.data });
    });
  };

  const levelTwoDrill = (schemeid, majorcomponentid) => {
    api.post(
      "api/prabandh/sub-components",
      { schemeid: schemeid, majorcomponentid: majorcomponentid },
      (res) => {
        setSubComponenetList({
          schemeid: schemeid,
          majorcomponentid: majorcomponentid,
          data: res.data,
        });
      }
    );
  };

  const levelThreeDrill = (schemeid, majorcomponentid, subcomponentid) => {
    api.post(
      "api/prabandh/activity-master",
      {
        schemeid: schemeid,
        majorcomponentid: majorcomponentid,
        subcomponentid: subcomponentid,
      },
      (res) => {
        setActivityMasterList({
          schemeid: schemeid,
          majorcomponentid: majorcomponentid,
          subcomponentid: subcomponentid,
          data: res.data,
        });
      }
    );
  };

  return (
    <div className="col-md-12 pb-2">
      <div
        className="card pt-0 pb-1 mt-0"
        style={{ border: "unset", background: "transparent" }}
      >
        <div className="row p-3">
          <div className={s.cdiv}>
            <span>Dashboard</span>
          </div>
          <h4>Integrated Scheme of School Education</h4>
          {schemesList.length > 0 ? (
            <table
              width="100%"
              cellPadding={10}
              cellSpacing={10}
              border={1}
              className={s.f2_border}
              style={{ marginBottom: 50 }}
            >
              <thead className={s.cthead}>
                <tr>
                  <th rowSpan={2} className={s.cthead_tr} width="15%">
                    EDUCATION CATEGORIES
                  </th>
                  <th colSpan={6} className={s.ssad}>
                    SCHOOL SELF ASSESSMENT DETAILS
                  </th>
                </tr>
                <tr style={{ background: "#01204a", color: "#fff" }}>
                  <th width="10%">Major Component Counts</th>
                  <th width="25%">Sub Component Counts</th>
                  <th width="25%">Activity Master Counts</th>
                  <th width="5%">Action</th>
                </tr>
              </thead>
              <tbody>
                {schemesList &&
                  schemesList.length > 0 &&
                  schemesList.map((item, index) => {
                    return (
                      <Fragment key={`F_${item.id}`}>
                        <tr
                          key={`trow_${index + 1}`}
                          className={`${s.crow} pointer ${
                            levelOne === item.id ? s.activeDomain : ""
                          }`}
                          onClick={() => levelOneDrill(item.unique_code)}
                        >
                          <td className={s.cc}>
                            <span>{`${index + 1}. ${item.scheme_name}`}</span>
                          </td>
                          <td className={s.cc}>
                            <span className="badge badge-success">
                              {`Major Components (${
                                item.total_components
                                  ? item.total_components
                                  : 0
                              })`}
                            </span>
                          </td>
                          <td className={s.cc}>
                            <span className="badge badge-success">
                              {`Sub Components (${
                                item.total_subcomponents
                                  ? item.total_subcomponents
                                  : 0
                              })`}
                            </span>
                          </td>
                          <td className={s.cc}>
                            <span className="badge badge-success">
                              {`Activity Master (${
                                item.total_activity_master
                                  ? item.total_activity_master
                                  : 0
                              })`}
                            </span>
                          </td>
                          <td className={s.cc}>
                            <i className={`fas fa-list pointer ${s.bigEdit}`} />
                          </td>
                        </tr>
                        {majorComponentList.data.length > 0 &&
                          item.unique_code === majorComponentList.schemeid &&
                          majorComponentList.data.map((mc, idx) => {
                            return (
                              <Fragment key={`F_${mc.major_component_id}`}>
                                <tr
                                  key={`trow_${mc.major_component_id}`}
                                  className={`${s.crow} pointer`}
                                  onClick={() =>
                                    levelTwoDrill(
                                      item.unique_code,
                                      mc.major_component_id
                                    )
                                  }
                                >
                                  <td
                                    className={s.cc}
                                    style={{ color: "#c8c8c8", opacity: 0.3 }}
                                  >
                                    <span>{`${mc.scheme_name}`}</span>
                                  </td>
                                  <td className={s.cc}>{mc.major_component}</td>
                                  <td className={s.cc}>
                                    <span className="badge badge-success">
                                      {`Sub Components (${
                                        mc.total_subcomponents
                                          ? mc.total_subcomponents
                                          : 0
                                      })`}
                                    </span>
                                  </td>
                                  <td className={s.cc}>
                                    <span className="badge badge-success">
                                      {`Activity Master (${
                                        mc.total_activity_master
                                          ? mc.total_activity_master
                                          : 0
                                      })`}
                                    </span>
                                  </td>
                                  <td className={s.cc}>
                                    <i
                                      className={`fas fa-list pointer ${s.bigEdit}`}
                                    />
                                  </td>
                                </tr>
                                {subComponentList.data.length > 0 &&
                                  item.unique_code ===
                                    subComponentList.schemeid &&
                                  mc.major_component_id ===
                                    subComponentList.majorcomponentid &&
                                  subComponentList.data.map((scc, idx) => {
                                    return (
                                      <Fragment>
                                        <tr
                                          key={`trow_${scc.sub_component_id}`}
                                          className={`${s.crow} pointer`}
                                          onClick={() =>
                                            levelThreeDrill(
                                              item.unique_code,
                                              scc.major_component_id,
                                              scc.sub_component_id
                                            )
                                          }
                                        >
                                          <td
                                            className={s.cc}
                                            style={{
                                              color: "#c8c8c8",
                                              opacity: 0.3,
                                            }}
                                          >
                                            {scc.scheme_name}
                                          </td>
                                          <td
                                            className={s.cc}
                                            style={{
                                              color: "#c8c8c8",
                                              opacity: 0.3,
                                            }}
                                          >
                                            {scc.major_component}
                                          </td>
                                          <td className={s.cc}>
                                            {scc.sub_component}
                                          </td>
                                          <td className={s.cc}>
                                            <span className="badge badge-success">
                                              {`Activity Master (${
                                                scc.total_activity_master
                                                  ? scc.total_activity_master
                                                  : 0
                                              })`}
                                            </span>
                                          </td>
                                          <td className={s.cc}>
                                            <i
                                              className={`fas fa-list pointer ${s.bigEdit}`}
                                            />
                                          </td>
                                        </tr>
                                        {activityMasterList.data.length > 0 &&
                                          item.unique_code ===
                                            activityMasterList.schemeid &&
                                          scc.major_component_id ===
                                            activityMasterList.majorcomponentid &&
                                          scc.sub_component_id ===
                                            activityMasterList.subcomponentid &&
                                          activityMasterList.data.map(
                                            (aml, idx) => {
                                              return (
                                                <Fragment>
                                                  <tr
                                                    key={`trow_${aml.activity_master_id}`}
                                                    className={`${s.crow} pointer`}
                                                  >
                                                    <td
                                                      className={s.cc}
                                                      style={{
                                                        color: "#c8c8c8",
                                                        opacity: 0.3,
                                                      }}
                                                    >
                                                      {aml.scheme_name}
                                                    </td>
                                                    <td
                                                      className={s.cc}
                                                      style={{
                                                        color: "#c8c8c8",
                                                        opacity: 0.3,
                                                      }}
                                                    >
                                                      {aml.major_component}
                                                    </td>
                                                    <td
                                                      className={s.cc}
                                                      style={{
                                                        color: "#c8c8c8",
                                                        opacity: 0.3,
                                                      }}
                                                    >
                                                      {aml.sub_component}
                                                    </td>
                                                    <td className={s.cc}>
                                                      {aml.activity_master_name}
                                                    </td>
                                                    <td className={s.cc}>
                                                      <i
                                                        className={`fas fa-list pointer ${s.bigEdit}`}
                                                      />
                                                    </td>
                                                  </tr>
                                                </Fragment>
                                              );
                                            }
                                          )}
                                        {/* activity end */}
                                      </Fragment>
                                    );
                                  })}
                              </Fragment>
                            );
                          })}
                      </Fragment>
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <h1>No Data Found</h1>
          )}
        </div>
      </div>
    </div>
  );
};
export default Index;
