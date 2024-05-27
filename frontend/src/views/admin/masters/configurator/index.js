import React, { useEffect, useState } from "react";
import { Hook, Table, Helper, API, Column } from "../../../../apps";
import { useSelector, useDispatch } from "react-redux";
import Features from "../../../../redux/features";
// import api from "../../../../apps/utilities/api";

const Configurator = () => {
  // const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);
  // const [versionValue, setVersionValue] = useState("");

  useEffect(() => {
    dispatch(Features.makeHandler({ page: 1, limit: 10 }));
  }, []);

  // const object    =   Hook.usePost({url :"api/states",data : {
  //     'page':handler.page,'limit':handler.limit,'reload':handler.reload
  // }});
  const object = Hook.usePost({
    url: "api/states/prabandhdata",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
    },
  });
  const schemes = Hook.usePost({
    url: "api/states/major-components",
    data: {
      data: "send",
    },
  });

  let rows = [];
  // console.log(schemes,'86745')
  // const editHandler   = (e) =>{
  //     setId(e.currentTarget.getAttribute('data-id'));
  //     dispatch(showModal({title:'Update State'}));
  // }

  const statusHandler = (e) => {
    dispatch(Features.showLoader());
    API.post(
      "api/prabandh-data",
      { id: e.currentTarget.getAttribute("data-id") },
      (response) => {
        dispatch(Features.makeHandler({ reload: new Date().getTime() }));
        dispatch(Features.showToast({ message: response.message }));
      }
    );
  };

  if (object !== null && object.data !== undefined) {
    object.data.map((row, i) => {
      return (rows[i] = {
        srl: Helper.counter(++i, handler.limit, handler.page),
        sub_component: row.sub_component,
        activity_master_name: row.activity_master_name,
        activity_master_details: row.activity_master_details,
        // 'activity_master_details':<div className="text-center"><i className={`fa-regular fa-square-check ${(row.district_status === 1) ? 'text-success' :'text-danger'}`} onClick={statusHandler} key={i} data-id={row.id} ></i></div>,
        norms: row.norms,
        criteria_for_appraisal: row.criteria_for_appraisal,
        // 'action':<div className="text-center"><i key={i} className="fa-solid fa-pen text-warning" data-id={row.id} ></i></div>
      });
    });
  }
  // console.log( object.data,'545')
  return (
    <div className="row layout-top-spacing">
      <div className="dropdown text-end mb-3 ">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Schemes
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <a className="dropdown-item" href="#">
              Action
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Another action
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              type="button"
              id="dropdownMenuButton2"
            >
              Something else here
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      {/* <div >
              <select id='vSelect' value={versionGet} onChange={(pageURL == "/admin/dashboard")?props.ver.ver.ver:null} className="dropdownV">
                <option value={0} >Select Version</option>
                {
                  val.map((l,idx)=>{
                    return <option value={idx +1} selected={idx +1 === versionValue}
                        key={idx}>{l}</option>;
                  })
                }
              </select>
            </div> */}
      {/* <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
            <span className="caret"></span></button>
            <ul className="dropdown-menu">
                <li><a href="#">HTML</a></li>
                <li><a href="#">CSS</a></li>
                <li><a href="#">JavaScript</a></li>
            </ul>
        </div>  */}

      <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
        {object && (
          <Table
            object={{
              columns: Column.prabandhData(),
              data: rows,
              count: object.count,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Configurator;
