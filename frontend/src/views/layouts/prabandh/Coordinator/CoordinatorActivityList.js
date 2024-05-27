import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helper, API } from "../../../../apps";
import "../spill.css";

const CoordinatorActivityList = () => {
  const user = Helper.auth.user;
  const [tableFilter, setTableFilter] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [stateObj, setStateObj] = useState(0);
  const [statusForAction, setStatusForAction] = useState(0);

  const location = useLocation();
  const [coordinattorActivityListParams] = useState(() => location.state);
  const [stateID, setStateID] = useState(
    coordinattorActivityListParams?.proposal_form_params?.stateObject?.id || 0
  );

  useEffect(() => {
    API.post("api/states/coordinator-state-list", { user }, (res) => {
      setStateList(res.data);
    });

    if (stateID !== 0) {
      API.post("api/prabandh/national-coordinator-form-acitivity-list",
        {
          user: user,
          user_id: user.id,
          user_role_id: user.user_role_id,
          activity_group_code: user.activity_group_code,
          state_id: stateID || 0,
        },
        (res) => {
          setTableFilter(res.data.rows);
          setStatusForAction(+res?.status_for_action ?? 0);
        }
      );
      setStateObj({
        id: stateID,
        name: coordinattorActivityListParams?.proposal_form_params?.stateObject?.name,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setStateID(e.target.value);
    setStateObj({
      id: e.target.value,
      name: e.target.selectedOptions[0].innerText,
    });
   
    API.post("api/prabandh/national-coordinator-form-acitivity-list",
      {
        user: user,
        user_id: user.id,
        user_role_id: user.user_role_id,
        activity_group_code: user.activity_group_code,
        state_id: e.target.value || 0,
      },
      (res) => {
        setTableFilter(res.data.rows);
        setStatusForAction(+res?.status_for_action ?? 0);
      }
    );
  };
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content-info mb-3 mt-3" id="search" style={{ backgroundColor: "rgb(43 74 145)" }}>
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12">
            <h6 className="text-white">STATE FILTER</h6>
            <div className="row">
              <div className="col-md-5">
                <select className="form-select" name="state-list" onChange={handleChange} value={stateID}>

                  <option value={0}>State (All)</option>
                  {stateList.map((st, stidx) => (
                    <option key={`st_${stidx}`} value={st.state_id}>
                      {st.state_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content-info table-container mt-3 table-responsive">
        <table
          cellPadding={5}
          cellSpacing={5}
          style={{ textAlign: "left" }}
          className="text-black mt-2 mb-2 "
        >
          <tbody>
            <tr>
              <td style={{ background: "#ffdb4d" }}>
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </td>
              <td>
                {" "}
                <em>Pending With Intervention Consultant</em>{" "}
              </td>
              <td style={{ background: "#ff944d" }}>
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </td>
              <td>
                {" "}
                <em>Pending With Financial Consultant</em>{" "}
              </td>
              <td style={{ background: "#4e94fd" }}>
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </td>
              <td>
                {" "}
                <em>Pending With State Coordinator</em>{" "}
              </td>
              <td style={{ background: "#68e3aa" }}>
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </td>
              <td>
                {" "}
                <em>Approved By State Coordinator</em>{" "}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Scheme</th>
              <th>Major Component</th>
              <th>Sub Component</th>
              <th>Activity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableFilter.map((item, i) => (
              <tr key={i} onClick={() => { }}
                // className={`status-${(item.activitiesfreez===item.activitiesall && !!item.activitiesall && item.activitiesall!=="0") ? 2 : item.status}`}
                className={`status-${
                  +item.activitistatus - 1 === 0 ? 1 : +item.activitistatus - 1
                }`}
              >
                <td>{i + 1}</td>
                <td>{item.scheme_name}</td>
                <td>{item.major_component_name}</td>
                <td>{item.sub_component_name}</td>
                <td>{item.activity_master_name}</td>
                <td>
                  {+statusForAction === 6 && (
                    <Link to="/auth/prabandh/plan/national/proposal-form" state={{ data: item, stateObject: stateObj }}>
                      <div className="fill_plan_edit_icon">
                        <i className="bi bi-pencil-square text-primary fill_plan_edit_hover"></i>
                      </div>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinatorActivityList;