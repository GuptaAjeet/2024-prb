import React, { useEffect, useState } from "react";
import { Helper, Settings, API, Hook } from "../../../apps";
import "../prabandh/spill.css";
import sweetAlert from "../../../apps/utilities/sweetalert";
import model from "../../../apps/utilities/model";
import NumberInput from "../../../apps/components/form/NumberInput";

const SNA = () => {
  let userData = Helper.auth?.user;
  const stateList = Hook.useStates();

  const [stateID, setStateID] = useState(userData?.user_state_id || 0);
  const [saved, setSaved] = useState(false);
  
  const [workingRow, setWorkingRow] = useState({});
  const [stateSnaData, setStateSnaData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state-list") {
      setStateID(+value);
    }
  };

  useEffect(() => {
    fetchSavedMonth();
    getStateSnaData();
  }, [stateID]);

  const fetchSavedMonth = () => {
    API.post(
      "api/prabandh/progress-active-month-data",
      { state: stateID },
      (res) => {
        if (res?.data?.length>0) {
          setSelectedMonth(res.data[0]);
          setWorkingRow(prevState=>{return { ...prevState, month_id: res.data[0].month_id}})
        }else{
          setWorkingRow(prevState=>{return { ...prevState, month_id: 0}})
        }
      }
    );
  };

  const getStateSnaData = () => {
    API.post(
      "api/budget/sna-detail", { state_id: stateID },
      (res) => {
        if (res?.data) {
          setStateSnaData([...res.data]);
        }
      }
    );
  };

  const saveHandler = () => {
    // if(!workingRow.fortnight){
    //   sweetAlert.error({ msg: "First Select State!" });
    // }else 
    if(!workingRow.fortnight){
      sweetAlert.error({ msg: "Fortnight is mandatory!" });
    }else if(
      !+workingRow.elementary_non_recuring ||
      !+workingRow.elementary_recuring ||
      !+workingRow.secondary_non_recuring ||
      !+workingRow.secondary_recuring ||
      !+workingRow.teacher_non_recuring ||
      !+workingRow.teacher_recuring
    ){
      sweetAlert.error({ msg: "Please fill all Fields are mandatory!" });
    }else{
      setSaved(true);
      API.post(`api/budget/save-sna-detail`, {state_id:stateID, ...workingRow}, 
        (res) => {
          if (res.status) {
            setWorkingRow(prevState=>{
              return {
                ...prevState, 
                "elementary_recuring": "",
                "elementary_non_recuring": "",
                "secondary_recuring": "",
                "teacher_recuring": "",
                "teacher_non_recuring": "",
                "secondary_non_recuring": "",
                "fortnight": ""
              }
            });
            setSaved(false);
            sweetAlert.done({ msg: "Data saved successfully." });
            getStateSnaData()
          }
        }
      );
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{ display: "inline-block" }}>Single Nodal Account - Fortnight Fund status</h1>
      </div>

      {Settings.isNationalUser() && <div
          className="dashboard-main-content-info mb-3 mt-3"
          id="search"
          style={{ backgroundColor: "rgb(43 74 145)" }}
        >
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12">
            <h6 className="text-white">LOCATION FILTER</h6>
            <div className="row">
              {Settings.isNationalUser() &&
                stateList &&
                stateList.length > 0 && (
                  <div className="col-md-5">
                    <select
                      className="form-select"
                      name="state-list"
                      value={stateID}
                      onChange={handleChange}
                      // disabled={
                      //   stateList.find(
                      //   (state) => state.id === userData.user_state_id
                      // )}
                    >
                      <option value={0}>--Select State--</option>
                      {[23].includes(userData.user_role_id)
                        ? stateList
                          .filter((item1) =>
                            userData?.state_ids?.some(
                              (item2) => item1?.id === item2?.id
                            )
                          )
                          .map((st, stidx) => (
                            <option key={`st_${stidx}`} value={st.id}>
                              {st.name}
                            </option>
                          ))
                        : stateList?.map((st, stidx) => (
                          <option key={`st_${stidx}`} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>}

      <div className="dashboard-main-content-info" >
        <div className="row">
          <div className="table-scroll-section">
            <table className="table-scroll">
              <thead>
                <tr>
                  <th rowSpan={2}>S. No.</th>
                  <th rowSpan={2}>Month</th>
                  <th rowSpan={2}>Fortnight</th>
                  <th colSpan={3}>Elementary</th>
                  <th colSpan={3}>Secondary</th>
                  <th colSpan={3}>Teacher</th>
                  <th rowSpan={2}>Action</th>
                </tr>
                <tr>
                  <th>Recuring</th>
                  <th>Non-Recuring</th>
                  <th>Total</th>
                  <th>Recuring</th>
                  <th>Non-Recuring</th>
                  <th>Total</th>
                  <th>Recuring</th>
                  <th>Non-Recuring</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>{model.monthsOfYear.find((m) => m.key === +selectedMonth?.month_id)?.name}</td>
                  <td>
                    <select
                      className="form-select"
                      name="fortnight"
                      value={workingRow.Fortnight}
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    >
                      <option value={0}>Select Fortnight</option>
                      <option value={1}>First</option>
                      <option value={2}>Second</option>
                    </select>
                  </td>
                  <td>
                    <NumberInput
                      // defaultValue={diet["elementary_recuring"] || 0}
                      name="elementary_recuring"
                      defaultValue={workingRow?.elementary_recuring || 0}
                      currentValue={workingRow?.elementary_recuring || 0}
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                      decimal={false}
                    />
                    {/* <input type="number" name="elementary_recuring" value={workingRow?.elementary_recuring} className="form-control text-end" 
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    /> */}
                  </td>
                  <td>
                    <input type="number" name="elementary_non_recuring" value={workingRow?.elementary_non_recuring} className="form-control text-end" 
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    />
                  </td>
                  <td>{(+workingRow.elementary_recuring||0)  + (+workingRow.elementary_non_recuring||0)}</td>
                  <td>
                    <input type="number" name="secondary_recuring" value={workingRow?.secondary_recuring} className="form-control text-end" 
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    />
                  </td>
                  <td>
                    <input type="number" name="secondary_non_recuring" value={workingRow?.secondary_non_recuring} className="form-control text-end" 
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    />
                  </td>
                  <td>{(+workingRow.secondary_recuring||0)  + (+workingRow.secondary_non_recuring||0)}</td>
                  <td>
                    <input type="number" name="teacher_recuring" value={workingRow?.teacher_recuring} className="form-control text-end" 
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    />
                  </td>
                  <td>
                    <input type="number" name="teacher_non_recuring" value={workingRow?.teacher_non_recuring} className="form-control text-end" 
                      onChange={(e)=>{setWorkingRow(prevState=>{return { ...prevState, [e.target.name]: e.target.value}})}}
                    />
                  </td>
                  <td>{(+workingRow.teacher_recuring||0)  + (+workingRow.teacher_non_recuring||0)}</td>
                  <td style={{width: "122px"}}>
                    <button className="btn btn-danger btn-sm me-1" title="Cancel" 
                      onClick={()=>{
                        setWorkingRow(prevState=>{
                          return {
                            ...prevState, 
                            "elementary_recuring": "",
                            "elementary_non_recuring": "",
                            "secondary_recuring": "",
                            "teacher_recuring": "",
                            "teacher_non_recuring": "",
                            "secondary_non_recuring": "",
                            "fortnight": ""
                          }
                        });
                        getStateSnaData();
                      }}
                    >
                        <i className="bi bi-x-circle"></i>
                    </button>
                    <button className="btn btn-success btn-sm" title="Save Record(s)" disabled={saved} onClick={saveHandler}>
                        <i className="bi bi-save"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mt-3">
          <div className="table-scroll-section">
            <table className="table-scroll">
              <thead>
                <tr>
                  <th rowSpan={2}>S. No.</th>
                  <th rowSpan={2}>Month</th>
                  <th rowSpan={2}>Fortnight</th>
                  <th colSpan={3}>Elementary</th>
                  <th colSpan={3}>Secondary</th>
                  <th colSpan={3}>Teacher</th>
                </tr>
                <tr>
                  <th>Recuring</th>
                  <th>Non-Recuring</th>
                  <th>Total</th>
                  <th>Recuring</th>
                  <th>Non-Recuring</th>
                  <th>Total</th>
                  <th>Recuring</th>
                  <th>Non-Recuring</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {stateSnaData.map((sna, i)=><tr key={i}>
                  <td>{i+1}</td>
                  <td>{model.monthsOfYear.find((m) => m.key === +sna?.month_id)?.name}</td>
                  <td>{sna.fortnight===1? "First" : "Second"} Fortnight</td>
                  <td className="text-end">{sna.elementary_recuring}</td>
                  <td className="text-end">{sna.elementary_non_recuring}</td>
                  <td className="text-end">{sna.elementary_total}</td>
                  <td className="text-end">{sna.secondary_recuring}</td>
                  <td className="text-end">{sna.secondary_non_recuring}</td>
                  <td className="text-end">{sna.secondary_total}</td>
                  <td className="text-end">{sna.teacher_recuring}</td>
                  <td className="text-end">{sna.teacher_non_recuring}</td>
                  <td className="text-end">{sna.teacher_total}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default SNA;
