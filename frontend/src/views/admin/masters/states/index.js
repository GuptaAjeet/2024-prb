import React, { lazy, useEffect, useRef, useState } from "react";
import { Hook, Table, Helper, API, Column } from "../../../../apps";
import { useSelector, useDispatch } from "react-redux";
import Features from "../../../../redux/features";
import Form from "../../../../apps/components/form";

const View = lazy(() => import("./operate"));

const States = () => {
  const percentage = useRef();
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);
  const reduxObj = useSelector((state) => state.modal);
  const [fSubmit, setFSubmit] = useState(false);

  useEffect(() => {
    dispatch(Features.makeHandler({ page: 1, limit: 10 }));
  }, []);

  const object = Hook.usePost({
    url: "api/states",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
    },
  });
  // console.log(object,"sda")
  let rows = [];

  const editHandler = (e) => {
    setId(e.currentTarget.getAttribute("data-id"));
    dispatch(Features.showModal({ title: "Update State" }));
  };
  const submitHandler = () => {
    API.post("api/states/update", { percentage: percentage }, (response) => {});
  };
  const stateChangeHandler = (state) => {
    // console.log(state,percentage.current)
  };
  const statusHandler = (e) => {
    dispatch(Features.showLoader());
    API.post(
      "api/states/update-status",
      { id: e.currentTarget.getAttribute("data-id") },
      (response) => {
        dispatch(Features.makeHandler({ reload: new Date().getTime() }));
        dispatch(Features.showToast({ message: response.message }));
      }
    );
  };
  // console.log(percentage.current,'ty')
  if (object !== null) {
    object.data.map((row, i) => {
      return (rows[i] = {
        srl: Helper.counter(++i, handler.limit, handler.page),
        state_name: row.state_name,
        state_status: (
          <div className="col-md-6 mb-4">
            {" "}
            <Form.Text
              attr={{
                ref: percentage,
                id: "percentage",
                onchange: stateChangeHandler(row.state_name),
              }}
              mandatory="true"
            />{" "}
          </div>
        ),
        // 'state_status':<div className="text-center"><i className={`fa-regular fa-square-check ${(row.state_status === 1) ? 'text-success' :'text-danger'}`} onClick={statusHandler} key={i} data-id={row.id} ></i></div>,
        // 'action':<div className="text-center"><i key={i} className="fa-solid fa-pen text-warning" onClick={editHandler} data-id={row.id} ></i></div>
      });
    });
  }
  <div className="col-md-6 mb-4"></div>;
  return (
    <div className="row layout-top-spacing">
      <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
        {object !== null && (
          <Table
            object={{
              columns: Column.state(),
              data: rows,
              count: object.count,
            }}
          />
        )}
      </div>
      <Form.Button
        button={{ type: "submit", onClick: submitHandler }}
        className="btn btn-success float-end"
        fSubmit={fSubmit}
      >
        Save
      </Form.Button>
      {reduxObj.view && <View id={id} />}
    </div>
  );
};

export default States;
