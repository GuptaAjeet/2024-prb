import React, { useState, useEffect } from "react";
import { Modal } from "../../../../apps/components/elements";
import { API } from "../../../../apps";

const SelectActivity = (props) => {
  const { activity_ids, handleChange } = props;

  const [majorCompSubCompActivityList, SetMajorCompSubCompActivityList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(activity_ids ? activity_ids : []);

  useEffect(() => {
    getMajorCompSubCompActivityList();
  }, []);

  const getMajorCompSubCompActivityList = () => {
    API.post("api/prabandh/majorComp-subComp-activity-list", { data: "ABCD" }, (res) => {
      SetMajorCompSubCompActivityList(res.data);
    });
  };

  const handleActivitySelection = (e, item) => {
    if (e.target.checked) {
      setSelectedActivity(prevState => [...prevState, item])
      props.setActivity_ids(prevState => [...prevState, item])
    } else {
      setSelectedActivity(prevState => [...prevState.filter(act => act.id.toString() !== item.id.toString())])
      props.setActivity_ids(prevState => [...prevState.filter(act => act.id.toString() !== item.id.toString())])
    }
  }

  return (
    <Modal close={props?.close} size="xl">
      <div className="row">
        {<div className="col-md-12"><h5>Elementary Education</h5>
          <div style={{ overflowY: "auto", maxHeight: "210px", minHeight: "200px" }} ><table className="table border mb-2">
            <thead>
              <tr>
                <th>
                  <input type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedActivity(prevState => [...prevState.filter((item) => +item.scheme_id !== 1), ...majorCompSubCompActivityList.filter((item) => +item.scheme_id === 1)])
                      } else {
                        setSelectedActivity(prevState => [...prevState.filter((item) => +item.scheme_id !== 1)])
                      }
                    }}
                  />
                </th>
                <th style={{ minWidth: "160px" }}>Major Component</th>
                <th>Sub Component</th>
                <th>Activity Master</th>
                <th>Activity Master Detail</th>
              </tr>
            </thead>
            <tbody>
              {majorCompSubCompActivityList.filter((item) => +item.scheme_id === 1).map(item => <tr>
                <td><input type="checkbox" value={item.activity_master_id} checked={props.fetchedActivities.find(act => +act.activity_detail_id === +item.id)}
                  onChange={(e) => { handleActivitySelection(e, item)}}
                /></td>
                <td>{item.major_component_name}</td>
                <td>{item.sub_component_name}</td>
                <td>{item.activity_master_name}</td>
                <td>{item.activity_master_details_name}</td>
              </tr>)}
            </tbody>
          </table></div>
        </div>}

        {<div className="col-md-12 mt-2"><h5>Secondary Education</h5>
          <div style={{ overflowY: "auto", maxHeight: "210px", minHeight: "200px" }} ><table className="table border mb-2">
            <thead>
              <tr>
                <th>
                  <input type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedActivity(prevState => [...prevState.filter((item) => +item.scheme_id !== 2), ...majorCompSubCompActivityList.filter((item) => +item.scheme_id === 2)])
                      } else {
                        setSelectedActivity(prevState => [...prevState.filter((item) => +item.scheme_id !== 2)])
                      }
                    }}
                  />
                </th>
                <th style={{ minWidth: "160px" }}>Major Component</th>
                <th>Sub Component</th>
                <th>Activity Master</th>
                <th>Activity Master Detail</th>
              </tr>
            </thead>
            <tbody>
              {majorCompSubCompActivityList.filter((item) => +item.scheme_id === 2).map(item => <tr>
                <td><input type="checkbox" value={item.activity_master_id} checked={props.fetchedActivities.find(act => +act.activity_detail_id === +item.id)}
                  onChange={(e) => { handleActivitySelection(e, item)}}
                /></td>
                <td>{item.major_component_name}</td>
                <td>{item.sub_component_name}</td>
                <td>{item.activity_master_name}</td>
                <td>{item.activity_master_details_name}</td>
              </tr>)}
            </tbody>
          </table>
          </div></div>}

        {<div className="col-md-12 mt-2"><h5>Teacher Education</h5>
          <div style={{ overflowY: "auto", maxHeight: "210px", minHeight: "200px" }}><table className="table border mb-2">
            <thead>
              <tr>
                <th>
                  <input type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedActivity(prevState => [...prevState.filter((item) => +item.scheme_id !== 3), ...majorCompSubCompActivityList.filter((item) => +item.scheme_id === 3)])
                      } else {
                        setSelectedActivity(prevState => [...prevState.filter((item) => +item.scheme_id !== 3)])
                      }
                    }}
                  />
                </th>
                <th style={{ minWidth: "160px" }}>Major Component</th>
                <th>Sub Component</th>
                <th>Activity Master</th>
                <th>Activity Master Detail</th>
              </tr>
            </thead>
            <tbody>
              {majorCompSubCompActivityList.filter((item) => +item.scheme_id === 3).map(item => <tr>
                <td><input type="checkbox" value={item.activity_master_id} checked={props.fetchedActivities.find(act => +act.activity_detail_id === +item.id)}
                  onChange={(e) => { handleActivitySelection(e, item)}}
                /></td>
                <td>{item.major_component_name}</td>
                <td>{item.sub_component_name}</td>
                <td>{item.activity_master_name}</td>
                <td>{item.activity_master_details_name}</td>
              </tr>)}
            </tbody>
          </table></div>
        </div>}

        <div className="col-md-12 text-end">
          <button type="button" className="btn btn-success"
            onClick={() => {
              handleChange(selectedActivity, `activity${props.selectedKey}${props.selectedIndex}`);
              props?.close();
            }}
          >Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default SelectActivity;